# AI API 中转导航站 - 完整项目方案

> 项目代号：AIRelay（AI API 中转站导航）
> 创建日期：2026-05-22
> 负责人：Hermes Agent（自动化运营） + Lucas（决策/资金）

---

## 一、项目概述

### 1.1 是什么

一个面向中国开发者的 **AI API 中转站导航站**，帮助开发者快速找到可用、稳定、便宜的海内外 AI API 中转服务。

核心功能：
- 中转站数据库（价格、模型、支付方式、状态）
- 智能筛选对比器（按价格/模型/类型/支付方式过滤）
- 价格计算器（选模型 + 用量 → 估算月费用）
- 跑路预警系统（每日监控站点可用性）
- API 测速工具（实际调用测延迟）
- 评测文章（选型指南、避坑指南）

### 1.2 目标用户

| 用户画像 | 特征 | 需求 |
|---|---|---|
| 独立开发者 | 个人做 AI 应用，需稳定便宜的 API | 比价、找靠谱站 |
| 初创公司 | 项目需要调用 OpenAI/Claude API | 批量采购、长期稳定 |
| 学生/研究者 | 预算有限，需要低价 API | 找最便宜的渠道 |
| 企业技术选型 | 评估中转 vs 自建 vs 官方 | 成本分析、风险评估 |

### 1.3 核心价值主张

**开发者角度**：一站比较所有中转站，不用一个个试、不怕站跑路
**中转站角度**：获取精准流量、用户充值后拿佣金

### 1.4 域名方案

| 域名 | 用途 | 优先级 |
|---|---|---|
| `aitoolbox.cc` | 主站（已有，可复用）| P0 |
| `apirelay.cn` | 中转站专用域名 | P1（需注册）|

**推荐策略**：主站用 `aitoolbox.cc/zh/relay` 或新建 `apiagent.cn`

---

## 二、市场分析

### 2.1 目标关键词

| 关键词 | 预估月搜索量 | 竞争度 | 优先级 |
|---|---|---|---|
| openai api 中转站 | 2000+ | 中 | P0 |
| gpt4 api 国内代理 | 1000+ | 低 | P0 |
| 中转站对比 | 500+ | 低 | P1 |
| 最便宜的gpt api | 3000+ | 中 | P1 |
| openai api proxy for china | 300+ | 极低 | P2（英文）|
| ai api relay station | 200+ | 极低 | P2（英文）|

### 2.2 竞争对手分析

| 竞争对手 | 类型 | 优缺点 |
|---|---|---|
| aiapipk.com | 价格聚合站 | ✅ 数据全，❌ 无 SEO 优化、无内容、界面丑 |
| awesome-ai-api-proxy (GitHub) | 列表 | ✅ 社区维护，❌ 只有列表、无流量、无变现 |
| 各中转站官网 | 单一站点 | ✅ 自身数据准确，❌ 无比较功能 |
| 百度/知乎软文 | 内容 | ❌ 分散、无聚合、不可运营 |

**结论**：市场存在明显空缺——没有一个 SEO 友好、内容完整、可持续运营的导航站。

### 2.3 监管风险评估

| 风险 | 等级 | 说明 | 对策 |
|---|---|---|---|
| 中转站本身法律灰色 | 中 | 中转站聚合本身不违法，但涉及推广 | 定位为"信息导航"，不参与交易 |
| Google AdSense 拒绝 | 低-中 | 中转站内容可能被视为灰色类别 | 优先做 affiliate，AdSense 作备选 |
| 站点被墙 | 低 | 导航站本身无敏感内容 | 域名选海外注册商 |

---

## 三、盈利模式

### 3.1 主要收入来源

#### 收入 1：CPS 导流佣金（最高优先级）

中转站普遍有推荐奖励机制：

| 站方 | 佣金比例 | 结算方式 |
|---|---|---|
| 云雾 API (yunwu.ai) | 推广代理制度（联系商务谈）| 充值返利 |
| 柏拉图 AI (bltcy) | 同上 | 充值返利 |
| No.1-API | 同上 | 充值返利 |
| CloseAI | 企业级合作 | 谈 |

**执行方式**：
- 在每个站点详情页放专属推广链接（URL 参数带 ref）
- 用户通过链接充值 → 我们拿 5-15% 佣金
- 不碰用户资金，直接跳转到原站充值

