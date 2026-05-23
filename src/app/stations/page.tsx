// Server component wrapper
import { getAllStations, getPricesMap } from '@/lib/data-server'
import StationsClient from '@/components/StationsClient'

export default function StationsPage() {
  const stations = getAllStations()
  const pricesMap = getPricesMap()
  return <StationsClient stations={stations} pricesMap={pricesMap} />
}
