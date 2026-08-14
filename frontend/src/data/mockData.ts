export interface SensorReading {
  timestamp: string
  value: number
}

export interface FieldDevice {
  id: string
  name: string
  type: 'soil' | 'weather' | 'irrigation' | 'camera'
  status: 'online' | 'offline' | 'maintenance'
  location: string
  battery: number
  lastActive: string
}

export interface CropZone {
  id: string
  name: string
  cropType: string
  health: 'excellent' | 'good' | 'fair' | 'poor'
  soilMoisture: number
  temperature: number
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  plantedDate: string
  expectedHarvest: string
}

export interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info'
  message: string
  source: string
  timestamp: string
  acknowledged: boolean
}

export interface IrrigationSchedule {
  id: string
  zoneId: string
  zoneName: string
  startTime: string
  duration: number
  waterAmount: number
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  repeat: string
}

export const generateSensorData = (hours: number, baseValue: number, variance: number): SensorReading[] => {
  const data: SensorReading[] = []
  const now = new Date()
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    const noise = (Math.random() - 0.5) * variance
    const trend = Math.sin(i / 6) * (variance / 3)
    data.push({
      timestamp: time.toISOString(),
      value: Math.round((baseValue + noise + trend) * 100) / 100
    })
  }
  return data
}

export const mockDevices: FieldDevice[] = [
  { id: 'dev-001', name: 'Soil Sensor A1', type: 'soil', status: 'online', location: 'Field North - Zone 1', battery: 87, lastActive: new Date().toISOString() },
  { id: 'dev-002', name: 'Weather Station Main', type: 'weather', status: 'online', location: 'Field Center', battery: 92, lastActive: new Date().toISOString() },
  { id: 'dev-003', name: 'Irrigation Valve B2', type: 'irrigation', status: 'online', location: 'Field East - Zone 2', battery: 65, lastActive: new Date().toISOString() },
  { id: 'dev-004', name: 'Soil Sensor B1', type: 'soil', status: 'offline', location: 'Field South - Zone 3', battery: 12, lastActive: new Date(Date.now() - 86400000).toISOString() },
  { id: 'dev-005', name: 'Camera Tower 1', type: 'camera', status: 'online', location: 'Field West Entrance', battery: 78, lastActive: new Date().toISOString() },
  { id: 'dev-006', name: 'Irrigation Valve C1', type: 'irrigation', status: 'maintenance', location: 'Field North - Zone 2', battery: 45, lastActive: new Date(Date.now() - 172800000).toISOString() },
]

export const mockCropZones: CropZone[] = [
  { id: 'zone-1', name: 'North Field - Wheat', cropType: 'Wheat', health: 'excellent', soilMoisture: 62, temperature: 24, ph: 6.8, nitrogen: 45, phosphorus: 32, potassium: 180, plantedDate: '2025-10-15', expectedHarvest: '2026-04-15' },
  { id: 'zone-2', name: 'East Field - Tomatoes', cropType: 'Tomatoes', health: 'good', soilMoisture: 58, temperature: 26, ph: 6.5, nitrogen: 52, phosphorus: 40, potassium: 210, plantedDate: '2025-11-01', expectedHarvest: '2026-03-30' },
  { id: 'zone-3', name: 'South Field - Rice', cropType: 'Rice', health: 'fair', soilMoisture: 85, temperature: 28, ph: 5.9, nitrogen: 38, phosphorus: 28, potassium: 160, plantedDate: '2025-09-20', expectedHarvest: '2026-02-28' },
  { id: 'zone-4', name: 'West Field - Corn', cropType: 'Corn', health: 'good', soilMoisture: 55, temperature: 25, ph: 6.2, nitrogen: 48, phosphorus: 35, potassium: 195, plantedDate: '2025-10-01', expectedHarvest: '2026-03-20' },
]

export const mockAlerts: Alert[] = [
  { id: 'alert-1', type: 'critical', message: 'Soil moisture critically low in South Field - Zone 3', source: 'Soil Sensor B1', timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
  { id: 'alert-2', type: 'warning', message: 'Nitrogen levels dropping below optimal range in East Field', source: 'Soil Sensor A1', timestamp: new Date(Date.now() - 7200000).toISOString(), acknowledged: false },
  { id: 'alert-3', type: 'info', message: 'Scheduled irrigation completed for North Field - Zone 1', source: 'Irrigation System', timestamp: new Date(Date.now() - 10800000).toISOString(), acknowledged: true },
  { id: 'alert-4', type: 'warning', message: 'Battery level low on Soil Sensor B1 (12%)', source: 'Device Manager', timestamp: new Date(Date.now() - 14400000).toISOString(), acknowledged: false },
  { id: 'alert-5', type: 'info', message: 'Weather forecast: Rain expected within 24 hours', source: 'Weather Station', timestamp: new Date(Date.now() - 18000000).toISOString(), acknowledged: true },
]

export const mockIrrigationSchedules: IrrigationSchedule[] = [
  { id: 'sched-1', zoneId: 'zone-1', zoneName: 'North Field - Wheat', startTime: '06:00', duration: 30, waterAmount: 15000, status: 'completed', repeat: 'Daily' },
  { id: 'sched-2', zoneId: 'zone-2', zoneName: 'East Field - Tomatoes', startTime: '07:30', duration: 45, waterAmount: 22000, status: 'scheduled', repeat: 'Daily' },
  { id: 'sched-3', zoneId: 'zone-3', zoneName: 'South Field - Rice', startTime: '05:30', duration: 60, waterAmount: 35000, status: 'active', repeat: 'Every 2 days' },
  { id: 'sched-4', zoneId: 'zone-4', zoneName: 'West Field - Corn', startTime: '08:00', duration: 40, waterAmount: 20000, status: 'scheduled', repeat: 'Daily' },
]
