// CourtVision - Player Comparison Tool
// Compare statistics between two players

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

export default function ComparePlayers() {
  const [players, setPlayers] = useState([])
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm1, setSearchTerm1] = useState('')
  const [searchTerm2, setSearchTerm2] = useState('')

  useEffect(() => {
    fetchPlayers()
    
    // Refresh player list when the page becomes visible
    const handleFocus = () => {
      fetchPlayers()
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        fetchPlayers()
      }
    })
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
    }
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${API_BASE}/player`)
      const data = await response.json()
      setPlayers(data.players || [])
    } catch (err) {
      console.error('Error fetching players:', err)
    }
  }

  const comparePlayersData = async () => {
    if (!player1Id || !player2Id) {
      setError('Please select two players to compare')
      return
    }

    if (player1Id === player2Id) {
      setError('Please select two different players')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(
        `${API_BASE}/compare/players?player1_id=${player1Id}&player2_id=${player2Id}&season_id=3`
      )
      const data = await response.json()
      setComparison(data)
    } catch (err) {
      setError('Failed to compare players. Please try again.')
      console.error('Error comparing players:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers1 = players.filter(p => 
    p.player_name.toLowerCase().includes(searchTerm1.toLowerCase())
  )

  const filteredPlayers2 = players.filter(p => 
    p.player_name.toLowerCase().includes(searchTerm2.toLowerCase())
  )

  const StatComparison = ({ label, value1, value2, format = (v) => v?.toFixed(1) || 'N/A' }) => {
    const v1 = parseFloat(value1) || 0
    const v2 = parseFloat(value2) || 0
    const winner = v1 > v2 ? 1 : v1 < v2 ? 2 : 0

    return (
      <tr>
        <td style={{ 
          fontWeight: winner === 1 ? 'bold' : 'normal',
          color: winner === 1 ? '#10b981' : '#374151'
        }}>
          {format(value1)}
        </td>
        <td style={{ textAlign: 'center', fontWeight: '600', color: '#6b7280' }}>
          {label}
        </td>
        <td style={{ 
          fontWeight: winner === 2 ? 'bold' : 'normal',
          color: winner === 2 ? '#10b981' : '#374151',
          textAlign: 'right'
        }}>
          {format(value2)}
        </td>
      </tr>
    )
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
          ⚔️ Player Comparison Tool
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Compare statistics between two players
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Player Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Player 1 Selection */}
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Player 1
            </h2>
            <input
              type="text"
              placeholder="Search player..."
              value={searchTerm1}
              onChange={(e) => setSearchTerm1(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <select
              value={player1Id}
              onChange={(e) => setPlayer1Id(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Select a player...</option>
              {filteredPlayers1.slice(0, 50).map((player) => (
                <option key={player.id} value={player.id}>
                  {player.player_name} {player.position ? `(${player.position})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Player 2 Selection */}
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Player 2
            </h2>
            <input
              type="text"
              placeholder="Search player..."
              value={searchTerm2}
              onChange={(e) => setSearchTerm2(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <select
              value={player2Id}
              onChange={(e) => setPlayer2Id(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">Select a player...</option>
              {filteredPlayers2.slice(0, 50).map((player) => (
                <option key={player.id} value={player.id}>
                  {player.player_name} {player.position ? `(${player.position})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            className="btn btn-primary"
            onClick={comparePlayersData}
            disabled={loading || !player1Id || !player2Id}
            style={{ fontSize: '16px', padding: '12px 32px' }}
          >
            {loading ? 'Comparing...' : '⚔️ Compare Players'}
          </button>
        </div>

        {/* Comparison Results */}
        {comparison && comparison.player1 && comparison.player2 && (
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {comparison.player1.player_name}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {comparison.player1.position || 'N/A'} | {comparison.player1.height_inches ? `${Math.floor(comparison.player1.height_inches / 12)}'${comparison.player1.height_inches % 12}"` : 'N/A'}
                </p>
              </div>
              
              <div style={{ padding: '0 40px', fontSize: '32px' }}>
                VS
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {comparison.player2.player_name}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {comparison.player2.position || 'N/A'} | {comparison.player2.height_inches ? `${Math.floor(comparison.player2.height_inches / 12)}'${comparison.player2.height_inches % 12}"` : 'N/A'}
                </p>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>{comparison.player1.player_name}</th>
                  <th style={{ width: '30%', textAlign: 'center' }}>Statistic</th>
                  <th style={{ width: '35%', textAlign: 'right' }}>{comparison.player2.player_name}</th>
                </tr>
              </thead>
              <tbody>
                <StatComparison 
                  label="Games Played" 
                  value1={comparison.player1.games_played} 
                  value2={comparison.player2.games_played}
                  format={(v) => v || 'N/A'}
                />
                <StatComparison 
                  label="Points Per Game" 
                  value1={comparison.player1.points_per_game} 
                  value2={comparison.player2.points_per_game}
                />
                <StatComparison 
                  label="Assists Per Game" 
                  value1={comparison.player1.assists_per_game} 
                  value2={comparison.player2.assists_per_game}
                />
                <StatComparison 
                  label="Rebounds Per Game" 
                  value1={comparison.player1.rebounds_per_game} 
                  value2={comparison.player2.rebounds_per_game}
                />
                <StatComparison 
                  label="Steals Per Game" 
                  value1={comparison.player1.steals_per_game} 
                  value2={comparison.player2.steals_per_game}
                />
                <StatComparison 
                  label="Blocks Per Game" 
                  value1={comparison.player1.blocks_per_game} 
                  value2={comparison.player2.blocks_per_game}
                />
                <StatComparison 
                  label="Field Goal %" 
                  value1={comparison.player1.field_goal_percentage} 
                  value2={comparison.player2.field_goal_percentage}
                  format={(v) => v ? `${(v * 100).toFixed(1)}%` : 'N/A'}
                />
                <StatComparison 
                  label="3-Point %" 
                  value1={comparison.player1.three_point_percentage} 
                  value2={comparison.player2.three_point_percentage}
                  format={(v) => v ? `${(v * 100).toFixed(1)}%` : 'N/A'}
                />
                <StatComparison 
                  label="Free Throw %" 
                  value1={comparison.player1.free_throw_percentage} 
                  value2={comparison.player2.free_throw_percentage}
                  format={(v) => v ? `${(v * 100).toFixed(1)}%` : 'N/A'}
                />
              </tbody>
            </table>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                📊 Quick Summary
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                {comparison.player1.player_name} has played {comparison.player1.games_played || 0} games with an average of{' '}
                {comparison.player1.points_per_game?.toFixed(1) || 'N/A'} PPG, while {comparison.player2.player_name} has played{' '}
                {comparison.player2.games_played || 0} games averaging {comparison.player2.points_per_game?.toFixed(1) || 'N/A'} PPG.
              </p>
            </div>
          </div>
        )}

        {comparison && (!comparison.player1 || !comparison.player2) && (
          <div className="alert alert-error">
            One or both players don't have statistics available for the selected season.
          </div>
        )}
      </div>
    </div>
  )
}
