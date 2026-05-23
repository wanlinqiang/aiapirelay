'use client'

import { useState, useMemo } from 'react'
import type { Station, StationPriceData } from '@/lib/types'
import { buildModelIndex, getAllModels, searchModels, type ModelEntry } from '@/lib/model-utils'

interface Props {
  stations: Station[]
  pricesMap: Record<string, StationPriceData>
}

export default function ModelListClient({ stations, pricesMap }: Props) {
  const [query, setQuery] = useState('')

  const modelIndex = useMemo(() => buildModelIndex(pricesMap), [pricesMap])
  const allModels = useMemo(() => getAllModels(modelIndex), [modelIndex])

  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return []
    return searchModels(modelIndex, query)
  }, [query, modelIndex])

  const displayedModels = query.length >= 2 ? searchResults : allModels

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Search */}
        <div className="search-wrapper" style={{ marginBottom: '2rem' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="搜索模型..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Results count */}
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
          共 {displayedModels.length.toLocaleString()} 个模型
        </p>

        {/* Model grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {displayedModels.slice(0, 100).map(m => (
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

        {displayedModels.length > 100 && (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            显示前 100 个模型，请使用搜索查找更多
          </p>
        )}
      </div>
    </div>
  )
}
