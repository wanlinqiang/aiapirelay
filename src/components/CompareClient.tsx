'use client'

import { useState, useMemo } from 'react'
import type { Station, StationPriceData } from '@/lib/types'
import { getStationTypeLabel, getModelDisplayName, formatPrice } from '@/lib/utils-client'

const POPULAR_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4.1', name: 'GPT-4.1' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'deepseek-v3', name: 'DeepSeek V3' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
]

interface Props {
  stations: Station[]
  pricesMap: Record<string, StationPriceData>
}

export default function CompareClient({ stations, pricesMap }: Props) {
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o')

  const activeStations = stations.filter(s => s.status !== 'dead')

  const toggleStation = (id: string) => {
    setSelectedStations(prev =>
      prev.includes(id) ? prev.filter(s => s !== id)
        : prev.length < 5 ? [...prev, id] : prev
    )
  }

  const comparisonData = useMemo(() => {
    return selectedStations.map(id => {
      const station = stations.find(s => s.id === id)
      const pd = pricesMap[id]

      let inputPrice: number | null = null
      let outputPrice: number | null = null

      if (pd) {
        const match = Object.entries(pd.models).find(([k]) =>
          k.toLowerCase().includes(selectedModel.toLowerCase()) ||
          selectedModel.toLowerCase().includes(k.toLowerCase())
        )
        if (match) {
          inputPrice = match[1].input
          outputPrice = match[1].output
        }
      }

      return {
        id,
        name: station?.name || id,
        type: station?.type || 'unknown',
        inputPrice,
        outputPrice,
        latency: station?.avgLatency || null,
      }
    }).sort((a, b) => (a.inputPrice || 999) - (b.inputPrice || 999))
  }, [selectedStations, selectedModel, stations, pricesMap])

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          📊 价格对比工具
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          选择 2-5 个站点，对比同一模型在不同站点的价格
        </p>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            选择站点（最多 5 个）
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {activeStations.map(station => (
              <button
                key={station.id}
                onClick={() => toggleStation(station.id)}
                className={`filter-btn ${selectedStations.includes(station.id) ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                {selectedStations.includes(station.id) ? '✓ ' : '+ '}{station.name}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            已选择 {selectedStations.length}/5 个站点
          </p>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            选择模型
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {POPULAR_MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`filter-btn ${selectedModel === model.id ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>

        {selectedStations.length >= 2 ? (
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                {getModelDisplayName(selectedModel)} 价格对比
              </h2>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>排名</th>
                    <th>站点</th>
                    <th>类型</th>
                    <th>输入价格</th>
                    <th>输出价格</th>
                    <th>延迟</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, i) => (
                    <tr key={item.id} style={i === 0 ? { background: 'rgba(34, 197, 94, 0.05)' } : {}}>
                      <td>
                        {i === 0 ? <span style={{ color: 'var(--green)', fontWeight: 700 }}>🥇</span>
                          : i === 1 ? <span>🥈</span>
                          : i === 2 ? <span>🥉</span>
                          : <span style={{ color: 'var(--text-muted)' }}>{i + 1}</span>}
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td>
                        <span className="badge" style={{ fontSize: '0.75rem' }}>
                          {getStationTypeLabel(item.type)}
                        </span>
                      </td>
                      <td style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1rem' }}>
                        {item.inputPrice !== null ? formatPrice(item.inputPrice) : <span style={{ color: 'var(--text-muted)' }}>无数据</span>}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {item.outputPrice !== null ? formatPrice(item.outputPrice) : '-'}
                      </td>
                      <td>
                        {item.latency ? `${item.latency}ms` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.125rem' }}>请选择至少 2 个站点进行对比</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>点击上方的站点按钮添加</p>
          </div>
        )}
      </div>
    </div>
  )
}
