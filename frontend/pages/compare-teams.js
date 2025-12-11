// CourtVision - Team Comparison Tool
// Compare statistics between two teams

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

export default function CompareTeams() {
  const [teams, setTeams] = useState([])
  const [team1Id, setTeam1Id] = useState('')
  const [team2Id, setTeam2Id] = useState('')
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm1, setSearchTerm1] = useState('')
  const [searchTerm2, setSearchTerm2] = useState('')

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${API_BASE}/team`)
      const data = await response.json()
      setTeams(data.teams || [])
    } catch (err) {
      console.error('Error fetching teams:', err)
    }
  }

  const compareTeamsData = async () => {
    if (!team1Id || !team2Id) {
      setError('Please select two teams to compare')
      return
    }

    if (team1Id === team2Id) {
      setError('Please select two different teams')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(
        `${API_BASE}/compare/teams?team1_id=${team1Id}&team2_id=${team2Id}&season_id=1`
      )
      const data = await response.json()
      setComparison(data)
    } catch (err) {
      setError('Failed to compare teams. Please try again.')
      console.error('Error comparing teams:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams1 = teams.filter(t => 
    t.team_name.toLowerCase().includes(searchTerm1.toLowerCase())
  )

  const filteredTeams2 = teams.filter(t => 
    t.team_name.toLowerCase().includes(searchTerm2.toLowerCase())
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
          🏆 Team Comparison Tool
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Compare statistics between two teams
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Team Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Team 1 Selection */}
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Team 1
            </h2>
            <input
              type="text"
              placeholder="Search team..."
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
              value={team1Id}
              onChange={(e) => setTeam1Id(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select a team...</option>
              {filteredTeams1.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name} ({team.abbreviation})
                </option>
              ))}
            </select>
          </div>

          {/* Team 2 Selection */}
          <div className="card">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Team 2
            </h2>
            <input
              type="text"
              placeholder="Search team..."
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
              value={team2Id}
              onChange={(e) => setTeam2Id(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select a team...</option>
              {filteredTeams2.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name} ({team.abbreviation})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare Button */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={compareTeamsData}
            disabled={loading || !team1Id || !team2Id}
            className="btn btn-primary"
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Comparing...' : '⚔️ Compare Teams'}
          </button>
        </div>

        {/* Comparison Results */}
        {comparison && (
          <div className="card">
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
              {comparison.team1_name} vs {comparison.team2_name}
            </h2>

            <table className="table" style={{ fontSize: '16px' }}>
              <thead>
                <tr>
                  <th style={{ width: '35%', textAlign: 'left' }}>{comparison.team1_name}</th>
                  <th style={{ width: '30%', textAlign: 'center' }}>Statistic</th>
                  <th style={{ width: '35%', textAlign: 'right' }}>{comparison.team2_name}</th>
                </tr>
              </thead>
              <tbody>
                <StatComparison
                  label="Games Played"
                  value1={comparison.team1_games}
                  value2={comparison.team2_games}
                  format={(v) => v || 0}
                />
                <StatComparison
                  label="Points Per Game"
                  value1={comparison.team1_points}
                  value2={comparison.team2_points}
                />
                <StatComparison
                  label="Assists Per Game"
                  value1={comparison.team1_assists}
                  value2={comparison.team2_assists}
                />
                <StatComparison
                  label="Rebounds Per Game"
                  value1={comparison.team1_rebounds}
                  value2={comparison.team2_rebounds}
                />
                <StatComparison
                  label="Steals Per Game"
                  value1={comparison.team1_steals}
                  value2={comparison.team2_steals}
                />
                <StatComparison
                  label="Blocks Per Game"
                  value1={comparison.team1_blocks}
                  value2={comparison.team2_blocks}
                />
              </tbody>
            </table>

            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <p style={{ margin: 0 }}>
                <strong>Note:</strong> Bold numbers in green indicate the winning statistic.
                All statistics are per-game averages for Season 1.
              </p>
            </div>
          </div>
        )}

        {!comparison && !loading && (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>
              Select two teams above and click "Compare Teams" to see their statistics side-by-side.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
