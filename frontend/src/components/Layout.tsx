import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Droplets,
  CloudSun,
  Sprout,
  Bell,
  Settings,
  Cpu,
  Menu,
  X,
  Leaf,
  Server
} from 'lucide-react'
import { api } from '../lib/api'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/soil', icon: Droplets, label: 'Soil Monitoring' },
  { path: '/weather', icon: CloudSun, label: 'Weather Station' },
  { path: '/irrigation', icon: Sprout, label: 'Irrigation' },
  { path: '/crops', icon: Leaf, label: 'Crop Health' },
  { path: '/alerts', icon: Bell, label: 'Alerts' },
  { path: '/devices', icon: Cpu, label: 'Devices' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    async function checkApi() {
      try {
        await api.healthCheck()
        setApiStatus('connected')
      } catch {
        setApiStatus('disconnected')
      }
    }
    checkApi()
    const interval = setInterval(checkApi, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">AgriSmart</span>
            </div>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-3">
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="text-sm font-medium text-emerald-900">System Status</p>
              <div className="mt-2 flex items-center gap-1.5">
                {apiStatus === 'connected' ? (
                  <>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-600">API Connected</span>
                  </>
                ) : apiStatus === 'disconnected' ? (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-xs text-red-600">API Disconnected</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <span className="text-xs text-yellow-600">Checking API...</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
              <Server className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs font-medium text-gray-900">Backend</p>
                <p className="text-xs text-gray-500">Express + SQLite</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Smart Agriculture Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500" id="current-time"></span>
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-emerald-700">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
