import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { analyticsHighlights, analyticsSeries } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgressBar, SectionCard, StatCard, StatusPill } from '../components/ui'
import { Table } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/Toast'

const dateRangeOptions = ['This Week', 'This Month', 'This Quarter', 'This Year']

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const laborProductivity = [
  { id: 'PARK-001', name: 'Park Avenue Residence', hours: '1,240 hrs', output: 94, tone: 'success', status: 'Optimized' },
  { id: 'LOFT-092', name: 'The Loft Workspace', hours: '860 hrs', output: 82, tone: 'warning', status: 'In progress' },
  { id: 'SV-002', name: 'Sunset Villa II', hours: '450 hrs', output: 65, tone: 'danger', status: 'Delayed' },
]

const prioritySites = [
  { name: 'The Loft Workspace', location: 'Brooklyn, NY', status: 'Site live', tone: 'success' },
  { name: 'Sunset Villa II', location: 'Malibu, CA', status: 'On hold', tone: 'warning' },
  { name: 'Park Avenue Residence', location: 'New York, NY', status: '90% complete', tone: 'success' },
]

function OutputBar({ output, tone }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-text">{output}%</span>
      <div className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-3 sm:w-16">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            tone === 'success' ? 'bg-primary' : tone === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${output}%` }}
        />
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-3 shadow-lg text-xs font-bold select-none">
        <p className="text-muted text-[10px] uppercase tracking-wider mb-1">{payload[0].payload.label}</p>
        <p className="text-text">Output Level: <span className="text-primary font-extrabold">{payload[0].value}%</span></p>
      </div>
    )
  }
  return null
}

