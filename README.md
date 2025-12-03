# 🏀 CourtVision

**CS3620 Database Management - Checkpoint 2**

NBA analytics application with player statistics, CRUD operations, and leaderboards.

---

## 🚀 Quick Start

### Prerequisites
- PostgreSQL
- Python 3.9+
- Node.js 18+

### Setup Database
```bash
# Create database
createdb courtvision

# Load schema and sample data
psql -d courtvision -f schema/schema.sql
psql -d courtvision -f schema/seed.sql
```

### Start Backend API
```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file with your database password
echo "DB_HOST=localhost
DB_PORT=5433
DB_NAME=courtvision
DB_USER=yourusername
DB_PASSWORD=yourpassword" > .env

python main.py
# API runs on http://localhost:8000
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 📁 Project Structure

```
CourtVision/
├── schema/          # Database schema and SQL functions
├── api/             # Python FastAPI backend
├── frontend/        # Next.js React frontend
└── erd/             # Database diagram
```

---

## ✨ Features

- **20-table PostgreSQL database** with players, teams, stats, and analytics
- **CRUD operations** via SQL functions
- **REST API** with FastAPI
- **Interactive UI** for managing players
- **Leaderboards** for points and assists

---

## 📊 Pages

- **Dashboard** - View leaderboards
- **Players** - Browse and search players
- **Add Player** - Create new players
- **Update Player** - Edit player info
- **Delete Player** - Remove players

---

## 🗄️ Database

**20 Tables:**
- Raw data: `players_raw`, `teams_raw`, `seasons_raw`
- Core: `player`, `team`, `season`, `player_season_stats`, `team_season_stats`, `advanced_metrics`, `shooting_zones`, `player_shooting`, `injury_report`
- User data: `app_user`, `user_favorites_players`, `user_favorites_teams`, `user_notes`, `user_comparisons`
- Analytics: `leaderboard_pts`, `leaderboard_ast`, `leaderboard_efficiency`

**View ERD:** Copy `erd/dbdiagram.txt` to https://dbdiagram.io

---

## 🛠️ Tech Stack

- PostgreSQL
- Python + FastAPI
- Next.js + React
- Tailwind CSS
