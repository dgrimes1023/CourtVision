-- CREATE TABLES
CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    team_abbreviation VARCHAR(10),
    age INT
);

CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_abbreviation VARCHAR(10) NOT NULL UNIQUE
);

-- INSERT SAMPLE DATA
INSERT INTO players (player_name, team_abbreviation, age) VALUES
('LeBron James', 'LAL', 38),
('Stephen Curry', 'GSW', 36);

INSERT INTO teams (team_abbreviation) VALUES ('LAL'), ('GSW');

-- SELECT QUERIES
SELECT * FROM players;
SELECT * FROM teams;
