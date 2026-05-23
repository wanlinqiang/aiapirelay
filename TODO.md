# AI API 中转导航站 - 开发 TODO

> 项目：AI API 中转导航站
> 状态跟踪

---

## 环境准备

- [ ] 检查 /root/aitoolbox 项目（已有 Next.js 基础，可复用）
- [ ] 或新建 /root/aiapirelay 项目

---

## Day 1：项目初始化 + 数据建设

### 1.1 项目初始化
- [ ] 初始化 Next.js 16 项目
  ```bash
  npx create-next-app@latest aiapirelay --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*"
  ```
- [ ] 配置 next.config.ts（static export）
- [ ] 安装依赖（gray-matter, yaml, remark-gfm）
- [ ] 配置 path alias

### 1.2 布局与样式
- [ ] 创建 src/app/globals.css（深色主题）
- [ ] 创建 src/app/layout.tsx（导航栏 + SEO meta）
- [ ] 创建 src/components/Header.tsx

### 1.3 数据层
- [ ] 创建 data/stations.yaml（初始 10 个站点数据）
- [ ] 创建 src/lib/stations.ts（YAML 加载 + 解析）
- [ ] 创建 src/lib/types.ts（TypeScript 接口）

### 1.4 价格抓取脚本
- [ ] 创建 scripts/fetch-pricing.py
- [ ] 测试 yunwu.ai 价格抓取
- [ ] 测试 bltcy.ai 价格抓取
- [ ] 测试 rcouyi.com 价格抓取
- [ ] 验证数据结构正确

### 1.5 站点监控脚本
- [ ] 创建 scripts/monitor-sites.py
- [ ] 测试所有站点可用性检测
- [ ] 测试延迟测量
- [ ] 测试状态变化对比逻辑

### 1.6 Cron Job 配置
- [ ] 配置每日价格抓取（09:00）
- [ ] 配置每日站点监控（09:00）
- [ ] 测试 cron job 执行

---

## Day 2：页面开发

### 2.1 首页 (/)
- [ ] 创建 src/app/page.tsx
- [ ] 实现搜索功能（按站点名/模型名搜索）
- [ ] 实现筛选功能（类型/支付/模型支持）
- [ ] 实现站点卡片列表（3列网格）
- [ ] 实现价格排行榜 TOP 5
- [ ] 添加首页 SEO meta

### 2.2 站点列表页 (/stations)
- [ ] 创建 src/app/stations/page.tsx
- [ ] 实现表格视图（可排序列）
- [ ] 实现筛选器
- [ ] 实现分页

### 2.3 站点详情页 (/stations/[slug])
- [ ] 创建 src/app/stations/[slug]/page.tsx
- [ ] 实现 generateStaticParams
- [ ] 展示站点基础信息
- [ ] 展示价格表（从 pricing-history 加载）
- [ ] 展示支持模型列表
- [ ] 添加 Affiliate 推广按钮
- [ ] 添加测速功能入口

### 2.4 数据更新
- [ ] 更新 sitemap.ts
- [ ] 添加 robots.txt
- [ ] 更新 generateStaticParams（全部路由）

---

## Day 3：工具页面

### 3.1 对比工具 (/compare)
- [ ] 创建 src/app/compare/page.tsx
- [ ] 实现站点选择器（最多5个）
- [ ] 实现模型选择器
- [ ] 实现对比表格
- [ ] 高亮最便宜选项

### 3.2 价格计算器 (/calculator)
- [ ] 创建 src/app/calculator/page.tsx
- [ ] 实现用量输入（次数 + token 数）
- [ ] 实现模型选择
- [ ] 实现站点选择
- [ ] 输出月费用估算 + TOP 3 排名

### 3.3 评测文章 (/blog)
- [ ] 创建 src/app/blog/page.tsx
- [ ] 创建 src/app/blog/[slug]/page.tsx
- [ ] 写 3 篇锚定文章

### 3.4 SEO 优化
- [ ] 配置 next-sitemap.config.js
- [ ] 验证 sitemap.xml 生成
- [ ] 提交 sitemap 到 Google Search Console
- [ ] 配置 Google Analytics 4

---

## Day 4：自动化 + 上线

### 4.1 自动化脚本完善
- [ ] 完善 fetch-pricing.py（全部站点）
- [ ] 完善 monitor-sites.py
- [ ] 添加 Telegram 预警消息格式
- [ ] 测试完整 cron job 链路

### 4.2 内容
- [ ] 更新 10 个站点的完整数据
- [ ] 更新所有站点的价格缓存
- [ ] 补充站点详情页内容

### 4.3 Git 部署
- [ ] Git init / add / commit
- [ ] 创建 GitHub 仓库
- [ ] 推送 GitHub
- [ ] Vercel 部署配置
- [ ] 验证 Vercel 部署成功

### 4.4 上线检查
- [ ] 本地测试所有页面
- [ ] 线上测试所有页面
- [ ] 验证 GA4 数据流入
- [ ] 验证 sitemap 被 Google 收录

---

## Day 5：推广 + 调优

### 5.1 推广
- [ ] 在 V2EX 发帖（附链接）
- [ ] 在掘金发文章
- [ ] 提交到 awesome-ai-api-proxy PR

### 5.2 优化
- [ ] 添加 favicon
- [ ] 添加 og:image（首页 + 详情页）
- [ ] 优化页面加载速度
- [ ] 修复已知 bug

### 5.3 Affiliate 对接
- [ ] 联系 yunwu.ai 商务谈推广
- [ ] 获取专属推广链接
- [ ] 更新站点数据中的 affiliateUrl

---

## 后续运营

### 每周维护
- [ ] 周一：检查价格变化，更新数据
- [ ] 周一：检查站点可用性
- [ ] 周一：发 Telegram 周报给 Lucas
- [ ] 按需：添加新站点

### 月度任务
- [ ] 每月：扩充 3-5 个新站点
- [ ] 每月：写 2 篇新文章
- [ ] 每月：检查 SEO 排名变化
- [ ] 每月：评估 AdSense 申请资格

---

## 待确认事项

- [ ] 域名用 aitolbox.cc 还是新注册 apiagent.cn？
- [ ] 是否需要接入 Google AdSense？
- [ ] 是否需要做英文版本（面向海外开发者）？

---

*最后更新：2026-05-22*
