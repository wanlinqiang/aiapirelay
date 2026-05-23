// Client-safe utility functions (no fs/path imports)

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return '-'
  if (price < 0.01) return `¥${price.toFixed(4)}`
  if (price < 1) return `¥${price.toFixed(3)}`
  return `¥${price.toFixed(2)}`
}

export function getStationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'official-relay': '官方中转',
    'mixed': '混合渠道',
    'reverse': '逆向工程',
    'aggregator': '聚合平台',
  }
  return labels[type] || type
}

export function getStationTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'official-relay': 'bg-green-500/20 text-green-400 border-green-500/30',
    'mixed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'reverse': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'aggregator': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  }
  return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'active': '#22c55e',
    'unverified': '#eab308',
    'inactive': '#6b7280',
    'dead': '#ef4444',
  }
  return colors[status] || '#6b7280'
}

export function getModelDisplayName(modelId: string): string {
  const names: Record<string, string> = {
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini',
    'gpt-4.1': 'GPT-4.1',
    'gpt-4.1-mini': 'GPT-4.1 Mini',
    'gpt-4.1-nano': 'GPT-4.1 Nano',
    'gpt-4-turbo': 'GPT-4 Turbo',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
    'claude-3-5-sonnet': 'Claude 3.5 Sonnet',
    'claude-3-5-haiku': 'Claude 3.5 Haiku',
    'claude-3-7-sonnet': 'Claude 3.7 Sonnet',
    'deepseek-v3': 'DeepSeek V3',
    'deepseek-v4': 'DeepSeek V4',
    'gemini-2.0-flash': 'Gemini 2.0 Flash',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
    'gemini-1.5-flash': 'Gemini 1.5 Flash',
    'qwen-max': 'Qwen Max',
    'qwen-plus': 'Qwen Plus',
    'yi-large': 'Yi Large',
  }
  return names[modelId] || modelId
}

export function getPopularModels(): string[] {
  return [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4.1',
    'gpt-4.1-mini',
    'claude-3-5-sonnet',
    'deepseek-v3',
    'gemini-2.0-flash',
  ]
}
