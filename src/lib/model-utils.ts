// Model-centric data utilities
import type { StationPriceData } from './types'

export interface ModelEntry {
  id: string
  name: string
  stations: Array<{
    stationId: string
    stationName: string
    input: number | null
    output: number | null
    group?: string
  }>
}

// Build model → stations index from price data
export function buildModelIndex(pricesMap: Record<string, StationPriceData>): Record<string, ModelEntry> {
  const index: Record<string, ModelEntry> = {}

  for (const [stationId, pd] of Object.entries(pricesMap)) {
    for (const [modelId, priceInfo] of Object.entries(pd.models)) {
      if (!index[modelId]) {
        index[modelId] = { id: modelId, name: modelId, stations: [] }
      }
      index[modelId].stations.push({
        stationId,
        stationName: pd.name,
        input: priceInfo.input,
        output: priceInfo.output,
        group: priceInfo.group,
      })
    }
  }

  // Sort stations by input price
  for (const model of Object.values(index)) {
    model.stations.sort((a, b) => (a.input ?? 999) - (b.input ?? 999))
  }

  return index
}

// Get popular model IDs (most stations carry them)
export function getPopularModels(modelIndex: Record<string, ModelEntry>, limit = 12): ModelEntry[] {
  return Object.values(modelIndex)
    .filter(m => m.stations.length >= 2)
    .sort((a, b) => b.stations.length - a.stations.length)
    .slice(0, limit)
}

// Search models by name
export function searchModels(modelIndex: Record<string, ModelEntry>, query: string): ModelEntry[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return Object.values(modelIndex)
    .filter(m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q))
    .slice(0, 20)
}

// Get all unique model IDs sorted
export function getAllModels(modelIndex: Record<string, ModelEntry>): ModelEntry[] {
  return Object.values(modelIndex).sort((a, b) => a.id.localeCompare(b.id))
}
