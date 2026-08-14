import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CloudSun, Thermometer, Wind, Droplets, Gauge, CloudRain, SunMedium } from 'lucide-react'
import { api } from '../lib/api'
import { format } from 'date-fns'

interface SensorReading {
  id: number
  device_id: string
  type: string
  value: number
  timestamp: string
}

interface WeatherDay {
  day: string
  high: number
  low: number
  condition: string
  rain: number
  icon: string
}

export default function WeatherStation() {
  const [weatherData, setWeatherData] = useState<SensorReading[]>([])
  const [windData, setWindData] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)

  const forecast: WeatherDay[] = [
    { day: 'Today', high: 28, low: 18, condition: 'Partly Cloudy', rain: 10, icon: 'CloudSun' },
    { day: 'Tomorrow', high: 26, low: 17, condition: 'Rainy', rain: 80, icon: 'CloudRain' },
    { day: 'Wed', high: 24, low: 16, condition: 'Rainy', rain: 90, icon: 'CloudRain' },
    { day: 'Thu', high: 27, low: 18, condition: 'Sunny', rain: 0, icon: 'SunMedium' },
    { day: 'Fri', high: 29, low: 19, condition: 'Sunny', rain: 5, icon: 'SunMedium' },
  ]

  const getIcon = (name: string) => {
    switch (name) {
      case 'CloudSun': return CloudSun
      case 'CloudRain': return CloudRain
      case 'SunMedium': return SunMedium
      default: return CloudSun
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [temp, wind] = await Promise.all([
          api.getSensorReadings({ type: 'temperature', hours: 24, limit: 50 }),
          api.getSensorReadings({ type: 'wind_speed', hours: 24, limit: 50 }),
        ])
        setWeatherData(temp)
        setWindData(wind)
      } catch (error) {
        console.error('Failed to load weather data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const chartData = (readings: SensorReading[]) =>
    readings.map(r => ({
      timestamp: r.timestamp,
      value: r.value,
    }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading weather data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Weather Station</h2>
        <p className="text-gray-500 mt-1">Local weather conditions and 5-day forecast</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Temperature</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {weatherData.length > 0 ? `${Math.round(weatherData[weatherData.length - 1].value)}°C` : '--°C'}
              </p>
            </div>
            <Thermometer className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span>H: 28°C</span>
            <span>L: 18°C</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Humidity</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">68%</p>
            </div>
            <Droplets className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Wind Speed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {windData.length > 0 ? `${Math.round(windData[windData.length - 1].value)} km/h` : '-- km/h'}
              </p>
            </div>
            <Wind className="h-8 w-8 text-cyan-500" />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Direction: NE
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pressure</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">1013 hPa</p>
            </div>
            <Gauge className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Normal range
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData(weatherData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(v) => format(new Date(v as string), 'HH:mm')} />
              <YAxis />
              <Tooltip labelFormatter={(v) => format(new Date(v as string), 'MMM d, HH:mm')} />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wind Speed (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData(windData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(v) => format(new Date(v as string), 'HH:mm')} />
              <YAxis />
              <Tooltip labelFormatter={(v) => format(new Date(v as string), 'MMM d, HH:mm')} />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((day) => {
            const IconComp = getIcon(day.icon)
            return (
              <div key={day.day} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{day.day}</p>
                <IconComp className="h-8 w-8 mx-auto my-2 text-gray-600" />
                <p className="text-xs text-gray-500">{day.condition}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{day.high}° / {day.low}°</p>
                {day.rain > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-blue-600">
                    <CloudRain className="h-3 w-3" />
                    <span className="text-xs">{day.rain}%</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
