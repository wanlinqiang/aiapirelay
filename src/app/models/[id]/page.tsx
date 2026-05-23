// Model detail page — shows all stations that support this model, sorted by price
import { getPricesMap } from '@/lib/data-server'
import { buildModelIndex } from '@/lib/model-utils'
import { formatPrice } from '@/lib/utils-client'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  const pricesMap = getPricesMap()
  const modelIndex = buildModelIndex(pricesMap)
  return Object.keys(modelIndex).map(id => ({ id: encodeURIComponent(id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const modelId = decodeURIComponent(params.id)
  return {
    title: `${modelId} - API 价格对比`,
    description: `比较所有提供 ${modelId} 的中转站价格，找出最优惠的选择`,
  }
}

export default function ModelDetailPage({ params }: Props) {
  const pricesMap = getPricesMap()
  const modelIndex = buildModelIndex(pricesMap)
  const model = modelIndex[decodeURIComponent(params.id)]

  if (!model) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>模型未找到</h1>
        <p style={{ color: 'var(--text-muted)' }}>抱歉，没有找到匹配的模型数据。</p>
        <a href="/" style={{ color: 'var(--accent)', display: 'inline-block', marginTop: '1rem' }}>← 返回首页</a>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <nav style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <a href="/" style={{ color: 'var(--accent)' }}>首页</a>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>模型</span>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>{model.id}</span>
        </nav>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {model.id}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            共 {model.stations.length} 个站点提供此模型
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {model.stations.map((s, i) => (
            <a
              key={`${s.stationId}-${i}`}
              href={`/stations/${s.stationId}`}
              className="card"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', padding: '1rem 1.25rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: i === 0 ? 'var(--green)' : 'var(--bg-secondary)',
                  color: i === 0 ? '#000' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.125rem' }}>{s.stationName}</div>
                  {s.group && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.group}</div>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--green)' }}>
                  {s.input !== null ? `¥${formatPrice(s.input)}` : '-'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {s.output !== null ? `输出 ¥${formatPrice(s.output)}` : 'input / 1M tokens'}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
