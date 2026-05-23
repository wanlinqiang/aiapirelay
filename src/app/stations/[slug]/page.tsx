// Server component wrapper - loads station data and renders detail page
import { getAllStations, getLatestPriceData, getStationBySlug } from '@/lib/data-server'
import StationDetailClient from '@/components/StationDetailClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const stations = getAllStations()
  return stations.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const station = getStationBySlug(slug)
  if (!station) return { title: '站点未找到' }
  return {
    title: `${station.name} - 价格与评测`,
    description: `${station.name} 中转站详情，支持模型：${station.models.slice(0, 5).join('、')}...`,
  }
}

export default async function StationDetailPage({ params }: Props) {
  const { slug } = await params
  const station = getStationBySlug(slug)
  if (!station) notFound()

  const prices = getLatestPriceData()
  const priceData = prices.find(p => p.station === station.id) || null

  return <StationDetailClient station={station} priceData={priceData} />
}
