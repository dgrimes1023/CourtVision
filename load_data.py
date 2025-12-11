#!/usr/bin/env python3
"""
CourtVision Data Loading Script
Loads CSV datasets into the PostgreSQL database
Author: CS3620 Student
Date: December 11, 2025
"""

import psycopg2
from psycopg2.extras import execute_batch
import csv
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('api/.env')

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'courtvision'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres')
}

def get_connection():
    """Create database connection"""
    return psycopg2.connect(**DB_CONFIG)

def parse_date(date_str):
    """Parse date string to date object"""
    if not date_str or date_str == '':
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except:
        return None

def parse_datetime(datetime_str):
    """Parse datetime string to datetime object"""
    if not datetime_str or datetime_str == '':
        return None
    try:
        return datetime.strptime(datetime_str, '%Y-%m-%d %H:%M:%S')
    except:
        return None

def parse_int(value, max_value=None):
    """Parse integer value"""
    if not value or value == '':
        return None
    try:
        result = int(float(value))
        # Validate against max_value if provided
        if max_value and result > max_value:
            return None
        return result
    except:
        return None

def parse_float(value):
    """Parse float value"""
    if not value or value == '':
        return None
    try:
        return float(value)
    except:
        return None

def parse_bool(value):
    """Parse boolean value"""
    if not value or value == '':
        return False
    return value.lower() in ('true', 't', '1', 'yes')

def load_players(conn):
    """Load Players.csv into players_raw and player tables"""
    print("\n📊 Loading Players...")
    cursor = conn.cursor()
    
    with open('datasets/Players.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        raw_data = []
        player_data = []
        
        for row in reader:
            # Skip invalid rows
            if not row.get('personId') or row.get('personId') == '':
                continue
                
            # Load into players_raw
            raw_data.append((
                row.get('firstName', ''),
                row.get('lastName', ''),
                parse_date(row.get('birthdate')),
                parse_int(row.get('height')),
                parse_int(row.get('bodyWeight')),
                row.get('lastAttended', ''),
                row.get('country', ''),
                parse_int(row.get('draftYear')),
                parse_int(row.get('draftRound')),
                parse_int(row.get('draftNumber'))
            ))
            
            # Determine position from guard/forward/center columns
            position = None
            if parse_bool(row.get('guard')):
                position = 'PG'
            elif parse_bool(row.get('forward')):
                position = 'SF'
            elif parse_bool(row.get('center')):
                position = 'C'
            
            # Load into player table
            full_name = f"{row.get('firstName', '')} {row.get('lastName', '')}".strip()
            if full_name:
                # Validate weight (reasonable range: 150-350 lbs)
                weight = parse_int(row.get('bodyWeight'), max_value=500)
                player_data.append((
                    full_name,
                    parse_date(row.get('birthdate')),
                    parse_int(row.get('height')),
                    weight,
                    position,
                    None  # jersey_number
                ))
        
        # Insert into players_raw
        execute_batch(cursor, """
            INSERT INTO players_raw (player_name, birth_date, height_inches, weight_lbs, college, country, 
                                    draft_year, draft_round, draft_number)
            VALUES (%s || ' ' || %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
        """, [(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9]) for r in raw_data[:1000]])
        
        # Insert into player table (avoiding duplicates)
        execute_batch(cursor, """
            INSERT INTO player (player_name, birth_date, height_inches, weight_lbs, position, jersey_number)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING
        """, player_data[:1000])
        
        conn.commit()
        print(f"✓ Loaded {len(raw_data[:1000])} players into raw table")
        print(f"✓ Loaded {len(player_data[:1000])} players into player table")

