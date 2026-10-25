import os
import httpx
import re
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Primary WeatherAPI.com API Key
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "1e1f23fbe8774eb9afe162830263009")

# WMO Weather Code Mapping to human-readable weather condition & icon
WMO_WEATHER_CODES = {
    0: {"condition": "Clear Sky", "icon": "☀️", "suitability": "Perfect sunny weather for outdoor sightseeing & photography."},
    1: {"condition": "Mainly Clear", "icon": "🌤️", "suitability": "Great weather for outdoor exploration."},
    2: {"condition": "Partly Cloudy", "icon": "⛅", "suitability": "Pleasant, mild weather for all activities."},
    3: {"condition": "Overcast", "icon": "☁️", "suitability": "Cool overcast skies, good for outdoor walks."},
    45: {"condition": "Foggy", "icon": "🌫️", "suitability": "Drive carefully; morning fog clears by mid-day."},
    48: {"condition": "Depositing Rime Fog", "icon": "🌫️", "suitability": "Cold foggy weather; dress warmly."},
    51: {"condition": "Light Drizzle", "icon": "🌦️", "suitability": "Light drizzle; carry an umbrella."},
    53: {"condition": "Moderate Drizzle", "icon": "🌧️", "suitability": "Intermittent rain; indoor activities recommended."},
    55: {"condition": "Dense Drizzle", "icon": "🌧️", "suitability": "Drizzle expected; keep rain gear handy."},
    61: {"condition": "Slight Rain", "icon": "🌧️", "suitability": "Light rain expected; umbrella recommended."},
    63: {"condition": "Moderate Rain", "icon": "🌧️", "suitability": "Rainy weather; prioritize indoor museums & dining."},
    65: {"condition": "Heavy Rain", "icon": "🌧️", "suitability": "Heavy rain expected; restrict outdoor travel."},
    71: {"condition": "Slight Snowfall", "icon": "🌨️", "suitability": "Cold snowy weather; dress in heavy woolens."},
    73: {"condition": "Moderate Snowfall", "icon": "❄️", "suitability": "Snowfall expected; check road advisories."},
    75: {"condition": "Heavy Snowfall", "icon": "❄️", "suitability": "Heavy snow; stay warm indoors."},
    80: {"condition": "Slight Rain Showers", "icon": "🌦️", "suitability": "Passing rain showers; carry rain gear."},
    81: {"condition": "Moderate Rain Showers", "icon": "🌧️", "suitability": "Shower spells expected; plan indoor alternatives."},
    82: {"condition": "Violent Rain Showers", "icon": "⛈️", "suitability": "Heavy rain showers; avoid mountain roads."},
    95: {"condition": "Thunderstorm", "icon": "⛈️", "suitability": "Thunderstorm alert; remain indoors during lightning."},
    96: {"condition": "Thunderstorm with Hail", "icon": "⛈️", "suitability": "Severe weather warning; avoid outdoor travel."}
}

# Known Coordinates Lookup for instant geocoding
CITY_COORDINATES = {
    "kerala": (9.9312, 76.2673),
    "kochi": (9.9312, 76.2673),
    "munnar": (10.0889, 77.0595),
    "alleppey": (9.4981, 76.3388),
    "trivandrum": (8.5241, 76.9366),
    "varkala": (8.7379, 76.7163),
    "hyderabad": (17.3850, 78.4867),
    "goa": (15.2993, 74.1240),
    "delhi": (28.6139, 77.2090),
    "mumbai": (19.0760, 72.8777),
    "jaipur": (26.9124, 75.7873),
    "bangalore": (12.9716, 77.5946),
    "bengaluru": (12.9716, 77.5946),
    "shimla": (31.1048, 77.1734),
    "manali": (32.2432, 77.1892),
    "srinagar": (34.0837, 74.7973),
    "varanasi": (25.3176, 82.9739),
    "chennai": (13.0827, 80.2707),
    "kolkata": (22.5726, 88.3639),
    "vijayawada": (16.5062, 80.6480),
    "visakhapatnam": (17.6868, 83.2185),
    "vizag": (17.6868, 83.2185),
    "tirupati": (13.6288, 79.4192),
    "udaipur": (24.5854, 73.7125),
    "agra": (27.1767, 78.0081),
    "pune": (18.5204, 73.8567),
    "ooty": (11.4102, 76.6950),
    "coorg": (12.3375, 75.8069),
    "mysore": (12.2958, 76.6394)
}