#### 收入 2：付费置顶推荐

中转站付费求置顶：
- 首页置顶：¥1000-3000/月
- 分类置顶：¥500-1500/月
- 需站方主动联系我们

#### 收入 3：广告位出租

中转站在我们页面投展示广告：
- 首页横幅：¥2000-5000/月
- 内页侧边栏：¥1000-2000/月

#### 收入 4：软文合作

帮中转站写"为什么选择 XXX"的评测文章：
- 每篇：¥500-2000
- 需保持客观（用户信任是核心资产）

#### 收入 5：AdSense（次优先级）

SEO 流量稳定后申请：
- 需域名满 6 个月、月 UV > 500
- 作为补充收入，不依赖

### 3.2 收入预估

| 阶段 | 月UV预估 | 主要收入 | 月收入预估 |
|---|---|---|---|
| 冷启动期（0-3月）| 500-2000 | 软文 + 广告位 | ¥500-2000 |
| 成长期（3-6月）| 2000-10000 | CPS佣金开始起量 | ¥3000-10000 |
| 稳定期（6-12月）| 10000+ | CPS + 置顶 + AdSense | ¥15000+ |

---

## 四、技术架构

### 4.1 技术栈

```
框架:        Next.js 16 (App Router, Turbopack)
语言:        TypeScript
样式:        Tailwind CSS
部署:        Vercel (static export)
静态数据:    YAML 文件（站点数据）
自动化:      Cron Job (Hermes 内置)
SEO:        next-sitemap + 手动 sitemap.xml
分析:       Google Analytics 4
```

**不用的方案**：
- ❌ 数据库（MySQL/PostgreSQL）→ 纯静态，Vercel 免费层最优
- ❌ 动态 SSR → 静态导出，零服务器成本
- ❌ Playwright → API 端点直接拿数据，不需要 JS 渲染

### 4.2 目录结构

```
/root/aiapirelay/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 全局布局（深色主题）
│   │   ├── page.tsx                # 首页（站点列表 + 搜索）
│   │   ├── globals.css
│   │   ├── stations/
│   │   │   ├── page.tsx            # 全部站点列表页
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # 单个站点详情页
│   │   ├── compare/
│   │   │   └── page.tsx            # 对比工具页
│   │   ├── calculator/
│   │   │   └── page.tsx            # 价格计算器页
│   │   ├── blog/
│   │   │   └── page.tsx           # 评测文章列表
│   │   └── [...slug]/
│   │       └── page.tsx            # 文章详情页
│   └── components/
│       ├── StationCard.tsx         # 站点卡片组件
│       ├── StationTable.tsx        # 站点表格（可筛选）
│       ├── PriceBadge.tsx          # 价格标签
│       ├── StatusBadge.tsx         # 站点状态标签
│       ├── ModelList.tsx           # 支持模型列表
│       └── Header.tsx              # 导航栏
├── data/
│   ├── stations.yaml                # 中转站主数据库
│   └── pricing-history/            # 价格历史变化记录
│       └── {date}.json
├── scripts/
│   ├── fetch-pricing.py            # 价格抓取脚本
│   ├── monitor-sites.py            # 站点监控脚本
│   └── update-stations.js         # 站点数据更新脚本
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

### 4.3 数据模型

```typescript
// 站点数据 (stations.yaml)
interface Station {
  id: string;                    // 唯一ID (如 "yunwu")
  name: string;                  // 站点名称 (如 "云雾 API")
  slug: string;                  // URL slug (如 "yunwu-ai")
  url: string;                   // 主页 URL
  apiBase: string;               // API base URL (如 "https://yunwu.ai/v1")
  pricingApi: string;            // 价格 API 端点 (如 "https://yunwu.ai/api/pricing")
  type: 'official-relay' | 'mixed' | 'reverse' | 'aggregator';
  payment: ('alipay' | 'wechat' | 'card' | 'enterprise-invoice')[];
  status: 'active' | 'unverified' | 'inactive' | 'dead';
  affiliateUrl?: string;         // 推广链接
  contact?: {                    # 联系方式
    telegram?: string;
    email?: string;
    wechat?: string;
  };
  notes?: string;                # 备注
  lastChecked: string;           // 最后检测时间 (ISO date)
  lastPriceUpdate: string;       // 最后价格更新时间
  models: string[];              // 支持的模型 ID 列表
  pricing?: {                    # 缓存的价格数据 (自动更新)
    [modelId: string]: {
      input: number;             // 输入价格 (元/千token)
      output: number;            // 输出价格 (元/千token)
      updatedAt: string;
    }
  };
  avgLatency?: number;           # 平均响应延迟 (ms)
}

