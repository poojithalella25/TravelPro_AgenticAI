# ✈️ TravelPro AgenticAI

An AI-powered travel planning application designed to help users explore destinations and organize personalized travel experiences.

## 🌟 Overview

TravelPro AgenticAI is a full-stack travel application with a React-based frontend and a Python backend. It aims to simplify travel planning through an interactive user interface and AI-assisted features.

## 🚀 Features

- **User Authentication** — User registration and login.
- **Trip Planning** — Create and manage travel plans.
- **AI Travel Assistant** — Interactive assistant for travel-related queries.
- **Trip Dashboard** — View and manage planned trips.
- **Weather Information** — Access weather-related information.
- **Destination Exploration** — Explore Indian states and union territories.
- **Smart Calendar** — Organize travel schedules.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- Python
- FastAPI (confirm against the backend code)
- AI agent and travel-planning modules

## 📁 Project Structure

```text
TravelPro_AgenticAI/
├── backend/
│   ├── agents/
│   ├── database/
│   ├── graph/
│   ├── models/
│   ├── rag/
│   ├── routes/
│   ├── services/
│   └── main.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
├── .gitignore
├── render.yaml
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Python installed
- Node.js and npm installed
- Git installed

### 1. Clone the repository

```bash
git clone https://github.com/poojithalella25/TravelPro_AgenticAI.git
cd TravelPro_AgenticAI
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables using the project's environment-variable examples. Never commit real API keys or passwords.

Start the backend using the command specified in the project configuration.

### 3. Set up the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local address displayed in your terminal.

## 🔐 Security

- Keep API keys and passwords in environment variables.
- Do not commit `.env` files containing secrets.
- Use the provided environment-variable examples where available.

## 📌 Future Improvements

- Enhanced personalized travel recommendations
- Additional destination and itinerary options
- Improved travel information integration
- More AI-assisted planning capabilities

## 👩‍💻 Author

**GitHub:** [@poojithalella25](https://github.com/poojithalella25)
