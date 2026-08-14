import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SoilMonitoring from './pages/SoilMonitoring'
import WeatherStation from './pages/WeatherStation'
import IrrigationControl from './pages/IrrigationControl'
import CropHealth from './pages/CropHealth'
import Alerts from './pages/Alerts'
import DeviceManagement from './pages/DeviceManagement'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="soil" element={<SoilMonitoring />} />
        <Route path="weather" element={<WeatherStation />} />
        <Route path="irrigation" element={<IrrigationControl />} />
        <Route path="crops" element={<CropHealth />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="devices" element={<DeviceManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
