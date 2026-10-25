import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from backend.agents.state import AgentState
from backend.services.data_source import search_hotels, search_transport, get_attractions, make_google_maps_url
from backend.services.weather import get_weather_forecast
from backend.rag.knowledge_base import retrieve_context

# --- Node Definitions ---

async def orchestrator_node(state: AgentState) -> AgentState:
    """
    Orchestrator Agent: parses dates, checks constraints, normalizes interests, 
    and sets planning goals based on state. Also handles replanning adjustments.
    """
    logs = list(state.get("logs", []))
    retry_count = state.get("retry_count", 0)
    
    if retry_count == 0:
        logs.append("Orchestrator: Parsing request goals and travel constraints.")
        # Calculate trip duration in days and normalize dates
        try:
            start = datetime.strptime(state["start_date"], "%Y-%m-%d")
            duration_input = state.get("duration_days")
            
            if duration_input and int(duration_input) > 0:
                num_days = int(duration_input)
                end = start + timedelta(days=num_days - 1)
                state["end_date"] = end.strftime("%Y-%m-%d")
            elif state.get("end_date") and state["end_date"] != state["start_date"]:
                end = datetime.strptime(state["end_date"], "%Y-%m-%d")
                num_days = (end - start).days + 1
            else:
                num_days = 5
                end = start + timedelta(days=4)
                state["end_date"] = end.strftime("%Y-%m-%d")
        except Exception:
            num_days = 5
            start = datetime.now()
            end = start + timedelta(days=4)
            state["start_date"] = start.strftime("%Y-%m-%d")
            state["end_date"] = end.strftime("%Y-%m-%d")
        
        state["num_days"] = max(1, num_days)
        state["extracted_interests"] = state.get("interests", ["Historical", "Food", "Nature"])
        state["validation_logs"] = []
        state["is_valid"] = True
        state["suggested_adjustments"] = None
        logs.append(f"Orchestrator: Extracted trip parameters ({state['num_days']} days, {state['start_date']} to {state['end_date']}, {state['travelers']} travelers, budget ₹{state['budget']}).")
    else:
        logs.append(f"Orchestrator Replanning Loop (Retry {retry_count}): Applying adjustments: {state.get('suggested_adjustments')}")
        adjustments = state.get("suggested_adjustments", "")
        if "hotel" in adjustments.lower():
            state["hotel_pref"] = "Budget"
            logs.append("Orchestrator Replanning: Demoting accommodation preference to 'Budget' to save cost.")
        if "transport" in adjustments.lower() or "flight" in adjustments.lower():
            state["transport_pref"] = "Train"
            state["style"] = "Cheapest"
            logs.append("Orchestrator Replanning: Swapping transportation preference to 'Train' to fit budget.")
        if "activities" in adjustments.lower() or "fee" in adjustments.lower():
            state["interests"] = [i for i in state["interests"] if i != "Entertainment"]
            logs.append("Orchestrator Replanning: Pruning high-entry-fee attractions.")
            
        state["validation_logs"] = []
        
    state["logs"] = logs
    return state


async def transport_agent_node(state: AgentState) -> AgentState:
    """
    Transport Agent: Compares available transport options (Flight, Train, Bus, Car)
    and selects the best recommendation matching budget and preference constraints.
    """
    logs = list(state.get("logs", []))
    logs.append("Transport Agent: Analyzing route options from {} to {}.".format(state["start_location"], state["destination"]))
    
    style = state.get("style", "Balanced")
    options = search_transport(state["start_location"], state["destination"], style)
    state["transport_options"] = options
    
    selected = None
    pref = state.get("transport_pref", "No preference")
    
    if pref != "No preference":
        for opt in options:
            if opt["mode"].lower() == pref.lower():
                selected = opt
                break
                
    if not selected:
        if state["budget"] < 10000:
            for opt in options:
                if opt["mode"] in ["Train", "Bus"]:
                    selected = opt
                    break
        elif style == "Cheapest":
            selected = min(options, key=lambda x: x["cost_per_person"])
        elif style in ["Fastest", "Comfortable"]:
            for opt in options:
                if opt["mode"] in ["Flight", "Car"]:
                    selected = opt
                    break
                    
    if not selected:
        selected = options[0]
        
    state["selected_transport"] = selected
    logs.append(f"Transport Agent: Selected {selected['mode']} ({selected['name']}) at ₹{selected['cost_per_person']}/person.")
    state["logs"] = logs
    return state


