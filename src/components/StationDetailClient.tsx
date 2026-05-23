'use client'

import type { Station, StationPriceData } from '@/lib/types'
import { getStationTypeLabel, getStationTypeColor, getStatusColor, getModelDisplayName, formatPrice } from '@/lib/utils-client'

interface Props {
  station: Station
  priceData: StationPriceData | null
}

export default function StationDetailClient({ station, priceData }: Props) {
  const models = Object.entries(priceData?.models || {})

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <nav style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <a href="/" style={{ color: 'var(--accent)' }}>首页</a>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <a href="/stations" style={{ color: 'var(--accent)' }}>站点列表</a>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>{station.name}</span>
        </nav>

        {/* Header */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="status-dot" style={{ background: getStatusColor(station.status), width: '12px', height: '12px' }} />
                {station.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '0.75rem' }}>
                {station.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className={`badge ${getStationTypeColor(station.type)}`}>
                  {getStationTypeLabel(station.type)}
                </span>
                <span className="badge bg-gray-500/20 text-gray-400 border-gray-500/30">
                  {station.payment.join(' / ')}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <a
                href={station.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                访问站点 →
              </a>
              {station.affiliateUrl && (
                <a
                  href={station.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ display: 'block', marginTop: '0.5rem', textDecoration: 'none', textAlign: 'center', fontSize: '0.8125rem' }}
                >
                  🔗 推广链接
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>支持模型</div>
              <div style={{ fontWeight: 600 }}>{priceData?.modelCount || station.models.length}+ 个</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>数据来源</div>
              <div style={{ fontWeight: 600 }}>{station.isAutoFetchable ? '🤖 自动更新' : '📝 手动更新'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>价格透明度</div>
              <div style={{ fontWeight: 600 }}>{priceData ? '✅ 完整' : '⚠️ 部分'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>平均延迟</div>
              <div style={{ fontWeight: 600 }}>{station.avgLatency ? `${station.avgLatency}ms` : '-'}</div>
            </div>
          </div>

          {station.notes && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '1rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '6px', lineHeight: 1.6 }}>
              💬 {station.notes}
            </p>
          )}
        </div>

        {/* Pricing Table */}
        {models.length > 0 ? (
          <div className="card" style={{ marginBottom: '1.5rem', padding: 0 }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>📋 支持模型及价格</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                价格数据来源：{priceData?.fetchedAt || '未知'}
              </p>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>模型</th>
                    <th>输入 (¥/1K)</th>
                    <th>输出 (¥/1K)</th>
                    <th>Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map(([modelId, priceInfo]) => (
                    <tr key={modelId}>
                      <td style={{ fontWeight: 500 }}>
                        {getModelDisplayName(modelId)}
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{modelId}</div>
                      </td>
                      <td style={{ color: 'var(--green)', fontWeight: 600 }}>
                        {priceInfo.input !== null ? formatPrice(priceInfo.input) : '-'}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {priceInfo.output !== null ? formatPrice(priceInfo.output) : '-'}
                      </td>
                      <td>
                        {priceInfo.ratio !== 1 ? (
                          <span style={{ color: 'var(--yellow)', fontSize: '0.8125rem' }}>{priceInfo.ratio}x</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>1x</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            暂无价格数据（可能该站点暂不支持自动抓取）
          </div>
        )}

        {/* Usage */}
        <div className="card">
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>📖 使用说明</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>1. 注册账号</strong><br />
              点击「访问站点」按钮进入官网，完成注册登录
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>2. 充值余额</strong><br />
              支持 {station.payment.join('、')}，建议首次充值 ¥50-100 试用
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>3. 获取 API Key</strong><br />
              在个人中心生成 API Key，格式类似 <code style={{ background: 'var(--bg-secondary)', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.875em' }}>sk-xxx...</code>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>4. 调用 API</strong><br />
              将请求发送至 <code style={{ background: 'var(--bg-secondary)', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.875em' }}>{station.apiBase}/v1/chat/completions</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
