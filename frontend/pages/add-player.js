// CourtVision - Add Player
// Checkpoint 2: Create new player

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const API_BASE = 'http://localhost:8000'

export default function AddPlayer() {
  const router = useRouter()
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Convert empty strings to null for optional fields
      const payload = {
        player_name: formData.player_name,
        birth_date: formData.birth_date || null,
        height_inches: formData.height_inches ? parseInt(formData.height_inches) : null,
        weight_lbs: formData.weight_lbs ? parseInt(formData.weight_lbs) : null,
        position: formData.position || null,
        jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null
      }

      const res = await fetch(`${API_BASE}/player`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: `Player created successfully! ID: ${data.player_id}` })
        // Reset form
        setFormData({
          player_name: '',
          birth_date: '',
          height_inches: '',
          weight_lbs: '',
          position: '',
          jersey_number: ''
        })
        // Redirect after 2 seconds
        setTimeout(() => router.push('/players'), 2000)
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to create player' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to connect to API. Make sure the server is running.' })
      console.error('Error creating player:', err)
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
          Add New Player
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Create a new player entry in the database
        </p>

        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {message.text}
          </div>
        )}

        <div className="card" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Player Name *</label>
              <input
                type="text"
                name="player_name"
                className="form-input"
                value={formData.player_name}
                onChange={handleChange}
                required
                placeholder="e.g., LeBron James"
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
                  placeholder="e.g., 79"
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
                  placeholder="e.g., 250"
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
                  placeholder="e.g., 23"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Player'}
              </button>
              <Link href="/players">
                <button type="button" className="btn btn-secondary">
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