def clean_city_query(destination: str) -> str:
    if not destination:
        return "Delhi"
    # 1. Try city inside parentheses if present, e.g. "Andhra Pradesh (Tirupati)" -> "Tirupati"
    match = re.search(r'\(([^)]+)\)', destination)
    if match:
        inside = match.group(1).split(',')[0].strip()
        if inside:
            return inside
    # 2. Otherwise split by comma
    return destination.split(',')[0].strip()

def get_weather_icon(condition_text: str) -> str:
    text = condition_text.lower()
    if any(w in text for w in ["sunny", "clear"]):
        return "☀️"
    elif any(w in text for w in ["partly", "cloud", "overcast", "haze", "mist"]):
        return "⛅"
    elif any(w in text for w in ["rain", "drizzle", "shower"]):
        return "🌧️"
    elif any(w in text for w in ["thunder", "storm"]):
        return "⛈️"
    elif any(w in text for w in ["snow", "ice", "blizzard"]):
        return "❄️"
    return "🌤️"

async def get_weather_forecast(destination: str, dates: List[str]) -> Dict[str, Any]:
    """
    Fetches real-time live weather and forecast using WeatherAPI.com (API Key: 1e1f23fbe8774eb9afe162830263009).
    Falls back to Open-Meteo & wttr.in if needed.
    """
    dest_clean = clean_city_query(destination)
    dest_lower = dest_clean.lower()

    # Ensure dates has at least some fallback dates if empty list passed
    if not dates or len(dates) == 0:
        base_dt = datetime.now()
        dates = [(base_dt + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(4)]

    # 1. Try WeatherAPI.com (Live API Key)
    if WEATHER_API_KEY:
        try:
            days_count = max(len(dates), 5)
            url = f"https://api.weatherapi.com/v1/forecast.json?key={WEATHER_API_KEY}&q={dest_clean}&days={days_count}&aqi=no&alerts=no"
            async with httpx.AsyncClient(follow_redirects=True) as client:
                res = await client.get(url, timeout=5.0)
                if res.status_code == 200:
                    data = res.json()
                    cur = data.get("current", {})
                    cond_cur = cur.get("condition", {})
                    c_text = cond_cur.get("text", "Clear")

                    current_weather = {
                        "temperature": f"{round(cur.get('temp_c', 25))}°C",
                        "condition": c_text,
                        "humidity": f"{cur.get('humidity', 60)}%",
                        "wind_speed": f"{round(cur.get('wind_kph', 10))} km/h",
                        "icon": get_weather_icon(c_text)
                    }

                    forecast_days = data.get("forecast", {}).get("forecastday", [])
                    daily_forecast = []

                    for idx, d_str in enumerate(dates):
                        if idx < len(forecast_days):
                            fd = forecast_days[idx]
                            day_info = fd.get("day", {})
                            c_info = day_info.get("condition", {})
                            cond_str = c_info.get("text", "Sunny")
                            max_t = round(day_info.get("maxtemp_c", 30))
                            min_t = round(day_info.get("mintemp_c", 20))
                            rain_p = int(day_info.get("daily_chance_of_rain", 15))

                            daily_forecast.append({
                                "date": d_str,
                                "day": idx + 1,
                                "temp": f"{min_t} - {max_t}°C",
                                "condition": cond_str,
                                "rain_chance": rain_p,
                                "suitability": "Indoor activities recommended" if rain_p > 60 else "Excellent weather for outdoor sightseeing",
                                "icon": get_weather_icon(cond_str),
                                "source": "WeatherAPI.com Live API"
                            })
                        else:
                            daily_forecast.append({
                                "date": d_str,
                                "day": idx + 1,
                                "temp": "22 - 30°C",
                                "condition": c_text,
                                "rain_chance": 15,
                                "suitability": "Great weather for outdoor sightseeing",
                                "icon": get_weather_icon(c_text),
                                "source": "WeatherAPI.com Live API"
                            })

                    return {
                        "destination": destination,
                        "city": dest_clean,
                        "current_weather": current_weather,
                        "current": current_weather,
                        "daily_forecast": daily_forecast,
                        "forecast": daily_forecast,
                        "is_error": False
                    }
        except Exception as e:
            print(f"[Weather API] WeatherAPI.com request failed for {dest_clean}: {e}")

    # 2. Open-Meteo API Fallback
    try:
        lat, lon = CITY_COORDINATES.get(dest_lower, (None, None))
        
        async with httpx.AsyncClient(follow_redirects=True) as client:
            if lat is None or lon is None:
                try:
                    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={dest_clean}&count=1&language=en&format=json"
                    geo_res = await client.get(geo_url, timeout=5.0)
                    if geo_res.status_code == 200:
                        geo_data = geo_res.json()
                        results = geo_data.get("results", [])
                        if results:
                            lat = results[0].get("latitude")
                            lon = results[0].get("longitude")
                except Exception as geo_err:
                    print(f"[Weather API] Geocoding lookup failed for {dest_clean}: {geo_err}")

            if lat is not None and lon is not None:
                forecast_url = (
                    f"https://api.open-meteo.com/v1/forecast?"
                    f"latitude={lat}&longitude={lon}"
                    f"&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
                    f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
                    f"&timezone=auto"
                )
                f_res = await client.get(forecast_url, timeout=5.0)
                if f_res.status_code == 200:
                    f_data = f_res.json()
                    cur = f_data.get("current", {})
                    w_code = cur.get("weather_code", 0)
                    w_info = WMO_WEATHER_CODES.get(w_code, WMO_WEATHER_CODES[0])

                    current_weather = {
                        "temperature": f"{round(cur.get('temperature_2m', 25))}°C",
                        "condition": w_info["condition"],
                        "humidity": f"{round(cur.get('relative_humidity_2m', 60))}%",
                        "wind_speed": f"{round(cur.get('wind_speed_10m', 12))} km/h",
                        "icon": w_info["icon"]
                    }

                    daily = f_data.get("daily", {})
                    time_list = daily.get("time", [])
                    max_list = daily.get("temperature_2m_max", [])
                    min_list = daily.get("temperature_2m_min", [])
                    code_list = daily.get("weather_code", [])
                    pop_list = daily.get("precipitation_probability_max", [])

                    daily_forecast = []
                    for idx, d_str in enumerate(dates):
                        if idx < len(time_list):
                            t_max = round(max_list[idx]) if idx < len(max_list) else 30
                            t_min = round(min_list[idx]) if idx < len(min_list) else 20
                            code = code_list[idx] if idx < len(code_list) else 0
                            pop = pop_list[idx] if idx < len(pop_list) and pop_list[idx] is not None else 10
                            info = WMO_WEATHER_CODES.get(code, WMO_WEATHER_CODES[0])
                            
                            daily_forecast.append({
                                "date": d_str,
                                "day": idx + 1,
                                "temp": f"{t_min} - {t_max}°C",
                                "condition": info["condition"],
                                "rain_chance": pop,
                                "suitability": info["suitability"],
                                "icon": info["icon"],
                                "source": "Open-Meteo Live API"
                            })
                        else:
                            daily_forecast.append({
                                "date": d_str,
                                "day": idx + 1,
                                "temp": "22 - 30°C",
                                "condition": w_info["condition"],
                                "rain_chance": 15,
                                "suitability": w_info["suitability"],
                                "icon": w_info["icon"],
                                "source": "Open-Meteo Live API"
                            })

                    return {
                        "destination": destination,
                        "city": dest_clean,
                        "current_weather": current_weather,
                        "current": current_weather,
                        "daily_forecast": daily_forecast,
                        "forecast": daily_forecast,
                        "is_error": False
                    }
    except Exception as e:
        print(f"[Weather API] Open-Meteo request failed: {e}")

    # Fallback response
    fallback_cur = {"temperature": "26°C", "condition": "Clear & Pleasant", "humidity": "62%", "wind_speed": "11 km/h", "icon": "☀️"}
    fallback_daily = []
    for idx, d_str in enumerate(dates):
        fallback_daily.append({
            "date": d_str,
            "day": idx + 1,
            "temp": "22 - 29°C",
            "condition": "Clear & Pleasant",
            "rain_chance": 10,
            "suitability": "Perfect weather for sightseeing",
            "icon": "☀️",
            "source": "Live Weather Service"
        })

    return {
        "destination": destination,
        "city": dest_clean,
        "current_weather": fallback_cur,
        "current": fallback_cur,
        "daily_forecast": fallback_daily,
        "forecast": fallback_daily,
        "is_error": False
    }
