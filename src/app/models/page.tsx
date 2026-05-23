import type { Metadata } from 'next'
import { getAllStations, getPricesMap } from '@/lib/data-server'
import ModelListClient from '@/components/ModelListClient'

export const metadata: Metadata = {
  title: '模型列表',
  description: '浏览所有支持的 AI 模型',
}

export default function ModelsPage() {
  const stations = getAllStations()
  const pricesMap = getPricesMap()

  return <ModelListClient stations={stations} pricesMap={pricesMap} />
}
