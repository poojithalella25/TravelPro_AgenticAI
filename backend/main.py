import os
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Load environmental configs from .env
load_dotenv()

# Import routing modules
from backend.routes.auth import router as auth_router
from backend.routes.trips import router as trips_router
from backend.routes.agent import router as agent_router
from backend.routes.weather import router as weather_router

app = FastAPI(
    title="AI Travel Planner Agent",
    description="A B.Tech final-year project showcasing LangGraph Agentic travel planning.",
    version="1.0.0"
)

# CORS configuration
# In production, set FRONTEND_URL env var on Render to your Vercel deployment URL.
# Multiple URLs can be separated by commas, e.g.:
#   FRONTEND_URL=https://travel-pro.vercel.app,https://travel-pro-git-main-user.vercel.app
origins = [
    "http://localhost:5173",   # default Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

# Add every production frontend URL listed in the FRONTEND_URL env var
frontend_url_env = os.getenv("FRONTEND_URL", "")
for url in frontend_url_env.split(","):
    url = url.strip().rstrip("/")
    if url and url not in origins:
        origins.append(url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach Routers
app.include_router(auth_router)
app.include_router(trips_router)
app.include_router(agent_router)
app.include_router(weather_router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "project": "AI Travel Planner Agent",
        "subtitle": "An Agentic AI System for Personalized, Budget-Aware and Constraint-Based Travel Planning",
        "architecture": "LangGraph + FastAPI + React"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    # Run server via uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)
