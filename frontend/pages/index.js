// CourtVision - Dashboard
// Checkpoint 2: Main dashboard with leaderboard

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

export default function Dashboard() {
  const [pointsLeaderboard, setPointsLeaderboard] = useState([])
  const [assistsLeaderboard, setAssistsLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLeaderboards()
  }, [])

  const fetchLeaderboards = async () => {
    try {
      setLoading(true)
      
      // Fetch points leaderboard
      const pointsRes = await fetch(`${API_BASE}/leaderboard/points?season_id=1&limit=10`)
      const pointsData = await pointsRes.json()
      
      // Fetch assists leaderboard
      const assistsRes = await fetch(`${API_BASE}/leaderboard/assists?season_id=1&limit=10`)
      const assistsData = await assistsRes.json()
      
      setPointsLeaderboard(pointsData.leaderboard || [])
      setAssistsLeaderboard(assistsData.leaderboard || [])
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
            <Link href="/add-player" className="nav-link">Add Player</Link>
            <Link href="/update-player" className="nav-link">Update Player</Link>
            <Link href="/delete-player" className="nav-link">Delete Player</Link>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
        )}

        {/* Quick Actions */}
        <div className="card" style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/players">
              <button className="btn btn-primary">View All Players</button>
            </Link>
            <Link href="/add-player">
              <button className="btn btn-primary">Add New Player</button>
            </Link>
            <button className="btn btn-secondary" onClick={fetchLeaderboards}>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
