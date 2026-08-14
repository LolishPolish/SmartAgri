import { useState, useEffect } from 'react'
import { Cpu, Wifi, WifiOff, Settings, MapPin, Search, Filter } from 'lucide-react'
import { api } from '../lib/api'
import { format } from 'date-fns'

interface Device {
  id: string
  name: string
  type: string
  status: string
  location: string
  battery: number
  last_active: string
}

export default function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'online' | 'offline' | 'maintenance'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getDevices()
        setDevices(data)
      } catch (error) {
        console.error('Failed to load devices:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          device.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || device.status === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-700'
      case 'offline': return 'bg-red-100 text-red-700'
      case 'maintenance': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'bg-green-500'
    if (level > 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading devices...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Device Management</h2>
        <p className="text-gray-500 mt-1">Monitor and manage all field devices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Devices</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{devices.length}</p>
            </div>
            <Cpu className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Online</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{devices.filter(d => d.status === 'online').length}</p>
            </div>
            <Wifi className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Offline</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{devices.filter(d => d.status === 'offline').length}</p>
            </div>
            <WifiOff className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Maintenance</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{devices.filter(d => d.status === 'maintenance').length}</p>
            </div>
            <Settings className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Device</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Battery</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => (
                <tr key={device.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Cpu className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{device.name}</p>
                        <p className="text-xs text-gray-500">{device.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 capitalize">{device.type}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      {device.location}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getBatteryColor(device.battery)}`}
                          style={{ width: `${device.battery}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8">{device.battery}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(device.last_active), 'MMM d, HH:mm')}
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
