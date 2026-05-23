// ============================================
// 站点数据模型
// ============================================

export type StationType = 'official-relay' | 'mixed' | 'reverse' | 'aggregator'
export type PaymentMethod = 'alipay' | 'wechat' | 'card' | 'enterprise-invoice'
export type StationStatus = 'active' | 'unverified' | 'inactive' | 'dead'

export interface Station {
  id: string
  name: string
  slug: string
  url: string
  apiBase: string
  pricingApi: string
  type: StationType
  payment: PaymentMethod[]
  status: StationStatus
  affiliateUrl: string
  contact: {
    telegram?: string
    email?: string
    wechat?: string
  }
  models: string[]
  description?: string
  notes: string
  officialModels: string[]
  lastChecked: string
  lastPriceUpdate: string
  avgLatency: number
  isAutoFetchable: boolean
  manualPriceUpdate?: boolean
  manualPrice?: Record<string, number>
  isDead?: boolean
}

// ============================================
// 价格数据模型
// ============================================

export interface ModelPrice {
  input: number | null
  output: number | null
  ratio: number
  group?: string
  completionRatio?: number
  groups?: Array<{
    group: string
    ratio: number
    priceType: number
    price: number
  }>
}

export interface StationPriceData {
  station: string
  name: string
  fetchedAt: string
  models: Record<string, ModelPrice>
  modelCount: number
  groups?: string[]
}

// ============================================
// 监控状态数据模型
// ============================================

export interface SiteStatus {
  station_id: string
  name: string
  url: string
  status_code: number | null
  latency_ms: number | null
  pricing_api_status: number | null
  pricing_api_latency_ms: number | null
  timestamp: string
  error?: string
  is_down: boolean
}

// ============================================
// 站点对比数据
// ============================================

export interface CompareResult {
  stationId: string
  stationName: string
  model: string
  inputPrice: number
  outputPrice: number | null
  latency: number | null
  official: boolean
}