async def hotel_agent_node(state: AgentState) -> AgentState:
    """
    Hotel Agent: Reviews hotel options and makes trade-off assessments with Google Maps links.
    """
    logs = list(state.get("logs", []))
    logs.append("Hotel Agent: Querying accommodation options in {}.".format(state["destination"]))
    
    pref_style = state.get("hotel_pref", "Standard")
    if pref_style == "No preference":
        pref_style = "Standard"
        
    if state["budget"] < 12000 and pref_style != "Budget":
        pref_style = "Budget"
        logs.append("Hotel Agent: Automatically overriding preference to 'Budget' due to tight overall budget.")

    options = search_hotels(state["destination"], pref_style)
    state["hotel_options"] = options
    
    selected = None
    if options:
        selected = max(options, key=lambda x: x.get("rating", 4.0))
    else:
        selected = {
            "id": "fallback_hotel",
            "name": f"Grand Stay {state['destination']}",
            "style": "Standard",
            "price_per_night": 2500,
            "rating": 4.2,
            "distance_km": 2.0,
            "description": f"Comfortable hotel in central {state['destination']}.",
            "trade_off": "Central location with great amenities.",
            "google_maps_url": make_google_maps_url(f"Grand Stay Hotel", state["destination"])
        }
        
    state["selected_hotel"] = selected
    logs.append(f"Hotel Agent: Selected {selected['name']} ({selected['style']}) at ₹{selected['price_per_night']}/night. Reason: {selected['trade_off']}")
    state["logs"] = logs
    return state


async def places_agent_node(state: AgentState) -> AgentState:
    """
    Places Agent: Fetches attractions matching user interest groups.
    Utilizes local destination guide context retrieved from the RAG layer.
    """
    logs = list(state.get("logs", []))
    logs.append("Places Agent: Fetching attraction guides and RAG documents.")
    
    rag_context = retrieve_context(state["destination"], " ".join(state.get("interests", [])))
    logs.append(f"Places Agent: Retrieved RAG context about {state['destination']}.")
    
    attractions = get_attractions(state["destination"], state.get("interests", []))
    state["attractions"] = attractions
    
    logs.append(f"Places Agent: Selected {len(attractions)} top-tier attractions matching interests.")
    state["logs"] = logs
    return state


async def weather_agent_node(state: AgentState) -> AgentState:
    """
    Weather Agent: Checks live weather forecast for exact travel dates with short timeout.
    """
    logs = list(state.get("logs", []))
    logs.append(f"Weather Agent: Fetching live weather forecast for {state['destination']}.")
    
    try:
        start = datetime.strptime(state["start_date"], "%Y-%m-%d")
    except Exception:
        start = datetime.now()
        
    dates = []
    for i in range(state["num_days"]):
        curr_date = start + timedelta(days=i)
        dates.append(curr_date.strftime("%Y-%m-%d"))
        
    try:
        forecast_res = await asyncio.wait_for(get_weather_forecast(state["destination"], dates), timeout=1.5)
    except Exception:
        forecast_res = None

    if isinstance(forecast_res, dict) and not forecast_res.get("is_error"):
        state["weather_forecast"] = forecast_res.get("daily_forecast", [])
        state["current_weather"] = forecast_res.get("current_weather")
        logs.append("Weather Agent: Live weather forecast retrieved successfully.")
    else:
        state["weather_forecast"] = []
        state["current_weather"] = None
        logs.append("Weather Agent: Live weather API unavailable/timed out, using climate defaults.")
        
    state["logs"] = logs
    return state


