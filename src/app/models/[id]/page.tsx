import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllStations, getPricesMap } from '@/lib/data-server'
import { buildModelIndex, type ModelEntry } from '@/lib/model-utils'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const stations = getAllStations()
  const pricesMap = getPricesMap()
  const modelIndex = buildModelIndex(pricesMap)
  return Object.keys(modelIndex).map(id => ({ id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const decoded = decodeURIComponent(id)
  return {
    title: `${decoded} 价格对比`,
    description: `比较 ${decoded} 在各平台的 API 价格`,
  }
}

export default async function ModelDetailPage({ params }: Props) {
  const { id } = await params
  const modelId = decodeURIComponent(id)

  const stations = getAllStations()
  const pricesMap = getPricesMap()
  const modelIndex = buildModelIndex(pricesMap)

  const model = modelIndex[modelId]
  if (!model) {
    notFound()
  }

  // Sort by input price
  const sorted = [...model.stations].sort((a, b) => (a.input ?? 999) - (b.input ?? 999))

  return (
    <div style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Back */}
        <a href="/" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>
          ← 返回
        </a>

        {/* Title */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          {model.id}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
          {model.stations.length} 个平台提供此模型
        </p>

        {/* Price table */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.625rem', overflow: 'hidden' }}>
          <table className="price-table">
            <thead>
              <tr>
                <th style={{ width: '2rem', textAlign: 'center' }}>#</th>
                <th>平台</th>
                <th style={{ textAlign: 'right' }}>输入 (¥/M)</th>
                <th style={{ textAlign: 'right' }}>输出 (¥/M)</th>
                <th style={{ textAlign: 'right' }}>跳转</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={`${s.stationId}-${i}`}>
                  <td style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: '0.75rem' }}>
                    {i + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.stationName}</div>
                    {s.group && (
                      <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>{s.group}</div>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="price-input">
                      {s.input != null ? `¥${s.input.toFixed(4)}` : '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="price-output">
                      {s.output != null ? `¥${s.output.toFixed(4)}` : '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <a
                      href={`/stations/${s.stationId}`}
                      style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      查看 →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
