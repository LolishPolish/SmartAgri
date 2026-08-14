import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Droplets, FlaskConical, Beaker } from 'lucide-react'
import { api } from '../lib/api'
import { format } from 'date-fns'

interface SensorReading {
  id: number
  device_id: string
  type: string
  value: number
  timestamp: string
}

interface CropZone {
  id: string
  name: string
  crop_type: string
  health: string
  soil_moisture: number
  temperature: number
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  planted_date: string
  expected_harvest: string
}

export default function SoilMonitoring() {
  const [moistureData, setMoistureData] = useState<SensorReading[]>([])
  const [nitrogenData, setNitrogenData] = useState<SensorReading[]>([])
  const [phReadings, setPhReadings] = useState<SensorReading[]>([])
  const [zones, setZones] = useState<CropZone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [moisture, nitrogen, ph, zonesData] = await Promise.all([
          api.getSensorReadings({ type: 'soil_moisture', hours: 24, limit: 50 }),
          api.getSensorReadings({ type: 'nitrogen', hours: 24, limit: 50 }),
          api.getSensorReadings({ type: 'ph', hours: 24, limit: 50 }),
          api.getCropZones(),
        ])
        setMoistureData(moisture)
        setNitrogenData(nitrogen)
        setPhReadings(ph)
        setZones(zonesData)
      } catch (error) {
        console.error('Failed to load soil data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const chartData = (readings: SensorReading[]) =>
    readings.slice(-12).map(r => ({
      timestamp: r.timestamp,
      value: r.value,
    }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading soil data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Soil Monitoring</h2>
        <p className="text-gray-500 mt-1">Real-time soil health parameters across all zones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Soil Moisture</h3>
            <Droplets className="h-5 w-5 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData(moistureData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(v) => format(new Date(v as string), 'HH:mm')} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f620" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Current</span>
            <span className="text-2xl font-bold text-gray-900">
              {moistureData.length > 0 ? Math.round(moistureData[moistureData.length - 1].value) : '--'}%
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Nitrogen Levels</h3>
            <FlaskConical className="h-5 w-5 text-emerald-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData(nitrogenData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(v) => format(new Date(v as string), 'HH:mm')} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#059669" fill="#05966920" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Current</span>
            <span className="text-2xl font-bold text-gray-900">
              {nitrogenData.length > 0 ? Math.round(nitrogenData[nitrogenData.length - 1].value) : '--'} mg/kg
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">pH Levels</h3>
            <Beaker className="h-5 w-5 text-purple-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData(phReadings)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(v) => format(new Date(v as string), 'HH:mm')} />
              <YAxis domain={[5.5, 7.5]} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#a855f7" fill="#a855f720" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Current</span>
            <span className="text-2xl font-bold text-gray-900">
              {phReadings.length > 0 ? phReadings[phReadings.length - 1].value.toFixed(1) : '--'} pH
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone-wise Soil Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Zone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Crop</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Moisture</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">pH</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Nitrogen</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Phosphorus</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Potassium</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Health</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{zone.name}</td>
                  <td className="py-3 px-4 text-gray-600">{zone.crop_type}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${zone.soil_moisture}%` }} />
                      </div>
                      <span className="text-gray-600">{zone.soil_moisture}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{zone.ph}</td>
                  <td className="py-3 px-4 text-gray-600">{zone.nitrogen} mg/kg</td>
                  <td className="py-3 px-4 text-gray-600">{zone.phosphorus} mg/kg</td>
                  <td className="py-3 px-4 text-gray-600">{zone.potassium} mg/kg</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      zone.health === 'excellent' ? 'bg-green-100 text-green-700' :
                      zone.health === 'good' ? 'bg-blue-100 text-blue-700' :
                      zone.health === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {zone.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
