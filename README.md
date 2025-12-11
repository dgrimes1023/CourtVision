# CourtVision

**CS3620 Database Management - Final Project**

A comprehensive NBA analytics application built with a 22-table PostgreSQL database, featuring player statistics, game tracking, CRUD operations, interactive leaderboards, and real-time data from Kaggle NBA datasets.

---

## Project Goal

CourtVision aims to provide a complete NBA analytics platform where users can:
- Browse and manage player/team data from real NBA datasets
- View interactive leaderboards for scoring, assists, and efficiency
- Track game results and team performance
- Perform CRUD operations on players, teams, and notes
- Monitor all database changes through comprehensive audit logging

---

## Interactive Features

### Write Operations (CRUD)
1. **Player Management**: Create, update, and delete player records with validation
2. **Team Management**: Add and modify team information
3. **User Notes**: Create personal notes about players and teams
4. **Data Import**: Bulk load real NBA data from CSV datasets

### Analytical Views
1. **Points Per Game Leaderboard**: Top scorers with rankings and statistics
2. **Assists Per Game Leaderboard**: Top playmakers and assist leaders
3. **Player Efficiency Rating (PER)**: Advanced metrics leaderboard showing player efficiency
4. **Game Results Dashboard**: Recent game scores and outcomes
5. **Team Statistics**: Win/loss records and performance metrics


---

## Quick Start

### Prerequisites
- PostgreSQL 14+
- Python 3.9+
- Node.js 18+
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd CourtVision
```

### 2. Setup Database
```bash
# Create database
createdb courtvision

# Load schema with all tables, functions, and triggers
psql -d courtvision -f schema/schema.sql
psql -d courtvision -f schema/functions.sql
psql -d courtvision -f schema/seed.sql
```

### 3. Load Real NBA Data
```bash
# Install Python dependencies
pip install psycopg2-binary python-dotenv

# Create .env file with your database credentials
cat > api/.env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=courtvision
DB_USER=postgres
DB_PASSWORD=your_password_here
EOF

# Load data from CSV datasets (Players, Games, Statistics)
python3 load_data.py
```

### 4. Start Backend API
```bash
cd api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

python main.py
# API runs on http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

---

## Project Structure

```
CourtVision/
├── schema/              # Database schema, functions, and seed data
│   ├── schema.sql       # 22 tables with constraints and indexes
│   ├── functions.sql    # SQL functions, triggers, and procedures
│   └── seed.sql         # Sample data for testing
├── api/                 # Python FastAPI backend
│   ├── main.py          # API endpoints (CRUD, analytics, audit)
│   ├── db.py            # Database connection and query helper
│   └── requirements.txt # Python dependencies
├── frontend/            # Next.js React frontend
│   └── pages/           # UI pages (dashboard, players, games, CRUD)
├── datasets/            # Kaggle NBA datasets (CSV files)
│   ├── Players.csv      # Player biographical data
│   ├── Games.csv        # Game results and scores
│   ├── PlayerStatistics.csv  # Per-game player stats
│   └── TeamStatistics.csv    # Per-game team stats
├── erd/                 # Database diagram
└── load_data.py         # Script to import CSV data into PostgreSQL
```

---

## Features

### Database
- **22 tables** organized in 5 layers (Raw, Core, User, Analytics, Audit)
- **PostgreSQL functions** for all CRUD operations
- **Triggers** for automatic audit logging
- **3 public datasets** integrated (Players, Games, Statistics)
- **Normalized to 3NF** with proper foreign keys and constraints
- **Indexes** on frequently queried columns for performance

### Backend API (FastAPI)
- **RESTful endpoints** for all entities
- **CRUD operations**: Players, Teams, Notes, Comparisons
- **Analytics endpoints**: Leaderboards, Game results, Team stats
- **Audit log** tracking all database changes
- **Data validation** with Pydantic models
- **Error handling** and constraint enforcement

### Frontend (Next.js)
- **Interactive dashboard** with 3 leaderboards
- **Player management** pages (browse, add, update, delete)
- **Games page** showing recent NBA game results
- **Search and filter** functionality
- **Real-time updates** from database
- **Responsive design** with Tailwind CSS

---

## Application Pages

