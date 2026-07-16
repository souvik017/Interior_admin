import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { Table } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/feedback/Dialog'
import { Input } from '../components/forms/Input'
import { Select } from '../components/forms/Select'
import { Checkbox } from '../components/forms/Checkbox'
import { useToast } from '../components/feedback/Toast'

const statCards = [
  { label: 'Pending Requests', value: '24', icon: 'assignment', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', badge: '+12%' },
  { label: 'Approved POs', value: '18', icon: 'task_alt', iconBg: 'bg-surface-2', iconColor: 'text-text' },
  { label: 'In Transit', value: '09', icon: 'local_shipping', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
  { label: 'Delivered (MTD)', value: '142', icon: 'inventory_2', iconBg: 'bg-surface-2', iconColor: 'text-text' },
]

const materialRequests = [
  {
    id: 'PR-2024-081',
    material: 'Carrara Marble Tiles',
    meta: 'Living Area',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=200&q=80',
    priority: 'HIGH',
    quantity: '450 Sq.Ft',
    status: 'REVIEWING',
    statusTone: 'warning',
    dueDate: 'Oct 12, 2024',
    highlighted: false,
  },
  {
    id: 'PR-2024-079',
    material: 'Brushed Brass Fixtures',
    meta: 'Penthouse B',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200&q=80',
    priority: 'NORMAL',
    quantity: '12 Units',
    status: 'PENDING',
    statusTone: 'amber',
    dueDate: 'Oct 15, 2024',
    highlighted: true,
    actionLabel: 'Review',
  },
  {
    id: 'PR-2024-072',
    material: 'Oak Wood Flooring',
    meta: 'Bedroom Wing',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=200&q=80',
    priority: 'HIGH',
    quantity: '1,200 Sq.Ft',
    status: 'APPROVED',
    statusTone: 'navy',
    dueDate: 'Oct 20, 2024',
    highlighted: false,
  },
]

const priorityClasses = {
  HIGH: 'bg-rose-500/10 text-rose-600 border border-rose-500/15',
  NORMAL: 'bg-surface-2 text-muted border border-border',
  LOW: 'bg-surface-2 text-muted border border-border',
}

const statusClasses = {
  REVIEWING: 'bg-amber-500 text-white border-amber-600',
  PENDING: 'bg-amber-500/10 text-amber-600 border-amber-500/15',
  APPROVED: 'bg-navy-deep text-white border-navy-deep',
  REJECTED: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
}

const priorityOptions = ['HIGH', 'NORMAL', 'LOW']
const statusOptions = ['REVIEWING', 'PENDING', 'APPROVED', 'REJECTED']

const vendorOptions = [
  { id: 'luxelight', name: 'LuxeLight Imports', detail: 'Lead time: 14 days · Best Quality', selected: true },
  { id: 'industrial', name: 'Industrial Brass Co.', detail: 'Lead time: 5 days · Economy Option', selected: false },
]

const trackingEvents = [
  { title: 'PO #4418 - Sent to Vendor', meta: '10 mins ago · By Sarah Chen', active: true },
  { title: 'Oak Wood - Received at Warehouse', meta: '2 hours ago · QC Passed', active: false },
  { title: 'Budget Warning - Carrara Marble', meta: '5 hours ago · AI Audit System', active: false },
]

export function PurchaseApprovalPage() {
  const { showToast } = useToast()
  const [requests, setRequests] = useState(materialRequests)
  const [selectedId, setSelectedId] = useState('PR-2024-079')
  const [showInsight, setShowInsight] = useState(true)
  const [vendors, setVendors] = useState(vendorOptions)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [priorityFilters, setPriorityFilters] = useState([])
  const [statusFilters, setStatusFilters] = useState([])
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const [newRequestForm, setNewRequestForm] = useState({
    material: '',
    meta: '',
    quantity: '',
    priority: 'NORMAL',
    dueDate: '',
  })

  const filteredRequests = requests.filter((r) => {
    if (priorityFilters.length && !priorityFilters.includes(r.priority)) return false
    if (statusFilters.length && !statusFilters.includes(r.status)) return false
    return true
  })

  const selected = requests.find((r) => r.id === selectedId) || requests[0]

  const togglePriorityFilter = (value) => {
    setPriorityFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }
  const toggleStatusFilter = (value) => {
    setStatusFilters((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
  }

  const updateSelectedStatus = (status, message, tone) => {
    setRequests((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status } : r)))
    showToast(message, tone)
  }

  const handleApplySuggestion = () => {
    setVendors((prev) => {
      const exists = prev.some((v) => v.id === 'globalstones')
      const withGlobal = exists
        ? prev
        : [...prev, { id: 'globalstones', name: 'Global Stones', detail: 'Certified grade · -8% baseline cost', selected: false }]
      return withGlobal.map((v) => ({ ...v, selected: v.id === 'globalstones' }))
    })
    showToast('Switched to Global Stones — 8% below baseline cost.', 'success')
    setShowInsight(false)
  }

  const handleAddRequest = (event) => {
    event.preventDefault()
    if (!newRequestForm.material.trim() || !newRequestForm.quantity.trim()) return
    const id = `PR-2024-${Math.floor(100 + Math.random() * 900)}`
    setRequests((prev) => [
      {
        id,
        material: newRequestForm.material.trim(),
        meta: newRequestForm.meta.trim() || 'General',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=200&q=80',
        priority: newRequestForm.priority,
        quantity: newRequestForm.quantity.trim(),
        status: 'PENDING',
        statusTone: 'amber',
        dueDate: newRequestForm.dueDate
          ? new Date(newRequestForm.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          : 'TBD',
        highlighted: false,
      },
      ...prev,
    ])
    setSelectedId(id)
    showToast('New purchase request submitted.', 'success')
    setNewRequestForm({ material: '', meta: '', quantity: '', priority: 'NORMAL', dueDate: '' })
    setNewRequestOpen(false)
  }

  // Define columns for TanStack Table
  const tableColumns = useMemo(
    () => [
      {
        id: 'material',
        header: 'Material & ID',
        accessorKey: 'material',
        cell: ({ row }) => {
          const req = row.original
          return (
            <div className="flex items-center gap-3 min-w-0">
              <img src={req.image} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg object-cover border border-border/80" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text">{req.material}</p>
                <p className="text-[11px] font-semibold text-muted mt-0.5">{req.id} · {req.meta}</p>
              </div>
            </div>
          )
        },
      },
      {
        id: 'priority',
        header: 'Priority',
        accessorKey: 'priority',
        cell: ({ getValue }) => {
          const val = getValue()
          return (
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priorityClasses[val]}`}>
              {val}
            </span>
          )
        },
      },
      {
        id: 'quantity',
        header: 'Quantity',
        accessorKey: 'quantity',
        cell: ({ getValue }) => <span className="text-xs font-semibold text-text">{getValue()}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const val = getValue()
          return (
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusClasses[val]}`}>
              {val}
            </span>
          )
        },
      },
      {
        id: 'dueDate',
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: ({ getValue }) => <span className="text-xs font-semibold text-muted">{getValue()}</span>,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const req = row.original
          if (req.actionLabel) {
            return (
              <span className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-primary shadow-sm select-none">
                {req.actionLabel}
              </span>
            )
          }
          return <Icon name="more_vert" className="text-muted" />
        },
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
        eyebrow="Procurement Pipeline"
        title="Purchase & Approval"
        description="Verify material acquisition requests, audit estimated costs, and coordinate tracking streams."
        actions={[
          <div key="filter" className="relative">
            <Button
              variant="outline"
              size="sm"
              icon="filter_list"
              onClick={() => setFilterPanelOpen((prev) => !prev)}
            >
              Filter{priorityFilters.length + statusFilters.length > 0 ? ` (${priorityFilters.length + statusFilters.length})` : ''}
            </Button>
            <AnimatePresence>
              {filterPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  className="absolute right-0 top-[110%] z-30 w-60 rounded-2xl border border-border bg-surface p-3.5 shadow-xl"
                >
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted px-1">Priority</p>
                  <div className="space-y-1.5 mb-3">
                    {priorityOptions.map((option) => (
                      <Checkbox
                        key={option}
                        label={option}
                        checked={priorityFilters.includes(option)}
                        onChange={() => togglePriorityFilter(option)}
                      />
                    ))}
                  </div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted px-1">Status</p>
                  <div className="space-y-1.5">
                    {statusOptions.map((option) => (
                      <Checkbox
                        key={option}
                        label={option}
                        checked={statusFilters.includes(option)}
                        onChange={() => toggleStatusFilter(option)}
                      />
                    ))}
                  </div>
                  {(priorityFilters.length > 0 || statusFilters.length > 0) && (
                    <button
                      onClick={() => {
                        setPriorityFilters([])
                        setStatusFilters([])
                      }}
                      className="mt-3 text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          <Button key="new" variant="primary" size="sm" icon="shopping_cart" onClick={() => setNewRequestOpen(true)}>
            New Request
          </Button>,
        ]}
      />

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const tone =
            card.iconColor.includes('amber')
              ? 'warning'
              : card.iconColor.includes('rose')
              ? 'danger'
              : 'primary'
          return (
            <motion.div key={card.label} variants={itemVariants}>
              <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    tone === 'warning'
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      : tone === 'danger'
                      ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      : 'bg-surface-2 text-text border-border'
                  }`}>
                    <Icon name={card.icon} className="text-lg" />
                  </span>
                  {card.badge && (
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 px-2 py-0.5 text-[10px] font-bold">
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-muted">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-text sm:text-3xl">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main grids: table (left) + sidebar actions (right) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <motion.div variants={itemVariants} className="min-w-0 space-y-6">
          {/* AI Budget Alert */}
          <AnimatePresence>
            {showInsight && (
              <motion.div
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-surface/90 p-5 shadow-soft relative overflow-hidden sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon name="auto_awesome" className="text-base" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Budget Insight</p>
                    <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">
                      The requested Carrara Marble (PRJ-402) is 15% above estimated budget ranges. Vendor
                      "Global Stones" offers a certified grade at -8% baseline cost.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="primary" size="sm" onClick={handleApplySuggestion}>
                    Apply Suggestion
                  </Button>
                  <button
                    onClick={() => setShowInsight(false)}
                    className="rounded-full p-2 text-muted hover:bg-surface-2 transition hover:text-text sm:hidden"
                    aria-label="Dismiss insight"
                  >
                    <Icon name="close" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TanStack Table Container */}
          <div className="rounded-3xl border border-border/80 bg-surface/90 p-5 shadow-soft">
            <div className="flex items-center justify-between pb-4 mb-2 select-none border-b border-border/40">
              <h3 className="font-bold text-text text-base sm:text-lg tracking-tight">Material Procurement Request Queue</h3>
              <span className="text-xs font-bold text-muted">Showing {filteredRequests.length} of {requests.length}</span>
            </div>

            {/* Responsive Table: TanStack under md/lg, Card List on Mobile */}
            <div className="hidden md:block">
              <Table
                columns={tableColumns}
                data={filteredRequests}
                onRowClick={(row) => setSelectedId(row.id)}
                enableColumnFilters
              />
            </div>

            {/* Mobile Cards Stack */}
            <div className="grid gap-2.5 md:hidden">
              {filteredRequests.map((req) => {
                const isSelected = req.id === selectedId
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedId(req.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border bg-surface hover:bg-surface-2/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img src={req.image} alt="" loading="lazy" className="h-11 w-11 shrink-0 rounded-lg object-cover border border-border" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-text">{req.material}</p>
                            <p className="text-[10px] font-semibold text-muted mt-0.5">{req.id} · {req.meta}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priorityClasses[req.priority]}`}>
                            {req.priority}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-2 text-[10px] font-bold text-muted">
                          <span>Qty: {req.quantity}</span>
                          <span>Due: {req.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Right side details block */}
        <motion.div variants={itemVariants} className="min-w-0 space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <h3 className="font-bold text-text text-base">Request Specification</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-0.5 rounded-full">
                {selected.id} · Active
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Item Details</p>
                <p className="mt-1 text-sm font-bold text-text sm:text-base">
                  {selected.material} <span className="font-semibold text-muted">(Premium Select)</span>
                </p>
                <p className="mt-1.5 text-xs font-semibold text-muted leading-relaxed">
                  Grade: 304 Architectural Steel with high-durability finish. Required for immediate ceiling layout review.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border/40 py-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Estimated Cost</p>
                  <p className="mt-1 text-base font-extrabold text-text sm:text-lg">$14,200</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Best Quote</p>
                  <p className="mt-1 text-base font-extrabold text-primary sm:text-lg">$13,850</p>
                </div>
              </div>

              {/* Steps stepper */}
              <div>
                <p className="mb-4 text-[9px] font-bold uppercase tracking-wider text-muted">Approval Pipeline Status</p>
                <div className="flex items-center">
                  {[
                    { label: 'Supervisor', state: 'done' },
                    { label: 'PM', state: 'current' },
                    { label: 'Purchasing', state: 'pending' },
                    { label: 'Vendor', state: 'pending' },
                  ].map((step, idx, arr) => (
                    <div key={step.label} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold sm:h-7 sm:w-7 ${
                            step.state === 'done'
                              ? 'bg-primary text-on-primary shadow-sm'
                              : step.state === 'current'
                                ? 'border-2 border-primary bg-surface text-primary'
                                : 'bg-surface-2 text-muted border border-border'
                          }`}
                        >
                          {step.state === 'done' ? <Icon name="check" className="text-xs" /> : idx + 1}
                        </span>
                        <span className="whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-muted">
                          {step.label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div
                          className={`mx-1.5 h-0.5 flex-1 ${
                            step.state === 'done' ? 'bg-primary' : 'bg-surface-3'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendors List */}
              <div className="border-t border-border/40 pt-4">
                <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-muted">Select Supplier Option</p>
                <div className="grid gap-2">
                  {vendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      onClick={() =>
                        setVendors((prev) => prev.map((v) => ({ ...v, selected: v.id === vendor.id })))
                      }
                      className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                        vendor.selected ? 'border-primary/30 bg-primary/5' : 'border-border/80 hover:bg-surface-2/40'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-text">{vendor.name}</p>
                        <p className="text-[11px] font-semibold text-muted mt-0.5">{vendor.detail}</p>
                      </div>
                      <span
                        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
                          vendor.selected ? 'border-primary' : 'border-border'
                        }`}
                      >
                        {vendor.selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5 pt-2 border-t border-border/40">
                <Button
                  variant="outline"
                  className="flex-1"
                  size="md"
                  disabled={selected.status === 'REJECTED'}
                  onClick={() => updateSelectedStatus('REJECTED', `${selected.material} request rejected.`, 'danger')}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  className="flex-[1.5]"
                  size="md"
                  disabled={selected.status === 'APPROVED'}
                  onClick={() => updateSelectedStatus('APPROVED', `Purchase order for ${selected.material} sent to vendor.`, 'success')}
                >
                  Approve &amp; Send
                </Button>
              </div>
            </div>
          </div>

          {/* Tracking Status */}
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
            <h3 className="font-bold text-text text-base mb-4 border-b border-border/40 pb-3">Procurement Audit Stream</h3>
            <div className="space-y-4">
              {trackingEvents.map((event) => (
                <div key={event.title} className="flex gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      event.active ? 'bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.5)]' : 'bg-surface-3'
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-text">{event.title}</p>
                    <p className="mt-0.5 text-[10px] font-semibold text-muted">{event.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* New Request dialog */}
      <Dialog open={newRequestOpen} onClose={() => setNewRequestOpen(false)} title="New purchase request" size="sm">
        <form onSubmit={handleAddRequest} className="space-y-4">
          <Input
            label="Material"
            value={newRequestForm.material}
            onChange={(e) => setNewRequestForm({ ...newRequestForm, material: e.target.value })}
            placeholder="Walnut Veneer Panels"
            required
          />
          <Input
            label="Project / area"
            value={newRequestForm.meta}
            onChange={(e) => setNewRequestForm({ ...newRequestForm, meta: e.target.value })}
            placeholder="Living Area"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              value={newRequestForm.quantity}
              onChange={(e) => setNewRequestForm({ ...newRequestForm, quantity: e.target.value })}
              placeholder="200 Sq.Ft"
              required
            />
            <Select
              label="Priority"
              value={newRequestForm.priority}
              onChange={(e) => setNewRequestForm({ ...newRequestForm, priority: e.target.value })}
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </div>
          <Input
            label="Due date"
            type="date"
            value={newRequestForm.dueDate}
            onChange={(e) => setNewRequestForm({ ...newRequestForm, dueDate: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setNewRequestOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" icon="shopping_cart">
              Submit request
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  )
}