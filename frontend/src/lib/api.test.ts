import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../lib/api'

describe('API Client', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('healthCheck', () => {
    it('calls the health endpoint', async () => {
      const mockData = { status: 'ok', timestamp: '2026-08-14T10:00:00.000Z' }
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        })
      ) as any

      const result = await api.healthCheck()
      expect(result).toEqual(mockData)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/health'),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })

    it('throws error on non-ok response', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Server error' }),
        })
      ) as any

      await expect(api.healthCheck()).rejects.toThrow('Server error')
    })
  })

  describe('getDevices', () => {
    it('returns device list', async () => {
      const mockDevices = [
        { id: 'dev-001', name: 'Soil Sensor A1', status: 'online' },
      ]
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockDevices),
        })
      ) as any

      const result = await api.getDevices()
      expect(result).toEqual(mockDevices)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/devices'),
        expect.any(Object)
      )
    })
  })

  describe('getSensorReadings', () => {
    it('builds query string with params', async () => {
      const mockReadings = [
        { id: 1, device_id: 'dev-001', type: 'soil_moisture', value: 62, timestamp: '2026-08-14T10:00:00.000Z' },
      ]
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockReadings),
        })
      ) as any

      const result = await api.getSensorReadings({ type: 'soil_moisture', hours: 24, limit: 50 })
      expect(result).toEqual(mockReadings)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/sensor-readings?type=soil_moisture&hours=24&limit=50'),
        expect.any(Object)
      )
    })

    it('omits undefined params from query string', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      ) as any

      await api.getSensorReadings({ type: 'temperature' })
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/sensor-readings?type=temperature'),
        expect.any(Object)
      )
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('postSensorReading', () => {
    it('sends POST request with correct body', async () => {
      const mockReading = { id: 1, device_id: 'dev-001', type: 'test', value: 25 }
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockReading),
        })
      ) as any

      const result = await api.postSensorReading({ device_id: 'dev-001', type: 'test', value: 25 })
      expect(result).toEqual(mockReading)

      const fetchCall = (fetch as any).mock.calls[0]
      expect(fetchCall[1].method).toBe('POST')
      expect(JSON.parse(fetchCall[1].body)).toEqual({ device_id: 'dev-001', type: 'test', value: 25 })
    })
  })

  describe('updateAlert', () => {
    it('sends PATCH request with acknowledged boolean', async () => {
      const mockAlert = { id: 'alert-1', acknowledged: 1 }
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAlert),
        })
      ) as any

      const result = await api.updateAlert('alert-1', true)
      expect(result).toEqual(mockAlert)

      const fetchCall = (fetch as any).mock.calls[0]
      expect(fetchCall[1].method).toBe('PATCH')
      expect(JSON.parse(fetchCall[1].body)).toEqual({ acknowledged: true })
    })
  })
})
