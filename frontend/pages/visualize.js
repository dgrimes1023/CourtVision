// CourtVision - Statistics Visualization
// Visual analytics dashboard with charts and insights

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'http://localhost:8000'

export default function Visualize() {
  const [pointsLeaders, setPointsLeaders] = useState([])
  const [assistsLeaders, setAssistsLeaders] = useState([])
  const [reboundsLeaders, setReboundsLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [pointsRes, assistsRes, reboundsRes] = await Promise.all([
        fetch(`${API_BASE}/leaderboard/points?season_id=3&limit=10`),
        fetch(`${API_BASE}/leaderboard/assists?season_id=3&limit=10`),
        fetch(`${API_BASE}/leaderboard/rebounds?season_id=3&limit=10`)
      ])
      
      const pointsData = await pointsRes.json()
      const assistsData = await assistsRes.json()
      const reboundsData = await reboundsRes.json()
      
      setPointsLeaders(pointsData.leaderboard || [])
      setAssistsLeaders(assistsData.leaderboard || [])
      setReboundsLeaders(reboundsData.leaderboard || [])
      setError(null)
    } catch (err) {
      setError('Failed to load data')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const BarChart = ({ data, valueKey, nameKey, color, maxValue }) => {
    return (
      <div style={{ width: '100%' }}>
        {data.map((item, idx) => {
          const value = item[valueKey] || 0
          const percentage = maxValue ? (value / maxValue) * 100 : 0
          
          return (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <span style={{ fontWeight: '500', color: '#374151' }}>
                  {idx + 1}. {item[nameKey]}
                </span>
                <span style={{ fontWeight: '600', color: color }}>
                  {value.toFixed(1)}
                </span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${percentage}%`, 
                  height: '100%', 
                  backgroundColor: color,
                  transition: 'width 0.3s ease',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          )
        })}
      </div>
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
          📊 Visual Analytics
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Interactive charts and insights from NBA statistics
        </p>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {loading ? (
          <div className="card">
            <p>Loading visualizations...</p>
          </div>
        ) : (
          <div>
            {/* Top Performers Overview */}
            <div className="card" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                🌟 Elite Performers
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
                Top statistical leaders across key categories
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444' }}>
                    {pointsLeaders[0]?.points_per_game?.toFixed(1) || 'N/A'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>PPG Leader</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {pointsLeaders[0]?.player_name || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {assistsLeaders[0]?.assists_per_game?.toFixed(1) || 'N/A'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>APG Leader</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {assistsLeaders[0]?.player_name || 'N/A'}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981' }}>
                    {reboundsLeaders[0]?.rebounds_per_game?.toFixed(1) || 'N/A'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>RPG Leader</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                    {reboundsLeaders[0]?.player_name || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {/* Points Chart */}
              <div className="card">
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#ef4444' }}>
                  🏆 Top 10 Scorers (Points Per Game)
                </h2>
                <BarChart 
                  data={pointsLeaders}
                  valueKey="points_per_game"
                  nameKey="player_name"
                  color="#ef4444"
                  maxValue={pointsLeaders[0]?.points_per_game || 30}
                />
              </div>

              {/* Assists Chart */}
              <div className="card">
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#3b82f6' }}>
                  🎯 Top 10 Playmakers (Assists Per Game)
                </h2>
                <BarChart 
                  data={assistsLeaders}
                  valueKey="assists_per_game"
                  nameKey="player_name"
                  color="#3b82f6"
                  maxValue={assistsLeaders[0]?.assists_per_game || 10}
                />
              </div>

              {/* Rebounds Chart */}
              <div className="card">
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#10b981' }}>
                  🏀 Top 10 Rebounders (Rebounds Per Game)
                </h2>
                <BarChart 
                  data={reboundsLeaders}
                  valueKey="rebounds_per_game"
                  nameKey="player_name"
                  color="#10b981"
                  maxValue={reboundsLeaders[0]?.rebounds_per_game || 15}
                />
              </div>
            </div>

            {/* Insights */}
            <div className="card" style={{ marginTop: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                💡 Key Insights
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '4px' }}>
                    Scoring Dominance
                  </div>
                  <div style={{ fontSize: '13px', color: '#7f1d1d' }}>
                    Top scorer averages {pointsLeaders[0]?.points_per_game?.toFixed(1) || 'N/A'} PPG over {pointsLeaders[0]?.games_played || 0} games
                  </div>
                </div>
                
                <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>
                    Assist Leaders
                  </div>
                  <div style={{ fontSize: '13px', color: '#1e3a8a' }}>
                    Elite playmaker distributing {assistsLeaders[0]?.assists_per_game?.toFixed(1) || 'N/A'} APG
                  </div>
                </div>
                
                <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#065f46', marginBottom: '4px' }}>
                    Rebounding Force
                  </div>
                  <div style={{ fontSize: '13px', color: '#064e3b' }}>
                    Top rebounder controls {reboundsLeaders[0]?.rebounds_per_game?.toFixed(1) || 'N/A'} boards per game
                  </div>
                </div>
                
                <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '4px' }}>
                    League Depth
                  </div>
                  <div style={{ fontSize: '13px', color: '#78350f' }}>
                    {pointsLeaders.length} players featured in statistical leaderboards
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
