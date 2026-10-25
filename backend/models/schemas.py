from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- User & Preferences Schemas ---
class UserPreferencesSchema(BaseModel):
    default_budget: float = Field(20000.0, description="Default budget in INR")
    preferred_style: str = Field("Balanced", description="Balanced, Cheapest, Comfortable, Luxury")
    preferred_transport: str = Field("No preference", description="Train, Bus, Flight, Car, No preference")
    food_preference: str = Field("No preference", description="Vegetarian, Non-Vegetarian, No preference")
    interests: List[str] = Field(default_factory=lambda: ["Historical", "Food"], description="Default categories of attractions")

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    preferences: UserPreferencesSchema

# --- Trip Details Schemas ---
class TripCreate(BaseModel):
    title: Optional[str] = "My Trip"
    start_location: str
    destination: str
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD
    budget: float
    travelers: int
    style: str = "Balanced"
    transport_pref: str = "No preference"
    hotel_pref: str = "No preference"
    interests: List[str] = Field(default_factory=list)

class TripResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    title: str
    start_location: str
    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    style: str
    transport_pref: str
    hotel_pref: str
    interests: List[str]
    itinerary: List[Dict[str, Any]] = []
    transport_options: List[Dict[str, Any]] = []
    selected_transport: Optional[Dict[str, Any]] = None
    hotel_options: List[Dict[str, Any]] = []
    selected_hotel: Optional[Dict[str, Any]] = None
    attractions: List[Dict[str, Any]] = []
    weather_forecast: List[Dict[str, Any]] = []
    budget_breakdown: Dict[str, Any] = {}
    validation_logs: List[str] = []
    status: str = "planned"  # planned, saved, archived
    created_at: str

# --- Agent Interaction Schemas ---
class AgentPlanRequest(BaseModel):
    start_location: str
    destination: str
    budget: float
    start_date: str
    end_date: str
    travelers: int
    interests: List[str] = Field(default_factory=list)
    style: str = "Balanced"
    transport_pref: str = "No preference"
    hotel_pref: str = "No preference"

class AgentReplanRequest(BaseModel):
    trip_data: Dict[str, Any] = Field(..., description="The current trip state to modify")
    instruction: str = Field(..., description="Natural language modification (e.g. 'reduce budget to 15000')")

class AgentOptimizeRequest(BaseModel):
    trip_data: Dict[str, Any] = Field(..., description="The current trip state to optimize")
    objective: str = Field(..., description="Cheapest, Fastest, Comfortable, More Places, Balanced")

class AgentAssistantRequest(BaseModel):
    message: str = Field(..., description="User query message")
    history: List[Dict[str, str]] = Field(default_factory=list, description="Chat history")



