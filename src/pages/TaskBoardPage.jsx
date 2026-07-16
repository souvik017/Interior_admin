import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { taskColumns as seedColumns } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard, StatusPill } from '../components/ui'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/feedback/Dialog'
import { Checkbox } from '../components/forms/Checkbox'
import { useToast } from '../components/feedback/Toast'

function createBoardData() {
  return seedColumns.map((column, columnIndex) => ({
    id: `column-${columnIndex}`,
    title: column.title,
    tone: column.tone,
    cards: column.cards.map((card, cardIndex) => ({
      id: `${columnIndex}-${cardIndex}-${card.title}`,
      ...card,
    })),
  }))
}

function getPriorityTone(priority) {
  if (priority === 'High' || priority === 'Urgent') return 'danger'
  if (priority === 'Low') return 'muted'
  if (priority === 'Done') return 'success'
  return 'tertiary'
}

// Inserts a task handed off from the Add Task page into its target column
function insertNewTask(columns, newTask) {
  if (!newTask) return columns
  const targetColumn = columns.find((col) => col.title === newTask.column) || columns[0]
  return columns.map((col) =>
    col.id === targetColumn.id
      ? {
          ...col,
          cards: [
            {
              id: `${col.id}-${Date.now()}`,
              title: newTask.title,
              category: newTask.category,
              due: newTask.due,
              owner: newTask.owner,
              budget: newTask.budget,
              priority: newTask.priority,
            },
            ...col.cards,
          ],
        }
      : col,
  )
}

