"""
CourtVision FastAPI Backend
Checkpoint 2: REST API for NBA Analytics
Author: CS3620 Student
Date: December 2, 2025
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from db import db
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="CourtVision API",
    description="NBA Analytics Application - Checkpoint 2",
    version="0.2.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# PYDANTIC MODELS
# ==========================================

class PlayerCreate(BaseModel):
    player_name: str = Field(..., min_length=1, max_length=255)
    birth_date: Optional[date] = None
    height_inches: Optional[int] = Field(None, gt=0, lt=100)
    weight_lbs: Optional[int] = Field(None, gt=0, lt=500)
    position: Optional[str] = Field(None, max_length=10)
    jersey_number: Optional[int] = Field(None, ge=0, le=99)

class PlayerUpdate(BaseModel):
    player_name: str = Field(..., min_length=1, max_length=255)
    birth_date: Optional[date] = None
    height_inches: Optional[int] = Field(None, gt=0, lt=100)
    weight_lbs: Optional[int] = Field(None, gt=0, lt=500)
    position: Optional[str] = Field(None, max_length=10)
    jersey_number: Optional[int] = Field(None, ge=0, le=99)

class TeamCreate(BaseModel):
    team_name: str = Field(..., min_length=1, max_length=255)
    abbreviation: str = Field(..., min_length=2, max_length=10)
    city: Optional[str] = Field(None, max_length=100)
    conference: Optional[str] = Field(None, max_length=20)
    division: Optional[str] = Field(None, max_length=50)

class TeamUpdate(BaseModel):
    team_name: str = Field(..., min_length=1, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    conference: Optional[str] = Field(None, max_length=20)
    division: Optional[str] = Field(None, max_length=50)

class NoteCreate(BaseModel):
    user_id: int
    player_id: Optional[int] = None
    team_id: Optional[int] = None
    note_title: Optional[str] = Field(None, max_length=255)
    note_content: str = Field(..., min_length=1)

class NoteUpdate(BaseModel):
    note_title: Optional[str] = Field(None, max_length=255)
    note_content: str = Field(..., min_length=1)

# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/")
async def root():
    """API health check"""
    return {
        "status": "online",
        "message": "CourtVision API - Checkpoint 2",
        "version": "0.2.0"
    }

@app.get("/health")
async def health_check():
    """Database health check"""
    try:
        is_healthy = db.test_connection()
        if is_healthy:
            return {"status": "healthy", "database": "connected"}
        else:
            raise HTTPException(status_code=503, detail="Database connection failed")
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database error: {str(e)}")

# ==========================================
# PLAYER ENDPOINTS
# ==========================================

@app.post("/player", status_code=201)
async def create_player(player: PlayerCreate):
    """Create a new player"""
    try:
        player_id = db.execute_function_scalar(
            "insert_player",
            (
                player.player_name,
                player.birth_date,
                player.height_inches,
                player.weight_lbs,
                player.position,
                player.jersey_number
            )
        )
        return {"message": "Player created successfully", "player_id": player_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create player: {str(e)}")

@app.get("/player")
async def get_players(name: Optional[str] = Query(None, description="Search by player name")):
    """Get all players or search by name"""
    try:
        if name:
            players = db.execute_function("get_player_by_name", (name,))
        else:
            players = db.execute_function("get_all_players")
        return {"players": players, "count": len(players)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch players: {str(e)}")

@app.get("/player/{player_id}")
async def get_player_by_id(player_id: int):
    """Get player by ID"""
    try:
        players = db.execute_function("get_player_by_id", (player_id,))
        if not players:
            raise HTTPException(status_code=404, detail="Player not found")
        return {"player": players[0]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch player: {str(e)}")

@app.put("/player/{player_id}")
async def update_player(player_id: int, player: PlayerUpdate):
    """Update player information"""
    try:
        success = db.execute_function_scalar(
            "update_player",
            (
                player_id,
                player.player_name,
                player.birth_date,
                player.height_inches,
                player.weight_lbs,
                player.position,
                player.jersey_number
            )
        )
        if not success:
            raise HTTPException(status_code=404, detail="Player not found")
        return {"message": "Player updated successfully", "player_id": player_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update player: {str(e)}")

@app.delete("/player/{player_id}")
async def delete_player(player_id: int):
    """Delete a player"""
    try:
        success = db.execute_function_scalar("delete_player", (player_id,))
        if not success:
            raise HTTPException(status_code=404, detail="Player not found")
        return {"message": "Player deleted successfully", "player_id": player_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete player: {str(e)}")

# ==========================================
# TEAM ENDPOINTS
# ==========================================

@app.post("/team", status_code=201)
async def create_team(team: TeamCreate):
    """Create a new team"""
    try:
        team_id = db.execute_function_scalar(
            "insert_team",
            (team.team_name, team.abbreviation, team.city, team.conference, team.division)
        )
        return {"message": "Team created successfully", "team_id": team_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create team: {str(e)}")

@app.get("/team")
async def get_teams(name: Optional[str] = Query(None, description="Search by team name")):
    """Get all teams or search by name"""
    try:
        if name:
            teams = db.execute_function("get_team_by_name", (name,))
        else:
            teams = db.execute_function("get_all_teams")
        return {"teams": teams, "count": len(teams)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch teams: {str(e)}")

@app.put("/team/{team_id}")
async def update_team(team_id: int, team: TeamUpdate):
    """Update team information"""
    try:
        success = db.execute_function_scalar(
            "update_team",
            (team_id, team.team_name, team.city, team.conference, team.division)
        )
        if not success:
            raise HTTPException(status_code=404, detail="Team not found")
        return {"message": "Team updated successfully", "team_id": team_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update team: {str(e)}")

@app.delete("/team/{team_id}")
async def delete_team(team_id: int):
    """Delete a team"""
    try:
        success = db.execute_function_scalar("delete_team", (team_id,))
        if not success:
            raise HTTPException(status_code=404, detail="Team not found")
        return {"message": "Team deleted successfully", "team_id": team_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete team: {str(e)}")

# ==========================================
# NOTES ENDPOINTS
# ==========================================

@app.post("/note", status_code=201)
async def create_note(note: NoteCreate):
    """Create a new user note"""
    try:
        note_id = db.execute_function_scalar(
            "insert_user_note",
            (note.user_id, note.player_id, note.team_id, note.note_title, note.note_content)
        )
        return {"message": "Note created successfully", "note_id": note_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create note: {str(e)}")

@app.get("/note/{user_id}")
async def get_user_notes(user_id: int):
    """Get all notes for a user"""
    try:
        notes = db.execute_function("get_user_notes", (user_id,))
        return {"notes": notes, "count": len(notes)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notes: {str(e)}")

@app.put("/note/{note_id}")
async def update_note(note_id: int, note: NoteUpdate):
    """Update a user note"""
    try:
        success = db.execute_function_scalar(
            "update_user_note",
            (note_id, note.note_title, note.note_content)
        )
        if not success:
            raise HTTPException(status_code=404, detail="Note not found")
        return {"message": "Note updated successfully", "note_id": note_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update note: {str(e)}")

@app.delete("/note/{note_id}")
async def delete_note(note_id: int):
    """Delete a user note"""
    try:
        success = db.execute_function_scalar("delete_user_note", (note_id,))
        if not success:
            raise HTTPException(status_code=404, detail="Note not found")
        return {"message": "Note deleted successfully", "note_id": note_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete note: {str(e)}")

# ==========================================
# ANALYTICS ENDPOINTS
# ==========================================

@app.get("/leaderboard/points")
async def get_points_leaderboard(
    season_id: int = Query(1, description="Season ID"),
    limit: int = Query(10, ge=1, le=50, description="Number of results")
):
    """Get points per game leaderboard"""
    try:
        leaderboard = db.execute_function("get_top_scorers", (season_id, limit))
        return {"leaderboard": leaderboard, "count": len(leaderboard)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

@app.get("/leaderboard/assists")
async def get_assists_leaderboard(
    season_id: int = Query(1, description="Season ID"),
    limit: int = Query(10, ge=1, le=50, description="Number of results")
):
    """Get assists per game leaderboard"""
    try:
        leaderboard = db.execute_function("get_top_assists", (season_id, limit))
        return {"leaderboard": leaderboard, "count": len(leaderboard)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

@app.get("/player/position/{position}")
async def get_players_by_position(position: str):
    """Get players by position"""
    try:
        players = db.execute_function("get_players_by_position", (position.upper(),))
        return {"players": players, "count": len(players)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch players: {str(e)}")

@app.get("/leaderboard/rebounds")
async def get_rebounds_leaderboard(
    season_id: int = Query(1, description="Season ID"),
    limit: int = Query(10, ge=1, le=50, description="Number of results")
):
    """Get rebounds per game leaderboard"""
    try:
        leaderboard = db.execute_function("get_top_rebounds", (season_id, limit))
        return {"leaderboard": leaderboard, "count": len(leaderboard)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

@app.get("/leaderboard/steals")
async def get_steals_leaderboard(
    season_id: int = Query(1, description="Season ID"),
    limit: int = Query(10, ge=1, le=50, description="Number of results")
):
    """Get steals per game leaderboard"""
    try:
        leaderboard = db.execute_function("get_top_steals", (season_id, limit))
        return {"leaderboard": leaderboard, "count": len(leaderboard)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

@app.get("/player/{player_id}/stats")
async def get_player_stats(
    player_id: int,
    season_id: int = Query(1, description="Season ID")
):
    """Get detailed statistics for a player"""
    try:
        stats = db.execute_function("get_player_stats", (player_id, season_id))
        if not stats:
            raise HTTPException(status_code=404, detail="Player statistics not found")
        return {"player_id": player_id, "stats": stats[0] if stats else {}}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch player stats: {str(e)}")

@app.get("/compare/players")
async def compare_players(
    player1_id: int = Query(..., description="First player ID"),
    player2_id: int = Query(..., description="Second player ID"),
    season_id: int = Query(1, description="Season ID")
):
    """Compare two players' statistics"""
    try:
        player1_stats = db.execute_function("get_player_stats", (player1_id, season_id))
        player2_stats = db.execute_function("get_player_stats", (player2_id, season_id))
        
        return {
            "player1": player1_stats[0] if player1_stats else None,
            "player2": player2_stats[0] if player2_stats else None,
            "season_id": season_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compare players: {str(e)}")

@app.get("/compare/teams")
async def compare_teams(
    team1_id: int = Query(..., description="First team ID"),
    team2_id: int = Query(..., description="Second team ID"),
    season_id: int = Query(1, description="Season ID")
):
    """Compare two teams' statistics"""
    try:
        comparison = db.execute_function("compare_teams", (team1_id, team2_id, season_id))
        if not comparison:
            raise HTTPException(status_code=404, detail="Team statistics not found")
        return comparison[0] if comparison else {}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compare teams: {str(e)}")

@app.get("/leaderboard/team/wins")
async def get_team_most_wins(
    limit: int = Query(10, ge=1, le=50, description="Number of results")
):
    """Get teams by most wins ever (all-time)"""
    try:
        leaderboard = db.execute_function("get_team_most_wins", (limit,))
        return {"leaderboard": leaderboard, "count": len(leaderboard)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

@app.get("/leaderboard/team/avg-wins")
async def get_team_avg_wins(
    limit: int = Query(10, ge=1, le=50, description="Number of results")
):
    """Get teams by average wins per season"""
    try:
        leaderboard = db.execute_function("get_team_avg_wins_per_season", (limit,))
        return {"leaderboard": leaderboard, "count": len(leaderboard)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

@app.get("/leaderboard/team/points")
async def get_team_points_per_game(
    limit: int = Query(10, ge=1, le=50, description="Number of results")
):
    """Get teams by points per game"""
    try:
        leaderboard = db.execute_function("get_team_points_per_game", (limit,))
        return {"leaderboard": leaderboard, "count": len(leaderboard)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch leaderboard: {str(e)}")

# ==========================================
# GAME ENDPOINTS
# ==========================================

@app.get("/games")
async def get_recent_games(limit: int = Query(20, ge=1, le=100, description="Number of games")):
    """Get recent games"""
    try:
        games = db.execute_function("get_recent_games", (limit,))
        return {"games": games, "count": len(games)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch games: {str(e)}")

@app.get("/games/team/{team_id}")
async def get_team_games(
    team_id: int,
    limit: int = Query(20, ge=1, le=100, description="Number of games")
):
    """Get games for a specific team"""
    try:
        games = db.execute_function("get_games_by_team", (team_id, limit))
        return {"games": games, "count": len(games)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch team games: {str(e)}")

# ==========================================
# AUDIT LOG ENDPOINTS
# ==========================================

@app.get("/audit")
async def get_audit_logs(
    limit: int = Query(50, ge=1, le=200, description="Number of logs"),
    table_name: Optional[str] = Query(None, description="Filter by table name")
):
    """Get audit logs"""
    try:
        query = """
            SELECT id, table_name, operation, record_id, changed_at,
                   old_values::text as old_values, new_values::text as new_values
            FROM audit_log
        """
        params = []
        
        if table_name:
            query += " WHERE table_name = %s"
            params.append(table_name)
        
        query += " ORDER BY changed_at DESC LIMIT %s"
        params.append(limit)
        
        logs = db.execute_query(query, tuple(params))
        return {"logs": logs, "count": len(logs)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch audit logs: {str(e)}")

# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🏀 CourtVision API - Checkpoint 2")
    print("="*50)
    print("Starting server on http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("="*50 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
