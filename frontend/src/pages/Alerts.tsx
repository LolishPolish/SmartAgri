import { useState, useEffect } from 'react'
import { AlertTriangle, Info, AlertCircle, Check, X, Bell } from 'lucide-react'
import { api } from '../lib/api'
import { format } from 'date-fns'

interface Alert {
  id: string
  type: string
  message: string
  source: string
  timestamp: string
  acknowledged: number
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getAlerts()
        setAlerts(data)
      } catch (error) {
        console.error('Failed to load alerts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const acknowledgeAlert = async (id: string) => {
    try {
      await api.updateAlert(id, true)
      setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: 1 } : a))
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  const dismissAlert = async (id: string) => {
    try {
      setAlerts(alerts.filter(a => a.id !== id))
    } catch (error) {
      console.error('Failed to dismiss alert:', error)
    }
  }

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.type === filter)

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default: return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading alerts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h2>
          <p className="text-gray-500 mt-1">System alerts and farm notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">{unacknowledgedCount} unread</span>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'critical', 'warning', 'info'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs opacity-75">
                ({alerts.filter(a => a.type === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card text-center text-gray-500 py-8">
            No alerts matching the selected filter
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`card border ${alert.acknowledged ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5">
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>Source: {alert.source}</span>
                        <span>•</span>
                        <span>{format(new Date(alert.timestamp), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Acknowledge"
                        >
                          <Check className="h-4 w-4 text-gray-600" />
                        </button>
                      )}
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Dismiss"
                      >
                        <X className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  {alert.acknowledged && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <Check className="h-3 w-3" />
                      <span>Acknowledged</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
