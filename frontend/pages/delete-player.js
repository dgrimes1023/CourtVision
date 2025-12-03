// CourtVision - Delete Player
// Checkpoint 2: Delete player from database

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const API_BASE = 'http://localhost:8000'

export default function DeletePlayer() {
  const router = useRouter()
  const [players, setPlayers] = useState([])
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const res = await fetch(`${API_BASE}/player`)
      const data = await res.json()
      setPlayers(data.players || [])
    } catch (err) {
      console.error('Error fetching players:', err)
    }
  }

  const handlePlayerSelect = async (playerId) => {
    setSelectedPlayerId(playerId)
    setMessage(null)
    setShowConfirm(false)
    
    if (!playerId) {
      setSelectedPlayer(null)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/player/${playerId}`)
      const data = await res.json()
      
      if (res.ok && data.player) {
        setSelectedPlayer(data.player)
      }
    } catch (err) {
      console.error('Error fetching player:', err)
      setMessage({ type: 'error', text: 'Failed to load player data' })
    }
  }

  const handleDelete = async () => {
    if (!selectedPlayerId) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(`${API_BASE}/player/${selectedPlayerId}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Player deleted successfully!' })
        setSelectedPlayerId('')
        setSelectedPlayer(null)
        setShowConfirm(false)
        fetchPlayers() // Refresh player list
        // Redirect after 2 seconds
        setTimeout(() => router.push('/players'), 2000)
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to delete player' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to connect to API. Make sure the server is running.' })
      console.error('Error deleting player:', err)
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
          Delete Player
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          ⚠️ Warning: This action cannot be undone
        </p>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <div className="card" style={{ maxWidth: '600px' }}>
          {/* Player Selection */}
          <div className="form-group">
            <label className="form-label">Select Player to Delete *</label>
            <select
              className="form-input"
              value={selectedPlayerId}
              onChange={(e) => handlePlayerSelect(e.target.value)}
            >
              <option value="">-- Choose a player --</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.player_name} (ID: {player.id})
                </option>
              ))}
            </select>
          </div>

          {selectedPlayer && (
            <div style={{ marginTop: '24px' }}>
              {/* Player Details */}
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fca5a5',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#991b1b' }}>
                  Player Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                  <div><strong>Name:</strong> {selectedPlayer.player_name}</div>
                  <div><strong>Position:</strong> {selectedPlayer.position || 'N/A'}</div>
                  <div><strong>Height:</strong> {selectedPlayer.height_inches ? `${selectedPlayer.height_inches}"` : 'N/A'}</div>
                  <div><strong>Weight:</strong> {selectedPlayer.weight_lbs ? `${selectedPlayer.weight_lbs} lbs` : 'N/A'}</div>
                  <div><strong>Jersey:</strong> #{selectedPlayer.jersey_number || 'N/A'}</div>
                  <div><strong>Status:</strong> {selectedPlayer.is_active ? 'Active' : 'Inactive'}</div>
                </div>
              </div>

              {/* Confirmation */}
              {!showConfirm ? (
                <button 
                  className="btn btn-danger"
                  onClick={() => setShowConfirm(true)}
                >
                  Delete Player
                </button>
              ) : (
                <div>
                  <p style={{ 
                    marginBottom: '16px', 
                    padding: '12px', 
                    backgroundColor: '#fef2f2', 
                    border: '1px solid #fca5a5',
                    borderRadius: '6px',
                    color: '#991b1b'
                  }}>
                    Are you sure you want to delete <strong>{selectedPlayer.player_name}</strong>? 
                    This will permanently remove the player and all associated data.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className="btn btn-danger"
                      onClick={handleDelete}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Yes, Delete Player'}
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowConfirm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!selectedPlayer && selectedPlayerId === '' && (
            <p style={{ color: '#6b7280', marginTop: '16px' }}>
              Select a player from the dropdown to view details and delete.
            </p>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link href="/players">
            <button className="btn btn-secondary">
              ← Back to Players
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
