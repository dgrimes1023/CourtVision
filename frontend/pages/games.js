// CourtVision - Games List
// View recent games and scores

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

export default function Games() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/games?limit=50`)
      const data = await res.json()
      
      setGames(data.games || [])
      setError(null)
    } catch (err) {
      setError('Failed to load games. Make sure the API is running.')
      console.error('Error fetching games:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          NBA Games
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Recent game results from the dataset
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Games List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Recent Games ({games.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary" onClick={() => alert('Add Game functionality coming soon!')}>Add Game</button>
              <button className="btn btn-danger" onClick={() => alert('Delete Game functionality coming soon!')}>Delete Game</button>
            </div>
          </div>

          {loading ? (
            <p>Loading games...</p>
          ) : games.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {games.map((game) => (
                <div 
                  key={game.id} 
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                      {formatDate(game.game_date_time)} • {game.game_type}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ flex: 1, textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>
                          {game.away_team || 'TBD'}
                        </div>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: 'bold',
                          color: game.away_score > game.home_score ? '#059669' : '#6b7280'
                        }}>
                          {game.away_score}
                        </div>
                      </div>
                      
                      <div style={{ 
                        padding: '8px 16px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        color: '#6b7280'
                      }}>
                        @
                      </div>
                      
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>
                          {game.home_team || 'TBD'}
                        </div>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: 'bold',
                          color: game.home_score > game.away_score ? '#059669' : '#6b7280'
                        }}>
                          {game.home_score}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>No games available. Run the data loading script to populate games.</p>
          )}
        </div>
      </div>
    </div>
  )
}
