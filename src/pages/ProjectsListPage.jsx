import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allProjects } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { StatusPill } from '../components/ui'
import { Table } from '../components/ui/Table'
import { Button } from '../components/ui/Button'

const statusTone = {
  'In Progress': 'primary',
  'At Risk': 'danger',
  'On Hold': 'warning',
  Completed: 'success',
}

export function ProjectsListPage() {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('All')

  const projectTypes = ['All', ...new Set(allProjects.map((p) => p.type))]

  const filteredProjects = useMemo(
    () => (typeFilter === 'All' ? allProjects : allProjects.filter((p) => p.type === typeFilter)),
    [typeFilter],
  )

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Project',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-bold text-text">{row.original.name}</div>
            <div className="text-[10px] font-bold text-muted mt-0.5">{row.original.id} · {row.original.client}</div>
          </div>
        ),
      },
      {
        id: 'type',
        header: 'Type',
        accessorKey: 'type',
        cell: ({ getValue }) => <span className="text-xs font-semibold text-text">{getValue()}</span>,
      },
      {
        id: 'manager',
        header: 'Manager',
        accessorKey: 'manager',
        cell: ({ getValue }) => <span className="text-xs font-semibold text-muted">{getValue()}</span>,
      },
      {
        id: 'budget',
        header: 'Budget',
        accessorKey: 'budget',
        cell: ({ getValue }) => <span className="text-xs font-bold text-text">{getValue()}</span>,
      },
      {
        id: 'progress',
        header: 'Progress',
        accessorKey: 'progress',
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2 w-32">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
              <div className="h-full rounded-full bg-primary" style={{ width: `${getValue()}%` }} />
            </div>
            <span className="text-[10px] font-bold text-muted shrink-0">{getValue()}%</span>
          </div>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => <StatusPill tone={statusTone[getValue()] || 'muted'}>{getValue()}</StatusPill>,
      },
    ],
    [],
  )

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Portfolio"
        title="All projects"
        description="Browse, search, and filter every active and past project across the studio."
        actions={[
          <Button key="new" variant="primary" size="sm" icon="add" onClick={() => navigate('/new-project')}>
            New Project
          </Button>,
        ]}
      />

      <div className="flex flex-wrap items-center gap-2">
        {projectTypes.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              typeFilter === type
                ? 'bg-primary text-on-primary shadow-sm'
                : 'border border-border bg-surface text-muted hover:text-text'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <motion.div variants={itemVariants}>
        <div className="rounded-3xl border border-border/80 bg-surface/90 p-5 shadow-soft">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-border/40 select-none">
            <h3 className="font-bold text-text text-base sm:text-lg tracking-tight">Project portfolio</h3>
            <span className="text-xs font-bold text-muted">{filteredProjects.length} projects</span>
          </div>
          <Table
            columns={columns}
            data={filteredProjects}
            onRowClick={(row) => navigate('/project-studio', { state: { projectName: row.name } })}
            enableColumnFilters
            globalSearchPlaceholder="Search by project, client, or manager..."
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-2xl border border-dashed border-border bg-surface-2/30 p-4 flex items-center gap-3">
        <Icon name="info" className="text-muted" />
        <p className="text-xs font-semibold text-muted leading-relaxed">
          Click any row to open it in Project Studio. Progress bars reflect the site's live completion percentage.
        </p>
      </motion.div>
    </motion.div>
  )
}
