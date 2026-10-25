from fastapi import APIRouter, Query
from typing import Optional, List
from backend.services.weather import get_weather_forecast

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("")
async def get_weather(destination: str, dates: Optional[str] = Query(None)):
    """
    Fetches real live weather & forecasts for a destination.
    dates can be a comma-separated string of YYYY-MM-DD dates.
    """
    date_list = [d.strip() for d in dates.split(",")] if dates else []
    res = await get_weather_forecast(destination, date_list)
    
    if isinstance(res, dict) and res.get("is_error"):
        return {
            "destination": destination,
            "current": None,
            "forecast": [],
            "is_error": True,
            "error_message": res.get("error_message", "Live weather service is currently unreachable.")
        }
    
    current = res.get("current_weather") if isinstance(res, dict) else None
    daily = res.get("daily_forecast", []) if isinstance(res, dict) else []
    
    return {
        "destination": destination,
        "current": current,
        "forecast": daily,
        "is_error": False
    }

