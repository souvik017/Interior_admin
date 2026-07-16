import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { ProgressBar, SectionCard, StatusPill, StatCard, EmptyState } from '../components/ui'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/Toast'

// Hardcoded mock details
const stats = [
  { label: 'ACTIVE SITES', value: '12', delta: '+2', note: '+2 this week', icon: 'location_on', tone: 'primary' },
  { label: 'TOTAL MANPOWER', value: '342', delta: '84%', note: 'Capacity level', icon: 'people', tone: 'secondary' },
  { label: 'ACTION NEEDED', value: '08', delta: 'Urgent', note: 'Pending issues', icon: 'priority_high', tone: 'danger' },
  { label: 'SOLVED RATE', value: '94.2%', delta: '+1.5%', note: 'Resolved issues MTD', icon: 'trending_up', tone: 'success' },
]

const scheduleItems = [
  {
    time: '08:00 AM',
    title: 'Skyline Penthouse: HVAC Installation',
    meta: 'Phase 3 • Team Alpha (12 members)',
    status: '+10',
    tone: 'success',
  },
  {
    time: '11:30 AM',
    title: 'Zen Office Hub: Floor Tiling Inspection',
    meta: 'Milestone Reach • Quality Control',
    status: 'PENDING',
    tone: 'warning',
  },
  {
    time: '02:00 PM',
    title: 'Luxe Retail: Material Delivery (Italian Marble)',
    meta: 'Inventory Update • Logistics Team',
    status: 'ON TIME',
    tone: 'success',
  },
]

const urgentIssues = [
  { title: 'Material Shortage: Cement Grade 43', detail: 'Skyline Penthouse • Delay Risk: High', status: '+10', tone: 'danger' },
  { title: 'Safety Violation: Scaffolding', detail: 'Luxe Retail • Area: North Wing', status: 'RESOLVE ALL', tone: 'warning' },
]

const resourceData = [
  {
    category: 'Carpentry & Joinery',
    total: '112/120 Workers',
    sites: [
      { name: 'Skyline', value: 45 },
      { name: 'Zen Hub', value: 38 },
      { name: 'Retail', value: 29 },
    ],
    progress: 93,
  },
  {
    category: 'Electrical & Wiring',
    total: '68/150 Workers',
    sites: [
      { name: 'Skyline', value: 45 },
      { name: 'Zen Hub', value: 38 },
      { name: 'Retail', value: 29 },
    ],
    progress: 45,
  },
]

const recentPhotos = ['Structure check', 'Ceiling framed', 'Joinery logs', 'Wiring inspection', 'Floor tiling V2', 'Material logs']

export function SiteManagerPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [issues, setIssues] = useState(urgentIssues)

  const handleResolveAll = () => {
    setIssues([])
    showToast('All urgent site issues marked as resolved.', 'success')
  }

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
        eyebrow="Site Logistics"
        title="Site manager overview"
        description="Monitor daily manpower allocation, urgent issues, scheduling, and live construction updates."
        actions={[
          <Button key="manage" variant="outline" size="sm" icon="settings" onClick={() => navigate('/site-settings')}>
            Manage Sites
          </Button>,
        ]}
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Two‑column layouts */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants}>
          <SectionCard title="Today's Schedule & Critical Path">
            <div className="space-y-3">
              {scheduleItems.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface-2/35 p-4 sm:flex-row sm:items-center hover:bg-surface-2/60 transition"
                >
                  <div className="w-24 text-[10px] font-bold uppercase tracking-[0.24em] text-muted sm:w-28">
                    {item.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text">{item.title}</p>
                    <p className="mt-0.5 text-xs font-semibold text-muted leading-relaxed">{item.meta}</p>
                  </div>
                  <div className="shrink-0 flex items-center justify-start sm:justify-end">
                    <StatusPill tone={item.tone}>{item.status}</StatusPill>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>

        {/* Urgent Issues */}
        <motion.div variants={itemVariants}>
          <SectionCard title={`Urgent Site Issues (${issues.length})`}>
            <div className="space-y-3">
              {issues.length === 0 ? (
                <EmptyState icon="check_circle" title="No urgent issues" description="All site issues have been resolved." />
              ) : (
                <>
                  {issues.map((issue) => (
                    <div key={issue.title} className="rounded-2xl border border-border/80 bg-surface-2/35 p-4 hover:bg-surface-2/60 transition">
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
                        <div>
                          <p className="text-sm font-bold text-text leading-tight">{issue.title}</p>
                          <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">{issue.detail}</p>
                        </div>
                        <StatusPill tone={issue.tone}>{issue.status}</StatusPill>
                      </div>
                    </div>
                  ))}
                  <Button variant="primary" className="w-full justify-center mt-2" icon="check_circle" onClick={handleResolveAll}>
                    Resolve All Issues
                  </Button>
                </>
              )}
            </div>
          </SectionCard>
        </motion.div>
      </div>

      {/* AI Productivity Forecast */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-border bg-surface/90 p-6 shadow-soft relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
        <div className="flex items-start gap-4">
          <div className="shrink-0 rounded-full bg-primary/10 p-2 text-primary">
            <Icon name="auto_awesome" className="text-2xl" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-text tracking-tight">AI Productivity Forecast</h4>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-muted leading-relaxed">
              <span className="font-bold text-text">Zen Office Hub</span> is predicted to fall 48 hours behind schedule due to projected monsoon rain interference.
            </p>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 rounded-2xl bg-primary/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary border border-primary/5">
              <span className="flex items-center gap-1 shrink-0 select-none">
                <Icon name="lightbulb" className="text-sm" />
                AI Suggestion:
              </span>
              <span className="font-semibold text-muted lowercase tracking-normal leading-relaxed">
                Shift interior painting tasks to night shift for the next 3 days to maintain handover date.
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Resource Allocation */}
      <motion.div variants={itemVariants}>
        <SectionCard title="Resource Allocation Across Sites">
          <div className="space-y-6">
            {resourceData.map((resource) => (
              <div key={resource.category} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-text">{resource.category}</p>
                    <p className="text-xs font-semibold text-muted mt-0.5">{resource.total}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                    {resource.sites.map((site) => (
                      <span key={site.name} className="flex items-center gap-1">
                        <span className="text-muted font-medium">{site.name}</span>
                        <span className="text-text">({site.value})</span>
                      </span>
                    ))}
                  </div>
                </div>
                <ProgressBar value={resource.progress} tone={resource.progress > 80 ? 'success' : 'primary'} />
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.div>

      {/* Recent Site Photos */}
      <motion.div variants={itemVariants}>
        <SectionCard title="Recent Site Photos">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recentPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-surface-2/40 text-center text-[10px] font-bold uppercase tracking-wider text-muted hover:border-primary/20 hover:bg-surface-2 transition cursor-pointer p-3 select-none leading-relaxed"
              >
                {photo}
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}