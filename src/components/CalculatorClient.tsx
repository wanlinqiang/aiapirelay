'use client'

import { useState, useMemo } from 'react'
import type { Station, StationPriceData } from '@/lib/types'
import { getModelDisplayName, formatPrice } from '@/lib/utils-client'

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4.1', name: 'GPT-4.1' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'deepseek-v3', name: 'DeepSeek V3' },
]

interface Props {
  stations: Station[]
  pricesMap: Record<string, StationPriceData>
}

export default function CalculatorClient({ stations, pricesMap }: Props) {
  const [requestsPerDay, setRequestsPerDay] = useState(100)
  const [avgInputTokens, setAvgInputTokens] = useState(1000)
  const [avgOutputTokens, setAvgOutputTokens] = useState(2000)
  const [selectedModel, setSelectedModel] = useState('gpt-4o')

  const monthlyRequests = requestsPerDay * 30
  const monthlyInputTokens = monthlyRequests * avgInputTokens
  const monthlyOutputTokens = monthlyRequests * avgOutputTokens

  const results = useMemo(() => {
    return stations
      .filter(s => s.status !== 'dead' && pricesMap[s.id])
      .map(station => {
        const pd = pricesMap[station.id]
        let pricePer1KInput = 0
        let pricePer1KOutput = 0

        const modelData = Object.entries(pd.models).find(([k]) =>
          k.toLowerCase().includes(selectedModel.toLowerCase()) ||
          selectedModel.toLowerCase().includes(k.toLowerCase())
        )

        if (modelData) {
          pricePer1KInput = modelData[1].input || 0
          pricePer1KOutput = modelData[1].output || 0
        }

        const monthlyInputCost = (monthlyInputTokens / 1000) * pricePer1KInput
        const monthlyOutputCost = (monthlyOutputTokens / 1000) * pricePer1KOutput
        const totalMonthly = monthlyInputCost + monthlyOutputCost

        return {
          id: station.id,
          name: station.name,
          inputPrice: pricePer1KInput,
          outputPrice: pricePer1KOutput,
          monthlyCost: totalMonthly,
          official: station.type === 'official-relay',
        }
      })
      .filter(r => r.inputPrice > 0)
      .sort((a, b) => a.monthlyCost - b.monthlyCost)
      .slice(0, 5)
  }, [stations, pricesMap, selectedModel, monthlyInputTokens, monthlyOutputTokens])

  const lowestCost = results[0]?.monthlyCost || 0

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          🧮 API 费用计算器
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          估算不同站点在不同使用量下的月费用
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card">
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                使用量设置
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                    每天请求次数
                  </label>
                  <input
                    type="number"
                    value={requestsPerDay}
                    onChange={e => setRequestsPerDay(Number(e.target.value))}
                    min={1}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                    平均输入 Token 数
                  </label>
                  <input
                    type="number"
                    value={avgInputTokens}
                    onChange={e => setAvgInputTokens(Number(e.target.value))}
                    min={1}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
                    平均输出 Token 数
                  </label>
                  <input
                    type="number"
                    value={avgOutputTokens}
                    onChange={e => setAvgOutputTokens(Number(e.target.value))}
                    min={1}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                选择模型
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`filter-btn ${selectedModel === m.id ? 'active' : ''}`}
                    style={{ justifyContent: 'flex-start', width: '100%', cursor: 'pointer' }}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'var(--bg-secondary)' }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                月使用量估算
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>请求次数</div>
                  <div style={{ fontWeight: 600 }}>{monthlyRequests.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>输入 Token</div>
                  <div style={{ fontWeight: 600 }}>{(monthlyInputTokens / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>输出 Token</div>
                  <div style={{ fontWeight: 600 }}>{(monthlyOutputTokens / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>总 Token</div>
                  <div style={{ fontWeight: 600 }}>{((monthlyInputTokens + monthlyOutputTokens) / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>
                  💰 月费用排名（{getModelDisplayName(selectedModel)}）
                </h2>
              </div>

              {results.length > 0 ? (
                <div style={{ padding: '0.5rem 0' }}>
                  {results.map((r, i) => (
                    <div
                      key={r.id}
                      style={{
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid var(--border-color)',
                        background: i === 0 ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {r.name}
                            {r.official && (
                              <span style={{ fontSize: '0.625rem', background: 'var(--green)', color: 'white', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>
                                官方
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                            输入 {formatPrice(r.inputPrice)} / 输出 {formatPrice(r.outputPrice)} / 千token
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--green)' }}>
                          ¥{r.monthlyCost.toFixed(0)}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/月</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  暂无价格数据
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