// 价格历史
interface PriceHistory {
  date: string;
  stationId: string;
  prices: { [modelId: string]: { input: number; output: number } };
  status: 'up' | 'down' | 'stable';
  latency: number;
}
```

---

## 五、功能模块详细设计

### 5.1 首页（/）

**目标**：让用户快速找到目标站点

**布局**：
```
[搜索框 - 搜索站点名称或模型]
[筛选栏 - 类型 | 支付方式 | 模型支持 | 价格排序]
[站点卡片列表 - 3列网格]
  └── 每个卡片：名称、类型标签、价格区间(最低的GPT-4价格)、支付方式、状态灯
[价格排行榜 - TOP 5 最便宜的 GPT-4o]
[最近跑路预警条幅]
```

**SEO 优化**：
- Title: `AI API 中转站推荐 - 国内可用 GPT-4/Claude API 代理平台`
- Description: `最全的国内 AI API 中转站数据库，支持 OpenAI GPT-4、Claude、DeepSeek 等模型，比官方便宜 30-90%，含价格对比、测速、跑路预警。`

### 5.2 站点详情页（/stations/[slug]）

**目标**：提供完整的单站信息，促进转化

**内容模块**：
```
[站点名称 + 类型标签 + 状态灯]
[快速操作栏]
  ├── [立即使用] → 跳转站方官网（带 ref）
  └── [测试 API] → 调用测速功能
[基础信息]
  - 支付方式（图标）
  - 注册时间（如果知道）
  - 联系方式
[价格表] ← 自动从 API 更新
  - GPT-4o: ¥{price}/千token
  - GPT-4o-mini: ¥{price}/千token
  - Claude 3.5 Sonnet: ¥{price}/千token
  - DeepSeek V3: ¥{price}/千token
[支持模型列表]
[响应速度测试结果]
[Affiliate 推广链接]
[用户评价/评论区域]
[相关文章推荐]
```

### 5.3 对比工具（/compare）

**目标**：横向比较多个站点

**功能**：
- 选择 2-5 个站点
- 选择要比较的模型
- 展示价格、延迟、支持模型的对比表格
- 高亮最便宜的选项

### 5.4 价格计算器（/calculator）

**目标**：帮用户估算月费用

**功能**：
- 输入框：每天请求次数、平均 token 数（输入/输出）
- 选择模型
- 多选使用的站点
- 输出：月费用估算 + 排名最便宜的 TOP 3

### 5.5 评测文章（/blog）

**内容计划**：
1. 《国内中转站 vs 官方 API：选哪个？》
2. 《中转站防骗指南：如何识别逆向站》
3. 《GPT-4o、Claude 3.5、DeepSeek V3 哪家强？》
4. 《中转站跑路预警：这些站请慎用》
5. 《开发者视角：用了 6 个月中转站的血泪史》
6. 《如何自己搭建 API 中转站》

### 5.6 跑路预警系统

**自动化监控内容**：
```
每日 Cron Job 检测：
  1. curl 每个站点的 /api/pricing 或主页
  2. 记录 HTTP 状态码
  3. 测量响应延迟 (time_total)
  4. 推送变化到 Telegram：
     - 新增模型 → "✅ {站点} 新增了 {模型}"
     - 价格变化 → "💰 {站点} 的 GPT-4o 价格: {旧价} → {新价}"
     - 站点不可用 → "🚨 {站点} 疑似跑路，请确认！"
     - 延迟异常 → "⚠️ {站点} 延迟过高: {延迟}ms"