1. **Dashboard** (`/`) - View 3 interactive leaderboards (Points, Assists, Efficiency)
2. **Players** (`/players`) - Browse, search, and view all players
3. **Games** (`/games`) - View recent game results with scores
4. **Add Player** (`/add-player`) - Create new player records
5. **Update Player** (`/update-player`) - Edit existing player information
6. **Delete Player** (`/delete-player`) - Remove players from database

---

## Database Schema

### Layer A: Raw Data (Imported from Kaggle)
- `players_raw` - Original player data
- `teams_raw` - Original team data
- `seasons_raw` - Season information

### Layer B: Core Application Tables
- `player` - Cleaned player entities
- `team` - Team entities with conference/division
- `season` - NBA seasons
- `player_season_stats` - Player statistics per season
- `team_season_stats` - Team statistics per season
- `advanced_metrics` - PER, TS%, BPM, VORP, etc.
- `shooting_zones` - Court zones for shooting analytics
- `player_shooting` - Shooting performance by zone
- `injury_report` - Player injury tracking

### Layer C: User Interaction Tables
- `app_user` - Application users
- `user_favorites_players` - User's favorite players
- `user_favorites_teams` - User's favorite teams
- `user_notes` - User-created notes
- `user_comparisons` - Player comparison records

### Layer D: Analytics (Materialized Views)
- `leaderboard_pts` - Points per game rankings
- `leaderboard_ast` - Assists per game rankings
- `leaderboard_efficiency` - Player efficiency rankings

### Layer E: Audit & Games
- `audit_log` - Tracks all INSERT/UPDATE/DELETE operations
- `game` - NBA game results from dataset

**View ERD:** Copy `erd/dbdiagram.txt` to [dbdiagram.io](https://dbdiagram.io)

---

## Public Datasets Used

All datasets sourced from Kaggle's NBA database:

1. **Players.csv** (~4,800 players)
   - Biographical data (name, birthdate, height, weight)
   - College, country, draft information
   - Position classification

2. **Games.csv** (~100 games)
   - Game dates, teams, scores
   - Home/away designations
   - Game types (regular season, playoffs, in-season tournament)

3. **PlayerStatistics.csv** (~2,000 game performances)
   - Per-game stats: points, assists, rebounds
   - Shooting percentages (FG%, 3P%, FT%)
   - Advanced stats: plus/minus, turnovers, steals, blocks

4. **TeamStatistics.csv** (~200 team game records)
   - Team performance per game
   - Win/loss records
   - Points scored/allowed

---

## Tech Stack

### Database
- PostgreSQL 14+ with advanced features
- PL/pgSQL functions and triggers
- JSONB for audit log storage
- B-tree indexes for query optimization

### Backend
- Python 3.9+
- FastAPI (REST API framework)
- psycopg2 (PostgreSQL adapter)
- Pydantic (data validation)
- python-dotenv (environment management)

### Frontend
- Next.js 13 (React framework)
- Tailwind CSS (styling)
- Modern JavaScript (ES6+)

---

## Data Integrity & Constraints

- **Primary Keys**: All tables have auto-incrementing IDs
- **Foreign Keys**: Referential integrity enforced with ON DELETE CASCADE
- **Unique Constraints**: Prevent duplicate records (email, abbreviations, etc.)
- **Check Constraints**: Validate ranges (height, weight, scores)
- **NOT NULL**: Required fields enforced at database level
- **Triggers**: Automatic audit logging for player and team changes

---

## Sample Queries

### Get Top 10 Scorers
```sql
SELECT * FROM get_top_scorers(1, 10);
```

### View Recent Games
```sql
SELECT * FROM get_recent_games(20);
```

### Check Audit Trail
```sql
SELECT * FROM audit_log 
WHERE table_name = 'player' 
ORDER BY changed_at DESC 
LIMIT 10;
```


---

## Team

- **Team Size**: 2
- **Developers**: Daniel Grimes & Nicholas Dozmati
- **Course**: CS3620 Database Systems
- **Semester**: Fall 2025

---

## Citations

**Dataset Source**: Kaggle NBA Database
- Players, Games, and Statistics datasets
- Last Updated: December 2025
- License: Public Domain / CC0

---
