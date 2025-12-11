// CourtVision - Update Player
// Checkpoint 2: Update player information

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

export default function UpdatePlayer() {
  const [players, setPlayers] = useState([])
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [formData, setFormData] = useState({
    player_name: '',
    birth_date: '',
    height_inches: '',
    weight_lbs: '',
    position: '',
    jersey_number: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

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
    
    if (!playerId) {
      setFormData({
        player_name: '',
        birth_date: '',
        height_inches: '',
        weight_lbs: '',
        position: '',
        jersey_number: ''
      })
      return
    }

    try {
      const res = await fetch(`${API_BASE}/player/${playerId}`)
      const data = await res.json()
      
      if (res.ok && data.player) {
        const player = data.player
        setFormData({
          player_name: player.player_name || '',
          birth_date: player.birth_date || '',
          height_inches: player.height_inches || '',
          weight_lbs: player.weight_lbs || '',
          position: player.position || '',
          jersey_number: player.jersey_number || ''
        })
      }
    } catch (err) {
      console.error('Error fetching player:', err)
      setMessage({ type: 'error', text: 'Failed to load player data' })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedPlayerId) {
      setMessage({ type: 'error', text: 'Please select a player to update' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const payload = {
        player_name: formData.player_name,
        birth_date: formData.birth_date || null,
        height_inches: formData.height_inches ? parseInt(formData.height_inches) : null,
        weight_lbs: formData.weight_lbs ? parseInt(formData.weight_lbs) : null,
        position: formData.position || null,
        jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null
      }

      const res = await fetch(`${API_BASE}/player/${selectedPlayerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Player updated successfully!' })
        fetchPlayers() // Refresh player list
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to update player' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to connect to API. Make sure the server is running.' })
      console.error('Error updating player:', err)
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
          Update Player
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Select a player and update their information
        </p>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <div className="card" style={{ maxWidth: '600px' }}>
          {/* Player Selection */}
          <div className="form-group">
            <label className="form-label">Select Player *</label>
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

          {selectedPlayerId && (
            <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
              <div className="form-group">
                <label className="form-label">Player Name *</label>
                <input
                  type="text"
                  name="player_name"
                  className="form-input"
                  value={formData.player_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Birth Date</label>
                <input
                  type="date"
                  name="birth_date"
                  className="form-input"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Height (inches)</label>
                  <input
                    type="number"
                    name="height_inches"
                    className="form-input"
                    value={formData.height_inches}
                    onChange={handleChange}
                    min="1"
                    max="99"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Weight (lbs)</label>
                  <input
                    type="number"
                    name="weight_lbs"
                    className="form-input"
                    value={formData.weight_lbs}
                    onChange={handleChange}
                    min="1"
                    max="499"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <select
                    name="position"
                    className="form-input"
                    value={formData.position}
                    onChange={handleChange}
                  >
                    <option value="">Select Position</option>
                    <option value="PG">PG - Point Guard</option>
                    <option value="SG">SG - Shooting Guard</option>
                    <option value="SF">SF - Small Forward</option>
                    <option value="PF">PF - Power Forward</option>
                    <option value="C">C - Center</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Jersey Number</label>
                  <input
                    type="number"
                    name="jersey_number"
                    className="form-input"
                    value={formData.jersey_number}
                    onChange={handleChange}
                    min="0"
                    max="99"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Player'}
                </button>
                <Link href="/players">
                  <button type="button" className="btn btn-secondary">
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
