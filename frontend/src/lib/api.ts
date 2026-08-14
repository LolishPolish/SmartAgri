const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  getDevices: () => request<any[]>('/devices'),
  getCropZones: () => request<any[]>('/crop-zones'),
  getAlerts: () => request<any[]>('/alerts'),
  getIrrigationSchedules: () => request<any[]>('/irrigation-schedules'),
  getSensorReadings: (params?: { device_id?: string; type?: string; hours?: number; limit?: number }) => {
    const query = new URLSearchParams()
    if (params?.device_id) query.set('device_id', params.device_id)
    if (params?.type) query.set('type', params.type)
    if (params?.hours) query.set('hours', String(params.hours))
    if (params?.limit) query.set('limit', String(params.limit))
    const qs = query.toString()
    return request<any[]>(`/sensor-readings${qs ? `?${qs}` : ''}`)
  },
  getSoilMoistureAnalytics: (params?: { zone_id?: string; hours?: number }) => {
    const query = new URLSearchParams()
    if (params?.zone_id) query.set('zone_id', params.zone_id)
    if (params?.hours) query.set('hours', String(params.hours))
    const qs = query.toString()
    return request<any[]>(`/analytics/soil-moisture${qs ? `?${qs}` : ''}`)
  },
  getTemperatureAnalytics: (params?: { hours?: number }) => {
    const query = new URLSearchParams()
    if (params?.hours) query.set('hours', String(params.hours))
    const qs = query.toString()
    return request<any[]>(`/analytics/temperature${qs ? `?${qs}` : ''}`)
  },
  getPhAnalytics: (params?: { hours?: number }) => {
    const query = new URLSearchParams()
    if (params?.hours) query.set('hours', String(params.hours))
    const qs = query.toString()
    return request<any[]>(`/analytics/ph${qs ? `?${qs}` : ''}`)
  },
  postSensorReading: (data: { device_id: string; type: string; value: number }) =>
    request<any>('/sensor-readings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  postBatchReadings: (readings: Array<{ device_id: string; type: string; value: number; timestamp?: string }>) =>
    request<any>('/sensor-readings/batch', {
      method: 'POST',
      body: JSON.stringify({ readings }),
    }),
  updateDevice: (id: string, data: { status?: string; battery?: number; last_active?: string }) =>
    request<any>(`/devices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  updateAlert: (id: string, acknowledged: boolean) =>
    request<any>(`/alerts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ acknowledged }),
    }),
  updateSchedule: (id: string, status: string) =>
    request<any>(`/irrigation-schedules/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  healthCheck: () => request<{ status: string; timestamp: string }>('/health'),
}