```

---

## 六、中转站数据库（初始版本）

### 6.1 已确认可抓取价格的站点

| 站点 | URL | 价格 API | 类型 | 可自动化 |
|---|---|---|---|---|
| 云雾 API (yunwu) | https://yunwu.ai | https://yunwu.ai/api/pricing | mixed | ✅ |
| 柏拉图 AI (bltcy) | https://api.bltcy.ai | https://api.bltcy.ai/api/pricing | mixed | ✅ |
| No.1-API | https://api.rcouyi.com | https://api.rcouyi.com/api/pricing | aggregator | ✅ |
| UiUiAPI | https://uiuiapi.com | 待测试 | official-relay | ✅（推测）|
| CloseAI | https://www.closeai-asia.com | 待联系 | official-relay | ⚠️ |

### 6.2 需人工维护的站点

| 站点 | URL | 类型 | 维护方式 |
|---|---|---|---|
| GPTGOD | https://gptgod.online | reverse | 每周手动查价 |
| MKEAI | https://mkeai.com | mixed | 每周手动查价 |
| DMXAPI | https://dmxapi.cn | mixed | 每周手动查价 |

### 6.3 站点数据 YAML 模板

```yaml
stations:
  - id: yunwu
    name: 云雾 API (YUNWU)
    slug: yunwu-ai
    url: https://yunwu.ai
    apiBase: https://yunwu.ai/v1
    pricingApi: https://yunwu.ai/api/pricing
    type: mixed
    payment: [alipay, wechat]
    status: active
    affiliateUrl: https://yunwu.ai?ref=aitoolbox
    contact:
      telegram: https://t.me/yunwu_ai
    models: [gpt-4o, gpt-4o-mini, gpt-4.1, claude-3-5-sonnet, deepseek-v3, ...]
    notes: 速度快、稳定性好、支持模型多
    lastChecked: 2026-05-22T00:00:00Z
    lastPriceUpdate: 2026-05-22T00:00:00Z
    avgLatency: 120
```

---

## 七、爬虫/监控自动化方案

### 7.1 价格抓取脚本 (`scripts/fetch-pricing.py`)

```python
#!/usr/bin/env python3
"""
fetch-pricing.py - 每日抓取所有中转站价格数据
运行方式: python3 scripts/fetch-pricing.py
触发: 每日 Cron Job (09:00)
"""

import json
import time
import requests
from datetime import datetime
from pathlib import Path

STATIONS = {
    'yunwu': {
        'url': 'https://yunwu.ai/api/pricing',
        'type': 'mixed'
    },
    'bltcy': {
        'url': 'https://api.bltcy.ai/api/pricing',
        'type': 'mixed'
    },
    'rcouyi': {
        'url': 'https://api.rcouyi.com/api/pricing',
        'type': 'aggregator'
    },
    # 持续扩充...
}

def fetch_station(station_id: str, config: dict) -> dict:
    """抓取单个站点的价格数据"""
    try:
        resp = requests.get(config['url'], timeout=10)
        if resp.status_code != 200:
            return {'error': f'HTTP {resp.status_code}'}
        
        data = resp.json()
        # 解析各站不同的数据格式
        return parse_pricing(station_id, data, config['type'])
    except Exception as e:
        return {'error': str(e)}

def parse_pricing(station_id: str, data: dict, stype: str) -> dict:
    """
    解析各站点不同的 pricing API 格式
    返回标准化数据
    """
    result = {
        'stationId': station_id,
        'fetchedAt': datetime.utcnow().isoformat(),
        'prices': {},
        'models': []
    }
    
    if station_id == 'yunwu':
        model_groups = data.get('data', {}).get('model_group', {})
        for group_name, group_data in model_groups.items():
            ratio = group_data.get('GroupRatio', 1)
            for model_id, price_info in group_data.get('ModelPrice', {}).items():
                # priceType: 0=输入, 1=输出
                if price_info.get('priceType') == 0:
                    result['prices'][model_id] = {
                        'input': price_info['price'] * ratio,
                        'output': None,  # 需从 completion_ratio 计算
                        'ratio': ratio,
                        'group': group_name
                    }
                    result['models'].append(model_id)
    
    elif station_id == 'bltcy':
        models = data.get('data', [])
        for m in models:
            model_name = m.get('model_name')
            price = m.get('model_price', 0)
            ratio = m.get('model_ratio', 1)
            result['prices'][model_name] = {
                'input': price * ratio,
                'output': price * ratio * m.get('completion_ratio', 1),
                'ratio': ratio
            }
            result['models'].append(model_name)
    
    # ... 其他站点解析逻辑
    
    return result

