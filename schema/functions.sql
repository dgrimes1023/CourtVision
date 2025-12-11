-- CourtVision SQL Functions
-- Checkpoint 2: CRUD Operations and Filtering Functions
-- Author: CS3620 Student
-- Date: December 2, 2025

-- ==========================================
-- PLAYER CRUD FUNCTIONS
-- ==========================================

-- CREATE: Insert a new player
CREATE OR REPLACE FUNCTION insert_player(
    p_player_name VARCHAR(255),
    p_birth_date DATE,
    p_height_inches INTEGER,
    p_weight_lbs INTEGER,
    p_position VARCHAR(10),
    p_jersey_number INTEGER
) RETURNS INTEGER AS $$
DECLARE
    new_player_id INTEGER;
BEGIN
    INSERT INTO player (player_name, birth_date, height_inches, weight_lbs, position, jersey_number)
    VALUES (p_player_name, p_birth_date, p_height_inches, p_weight_lbs, p_position, p_jersey_number)
    RETURNING id INTO new_player_id;
    
    RETURN new_player_id;
END;
$$ LANGUAGE plpgsql;

-- READ: Get player by name
CREATE OR REPLACE FUNCTION get_player_by_name(p_name VARCHAR(255))
RETURNS TABLE (
    id INTEGER,
    player_name VARCHAR(255),
    birth_date DATE,
    height_inches INTEGER,
    weight_lbs INTEGER,
    position VARCHAR(10),
    jersey_number INTEGER,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.player_name, p.birth_date, p.height_inches, p.weight_lbs, 
           p.position, p.jersey_number, p.is_active
    FROM player p
    WHERE p.player_name ILIKE '%' || p_name || '%'
    ORDER BY p.player_name;
END;
$$ LANGUAGE plpgsql;

-- READ: Get player by ID
CREATE OR REPLACE FUNCTION get_player_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    player_name VARCHAR(255),
    birth_date DATE,
    height_inches INTEGER,
    weight_lbs INTEGER,
    position VARCHAR(10),
    jersey_number INTEGER,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.player_name, p.birth_date, p.height_inches, p.weight_lbs, 
           p.position, p.jersey_number, p.is_active
    FROM player p
    WHERE p.id = p_id;
END;
$$ LANGUAGE plpgsql;

-- READ: Get all players
CREATE OR REPLACE FUNCTION get_all_players()
RETURNS TABLE (
    id INTEGER,
    player_name VARCHAR(255),
    birth_date DATE,
    height_inches INTEGER,
    weight_lbs INTEGER,
    position VARCHAR(10),
    jersey_number INTEGER,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.player_name, p.birth_date, p.height_inches, p.weight_lbs, 
           p.position, p.jersey_number, p.is_active
    FROM player p
    ORDER BY p.player_name;
END;
$$ LANGUAGE plpgsql;

-- UPDATE: Update player height
CREATE OR REPLACE FUNCTION update_player_height(
    p_id INTEGER,
    p_new_height INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    UPDATE player
    SET height_inches = p_new_height,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- UPDATE: Update player info
CREATE OR REPLACE FUNCTION update_player(
    p_id INTEGER,
    p_player_name VARCHAR(255),
    p_birth_date DATE,
    p_height_inches INTEGER,
    p_weight_lbs INTEGER,
    p_position VARCHAR(10),
    p_jersey_number INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    UPDATE player
    SET player_name = p_player_name,
        birth_date = p_birth_date,
        height_inches = p_height_inches,
        weight_lbs = p_weight_lbs,
        position = p_position,
        jersey_number = p_jersey_number,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- DELETE: Delete player
CREATE OR REPLACE FUNCTION delete_player(p_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    DELETE FROM player WHERE id = p_id;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- TEAM CRUD FUNCTIONS
-- ==========================================

-- CREATE: Insert a new team
CREATE OR REPLACE FUNCTION insert_team(
    p_team_name VARCHAR(255),
    p_abbreviation VARCHAR(10),
    p_city VARCHAR(100),
    p_conference VARCHAR(20),
    p_division VARCHAR(50)
) RETURNS INTEGER AS $$
DECLARE
    new_team_id INTEGER;
BEGIN
    INSERT INTO team (team_name, abbreviation, city, conference, division)
    VALUES (p_team_name, p_abbreviation, p_city, p_conference, p_division)
    RETURNING id INTO new_team_id;
    
    RETURN new_team_id;
END;
$$ LANGUAGE plpgsql;

-- READ: Get team by name
CREATE OR REPLACE FUNCTION get_team_by_name(p_name VARCHAR(255))
RETURNS TABLE (
    id INTEGER,
    team_name VARCHAR(255),
    abbreviation VARCHAR(10),
    city VARCHAR(100),
    conference VARCHAR(20),
    division VARCHAR(50),
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.team_name, t.abbreviation, t.city, t.conference, t.division, t.is_active
    FROM team t
    WHERE t.team_name ILIKE '%' || p_name || '%'
    ORDER BY t.team_name;
END;
$$ LANGUAGE plpgsql;

-- READ: Get all teams
CREATE OR REPLACE FUNCTION get_all_teams()
RETURNS TABLE (
    id INTEGER,
    team_name VARCHAR(255),
    abbreviation VARCHAR(10),
    city VARCHAR(100),
    conference VARCHAR(20),
    division VARCHAR(50),
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.team_name, t.abbreviation, t.city, t.conference, t.division, t.is_active
    FROM team t
    ORDER BY t.team_name;
END;
$$ LANGUAGE plpgsql;

-- UPDATE: Update team info
CREATE OR REPLACE FUNCTION update_team(
    p_id INTEGER,
    p_team_name VARCHAR(255),
    p_city VARCHAR(100),
    p_conference VARCHAR(20),
    p_division VARCHAR(50)
) RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    UPDATE team
    SET team_name = p_team_name,
        city = p_city,
        conference = p_conference,
        division = p_division,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- DELETE: Delete team
CREATE OR REPLACE FUNCTION delete_team(p_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    DELETE FROM team WHERE id = p_id;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- USER NOTES CRUD FUNCTIONS
-- ==========================================

-- CREATE: Insert a new user note
CREATE OR REPLACE FUNCTION insert_user_note(
    p_user_id INTEGER,
    p_player_id INTEGER,
    p_team_id INTEGER,
    p_note_title VARCHAR(255),
    p_note_content TEXT
) RETURNS INTEGER AS $$
DECLARE
    new_note_id INTEGER;
BEGIN
    INSERT INTO user_notes (user_id, player_id, team_id, note_title, note_content)
    VALUES (p_user_id, p_player_id, p_team_id, p_note_title, p_note_content)
    RETURNING id INTO new_note_id;
    
    RETURN new_note_id;
END;
$$ LANGUAGE plpgsql;

-- READ: Get notes by user
CREATE OR REPLACE FUNCTION get_user_notes(p_user_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    player_id INTEGER,
    team_id INTEGER,
    note_title VARCHAR(255),
    note_content TEXT,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT n.id, n.player_id, n.team_id, n.note_title, n.note_content, n.created_at
    FROM user_notes n
    WHERE n.user_id = p_user_id
    ORDER BY n.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- UPDATE: Update user note
CREATE OR REPLACE FUNCTION update_user_note(
    p_id INTEGER,
    p_note_title VARCHAR(255),
    p_note_content TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    UPDATE user_notes
    SET note_title = p_note_title,
        note_content = p_note_content,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- DELETE: Delete user note
CREATE OR REPLACE FUNCTION delete_user_note(p_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    DELETE FROM user_notes WHERE id = p_id;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- USER COMPARISONS CRUD FUNCTIONS
-- ==========================================

-- CREATE: Insert a new player comparison
CREATE OR REPLACE FUNCTION insert_comparison(
    p_user_id INTEGER,
    p_player_1_id INTEGER,
    p_player_2_id INTEGER,
    p_comparison_name VARCHAR(255),
    p_notes TEXT
) RETURNS INTEGER AS $$
DECLARE
    new_comparison_id INTEGER;
BEGIN
    INSERT INTO user_comparisons (user_id, player_1_id, player_2_id, comparison_name, notes)
    VALUES (p_user_id, p_player_1_id, p_player_2_id, p_comparison_name, p_notes)
    RETURNING id INTO new_comparison_id;
    
    RETURN new_comparison_id;
END;
$$ LANGUAGE plpgsql;

-- READ: Get comparisons by user
CREATE OR REPLACE FUNCTION get_user_comparisons(p_user_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    player_1_id INTEGER,
    player_2_id INTEGER,
    comparison_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.player_1_id, c.player_2_id, c.comparison_name, c.notes, c.created_at
    FROM user_comparisons c
    WHERE c.user_id = p_user_id
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- DELETE: Delete comparison
CREATE OR REPLACE FUNCTION delete_comparison(p_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    rows_affected INTEGER;
BEGIN
    DELETE FROM user_comparisons WHERE id = p_id;
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- FILTERING & ANALYTICS FUNCTIONS
-- ==========================================

-- Get top scorers by season
CREATE OR REPLACE FUNCTION get_top_scorers(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    player_id INTEGER,
    player_name VARCHAR(255),
    points_per_game DECIMAL(10, 2),
    games_played INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH aggregated_stats AS (
        SELECT 
            pss.player_id,
            MAX(pss.points) as max_points,
            MAX(pss.games_played) as max_games
        FROM player_season_stats pss
        WHERE pss.season_id = p_season_id AND pss.games_played > 0
        GROUP BY pss.player_id
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY a.max_points DESC)::INTEGER as rank,
        p.id,
        p.player_name,
        a.max_points,
        a.max_games
    FROM aggregated_stats a
    JOIN player p ON a.player_id = p.id
    ORDER BY a.max_points DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get top assist leaders by season
CREATE OR REPLACE FUNCTION get_top_assists(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    player_id INTEGER,
    player_name VARCHAR(255),
    assists_per_game DECIMAL(10, 2),
    games_played INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH aggregated_stats AS (
        SELECT 
            pss.player_id,
            MAX(pss.assists) as max_assists,
            MAX(pss.games_played) as max_games
        FROM player_season_stats pss
        WHERE pss.season_id = p_season_id AND pss.games_played > 0
        GROUP BY pss.player_id
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY a.max_assists DESC)::INTEGER as rank,
        p.id,
        p.player_name,
        a.max_assists,
        a.max_games
    FROM aggregated_stats a
    JOIN player p ON a.player_id = p.id
    ORDER BY a.max_assists DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get top rebounds leaders by season
CREATE OR REPLACE FUNCTION get_top_rebounds(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    player_id INTEGER,
    player_name VARCHAR(255),
    rebounds_per_game DECIMAL(10, 2),
    games_played INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH aggregated_stats AS (
        SELECT 
            pss.player_id,
            MAX(pss.rebounds) as max_rebounds,
            MAX(pss.games_played) as max_games
        FROM player_season_stats pss
        WHERE pss.season_id = p_season_id AND pss.games_played > 0
        GROUP BY pss.player_id
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY a.max_rebounds DESC)::INTEGER as rank,
        p.id,
        p.player_name,
        a.max_rebounds,
        a.max_games
    FROM aggregated_stats a
    JOIN player p ON a.player_id = p.id
    ORDER BY a.max_rebounds DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get top steals leaders by season
CREATE OR REPLACE FUNCTION get_top_steals(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    player_id INTEGER,
    player_name VARCHAR(255),
    steals_per_game DECIMAL(10, 2),
    games_played INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH aggregated_stats AS (
        SELECT 
            pss.player_id,
            MAX(pss.steals) as max_steals,
            MAX(pss.games_played) as max_games
        FROM player_season_stats pss
        WHERE pss.season_id = p_season_id AND pss.games_played > 0
        GROUP BY pss.player_id
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY a.max_steals DESC)::INTEGER as rank,
        p.id,
        p.player_name,
        a.max_steals,
        a.max_games
    FROM aggregated_stats a
    JOIN player p ON a.player_id = p.id
    ORDER BY a.max_steals DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get players by position
CREATE OR REPLACE FUNCTION get_players_by_position(p_position VARCHAR(10))
RETURNS TABLE (
    id INTEGER,
    player_name VARCHAR(255),
    height_inches INTEGER,
    weight_lbs INTEGER,
    jersey_number INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.player_name, p.height_inches, p.weight_lbs, p.jersey_number
    FROM player p
    WHERE p.position = p_position AND p.is_active = TRUE
    ORDER BY p.player_name;
END;
$$ LANGUAGE plpgsql;

-- Get player stats with team info
CREATE OR REPLACE FUNCTION get_player_stats_detail(p_player_id INTEGER, p_season_id INTEGER)
RETURNS TABLE (
    player_name VARCHAR(255),
    team_name VARCHAR(255),
    games_played INTEGER,
    points DECIMAL(10, 2),
    rebounds DECIMAL(10, 2),
    assists DECIMAL(10, 2),
    steals DECIMAL(10, 2),
    blocks DECIMAL(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.player_name,
        t.team_name,
        pss.games_played,
        pss.points,
        pss.rebounds,
        pss.assists,
        pss.steals,
        pss.blocks
    FROM player_season_stats pss
    JOIN player p ON pss.player_id = p.id
    LEFT JOIN team t ON pss.team_id = t.id
    WHERE pss.player_id = p_player_id AND pss.season_id = p_season_id;
END;
$$ LANGUAGE plpgsql;

-- Search players by multiple criteria
CREATE OR REPLACE FUNCTION search_players(
    p_name_query VARCHAR(255) DEFAULT NULL,
    p_position VARCHAR(10) DEFAULT NULL,
    p_min_height INTEGER DEFAULT NULL,
    p_max_height INTEGER DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    player_name VARCHAR(255),
    position VARCHAR(10),
    height_inches INTEGER,
    weight_lbs INTEGER,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.player_name, p.position, p.height_inches, p.weight_lbs, p.is_active
    FROM player p
    WHERE 
        (p_name_query IS NULL OR p.player_name ILIKE '%' || p_name_query || '%')
        AND (p_position IS NULL OR p.position = p_position)
        AND (p_min_height IS NULL OR p.height_inches >= p_min_height)
        AND (p_max_height IS NULL OR p.height_inches <= p_max_height)
    ORDER BY p.player_name;
END;
$$ LANGUAGE plpgsql;

-- Get leaderboard from materialized table
CREATE OR REPLACE FUNCTION get_points_leaderboard(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    player_name VARCHAR(255),
    points_per_game DECIMAL(10, 2),
    games_played INTEGER,
    total_points INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.rank,
        p.player_name,
        l.points_per_game,
        l.games_played,
        l.total_points
    FROM leaderboard_pts l
    JOIN player p ON l.player_id = p.id
    WHERE l.season_id = p_season_id
    ORDER BY l.rank
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get efficiency leaderboard
CREATE OR REPLACE FUNCTION get_efficiency_leaderboard(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    player_name VARCHAR(255),
    efficiency_rating DECIMAL(10, 2),
    games_played INTEGER,
    minutes_played DECIMAL(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY am.player_efficiency_rating DESC NULLS LAST)::INTEGER as rank,
        p.player_name,
        am.player_efficiency_rating,
        pss.games_played,
        pss.minutes_played
    FROM advanced_metrics am
    JOIN player p ON am.player_id = p.id
    JOIN player_season_stats pss ON am.player_id = pss.player_id AND am.season_id = pss.season_id
    WHERE am.season_id = p_season_id AND pss.games_played > 0
    ORDER BY am.player_efficiency_rating DESC NULLS LAST
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- AUDIT LOG TRIGGER FUNCTIONS
-- ==========================================

-- Function to log player changes
CREATE OR REPLACE FUNCTION log_player_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, record_id, new_values)
        VALUES ('player', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, record_id, old_values, new_values)
        VALUES ('player', 'UPDATE', NEW.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, record_id, old_values)
        VALUES ('player', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for player audit
CREATE TRIGGER player_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON player
FOR EACH ROW EXECUTE FUNCTION log_player_changes();

-- Function to log team changes
CREATE OR REPLACE FUNCTION log_team_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, record_id, new_values)
        VALUES ('team', 'INSERT', NEW.id, row_to_json(NEW)::jsonb);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, record_id, old_values, new_values)
        VALUES ('team', 'UPDATE', NEW.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, record_id, old_values)
        VALUES ('team', 'DELETE', OLD.id, row_to_json(OLD)::jsonb);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for team audit
CREATE TRIGGER team_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON team
FOR EACH ROW EXECUTE FUNCTION log_team_changes();

-- ==========================================
-- TEAM COMPARISON & LEADERBOARDS
-- ==========================================

-- Compare two teams
CREATE OR REPLACE FUNCTION compare_teams(
    p_team1_id INTEGER,
    p_team2_id INTEGER,
    p_season_id INTEGER
)
RETURNS TABLE (
    team1_name VARCHAR(255),
    team2_name VARCHAR(255),
    team1_games INTEGER,
    team2_games INTEGER,
    team1_points DECIMAL(10, 2),
    team2_points DECIMAL(10, 2),
    team1_assists DECIMAL(10, 2),
    team2_assists DECIMAL(10, 2),
    team1_rebounds DECIMAL(10, 2),
    team2_rebounds DECIMAL(10, 2),
    team1_steals DECIMAL(10, 2),
    team2_steals DECIMAL(10, 2),
    team1_blocks DECIMAL(10, 2),
    team2_blocks DECIMAL(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t1.team_name,
        t2.team_name,
        tss1.games_played,
        tss2.games_played,
        tss1.points,
        tss2.points,
        tss1.assists,
        tss2.assists,
        tss1.rebounds,
        tss2.rebounds,
        tss1.steals,
        tss2.steals,
        tss1.blocks,
        tss2.blocks
    FROM team t1
    CROSS JOIN team t2
    LEFT JOIN team_season_stats tss1 ON t1.id = tss1.team_id AND tss1.season_id = p_season_id
    LEFT JOIN team_season_stats tss2 ON t2.id = tss2.team_id AND tss2.season_id = p_season_id
    WHERE t1.id = p_team1_id AND t2.id = p_team2_id;
END;
$$ LANGUAGE plpgsql;

-- Get team points leaderboard
CREATE OR REPLACE FUNCTION get_team_points_leaderboard(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    team_id INTEGER,
    team_name VARCHAR(255),
    points_per_game DECIMAL(10, 2),
    games_played INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY tss.points DESC)::INTEGER as rank,
        t.id,
        t.team_name,
        tss.points,
        tss.games_played
    FROM team_season_stats tss
    JOIN team t ON tss.team_id = t.id
    WHERE tss.season_id = p_season_id AND tss.games_played > 0
    ORDER BY tss.points DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get team assists leaderboard
CREATE OR REPLACE FUNCTION get_team_assists_leaderboard(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    team_id INTEGER,
    team_name VARCHAR(255),
    assists_per_game DECIMAL(10, 2),
    games_played INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY tss.assists DESC)::INTEGER as rank,
        t.id,
        t.team_name,
        tss.assists,
        tss.games_played
    FROM team_season_stats tss
    JOIN team t ON tss.team_id = t.id
    WHERE tss.season_id = p_season_id AND tss.games_played > 0
    ORDER BY tss.assists DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get team rebounds leaderboard
CREATE OR REPLACE FUNCTION get_team_rebounds_leaderboard(p_season_id INTEGER, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    team_id INTEGER,
    team_name VARCHAR(255),
    rebounds_per_game DECIMAL(10, 2),
    games_played INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY tss.rebounds DESC)::INTEGER as rank,
        t.id,
        t.team_name,
        tss.rebounds,
        tss.games_played
    FROM team_season_stats tss
    JOIN team t ON tss.team_id = t.id
    WHERE tss.season_id = p_season_id AND tss.games_played > 0
    ORDER BY tss.rebounds DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- GAME FUNCTIONS
-- ==========================================

-- Get recent games
CREATE OR REPLACE FUNCTION get_recent_games(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id INTEGER,
    game_id VARCHAR(50),
    game_date_time TIMESTAMP,
    home_team VARCHAR(255),
    away_team VARCHAR(255),
    home_score INTEGER,
    away_score INTEGER,
    game_type VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.game_id,
        g.game_date_time,
        t1.team_name as home_team,
        t2.team_name as away_team,
        g.home_score,
        g.away_score,
        g.game_type
    FROM game g
    LEFT JOIN team t1 ON g.home_team_id = t1.id
    LEFT JOIN team t2 ON g.away_team_id = t2.id
    ORDER BY g.game_date_time DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get games by team
CREATE OR REPLACE FUNCTION get_games_by_team(p_team_id INTEGER, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
    id INTEGER,
    game_id VARCHAR(50),
    game_date_time TIMESTAMP,
    opponent_team VARCHAR(255),
    is_home BOOLEAN,
    team_score INTEGER,
    opponent_score INTEGER,
    won BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.game_id,
        g.game_date_time,
        CASE WHEN g.home_team_id = p_team_id THEN t2.team_name ELSE t1.team_name END as opponent_team,
        g.home_team_id = p_team_id as is_home,
        CASE WHEN g.home_team_id = p_team_id THEN g.home_score ELSE g.away_score END as team_score,
        CASE WHEN g.home_team_id = p_team_id THEN g.away_score ELSE g.home_score END as opponent_score,
        g.winner_team_id = p_team_id as won
    FROM game g
    LEFT JOIN team t1 ON g.home_team_id = t1.id
    LEFT JOIN team t2 ON g.away_team_id = t2.id
    WHERE g.home_team_id = p_team_id OR g.away_team_id = p_team_id
    ORDER BY g.game_date_time DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
