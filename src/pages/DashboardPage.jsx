import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  allProjects,
  dashboardActivity,
  dashboardNotifications,
  dashboardPipeline,
  dashboardUploads,
} from '../data/mockData'
import { AvatarGroup, ProgressBar, SectionCard, StatCard, StatusPill } from '../components/ui'
import { PageHeader } from '../components/layout/PageHeader'
import { Icon } from '../components/ui/Icon'
import { RevenueChart } from '../components/charts/RevenueChart'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/Toast'

function getGreeting(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [showForecast, setShowForecast] = useState(true)
  const user = useSelector((state) => state.auth.user)

  const goToTeamMember = (initials) => navigate('/team', { state: { initials } })

  const handleOptimize = () => {
    showToast('Crews reassigned to offset the Tuesday labor shortage.', 'success')
    setShowForecast(false)
  }

  const firstName = user?.name?.split(' ')[0] || 'there'
  const now = new Date()
  const greeting = getGreeting(now.getHours())
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)

  // Project counts derived from the same source as the All Projects page,
  // so the numbers never drift from what /projects actually shows.
  const runningCount = useMemo(
    () => allProjects.filter((p) => p.status === 'In Progress' || p.status === 'At Risk').length,
    [],
  )
  const completedCount = useMemo(
    () => allProjects.filter((p) => p.status === 'Completed').length,
    [],
  )

  // Upgraded metrics structure mapping to the KpiCard
  const metricCards = [
    {
      label: 'Total projects',
      value: String(allProjects.length),
      note: `${runningCount} running · ${completedCount} completed`,
      icon: 'trending_up',
      tone: 'primary',
      to: '/projects',
    },
    { label: 'Running', value: String(runningCount), delta: 'Active', note: 'On-site execution', icon: 'hourglass_top', tone: 'secondary', to: '/site-manager' },
    { label: 'Completed', value: String(completedCount), delta: 'Handed over', note: 'Final handover done', icon: 'check_circle', tone: 'success', to: '/projects' },
    { label: 'Material requests', value: '8', delta: 'Urgent', note: 'Pending approval', icon: 'priority_high', tone: 'danger', to: '/purchase-approval' },
    { label: 'Site updates', value: '15', delta: 'New', note: 'Reported today', icon: 'calendar_today', tone: 'tertiary', to: '/site-manager' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full min-w-0 space-y-6"
    >
      <PageHeader
        eyebrow={`Dashboard · ${formattedDate}`}
        title={`${greeting}, ${firstName}`}
        description="A polished workspace for project tracking, procurement pipelines, scheduling, and client approvals."
        actions={[
          <Button
            key="refresh"
            variant="outline"
            size="sm"
            icon="refresh"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>,
        ]}
      />

      {/* KPI Cards Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {metricCards.map((metric) => (
          <motion.div variants={itemVariants} key={metric.label}>
            <StatCard {...metric} onClick={() => navigate(metric.to)} />
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue and notifications panel */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[1.3fr_0.7fr]">
        <motion.div variants={itemVariants} className="min-w-0">
          <RevenueChart />
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-0 space-y-6">
          <div className="rounded-3xl bg-navy-deep p-6 text-white shadow-soft relative overflow-hidden select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(175,16,26,0.3),transparent_60%)]" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/50 sm:text-xs">
                Today's labor count
              </p>
              <p className="mt-2 text-3xl font-extrabold sm:mt-3 sm:text-4xl">124</p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-white/70">
                <Icon name="info" className="text-sm shrink-0" />
                <span>Across all 12 active sites</span>
              </div>
            </div>
          </div>

          <SectionCard
            title="Notifications"
            action={
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-on-primary select-none">
                3 New
              </span>
            }
          >
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1 sm:max-h-80 scrollbar-thin">
              {dashboardNotifications.map((note) => {
                const toneColors = {
                  danger: 'border-rose-500 bg-rose-500/5',
                  warning: 'border-amber-500 bg-amber-500/5',
                  success: 'border-emerald-500 bg-emerald-500/5',
                  primary: 'border-primary bg-primary/5',
                }
                return (
                  <div
                    key={note.title}
                    className={`rounded-2xl border-l-4 p-4 transition-all duration-200 hover:translate-x-1 ${
                      toneColors[note.tone] || 'border-border'
                    }`}
                  >
                    <p className="text-xs font-bold text-text sm:text-sm">{note.title}</p>
                    <p className="mt-1 text-[11px] font-semibold text-muted leading-relaxed">{note.detail}</p>
                    {note.time && (
                      <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-muted/60">
                        {note.time}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </motion.div>
      </div>

      {/* Progress pipeline and uploads */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <motion.div variants={itemVariants} className="min-w-0">
          <SectionCard
            title="Running Projects Progress"
            subtitle="Project movement"
            action={<StatusPill tone="success">Stable</StatusPill>}
            footer={
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                {dashboardActivity.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border bg-surface-2/40 p-4 transition hover:bg-surface-2/70">
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-text sm:text-sm">{item.title}</p>
                        <p className="mt-0.5 text-[11px] font-semibold text-muted truncate leading-relaxed">{item.detail}</p>
                      </div>
                      <StatusPill
                        tone={
                          item.status === 'Alert' ? 'warning' : item.status === 'Done' ? 'success' : 'primary'
                        }
                      >
                        {item.status}
                      </StatusPill>
                    </div>
                    <p className="mt-3 text-[9px] font-bold uppercase tracking-wider text-muted/70">
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>
            }
          >
            <div className="space-y-4">
              {dashboardPipeline.map((stage) => (
                <div key={stage.label} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 select-none">
                    <p className="text-xs font-bold text-text sm:text-sm">{stage.label}</p>
                    <span className="text-[11px] font-extrabold text-primary">{stage.value}%</span>
                  </div>
                  <ProgressBar value={stage.value} tone={stage.tone} />
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-0 space-y-6">
          <SectionCard title="Crew" subtitle="Load balance">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-text sm:text-sm">Current crew load</p>
                <p className="text-[11px] font-semibold text-muted">12 active sites</p>
              </div>
              <AvatarGroup items={['JD', 'MK', 'AR', '+8']} onItemClick={goToTeamMember} />
            </div>
          </SectionCard>

          <SectionCard title="Recent site uploads" subtitle="Latest media">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {dashboardUploads.map((item) => (
                <div
                  key={item}
                  className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border/80 bg-surface-2/40 text-center text-[10px] font-bold uppercase tracking-wider text-muted hover:border-primary/40 hover:bg-surface-2 transition cursor-pointer p-2"
                >
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>
      </div>

      {/* Floating AI Forecast – fixed at bottom‑right corner */}
      {showForecast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-16 right-4 z-40 w-[calc(100%-2rem)] max-w-sm sm:bottom-4 md:max-w-md"
        >
          <div className="flex gap-4 rounded-3xl border border-border bg-surface p-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="auto_awesome" className="text-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold text-text sm:text-sm">AI Smart Forecast</p>
                <button
                  onClick={() => setShowForecast(false)}
                  className="shrink-0 rounded-full p-1 hover:bg-surface-2 text-muted transition hover:text-text"
                  aria-label="Dismiss forecast"
                >
                  <Icon name="close" className="text-base" />
                </button>
              </div>
              <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">
                Labor shortage predicted for next Tuesday at Dubai sites. Adjust schedules?
              </p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={handleOptimize}
                  className="text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-soft transition"
                >
                  Optimize
                </button>
                <button
                  onClick={() => setShowForecast(false)}
                  className="text-xs font-bold uppercase tracking-wider text-muted hover:text-text transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}