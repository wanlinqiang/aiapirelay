// Server component wrapper
import { getAllStations, getPricesMap } from '@/lib/data-server'
import CompareClient from '@/components/CompareClient'

export default function ComparePage() {
  const stations = getAllStations()
  const pricesMap = getPricesMap()
  return <CompareClient stations={stations} pricesMap={pricesMap} />
}
