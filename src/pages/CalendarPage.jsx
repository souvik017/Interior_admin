import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { calendarEvents } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard } from '../components/ui'
import { Button } from '../components/ui/Button'

const typeMeta = {
  site: { label: 'Site Work', color: 'bg-primary' },
  inspection: { label: 'Inspection', color: 'bg-amber-500' },
  delivery: { label: 'Delivery', color: 'bg-emerald-500' },
  client: { label: 'Client', color: 'bg-tertiary' },
  meeting: { label: 'Meeting', color: 'bg-secondary' },
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function CalendarPage() {
  const today = new Date('2026-07-15')
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(toDateKey(today.getFullYear(), today.getMonth(), today.getDate()))

  const eventsByDate = useMemo(() => {
    const map = {}
    calendarEvents.forEach((event) => {
      if (!map[event.date]) map[event.date] = []
      map[event.date].push(event)
    })
    return map
  }, [])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const changeMonth = (delta) => setCursor(new Date(year, month + delta, 1))

  const selectedEvents = eventsByDate[selectedDate] || []

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Scheduling"
        title="Calendar"
        description="Every site visit, delivery, inspection, and client meeting across all projects in one view."
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <motion.div variants={itemVariants}>
          <SectionCard
            title={monthLabel}
            subtitle="Studio-wide schedule"
            action={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" icon="chevron_left" onClick={() => changeMonth(-1)} aria-label="Previous month" />
                <Button variant="outline" size="sm" onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}>
                  Today
                </Button>
                <Button variant="outline" size="sm" icon="chevron_right" onClick={() => changeMonth(1)} aria-label="Next month" />
              </div>
            }
          >
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted mb-2 select-none">
              {weekdayLabels.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} />
                const dateKey = toDateKey(year, month, day)
                const dayEvents = eventsByDate[dateKey] || []
                const isSelected = dateKey === selectedDate
                const isToday = dateKey === toDateKey(today.getFullYear(), today.getMonth(), today.getDate())
                return (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`flex min-h-[64px] flex-col items-start gap-1 rounded-2xl border p-2 text-left transition ${
                      isSelected
                        ? 'border-primary/50 bg-primary/5'
                        : 'border-border/70 bg-surface hover:bg-surface-2/50'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                        isToday ? 'bg-primary text-on-primary' : 'text-text'
                      }`}
                    >
                      {day}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${typeMeta[e.type]?.color || 'bg-muted'}`} />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </SectionCard>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <SectionCard
            title={new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            subtitle={`${selectedEvents.length} event(s)`}
          >
            <div className="space-y-3">
              {selectedEvents.length === 0 && (
                <div className="flex flex-col items-center py-8 text-center text-muted">
                  <Icon name="event_available" className="text-3xl text-muted/40 mb-2" />
                  <p className="text-xs font-semibold">No events scheduled this day.</p>
                </div>
              )}
              {selectedEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-border/80 bg-surface-2/35 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ${typeMeta[event.type]?.color}`}>
                      {typeMeta[event.type]?.label}
                    </span>
                    <span className="text-[10px] font-bold text-muted">{event.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-text leading-tight">{event.title}</p>
                  <p className="mt-1 text-xs font-semibold text-muted">{event.project}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Legend" subtitle="Event types">
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(typeMeta).map(([key, meta]) => (
                <div key={key} className="flex items-center gap-2 text-xs font-semibold text-muted">
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.color}`} />
                  {meta.label}
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