def load_teams(conn):
    """Load team data from TeamStatistics.csv"""
    print("\n📊 Loading Teams...")
    cursor = conn.cursor()
    
    teams = {}
    with open('datasets/TeamStatistics.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            team_id = row.get('teamId')
            if team_id and team_id not in teams:
                teams[team_id] = {
                    'name': row.get('teamName', ''),
                    'city': row.get('teamCity', ''),
                    'id': team_id
                }
    
    # Determine conference and division based on city/team name
    conferences = {
        'Lakers': ('Western', 'Pacific'),
        'Warriors': ('Western', 'Pacific'),
        'Suns': ('Western', 'Pacific'),
        'Thunder': ('Western', 'Northwest'),
        'Spurs': ('Western', 'Southwest'),
        'Celtics': ('Eastern', 'Atlantic'),
        'Knicks': ('Eastern', 'Atlantic'),
        'Raptors': ('Eastern', 'Atlantic'),
        'Heat': ('Eastern', 'Southeast'),
        'Magic': ('Eastern', 'Southeast'),
    }
    
    team_data = []
    for team_id, info in teams.items():
        conference, division = 'Western', 'Pacific'  # defaults
        for key, (conf, div) in conferences.items():
            if key in info['name']:
                conference, division = conf, div
                break
        
        # Create abbreviation from team name
        abbrev = ''.join([word[0] for word in info['name'].split()[:3]]).upper()
        
        team_data.append((
            f"{info['city']} {info['name']}",
            abbrev,
            info['city'],
            conference,
            division
        ))
    
    execute_batch(cursor, """
        INSERT INTO team (team_name, abbreviation, city, conference, division)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (abbreviation) DO NOTHING
    """, team_data)
    
    conn.commit()
    print(f"✓ Loaded {len(team_data)} teams")

def load_games(conn):
    """Load Games.csv into game table"""
    print("\n📊 Loading Games...")
    cursor = conn.cursor()
    
    # First get team ID mapping - team_name in DB already includes city name
    cursor.execute("SELECT id, team_name FROM team")
    teams = {row[1]: row[0] for row in cursor.fetchall()}
    
    game_data = []
    with open('datasets/Games.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Skip rows without valid game datetime
            game_dt = parse_datetime(row.get('gameDateTimeEst'))
            if not game_dt:
                continue
            
            home_team_name = f"{row.get('hometeamCity', '')} {row.get('hometeamName', '')}".strip()
            away_team_name = f"{row.get('awayteamCity', '')} {row.get('awayteamName', '')}".strip()
            
            home_team_id = teams.get(home_team_name)
            away_team_id = teams.get(away_team_name)
            
            # Skip if we don't have both teams
            if not home_team_id or not away_team_id:
                continue
            
            winner_id = teams.get(home_team_name) if row.get('homeScore', 0) > row.get('awayScore', 0) else teams.get(away_team_name)
            
            game_data.append((
                row.get('gameId'),
                game_dt,
                home_team_id,
                away_team_id,
                parse_int(row.get('homeScore')),
                parse_int(row.get('awayScore')),
                winner_id,
                row.get('gameType', ''),
                parse_int(row.get('attendance')),
                row.get('gameLabel', ''),
                row.get('gameSubLabel', '')
            ))
    
    execute_batch(cursor, """
        INSERT INTO game (game_id, game_date_time, home_team_id, away_team_id, home_score, away_score,
                         winner_team_id, game_type, attendance, game_label, game_sublabel)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (game_id) DO NOTHING
    """, game_data)
    
    conn.commit()
    print(f"✓ Loaded {len(game_data)} games")

def load_player_statistics(conn):
    """Load PlayerStatistics.csv into player_season_stats"""
    print("\n📊 Loading Player Statistics...")
    cursor = conn.cursor()
    
    # Get player ID mapping
    cursor.execute("SELECT id, player_name FROM player")
    players = {row[1]: row[0] for row in cursor.fetchall()}
    
    # Get team ID mapping - team_name in DB already includes city name
    cursor.execute("SELECT id, team_name FROM team")
    teams = {row[1]: row[0] for row in cursor.fetchall()}
    
    # Get season ID (assume season 1 for now)
    cursor.execute("SELECT id FROM season WHERE season_year = '2023-24'")
    season_result = cursor.fetchone()
    season_id = season_result[0] if season_result else 1
    
    stats_data = {}
    with open('datasets/PlayerStatistics.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            player_name = f"{row.get('firstName', '')} {row.get('lastName', '')}".strip()
            player_id = players.get(player_name)
            
            if not player_id:
                continue
            
            team_name = f"{row.get('playerteamCity', '')} {row.get('playerteamName', '')}".strip()
            team_id = teams.get(team_name)
            
            # Aggregate stats per player
            key = (player_id, season_id, team_id)
            if key not in stats_data:
                stats_data[key] = {
                    'games': 0,
                    'minutes': 0,
                    'points': 0,
                    'assists': 0,
                    'rebounds': 0,
                    'steals': 0,
                    'blocks': 0,
                    'turnovers': 0,
                    'fg_made': 0,
                    'fg_attempted': 0,
                    'three_made': 0,
                    'three_attempted': 0,
                    'ft_made': 0,
                    'ft_attempted': 0
                }
            
            stats = stats_data[key]
            stats['games'] += 1
            stats['minutes'] += parse_float(row.get('numMinutes', 0)) or 0
            stats['points'] += parse_int(row.get('points', 0)) or 0
            stats['assists'] += parse_int(row.get('assists', 0)) or 0
            stats['rebounds'] += parse_int(row.get('reboundsTotal', 0)) or 0
            stats['steals'] += parse_int(row.get('steals', 0)) or 0
            stats['blocks'] += parse_int(row.get('blocks', 0)) or 0
            stats['turnovers'] += parse_int(row.get('turnovers', 0)) or 0
            stats['fg_made'] += parse_int(row.get('fieldGoalsMade', 0)) or 0
            stats['fg_attempted'] += parse_int(row.get('fieldGoalsAttempted', 0)) or 0
            stats['three_made'] += parse_int(row.get('threePointersMade', 0)) or 0
            stats['three_attempted'] += parse_int(row.get('threePointersAttempted', 0)) or 0
            stats['ft_made'] += parse_int(row.get('freeThrowsMade', 0)) or 0
            stats['ft_attempted'] += parse_int(row.get('freeThrowsAttempted', 0)) or 0
    
    # Insert aggregated stats
    insert_data = []
    for (player_id, season_id, team_id), stats in stats_data.items():
        if stats['games'] > 0:
            insert_data.append((
                player_id,
                season_id,
                team_id,
                stats['games'],
                stats['minutes'] / stats['games'],
                stats['points'] / stats['games'],
                stats['rebounds'] / stats['games'],
                stats['assists'] / stats['games'],
                stats['steals'] / stats['games'],
                stats['blocks'] / stats['games'],
                stats['turnovers'] / stats['games'],
                stats['fg_made'],
                stats['fg_attempted'],
                stats['three_made'],
                stats['three_attempted'],
                stats['ft_made'],
                stats['ft_attempted']
            ))
    
    execute_batch(cursor, """
        INSERT INTO player_season_stats 
        (player_id, season_id, team_id, games_played, minutes_played, points, rebounds, assists, 
         steals, blocks, turnovers, field_goals_made, field_goals_attempted, 
         three_pointers_made, three_pointers_attempted, free_throws_made, free_throws_attempted)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (player_id, season_id) 
        DO UPDATE SET
            games_played = EXCLUDED.games_played,
            minutes_played = EXCLUDED.minutes_played,
            points = EXCLUDED.points,
            rebounds = EXCLUDED.rebounds,
            assists = EXCLUDED.assists
    """, insert_data)
    
    conn.commit()
    print(f"✓ Loaded statistics for {len(insert_data)} player-season combinations")

def load_team_statistics(conn):
    """Load TeamStatistics.csv into team_season_stats"""
    print("\n📊 Loading Team Statistics...")
    cursor = conn.cursor()
    
    # Get team ID mapping - team_name in DB already includes city name
    cursor.execute("SELECT id, team_name FROM team")
    teams = {row[1]: row[0] for row in cursor.fetchall()}
    
    # Create seasons as needed
    seasons_cache = {}
    
    def get_or_create_season(game_date):
        """Get or create season based on game date"""
        if not game_date:
            return 1
        
        year = game_date.year
        month = game_date.month
        
        # NBA season runs Oct-June, so Oct-Dec belong to season starting that year
        # Jan-June belong to season that started previous year
        if month >= 10:
            season_year = f"{year}-{str(year + 1)[2:]}"
        else:
            season_year = f"{year - 1}-{str(year)[2:]}"
        
        if season_year in seasons_cache:
            return seasons_cache[season_year]
        
        # Check if season exists
        cursor.execute("SELECT id FROM season WHERE season_year = %s", (season_year,))
        result = cursor.fetchone()
        if result:
            seasons_cache[season_year] = result[0]
            return result[0]
        
        # Create new season with placeholder dates
        start_year = int(season_year.split('-')[0])
        start_date = f"{start_year}-10-01"
        end_date = f"{start_year + 1}-06-30"
        
        cursor.execute("""
            INSERT INTO season (season_year, start_date, end_date, is_current)
            VALUES (%s, %s, %s, FALSE)
            RETURNING id
        """, (season_year, start_date, end_date))
        season_id = cursor.fetchone()[0]
        conn.commit()
        seasons_cache[season_year] = season_id
        return season_id
    
    stats_data = {}
    with open('datasets/TeamStatistics.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            team_name = f"{row.get('teamCity', '')} {row.get('teamName', '')}".strip()
            team_id = teams.get(team_name)
            
            if not team_id:
                continue
            
            # Get season based on game date
            game_date = parse_datetime(row.get('gameDateTimeEst'))
            season_id = get_or_create_season(game_date)
            
            key = (team_id, season_id)
            if key not in stats_data:
                stats_data[key] = {
                    'wins': 0,
                    'losses': 0,
                    'points': 0,
                    'points_allowed': 0,
                    'games': 0
                }
            
            stats = stats_data[key]
            stats['games'] += 1
            if parse_bool(row.get('win')):
                stats['wins'] += 1
            else:
                stats['losses'] += 1
            stats['points'] += parse_int(row.get('teamScore', 0)) or 0
            stats['points_allowed'] += parse_int(row.get('opponentScore', 0)) or 0
    
    insert_data = []
    for (team_id, season_id), stats in stats_data.items():
        if stats['games'] > 0:
            win_pct = stats['wins'] / stats['games']
            ppg = stats['points'] / stats['games']
            papg = stats['points_allowed'] / stats['games']
            
            insert_data.append((
                team_id,
                season_id,
                stats['wins'],
                stats['losses'],
                win_pct,
                ppg,
                papg
            ))
    
    execute_batch(cursor, """
        INSERT INTO team_season_stats 
        (team_id, season_id, wins, losses, win_percentage, points_per_game, points_allowed_per_game)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (team_id, season_id)
        DO UPDATE SET
            wins = EXCLUDED.wins,
            losses = EXCLUDED.losses,
            win_percentage = EXCLUDED.win_percentage
    """, insert_data)
    
    conn.commit()
    print(f"✓ Loaded statistics for {len(insert_data)} team-season combinations")

def refresh_leaderboards(conn):
    """Refresh leaderboard tables"""
    print("\n📊 Refreshing Leaderboards...")
    cursor = conn.cursor()
    
    # Get season ID
    cursor.execute("SELECT id FROM season WHERE season_year = '2023-24'")
    season_result = cursor.fetchone()
    season_id = season_result[0] if season_result else 1
    
    # Refresh points leaderboard
    cursor.execute("""
        INSERT INTO leaderboard_pts (player_id, season_id, rank, points_per_game, games_played, total_points)
        SELECT 
            player_id,
            season_id,
            ROW_NUMBER() OVER (ORDER BY points DESC) as rank,
            points,
            games_played,
            (points * games_played)::INTEGER as total_points
        FROM player_season_stats
        WHERE season_id = %s AND games_played > 0
        ORDER BY points DESC
        ON CONFLICT (player_id, season_id) 
        DO UPDATE SET
            rank = EXCLUDED.rank,
            points_per_game = EXCLUDED.points_per_game,
            total_points = EXCLUDED.total_points
    """, (season_id,))
    
    # Refresh assists leaderboard
    cursor.execute("""
        INSERT INTO leaderboard_ast (player_id, season_id, rank, assists_per_game, games_played, total_assists)
        SELECT 
            player_id,
            season_id,
            ROW_NUMBER() OVER (ORDER BY assists DESC) as rank,
            assists,
            games_played,
            (assists * games_played)::INTEGER as total_assists
        FROM player_season_stats
        WHERE season_id = %s AND games_played > 0
        ORDER BY assists DESC
        ON CONFLICT (player_id, season_id)
        DO UPDATE SET
            rank = EXCLUDED.rank,
            assists_per_game = EXCLUDED.assists_per_game,
            total_assists = EXCLUDED.total_assists
    """, (season_id,))
    
    conn.commit()
    print("✓ Leaderboards refreshed")

def main():
    """Main execution function"""
    print("\n" + "="*60)
    print("🏀 CourtVision Data Loading Script")
    print("="*60)
    
    try:
        conn = get_connection()
        print("✓ Connected to database")
        
        # Load data in order
        load_teams(conn)
        load_players(conn)
        load_games(conn)
        load_team_statistics(conn)  # Load team stats first to create seasons
        load_player_statistics(conn)
        refresh_leaderboards(conn)
        
        conn.close()
        print("\n" + "="*60)
        print("✓ Data loading completed successfully!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
