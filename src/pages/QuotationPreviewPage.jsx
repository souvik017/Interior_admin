import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard, StatusPill, EmptyState } from '../components/ui'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/Toast'
import { updateQuotationStatus } from '../features/quotations/quotationsSlice'
import { downloadQuotationPdf } from '../utils/quotationPdf'

const statusTone = { Draft: 'muted', Sent: 'warning', Approved: 'success', Rejected: 'danger' }

const formatMoney = (value) =>
  `$${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function QuotationPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const quotation = useSelector((state) => state.quotations.items.find((q) => q.id === id))

  if (!quotation) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Sales" title="Quotation not found" />
        <EmptyState
          icon="request_quote"
          title="No quotation with this ID"
          description="It may have been created in a previous session that didn't persist, or the link is incorrect."
          action={
            <Button icon="add" onClick={() => navigate('/quotation-new')}>
              Create a quotation
            </Button>
          }
        />
      </div>
    )
  }

  const handleDownload = () => {
    downloadQuotationPdf(quotation)
    showToast(`${quotation.id} PDF downloaded.`, 'success')
  }

  const setStatus = (status) => {
    dispatch(updateQuotationStatus({ id: quotation.id, status }))
    showToast(`${quotation.id} marked as ${status}.`, status === 'Approved' ? 'success' : 'info')
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <PageHeader
        eyebrow="Sales"
        title={quotation.id}
        description={`Prepared for ${quotation.client}${quotation.project ? ` · ${quotation.project}` : ''}`}
        actions={<StatusPill tone={statusTone[quotation.status]}>{quotation.status}</StatusPill>}
      />

      <div data-print-area>
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <motion.div variants={itemVariants} className="min-w-0">
            <SectionCard title="Line items" subtitle={`Valid until ${quotation.validUntil}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-surface-2/60 text-[10px] font-bold uppercase tracking-wider text-muted border-b border-border">
                      <th className="px-5 py-3">Description</th>
                      <th className="px-5 py-3">Unit</th>
                      <th className="px-5 py-3">Qty</th>
                      <th className="px-5 py-3">Rate</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {quotation.lines.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-2/20 transition">
                        <td className="px-5 py-3.5 text-text font-bold leading-relaxed">{item.description}</td>
                        <td className="px-5 py-3.5 text-muted font-semibold">{item.unit || '—'}</td>
                        <td className="px-5 py-3.5 text-muted font-semibold">{item.qty}</td>
                        <td className="px-5 py-3.5 text-muted font-semibold">{formatMoney(item.rate)}</td>
                        <td className="px-5 py-3.5 text-right font-bold text-text">{formatMoney(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {quotation.notes && (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface-2/30 p-4 text-xs font-semibold text-muted leading-relaxed">
                  {quotation.notes}
                </div>
              )}
            </SectionCard>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <SectionCard title="Financial summary">
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-text font-bold">{formatMoney(quotation.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold">
                  <span className="text-muted">Tax ({quotation.taxRate}%)</span>
                  <span className="text-text font-bold">{formatMoney(quotation.taxAmount)}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold">
                  <span className="text-muted">Discount</span>
                  <span className="text-text font-bold">-{formatMoney(quotation.discount)}</span>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-primary/10 p-5 text-primary border border-primary/15">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-text/80">Grand total</span>
                  <span className="text-2xl font-extrabold sm:text-3xl">{formatMoney(quotation.grandTotal)}</span>
                </div>
              </div>
            </SectionCard>
          </motion.div>
        </div>
      </div>

      <div className="no-print flex flex-wrap items-center justify-end gap-3 border-t border-border/40 pt-5">
        <Link to="/quotation-new">
          <Button variant="outline" size="sm" icon="add">
            New quotation
          </Button>
        </Link>
        <Button variant="outline" size="sm" icon="print" onClick={() => window.print()}>
          Print
        </Button>
        <Button variant="outline" size="sm" icon="download" onClick={handleDownload}>
          Download PDF
        </Button>
        {quotation.status !== 'Approved' && (
          <Button variant="primary" size="sm" icon="task_alt" onClick={() => setStatus('Approved')}>
            Approve
          </Button>
        )}
      </div>
    </motion.div>
  )
}