def save_pricing(data: dict, date_str: str):
    """保存价格数据到文件"""
    out_dir = Path('data/pricing-history')
    out_dir.mkdir(parents=True, exist_ok=True)
    
    out_file = out_dir / f'{date_str}.json'
    existing = {}
    if out_file.exists():
        existing = json.load(out_file.open())
    
    existing[data['stationId']] = data
    json.dump(existing, out_file.open('w'), ensure_ascii=False, indent=2)

def main():
    date_str = datetime.now().strftime('%Y-%m-%d')
    print(f'[{date_str}] 开始抓取价格数据...')
    
    for station_id, config in STATIONS.items():
        print(f'  抓取 {station_id}...')
        result = fetch_station(station_id, config)
        
        if 'error' in result:
            print(f'  ❌ {station_id}: {result["error"]}')
        else:
            print(f'  ✅ {station_id}: {len(result["models"])} 个模型')
            save_pricing(result, date_str)
        
        time.sleep(2)  # 避免请求过快
    
    print('完成！')

if __name__ == '__main__':
    main()
```

### 7.2 站点监控脚本 (`scripts/monitor-sites.py`)

```python
#!/usr/bin/env python3
"""
monitor-sites.py - 每日监控所有站点可用性和延迟
运行方式: python3 scripts/monitor-sites.py
触发: 每日 Cron Job (09:00)
"""

import subprocess
import json
import time
import requests
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

@dataclass
class SiteStatus:
    station_id: str
    url: str
    status_code: Optional[int]
    latency_ms: Optional[float]
    price_api_status: Optional[int]
    price_api_latency_ms: Optional[float]
    timestamp: str
    error: Optional[str] = None

def check_site(station_id: str, url: str, price_api: str = None) -> SiteStatus:
    """检测单个站点的可用性和延迟"""
    result = SiteStatus(
        station_id=station_id,
        url=url,
        status_code=None,
        latency_ms=None,
        price_api_status=None,
        price_api_latency_ms=None,
        timestamp=datetime.utcnow().isoformat(),
        error=None
    )
    
    try:
        # 检测主页
        start = time.time()
        resp = requests.get(url, timeout=10)
        result.latency_ms = round((time.time() - start) * 1000)
        result.status_code = resp.status_code
        
        # 检测价格 API
        if price_api:
            start = time.time()
            try:
                resp2 = requests.get(price_api, timeout=10)
                result.price_api_latency_ms = round((time.time() - start) * 1000)
                result.price_api_status = resp2.status_code
            except:
                result.price_api_status = 0
                
    except Exception as e:
        result.error = str(e)
    
    return result

def check_all_sites(stations: dict) -> list:
    """检查所有站点"""
    results = []
    for station_id, info in stations.items():
        result = check_site(
            station_id,
            info.get('url', f"https://{info['id']}.com"),
            info.get('pricingApi')
        )
        results.append(result)
        print(f"  {station_id}: HTTP {result.status_code}, "
              f"延迟 {result.latency_ms}ms, "
              f"价格API {result.price_api_status}")
        time.sleep(1)
    return results

def detect_changes(old: list, new: list) -> list:
    """对比新旧状态，检测变化"""
    changes = []
    old_map = {s['station_id']: s for s in old}
    
    for s in new:
        old_s = old_map.get(s.station_id)
        if old_s is None:
            changes.append({'type': 'new', 'station': s.station_id, 'status': s})
            continue
        
        # 检测状态变化
        if s.status_code != old_s['status_code'] and s.status_code is not None:
            changes.append({
                'type': 'status_change',
                'station': s.station_id,
                'old_status': old_s['status_code'],
                'new_status': s.status_code,
                'severity': 'high' if s.status_code != 200 else 'low'
            })
        
        # 检测延迟异常
        if s.latency_ms and old_s['latency_ms']:
            ratio = s.latency_ms / old_s['latency_ms']
            if ratio > 2.0:  # 延迟翻倍
                changes.append({
                    'type': 'latency_spike',
                    'station': s.station_id,
                    'old_latency': old_s['latency_ms'],
                    'new_latency': s.latency_ms,
                    'severity': 'medium'
                })
    
    return changes

def load_previous_status() -> list:
    """加载上次的监控状态"""
    status_file = Path('data/previous-status.json')
    if status_file.exists():
        return json.load(status_file.open())
    return []

