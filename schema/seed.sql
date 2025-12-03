-- Sample seed data for CourtVision Checkpoint 2
-- Run this after schema.sql and functions.sql to populate with demo data

-- Insert sample season
INSERT INTO season (season_year, start_date, end_date, is_current) VALUES
('2023-24', '2023-10-24', '2024-04-14', true);

-- Insert sample teams
INSERT INTO team (team_name, abbreviation, city, conference, division) VALUES
('Los Angeles Lakers', 'LAL', 'Los Angeles', 'Western', 'Pacific'),
('Boston Celtics', 'BOS', 'Boston', 'Eastern', 'Atlantic'),
('Golden State Warriors', 'GSW', 'San Francisco', 'Western', 'Pacific'),
('Miami Heat', 'MIA', 'Miami', 'Eastern', 'Southeast'),
('Milwaukee Bucks', 'MIL', 'Milwaukee', 'Eastern', 'Central');

-- Insert sample players using the insert_player function
SELECT insert_player('LeBron James', '1984-12-30', 81, 250, 'SF', 23);
SELECT insert_player('Stephen Curry', '1988-03-14', 74, 185, 'PG', 30);
SELECT insert_player('Kevin Durant', '1988-09-29', 82, 240, 'SF', 35);
SELECT insert_player('Giannis Antetokounmpo', '1994-12-06', 83, 242, 'PF', 34);
SELECT insert_player('Luka Doncic', '1999-02-28', 79, 230, 'PG', 77);
SELECT insert_player('Joel Embiid', '1994-03-16', 84, 280, 'C', 21);
SELECT insert_player('Nikola Jokic', '1995-02-19', 83, 284, 'C', 15);
SELECT insert_player('Jayson Tatum', '1998-03-03', 80, 210, 'SF', 0);
SELECT insert_player('Damian Lillard', '1990-07-15', 74, 195, 'PG', 0);
SELECT insert_player('Anthony Davis', '1993-03-11', 82, 253, 'PF', 3);

-- Insert sample player stats for the current season
INSERT INTO player_season_stats (player_id, season_id, team_id, games_played, minutes_played, points, rebounds, assists, steals, blocks, turnovers) VALUES
(1, 1, 1, 55, 35.3, 25.4, 7.2, 8.1, 1.2, 0.6, 3.5),
(2, 1, 3, 62, 32.8, 29.7, 4.5, 5.1, 1.6, 0.4, 2.8),
(3, 1, 3, 48, 36.9, 28.3, 6.6, 5.0, 0.9, 1.2, 3.1),
(4, 1, 5, 58, 34.6, 30.2, 11.3, 5.8, 1.1, 1.5, 3.4),
(5, 1, 1, 60, 37.4, 32.1, 8.9, 9.2, 1.4, 0.5, 4.0),
(6, 1, 2, 52, 34.2, 34.6, 10.8, 5.5, 1.0, 1.7, 3.2),
(7, 1, 3, 68, 34.5, 26.4, 12.4, 9.0, 1.3, 0.9, 3.1),
(8, 1, 2, 64, 36.1, 26.9, 8.1, 4.9, 1.0, 0.6, 2.5),
(9, 1, 5, 61, 35.8, 24.3, 4.2, 7.0, 1.0, 0.3, 2.4),
(10, 1, 1, 54, 34.7, 24.7, 12.6, 3.5, 1.2, 2.3, 2.1);

-- Insert leaderboard data for points
INSERT INTO leaderboard_pts (player_id, season_id, rank, points_per_game, games_played, total_points) VALUES
(6, 1, 1, 34.6, 52, 1799),
(5, 1, 2, 32.1, 60, 1926),
(4, 1, 3, 30.2, 58, 1752),
(2, 1, 4, 29.7, 62, 1841),
(3, 1, 5, 28.3, 48, 1358),
(8, 1, 6, 26.9, 64, 1722),
(7, 1, 7, 26.4, 68, 1795),
(1, 1, 8, 25.4, 55, 1397),
(10, 1, 9, 24.7, 54, 1334),
(9, 1, 10, 24.3, 61, 1482);

-- Insert leaderboard data for assists
INSERT INTO leaderboard_ast (player_id, season_id, rank, assists_per_game, games_played, total_assists) VALUES
(5, 1, 1, 9.2, 60, 552),
(7, 1, 2, 9.0, 68, 612),
(1, 1, 3, 8.1, 55, 446),
(9, 1, 4, 7.0, 61, 427),
(4, 1, 5, 5.8, 58, 336),
(6, 1, 6, 5.5, 52, 286),
(2, 1, 7, 5.1, 62, 316),
(3, 1, 8, 5.0, 48, 240),
(8, 1, 9, 4.9, 64, 314),
(10, 1, 10, 3.5, 54, 189);

-- Insert sample shooting zones
INSERT INTO shooting_zones (zone_name, description, min_distance_ft, max_distance_ft) VALUES
('Paint', 'Area inside the free throw lane', 0, 8),
('Mid-Range', 'Between paint and 3-point line', 8, 23),
('Corner 3 Left', 'Left corner three-point area', 23, 24),
('Corner 3 Right', 'Right corner three-point area', 23, 24),
('Above Break 3', 'Three-point line above the break', 23, 24);

-- Insert sample app user
INSERT INTO app_user (username, email, password_hash, first_name, last_name) VALUES
('demo_user', 'demo@courtvision.com', '$2b$12$demohashdemohashdemohashdemo', 'Demo', 'User');

-- Insert sample user favorites
INSERT INTO user_favorites_players (user_id, player_id) VALUES
(1, 1), (1, 2), (1, 5);

INSERT INTO user_favorites_teams (user_id, team_id) VALUES
(1, 1), (1, 2);

-- Insert sample user note
INSERT INTO user_notes (user_id, player_id, note_title, note_content) VALUES
(1, 1, 'LeBron Performance', 'Still putting up amazing numbers at age 39. Triple-double threat every night.');

-- Insert sample player comparison
INSERT INTO user_comparisons (user_id, player_1_id, player_2_id, comparison_name, notes) VALUES
(1, 2, 5, 'Elite Point Guards', 'Comparing two of the best playmakers in the league');

COMMIT;

-- Verify data was inserted
SELECT 'Players loaded:' as message, COUNT(*) as count FROM player;
SELECT 'Teams loaded:' as message, COUNT(*) as count FROM team;
SELECT 'Stats loaded:' as message, COUNT(*) as count FROM player_season_stats;
SELECT 'Leaderboard entries:' as message, COUNT(*) as count FROM leaderboard_pts;
