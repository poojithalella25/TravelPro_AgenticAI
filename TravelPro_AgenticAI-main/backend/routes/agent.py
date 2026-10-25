import os
import re
from fastapi import APIRouter, HTTPException, status
from backend.models.schemas import AgentPlanRequest, AgentReplanRequest, AgentOptimizeRequest, AgentAssistantRequest
from backend.graph.travel_graph import travel_graph
from typing import Dict, Any, List

router = APIRouter(prefix="/api/agent", tags=["Agent Operations"])


# Check for LLM key
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "llama3-70b-8192")

def parse_replan_instruction(instruction: str, current_state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parses a natural language instruction to modify a trip.
    Uses regex/keyword rules (or LLM if keys were set, but rules are robust).
    """
    state_updates = {}
    inst_lower = instruction.lower()
    
    # 1. Budget extraction
    # look for numbers like 15000, 15,000, 20k, 20,000 etc.
    numbers = re.findall(r'₹?\s*(\d+[\d,]*)\s*(?:thousand|k)?', inst_lower)
    if numbers:
        # Check if "budget" or "rupees" is in context
        val_str = numbers[0].replace(",", "")
        try:
            val = float(val_str)
            # handle '15k' or '15 thousand'
            if "k" in inst_lower or "thousand" in inst_lower:
                if val < 1000:
                    val *= 1000
            if val > 100:  # ignore trivial numbers
                state_updates["budget"] = val
        except ValueError:
            pass

    # 2. Hotel preferences
    if "better hotel" in inst_lower or "luxury hotel" in inst_lower or "premium hotel" in inst_lower:
        state_updates["hotel_pref"] = "Premium"
    elif "cheaper hotel" in inst_lower or "budget hotel" in inst_lower or "cheap hotel" in inst_lower:
        state_updates["hotel_pref"] = "Budget"

    # 3. Transport preferences
    if "flight" in inst_lower or "plane" in inst_lower:
        state_updates["transport_pref"] = "Flight"
    elif "train" in inst_lower:
        state_updates["transport_pref"] = "Train"
    elif "bus" in inst_lower:
        state_updates["transport_pref"] = "Bus"
    elif "car" in inst_lower or "cab" in inst_lower:
        state_updates["transport_pref"] = "Car"

    # 4. Interest adjustments
    interests = list(current_state.get("interests", []))
    if "history" in inst_lower or "historical" in inst_lower:
        if "Historical" not in interests:
            interests.append("Historical")
    if "food" in inst_lower or "eat" in inst_lower or "culinary" in inst_lower:
        if "Food" not in interests:
            interests.append("Food")
    if "shopping" in inst_lower:
        if "Shopping" not in interests:
            interests.append("Shopping")
    if "nature" in inst_lower:
        if "Nature" not in interests:
            interests.append("Nature")
    if "adventure" in inst_lower:
        if "Adventure" not in interests:
            interests.append("Adventure")
            
    if "remove shopping" in inst_lower or "no shopping" in inst_lower:
        interests = [i for i in interests if i != "Shopping"]
    if "remove food" in inst_lower or "no food" in inst_lower:
        interests = [i for i in interests if i != "Food"]
        
    state_updates["interests"] = interests

    # 5. Itinerary pacing adjustments (e.g. "make day 2 less busy")
    if "less busy" in inst_lower or "relax" in inst_lower:
        # Detect which day (defaults to Day 2 or all days)
        day_match = re.search(r'day\s*(\d+)', inst_lower)
        target_day = int(day_match.group(1)) if day_match else 2
        
        state_updates["less_busy_day"] = target_day
        
    return state_updates

@router.post("/plan")
async def plan_trip(request: AgentPlanRequest):
    # Initialize LangGraph state dictionary
    initial_state = {
        "start_location": request.start_location,
        "destination": request.destination,
        "budget": request.budget,
        "start_date": request.start_date,
        "end_date": request.end_date,
        "travelers": request.travelers,
        "interests": request.interests if request.interests else ["Historical", "Food"],
        "style": request.style,
        "transport_pref": request.transport_pref,
        "hotel_pref": request.hotel_pref,
        
        "num_days": 3,
        "extracted_interests": [],
        "transport_options": [],
        "selected_transport": None,
        "hotel_options": [],
        "selected_hotel": None,
        "attractions": [],
        "weather_forecast": [],
        "itinerary": [],
        "budget_breakdown": {},
        "logs": ["Orchestrator: Initializing planning workspace."],
        "validation_logs": [],
        "is_valid": True,
        "retry_count": 0,
        "error_message": None,
        "suggested_adjustments": None
    }
    
    try:
        final_state = await travel_graph.ainvoke(initial_state)
        return final_state
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent Planning failed: {str(e)}"
        )

@router.post("/svg-visual")
async def generate_svg_visual(request: Dict[str, Any]):
    """Asynchronous endpoint for svgAgent visual map generation (non-blocking)."""
    start_loc = request.get("start_location", "Start Location")
    dest = request.get("destination", "Destination")
    num_days = request.get("num_days", 3)
    
    svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 140" width="100%" height="140">
      <defs>
        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#d9261c" />
          <stop offset="100%" stop-color="#ef4444" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" rx="16" fill="#fee2e2" stroke="#d9261c" stroke-width="2"/>
      <path d="M 80 70 Q 400 15 720 70" fill="none" stroke="url(#routeGrad)" stroke-width="4" stroke-dasharray="6 4"/>
      <circle cx="80" cy="70" r="10" fill="#d9261c"/>
      <circle cx="720" cy="70" r="10" fill="#d9261c"/>
      <text x="80" y="105" font-family="sans-serif" font-weight="900" font-size="13" fill="#000" text-anchor="middle">{start_loc}</text>
      <text x="720" y="105" font-family="sans-serif" font-weight="900" font-size="13" fill="#000" text-anchor="middle">{dest}</text>
      <text x="400" y="40" font-family="sans-serif" font-weight="900" font-size="12" fill="#d9261c" text-anchor="middle">📍 {num_days}-Day Visual Route Map (svgAgent)</text>
    </svg>"""
    return {"svg_map": svg_code}


@router.post("/replan")
async def replan_trip(request: AgentReplanRequest):
    current_state = request.trip_data
    instruction = request.instruction
    
    # 1. Parse natural language inputs into concrete updates
    updates = parse_replan_instruction(instruction, current_state)
    
    # Apply updates to state
    new_state = current_state.copy()
    for k, v in updates.items():
        new_state[k] = v
        
    # Reset processing parameters for re-run
    new_state["retry_count"] = 0
    new_state["logs"] = list(current_state.get("logs", []))
    new_state["logs"].append(f"User Request: '{instruction}'")
    new_state["logs"].append("Orchestrator: Modification request parsed. Re-triggering planner flow.")
    
    # If the user asked to make a day "less busy", handle it specifically
    less_busy_day = updates.get("less_busy_day")
    
    try:
        final_state = await travel_graph.ainvoke(new_state)
        
        # Manually prune itinerary day if "less busy" was requested
        if less_busy_day and "itinerary" in final_state:
            itin = final_state["itinerary"]
            for day in itin:
                if day["day"] == less_busy_day:
                    # Filter out one activity from Day X (leaves breakfast, lunch, dinner, plus at most 1 visit instead of 2)
                    schedule = day["schedule"]
                    visit_indices = [i for i, act in enumerate(schedule) if "Visit" in act["activity"]]
                    if len(visit_indices) > 1:
                        # remove the second visit
                        del schedule[visit_indices[1]]
                        # add a leisure walk instead
                        schedule.insert(visit_indices[1], {"time": "03:00 PM", "activity": "Relaxed leisure walk", "details": "Spend the afternoon relaxing at the hotel or taking a gentle walk around."})
                        final_state["logs"].append(f"Orchestrator: Trimmed schedules on Day {less_busy_day} to make it less busy.")
                        
        return final_state
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent Replanning failed: {str(e)}"
        )

