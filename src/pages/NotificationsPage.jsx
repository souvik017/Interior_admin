import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dashboardNotifications } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard, StatusPill } from '../components/ui'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/forms/Checkbox'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(dashboardNotifications)

  const clearAll = () => {
    setNotifications([])
  }

  const markAllRead = () => {
    // Just a visual cue or state update
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
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
        eyebrow="Communication Central"
        title="Notifications Center"
        description="Verify site warnings, approval requests, material updates, and system logs."
        actions={[
          <Button
            key="mark-read"
            variant="outline"
            size="sm"
            icon="done_all"
            onClick={markAllRead}
            disabled={notifications.length === 0}
          >
            Mark All Read
          </Button>,
          <Button
            key="clear"
            variant="ghost"
            size="sm"
            icon="delete"
            className="text-danger hover:bg-danger/5"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>,
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Main Notifications List */}
        <motion.div variants={itemVariants} className="min-w-0">
          <SectionCard title="Recent Activity" subtitle={`Active alerts: ${notifications.length}`}>
            <AnimatePresence mode="popLayout">
              {notifications.length > 0 ? (
                <div className="space-y-3.5 pt-2">
                  {notifications.map((note, idx) => {
                    const toneColors = {
                      danger: 'border-rose-500 bg-rose-500/5',
                      warning: 'border-amber-500 bg-amber-500/5',
                      success: 'border-emerald-500 bg-emerald-500/5',
                      primary: 'border-primary bg-primary/5',
                    }
                    const iconMap = {
                      danger: 'error',
                      warning: 'warning',
                      success: 'check_circle',
                      primary: 'info',
                    }

                    return (
                      <motion.div
                        key={note.title + '_' + idx}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`flex gap-4 rounded-2xl border border-border/80 border-l-4 p-4 transition-all hover:translate-x-1 ${
                          toneColors[note.tone] || 'border-border bg-surface-2/20'
                        }`}
                      >
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          note.tone === 'danger'
                            ? 'bg-rose-500/10 text-rose-600'
                            : note.tone === 'warning'
                            ? 'bg-amber-500/10 text-amber-600'
                            : note.tone === 'success'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          <Icon name={iconMap[note.tone] || 'info'} className="text-lg" />
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold text-text truncate">{note.title}</h4>
                            <StatusPill tone={note.tone}>{note.tone || 'info'}</StatusPill>
                          </div>
                          <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">
                            {note.detail}
                          </p>
                          <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-muted/60">
                            {note.time || '10 mins ago'} · System Automated
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-muted">
                  <Icon name="notifications_off" className="text-4xl text-muted/50 mb-3" />
                  <p className="text-sm font-bold text-text">All caught up!</p>
                  <p className="text-xs text-muted/80 mt-1">You have no unread notifications.</p>
                </div>
              )}
            </AnimatePresence>
          </SectionCard>
        </motion.div>

        {/* Sidebar Filters & Settings */}
        <motion.div variants={itemVariants} className="space-y-6">
          <SectionCard title="Notification Preferences" subtitle="System Configurations">
            <div className="space-y-4 pt-2">
              {[
                { name: 'Email alerts', detail: 'Receive daily audit reports in email inbox', active: true },
                { name: 'AI anomalies', detail: 'Critical mismatch warnings immediately', active: true },
                { name: 'Site updates', detail: 'Logs when manpower capacities cross limits', active: false },
              ].map((pref) => (
                <div
                  key={pref.name}
                  className="rounded-2xl border border-border bg-surface p-4 hover:bg-surface-2/40 transition"
                >
                  <Checkbox label={pref.name} description={pref.detail} defaultChecked={pref.active} />
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
