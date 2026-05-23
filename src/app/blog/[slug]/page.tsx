import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return [
    { slug: 'which-to-choose' },
    { slug: 'avoid-scams' },
    { slug: 'gpt4-vs-claude' },
    { slug: 'top-cheap-stations' },
    { slug: 'run-warning' },
  ]
}

const ARTICLES: Record<string, {
  title: string
  date: string
  tags: string[]
  content: string
}> = {
  'which-to-choose': {
    title: '国内中转站 vs 官方 API：选哪个？',
    date: '2026-05-22',
    tags: ['选型指南', '官方 API', '中转站'],
    content: `## 官方 API vs 中转站

使用 OpenAI API 有两种方式：

### 1. 官方 API（OpenAI Direct）

**优点：**
- 官方直连，100% 稳定
- 最新模型第一时间可用
- 不存在跑路风险

**缺点：**
- 国内无法直接访问（需科学上网）
- 信用卡支付门槛高（需外币卡）
- 价格固定，无折扣空间

### 2. 中转站（API Proxy）

**优点：**
- 国内可直接访问
- 支付宝/微信支付
- 价格通常比官方低 30-90%
- 多了很多渠道可选

**缺点：**
- 存在跑路风险
- 稳定性取决于站点质量
- 可能有隐私风险

### 我们的建议

| 场景 | 推荐 |
|---|---|
| 企业关键业务 | 官方 API |
| 预算充足的企业 | 官方 API + 备用中转站 |
| 个人开发者 | 中转站（优先选混合型）|
| 预算有限 | 中转站（选价格最低的混合型）|

**关键原则：永远准备一个备用方案。**`,
  },
  'avoid-scams': {
    title: '中转站防骗指南：如何识别逆向站',
    date: '2026-05-22',
    tags: ['防骗', '逆向站', '安全'],
    content: `## 什么是逆向站？

逆向站（Reverse Proxy）通过技术手段直接转发请求到官方 API，本质上是"偷"官方的流量。

**特点：**
- 价格极低（可能只有官方的 10-20%）
- 无需付费给官方，站方利润极高
- 一旦被 OpenAI 封禁，整个站随时瘫痪

## 识别逆向站的特征

1. **价格低得离谱**
   - GPT-4o 输入价格 < ¥0.5/千token → 几乎肯定是逆向
   - 官方成本都要 $0.5/mtg tokens

2. **不支持信用卡/企业发票**
   - 正规站点即使混合渠道也会有支付宝/微信
   - 纯逆向站往往只能私下转账

3. **无官方渠道标注**
   - 正规混合站会标注"官方转"（从官方采购再转卖）
   - 逆向站不会说自己的上游是什么

4. **站点成立时间短**
   - 查域名注册时间（用 whois 查询）
   - < 6 个月的站慎用

## 我们的风险分级

| 类型 | 风险 | 适用场景 |
|---|---|---|
| 官方中转 | ⭐（极低）| 企业关键业务 |
| 混合渠道 | ⭐⭐（低）| 生产环境首选 |
| 聚合平台 | ⭐⭐（中）| 综合性价比 |
| 逆向工程 | ⭐⭐⭐⭐（极高）| 仅开发测试 |

**底线：涉及资金安全或业务连续性的场景，坚决不用逆向站。**`,
  },
  'gpt4-vs-claude': {
    title: 'GPT-4o、Claude 3.5、DeepSeek V3 哪家强？',
    date: '2026-05-22',
    tags: ['模型对比', 'GPT-4o', 'Claude', 'DeepSeek'],
    content: `## 主流模型对比

### GPT-4o（OpenAI）

**优势：**
- 通用能力最强
- 最新模型第一时间可用
- 生态最完善

**劣势：**
- 价格最高
- 国内需中转

### Claude 3.5 Sonnet（Anthropic）

**优势：**
- 长上下文最强（200K）
- 代码能力突出
- 输出稳定性好

**劣势：**
- 国内可用站点较少
- 价格中等

### DeepSeek V3（深度求索）

**优势：**
- 价格极低（约 ¥1/千token）
- 中文能力优秀
- 国产可控

**劣势：**
- 复杂推理任务不如 GPT-4
- 国际局势风险（美国出口管制）

## 价格对比（参考值）

| 模型 | 低价站点价格 | 官方参考价 |
|---|---|---|
| GPT-4o | ¥1.0-1.5 | $2.5/m |
| Claude 3.5 Sonnet | ¥1.5-3.0 | $3/m |
| DeepSeek V3 | ¥0.5-1.0 | ¥1（约）|

## 选择建议

- **日常对话/写作**：DeepSeek V3（性价比最高）
- **代码生成**：Claude 3.5 Sonnet（稳定）
- **复杂推理/多模态**：GPT-4o（最强）`,
  },
  'top-cheap-stations': {
    title: '2026 年最便宜的 AI API 中转站TOP 10',
    date: '2026-05-22',
    tags: ['价格', 'TOP 10', '省钱'],
    content: `## TOP 10 最便宜中转站

根据我们抓取的数据，以下是 GPT-4o 输入价格最低的站点：

> ⚠️ 价格每日变动，请以实际数据为准

| 排名 | 站点 | 类型 | GPT-4o 价格 | 特点 |
|---|---|---|---|---|
| 1 | GPTGOD | 逆向 | ¥0.3 | 最低价，稳定性差 |
| 2 | 云雾 API | 混合 | ¥1.25 | 平衡之选 |
| 3 | 柏拉图 AI | 混合 | ¥1.25 | 支持 MJ |
| 4 | No.1-API | 聚合 | ¥1.25 | 模型最全 |
| 5 | ... | ... | ... | ... |

> 价格参考时间：2026-05-22

**注意：最便宜 ≠ 最推荐。** 逆向站虽然价格最低，但稳定性无保证。

## 我们的推荐

综合考虑价格 + 稳定性 + 模型覆盖：

1. 🥇 **云雾 API** - 平衡之选
2. 🥈 **柏拉图 AI** - 图像需求首选
3. 🥉 **No.1-API** - 模型最全

详见价格对比工具和费用计算器。`,
  },
  'run-warning': {
    title: '中转站跑路预警：这些站请慎用',
    date: '2026-05-22',
    tags: ['跑路预警', '安全'],
    content: `## 跑路预警名单

以下站点已被标记为高风险，请慎用：

| 站点 | 状态 | 风险说明 |
|---|---|---|
| DMXAPI | 🚨 疑似跑路 | 无法访问（HTTP 000）|
| 某不知名小站 | ⚠️ 高风险 | 社区反映无法充值 |

## 如何判断站点的风险

1. **观察充值后响应**
   - 如果充值后立刻不到账，立刻报警

2. **监控 API 延迟**
   - 延迟突然变高 → 可能即将跑路

3. **查看社群反馈**
   - V2EX/掘金/知乎搜索站名

## 我们的预警机制

本站每日监控所有收录站点的可用性。如果某个站点出现异常，会在首页顶部显示红色预警横幅。

## 防跑路建议

1. **分散风险**：不要把所有的钱都充在一个站点
2. **小额定投**：首次充值不超过 ¥100
3. **备用方案**：至少准备 2 个可用站点
4. **及时提现**：账户里不要存太多余额`,
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const article = ARTICLES[slug]

  if (!article) {
    notFound()
  }

  // Simple markdown-to-HTML conversion
  const htmlContent = article.content
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.5rem;font-weight:700;margin:2rem 0 1rem;color:var(--text-primary)">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:1.125rem;font-weight:600;margin:1.5rem 0 0.75rem;color:var(--text-primary)">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split(' | ').map(c => c.trim())
      return `<tr>${cells.map(c => `<td style="padding:0.5rem;border:1px solid var(--border-color)">${c}</td>`).join('')}</tr>`
    })
    .replace(/(<tr>.*<\/tr>)/gs, '<table style="border-collapse:collapse;width:100%;margin:1rem 0">$&</table>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.5rem 0;color:var(--text-secondary)">$1</li>')
    .replace(/\n\n/g, '</p><p style="line-height:1.7;color:var(--text-secondary);margin:1rem 0">')
    .replace(/\n/g, '<br/>')

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <nav style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          <a href="/" style={{ color: 'var(--accent)' }}>首页</a>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <a href="/blog" style={{ color: 'var(--accent)' }}>评测文章</a>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>{article.title}</span>
        </nav>

        <article>
          <header style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {article.date}
              </span>
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
          </header>

          <div
            dangerouslySetInnerHTML={{ __html: `<p style="line-height:1.7;color:var(--text-secondary);margin:1rem 0">${htmlContent}</p>` }}
          />
        </article>
      </div>
    </div>
  )
}
