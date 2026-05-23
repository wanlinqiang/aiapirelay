'use client'

import { useState, useMemo } from 'react'
import type { Station, StationPriceData } from '@/lib/types'
import { buildModelIndex, getPopularModels, searchModels, getAllModels, type ModelEntry } from '@/lib/model-utils'

interface Props {
  stations: Station[]
  pricesMap: Record<string, StationPriceData>
}

export default function HomeClient({ stations, pricesMap }: Props) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'popular' | 'all'>('popular')

  const modelIndex = useMemo(() => buildModelIndex(pricesMap), [pricesMap])
  const popularModels = useMemo(() => getPopularModels(modelIndex, 12), [modelIndex])
  const allModels = useMemo(() => getAllModels(modelIndex).slice(0, 30), [modelIndex])

  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return []
    return searchModels(modelIndex, query)
  }, [query, modelIndex])

  const displayedModels = activeTab === 'popular' ? popularModels : allModels

  const updateTime = useMemo(() => {
    const dates = Object.values(pricesMap)
      .map(pd => pd.fetchedAt)
      .filter(Boolean)
      .sort()
    return dates.length > 0 ? dates[dates.length - 1].split('T')[0] : '—'
  }, [pricesMap])

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">AI API 价格对比</h1>
          <p className="hero-subtitle">
            汇集全网中转站 API 价格，支持 GPT-4o、Claude、DeepSeek 等主流模型
          </p>

          {/* Search */}
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="搜索模型，如 gpt-4o、claude-3-5-sonnet..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.slice(0, 8).map(m => (
                  <a key={m.id} href={`/models/${encodeURIComponent(m.id)}`} className="search-result-item">
                    <span style={{ fontWeight: 600 }}>{m.id}</span>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: '0.8125rem' }}>
                      {m.stations.length} 个平台
                      {m.stations[0]?.input != null && (
                        <span className="price-input" style={{ marginLeft: '0.5rem', fontWeight: 600 }}>
                          ¥{m.stations[0].input.toFixed(4)}
                        </span>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">{Object.keys(modelIndex).length.toLocaleString()}</div>
              <div className="stat-label">模型数量</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stations.length}</div>
              <div className="stat-label">平台数量</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ fontSize: '1rem' }}>{updateTime}</div>
              <div className="stat-label">数据更新</div>
            </div>
          </div>
        </div>
      </section>

      {/* Model list */}
      <section style={{ padding: '0 0 3rem' }}>
        <div className="container">
          {/* Tabs */}
          <div className="filter-tabs">
            <button
              className={`filter-tab ${activeTab === 'popular' ? 'active' : ''}`}
              onClick={() => setActiveTab('popular')}
            >
              热门模型
            </button>
            <button
              className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              全部模型
            </button>
          </div>

          {/* Model grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {displayedModels.map(m => (
              <a key={m.id} href={`/models/${encodeURIComponent(m.id)}`} className="model-grid-card">
                <div className="model-name">{m.id}</div>
                <div className="model-meta">
                  {m.stations.length} 个平台
                  {m.stations[0]?.input != null && (
                    <span className="price-input" style={{ marginLeft: '0.5rem', fontWeight: 600 }}>
                      ¥{m.stations[0].input.toFixed(4)}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
