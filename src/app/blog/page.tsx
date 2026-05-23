import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '评测文章',
  description: 'AI API 中转站评测、选型指南、防骗指南',
}

const ARTICLES = [
  {
    slug: 'which-to-choose',
    title: '国内中转站 vs 官方 API：选哪个？',
    excerpt: '深度对比官方 API 和中转站的价格、稳定性、风险，帮你做出最优选择。',
    date: '2026-05-22',
    tags: ['选型指南', '官方 API', '中转站'],
  },
  {
    slug: 'avoid-scams',
    title: '中转站防骗指南：如何识别逆向站',
    excerpt: '逆向工程站便宜但风险高。本文教你识别正规中转站 vs 逆向站，避免踩坑。',
    date: '2026-05-22',
    tags: ['防骗', '逆向站', '安全'],
  },
  {
    slug: 'gpt4-vs-claude',
    title: 'GPT-4o、Claude 3.5、DeepSeek V3 哪家强？',
    excerpt: '三大主流模型在不同站点的价格对比，以及如何根据场景选择最合适的模型。',
    date: '2026-05-22',
    tags: ['模型对比', 'GPT-4o', 'Claude', 'DeepSeek'],
  },
  {
    slug: 'top-cheap-stations',
    title: '2026 年最便宜的 AI API 中转站TOP 10',
    excerpt: '基于实际价格数据，盘点当前最便宜的 10 个中转站，附价格计算器。',
    date: '2026-05-22',
    tags: ['价格', 'TOP 10', '省钱'],
  },
  {
    slug: 'run-warning',
    title: '中转站跑路预警：这些站请慎用',
    excerpt: '整理近期疑似跑路或已跑路的中转站名单，帮助你规避资金损失风险。',
    date: '2026-05-22',
    tags: ['跑路预警', '安全'],
  },
]

export default function BlogPage() {
  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          📝 评测文章
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          AI API 中转站评测、选型指南、防骗技巧
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {ARTICLES.map(article => (
            <a
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="card"
              style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {article.title}
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                    {article.excerpt}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {article.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          padding: '0.125rem 0.5rem',
                          background: 'var(--accent-muted)',
                          color: 'var(--accent)',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {article.date}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