export function TaskBoardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const incomingTask = location.state?.newTask
  const [columns, setColumns] = useState(() => insertNewTask(createBoardData(), incomingTask))
  const [draggedCard, setDraggedCard] = useState(null)
  const [showSequencing, setShowSequencing] = useState(true)
  const [layout, setLayout] = useState('board')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [selectedCardIds, setSelectedCardIds] = useState([])

  const totals = useMemo(
    () => columns.reduce((acc, col) => acc + col.cards.length, 0),
    [columns],
  )

  // Announce the handed-off task once, then clear the navigation state so a refresh doesn't re-add it
  useEffect(() => {
    if (!incomingTask) return
    showToast(`"${incomingTask.title}" added to ${incomingTask.column}.`, 'success')
    navigate(location.pathname, { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleCardSelected = (cardId) => {
    setSelectedCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
    )
  }

  const handleBulkComplete = () => {
    if (selectedCardIds.length === 0) return
    setColumns((currentColumns) => {
      const completedColumn = currentColumns.find((col) => col.title === 'Completed') || currentColumns[currentColumns.length - 1]
      const movedCards = []
      const withoutMoved = currentColumns.map((col) => {
        if (col.id === completedColumn.id) return { ...col, cards: [...col.cards] }
        const staying = []
        col.cards.forEach((card) => {
          if (selectedCardIds.includes(card.id)) movedCards.push(card)
          else staying.push(card)
        })
        return { ...col, cards: staying }
      })
      return withoutMoved.map((col) =>
        col.id === completedColumn.id ? { ...col, cards: [...movedCards, ...col.cards] } : col,
      )
    })
    showToast(`${selectedCardIds.length} task(s) marked as completed.`, 'success')
    setSelectedCardIds([])
    setBulkOpen(false)
  }

  const handleDragStart = (card, fromColumnId) => {
    setDraggedCard({ card, fromColumnId })
  }

  const handleDrop = (targetColumnId) => {
    if (!draggedCard) return

    setColumns((currentColumns) => {
      const nextColumns = currentColumns.map((col) => ({
        ...col,
        cards: [...col.cards],
      }))

      const sourceColumn = nextColumns.find((col) => col.id === draggedCard.fromColumnId)
      const targetColumn = nextColumns.find((col) => col.id === targetColumnId)

      if (!sourceColumn || !targetColumn) return currentColumns

      const cardIndex = sourceColumn.cards.findIndex((item) => item.id === draggedCard.card.id)
      if (cardIndex === -1) return currentColumns

      const [card] = sourceColumn.cards.splice(cardIndex, 1)
      targetColumn.cards.push(card)
      return nextColumns
    })

    setDraggedCard(null)
  }

  const allowDrop = (event) => {
    event.preventDefault()
  }

  return (
    <div className="space-y-6 select-none">
      <PageHeader
        eyebrow="Task Board"
        title="Master bedroom board"
        description="Kanban-style task coordination with priority tracking, assignees, and budgets."
        actions={[
          <Button
            key="bulk"
            variant="outline"
            size="sm"
            icon="checklist"
            onClick={() => setBulkOpen(true)}
          >
            {totals} Tasks
          </Button>,
          <Button
            key="add"
            variant="primary"
            size="sm"
            icon="add"
            onClick={() => navigate('/add-task')}
          >
            Add Task
          </Button>,
        ]}
      />

      <SectionCard
        title="Board controls"
        subtitle="View configurations"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={showSequencing ? 'visibility_off' : 'visibility'}
              onClick={() => setShowSequencing((prev) => !prev)}
            >
              {showSequencing ? 'Hide AI Scheduler' : 'Show AI Scheduler'}
            </Button>

            <div className="inline-flex rounded-full border border-border bg-surface p-1 shadow-sm">
              {[
                ['board', 'view_column', 'Board'],
                ['list', 'view_list', 'List'],
                ['compact', 'grid_view', 'Compact'],
              ].map(([value, icon, label]) => {
                const active = layout === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLayout(value)}
                    aria-pressed={active}
                    className={`
                      inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200
                      ${active ? 'bg-primary text-on-primary shadow-sm' : 'text-muted hover:text-text'}
                    `}
                  >
                    <Icon name={icon} className="text-[16px]" />
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        }
      >
        <div
          className={`
            grid gap-6 transition-all duration-300
            ${
              showSequencing
                ? layout === 'board'
                  ? 'xl:grid-cols-[1.3fr_0.7fr]'
                  : 'xl:grid-cols-[1.45fr_0.55fr]'
                : 'grid-cols-1'
            }
          `}
        >
          {/* Main Board Grid */}
          <div
            className={`
              grid gap-5
              ${
                layout === 'board'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
                  : layout === 'compact'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
              }
            `}
          >
            {columns.map((column) => (
              <div
                key={column.id}
                className="space-y-4"
                onDragOver={allowDrop}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="flex items-center justify-between px-1 bg-surface-2/40 rounded-xl p-1">
                  <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-muted pl-1.5">
                    {column.title}
                  </h2>
                  <StatusPill tone={column.tone}>{column.cards.length}</StatusPill>
                </div>

                <div
                  className={`
                    space-y-3 min-h-[300px] rounded-3xl border border-border/80 bg-surface/50 p-3.5 transition-all
                    ${layout === 'list' ? 'divide-y divide-border/60 space-y-0 p-0 overflow-hidden' : ''}
                  `}
                >
                  <AnimatePresence>
                    {column.cards.map((card) => (
                      <motion.article
                        key={card.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        draggable
                        onDragStart={() => handleDragStart(card, column.id)}
                        className={`
                          cursor-grab rounded-2xl border border-border bg-surface p-4 shadow-soft transition hover:border-primary/20 hover:shadow-md active:cursor-grabbing active:scale-95
                          ${draggedCard?.card.id === card.id ? 'opacity-40 border-dashed border-primary' : ''}
                          ${
                            layout === 'list'
                              ? 'm-0 rounded-none border-x-0 border-b-0 border-t first:border-t-0 hover:bg-surface-2/30'
                              : ''
                          }
                        `}
                      >
                        <div className="space-y-1.5">
                          {/* Row 1: Category & Priority */}
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-muted select-none truncate">
                              {card.category}
                            </p>
                            <span className="shrink-0">
                              <StatusPill tone={getPriorityTone(card.priority)}>
                                {card.priority}
                              </StatusPill>
                            </span>
                          </div>
                          {/* Row 2: Title */}
                          <h3 className="text-sm font-bold text-text truncate">
                            {card.title}
                          </h3>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[10px] font-bold text-muted gap-2">
                          <span className="flex items-center gap-1 min-w-0">
                            <Icon name="calendar_today" className="text-[14px] shrink-0" />
                            <span className="truncate">{card.due}</span>
                          </span>
                          <span className="font-extrabold text-primary shrink-0">{card.budget}</span>
                        </div>
                        <p className="mt-2 text-[10px] font-bold text-muted">Owner: {card.owner}</p>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* AI Sequencing Side Panel */}
          <AnimatePresence>
            {showSequencing && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="min-w-0"
              >
                <SectionCard
                  title="Task sequencing"
                  subtitle="AI Operations Assistant"
                  className="sticky top-24"
                  action={
                    <button
                      onClick={() => setShowSequencing(false)}
                      className="rounded-full p-1.5 hover:bg-surface-2 text-muted transition hover:text-text"
                      aria-label="Hide panel"
                    >
                      <Icon name="visibility_off" className="text-base" />
                    </button>
                  }
                >
                  <div className="rounded-3xl bg-navy-deep p-6 text-white relative overflow-hidden select-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(175,16,26,0.3),transparent_60%)]" />
                    
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-on-primary">
                        <Icon name="smart_toy" filled />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Aura Insight Engine</p>
                        <p className="text-[10px] font-bold tracking-wider text-white/50">Auto-Scheduler</p>
                      </div>
                    </div>

                    <div className="relative z-10 mt-5 space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                          Critical Bottleneck
                        </p>
                        <p className="mt-1 text-xs font-semibold text-white/90 leading-relaxed">
                          Veneer pressing delay is pushing the accent wall headboard schedule into final review window.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                          Recommended Sequence Adjustments
                        </p>
                        <ol className="mt-2.5 space-y-2 text-xs font-semibold text-white/80 list-none leading-relaxed">
                          <li>1. Accelerate wardrobe carcass assembly ahead of polish cycles.</li>
                          <li>2. Parallelize conduits layout during framing steps.</li>
                          <li>3. Shift styling tasks to post-QA inspection gates.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionCard>

      {/* Bulk actions dialog */}
      <Dialog open={bulkOpen} onClose={() => setBulkOpen(false)} title="Bulk actions" size="lg">
        <div className="space-y-5">
          <p className="text-xs font-semibold text-muted leading-relaxed">
            Select tasks below and move them straight to <span className="font-bold text-text">Completed</span>.
          </p>
          <div className="max-h-96 space-y-4 overflow-y-auto pr-1 scrollbar-thin">
            {columns.map((column) => (
              <div key={column.id}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-muted">
                  {column.title} ({column.cards.length})
                </p>
                <div className="space-y-2">
                  {column.cards.length === 0 && (
                    <p className="text-xs font-semibold text-muted/70 italic">No tasks in this column.</p>
                  )}
                  {column.cards.map((card) => (
                    <div
                      key={card.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-2/30 px-4 py-2.5"
                    >
                      <Checkbox
                        label={card.title}
                        checked={selectedCardIds.includes(card.id)}
                        onChange={() => toggleCardSelected(card.id)}
                      />
                      <StatusPill tone={getPriorityTone(card.priority)}>{card.priority}</StatusPill>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 border-t border-border/40 pt-4">
            <Button variant="outline" onClick={() => setBulkOpen(false)}>
              Close
            </Button>
            <Button icon="check_circle" disabled={selectedCardIds.length === 0} onClick={handleBulkComplete}>
              Mark {selectedCardIds.length || ''} Completed
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
