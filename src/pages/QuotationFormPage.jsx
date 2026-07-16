import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard } from '../components/ui'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Input } from '../components/forms/Input'
import { Select } from '../components/forms/Select'
import { Textarea } from '../components/forms/Textarea'
import { useToast } from '../components/feedback/Toast'
import { clientsData, allProjects, productCatalog } from '../data/mockData'
import { addQuotation, nextQuotationId } from '../features/quotations/quotationsSlice'

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)

const emptyLine = () => ({ id: uid(), productId: '', description: '', unit: '', qty: 1, rate: 0 })

const todayISO = () => new Date().toISOString().slice(0, 10)
const addDaysISO = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const formatMoney = (value) =>
  `$${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const catalogByCategory = productCatalog.reduce((acc, product) => {
  ;(acc[product.category] ||= []).push(product)
  return acc
}, {})

export function QuotationFormPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const existingQuotations = useSelector((state) => state.quotations.items)

  const [form, setForm] = useState({
    client: '',
    project: '',
    quoteDate: todayISO(),
    validUntil: addDaysISO(14),
    taxRate: 12,
    discount: 0,
    notes: 'Prices are valid for 14 days from the quote date. 50% advance on approval, balance on completion.',
  })
  const [lines, setLines] = useState([emptyLine()])

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const updateLine = (id, field, value) =>
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, [field]: value } : line)))

  const selectProduct = (id, productId) => {
    const product = productCatalog.find((p) => p.id === productId)
    setLines((prev) =>
      prev.map((line) =>
        line.id === id
          ? product
            ? { ...line, productId, description: product.name, unit: product.unit, rate: product.rate }
            : { ...line, productId: '' }
          : line,
      ),
    )
  }

  const addLine = () => setLines((prev) => [...prev, emptyLine()])

  const removeLine = (id) => {
    if (lines.length === 1) {
      showToast('At least one line item is required.', 'warning')
      return
    }
    setLines((prev) => prev.filter((line) => line.id !== id))
  }

  const rows = useMemo(
    () => lines.map((line) => ({ ...line, amount: (Number(line.qty) || 0) * (Number(line.rate) || 0) })),
    [lines],
  )

  const subtotal = useMemo(() => rows.reduce((sum, row) => sum + row.amount, 0), [rows])
  const taxAmount = useMemo(() => subtotal * ((Number(form.taxRate) || 0) / 100), [subtotal, form.taxRate])
  const discount = Number(form.discount) || 0
  const grandTotal = subtotal + taxAmount - discount

  const handleSave = () => {
    if (!form.client.trim()) {
      showToast('Please select or enter a client.', 'danger')
      return
    }
    const validLines = rows.filter((row) => row.description.trim().length > 0 && Number(row.qty) > 0)
    if (validLines.length === 0) {
      showToast('Add at least one valid line item.', 'danger')
      return
    }

    const quotation = {
      id: nextQuotationId(existingQuotations),
      client: form.client,
      project: form.project,
      quoteDate: form.quoteDate,
      validUntil: form.validUntil,
      taxRate: Number(form.taxRate) || 0,
      discount,
      notes: form.notes,
      status: 'Draft',
      lines: validLines.map(({ id, productId, description, unit, qty, rate, amount }) => ({
        id,
        productId,
        description,
        unit,
        qty: Number(qty) || 0,
        rate: Number(rate) || 0,
        amount,
      })),
      subtotal,
      taxAmount,
      grandTotal,
      createdAt: new Date().toISOString(),
    }

    dispatch(addQuotation(quotation))
    showToast(`Quotation ${quotation.id} created.`, 'success')
    navigate(`/quotation-view/${quotation.id}`)
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <PageHeader
        eyebrow="Sales"
        title="Create quotation"
        description="Add line items from the catalog or type custom entries — totals are calculated automatically."
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Left column */}
        <motion.div variants={itemVariants} className="min-w-0 space-y-6">
          <SectionCard title="Customer & quote details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Client"
                required
                value={form.client}
                onChange={(e) => updateForm('client', e.target.value)}
              >
                <option value="">Select a client…</option>
                {clientsData.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Project (optional)"
                value={form.project}
                onChange={(e) => updateForm('project', e.target.value)}
              >
                <option value="">No linked project</option>
                {allProjects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <Input
                label="Quote date"
                type="date"
                value={form.quoteDate}
                onChange={(e) => updateForm('quoteDate', e.target.value)}
              />
              <Input
                label="Valid until"
                type="date"
                value={form.validUntil}
                onChange={(e) => updateForm('validUntil', e.target.value)}
              />
              <Input
                label="Tax rate (%)"
                type="number"
                min="0"
                step="0.1"
                value={form.taxRate}
                onChange={(e) => updateForm('taxRate', e.target.value)}
              />
              <Input
                label="Discount ($)"
                type="number"
                min="0"
                step="1"
                value={form.discount}
                onChange={(e) => updateForm('discount', e.target.value)}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Line items"
            subtitle={`${rows.length} row${rows.length === 1 ? '' : 's'}`}
            action={
              <Button variant="outline" size="sm" icon="add" onClick={addLine}>
                Add line
              </Button>
            }
          >
            <div className="overflow-x-auto -mx-2">
              <table className="w-full min-w-[640px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-border">
                    <th className="px-2 py-2 w-[34%]">Item</th>
                    <th className="px-2 py-2 w-[14%]">Unit</th>
                    <th className="px-2 py-2 w-[12%]">Qty</th>
                    <th className="px-2 py-2 w-[16%]">Rate</th>
                    <th className="px-2 py-2 w-[16%] text-right">Amount</th>
                    <th className="px-2 py-2 w-[8%]" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-2 py-2 align-top">
                        <select
                          value={row.productId}
                          onChange={(e) => selectProduct(row.id, e.target.value)}
                          className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        >
                          <option value="">Custom item…</option>
                          {Object.entries(catalogByCategory).map(([category, items]) => (
                            <optgroup key={category} label={category}>
                              {items.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Description"
                          value={row.description}
                          onChange={(e) => updateLine(row.id, 'description', e.target.value)}
                          className="field-shell mt-1.5 w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        />
                      </td>
                      <td className="px-2 py-2 align-top">
                        <input
                          type="text"
                          placeholder="unit"
                          value={row.unit}
                          onChange={(e) => updateLine(row.id, 'unit', e.target.value)}
                          className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        />
                      </td>
                      <td className="px-2 py-2 align-top">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={row.qty}
                          onChange={(e) => updateLine(row.id, 'qty', e.target.value)}
                          className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        />
                      </td>
                      <td className="px-2 py-2 align-top">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.rate}
                          onChange={(e) => updateLine(row.id, 'rate', e.target.value)}
                          className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        />
                      </td>
                      <td className="px-2 py-2 align-top text-right font-bold text-text">
                        {formatMoney(row.amount)}
                      </td>
                      <td className="px-2 py-2 align-top text-right">
                        <button
                          onClick={() => removeLine(row.id)}
                          className="rounded-full p-2 text-muted hover:bg-danger/10 hover:text-danger transition"
                          aria-label="Remove line"
                        >
                          <Icon name="close" className="text-base" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Notes & terms">
            <Textarea
              rows={4}
              value={form.notes}
              onChange={(e) => updateForm('notes', e.target.value)}
              placeholder="Payment terms, validity, exclusions…"
            />
          </SectionCard>
        </motion.div>

        {/* Right column: summary */}
        <motion.div variants={itemVariants} className="space-y-6">
          <SectionCard title="Summary" className="xl:sticky xl:top-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold">
                <span className="text-muted">Subtotal</span>
                <span className="text-text font-bold">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold">
                <span className="text-muted">Tax ({Number(form.taxRate) || 0}%)</span>
                <span className="text-text font-bold">{formatMoney(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold">
                <span className="text-muted">Discount</span>
                <span className="text-text font-bold">-{formatMoney(discount)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-primary/10 p-5 text-primary border border-primary/15">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-text/80">Grand total</span>
                <span className="text-2xl font-extrabold sm:text-3xl">{formatMoney(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <Button icon="save" onClick={handleSave}>
                Save quotation
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </SectionCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