def save_current_status(status: list):
    """保存当前状态"""
    status_file = Path('data/previous-status.json')
    serializable = [
        {**s.__dict__} for s in status
    ]
    json.dump(serializable, status_file.open('w'), ensure_ascii=False)

def main():
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] 开始站点监控...")
    
    # 站点列表
    stations = {
        'yunwu': {'url': 'https://yunwu.ai', 'pricingApi': 'https://yunwu.ai/api/pricing'},
        'bltcy': {'url': 'https://api.bltcy.ai', 'pricingApi': 'https://api.bltcy.ai/api/pricing'},
        'rcouyi': {'url': 'https://api.rcouyi.com', 'pricingApi': 'https://api.rcouyi.com/api/pricing'},
        'closeai': {'url': 'https://www.closeai-asia.com'},
        # ...
    }
    
    results = check_all_sites(stations)
    old_status = load_previous_status()
    
    if old_status:
        changes = detect_changes(old_status, results)
        if changes:
            print(f'\n检测到 {len(changes)} 个变化：')
            for c in changes:
                print(f'  {c}')
            # 生成 Telegram 预警消息
            send_telegram_alert(changes)
        else:
            print('\n无状态变化。')
    else:
        print('\n首次运行，无历史数据可对比。')
    
    save_current_status(results)
    print('监控完成。')

if __name__ == '__main__':
    main()
```

---

## 八、部署方案

### 8.1 域名与 DNS

| 域名 | DNS 配置 | 用途 |
|---|---|---|
| `aitoolbox.cc` | CNAME → Vercel | 主站（现有）|
| `apiagent.cn`（待注册）| CNAME → Vercel | 中转站专用域名 |

### 8.2 Vercel 部署

```
GitHub 仓库: 新建 aiapirelay repo
连接方式: GitHub public repo → Vercel auto-deploy
构建命令: npm run build && next export
输出目录: out/
环境变量:
  NEXT_PUBLIC_GA_ID=G-XXXXXXXX
  NEXT_PUBLIC_SITE_URL=https://apiagent.cn
