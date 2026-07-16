import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../components/ui/Icon'
import { SectionCard, StatusPill } from '../components/ui'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/Toast'

const quotationSectionsData = [
  {
    id: 'civil',
    title: 'Civil Works',
    items: [
      { description: 'Premium Micro-topping Flooring', quantity: '1,200 sq. ft', unitPrice: '$15.00', amount: '$18,000.00' },
      { description: 'Anti-bacterial Wall Prep', quantity: '3,450 sq. ft', unitPrice: '$2.50', amount: '$8,625.00' },
      { description: 'Structural Modification', quantity: '1.0 L.S.', unitPrice: '$4,200.00', amount: '$4,200.00' },
    ],
  },
  {
    id: 'electrical',
    title: 'Electrical & Smart Home',
    subtitle: '2026 TECH STACK',
    items: [
      { description: 'IoT Backbone Integration', quantity: '1 Set', unitPrice: '$3,500.00', amount: '$3,500.00' },
      { description: 'Smart Ambient Lighting System', quantity: '18 Zones', unitPrice: '$120.00', amount: '$2,160.00' },
      { description: 'EV Charging Point Infrastructure', quantity: '1 Unit', unitPrice: '$1,850.00', amount: '$1,850.00' },
    ],
  },
  {
    id: 'furniture',
    title: 'Furniture & Finishes',
    items: [
      { description: 'Modular Kitchen (HDF)', quantity: '1', unitPrice: '$14,200.00', amount: '$14,200.00' },
      { description: 'Custom Wardrobes', quantity: '1', unitPrice: '$1,500.00', amount: '$1,500.00' },
      { description: 'Sustainability Surcharge', quantity: '1', unitPrice: '$1,500.00', amount: '$1,500.00' },
    ],
  },
]

const summaryRows = [
  { label: 'Civil Works', value: '$30,825.00' },
  { label: 'Electrical & Smart Home', value: '$2,100.00' },
  { label: 'Furniture & Finishes', value: '$24,200.00' },
  { label: 'Supervision Fee (12%)', value: '$7,504.20' },
]

const totalInvestment = '$70,039.20'

