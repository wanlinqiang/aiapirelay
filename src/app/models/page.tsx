// Model listing page — browse all available models
import { getPricesMap } from '@/lib/data-server'
import { buildModelIndex, getAllModels } from '@/lib/model-utils'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '模型列表',
  description: '浏览所有支持的中转站模型，按价格排序',
}

export default function ModelsPage() {
  const pricesMap = getPricesMap()
  const modelIndex = buildModelIndex(pricesMap)
  const allModels = getAllModels(modelIndex)

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>模型列表</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          共 {allModels.length} 个模型，{Object.keys(pricesMap).length} 个站点
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {allModels.map(m => (
            <Link
              key={m.id}
              href={`/models/${encodeURIComponent(m.id)}`}
              className="card"
              style={{ display: 'block', textDecoration: 'none', padding: '0.875rem 1rem' }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.375rem', lineHeight: 1.3 }}>
                {m.id}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {m.stations.length} 个站点
                {m.stations[0]?.input !== null && (
                  <span style={{ color: 'var(--green)', marginLeft: '0.5rem' }}>
                    ¥{m.stations[0].input}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
