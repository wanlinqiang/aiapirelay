import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI API 中转站导航 - 国内可用 GPT-4/Claude API 代理平台',
    template: '%s | AI API 中转导航',
  },
  description: '最全的国内 AI API 中转站数据库，支持 OpenAI GPT-4、Claude、DeepSeek 等模型，比官方便宜 30-90%，含价格对比、测速、跑路预警。',
  keywords: ['AI API 中转站', 'GPT-4 API 代理', 'Claude API 国内', 'OpenAI API 中转', 'API 代理平台', 'AI API 价格对比'],
  authors: [{ name: 'AIRelay' }],
  openGraph: {
    title: 'AI API 中转站导航',
    description: '国内可用 AI API 中转站大全，价格对比、跑路预警、测速工具',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="header">
          <div className="container header-inner">
            <a href="/" className="nav-brand" style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--accent)' }}>
              🔄 AIRelay
            </a>
            <nav className="nav-links">
              <a href="/stations" className="nav-link">全部站点</a>
              <a href="/compare" className="nav-link">价格对比</a>
              <a href="/calculator" className="nav-link">费用计算</a>
              <a href="/blog" className="nav-link">评测文章</a>
              <a href="/models" className="nav-link">模型</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <p className="footer-text">
              AIRelay - AI API 中转站导航 | 数据每日自动更新
            </p>
            <p className="footer-text" style={{ marginTop: '0.5rem' }}>
              本站仅作信息导航，不参与任何交易。使用前请自行判断风险。
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
