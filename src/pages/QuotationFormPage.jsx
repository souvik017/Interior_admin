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

const emptyLine = () => ({ 
  id: uid(), 
  productId: '', 
  name: '',
  description: '', 
  category: '',
  unit: '', 
  qty: 1, 
  rate: 0,
  amount: 0
})

const todayISO = () => new Date().toISOString().slice(0, 10)
const addDaysISO = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const formatMoney = (value) =>
  `${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const catalogByCategory = productCatalog.reduce((acc, product) => {
  ;(acc[product.category] ||= []).push(product)
  return acc
}, {})

const categoryOptions = Object.entries(catalogByCategory).map(([category, items]) => ({
  category,
  count: items.length,
}))

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
  const [selectedCategory, setSelectedCategory] = useState('')

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const updateLine = (id, field, value) =>
    setLines((prev) => prev.map((line) => {
      if (line.id !== id) return line
      const updated = { ...line, [field]: value }
      // Recalculate amount when qty or rate changes
      if (field === 'qty' || field === 'rate') {
        updated.amount = (Number(updated.qty) || 0) * (Number(updated.rate) || 0)
      }
      return updated
    }))

  const selectProduct = (id, productId) => {
    const product = productCatalog.find((p) => p.id === productId)
    setLines((prev) =>
      prev.map((line) =>
        line.id === id
          ? product
            ? { 
                ...line, 
                productId, 
                name: product.name,
                description: product.description || product.name,
                category: product.category,
                unit: product.unit, 
                rate: product.rate,
                qty: 1,
                amount: product.rate
              }
            : { ...line, productId: '', name: '', description: '', category: '', unit: '', rate: 0, amount: 0 }
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

  // Auto-add products when category is selected
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    
    if (!category) return
    
    const items = catalogByCategory[category] || []
    if (items.length === 0) return

    setLines((prev) => {
      const existingProductIds = new Set(prev.map((line) => line.productId).filter(Boolean))
      const itemsToAdd = items.filter((p) => !existingProductIds.has(p.id))

      if (itemsToAdd.length === 0) {
        showToast(`All items from ${category} are already in the list.`, 'warning')
        return prev
      }

      const newLines = itemsToAdd.map((p) => ({
        id: uid(),
        productId: p.id,
        name: p.name,
        description: p.description || p.name,
        category: p.category,
        unit: p.unit,
        qty: 1,
        rate: p.rate,
        amount: p.rate,
      }))

      // Drop the single default blank row if the user hasn't touched it yet
      const base =
        prev.length === 1 && !prev[0].productId && !prev[0].description.trim() ? [] : prev

      showToast(`Added ${newLines.length} item${newLines.length === 1 ? '' : 's'} from ${category}.`, 'success')
      return [...base, ...newLines]
    })

    // Reset the select after adding
    setTimeout(() => setSelectedCategory(''), 100)
  }

  const removeCategoryItems = (category) => {
    const productIdsInCategory = new Set((catalogByCategory[category] || []).map((p) => p.id))
    setLines((prev) => {
      const remaining = prev.filter((line) => !productIdsInCategory.has(line.productId))
      return remaining.length > 0 ? remaining : [emptyLine()]
    })
  }

  // Calculate amounts for all rows
  const rows = useMemo(
    () => lines.map((line) => ({
      ...line,
      amount: (Number(line.qty) || 0) * (Number(line.rate) || 0)
    })),
    [lines],
  )

  // Categories currently represented in the line items
  const activeCategoriesInLines = useMemo(() => {
    const cats = new Set()
    rows.forEach((row) => {
      const product = productCatalog.find((p) => p.id === row.productId)
      if (product) cats.add(product.category)
    })
    return Array.from(cats)
  }, [rows])

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
      lines: validLines.map(({ id, productId, name, description, category, unit, qty, rate, amount }) => ({
        id,
        productId,
        name,
        description,
        category,
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
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="field-shell rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Add from category…</option>
                  {categoryOptions.map(({ category, count }) => (
                    <option key={category} value={category}>
                      {category} ({count} item{count === 1 ? '' : 's'})
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" icon="add" onClick={addLine}>
                  Add line
                </Button>
              </div>
            }
          >
            {/* Category chips — quick way to drop an entire category's items at once */}
            {activeCategoriesInLines.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {activeCategoriesInLines.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/40 px-3 py-1 text-[11px] font-semibold text-muted"
                  >
                    {category}
                    <button
                      onClick={() => removeCategoryItems(category)}
                      className="rounded-full p-0.5 hover:bg-danger/10 hover:text-danger transition"
                      aria-label={`Remove all ${category} items`}
                    >
                      <Icon name="close" className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="overflow-x-auto -mx-2">
              <table className="w-full min-w-[640px] border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-border">
                    <th className="px-2 py-2 w-[22%]">Item</th>
                    <th className="px-2 py-2 w-[14%]">Category</th>
                    <th className="px-2 py-2 w-[12%]">Unit</th>
                    <th className="px-2 py-2 w-[10%]">Qty</th>
                    <th className="px-2 py-2 w-[12%]">Rate</th>
                    <th className="px-2 py-2 w-[14%] text-right">Amount</th>
                    <th className="px-2 py-2 w-[8%]" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-2 py-2 align-top">
                        <div className="space-y-1">
                          <input
                            type="text"
                            placeholder="Item name"
                            value={row.name}
                            onChange={(e) => {
                              updateLine(row.id, 'name', e.target.value)
                              updateLine(row.id, 'description', e.target.value)
                            }}
                            className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                          />
                          {row.description && (
                            <div className="text-[10px] text-muted px-2.5 leading-relaxed">
                              {row.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2 align-top">
                        <input
                          type="text"
                          placeholder="Category"
                          value={row.category}
                          onChange={(e) => updateLine(row.id, 'category', e.target.value)}
                          className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        />
                      </td>
                      <td className="px-2 py-2 align-top">
                        <input
                          type="text"
                          placeholder="Unit"
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