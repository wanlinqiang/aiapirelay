'use client'

import { useState } from 'react'
import type { Station, StationPriceData } from '@/lib/types'
import { getModelDisplayName, formatPrice } from '@/lib/utils-client'

interface Props {
  stations: Station[]
  pricesMap: Record<string, StationPriceData>
}

export default function StationsClient({ stations, pricesMap }: Props) {
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const activeStations = stations.filter(s => s.status !== 'dead')

  const filtered = typeFilter === 'all'
    ? activeStations
    : activeStations.filter(s => s.type === typeFilter)

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '正常'
      case 'unverified': return '待验证'
      case 'inactive': return '停用'
      case 'dead': return '跑路'
      default: return status
    }
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          全部站点
        </h1>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
          共收录 {activeStations.length} 个中转站，其中 {stations.filter(s => s.isAutoFetchable).length} 个支持价格自动抓取
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'official-relay', 'mixed', 'reverse', 'aggregator'].map(type => (
            <button
              key={type}
              className={`filter-btn ${typeFilter === type ? 'active' : ''}`}
              onClick={() => setTypeFilter(type)}
            >
              {type === 'all' ? '全部' : 
               type === 'official-relay' ? '官方中转' :
               type === 'mixed' ? '混合渠道' :
               type === 'reverse' ? '逆向工程' :
               type === 'aggregator' ? '聚合平台' : type}
            </button>
          ))}
        </div>

        <div className="table-container" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>站点</th>
                <th>类型</th>
                <th>状态</th>
                <th>支付</th>
                <th>GPT-4o</th>
                <th>Claude 3.5</th>
                <th>DeepSeek V3</th>
                <th>模型数</th>
                <th>更新</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(station => {
                const pd = pricesMap[station.id]
                return (
                  <tr key={station.id}>
                    <td>
                      <a href={`/stations/${station.slug}`} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        {station.name}
                      </a>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>{station.url}</div>
                    </td>
                    <td>
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
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span className="status-dot" style={{ 
                          background: station.status === 'active' ? '#22c55e' : 
                                      station.status === 'unverified' ? '#eab308' : 
                                      station.status === 'dead' ? '#ef4444' : '#6b7280'
                        }} />
                        <span style={{ fontSize: '0.8125rem' }}>
                          {getStatusLabel(station.status)}
                        </span>
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>
                      {station.payment.join(', ')}
                    </td>
                    <td style={{ color: 'var(--price)', fontWeight: 600 }}>
                      {getLowestPrice(station.id, 'gpt-4o')}
                    </td>
                    <td style={{ color: 'var(--price)' }}>
                      {getLowestPrice(station.id, 'claude-3-5-sonnet')}
                    </td>
                    <td style={{ color: 'var(--price)' }}>
                      {getLowestPrice(station.id, 'deepseek-v3')}
                    </td>
                    <td style={{ color: 'var(--muted-foreground)' }}>
                      {pd?.modelCount || station.models.length}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                      {station.isAutoFetchable ? '🤖' : '📝'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
