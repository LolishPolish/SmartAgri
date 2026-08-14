import { useState, useEffect } from 'react'
import { Leaf, Bug, Shield, Camera, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'

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

interface Alert {
  id: string
  type: string
  message: string
  source: string
  timestamp: string
  acknowledged: number
}

const pestDetectionData = [
  { pest: 'Aphids', count: 12, severity: 'low' },
  { pest: 'Whiteflies', count: 5, severity: 'low' },
  { pest: 'Spider Mites', count: 2, severity: 'medium' },
  { pest: 'Thrips', count: 8, severity: 'low' },
]

const diseaseData = [
  { disease: 'Powdery Mildew', affected: 3, severity: 'medium' },
  { disease: 'Leaf Spot', affected: 1, severity: 'low' },
  { disease: 'Rust', affected: 0, severity: 'none' },
  { disease: 'Blight', affected: 2, severity: 'low' },
]

export default function CropHealth() {
  const [zones, setZones] = useState<CropZone[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [zonesData, alertsData] = await Promise.all([
          api.getCropZones(),
          api.getAlerts(),
        ])
        setZones(zonesData)
        setAlerts(alertsData)
      } catch (error) {
        console.error('Failed to load crop health data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading crop health data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Crop Health Monitoring</h2>
        <p className="text-gray-500 mt-1">AI-powered disease detection and growth tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Overall Health</p>
              <p className="text-3xl font-bold text-green-600 mt-1">Good</p>
            </div>
            <Leaf className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Disease Alerts</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {alerts.filter(a => a.type === 'critical' || a.type === 'warning').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pest Count</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">27</p>
            </div>
            <Bug className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Growth Stage</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">Vegetative</p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pest Detection</h3>
          <div className="space-y-3">
            {pestDetectionData.map((pest) => (
              <div key={pest.pest} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bug className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{pest.pest}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{pest.count} detected</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pest.severity === 'low' ? 'bg-green-100 text-green-700' :
                    pest.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {pest.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Surveillance</h3>
          <div className="space-y-3">
            {diseaseData.map((disease) => (
              <div key={disease.disease} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{disease.disease}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{disease.affected} zones affected</span>
                  {disease.affected === 0 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Zone-wise Crop Health</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Zone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Crop</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Planted</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Harvest</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Soil Moisture</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Temp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Health</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{zone.name}</td>
                  <td className="py-3 px-4 text-gray-600">{zone.crop_type}</td>
                  <td className="py-3 px-4 text-gray-600">{zone.planted_date}</td>
                  <td className="py-3 px-4 text-gray-600">{zone.expected_harvest}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${zone.soil_moisture}%` }} />
                      </div>
                      <span className="text-gray-600">{zone.soil_moisture}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{zone.temperature}°C</td>
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
                  <td className="py-3 px-4">
                    <button className="btn-secondary text-xs py-1 px-3 flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      Analyze
                    </button>
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
