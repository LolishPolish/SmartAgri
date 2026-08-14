import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Droplets, Clock, Play, Pause, Settings, Calendar } from 'lucide-react'
import { api } from '../lib/api'
import { format } from 'date-fns'

interface Schedule {
  id: string
  zone_id: string
  zone_name: string
  start_time: string
  duration: number
  water_amount: number
  status: string
  repeat: string
}

const waterUsageData = [
  { day: 'Mon', amount: 45000 },
  { day: 'Tue', amount: 52000 },
  { day: 'Wed', amount: 48000 },
  { day: 'Thu', amount: 51000 },
  { day: 'Fri', amount: 47000 },
  { day: 'Sat', amount: 55000 },
  { day: 'Sun', amount: 43000 },
]

export default function IrrigationControl() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getIrrigationSchedules()
        setSchedules(data)
      } catch (error) {
        console.error('Failed to load schedules:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const toggleSchedule = async (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    if (!schedule) return

    const newStatus = schedule.status === 'active' ? 'scheduled' : 'active'
    try {
      const updated = await api.updateSchedule(id, newStatus)
      setSchedules(schedules.map(s => s.id === id ? updated : s))
    } catch (error) {
      console.error('Failed to update schedule:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading irrigation data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Irrigation Control</h2>
          <p className="text-gray-500 mt-1">Manage irrigation schedules and monitor water usage</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Settings className="h-4 w-4" />
          New Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Systems</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {schedules.filter(s => s.status === 'active').length}
              </p>
            </div>
            <Droplets className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Water Used Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">45,200 L</p>
            </div>
            <Droplets className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Efficiency</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">92%</p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Water Usage</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={waterUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value: any) => [`${value.toLocaleString()} L`, 'Water Used']} />
            <Bar dataKey="amount" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Irrigation Schedules</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(), 'MMMM yyyy')}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Zone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Water Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Repeat</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{schedule.zone_name}</td>
                  <td className="py-3 px-4 text-gray-600">{schedule.start_time}</td>
                  <td className="py-3 px-4 text-gray-600">{schedule.duration} min</td>
                  <td className="py-3 px-4 text-gray-600">{(schedule.water_amount / 1000).toFixed(1)}k L</td>
                  <td className="py-3 px-4 text-gray-600">{schedule.repeat}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.status === 'active' ? 'bg-green-100 text-green-700' :
                      schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      schedule.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleSchedule(schedule.id)}
                      className={`p-2 rounded-lg ${
                        schedule.status === 'active'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {schedule.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
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