@router.post("/optimize")
async def optimize_trip(request: AgentOptimizeRequest):
    current_state = request.trip_data
    objective = request.objective
    
    new_state = current_state.copy()
    new_state["style"] = objective
    new_state["retry_count"] = 0
    
    # Adjust preferences based on optimize goal
    if objective == "Cheapest":
        new_state["transport_pref"] = "Train"
        new_state["hotel_pref"] = "Budget"
    elif objective == "Comfortable":
        new_state["transport_pref"] = "Flight"
        new_state["hotel_pref"] = "Premium"
        
    new_state["logs"] = list(current_state.get("logs", []))
    new_state["logs"].append(f"User Request: Optimize trip layout for '{objective}' style.")
    
    try:
        final_state = await travel_graph.ainvoke(new_state)
        return final_state
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent Optimization failed: {str(e)}"
        )

# --- WEBSITE AI ASSISTANT (STRICT WEBSITE KNOWLEDGE SCOPE) ---

WEBSITE_SYSTEM_PROMPT = """You are the official AI Website Assistant for Travel Pro (TravelPro AI).
STRICT OPERATIONAL DIRECTIVE:
You are ONLY allowed to answer questions regarding this website (Travel Pro), its pages, navigation, features, trip planning tools, saved itineraries, user profile settings, and project architecture.

If the user asks ANY question not related to this website (such as general trivia, coding, math, recipes, news, or non-website topics), YOU MUST DECLINE to answer and state:
"I am the Travel Pro Website Assistant. I am strictly specialized in answering questions about this website (Travel Pro), its pages, navigation, and features. How can I assist you with using Travel Pro today?"

WEBSITE STRUCTURE & PAGES TO REFERENCE:
1. Home / Landing Page (`/`): Explore 36+ Indian States & UTs, popular tour packages (Golden Triangle, Kerala, Kashmir, Rajasthan, Goa), seasonal destination filters, and interactive state modals.
2. Login (`/login`) & Register (`/register`): User authentication with email & password, session management, and quick demo credentials.
3. Dashboard & Saved Trips (`/dashboard`, `/saved-trips`): View user profile summary, total saved itineraries, budget statistics, delete saved trips, and review past plans.
4. Create Trip (`/create-trip`): Step-by-step form to plan an AI trip (Starting location, destination, travel dates, budget in INR, number of travelers, interests like Historical/Food/Nature/Adventure/Shopping, hotel preference Budget/Standard/Premium, transport preference Flight/Train/Bus/Car).
5. Agent Planning Status (`/planning`): Real-time monitor displaying LangGraph AI agent execution logs (orchestration, weather fetch, transport/hotel search, budget validation).
6. Trip Result & Itinerary (`/trip-result`): Customized itinerary with day-by-day schedules, hotel & transport options, weather forecast, budget breakdown, interactive budget optimization (Cheapest / Comfortable), and natural language re-planner (e.g. "make Day 2 less busy").
7. Profile Settings (`/profile`): Update user profile details, default travel preferences, dark/light theme, notification toggles, logout.
"""

