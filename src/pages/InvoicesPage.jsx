import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { invoicesData } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { StatCard, StatusPill } from '../components/ui'
import { Table } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/feedback/Dialog'
import { useToast } from '../components/feedback/Toast'
import { downloadInvoicePdf } from '../utils/invoicePdf'

const statusTone = { Paid: 'success', Due: 'warning', Overdue: 'danger' }

function parseAmount(amount) {
  return Number(amount.replace(/[^0-9.]/g, '')) || 0
}

export function InvoicesPage() {
  const { showToast } = useToast()
  const [invoices, setInvoices] = useState(invoicesData)
  const [viewInvoice, setViewInvoice] = useState(null)

  const totals = useMemo(() => {
    const paid = invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + parseAmount(i.amount), 0)
    const due = invoices.filter((i) => i.status === 'Due').reduce((sum, i) => sum + parseAmount(i.amount), 0)
    const overdue = invoices.filter((i) => i.status === 'Overdue').reduce((sum, i) => sum + parseAmount(i.amount), 0)
    return { paid, due, overdue, total: paid + due + overdue }
  }, [invoices])

  const statCards = [
    { label: 'Total Billed', value: `$${totals.total.toLocaleString()}`, icon: 'account_balance_wallet', tone: 'primary' },
    { label: 'Paid', value: `$${totals.paid.toLocaleString()}`, icon: 'check_circle', tone: 'success' },
    { label: 'Due', value: `$${totals.due.toLocaleString()}`, icon: 'schedule', tone: 'secondary' },
    { label: 'Overdue', value: `$${totals.overdue.toLocaleString()}`, icon: 'error', tone: 'danger' },
  ]

  const markPaid = (id) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: 'Paid' } : inv)))
    showToast(`${id} marked as paid.`, 'success')
    setViewInvoice((prev) => (prev?.id === id ? { ...prev, status: 'Paid' } : prev))
  }

  const handleDownload = (invoice) => {
    downloadInvoicePdf(invoice)
    showToast(`${invoice.id} PDF downloaded.`, 'success')
  }

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'Invoice',
        accessorKey: 'id',
        cell: ({ row }) => (
          <div>
            <div className="text-sm font-bold text-text">{row.original.id}</div>
            <div className="text-[10px] font-bold text-muted mt-0.5">{row.original.project}</div>
          </div>
        ),
      },
      {
        id: 'client',
        header: 'Client',
        accessorKey: 'client',
        cell: ({ getValue }) => <span className="text-xs font-semibold text-text">{getValue()}</span>,
      },
      {
        id: 'amount',
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ getValue }) => <span className="text-sm font-bold text-text">{getValue()}</span>,
      },
      {
        id: 'dueDate',
        header: 'Due Date',
        accessorKey: 'dueDate',
        cell: ({ getValue }) => <span className="text-xs font-semibold text-muted">{getValue()}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => <StatusPill tone={statusTone[getValue()]}>{getValue()}</StatusPill>,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setViewInvoice(row.original)
              }}
              className="rounded-full p-2 text-muted hover:bg-surface-2 hover:text-text transition"
              aria-label={`View ${row.original.id}`}
            >
              <Icon name="visibility" className="text-base" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDownload(row.original)
              }}
              className="rounded-full p-2 text-muted hover:bg-surface-2 hover:text-text transition"
              aria-label={`Download ${row.original.id}`}
            >
              <Icon name="download" className="text-base" />
            </button>
            {row.original.status !== 'Paid' && (
              <Button
                variant="outline"
                size="sm"
                icon="check"
                onClick={(e) => {
                  e.stopPropagation()
                  markPaid(row.original.id)
                }}
              >
                Mark Paid
              </Button>
            )}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Finance"
        title="Invoices & payments"
        description="Track billed amounts, outstanding dues, and payment status across every client."
      />

      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <motion.div key={card.label} variants={itemVariants}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants}>
        <div className="rounded-3xl border border-border/80 bg-surface/90 p-5 shadow-soft">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-border/40 select-none">
            <h3 className="font-bold text-text text-base sm:text-lg tracking-tight">All invoices</h3>
            <span className="text-xs font-bold text-muted">{invoices.length} total</span>
          </div>
          <Table
            columns={columns}
            data={invoices}
            onRowClick={(row) => setViewInvoice(row)}
            enableColumnFilters
            globalSearchPlaceholder="Search by invoice, client, or project..."
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-2xl border border-dashed border-border bg-surface-2/30 p-4 flex items-center gap-3">
        <Icon name="info" className="text-muted" />
        <p className="text-xs font-semibold text-muted leading-relaxed">
          Invoices are generated from approved quotations. Head to Quotation View to approve and issue a new one.
        </p>
      </motion.div>

      <Dialog open={!!viewInvoice} onClose={() => setViewInvoice(null)} title={viewInvoice?.id} size="sm">
        {viewInvoice && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <StatusPill tone={statusTone[viewInvoice.status]}>{viewInvoice.status}</StatusPill>
              <span className="text-2xl font-extrabold text-text">{viewInvoice.amount}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold border-t border-border/40 pt-4">
              <div>
                <p className="text-muted">Client</p>
                <p className="mt-0.5 text-text font-bold">{viewInvoice.client}</p>
              </div>
              <div>
                <p className="text-muted">Project</p>
                <p className="mt-0.5 text-text font-bold">{viewInvoice.project}</p>
              </div>
              <div>
                <p className="text-muted">Issue date</p>
                <p className="mt-0.5 text-text font-bold">{viewInvoice.issueDate}</p>
              </div>
              <div>
                <p className="text-muted">Due date</p>
                <p className="mt-0.5 text-text font-bold">{viewInvoice.dueDate}</p>
              </div>
            </div>
            <div className="flex gap-2.5 pt-2 border-t border-border/40">
              <Button variant="outline" className="flex-1" icon="download" onClick={() => handleDownload(viewInvoice)}>
                Download
              </Button>
              {viewInvoice.status !== 'Paid' && (
                <Button className="flex-1" icon="check" onClick={() => markPaid(viewInvoice.id)}>
                  Mark Paid
                </Button>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </motion.div>
  )
}
