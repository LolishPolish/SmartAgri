# Functional & Non-Functional Requirements

## 1. Stakeholder Analysis

### Primary Users
- **Farm Owner**: Needs high-level KPIs (yield forecasts, water costs, ROI) and system-wide alerts
- **Agronomist**: Needs detailed soil analytics, nutrient trends, crop health scores, and historical comparisons
- **Irrigation Manager**: Needs schedule management, valve control, water usage metrics, and automation rules
- **Farm Worker**: Needs device status, active alerts, and simple task lists

### Secondary Users
- **System Administrator**: Needs user management, device provisioning, and system health monitoring
- **Data Analyst**: Needs raw data export, trend analysis, and reporting capabilities

---

## 2. Functional Requirements

### FR-01: Real-Time Dashboard
**Priority**: High  
**Description**: Display current readings for soil moisture, temperature, humidity, and pH across all farm zones.  
**Acceptance Criteria**:
- Stat cards show latest values with trend indicators
- Auto-refresh every 30 seconds
- Loading state displayed during initial fetch
- Fallback values shown when API is unreachable

### FR-02: Device Management
**Priority**: High  
**Description**: Monitor all IoT devices (soil sensors, weather stations, irrigation valves, cameras) with status, battery, and location.  
**Acceptance Criteria**:
- Searchable/filterable device table
- Status badges (online/offline/maintenance)
- Battery level visualization
- Last active timestamp

### FR-03: Alert System
**Priority**: High  
**Description**: Critical, warning, and info alerts generated from sensor thresholds and system events.  
**Acceptance Criteria**:
- Severity-based color coding
- Filter by alert type
- Acknowledge and dismiss actions
- Unread count badge
- Timestamp formatting

### FR-04: Irrigation Control
**Priority**: High  
**Description**: Manage irrigation schedules with start/stop/pause control and water usage tracking.  
**Acceptance Criteria**:
- Schedule table with zone, time, duration, water amount
- Play/pause toggle per schedule
- Weekly water usage bar chart
- Status badges (scheduled/active/completed/cancelled)

### FR-05: Crop Health Monitoring
**Priority**: Medium  
**Description**: Track crop zones with soil parameters, health scores, pest detection, and disease surveillance.  
**Acceptance Criteria**:
- Zone-wise health table with moisture/temp/pH/NPK
- Pest detection list with severity
- Disease surveillance with affected zones
- Analyze button per zone (UI stub for AI analysis)

### FR-06: Weather Station
**Priority**: Medium  
**Description**: Display local weather conditions with 24h trends and 5-day forecast.  
**Acceptance Criteria**:
- Temperature, humidity, wind speed, pressure stat cards
- 24h line charts for temperature and wind
- 5-day forecast grid with icons and rain probability

### FR-07: Settings
**Priority**: Low  
**Description**: Configure farm profile, notification preferences, automation rules, and appearance.  
**Acceptance Criteria**:
- Farm name and size inputs
- Timezone and unit selection
- Notification toggles (push, email, SMS)
- Theme and language selection
- Data retention policy

### FR-08: Sensor Data Ingestion
**Priority**: High  
**Description**: Accept sensor readings via REST API for device integration.  
**Acceptance Criteria**:
- POST `/api/sensor-readings` accepts `{ device_id, type, value }`
- Batch insert endpoint for bulk data
- Timestamp auto-generated if not provided
- Validation of required fields

### FR-09: Analytics Endpoints
**Priority**: Medium  
**Description**: Aggregated analytics for soil moisture, temperature, and pH with time-window filtering.  
**Acceptance Criteria**:
- Query param `hours` for time range (default 24h)
- Optional `zone_id` filter for soil moisture
- Results ordered by timestamp descending
- Joined with device metadata

### FR-10: Batch Ingestion
**Priority**: Low  
**Description**: Accept array of sensor readings in single request for bulk data upload.  
**Acceptance Criteria**:
- POST `/api/sensor-readings/batch` accepts `{ readings: [...] }`
- Individual timestamps optional (defaults to now)
- Returns count of inserted records

---

## 3. Non-Functional Requirements

### NFR-01: Performance
- Initial page load: < 2s on 4G connection
- API response: < 500ms for 95th percentile
- Chart rendering: < 200ms for 50 data points

### NFR-02: Availability
- Backend uptime: 99% during operational hours
- Graceful degradation when API is unreachable
- Cached data displayed with staleness indicator

### NFR-03: Scalability
- Support 50+ concurrent users
- Handle 10,000+ sensor readings per day
- Database queries optimized with indexes on `device_id`, `type`, and `timestamp`

### NFR-04: Security
- CORS restricted to allowed origins in production
- Input validation on all POST/PATCH endpoints
- No sensitive data exposed in client-side code
- SQL injection prevented via parameterized queries

### NFR-05: Usability
- Responsive layout: 320px to 2560px
- Keyboard navigation support
- Loading skeletons for all data-fetching components
- Error states with retry buttons

### NFR-06: Maintainability
- TypeScript strict mode enabled
- Centralized API client (single source of truth for endpoints)
- Reusable UI components (StatCard, tables, charts)
- Seed data generator for consistent demo data

---

## 4. Future Requirements (Out of Scope for v1.0)

| ID | Requirement | Rationale |
|----|-------------|-----------|
| FR-11 | User authentication and role-based access | Multi-user farm management |
| FR-12 | Real-time WebSocket updates | Live sensor streaming |
| FR-13 | Mobile app (React Native / Flutter) | Offline-first field access |
| FR-14 | AI-powered crop disease diagnosis | Computer vision integration |
| FR-15 | IoT device provisioning (MQTT) | Direct sensor connectivity |
| FR-16 | Export reports (PDF/CSV) | Compliance and auditing |
| FR-17 | Multi-farm support | SaaS multi-tenancy |
| FR-18 | Integration with weather APIs | Enhanced forecast accuracy |