def get_website_knowledge_response(user_msg: str) -> Dict[str, Any]:
    msg = user_msg.strip().lower()
    
    # 1. Check for off-topic / non-website query keywords
    off_topic_indicators = [
        "recipe", "cook", "python", "javascript", "code", "who is", "president", "capital of france",
        "solve", "equation", "math", "football", "cricket match", "quantum", "alien", "movie", "song",
        "joke", "weather in london", "tell me a story"
    ]
    # Check if query is explicitly off-topic without mentioning website keywords
    website_keywords = ["page", "website", "site", "travel", "trip", "plan", "dashboard", "saved", "login", "register", "profile", "hotel", "transport", "budget", "replan", "route", "landing", "app", "travelpro", "feature", "navigate", "where", "how"]
    
    has_website_context = any(kw in msg for kw in website_keywords)
    has_off_topic_context = any(ot in msg for ot in off_topic_indicators)

    if has_off_topic_context and not has_website_context:
        return {
            "reply": "I am the Travel Pro Website Assistant. I am strictly specialized in answering questions about this website (Travel Pro), its pages, navigation, and features. How can I assist you with using Travel Pro today?",
            "links": []
        }

    # 2. Page & Navigation queries
    if any(kw in msg for kw in ["what page", "all pages", "list pages", "pages are there", "where can i go", "sitemap", "navigation", "routes"]):
        return {
            "reply": "Here are all the main pages available on Travel Pro:\n\n"
                     "1. 🏠 **Landing Page (`/`)**: Explore 36+ Indian States & UTs, featured packages, seasonal destinations, and state details.\n"
                     "2. 🔐 **Login & Register (`/login`, `/register`)**: Access your account or create a new one with custom travel preferences.\n"
                     "3. 📊 **Dashboard & Saved Trips (`/dashboard`, `/saved-trips`)**: Manage saved itineraries, view budget stats, and delete old trips.\n"
                     "4. ✈️ **Create Trip (`/create-trip`)**: Multi-step AI generator to set destination, budget, dates, travel style, transport & hotel tier.\n"
                     "5. ⏱️ **Planning Screen (`/planning`)**: Live LangGraph AI Agent execution progress monitor.\n"
                     "6. 🗺️ **Trip Result & Itinerary (`/trip-result`)**: Full day-by-day itinerary, budget optimizer, weather forecast, and AI replanner.\n"
                     "7. ⚙️ **Profile Settings (`/profile`)**: Manage your VIP traveler preferences, theme, notifications, and logout.",
            "links": [
                {"label": "Go to Home Page", "path": "/"},
                {"label": "Go to Create Trip", "path": "/create-trip"},
                {"label": "Go to Dashboard", "path": "/dashboard"},
                {"label": "Go to Profile Settings", "path": "/profile"}
            ]
        }

    # 3. How to plan a trip
    if any(kw in msg for kw in ["plan", "create trip", "new trip", "make itinerary", "generate", "start planning", "how to use"]):
        return {
            "reply": "To plan a new AI-powered trip on Travel Pro:\n\n"
                     "1. Go to the **Create Trip** page (`/create-trip`).\n"
                     "2. Enter your **Starting Location** and **Destination** (choose from 20+ top Indian cities or enter your own).\n"
                     "3. Pick your **Travel Dates**, **Total Budget (₹ INR)**, and **Number of Travelers**.\n"
                     "4. Select your **Interests** (Historical, Food, Nature, Adventure, Shopping) and your preferred **Transport** & **Hotel Tier**.\n"
                     "5. Click **Generate Autonomous Itinerary** to launch our LangGraph AI Agent!",
            "links": [
                {"label": "Open Create Trip Page", "path": "/create-trip"}
            ]
        }

    # 4. Saved trips / Dashboard
    if any(kw in msg for kw in ["saved", "dashboard", "history", "past trips", "my trips", "view trips"]):
        return {
            "reply": "You can view all your saved travel plans in your **Dashboard & Saved Trips** page (`/dashboard` or `/saved-trips`).\n\n"
                     "Features available in Dashboard:\n"
                     "• View complete itinerary details & budget breakdowns.\n"
                     "• Track total estimated spending and destination count.\n"
                     "• Delete trips you no longer need.",
            "links": [
                {"label": "Go to My Dashboard", "path": "/dashboard"},
                {"label": "Go to Saved Itineraries", "path": "/saved-trips"}
            ]
        }

    # 5. Auth / Login / Account
    if any(kw in msg for kw in ["login", "register", "sign in", "sign up", "account", "demo"]):
        return {
            "reply": "Travel Pro provides secure authentication for managing your trip itineraries:\n\n"
                     "• **Login (`/login`)**: Sign in with email and password, or use the **Quick Demo Credentials** button for instant access.\n"
                     "• **Register (`/register`)**: Create a free VIP account and configure your default travel preferences.",
            "links": [
                {"label": "Go to Login", "path": "/login"},
                {"label": "Go to Register", "path": "/register"}
            ]
        }

    # 6. Profile / Settings
    if any(kw in msg for kw in ["profile", "settings", "preference", "theme", "logout"]):
        return {
            "reply": "On the **Profile Settings** page (`/profile`), you can:\n\n"
                     "• Update your default budget, preferred travel style (Balanced, Cheapest, Comfortable, Luxury), and transport modes.\n"
                     "• Toggle UI themes and notification alerts.\n"
                     "• Securely log out of your session.",
            "links": [
                {"label": "Go to Profile Settings", "path": "/profile"}
            ]
        }

    # 7. Replanning / Optimization
    if any(kw in msg for kw in ["replan", "optimize", "cheapest", "comfortable", "less busy", "change budget"]):
        return {
            "reply": "On the **Trip Result** page (`/trip-result`), you have active AI optimization tools:\n\n"
                     "• **Strict Budget Optimizer**: Click 'Cheapest' or 'Comfortable' to automatically reconfigure hotels and transport.\n"
                     "• **Natural Language Re-planner**: Type instructions like *'Make Day 2 less busy'*, *'Switch transport to flight'*, or *'Increase budget to ₹25,000'* to update your itinerary in real time!",
            "links": [
                {"label": "Go to Create Trip", "path": "/create-trip"}
            ]
        }

    # 8. States / Packages / Landing Page
    if any(kw in msg for kw in ["state", "package", "kerala", "goa", "kashmir", "rajasthan", "himalaya", "tour", "explore", "destinations"]):
        return {
            "reply": "On our **Landing Page (`/`)**, you can explore:\n\n"
                     "• **36 Indian States & Union Territories**: Click any state card to view capital, attractions, best travel season, cuisine, and culture.\n"
                     "• **Featured Packages**: Golden Triangle, Kerala Backwaters, Kashmir Valley, Himalayan Adventure, Rajasthan Heritage, and Goa Beach Bliss.\n"
                     "• **Regional & Category Filters**: Filter destinations by North, South, East, West, or categories like Heritage, Wildlife, and Hill Stations.",
            "links": [
                {"label": "Explore Landing Page", "path": "/"}
            ]
        }

    # 9. Tech stack / B.Tech project
    if any(kw in msg for kw in ["tech", "stack", "fastapi", "react", "langgraph", "project", "architecture"]):
        return {
            "reply": "Travel Pro is built with modern web technologies:\n\n"
                     "• **Backend**: FastAPI with Python, Uvicorn server, and custom LangGraph multi-step agent graph.\n"
                     "• **Frontend**: React 19 + TypeScript + Vite with Lucide icons and responsive CSS.\n"
                     "• **AI Intelligence**: LangGraph stateful graph with RAG fallback for weather, hotels, transport, and itineraries.",
            "links": [
                {"label": "Go to Home Page", "path": "/"}
            ]
        }

    # Default website response if no specific keyword matched, but context is about website or general inquiry
    return {
        "reply": "Welcome to **Travel Pro AI Assistant**! I am here to help you navigate and use this website.\n\n"
                 "You can ask me questions about:\n"
                 "• 📍 **Pages & Navigation**: Ask where pages are located.\n"
                 "• ✈️ **Planning Trips**: How to generate an AI itinerary.\n"
                 "• 📊 **Dashboard & Saved Trips**: Viewing past saved plans.\n"
                 "• 🔐 **Account & Login**: Signing in or profile settings.\n"
                 "• 🗺️ **India Destinations**: Exploring 36 States & UTs.\n\n"
                 "What page or feature would you like to explore?",
        "links": [
            {"label": "Show All Pages", "path": "/"},
            {"label": "Create New Trip", "path": "/create-trip"},
            {"label": "View Dashboard", "path": "/dashboard"}
        ]
    }

@router.post("/assistant")
async def website_assistant(request: AgentAssistantRequest):
    user_msg = request.message
    
    # Check if Groq API Key is available
    if GROQ_API_KEY:
        try:
            import groq
            client = groq.Groq(api_key=GROQ_API_KEY)
            
            messages = [{"role": "system", "content": WEBSITE_SYSTEM_PROMPT}]
            for h in request.history[-6:]:
                messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
            messages.append({"role": "user", "content": user_msg})
            
            response = client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                temperature=0.3,
                max_tokens=500
            )
            reply_text = response.choices[0].message.content
            return {"reply": reply_text, "links": []}
        except Exception as e:
            # Fallback to rule engine if LLM fails
            pass
            
    # Standard Rule Engine Response
    res = get_website_knowledge_response(user_msg)
    return res



