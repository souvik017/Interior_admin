import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard, StatusPill } from '../components/ui'
import { Input } from '../components/forms/Input'
import { Select } from '../components/forms/Select'
import { Textarea } from '../components/forms/Textarea'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/Toast'

const priorities = ['Low', 'Medium', 'High', 'Urgent']
const assignees = ['Rajesh K.', 'Amit S.', 'Nora P.', 'Vikram M.', 'Sara L.']
const columns = ['To Do', 'In Progress', 'Review', 'Completed']

export function AddTaskPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    title: '',
    project: '',
    column: 'To Do',
    assignee: 'Rajesh K.',
    priority: 'Medium',
    dueDate: '',
    description: '',
  })

  const handleSave = () => {
    if (!form.title.trim() || !form.project.trim() || !form.dueDate) {
      showToast('Please fill in the task title, project, and due date.', 'danger')
      return
    }
    navigate('/task-board', {
      state: {
        newTask: {
          title: form.title.trim(),
          category: form.project.trim(),
          due: new Date(form.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          owner: form.assignee,
          budget: '$0',
          priority: form.priority,
          column: form.column,
        },
      },
    })
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
        eyebrow="Task Setup"
        title="Add task"
        description="Configure operational tasks, assign execution roles, select column states, and establish timelines."
        actions={[
          <Button
            key="back"
            variant="outline"
            size="sm"
            icon="arrow_back"
            onClick={() => navigate('/task-board')}
          >
            Back to Board
          </Button>,
          <Button
            key="save"
            variant="primary"
            size="sm"
            icon="task_alt"
            onClick={handleSave}
          >
            Save Task
          </Button>,
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        {/* Form fields */}
        <motion.div variants={itemVariants} className="min-w-0">
          <SectionCard title="Task Specifications" subtitle="Core Information Form">
            <form className="grid gap-4.5 md:grid-cols-2 pt-2" onSubmit={(e) => e.preventDefault()}>
              <div className="md:col-span-2">
                <Input
                  label="Task title"
                  placeholder="Wardrobe carcass assembly"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Project"
                placeholder="Master Bedroom"
                value={form.project}
                onChange={(e) => setForm({ ...form, project: e.target.value })}
                required
              />
              <Select
                label="Column"
                value={form.column}
                onChange={(e) => setForm({ ...form, column: e.target.value })}
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </Select>
              <Select
                label="Assignee"
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              >
                {assignees.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </Select>
              <Select
                label="Priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {priorities.map((prio) => (
                  <option key={prio} value={prio}>
                    {prio}
                  </option>
                ))}
              </Select>
              <Input
                label="Due date"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                required
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Task scope description"
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe material dependencies, construction scope, inspection tolerances, and QC parameters..."
                />
              </div>
            </form>
          </SectionCard>
        </motion.div>

        {/* Sidebar checklist & summaries */}
        <motion.div variants={itemVariants} className="space-y-6">
          <SectionCard title="Setup Preview" subtitle="Operational check">
            <div className="rounded-3xl bg-navy-deep p-6 text-white relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(175,16,26,0.3),transparent_60%)]" />
              <div className="relative z-10">
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">Ready to save</p>
                <h4 className="mt-3 text-xl font-bold tracking-tight text-white leading-snug">
                  {form.title || 'New master bedroom task'}
                </h4>
                <p className="mt-2 text-xs font-semibold text-white/70 leading-relaxed">
                  Timelines and priority tags map directly to columns for interactive board updates.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusPill tone="primary">Board enabled</StatusPill>
                  <StatusPill tone="success">Drag ready</StatusPill>
                  <StatusPill tone="muted">List view supported</StatusPill>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Checklist" subtitle="Task validation controls">
            <div className="space-y-3 pt-2">
              {['Material specs verified', 'Assigned crew leads verified', 'Estimated operational budget bounds verified', 'Deadline target ranges verified'].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-text font-bold leading-normal truncate">{item}</p>
                      <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-0.5">Verification Step {index + 1}</p>
                    </div>
                    <div className="shrink-0">
                      <StatusPill tone={index < 2 ? 'success' : 'muted'}>
                        {index < 2 ? 'Done' : 'Pending'}
                      </StatusPill>
                    </div>
                  </div>
                ),
              )}
            </div>
          </SectionCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
