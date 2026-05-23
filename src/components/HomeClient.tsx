'use client'

import { useState, useMemo } from 'react'
import type { Station, StationPriceData } from '@/lib/types'
import { buildModelIndex, getPopularModels, searchModels, type ModelEntry } from '@/lib/model-utils'
import { getModelDisplayName, formatPrice } from '@/lib/utils-client'

interface Props {
  stations: Station[]
  pricesMap: Record<string, StationPriceData>
}

export default function HomeClient({ stations, pricesMap }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [selectedModel, setSelectedModel] = useState<ModelEntry | null>(null)

  const modelIndex = useMemo(() => buildModelIndex(pricesMap), [pricesMap])
  const popularModels = useMemo(() => getPopularModels(modelIndex, 12), [modelIndex])

  const searchResults = useMemo(() => {
    if (!search.trim() || search.length < 2) return []
    return searchModels(modelIndex, search)
  }, [search, modelIndex])

  const activeStations = useMemo(() => 
    stations.filter(s => s.status !== 'dead'),
    [stations]
  )

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

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'popular', label: '热门' },
    { id: 'coding', label: '编程工具' },
    { id: 'reasoning', label: '推理模型' },
  ]

  const getFilteredModels = () => {
    if (category === 'popular') return popularModels
    if (category === 'coding') {
      return Object.entries(modelIndex)
        .filter(([id]) => id.includes('code') || id.includes('claude') || id.includes('gpt-4'))
        .map(([, data]) => data)
        .slice(0, 12)
    }
    if (category === 'reasoning') {
      return Object.entries(modelIndex)
        .filter(([id]) => id.includes('reasoning') || id.includes('o1') || id.includes('o3'))
        .map(([, data]) => data)
        .slice(0, 12)
    }
    return popularModels
  }

  const updateTime = useMemo(() => {
    const dates = Object.entries(pricesMap)
      .map(([_, pd]) => pd.fetchedAt)
      .filter(Boolean)
      .sort()
    return dates.length > 0 ? dates[dates.length - 1].split('T')[0] : '未知'
  }, [pricesMap])

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">AI API 价格对比</h1>
          <p className="hero-subtitle">
            汇集全网中转站 API 价格，支持 GPT-4、Claude、DeepSeek 等主流模型<br />
            轻松找到最优惠的 AI API 来源
          </p>

          {/* Search */}
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="搜索模型名称，如 gpt-4o、claude-3-5-sonnet..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.slice(0, 8).map(m => (
                  <button
                    key={m.id}
                    className="search-result-item"
                    onClick={() => {
                      setSelectedModel(m)
                      setSearch('')
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{m.id}</span>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: '0.8125rem' }}>
                      {m.stations.length} 个站点
                      {m.stations[0]?.input !== null && (
                        <span className="price-text" style={{ marginLeft: '0.5rem' }}>
                          ¥{formatPrice(m.stations[0].input)}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                {Object.keys(modelIndex).length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>模型数量</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                {activeStations.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>收录站点</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                {updateTime}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>最后更新</div>
            </div>
          </div>

          {/* Category tabs */}
          <div className="filter-bar">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Model Comparison */}
      {selectedModel && (
        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {selectedModel.id} — 价格对比
              </h2>
              <button
                onClick={() => setSelectedModel(null)}
                style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                ← 返回
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedModel.stations.map((s, i) => (
                <a
                  key={`${s.stationId}-${i}`}
                  href={`/stations/${s.stationId}`}
                  className="card"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', padding: '0.875rem 1.25rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '50%',
                      background: i === 0 ? 'var(--price)' : 'var(--muted)',
                      color: i === 0 ? '#fff' : 'var(--muted-foreground)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{s.stationName}</div>
                      {s.group && (
                        <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>{s.group}</div>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--price)' }}>
                      {s.input !== null ? `¥${formatPrice(s.input)}` : '-'}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>
                      {s.output !== null ? `输出 ¥${formatPrice(s.output)}` : 'input / 1M tokens'}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Models Grid */}
      {!selectedModel && searchResults.length === 0 && (
        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              热门模型
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {getFilteredModels().map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className="model-grid-card"
                  style={{ cursor: 'pointer', textAlign: 'left', border: 'none' }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem', lineHeight: 1.3 }}>
                    {getModelDisplayName(m.id)}
                  </div>
                  <div style={{ color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>
                    {m.stations.length} 个站点
                    {m.stations[0]?.input !== null && (
                      <span className="price-text" style={{ marginLeft: '0.5rem' }}>
                        ¥{formatPrice(m.stations[0].input)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Station Grid */}
      {!selectedModel && searchResults.length === 0 && (
        <section style={{ padding: '2rem 0' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              全部站点
            </h2>
            <div className="station-grid">
              {activeStations.slice(0, 12).map(station => (
                <a key={station.id} href={`/stations/${station.slug}`} className="card station-card" style={{ display: 'block' }}>
                  <div className="station-card-header">
                    <div>
                      <div className="station-name">
                        <span className="status-dot" style={{ background: station.status === 'active' ? '#22c55e' : station.status === 'unverified' ? '#eab308' : '#6b7280', marginRight: '0.5rem' }} />
                        {station.name}
                      </div>
                      <div className="station-url">{station.url}</div>
                    </div>
                    <span className="badge" style={{
                      background: station.type === 'official-relay' ? 'rgba(34, 197, 94, 0.1)' :
                                  station.type === 'mixed' ? 'rgba(59, 130, 246, 0.1)' :
                                  station.type === 'reverse' ? 'rgba(234, 179, 8, 0.1)' :
                                  'rgba(168, 85, 247, 0.1)',
                      color: station.type === 'official-relay' ? '#22c55e' :
                             station.type === 'mixed' ? '#3b82f6' :
                             station.type === 'reverse' ? '#eab308' :
                             '#a855f7',
                      border: '1px solid',
                      borderColor: station.type === 'official-relay' ? 'rgba(34, 197, 94, 0.3)' :
                                   station.type === 'mixed' ? 'rgba(59, 130, 246, 0.3)' :
                                   station.type === 'reverse' ? 'rgba(234, 179, 8, 0.3)' :
                                   'rgba(168, 85, 247, 0.3)',
                    }}>
                      {station.type === 'official-relay' ? '官方中转' :
                       station.type === 'mixed' ? '混合渠道' :
                       station.type === 'reverse' ? '逆向工程' :
                       station.type === 'aggregator' ? '聚合平台' : station.type}
                    </span>
                  </div>

                  <div className="station-stats">
                    <div className="stat-item">
                      <span className="stat-label">GPT-4o</span>
                      <span className="stat-value price">{getLowestPrice(station.id, 'gpt-4o')}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">支持模型</span>
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
                      <span className="model-tag">+{station.models.length - 6}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>

            {activeStations.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted-foreground)' }}>
                <p style={{ fontSize: '1.125rem' }}>没有找到匹配的站点</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>试试调整筛选条件</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Pricing Leaderboard */}
      {!selectedModel && searchResults.length === 0 && (
        <section style={{ padding: '2rem 0', background: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              💰 GPT-4o 价格排行榜
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
                        <td style={{ color: 'var(--muted-foreground)' }}>{i + 1}</td>
                        <td>
                          <a href={`/stations/${station.slug}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                            {station.name}
                          </a>
                        </td>
                        <td>
                          <span className="badge" style={{
                            background: station.type === 'official-relay' ? 'rgba(34, 197, 94, 0.1)' :
                                        station.type === 'mixed' ? 'rgba(59, 130, 246, 0.1)' :
                                        'rgba(234, 179, 8, 0.1)',
                            color: station.type === 'official-relay' ? '#22c55e' :
                                   station.type === 'mixed' ? '#3b82f6' : '#eab308',
                            border: '1px solid',
                            borderColor: station.type === 'official-relay' ? 'rgba(34, 197, 94, 0.3)' :
                                         station.type === 'mixed' ? 'rgba(59, 130, 246, 0.3)' :
                                         'rgba(234, 179, 8, 0.3)',
                          }}>
                            {station.type === 'official-relay' ? '官方中转' :
                             station.type === 'mixed' ? '混合渠道' :
                             station.type === 'reverse' ? '逆向工程' :
                             station.type === 'aggregator' ? '聚合平台' : station.type}
                          </span>
                        </td>
                        <td style={{ color: 'var(--price)', fontWeight: 600 }}>{getLowestPrice(station.id, 'gpt-4o')}</td>
                        <td style={{ color: 'var(--price)' }}>{getLowestPrice(station.id, 'claude-3-5-sonnet')}</td>
                        <td style={{ color: 'var(--price)' }}>{getLowestPrice(station.id, 'deepseek-v3')}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{getModelCount(station.id)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
