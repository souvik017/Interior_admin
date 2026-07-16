import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Button } from '../ui/Button'

const dummyRevenueSeries = [
  { label: 'Jan', value: 30, cap: 38 },
  { label: 'Feb', value: 47, cap: 55 },
  { label: 'Mar', value: 33, cap: 42 },
  { label: 'Apr', value: 80, cap: 88 },
  { label: 'May', value: 40, cap: 50 },
  { label: 'Jun', value: 75, cap: 75, current: true },
  { label: 'Jul', value: 65, cap: 72 },
  { label: 'Aug', value: 55, cap: 60 },
  { label: 'Sep', value: 90, cap: 95 },
  { label: 'Oct', value: 70, cap: 78 },
  { label: 'Nov', value: 85, cap: 90 },
  { label: 'Dec', value: 60, cap: 68 },
]

// Custom tooltips matching the dashboard design
function CustomChartTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-3.5 shadow-xl backdrop-blur-md select-none text-xs font-semibold">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">
          {payload[0].payload.label} Breakdown
        </p>
        <div className="space-y-1">
          <div className="flex items-center gap-6 justify-between">
            <span className="flex items-center gap-1.5 text-text">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Revenue:
            </span>
            <span className="font-bold text-text">${payload[0].value}k</span>
          </div>
          {payload[1] && (
            <div className="flex items-center gap-6 justify-between">
              <span className="flex items-center gap-1.5 text-muted">
                <span className="h-2 w-2 rounded-full bg-surface-3" />
                Target Cap:
              </span>
              <span className="font-bold text-text">${payload[1].value}k</span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  const [range, setRange] = useState('1Y')

  const chartData = useMemo(() => {
    if (range === '6M') {
      const sixMonths = dummyRevenueSeries.slice(-6)
      return sixMonths.map((item) => ({
        ...item,
        value: Math.max(24, Math.round(item.value * 0.88)),
        cap: Math.max(34, Math.round(item.cap * 0.9)),
      }))
    }
    return dummyRevenueSeries
  }, [range])

  return (
    <div className="w-full min-w-0 rounded-3xl border border-border/80 bg-surface/90 p-5 shadow-soft">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-text">
            Monthly Revenue
          </h3>
          <p className="mt-1 text-xs font-medium text-muted">
            Revenue trend and production cap analysis built with Recharts.
          </p>
        </div>
        <div className="flex w-full shrink-0 gap-1.5 sm:w-auto" role="group" aria-label="Chart time range">
          {['6M', '1Y'].map((item) => {
            const active = range === item
            return (
              <Button
                key={item}
                size="sm"
                variant={active ? 'primary' : 'secondary'}
                onClick={() => setRange(item)}
                className="flex-1 sm:flex-none justify-center"
                aria-pressed={active}
              >
                {item}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full sm:h-80 md:h-96" role="img" aria-label={`Monthly revenue chart for the trailing ${range === '6M' ? '6 months' : '12 months'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity={0.2} />
                <stop offset="100%" stopColor="rgb(var(--color-primary))" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-border), 0.6)" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgb(var(--color-muted))', fontSize: 11, fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgb(var(--color-muted))', fontSize: 11, fontWeight: 600 }}
              dx={-5}
            />
            <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
            <Area
              type="monotone"
              dataKey="value"
              fill="url(#revenueGrad)"
              stroke="rgb(var(--color-primary))"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 1 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Bar
              dataKey="cap"
              barSize={16}
              radius={[4, 4, 0, 0]}
              fill="rgba(var(--color-primary), 0.12)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
