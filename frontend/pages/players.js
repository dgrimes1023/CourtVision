// CourtVision - Players List
// Checkpoint 2: View and search players

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

export default function Players() {
  const [players, setPlayers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async (query = '') => {
    try {
      setLoading(true)
      const url = query 
        ? `${API_BASE}/player?name=${encodeURIComponent(query)}`
        : `${API_BASE}/player`
      
      const res = await fetch(url)
      const data = await res.json()
      
      setPlayers(data.players || [])
      setError(null)
    } catch (err) {
      setError('Failed to load players. Make sure the API is running.')
      console.error('Error fetching players:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPlayers(searchQuery)
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
          NBA Players
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Browse and search all players in the database
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Search Form */}
        <div className="card">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('')
                fetchPlayers()
              }}
            >
              Clear
            </button>
          </form>
        </div>

        {/* Players Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
              All Players ({players.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/add-player">
                <button className="btn btn-primary">Add New Player</button>
              </Link>
              <Link href="/update-player">
                <button className="btn btn-secondary">Update Player</button>
              </Link>
              <Link href="/delete-player">
                <button className="btn btn-danger">Delete Player</button>
              </Link>
            </div>
          </div>

          {loading ? (
            <p>Loading players...</p>
          ) : players.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Height (in)</th>
                  <th>Weight (lbs)</th>
                  <th>Jersey #</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td>{player.id}</td>
                    <td style={{ fontWeight: '500' }}>{player.player_name}</td>
                    <td>{player.position || 'N/A'}</td>
                    <td>{player.height_inches || 'N/A'}</td>
                    <td>{player.weight_lbs || 'N/A'}</td>
                    <td>{player.jersey_number || 'N/A'}</td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: player.is_active ? '#d1fae5' : '#fee2e2',
                        color: player.is_active ? '#065f46' : '#991b1b'
                      }}>
                        {player.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#6b7280' }}>
              No players found. {searchQuery && 'Try a different search or '}
              <Link href="/add-player" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
                add a new player
              </Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
