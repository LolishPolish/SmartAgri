declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  export const Activity: FC<SVGProps<SVGSVGElement>>
  export const AlertCircle: FC<SVGProps<SVGSVGElement>>
  export const AlertTriangle: FC<SVGProps<SVGSVGElement>>
  export const Beaker: FC<SVGProps<SVGSVGElement>>
  export const Bell: FC<SVGProps<SVGSVGElement>>
  export const Bug: FC<SVGProps<SVGSVGElement>>
  export const Calendar: FC<SVGProps<SVGSVGElement>>
  export const Camera: FC<SVGProps<SVGSVGElement>>
  export const Check: FC<SVGProps<SVGSVGElement>>
  export const CheckCircle: FC<SVGProps<SVGSVGElement>>
  export const CircleAlert: FC<SVGProps<SVGSVGElement>>
  export const CircleCheckBig: FC<SVGProps<SVGSVGElement>>
  export const Clock: FC<SVGProps<SVGSVGElement>>
  export const CloudRain: FC<SVGProps<SVGSVGElement>>
  export const CloudSun: FC<SVGProps<SVGSVGElement>>
  export const Cpu: FC<SVGProps<SVGSVGElement>>
  export const Droplets: FC<SVGProps<SVGSVGElement>>
  export const Filter: FC<SVGProps<SVGSVGElement>>
  export const FlaskConical: FC<SVGProps<SVGSVGElement>>
  export const Funnel: FC<SVGProps<SVGSVGElement>>
  export const Gauge: FC<SVGProps<SVGSVGElement>>
  export const Globe: FC<SVGProps<SVGSVGElement>>
  export const Info: FC<SVGProps<SVGSVGElement>>
  export const LayoutDashboard: FC<SVGProps<SVGSVGElement>>
  export const Leaf: FC<SVGProps<SVGSVGElement>>
  export const MapPin: FC<SVGProps<SVGSVGElement>>
  export const Menu: FC<SVGProps<SVGSVGElement>>
  export const Pause: FC<SVGProps<SVGSVGElement>>
  export const Play: FC<SVGProps<SVGSVGElement>>
  export const Save: FC<SVGProps<SVGSVGElement>>
  export const Search: FC<SVGProps<SVGSVGElement>>
  export const Server: FC<SVGProps<SVGSVGElement>>
  export const Settings: FC<SVGProps<SVGSVGElement>>
  export const Shield: FC<SVGProps<SVGSVGElement>>
  export const Sprout: FC<SVGProps<SVGSVGElement>>
  export const SunMedium: FC<SVGProps<SVGSVGElement>>
  export const Sun: FC<SVGProps<SVGSVGElement>>
  export const Thermometer: FC<SVGProps<SVGSVGElement>>
  export const TrendingUp: FC<SVGProps<SVGSVGElement>>
  export const TriangleAlert: FC<SVGProps<SVGSVGElement>>
  export const User: FC<SVGProps<SVGSVGElement>>
  export const WifiOff: FC<SVGProps<SVGSVGElement>>
  export const Wifi: FC<SVGProps<SVGSVGElement>>
  export const Wind: FC<SVGProps<SVGSVGElement>>
  export const X: FC<SVGProps<SVGSVGElement>>
}

declare module 'date-fns' {
  export function format(date: Date | number, formatStr: string, options?: Record<string, unknown>): string
  export function parse(value: string, formatStr: string, referenceDate: Date | number): Date
  export function addDays(date: Date | number, amount: number): Date
  export function subDays(date: Date | number, amount: number): Date
  export function startOfWeek(date: Date | number, options?: Record<string, unknown>): Date
  export function endOfWeek(date: Date | number, options?: Record<string, unknown>): Date
  export function isSameDay(date1: Date | number, date2: Date | number): boolean
  export function formatDistanceToNow(date: Date | number, options?: Record<string, unknown>): string
}

declare const global: any
