-- CourtVision Database Schema
-- Checkpoint 2: 20-Table NBA Analytics Application
-- Author: CS3620 Student
-- Date: December 2, 2025

-- ==========================================
-- LAYER A: NBA_RAW (Imported Kaggle Dataset)
-- ==========================================

-- Raw player data from Kaggle NBA dataset
CREATE TABLE players_raw (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    height_inches INTEGER,
    weight_lbs INTEGER,
    college VARCHAR(255),
    country VARCHAR(100),
    draft_year INTEGER,
    draft_round INTEGER,
    draft_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raw team data from Kaggle NBA dataset
CREATE TABLE teams_raw (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(10) UNIQUE NOT NULL,
    city VARCHAR(100),
    arena VARCHAR(255),
    year_founded INTEGER,
    owner VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raw season data from Kaggle NBA dataset
CREATE TABLE seasons_raw (
    id SERIAL PRIMARY KEY,
    season_year VARCHAR(20) NOT NULL UNIQUE, -- e.g., "2023-24"
    start_date DATE,
    end_date DATE,
    champion_team VARCHAR(100),
    mvp_player VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- LAYER B: CORE (Main Application Objects)
-- ==========================================

-- Core player entity (cleaned/processed from raw)
CREATE TABLE player (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    height_inches INTEGER CHECK (height_inches > 0 AND height_inches < 100),
    weight_lbs INTEGER CHECK (weight_lbs > 0 AND weight_lbs < 500),
    position VARCHAR(10), -- PG, SG, SF, PF, C
    jersey_number INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    raw_player_id INTEGER REFERENCES players_raw(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core team entity
CREATE TABLE team (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(10) UNIQUE NOT NULL,
    city VARCHAR(100),
    conference VARCHAR(20), -- Eastern, Western
    division VARCHAR(50), -- Atlantic, Central, Southeast, Northwest, Pacific, Southwest
    is_active BOOLEAN DEFAULT TRUE,
    raw_team_id INTEGER REFERENCES teams_raw(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core season entity
CREATE TABLE season (
    id SERIAL PRIMARY KEY,
    season_year VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    raw_season_id INTEGER REFERENCES seasons_raw(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player statistics per season
CREATE TABLE player_season_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES team(id),
    games_played INTEGER DEFAULT 0,
    minutes_played DECIMAL(10, 2) DEFAULT 0,
    points DECIMAL(10, 2) DEFAULT 0,
    rebounds DECIMAL(10, 2) DEFAULT 0,
    assists DECIMAL(10, 2) DEFAULT 0,
    steals DECIMAL(10, 2) DEFAULT 0,
    blocks DECIMAL(10, 2) DEFAULT 0,
    turnovers DECIMAL(10, 2) DEFAULT 0,
    field_goals_made INTEGER DEFAULT 0,
    field_goals_attempted INTEGER DEFAULT 0,
    three_pointers_made INTEGER DEFAULT 0,
    three_pointers_attempted INTEGER DEFAULT 0,
    free_throws_made INTEGER DEFAULT 0,
    free_throws_attempted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, season_id)
);

-- Team statistics per season
CREATE TABLE team_season_stats (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL REFERENCES team(id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    win_percentage DECIMAL(5, 3),
    points_per_game DECIMAL(10, 2),
    points_allowed_per_game DECIMAL(10, 2),
    offensive_rating DECIMAL(10, 2),
    defensive_rating DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, season_id)
);

-- Advanced player metrics (efficiency, PER, etc.)
CREATE TABLE advanced_metrics (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    player_efficiency_rating DECIMAL(10, 2), -- PER
    true_shooting_percentage DECIMAL(5, 3), -- TS%
    usage_rate DECIMAL(5, 3),
    offensive_rating DECIMAL(10, 2),
    defensive_rating DECIMAL(10, 2),
    win_shares DECIMAL(10, 2),
    box_plus_minus DECIMAL(10, 2), -- BPM
    value_over_replacement DECIMAL(10, 2), -- VORP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, season_id)
);

-- Shooting zones on the court
CREATE TABLE shooting_zones (
    id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL UNIQUE, -- e.g., "Paint", "Mid-Range Left", "Corner 3 Right"
    description TEXT,
    min_distance_ft INTEGER, -- Distance from basket
    max_distance_ft INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player shooting performance by zone
CREATE TABLE player_shooting (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    zone_id INTEGER NOT NULL REFERENCES shooting_zones(id) ON DELETE CASCADE,
    shots_attempted INTEGER DEFAULT 0,
    shots_made INTEGER DEFAULT 0,
    shooting_percentage DECIMAL(5, 3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, season_id, zone_id)
);

-- Player injury tracking
CREATE TABLE injury_report (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    injury_type VARCHAR(255) NOT NULL,
    injury_date DATE NOT NULL,
    return_date DATE,
    games_missed INTEGER DEFAULT 0,
    status VARCHAR(50), -- Out, Day-to-Day, Questionable, Probable
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- LAYER C: USER_DATA (App User Interactions)
-- ==========================================

-- Application users
CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- User's favorite players
CREATE TABLE user_favorites_players (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    player_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, player_id)
);

-- User's favorite teams
CREATE TABLE user_favorites_teams (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    team_id INTEGER NOT NULL REFERENCES team(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, team_id)
);

-- User notes on players/games
CREATE TABLE user_notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES player(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES team(id) ON DELETE CASCADE,
    note_title VARCHAR(255),
    note_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (player_id IS NOT NULL OR team_id IS NOT NULL) -- Must reference at least one
);

-- User player comparisons
CREATE TABLE user_comparisons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    player_1_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    player_2_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    comparison_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (player_1_id != player_2_id) -- Can't compare player to themselves
);

-- ==========================================
-- LAYER D: MART (Analytics Summary Tables)
-- ==========================================

-- Points per game leaderboard
CREATE TABLE leaderboard_pts (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    points_per_game DECIMAL(10, 2) NOT NULL,
    games_played INTEGER,
    total_points INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, season_id)
);

-- Assists per game leaderboard
CREATE TABLE leaderboard_ast (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    assists_per_game DECIMAL(10, 2) NOT NULL,
    games_played INTEGER,
    total_assists INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, season_id)
);

-- Player efficiency leaderboard
CREATE TABLE leaderboard_efficiency (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    efficiency_rating DECIMAL(10, 2) NOT NULL,
    games_played INTEGER,
    minutes_played DECIMAL(10, 2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, season_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_player_name ON player(player_name);
CREATE INDEX idx_team_abbr ON team(abbreviation);
CREATE INDEX idx_season_year ON season(season_year);
CREATE INDEX idx_player_season_stats_player ON player_season_stats(player_id);
CREATE INDEX idx_player_season_stats_season ON player_season_stats(season_id);
CREATE INDEX idx_user_favorites_players_user ON user_favorites_players(user_id);
CREATE INDEX idx_user_favorites_teams_user ON user_favorites_teams(user_id);
CREATE INDEX idx_user_notes_user ON user_notes(user_id);
CREATE INDEX idx_leaderboard_pts_season ON leaderboard_pts(season_id, rank);
CREATE INDEX idx_leaderboard_ast_season ON leaderboard_ast(season_id, rank);
CREATE INDEX idx_leaderboard_efficiency_season ON leaderboard_efficiency(season_id, rank);

-- Comments
COMMENT ON TABLE players_raw IS 'Raw player data imported from Kaggle NBA dataset';
COMMENT ON TABLE teams_raw IS 'Raw team data imported from Kaggle NBA dataset';
COMMENT ON TABLE seasons_raw IS 'Raw season data imported from Kaggle NBA dataset';
COMMENT ON TABLE player IS 'Core player entity with cleaned and processed data';
COMMENT ON TABLE team IS 'Core team entity with cleaned and processed data';
COMMENT ON TABLE season IS 'Core season entity';
COMMENT ON TABLE player_season_stats IS 'Player statistics aggregated by season';
COMMENT ON TABLE team_season_stats IS 'Team statistics aggregated by season';
COMMENT ON TABLE advanced_metrics IS 'Advanced analytics metrics like PER, TS%, BPM';
COMMENT ON TABLE shooting_zones IS 'Court zones for shooting analytics';
COMMENT ON TABLE player_shooting IS 'Player shooting performance by court zone';
COMMENT ON TABLE injury_report IS 'Player injury tracking and history';
COMMENT ON TABLE app_user IS 'Application users for authentication';
COMMENT ON TABLE user_favorites_players IS 'Users favorite players list';
COMMENT ON TABLE user_favorites_teams IS 'Users favorite teams list';
COMMENT ON TABLE user_notes IS 'User-created notes on players and teams';
COMMENT ON TABLE user_comparisons IS 'User-created player comparisons';
COMMENT ON TABLE leaderboard_pts IS 'Points per game leaderboard (materialized summary)';
COMMENT ON TABLE leaderboard_ast IS 'Assists per game leaderboard (materialized summary)';
COMMENT ON TABLE leaderboard_efficiency IS 'Player efficiency leaderboard (materialized summary)';
