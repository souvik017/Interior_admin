import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { teamData } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { Card, EmptyState, StatusPill } from '../components/ui'
import { Dialog } from '../components/feedback/Dialog'

const disciplines = ['Design', 'Site Ops', 'Procurement', 'Management', 'MEP']

export function TeamPage() {
  const location = useLocation()
  const [disciplineFilter, setDisciplineFilter] = useState('All')
  // If we arrived here from clicking an avatar elsewhere in the app, open that person directly
  const [activeMember, setActiveMember] = useState(() =>
    location.state?.initials ? teamData.find((m) => m.initials === location.state.initials) ?? null : null,
  )

  const filtered = disciplineFilter === 'All' ? teamData : teamData.filter((m) => m.discipline === disciplineFilter)

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Workforce"
        title="Team directory"
        description="Every architect, engineer, and coordinator across the studio, and which site they're on."
      />

      <div className="flex flex-wrap items-center gap-2">
        {['All', ...disciplines].map((d) => (
          <button
            key={d}
            onClick={() => setDisciplineFilter(d)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              disciplineFilter === d
                ? 'bg-primary text-on-primary shadow-sm'
                : 'border border-border bg-surface text-muted hover:text-text'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="group_off" title="No team members found" description="Try a different discipline filter." />
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((member) => (
            <motion.div key={member.id} variants={itemVariants}>
              <Card onClick={() => setActiveMember(member)} className="h-full">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-extrabold text-primary">
                    {member.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text truncate">{member.name}</p>
                    <p className="text-xs font-semibold text-muted truncate">{member.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
                    <Icon name="location_on" className="text-sm" />
                    {member.site}
                  </span>
                  <StatusPill tone={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</StatusPill>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={!!activeMember} onClose={() => setActiveMember(null)} title={activeMember?.name} size="sm">
        {activeMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-base font-extrabold text-primary">
                {activeMember.initials}
              </span>
              <div>
                <p className="text-base font-bold text-text">{activeMember.role}</p>
                <p className="text-xs font-semibold text-muted">{activeMember.discipline}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold border-t border-border/40 pt-4">
              <div>
                <p className="text-muted">Current site</p>
                <p className="mt-0.5 text-text font-bold">{activeMember.site}</p>
              </div>
              <div>
                <p className="text-muted">Status</p>
                <p className="mt-0.5 text-text font-bold">{activeMember.status}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted">Email</p>
                <p className="mt-0.5 text-text font-bold truncate">{activeMember.email}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </motion.div>
  )
}