export function QuotationViewPage() {
  const { showToast } = useToast()
  const [approved, setApproved] = useState(false)

  // Collapsible section states
  const [collapsedSections, setCollapsedSections] = useState({
    civil: false,
    electrical: false,
    furniture: false,
  })

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('Quote link copied to clipboard.', 'success')
    } catch {
      showToast('Could not copy link. Please copy the URL manually.', 'danger')
    }
  }

  const handleApprove = () => {
    setApproved(true)
    showToast('Quote approved and sent for processing.', 'success')
  }

  const toggleSection = (id) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
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
      <div data-print-area>
      {/* Detail header banner */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-border bg-surface p-6 shadow-soft relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-text sm:text-3xl">Detailed project quotation</h1>
            <div className="mt-2 flex items-start gap-2 text-xs font-semibold text-muted leading-relaxed">
              <Icon name="lightbulb" className="mt-0.5 text-amber-500 shrink-0" />
              <p>
                <span className="font-bold text-text">AI Cost Optimization Suggestion:</span>{' '}
                Switching to the "ScalableBy Surcharge" carbon-neutral materials qualities this project for a{' '}
                <span className="font-bold text-primary">$1,200 Green Building tax credit</span> in the 2026 fiscal year.
              </p>
            </div>
          </div>
          <div className="flex shrink-0">
            <StatusPill tone="primary">Processed to Payment & Sync</StatusPill>
          </div>
        </div>
      </motion.div>

      {/* Main layout */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Left side: sections list */}
        <motion.div variants={itemVariants} className="min-w-0">
          <SectionCard title="Quotation Items Breakdown" subtitle="Project pricing sheets">
            <div className="space-y-6 pt-2">
              {quotationSectionsData.map((section) => {
                const isCollapsed = collapsedSections[section.id]
                return (
                  <div key={section.id} className="border border-border/70 rounded-3xl overflow-hidden bg-surface-2/10">
                    {/* Collapsible toggle header button */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-surface-2/30 select-none border-b border-border/40"
                    >
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="text-sm font-bold text-text truncate sm:text-base">{section.title}</span>
                        {section.subtitle && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-muted shrink-0">
                            {section.subtitle}
                          </span>
                        )}
                      </div>
                      <Icon
                        name={isCollapsed ? 'expand_more' : 'expand_less'}
                        className="text-muted transition-transform"
                      />
                    </button>

                    {/* Table drawer animation */}
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
                              <thead>
                                <tr className="bg-surface-2/60 text-[10px] font-bold uppercase tracking-wider text-muted border-b border-border">
                                  <th className="px-5 py-3">Description</th>
                                  <th className="px-5 py-3">Quantity</th>
                                  <th className="px-5 py-3">Unit Price</th>
                                  <th className="px-5 py-3 text-right">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60">
                                {section.items.map((item) => (
                                  <tr key={item.description} className="hover:bg-surface-2/20 transition">
                                    <td className="px-5 py-3.5 text-text font-bold leading-relaxed">{item.description}</td>
                                    <td className="px-5 py-3.5 text-muted font-semibold">{item.quantity}</td>
                                    <td className="px-5 py-3.5 text-muted font-semibold">{item.unitPrice}</td>
                                    <td className="px-5 py-3.5 text-right font-bold text-text">{item.amount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </motion.div>

        {/* Right side: summaries */}
        <motion.div variants={itemVariants} className="space-y-6">
          <SectionCard title="Financial Summary">
            <div className="space-y-2">
              {summaryRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold"
                >
                  <span className="text-muted">{row.label}</span>
                  <span className="text-text font-bold">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Final aggregate total */}
            <div className="mt-5 rounded-2xl bg-primary/10 p-5 text-primary border border-primary/15 shadow-sm relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-full blur-xl" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-text/80">
                  Total Investment
                </span>
                <span className="text-2xl font-extrabold sm:text-3xl">{totalInvestment}</span>
              </div>
              <p className="mt-1 text-right text-[10px] font-bold text-muted uppercase tracking-wider">Taxes &amp; Sync Fees Included</p>
            </div>

            <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2 text-text">
                <Icon name="check_circle" className="text-primary text-base" />
                Processed to Payment &amp; Sync
              </div>
              <StatusPill tone="success">Live</StatusPill>
            </div>
          </SectionCard>

          {/* Suitable choice card detail */}
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted select-none">Sourced Material Audits</p>
            <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs sm:text-sm font-semibold">
              <span className="text-muted font-semibold">Modular Kitchen (HDF)</span>
              <span className="text-right text-text font-bold">$14,200.00</span>
              <span className="text-muted font-semibold">Custom Wardrobes</span>
              <span className="text-right text-text font-bold">$1,500.00</span>
              <span className="text-muted font-semibold">Sustainability Surcharge</span>
              <span className="text-right text-text font-bold">$1,500.00</span>
            </div>
            <div className="mt-4 rounded-2xl bg-primary/5 p-3 text-center text-[10px] sm:text-xs font-semibold text-muted leading-relaxed select-none border border-primary/5">
              <span className="text-primary font-bold">Sustainability Sourced certification</span> — approved and verified
            </div>
          </div>
        </motion.div>
      </div>
      </div>

      {/* Action buttons footer */}
      <div className="no-print flex flex-wrap items-center justify-end gap-3 border-t border-border/40 pt-5">
        <Button variant="outline" size="sm" icon="print" onClick={() => window.print()}>
          Print / Export PDF
        </Button>
        <Button variant="outline" size="sm" icon="share" onClick={handleShare}>
          Share Quote
        </Button>
        {approved ? (
          <StatusPill tone="success">Approved</StatusPill>
        ) : (
          <Button variant="primary" size="sm" icon="task_alt" onClick={handleApprove}>
            Approve Quote
          </Button>
        )}
      </div>
    </motion.div>
  )
}