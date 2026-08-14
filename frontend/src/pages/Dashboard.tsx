import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts'
import { Thermometer, Droplets, Wind, Sun, TrendingUp, AlertTriangle, Activity } from 'lucide-react'
import { api } from '../lib/api'
import { format } from 'date-fns'

interface SensorReading {
  id: number
  device_id: string
  type: string
  value: number
  timestamp: string
}

interface Alert {
  id: string
  type: string
  message: string
  source: string
  timestamp: string
  acknowledged: number
}

const StatCard = ({ title, value, unit, icon: Icon, trend, color }: any) => (
  <div className="stat-card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {value}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
        </p>
        {trend !== undefined && trend !== null && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            <TrendingUp className="h-3 w-3" />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [soilMoistureData, setSoilMoistureData] = useState<SensorReading[]>([])
  const [temperatureData, setTemperatureData] = useState<SensorReading[]>([])
  const [phData, setPhData] = useState<SensorReading[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    async function loadData() {
      try {
        const [moisture, temp, ph, alertsData] = await Promise.all([
          api.getSensorReadings({ type: 'soil_moisture', hours: 24, limit: 50 }),
          api.getSensorReadings({ type: 'temperature', hours: 24, limit: 50 }),
          api.getSensorReadings({ type: 'ph', hours: 24, limit: 50 }),
          api.getAlerts(),
        ])
        setSoilMoistureData(moisture)
        setTemperatureData(temp)
        setPhData(ph)
        setAlerts(alertsData.slice(0, 3))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const latestMoisture = soilMoistureData.length > 0 ? soilMoistureData[soilMoistureData.length - 1].value : 62
  const latestTemp = temperatureData.length > 0 ? temperatureData[temperatureData.length - 1].value : 25
  const latestHumidity = 68

  const chartData = (readings: SensorReading[]) =>
    readings.map(r => ({
      timestamp: r.timestamp,
      value: r.value,
    }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-500 mt-1">Real-time monitoring across all farm zones</p>
        </div>
        <div className="text-sm text-gray-500">
          {format(currentTime, 'EEEE, MMMM d, yyyy h:mm a')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Soil Moisture" value={Math.round(latestMoisture)} unit="%" icon={Droplets} trend={-2.5} color="bg-blue-500" />
        <StatCard title="Temperature" value={Math.round(latestTemp)} unit="°C" icon={Thermometer} trend={1.2} color="bg-orange-500" />
        <StatCard title="Humidity" value={latestHumidity} unit="%" icon={Wind} trend={-0.8} color="bg-cyan-500" />
        <StatCard title="UV Index" value="6" unit="" icon={Sun} trend={0} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Soil Moisture (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData(soilMoistureData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(v) => format(new Date(v as string), 'HH:mm')} />
              <YAxis />
              <Tooltip labelFormatter={(v) => format(new Date(v as string), 'MMM d, HH:mm')} />
              <Area type="monotone" dataKey="value" stroke="#059669" fill="#05966920" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData(temperatureData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(v) => format(new Date(v as string), 'HH:mm')} />
              <YAxis />
              <Tooltip labelFormatter={(v) => format(new Date(v as string), 'MMM d, HH:mm')} />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} name="Temp" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">pH Levels by Zone</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData(phData).slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(v) => format(new Date(v as string), 'HH:mm')} />
              <YAxis domain={[5.5, 7.5]} />
              <Tooltip labelFormatter={(v) => format(new Date(v as string), 'MMM d, HH:mm')} />
              <Bar dataKey="value" fill="#0d9488" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500">No active alerts</p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    alert.type === 'critical' ? 'bg-red-50 border-red-100' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-100' :
                    'bg-blue-50 border-blue-100'
                  }`}
                >
                  {alert.type === 'critical' ? (
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  ) : (
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.source}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