export function ProjectAnalyticsPage() {
  const { showToast } = useToast()
  const [dateRange, setDateRange] = useState('This Quarter')
  const [rangeMenuOpen, setRangeMenuOpen] = useState(false)

  const handleExport = () => {
    downloadTextFile(
      `project-analytics-${dateRange.toLowerCase().replace(/\s+/g, '-')}.txt`,
      `Project Analytics Report — ${dateRange}\n\n${analyticsHighlights
        .map((h) => `${h.label}: ${h.value} (${h.delta})`)
        .join('\n')}\n`,
    )
    showToast('Analytics report exported.', 'success')
  }

  const laborColumns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Project Site',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-bold text-text">{row.original.name}</div>
            <div className="text-[10px] font-bold text-muted mt-0.5">ID: #{row.original.id}</div>
          </div>
        ),
      },
      {
        id: 'hours',
        header: 'Man-hours',
        accessorKey: 'hours',
        cell: ({ getValue }) => <span className="text-xs font-semibold text-text">{getValue()}</span>,
      },
      {
        id: 'output',
        header: 'Output Rate',
        accessorKey: 'output',
        cell: ({ row }) => (
          <div className="flex items-center justify-start">
            <OutputBar output={row.original.output} tone={row.original.tone} />
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <StatusPill tone={row.original.tone}>{row.original.status}</StatusPill>
        ),
      },
    ],
    [],
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 select-none"
    >
      <PageHeader
        eyebrow="Business Intelligence"
        title="Project analytics"
        description="Verify revenue metrics, labor utilization, delivery schedules, and client NPS scores."
        actions={[
          <div key="range" className="relative">
            <Button
              variant="outline"
              size="sm"
              icon="date_range"
              onClick={() => setRangeMenuOpen((prev) => !prev)}
            >
              {dateRange}
            </Button>
            <AnimatePresence>
              {rangeMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  className="absolute right-0 top-[110%] z-30 w-44 rounded-2xl border border-border bg-surface p-2 shadow-xl"
                >
                  {dateRangeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setDateRange(option)
                        setRangeMenuOpen(false)
                      }}
                      className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                        dateRange === option ? 'bg-primary/10 text-primary' : 'text-text hover:bg-surface-2'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          <Button key="export" variant="primary" size="sm" icon="download" onClick={handleExport}>
            Export PDF Report
          </Button>,
        ]}
      />

      {/* Highlights Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        {analyticsHighlights.map((metric) => (
          <motion.div key={metric.label} variants={itemVariants}>
            <StatCard {...metric} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6 min-w-0">
          {/* Performance Trend Chart */}
          <motion.div variants={itemVariants}>
            <SectionCard title="Performance Trend" subtitle="Monthly Output Ratio">
              <div className="h-72 w-full sm:h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsSeries} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity={0.25} />
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
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      fill="url(#trendGrad)"
                      stroke="rgb(var(--color-primary))"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 1 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </motion.div>

          {/* Labor Productivity TanStack Table */}
          <motion.div variants={itemVariants}>
            <div className="rounded-3xl border border-border/80 bg-surface/90 p-5 shadow-soft">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-border/40 select-none">
                <h3 className="font-bold text-text text-base sm:text-lg tracking-tight">Labor productivity by site</h3>
                <span className="text-xs font-bold text-muted">Current quarter logs</span>
              </div>
              <Table columns={laborColumns} data={laborProductivity} enableColumnFilters />
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          <SectionCard title="AI Operations Summary" subtitle="Insights">
            <div className="space-y-3.5">
              <div className="rounded-2xl border border-border bg-surface-2/45 p-4 transition hover:bg-surface-2/70">
                <p className="text-xs font-bold text-text">Cost Margin Outlook</p>
                <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">
                  Procurement costs are currently rising slower than net revenues, enhancing gross margin projections.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-surface-2/45 p-4 transition hover:bg-surface-2/70">
                <p className="text-xs font-bold text-text">Critical Constraints Watch</p>
                <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">
                  Supply bottlenecks cluster near custom-ordered marble profiles and late client review check-offs.
                </p>
              </div>
              <StatusPill tone="success">Model Confidence High</StatusPill>
            </div>
          </SectionCard>

          {/* Business performance */}
          <div className="rounded-3xl bg-navy-deep p-6 text-white shadow-soft overflow-hidden select-none sticky top-24">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(175,16,26,0.3),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="border-b border-white/10 pb-4 text-base font-bold sm:text-lg tracking-tight">
                Business Performance
              </h2>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/50">
                  <span>Quarterly Target</span>
                  <span className="text-white">85% achieved</span>
                </div>
                <ProgressBar value={85} tone="primary" />
              </div>

              <div className="mt-6 flex items-center gap-5">
                {/* SVG Progress Circle */}
                <div className="relative h-20 w-20 shrink-0">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="rgb(var(--color-primary))"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="62.8"
                      className="shadow-glow"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-extrabold text-white">75%</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Profit Target Status</p>
                  <p className="text-lg font-extrabold text-white mt-0.5">$1.2M / $1.6M</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3.5 pt-4 border-t border-white/10 text-xs">
                <div className="rounded-2xl bg-white/5 p-3.5">
                  <p className="text-white/50 font-bold">WIP value</p>
                  <p className="text-sm font-extrabold text-white mt-1">$342k</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3.5">
                  <p className="text-white/50 font-bold">Committed</p>
                  <p className="text-sm font-extrabold text-white mt-1">$118k</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom priority sites card layout */}
      <motion.div variants={itemVariants}>
        <SectionCard title="High-priority site status" subtitle="Sites needing immediate attention">
          <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3">
            {prioritySites.map((site) => (
              <div key={site.name} className="overflow-hidden rounded-3xl border border-border bg-surface-2/40 hover:bg-surface-2/70 transition-all duration-300 group">
                <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/0 border-b border-border/40 select-none">
                  <Icon name="architecture" className="text-3xl text-primary/40 group-hover:scale-105 transition-transform" />
                  <div className="absolute right-3.5 top-3.5">
                    <StatusPill tone={site.tone}>{site.status}</StatusPill>
                  </div>
                </div>
                <div className="p-4.5">
                  <h4 className="text-sm font-bold text-text truncate">{site.name}</h4>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-muted uppercase tracking-wider">
                    <Icon name="location_on" className="text-sm" />
                    <span>{site.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}