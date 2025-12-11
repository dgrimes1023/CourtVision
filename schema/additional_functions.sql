-- Additional functions for rebounds, steals, and player comparison

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
    SELECT 
        ROW_NUMBER() OVER (ORDER BY pss.rebounds DESC)::INTEGER as rank,
        p.id,
        p.player_name,
        pss.rebounds,
        pss.games_played
    FROM player_season_stats pss
    JOIN player p ON pss.player_id = p.id
    WHERE pss.season_id = p_season_id AND pss.games_played > 0
    ORDER BY pss.rebounds DESC
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
    SELECT 
        ROW_NUMBER() OVER (ORDER BY pss.steals DESC)::INTEGER as rank,
        p.id,
        p.player_name,
        pss.steals,
        pss.games_played
    FROM player_season_stats pss
    JOIN player p ON pss.player_id = p.id
    WHERE pss.season_id = p_season_id AND pss.games_played > 0
    ORDER BY pss.steals DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Get comprehensive player stats for comparison
CREATE OR REPLACE FUNCTION get_player_stats(p_player_id INTEGER, p_season_id INTEGER)
RETURNS TABLE (
    player_id INTEGER,
    player_name VARCHAR(255),
    position VARCHAR(10),
    height_inches INTEGER,
    weight_lbs INTEGER,
    games_played INTEGER,
    points_per_game DECIMAL(10, 2),
    assists_per_game DECIMAL(10, 2),
    rebounds_per_game DECIMAL(10, 2),
    steals_per_game DECIMAL(10, 2),
    blocks_per_game DECIMAL(10, 2),
    field_goal_percentage DECIMAL(5, 4),
    three_point_percentage DECIMAL(5, 4),
    free_throw_percentage DECIMAL(5, 4)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.player_name,
        p.position,
        p.height_inches,
        p.weight_lbs,
        pss.games_played,
        pss.points,
        pss.assists,
        pss.rebounds,
        pss.steals,
        pss.blocks,
        pss.field_goal_percentage,
        pss.three_point_percentage,
        pss.free_throw_percentage
    FROM player p
    LEFT JOIN player_season_stats pss ON p.id = pss.player_id AND pss.season_id = p_season_id
    WHERE p.id = p_player_id;
END;
$$ LANGUAGE plpgsql;