```

### 8.3 CI/CD 流程

```
Git push → GitHub → Vercel 自动构建 → 静态文件部署
                          ↓
                   Hermes Cron Job
                   (每日 09:00)
                          ↓
              更新 data/pricing-history/*.json
                          ↓
                   Git add/commit/push
                          ↓
                   Vercel 自动重新部署
```

---

## 九、运营方案

### 9.1 定时任务一览

| 任务 | 频率 | 时间 | 执行内容 | 输出 |
|---|---|---|---|---|
| 价格抓取 | 每日 | 09:00 | `fetch-pricing.py` | 更新价格 JSON |
| 站点监控 | 每日 | 09:00 | `monitor-sites.py` | Telegram 预警 |
| 内容更新 | 每周一 | 10:00 | 手动更新 YAML 数据库 | Git commit |
| SEO 检查 | 每日 | 08:00 | curl 检测 sitemap/robots | 报告 |
| 关键词追踪 | 每周 | 周一 11:00 | 检查排名变化 | 报告 |

### 9.2 内容更新 SOP（每周一执行）

```
Step 1: 检查 aiapipk.com 是否有新站点
Step 2: 测试新站点的 /api/pricing 端点
Step 3: 能自动抓取 → 加入 stations.yaml
         需要手动 → 记录到 pending-sites.md
Step 4: 测试所有现有站点的 API 是否还活着
Step 5: 更新 Git → 触发 Vercel 部署
Step 6: 发 Telegram 周报给 Lucas
```

### 9.3 外链推广 SOP

```
渠道 1: V2EX (v2ex.com)
  - 发帖标题: 「做了一个 AI API 中转站导航站，支持价格对比和跑路预警」
  - 内容: 分享导航站链接，不发硬广告
  - 频率: 每月 1 次

渠道 2: 掘金 (juejin.cn)
  - 发技术文章: 「如何选择 AI API 中转站：2026 全面对比」
  - 嵌入导航站链接
  - 频率: 每月 2 篇

渠道 3: GitHub awesome 列表
  - 向 awesome-ai-api-proxy 提交 PR，添加导航站链接
  - 频率: 一次性

渠道 4: 少数派/小红书
  - 软广，不留外链，引导搜索「AI API 中转站」
  - 频率: 按需
```

---

## 十、开发计划（5天完成）

### Day 1：项目初始化 + 数据建设
```
[ ] 初始化 Next.js 16 项目 (TypeScript + Tailwind)
[ ] 配置 next.config.ts (static export, sitemap)
[ ] 创建 data/stations.yaml 初始数据
[ ] 编写 fetch-pricing.py 并测试
[ ] 创建 monitor-sites.py 并测试
[ ] 配置 Hermens Cron Job（价格抓取 + 站点监控）
```

### Day 2：页面开发
```
[ ] 全局布局 + 深色主题 (layout.tsx + globals.css)
[ ] 首页 (page.tsx) - 搜索 + 筛选 + 站点卡片
[ ] 站点详情页模板 (/stations/[slug])
[ ] 站点数据 YAML 加载逻辑
[ ] 静态生成所有站点页面 (generateStaticParams)
```

### Day 3：工具页面
```
[ ] 对比工具页 (/compare)
[ ] 价格计算器 (/calculator)
[ ] SEO 优化 (sitemap.xml, robots.txt, meta tags)
[ ] Google Analytics 4 接入
```

### Day 4：自动化 + SEO
```
[ ] 完善 fetch-pricing.py（支持全部已知站点）
[ ] Telegram 预警消息模板
[ ] 提交 sitemap 到 Google Search Console
[ ] 写 3 篇锚定文章（/blog）
[ ] GitHub push + Vercel 部署
```

### Day 5：上线 + 调优
```
[ ] 测试所有页面、功能
[ ] 修复任何 bug
[ ] 添加 favicon + og:image
[ ] 提交到 Vercel Analytics（如果有免费版）
[ ] 提交网站到 Google Search Console
[ ] 上线确认报告发给 Lucas
```

---

## 十一、关键成功指标（KPIs）

| 指标 | 目标（第1个月）| 目标（第3个月）| 测量方式 |
|---|---|---|---|
| 月 UV | 500 | 5000 | Google Analytics |
| 收录页面数 | 30 | 100 | GSC |
| 核心关键词排名 | TOP 20 | TOP 5 | Google Search |
| 中转站数据库数量 | 10 | 30 | 数据文件 |
| Affiliate 佣金 | ¥0（冷启动）| ¥2000 | 站方后台 |
| Telegram 用户数 | 5 | 50 | 订阅用户 |

---

## 十二、风险与对策

| 风险 | 概率 | 对策 |
|---|---|---|
| 中转站被墙导致用户流失 | 低 | 持续扩充站池，任何一个跑路不影响大局 |
| 价格 API 突然需要认证 | 中 | 及时发现，手动更新数据，标记为 unverified |
| 佣金政策变化 | 中 | 保持与多个站点的合作关系 |
| Google 处罚 | 低 | 内容原创，不做纯粹链接农场 |
| 服务器 IP 被中转站屏蔽 | 低 | 监控脚本使用随机 UA，控制请求频率 |

---

## 十三、Affiliate 合作推进计划

### 第一批（立即可做）

1. **云雾 API (yunwu.ai)**
   - 行动：访问 https://yunwu.ai/affiliate 或联系 Telegram
   - 目标：拿到专属推广链接 + 确认佣金比例

2. **No.1-API (rcouyi.com)**
   - 行动：同样方式联系

3. **aiapipk.com**
   - 行动：联系对方谈广告位合作

### 第二批（3个月后）

4. **CloseAI** - 企业级合作
5. **UiUiAPI** - 付费置顶

---

## 十四、文件清单

```
/root/aiapirelay/
├── PROJECT_PLAN.md              # 本文档
├── TODO.md                      # 详细开发 TODO
├── data/
│   ├── stations.yaml            # 中转站数据库（手动维护）
│   └── pricing-history/         # 价格历史（自动更新）
├── scripts/
│   ├── fetch-pricing.py         # 价格抓取
│   └── monitor-sites.py         # 站点监控
├── src/                         # Next.js 项目
└── notes/
    ├── affiliate-contacts.md    # 推广联系方式
    └── pending-work.md          # 待处理工作
```

---

*文档版本：1.0*
*最后更新：2026-05-22*
*下一步行动：Day 1 开发启动*