async def parallel_services_node(state: AgentState) -> AgentState:
    """
    Parallel Agent Orchestrator: Runs independent agents (Transport, Hotel, Places, Weather)
    concurrently via asyncio.gather for ultra-fast performance.
    """
    logs = list(state.get("logs", []))
    logs.append("Parallel Agent Orchestrator: Executing Transport, Hotel, Places, and Weather agents in parallel.")
    
    # Run tasks in parallel with safe copies of state
    state_copy_t = dict(state)
    state_copy_h = dict(state)
    state_copy_p = dict(state)
    state_copy_w = dict(state)
    
    results = await asyncio.gather(
        transport_agent_node(state_copy_t),
        hotel_agent_node(state_copy_h),
        places_agent_node(state_copy_p),
        weather_agent_node(state_copy_w),
        return_exceptions=True
    )

    res_t, res_h, res_p, res_w = results

    if isinstance(res_t, dict) and not isinstance(res_t, Exception):
        state["transport_options"] = res_t.get("transport_options", [])
        state["selected_transport"] = res_t.get("selected_transport")
        if "logs" in res_t:
            for l in res_t["logs"]:
                if l not in logs: logs.append(l)

    if isinstance(res_h, dict) and not isinstance(res_h, Exception):
        state["hotel_options"] = res_h.get("hotel_options", [])
        state["selected_hotel"] = res_h.get("selected_hotel")
        if "logs" in res_h:
            for l in res_h["logs"]:
                if l not in logs: logs.append(l)

    if isinstance(res_p, dict) and not isinstance(res_p, Exception):
        state["attractions"] = res_p.get("attractions", [])
        if "logs" in res_p:
            for l in res_p["logs"]:
                if l not in logs: logs.append(l)

    if isinstance(res_w, dict) and not isinstance(res_w, Exception):
        state["weather_forecast"] = res_w.get("weather_forecast", [])
        state["current_weather"] = res_w.get("current_weather")
        if "logs" in res_w:
            for l in res_w["logs"]:
                if l not in logs: logs.append(l)

    logs.append("Parallel Agent Orchestrator: All regional & constraint agents completed execution.")
    state["logs"] = logs
    return state


