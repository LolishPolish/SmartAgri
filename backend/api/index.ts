import { createClient } from '@libsql/client'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const json = (status: number, body: unknown) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

const now = () => new Date().toISOString()

let db: ReturnType<typeof createClient> | null = null

const getDb = () => {
  if (db) return db

  const url = process.env.DATABASE_URL || 'file:./dev.db'
  const authToken = process.env.DATABASE_AUTH_TOKEN

  db = createClient({
    url,
    authToken,
  })

  return db
}

const seedIfEmpty = async () => {
  const client = getDb()
  const count = await client.execute('SELECT COUNT(*) as cnt FROM devices')
  if (count.rows[0]?.cnt > 0) return

  const insertDevice = client.prepare(
    'INSERT OR IGNORE INTO devices (id, name, type, status, location, battery, last_active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
  const devices = [
    ['dev-001', 'Soil Sensor A1', 'soil', 'online', 'Field North - Zone 1', 87, now()],
    ['dev-002', 'Weather Station Main', 'weather', 'online', 'Field Center', 92, now()],
    ['dev-003', 'Irrigation Valve B2', 'irrigation', 'online', 'Field East - Zone 2', 65, now()],
    ['dev-004', 'Soil Sensor B1', 'soil', 'offline', 'Field South - Zone 3', 12, new Date(Date.now() - 86400000).toISOString()],
    ['dev-005', 'Camera Tower 1', 'camera', 'online', 'Field West Entrance', 78, now()],
    ['dev-006', 'Irrigation Valve C1', 'irrigation', 'maintenance', 'Field North - Zone 2', 45, new Date(Date.now() - 172800000).toISOString()],
  ]
  for (const d of devices) await insertDevice.bind(...d).run()

  const insertZone = client.prepare(
    'INSERT OR IGNORE INTO crop_zones VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
  const zones = [
    ['zone-1', 'North Field - Wheat', 'Wheat', 'excellent', 62, 24, 6.8, 45, 32, 180, '2025-10-15', '2026-04-15'],
    ['zone-2', 'East Field - Tomatoes', 'Tomatoes', 'good', 58, 26, 6.5, 52, 40, 210, '2025-11-01', '2026-03-30'],
    ['zone-3', 'South Field - Rice', 'Rice', 'fair', 85, 28, 5.9, 38, 28, 160, '2025-09-20', '2026-02-28'],
    ['zone-4', 'West Field - Corn', 'Corn', 'good', 55, 25, 6.2, 48, 35, 195, '2025-10-01', '2026-03-20'],
  ]
  for (const z of zones) await insertZone.bind(...z).run()

  const insertAlert = client.prepare(
    'INSERT OR IGNORE INTO alerts (id, type, message, source, timestamp, acknowledged) VALUES (?, ?, ?, ?, ?, ?)'
  )
  const alerts = [
    ['alert-1', 'critical', 'Soil moisture critically low in South Field - Zone 3', 'Soil Sensor B1', new Date(Date.now() - 3600000).toISOString(), 0],
    ['alert-2', 'warning', 'Nitrogen levels dropping below optimal range in East Field', 'Soil Sensor A1', new Date(Date.now() - 7200000).toISOString(), 0],
    ['alert-3', 'info', 'Scheduled irrigation completed for North Field - Zone 1', 'Irrigation System', new Date(Date.now() - 10800000).toISOString(), 1],
    ['alert-4', 'warning', 'Battery level low on Soil Sensor B1 (12%)', 'Device Manager', new Date(Date.now() - 14400000).toISOString(), 0],
    ['alert-5', 'info', 'Weather forecast: Rain expected within 24 hours', 'Weather Station', new Date(Date.now() - 18000000).toISOString(), 1],
  ]
  for (const a of alerts) await insertAlert.bind(...a).run()

  const insertSchedule = client.prepare(
    'INSERT OR IGNORE INTO irrigation_schedules VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  )
  const schedules = [
    ['sched-1', 'zone-1', 'North Field - Wheat', '06:00', 30, 15000, 'completed', 'Daily'],
    ['sched-2', 'zone-2', 'East Field - Tomatoes', '07:30', 45, 22000, 'scheduled', 'Daily'],
    ['sched-3', 'zone-3', 'South Field - Rice', '05:30', 60, 35000, 'active', 'Every 2 days'],
    ['sched-4', 'zone-4', 'West Field - Corn', '08:00', 40, 20000, 'scheduled', 'Daily'],
  ]
  for (const s of schedules) await insertSchedule.bind(...s).run()
}

const initDb = async () => {
  const client = getDb()

  await client.execute(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'online',
      location TEXT,
      battery INTEGER DEFAULT 100,
      last_active TEXT DEFAULT (datetime('now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS crop_zones (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      crop_type TEXT NOT NULL,
      health TEXT NOT NULL DEFAULT 'good',
      soil_moisture INTEGER,
      temperature INTEGER,
      ph REAL,
      nitrogen INTEGER,
      phosphorus INTEGER,
      potassium INTEGER,
      planted_date TEXT,
      expected_harvest TEXT
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      source TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      acknowledged INTEGER DEFAULT 0
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS irrigation_schedules (
      id TEXT PRIMARY KEY,
      zone_id TEXT NOT NULL,
      zone_name TEXT NOT NULL,
      start_time TEXT NOT NULL,
      duration INTEGER NOT NULL,
      water_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'scheduled',
      repeat TEXT NOT NULL
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      timestamp TEXT DEFAULT (datetime('now'))
    )
  `)

  await client.execute(`CREATE INDEX IF NOT EXISTS idx_sensor_device_type ON sensor_readings(device_id, type)`).catch(() => {})
  await client.execute(`CREATE INDEX IF NOT EXISTS idx_sensor_timestamp ON sensor_readings(timestamp)`).catch(() => {})

  await seedIfEmpty()
}

initDb().catch(console.error)

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  const url = new URL(request.url)
  const pathname = url.pathname.replace(/^\/api/, '') || '/'
  const method = request.method

  try {
    if (pathname === '/health' && method === 'GET') {
      return json(200, { status: 'ok', timestamp: now() })
    }

    if (pathname === '/devices' && method === 'GET') {
      const client = getDb()
      const { results } = await client.execute('SELECT * FROM devices ORDER BY id')
      return json(200, results)
    }

    if (pathname === '/crop-zones' && method === 'GET') {
      const client = getDb()
      const { results } = await client.execute('SELECT * FROM crop_zones ORDER BY id')
      return json(200, results)
    }

    if (pathname === '/alerts' && method === 'GET') {
      const client = getDb()
      const { results } = await client.execute('SELECT * FROM alerts ORDER BY timestamp DESC')
      return json(200, results)
    }

    if (pathname === '/irrigation-schedules' && method === 'GET') {
      const client = getDb()
      const { results } = await client.execute('SELECT * FROM irrigation_schedules ORDER BY start_time')
      return json(200, results)
    }

    if (pathname === '/sensor-readings' && method === 'GET') {
      const client = getDb()
      const device_id = url.searchParams.get('device_id')
      const type = url.searchParams.get('type')
      const hours = url.searchParams.get('hours') || '24'
      const limit = url.searchParams.get('limit') || '100'

      let query = 'SELECT * FROM sensor_readings WHERE 1=1'
      const params: (string | number)[] = []

      if (device_id) {
        query += ' AND device_id = ?'
        params.push(device_id)
      }
      if (type) {
        query += ' AND type = ?'
        params.push(type)
      }
      query += " AND timestamp >= datetime('now', ?)"
      params.push(`-${hours} hours`)

      query += ' ORDER BY timestamp DESC LIMIT ?'
      params.push(Number(limit))

      const { results } = await client.execute(query, params)
      return json(200, results.reverse())
    }

    if (pathname === '/sensor-readings' && method === 'POST') {
      const body = await request.json<{ device_id: string; type: string; value: number }>()
      if (!body.device_id || !body.type || body.value === undefined) {
        return json(400, { error: 'device_id, type, and value are required' })
      }

      const client = getDb()
      const result = await client.execute(
        'INSERT INTO sensor_readings (device_id, type, value, timestamp) VALUES (?, ?, ?, datetime(?))',
        [body.device_id, body.type, body.value, now()]
      )

      const reading = await client.execute('SELECT * FROM sensor_readings WHERE id = ?', [result.lastInsertRowid])
      return json(201, reading.rows[0])
    }

    if (pathname === '/sensor-readings/batch' && method === 'POST') {
      const body = await request.json<{ readings: Array<{ device_id: string; type: string; value: number; timestamp?: string }> }>()
      if (!Array.isArray(body.readings)) {
        return json(400, { error: 'readings array is required' })
      }

      const client = getDb()
      const inserted: any[] = []
      for (const r of body.readings) {
        const result = await client.execute(
          'INSERT INTO sensor_readings (device_id, type, value, timestamp) VALUES (?, ?, ?, ?)',
          [r.device_id, r.type, r.value, r.timestamp || now()]
        )
        inserted.push({ id: result.lastInsertRowid, ...r })
      }
      return json(201, { count: inserted.length, readings: inserted })
    }

    if (pathname.startsWith('/analytics/soil-moisture') && method === 'GET') {
      const client = getDb()
      const zone_id = url.searchParams.get('zone_id')
      const hours = url.searchParams.get('hours') || '24'

      let query = `
        SELECT sr.*, d.location, d.name as device_name
        FROM sensor_readings sr
        JOIN devices d ON sr.device_id = d.id
        WHERE sr.type = 'soil_moisture'
        AND sr.timestamp >= datetime('now', ?)
      `
      const params: (string | number)[] = [`-${hours} hours`]

      if (zone_id) {
        query += ' AND d.id = ?'
        params.push(zone_id)
      }

      query += ' ORDER BY sr.timestamp DESC'
      const { results } = await client.execute(query, params)
      return json(200, results.reverse())
    }

    if (pathname.startsWith('/analytics/temperature') && method === 'GET') {
      const client = getDb()
      const hours = url.searchParams.get('hours') || '24'
      const { results } = await client.execute(`
        SELECT sr.*, d.location
        FROM sensor_readings sr
        JOIN devices d ON sr.device_id = d.id
        WHERE sr.type = 'temperature'
        AND sr.timestamp >= datetime('now', ?)
        ORDER BY sr.timestamp DESC
      `, [`-${hours} hours`])
      return json(200, results.reverse())
    }

    if (pathname.startsWith('/analytics/ph') && method === 'GET') {
      const client = getDb()
      const hours = url.searchParams.get('hours') || '24'
      const { results } = await client.execute(`
        SELECT sr.*, d.location
        FROM sensor_readings sr
        JOIN devices d ON sr.device_id = d.id
        WHERE sr.type = 'ph'
        AND sr.timestamp >= datetime('now', ?)
        ORDER BY sr.timestamp DESC
      `, [`-${hours} hours`])
      return json(200, results.reverse())
    }

    const patchMatch = pathname.match(/^\/(devices|crop-zones|alerts|irrigation-schedules)\/([^\/]+)$/)
    if (patchMatch && (method === 'PATCH' || method === 'PUT')) {
      const resource = patchMatch[1]
      const id = patchMatch[2]
      const body = await request.json<any>()
      const client = getDb()

      if (resource === 'devices') {
        const updates: string[] = []
        const params: any[] = []
        if (body.status) { updates.push('status = ?'); params.push(body.status) }
        if (body.battery !== undefined) { updates.push('battery = ?'); params.push(body.battery) }
        if (body.last_active) { updates.push('last_active = ?'); params.push(body.last_active) }
        if (updates.length === 0) return json(400, { error: 'No fields to update' })
        params.push(id)
        const device = await client.execute(`UPDATE devices SET ${updates.join(', ')} WHERE id = ? RETURNING *`, params)
        if (!device.rows[0]) return json(404, { error: 'Device not found' })
        return json(200, device.rows[0])
      }

      if (resource === 'alerts') {
        const alert = await client.execute(
          'UPDATE alerts SET acknowledged = ? WHERE id = ? RETURNING *',
          [body.acknowledged ? 1 : 0, id]
        )
        if (!alert.rows[0]) return json(404, { error: 'Alert not found' })
        return json(200, alert.rows[0])
      }

      if (resource === 'irrigation-schedules') {
        const schedule = await client.execute(
          'UPDATE irrigation_schedules SET status = ? WHERE id = ? RETURNING *',
          [body.status, id]
        )
        if (!schedule.rows[0]) return json(404, { error: 'Schedule not found' })
        return json(200, schedule.rows[0])
      }
    }

    return json(404, { error: 'route not found' })
  } catch (err: any) {
    console.error(err)
    return json(500, { error: err.message || 'Internal server error' })
  }
}

export const config = {
  runtime: 'edge',
}
