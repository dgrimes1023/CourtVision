// CourtVision - Dashboard
// Checkpoint 2: Main dashboard with leaderboard

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

export default function Dashboard() {
  const [pointsLeaderboard, setPointsLeaderboard] = useState([])
  const [assistsLeaderboard, setAssistsLeaderboard] = useState([])
  const [reboundsLeaderboard, setReboundsLeaderboard] = useState([])
  const [stealsLeaderboard, setStealsLeaderboard] = useState([])
  const [teamWinsLeaderboard, setTeamWinsLeaderboard] = useState([])
  const [teamAvgWinsLeaderboard, setTeamAvgWinsLeaderboard] = useState([])
  const [teamPointsLeaderboard, setTeamPointsLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  const fetchLeaderboards = async () => {
    try {
      setLoading(true)
      
      // Fetch player leaderboards
      const pointsRes = await fetch(`${API_BASE}/leaderboard/points?season_id=3&limit=10`)
      const pointsData = await pointsRes.json()
      
      const assistsRes = await fetch(`${API_BASE}/leaderboard/assists?season_id=3&limit=10`)
      const assistsData = await assistsRes.json()
      
      const reboundsRes = await fetch(`${API_BASE}/leaderboard/rebounds?season_id=3&limit=10`)
      const reboundsData = await reboundsRes.json()
      
      const stealsRes = await fetch(`${API_BASE}/leaderboard/steals?season_id=3&limit=10`)
      const stealsData = await stealsRes.json()
      
      // Fetch team leaderboards
      const teamWinsRes = await fetch(`${API_BASE}/leaderboard/team/wins?limit=10`)
      const teamWinsData = await teamWinsRes.json()
      
      const teamAvgWinsRes = await fetch(`${API_BASE}/leaderboard/team/avg-wins?limit=10`)
      const teamAvgWinsData = await teamAvgWinsRes.json()
      
      const teamPointsRes = await fetch(`${API_BASE}/leaderboard/team/points?limit=10`)
      const teamPointsData = await teamPointsRes.json()
      
      setPointsLeaderboard(pointsData.leaderboard || [])
      setAssistsLeaderboard(assistsData.leaderboard || [])
      setReboundsLeaderboard(reboundsData.leaderboard || [])
      setStealsLeaderboard(stealsData.leaderboard || [])
      setTeamWinsLeaderboard(teamWinsData.leaderboard || [])
      setTeamAvgWinsLeaderboard(teamAvgWinsData.leaderboard || [])
      setTeamPointsLeaderboard(teamPointsData.leaderboard || [])
      setError(null)
    } catch (err) {
      setError('Failed to load leaderboards. Make sure the API is running.')
      console.error('Error fetching leaderboards:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-brand">
            🏀 CourtVision
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Dashboard</Link>
            <Link href="/players" className="nav-link">Players</Link>
            <Link href="/games" className="nav-link">Games</Link>
            <Link href="/compare-players" className="nav-link">Compare Players</Link>
            <Link href="/compare-teams" className="nav-link">Compare Teams</Link>
            <Link href="/visualize" className="nav-link">Visualize</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          NBA Analytics Dashboard
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Checkpoint 2 - View player statistics and leaderboards
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="card">
            <p>Loading leaderboards...</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Points Leaderboard */}
            <div className="card">
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                🏆 Points Per Game Leaders
              </h2>
              {pointsLeaderboard.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>PPG</th>
                      <th>GP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsLeaderboard.map((player) => (
                      <tr key={player.player_id}>
                        <td>
                          <span className="leaderboard-rank">{player.rank}</span>
                        </td>
                        <td style={{ fontWeight: '500' }}>{player.player_name}</td>
                        <td>{player.points_per_game?.toFixed(1) || 'N/A'}</td>
                        <td>{player.games_played || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#6b7280' }}>No data available. Add players and stats to see leaderboard.</p>
              )}
            </div>

            {/* Assists Leaderboard */}
            <div className="card">
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                🎯 Assists Per Game Leaders
              </h2>
              {assistsLeaderboard.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>APG</th>
                      <th>GP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assistsLeaderboard.map((player) => (
                      <tr key={player.player_id}>
                        <td>
                          <span className="leaderboard-rank">{player.rank}</span>
                        </td>
                        <td style={{ fontWeight: '500' }}>{player.player_name}</td>
                        <td>{player.assists_per_game?.toFixed(1) || 'N/A'}</td>
                        <td>{player.games_played || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#6b7280' }}>No data available. Add players and stats to see leaderboard.</p>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Rebounds Leaderboard */}
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              🏀 Rebounds Per Game Leaders
            </h2>
            {reboundsLeaderboard.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>RPG</th>
                    <th>GP</th>
                  </tr>
                </thead>
                <tbody>
                  {reboundsLeaderboard.map((player) => (
                    <tr key={player.player_id}>
                      <td>
                        <span className="leaderboard-rank">{player.rank}</span>
                      </td>
                      <td style={{ fontWeight: '500' }}>{player.player_name}</td>
                      <td>{player.rebounds_per_game?.toFixed(1) || 'N/A'}</td>
                      <td>{player.games_played || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#6b7280' }}>No data available.</p>
            )}
          </div>

          {/* Steals Leaderboard */}
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              🛡️ Steals Per Game Leaders
            </h2>
            {stealsLeaderboard.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>SPG</th>
                    <th>GP</th>
                  </tr>
                </thead>
                <tbody>
                  {stealsLeaderboard.map((player) => (
                    <tr key={player.player_id}>
                      <td>
                        <span className="leaderboard-rank">{player.rank}</span>
                      </td>
                      <td style={{ fontWeight: '500' }}>{player.player_name}</td>
                      <td>{player.steals_per_game?.toFixed(1) || 'N/A'}</td>
                      <td>{player.games_played || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: '#6b7280' }}>No data available.</p>
            )}
          </div>
          </div>

          {/* Team Leaderboards Section */}
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '40px', marginBottom: '20px' }}>
            🏆 Team Leaderboards
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Most Wins Ever */}
            <div className="card">
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                🏆 Most Wins Ever
              </h2>
              {teamWinsLeaderboard.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team</th>
                      <th>Wins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamWinsLeaderboard.slice(0, 5).map((team) => (
                      <tr key={team.team_id}>
                        <td>
                          <span className="leaderboard-rank">{team.rank}</span>
                        </td>
                        <td style={{ fontWeight: '500' }}>{team.team_name}</td>
                        <td>{team.total_wins || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#6b7280' }}>No team data available.</p>
              )}
            </div>

            {/* Average Wins Per Season */}
            <div className="card">
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                📊 Avg Wins Per Season
              </h2>
              {teamAvgWinsLeaderboard.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team</th>
                      <th>Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamAvgWinsLeaderboard.slice(0, 5).map((team) => (
                      <tr key={team.team_id}>
                        <td>
                          <span className="leaderboard-rank">{team.rank}</span>
                        </td>
                        <td style={{ fontWeight: '500' }}>{team.team_name}</td>
                        <td>{team.avg_wins?.toFixed(1) || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#6b7280' }}>No team data available.</p>
              )}
            </div>

            {/* Team Points Per Game */}
            <div className="card">
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                🏀 Team Points Per Game
              </h2>
              {teamPointsLeaderboard.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team</th>
                      <th>PPG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPointsLeaderboard.slice(0, 5).map((team) => (
                      <tr key={team.team_id}>
                        <td>
                          <span className="leaderboard-rank">{team.rank}</span>
                        </td>
                        <td style={{ fontWeight: '500' }}>{team.team_name}</td>
                        <td>{team.avg_ppg?.toFixed(1) || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#6b7280' }}>No team data available.</p>
              )}
            </div>
          </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card" style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            ⚡ Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <Link href="/players">
              <button className="btn btn-primary" style={{ width: '100%' }}>👥 View All Players</button>
            </Link>
            <Link href="/games">
              <button className="btn btn-primary" style={{ width: '100%' }}>🏀 View Games</button>
            </Link>
            <Link href="/compare-players">
              <button className="btn btn-primary" style={{ width: '100%' }}>⚔️ Compare Players</button>
            </Link>
            <Link href="/compare-teams">
              <button className="btn btn-primary" style={{ width: '100%' }}>🏆 Compare Teams</button>
            </Link>
            <Link href="/visualize">
              <button className="btn btn-primary" style={{ width: '100%' }}>📊 Visualize Stats</button>
            </Link>
            <button className="btn btn-secondary" onClick={fetchLeaderboards} style={{ width: '100%' }}>
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
