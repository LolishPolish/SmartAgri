import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Save } from 'lucide-react'
import { api } from '../lib/api'

interface Settings {
  farmName: string
  farmSize: string
  timezone: string
  units: string
  notifications: boolean
  emailAlerts: boolean
  smsAlerts: boolean
  autoIrrigation: boolean
  theme: string
  language: string
  dataRetention: string
}

export default function Settings() {
  const [settings, setSettings] = useState<Settings>({
    farmName: 'Green Valley Farm',
    farmSize: '50 acres',
    timezone: 'Asia/Kolkata',
    units: 'metric',
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    autoIrrigation: true,
    theme: 'light',
    language: 'en',
    dataRetention: '90 days',
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function checkHealth() {
      try {
        await api.healthCheck()
      } catch (error) {
        console.error('API health check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    checkHealth()
  }, [])

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings({ ...settings, [key]: value })
    setSaved(false)
  }

  const handleSave = async () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Configure your farm monitoring preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              Farm Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                <input
                  type="text"
                  value={settings.farmName}
                  onChange={(e) => updateSetting('farmName', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size</label>
                <input
                  type="text"
                  value={settings.farmSize}
                  onChange={(e) => updateSetting('farmSize', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  className="input-field"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                <select
                  value={settings.units}
                  onChange={(e) => updateSetting('units', e.target.value)}
                  className="input-field"
                >
                  <option value="metric">Metric (°C, mm, ha)</option>
                  <option value="imperial">Imperial (°F, in, acres)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-400" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500">Receive alerts in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-500">Receive critical alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => updateSetting('emailAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS Alerts</p>
                  <p className="text-sm text-gray-500">Receive alerts via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsAlerts}
                    onChange={(e) => updateSetting('smsAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-400" />
              Automation
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto Irrigation</p>
                <p className="text-sm text-gray-500">Automatically irrigate based on soil moisture levels</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoIrrigation}
                  onChange={(e) => updateSetting('autoIrrigation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-400" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="input-field"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="input-field"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-gray-400" />
              Data & Storage
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention</label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => updateSetting('dataRetention', e.target.value)}
                  className="input-field"
                >
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="1 year">1 year</option>
                  <option value="forever">Forever</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
