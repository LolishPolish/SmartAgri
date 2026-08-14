import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Dashboard', () => {
  it('renders loading state initially', () => {
    renderWithRouter(<Dashboard />)
    expect(screen.getByText('Loading dashboard data...')).toBeDefined()
  })

  it('renders dashboard title after loading', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as any

    renderWithRouter(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Dashboard Overview')).toBeDefined()
    })
  })

  it('displays stat cards', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as any

    renderWithRouter(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Soil Moisture')).toBeDefined()
      expect(screen.getByText('Temperature')).toBeDefined()
      expect(screen.getByText('Humidity')).toBeDefined()
      expect(screen.getByText('UV Index')).toBeDefined()
    })
  })
})
