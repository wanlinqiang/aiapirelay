// Server component wrapper - loads data server-side, passes to client
import { getAllStations, getPricesMap } from '@/lib/data-server'
import HomeClient from '@/components/HomeClient'

export default function HomePage() {
  const stations = getAllStations()
  const pricesMap = getPricesMap()

  return <HomeClient stations={stations} pricesMap={pricesMap} />
}
