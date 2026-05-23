'use client'

import { useState } from 'react'
import type { Station, StationPriceData } from '@/lib/types'
import { getStationTypeLabel, getStationTypeColor, getStatusColor, getModelDisplayName, formatPrice } from '@/lib/utils-client'

interface Props {
  stations: Station[]
  pricesMap: Record<string, StationPriceData>
}

export default function HomeClient({ stations, pricesMap }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const popularModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini', 'claude-3-5-sonnet', 'deepseek-v3']

  const filtered = stations.filter(s => {
    if (s.status === 'dead') return false
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!s.name.toLowerCase().includes(q) &&
          !s.id.toLowerCase().includes(q) &&
          !s.models.some(m => m.toLowerCase().includes(q))) {
        return false
      }
    }
    return true
  })

  const getLowestPrice = (stationId: string, modelPattern: string): string => {
    const pd = pricesMap[stationId]
    if (!pd) return '-'
    const matching = Object.entries(pd.models)
      .filter(([id]) => id.toLowerCase().includes(modelPattern.toLowerCase()))
      .map(([, p]) => p.input)
      .filter((v): v is number => v !== null && v !== undefined && v > 0)
    if (matching.length === 0) return '-'
    return formatPrice(Math.min(...matching))
  }

  const getModelCount = (stationId: string): number => {
    const pd = pricesMap[stationId]
    return pd?.modelCount || 0
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">AI API 中转站导航</h1>
          <p className="hero-subtitle">
            汇集国内可用的 AI API 中转站，支持 GPT-4、Claude、DeepSeek 等模型<br />
            每日自动更新价格数据，实时监控站点状态
          </p>

          {/* Search */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="搜索站点名称或模型..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Quick filters */}
          <div className="filter-bar" style={{ justifyContent: 'center' }}>
            {['all', 'official-relay', 'mixed', 'reverse', 'aggregator'].map(type => (
              <button
                key={type}
                className={`filter-btn ${typeFilter === type ? 'active' : ''}`}
                onClick={() => setTypeFilter(type)}
              >
                {type === 'all' ? '全部' : getStationTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Station Grid */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>收录站点</span>
              <span style={{ marginLeft: '0.5rem', fontWeight: 600 }}>{stations.filter(s => s.status !== 'dead').length}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>自动监控</span>
              <span style={{ marginLeft: '0.5rem', fontWeight: 600 }}>{stations.filter(s => s.isAutoFetchable).length}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginLeft: '0.25rem' }}>个站点</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>价格数据</span>
              <span style={{ marginLeft: '0.5rem', fontWeight: 600 }}>
                {Object.values(pricesMap).reduce((sum, p) => sum + (p.modelCount || 0), 0)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginLeft: '0.25rem' }}>个模型</span>
            </div>
          </div>

          {/* Grid */}
          <div className="station-grid">
            {filtered.map(station => (
              <a key={station.id} href={`/stations/${station.slug}`} className="card station-card" style={{ display: 'block' }}>
                <div className="station-card-header">
                  <div>
                    <div className="station-name">
                      <span className="status-dot" style={{ background: getStatusColor(station.status), marginRight: '0.5rem' }} />
                      {station.name}
                    </div>
                    <div className="station-url">{station.url}</div>
                  </div>
                  <span className={`badge station-type-badge ${getStationTypeColor(station.type)}`}>
                    {getStationTypeLabel(station.type)}
                  </span>
                </div>

                <div className="station-stats">
                  <div className="stat-item">
                    <span className="stat-label">GPT-4o 价格</span>
                    <span className="stat-value price">{getLowestPrice(station.id, 'gpt-4o')}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">支持模型数</span>
                    <span className="stat-value">{getModelCount(station.id) || station.models.length}+</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">支付方式</span>
                    <span className="stat-value" style={{ fontSize: '0.8125rem' }}>
                      {station.payment.join(' / ')}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">数据来源</span>
                    <span className="stat-value" style={{ fontSize: '0.8125rem' }}>
                      {station.isAutoFetchable ? '🤖 自动' : '📝 手动'}
                    </span>
                  </div>
                </div>

                <div className="station-models">
                  {station.models.slice(0, 6).map(m => (
                    <span key={m} className="model-tag">{getModelDisplayName(m)}</span>
                  ))}
                  {station.models.length > 6 && (
                    <span className="model-tag">+{station.models.length - 6} more</span>
                  )}
                </div>

                {station.notes && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.5 }}>
                    {station.notes.slice(0, 80)}...
                  </p>
                )}
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.125rem' }}>没有找到匹配的站点</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>试试调整筛选条件</p>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Leaderboard */}
      <section style={{ padding: '2rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            🏆 GPT-4o 价格排行榜
          </h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>站点</th>
                  <th>类型</th>
                  <th>GPT-4o 输入</th>
                  <th>Claude 3.5 Sonnet</th>
                  <th>DeepSeek V3</th>
                  <th>支持模型</th>
                </tr>
              </thead>
              <tbody>
                {stations
                  .filter(s => s.status !== 'dead' && pricesMap[s.id])
                  .sort((a, b) => {
                    const aModels = pricesMap[a.id]?.models || {}
                    const bModels = pricesMap[b.id]?.models || {}
                    const aPriceEntry = Object.entries(aModels).find(([k]) => k.includes('gpt-4o') && !k.includes('mini') && !k.includes('turbo'))
                    const bPriceEntry = Object.entries(bModels).find(([k]) => k.includes('gpt-4o') && !k.includes('mini') && !k.includes('turbo'))
                    const aPrice = aPriceEntry?.[1]?.input || 999
                    const bPrice = bPriceEntry?.[1]?.input || 999
                    return aPrice - bPrice
                  })
                  .slice(0, 10)
                  .map((station, i) => (
                    <tr key={station.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td>
                        <a href={`/stations/${station.slug}`} style={{ color: 'var(--accent)', fontWeight: 500 }}>
                          {station.name}
                        </a>
                      </td>
                      <td>
                        <span className={`badge ${getStationTypeColor(station.type)}`}>
                          {getStationTypeLabel(station.type)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--green)', fontWeight: 600 }}>{getLowestPrice(station.id, 'gpt-4o')}</td>
                      <td style={{ color: 'var(--green)' }}>{getLowestPrice(station.id, 'claude-3-5-sonnet')}</td>
                      <td style={{ color: 'var(--green)' }}>{getLowestPrice(station.id, 'deepseek-v3')}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{getModelCount(station.id)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
