import { useMemo, useState, useRef, useEffect } from 'react'
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
import { clientsData, allProjects } from '../data/mockData'
import { addQuotation, nextQuotationId } from '../features/quotations/quotationsSlice'

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)

// A single sub-work / line item that lives inside a heading
const emptyItem = () => ({
  id: uid(),
  name: '',
  unit: '',
  qty: 1,
  rate: 0,
  amount: 0,
})

// A heading (e.g. "Colour Work") that holds a list of sub-headings (e.g. "Putty", "Primer", "Painting")
const emptyHeading = () => ({
  id: uid(),
  name: '',
  items: [emptyItem()],
})

const todayISO = () => new Date().toISOString().slice(0, 10)
const addDaysISO = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const formatMoney = (value) =>
  `${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Common units for the dropdown
const commonUnits = [
  'sq ft',
  'sq m',
  'sq yd',
  'sq ft (built-up)',
  'sq m (built-up)',
  'cu ft',
  'cu m',
  'cu yd',
  'ft',
  'm',
  'yd',
  'mm',
  'cm',
  'kg',
  'g',
  'tonne',
  'lb',
  'oz',
  'litre',
  'gallon',
  'pint',
  'quart',
  'hour',
  'day',
  'week',
  'month',
  'year',
  'unit',
  'piece',
  'box',
  'pack',
  'roll',
  'sheet',
  'gal',
  'dozen',
  'pair',
  'set',
  'kit',
  'lot',
  'meter',
  'meter²',
  'meter³',
  'nos',
  'each',
  'per sq ft',
  'per sq m',
  'per ft',
  'per m',
]

// Searchable Unit Dropdown Component
const UnitDropdown = ({ value, onChange, placeholder = 'Unit' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredUnits = useMemo(() => {
    if (!searchTerm.trim()) return commonUnits
    return commonUnits.filter(unit => 
      unit.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleSelect = (unit) => {
    onChange(unit)
    setSearchTerm('')
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setSearchTerm(val)
    setIsOpen(true)
    // If user types a custom value, update the parent
    if (!commonUnits.includes(val) && val.trim()) {
      onChange(val)
    }
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm(value)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 pr-8"
        />
        <button
          type="button"
          onClick={toggleDropdown}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-text transition p-0 flex items-center justify-center"
          aria-label="Toggle unit dropdown"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[180px] max-h-48 overflow-y-auto rounded-lg border border-border bg-white shadow-lg" style={{ top: '100%', left: 0 }}>
          {filteredUnits.length > 0 ? (
            filteredUnits.map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => handleSelect(unit)}
                className="w-full px-3 py-2 text-left text-xs hover:bg-primary/10 transition-colors border-b border-border/20 last:border-0"
              >
                {unit}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-muted">
              No units found. Type to add custom unit.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

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

  const [headings, setHeadings] = useState([emptyHeading()])

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  // ---- Heading level actions ----

  const addHeading = () => setHeadings((prev) => [...prev, emptyHeading()])

  const removeHeading = (headingId) => {
    if (headings.length === 1) {
      showToast('At least one heading is required.', 'warning')
      return
    }
    setHeadings((prev) => prev.filter((heading) => heading.id !== headingId))
  }

  const updateHeadingName = (headingId, name) =>
    setHeadings((prev) => prev.map((heading) => (heading.id === headingId ? { ...heading, name } : heading)))

  // ---- Sub-heading (line item) level actions ----

  const addItem = (headingId) =>
    setHeadings((prev) =>
      prev.map((heading) => (heading.id === headingId ? { ...heading, items: [...heading.items, emptyItem()] } : heading)),
    )

  const removeItem = (headingId, itemId) =>
    setHeadings((prev) =>
      prev.map((heading) => {
        if (heading.id !== headingId) return heading
        if (heading.items.length === 1) {
          showToast('Each heading needs at least one sub-heading.', 'warning')
          return heading
        }
        return { ...heading, items: heading.items.filter((item) => item.id !== itemId) }
      }),
    )

  const updateItem = (headingId, itemId, field, value) =>
    setHeadings((prev) =>
      prev.map((heading) => {
        if (heading.id !== headingId) return heading
        return {
          ...heading,
          items: heading.items.map((item) => {
            if (item.id !== itemId) return item
            const updated = { ...item, [field]: value }
            if (field === 'qty' || field === 'rate') {
              updated.amount = (Number(updated.qty) || 0) * (Number(updated.rate) || 0)
            }
            return updated
          }),
        }
      }),
    )

  // ---- Derived totals ----

  // Recompute amounts live (covers the case where qty/rate come in as strings mid-edit)
  const computedHeadings = useMemo(
    () =>
      headings.map((heading) => {
        const items = heading.items.map((item) => ({
          ...item,
          amount: (Number(item.qty) || 0) * (Number(item.rate) || 0),
        }))
        const headingTotal = items.reduce((sum, item) => sum + item.amount, 0)
        return { ...heading, items, headingTotal }
      }),
    [headings],
  )

  const subtotal = useMemo(
    () => computedHeadings.reduce((sum, heading) => sum + heading.headingTotal, 0),
    [computedHeadings],
  )
  const taxAmount = useMemo(() => subtotal * ((Number(form.taxRate) || 0) / 100), [subtotal, form.taxRate])
  const discount = Number(form.discount) || 0
  const grandTotal = subtotal + taxAmount - discount

  const totalItemCount = computedHeadings.reduce((sum, heading) => sum + heading.items.length, 0)

  const handleSave = () => {
    if (!form.client.trim()) {
      showToast('Please select or enter a client.', 'danger')
      return
    }

    const validHeadings = computedHeadings
      .map((heading) => ({
        ...heading,
        items: heading.items.filter((item) => item.name.trim().length > 0 && Number(item.qty) > 0),
      }))
      .filter((heading) => heading.name.trim().length > 0 && heading.items.length > 0)

    if (validHeadings.length === 0) {
      showToast('Add at least one heading with a valid sub-heading.', 'danger')
      return
    }

    // Flatten for storage/printing while keeping the heading label on each line
    const flatLines = validHeadings.flatMap((heading) =>
      heading.items.map(({ id, name, unit, qty, rate, amount }) => ({
        id,
        heading: heading.name,
        name,
        unit,
        qty: Number(qty) || 0,
        rate: Number(rate) || 0,
        amount,
      })),
    )

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
      headings: validHeadings.map((heading) => ({
        id: heading.id,
        name: heading.name,
        items: heading.items,
        headingTotal: heading.items.reduce((sum, i) => sum + i.amount, 0),
      })),
      lines: flatLines,
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
        description="Type a heading (e.g. Colour Work) then add its sub-headings — totals are calculated automatically."
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
            title="Headings & sub-headings"
            subtitle={`${headings.length} heading${headings.length === 1 ? '' : 's'} · ${totalItemCount} sub-heading${totalItemCount === 1 ? '' : 's'}`}
            action={
              <Button variant="outline" size="sm" icon="add" onClick={addHeading}>
                Add heading
              </Button>
            }
          >
            <div className="space-y-5">
              {computedHeadings.map((heading, headingIndex) => (
                <div
                  key={heading.id}
                  className="rounded-2xl border border-border bg-surface-2/20 p-3 sm:p-4"
                >
                  {/* Heading header — free-text name, e.g. "Colour Work" */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {headingIndex + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Heading name (e.g. Colour Work)"
                      value={heading.name}
                      onChange={(e) => updateHeadingName(heading.id, e.target.value)}
                      className="field-shell min-w-[180px] flex-1 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                    />
                    <span className="whitespace-nowrap text-xs font-bold text-muted">
                      {formatMoney(heading.headingTotal)}
                    </span>
                    <button
                      onClick={() => removeHeading(heading.id)}
                      className="rounded-full p-2 text-muted hover:bg-danger/10 hover:text-danger transition"
                      aria-label="Remove heading"
                    >
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>

                  {/* Sub-headings for this heading */}
                  <div className="overflow-visible -mx-1">
                    <table className="w-full min-w-[560px] border-collapse text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-border">
                          <th className="px-2 py-1.5 w-[36%]">Sub-heading</th>
                          <th className="px-2 py-1.5 w-[16%]">Unit</th>
                          <th className="px-2 py-1.5 w-[14%]">Qty</th>
                          <th className="px-2 py-1.5 w-[16%]">Rate</th>
                          <th className="px-2 py-1.5 w-[14%] text-right">Amount</th>
                          <th className="px-2 py-1.5 w-[8%]" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {heading.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-2 py-1.5">
                              <input
                                type="text"
                                placeholder="e.g. Putty, Primer, Painting…"
                                value={item.name}
                                onChange={(e) => updateItem(heading.id, item.id, 'name', e.target.value)}
                                className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                              />
                            </td>
                            <td className="px-2 py-1.5 relative">
                              <UnitDropdown
                                value={item.unit}
                                onChange={(value) => updateItem(heading.id, item.id, 'unit', value)}
                                placeholder="Unit"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={item.qty}
                                onChange={(e) => updateItem(heading.id, item.id, 'qty', e.target.value)}
                                className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.rate}
                                onChange={(e) => updateItem(heading.id, item.id, 'rate', e.target.value)}
                                className="field-shell w-full rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                              />
                            </td>
                            <td className="px-2 py-1.5 text-right font-bold text-text">
                              {formatMoney(item.amount)}
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <button
                                onClick={() => removeItem(heading.id, item.id)}
                                className="rounded-full p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition"
                                aria-label="Remove sub-heading"
                              >
                                <Icon name="close" className="text-base" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-2 pl-9">
                    <Button variant="ghost" size="sm" icon="add" onClick={() => addItem(heading.id)}>
                      Add sub-heading
                    </Button>
                  </div>
                </div>
              ))}
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
            {/* Per-heading breakdown */}
            {computedHeadings.some((h) => h.name.trim()) && (
              <div className="mb-4 space-y-1.5">
                {computedHeadings
                  .filter((h) => h.name.trim())
                  .map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-xl px-3 py-1.5 text-[11px] font-semibold text-muted"
                    >
                      <span className="truncate">{h.name}</span>
                      <span className="text-text">{formatMoney(h.headingTotal)}</span>
                    </div>
                  ))}
              </div>
            )}

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