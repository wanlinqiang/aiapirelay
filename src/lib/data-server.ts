// Server-side data loading (uses fs/path - NOT for client components)
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { Station, StationPriceData } from './types'

export function getAllStations(): Station[] {
  const filePath = path.join(process.cwd(), 'data', 'stations.yaml')
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, 'utf-8')
  const data = yaml.load(content) as { stations: Station[] }
  return data.stations || []
}

export function getStationBySlug(slug: string): Station | undefined {
  return getAllStations().find(s => s.slug === slug)
}

export function getLatestPriceData(): StationPriceData[] {
  const historyDir = path.join(process.cwd(), 'data', 'pricing-history')
  if (!fs.existsSync(historyDir)) return []
  const files = fs.readdirSync(historyDir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse()
  if (files.length === 0) return []
  const latestFile = path.join(historyDir, files[0])
  const content = fs.readFileSync(latestFile, 'utf-8')
  const data = JSON.parse(content)
  return Object.values(data) as StationPriceData[]
}

export function getPricesMap(): Record<string, StationPriceData> {
  const prices = getLatestPriceData()
  const map: Record<string, StationPriceData> = {}
  for (const p of prices) map[p.station] = p
  return map
}