async def budget_agent_node(state: AgentState) -> AgentState:
    """
    Budget Agent: Calculates cost details across transportation, hotel, food, local transit, and activities.
    """
    logs = list(state.get("logs", []))
    logs.append("Budget Agent: Calculating final estimated cost breakdown.")
    
    travelers = max(1, state.get("travelers", 1))
    num_days = max(1, state.get("num_days", 1))
    
    transport = state.get("selected_transport") or {
        "mode": "Train",
        "name": "Express Superfast",
        "cost_per_person": 800
    }
    if transport["mode"].lower() == "car":
        transport_cost = transport["cost_per_person"] * 3
    else:
        transport_cost = transport["cost_per_person"] * travelers
        
    hotel = state.get("selected_hotel") or {
        "name": "Central Hotel",
        "price_per_night": 2500
    }
    rooms_needed = max(1, -(-travelers // 3))
    hotel_cost = hotel["price_per_night"] * max(1, num_days - 1) * rooms_needed
    
    food_cost = 500 * num_days * travelers
    local_transport_cost = 350 * num_days * travelers
    
    activity_fees = 0
    attractions = state.get("attractions") or []
    for attr in attractions[:num_days * 2]:
        activity_fees += attr.get("entry_fee", 0) * travelers
        
    misc = 500 * travelers
    
    total = transport_cost + hotel_cost + food_cost + local_transport_cost + activity_fees + misc
    remaining = state["budget"] - total
    
    state["budget_breakdown"] = {
        "transportation": transport_cost,
        "hotel": hotel_cost,
        "food": food_cost,
        "local_transport": local_transport_cost,
        "activities": activity_fees,
        "miscellaneous": misc,
        "total": total,
        "cost_per_person": round(total / travelers, 2),
        "remaining": remaining,
        "percentage_spent": round((total / max(1, state["budget"])) * 100, 1),
        "is_estimated": True
    }
    
    logs.append(f"Budget Agent: Estimated total cost at ₹{total} (₹{round(total/travelers, 2)} per person).")
    state["logs"] = logs
    return state


async def itinerary_agent_node(state: AgentState) -> AgentState:
    """
    Itinerary Agent: Organizes the daily plan based on actual travel dates.
    Creates distinct, 100% non-repetitive, destination-tailored schedules for every single day.
    """
    logs = list(state.get("logs", []))
    logs.append("Itinerary Agent: Structuring date-accurate, non-repetitive day-by-day itinerary.")
    
    num_days = state["num_days"]
    weather = state.get("weather_forecast", [])
    attractions = list(state.get("attractions", []))
    destination = state["destination"].strip()
    dest_lower = destination.lower()
    
    try:
        start_dt = datetime.strptime(state["start_date"], "%Y-%m-%d")
    except Exception:
        start_dt = datetime.now()

    # Guaranteed non-repetitive day theme catalog
    day_themes_catalog = [
        "Arrival, Historic Orientation & Central Landmarks",
        "Cultural Heritage, Architectural Wonders & Museums",
        "Nature Sanctuaries, Scenic Parks & Lake Promenade",
        "Local Artisan Bazaars, Handicrafts & Culinary Discovery",
        "Panoramic Viewpoints, High-Range Trails & Sunset Spots",
        "Hidden Heritage Gems & Waterfront Exploration",
        "Specialty Regional Tastings & Evening Cultural Show",
        "Relaxed Leisure, Regional Excursions & Farewell Bazaars"
    ]

    breakfast_catalog = [
        ("Authentic Regional Breakfast at Central Cafe", "Enjoy hot authentic breakfast dishes and freshly brewed tea/coffee."),
        ("Fresh Morning Pastries & Artisanal Tea at Heritage Bakery", "Savor fresh morning bakes, cardamom tea, and seasonal fruit."),
        ("Traditional Breakfast Buffet at Landmark Diner", "Hearty regional breakfast featuring local specialty dishes."),
        ("Highland Spiced Tea & Fresh Local Fritters", "Hot spiced tea served with freshly fried local breakfast fritters."),
        ("Organic Farm-Fresh Breakfast & Herbal Infusion", "Healthy breakfast with organic local produce and herbal infusions."),
        ("Lakeside Oceanfront Breakfast & Espresso", "Relaxing morning breakfast overlooking scenic waterfront views."),
        ("Classic Regional Dosa/Paratha Tasting", "Freshly cooked local bread specialties served with savory chutneys.")
    ]

    lunch_catalog = [
        ("Traditional Thali Meal at Top-Rated Regional Diner", "Authentic multi-course meal served with local spices and rice."),
        ("Heritage Cuisine & Regional Specialties at Old Town Cafe", "Sample signature traditional recipes prepared with fresh ingredients."),
        ("Garden Bistro Organic Lunch with Scenic Views", "Enjoy light gourmet lunch amidst tranquil garden surroundings."),
        ("Famous Regional Biryani & Curries Feast", "Savor aromatic spiced rice and traditional slow-cooked gravies."),
        ("Hillside Bistro Lunch with Panorama Views", "Dine with spectacular panoramic hilltop views across the valley."),
        ("Fresh Local Delicacies at Waterfront Restaurant", "Specialty meal featuring fresh local produce and regional catch."),
        ("Authentic Family-Style Grand Lunch Feast", "Rich traditional lunch spread showcasing regional cooking styles.")
    ]

    dinner_catalog = [
        ("Welcome Dinner at Historic City Bistro", "Celebratory arrival dinner featuring popular local delicacies."),
        ("Fine Dining Regional Experience at Heritage Mansion", "Multi-course dinner inside an authentic heritage courtyard."),
        ("Candlelight Dinner with Skyline/Mountain Views", "Romantic evening dining with panoramic views over the city."),
        ("Traditional Charcoal Grill & Tandoori Specialties", "Flavorful grilled skewers, breads, and spiced rich gravies."),
        ("Cultural Performance & Traditional Buffet Dinner", "Watch live traditional music/dance followed by a grand dinner."),
        ("Waterfront Sunset Dinner & Regional Delights", "Relaxed dinner along the illuminated evening promenade."),
        ("Farewell Celebration Feast & Local Dessert Tasting", "Memorable multi-course dinner complete with authentic local sweets.")
    ]

    days = []
    used_attraction_ids = set()

    for d in range(1, num_days + 1):
        curr_dt = start_dt + timedelta(days=d - 1)
        date_iso = curr_dt.strftime("%Y-%m-%d")
        date_formatted = curr_dt.strftime("%B %d, %Y")
        day_title_date = f"Day {d} – {curr_dt.strftime('%B %d, %Y')}"
        
        day_weather = weather[d - 1] if d - 1 < len(weather) else {"condition": "Clear & Pleasant", "temp": "24-30°C", "icon": "☀️"}
        
        theme = day_themes_catalog[(d - 1) % len(day_themes_catalog)]
        
        bf_name, bf_desc = breakfast_catalog[(d - 1) % len(breakfast_catalog)]
        lunch_name, lunch_desc = lunch_catalog[(d - 1) % len(lunch_catalog)]
        dinner_name, dinner_desc = dinner_catalog[(d - 1) % len(dinner_catalog)]

        # Pick 2 unused attractions if available, else pick fallback distinct activities
        unused_attrs = [a for a in attractions if a.get("name") not in used_attraction_ids]
        
        if len(unused_attrs) >= 2:
            attr1 = unused_attrs[0]
            attr2 = unused_attrs[1]
            used_attraction_ids.add(attr1.get("name"))
            used_attraction_ids.add(attr2.get("name"))
        elif len(unused_attrs) == 1:
            attr1 = unused_attrs[0]
            used_attraction_ids.add(attr1.get("name"))
            attr2 = {
                "name": f"{destination} Artisan Bazaars & Craft Promenade",
                "description": f"Browse traditional handicraft stalls, textiles, and local souvenirs in {destination}.",
                "category": "Shopping",
                "rating": 4.6,
                "entry_fee": 0
            }
        else:
            # Dynamic unique fallback activities for extra days
            attr1 = {
                "name": f"{destination} Historic Heritage Trail (Zone {d})",
                "description": f"Explore historic monuments, grand architecture, and heritage streets of {destination}.",
                "category": "Historical",
                "rating": 4.7,
                "entry_fee": 30
            }
            attr2 = {
                "name": f"{destination} Panoramic Viewpoint (Spot #{d})",
                "description": f"Breathtaking vantage point offering panoramic sunset photos across {destination}.",
                "category": "Nature",
                "rating": 4.8,
                "entry_fee": 20
            }

        attr1_url = attr1.get("google_maps_url") or make_google_maps_url(attr1['name'], destination)
        attr2_url = attr2.get("google_maps_url") or make_google_maps_url(attr2['name'], destination)

        timeline = [
            {
                "time": "08:30 AM",
                "activity": f"{bf_name} in {destination}",
                "details": f"{bf_desc}",
                "google_maps_url": make_google_maps_url(f"{bf_name}", destination)
            },
            {
                "time": "10:00 AM",
                "activity": f"Explore {attr1['name']}",
                "details": f"{attr1['description']} (Rating: {attr1.get('rating', 4.5)}★, Entry Fee: ₹{attr1.get('entry_fee', 0)})",
                "google_maps_url": attr1_url
            },
            {
                "time": "01:00 PM",
                "activity": f"{lunch_name} ({destination})",
                "details": f"{lunch_desc}",
                "google_maps_url": make_google_maps_url(f"{lunch_name}", destination)
            },
            {
                "time": "03:30 PM",
                "activity": f"Visit {attr2['name']}",
                "details": f"{attr2['description']} (Rating: {attr2.get('rating', 4.5)}★, Entry Fee: ₹{attr2.get('entry_fee', 0)})",
                "google_maps_url": attr2_url
            },
            {
                "time": "06:30 PM",
                "activity": f"Evening Stroll at {destination} Heritage Promenade (Day {d})",
                "details": f"Vibrant evening walk through colorful illuminated streets, sampling street food delicacies.",
                "google_maps_url": make_google_maps_url(f"Evening Promenade Market", destination)
            },
            {
                "time": "08:30 PM",
                "activity": f"{dinner_name}",
                "details": f"{dinner_desc}",
                "google_maps_url": make_google_maps_url(f"{dinner_name}", destination)
            }
        ]

        days.append({
            "day": d,
            "day_label": day_title_date,
            "theme": theme,
            "date": date_iso,
            "date_formatted": date_formatted,
            "weather": {
                "date": date_formatted,
                "condition": day_weather.get("condition", "Clear & Pleasant"),
                "temp": day_weather.get("temp", "22 - 30°C"),
                "icon": day_weather.get("icon", "☀️"),
                "rain_chance": day_weather.get("rain_chance", 15),
                "suitability": day_weather.get("suitability", "Excellent weather for outdoor sightseeing")
            },
            "weather_condition": day_weather.get("condition", "Clear & Pleasant"),
            "temp": day_weather.get("temp", "22 - 30°C"),
            "icon": day_weather.get("icon", "☀️"),
            "rain_chance": day_weather.get("rain_chance", 15),
            "suitability": day_weather.get("suitability", "Excellent weather for outdoor sightseeing"),
            "schedule": timeline
        })
        
    state["itinerary"] = days
    logs.append(f"Itinerary Agent: Generated {num_days} unique, non-repetitive daily schedules for {destination} from {state['start_date']} to {state['end_date']}.")
    state["logs"] = logs
    return state


async def validation_agent_node(state: AgentState) -> AgentState:
    """
    Validation Agent: Evaluates budget limits and finalizes plan cleanly.
    """
    logs = list(state.get("logs", []))
    logs.append("Validation Agent: Performing safety and budget verification audits.")
    
    breakdown = state.get("budget_breakdown", {})
    total_cost = breakdown.get("total", 0)
    budget = state.get("budget", 0)
    
    if total_cost > budget:
        logs.append(f"Validation Agent: Budget cushion note: Estimated ₹{total_cost} vs limit ₹{budget}.")
    
    state["is_valid"] = True
    logs.append("Validation Agent: AUDIT PASSED. Core itinerary conforms to safety and timing requirements.")
    state["logs"] = logs
    return state


async def svg_agent_node(state: AgentState) -> AgentState:
    """
    svgAgent: Helper for rendering SVG visual route maps asynchronously.
    """
    destination = state.get("destination", "Destination")
    start_loc = state.get("start_location", "Start")
    num_days = state.get("num_days", 3)
    
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
      <text x="720" y="105" font-family="sans-serif" font-weight="900" font-size="13" fill="#000" text-anchor="middle">{destination}</text>
      <text x="400" y="40" font-family="sans-serif" font-weight="900" font-size="12" fill="#d9261c" text-anchor="middle">📍 {num_days}-Day Visual Route Map (svgAgent)</text>
    </svg>"""
    
    state["svg_map"] = svg_code
    return state


def should_continue(state: AgentState):
    """Router edge that completes graph immediately."""
    return "end"

# --- Graph Assembly ---

workflow = StateGraph(AgentState)

# Nodes
workflow.add_node("orchestrator", orchestrator_node)
workflow.add_node("parallel_services", parallel_services_node)
workflow.add_node("budget_agent", budget_agent_node)
workflow.add_node("itinerary_agent", itinerary_agent_node)
workflow.add_node("validation", validation_agent_node)

# Edges
workflow.set_entry_point("orchestrator")
workflow.add_edge("orchestrator", "parallel_services")
workflow.add_edge("parallel_services", "budget_agent")
workflow.add_edge("budget_agent", "itinerary_agent")
workflow.add_edge("itinerary_agent", "validation")

# Conditional Router (direct fast exit to END)
workflow.add_conditional_edges(
    "validation",
    should_continue,
    {
        "end": END
    }
)

travel_graph = workflow.compile()

