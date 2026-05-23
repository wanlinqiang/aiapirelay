// Server component wrapper
import { getAllStations, getPricesMap } from '@/lib/data-server'
import CalculatorClient from '@/components/CalculatorClient'

export default function CalculatorPage() {
  const stations = getAllStations()
  const pricesMap = getPricesMap()
  return <CalculatorClient stations={stations} pricesMap={pricesMap} />
}
