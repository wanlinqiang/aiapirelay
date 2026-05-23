import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GetCheapAI - AI API 价格对比',
  description: '全网最全的 AI API 价格数据库，支持 GPT-4o、Claude、DeepSeek 等主流模型，轻松比较各大平台价格。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="header">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '3.5rem' }}>
            <a href="/" style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary)', letterSpacing: '-.025em' }}>
              GetCheapAI
            </a>
            <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="/" className="nav-link">首页</a>
              <a href="/models" className="nav-link">模型</a>
              <a href="/stations" className="nav-link">平台</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container">
            <p>GetCheapAI - AI API 价格对比</p>
            <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>本站仅作信息导航，不参与任何交易</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
