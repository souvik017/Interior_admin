import { useState } from 'react'
import { motion } from 'framer-motion'
import { vendorsData } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { Card, EmptyState, StatusPill } from '../components/ui'
import { Button } from '../components/ui/Button'
import { Input } from '../components/forms/Input'
import { Select } from '../components/forms/Select'
import { Dialog } from '../components/feedback/Dialog'
import { useToast } from '../components/feedback/Toast'

const categories = ['Marble & Stone', 'Lighting', 'Hardware & Fittings', 'Fixtures', 'Wood & Veneer']

function RatingStars({ value }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          filled={n <= Math.round(value)}
          className={`text-[15px] ${n <= Math.round(value) ? 'text-amber-500' : 'text-border'}`}
        />
      ))}
      <span className="ml-1 text-[11px] font-bold text-muted">{value.toFixed(1)}</span>
    </div>
  )
}

export function VendorsPage() {
  const { showToast } = useToast()
  const [vendors, setVendors] = useState(vendorsData)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', category: categories[0], contact: '', email: '' })

  const filtered = categoryFilter === 'All' ? vendors : vendors.filter((v) => v.category === categoryFilter)

  const handleAddVendor = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.contact.trim()) return
    setVendors((prev) => [
      {
        id: `VN-${String(prev.length + 1).padStart(2, '0')}`,
        name: form.name.trim(),
        category: form.category,
        contact: form.contact.trim(),
        email: form.email.trim() || '—',
        phone: '—',
        rating: 0,
        leadTime: 'TBD',
        status: 'Active',
      },
      ...prev,
    ])
    showToast(`${form.name.trim()} added to vendor directory.`, 'success')
    setForm({ name: '', category: categories[0], contact: '', email: '' })
    setAddOpen(false)
  }

  const toggleStatus = (id) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: v.status === 'Active' ? 'Inactive' : 'Active' } : v)),
    )
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Procurement"
        title="Vendor directory"
        description="Suppliers, contacts, lead times, and ratings for every material category."
        actions={[
          <Button key="add" variant="primary" size="sm" icon="add_business" onClick={() => setAddOpen(true)}>
            Add Vendor
          </Button>,
        ]}
      />

      <div className="flex flex-wrap items-center gap-2">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              categoryFilter === cat
                ? 'bg-primary text-on-primary shadow-sm'
                : 'border border-border bg-surface text-muted hover:text-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="storefront" title="No vendors found" description="Try a different category filter, or add a new vendor." />
      ) : (
      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vendor) => (
          <motion.div key={vendor.id} variants={itemVariants}>
            <Card className="h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text truncate">{vendor.name}</p>
                  <p className="text-xs font-semibold text-muted mt-0.5">{vendor.category}</p>
                </div>
                <StatusPill tone={vendor.status === 'Active' ? 'success' : 'muted'}>{vendor.status}</StatusPill>
              </div>
              <div className="mt-3">
                <RatingStars value={vendor.rating} />
              </div>
              <div className="mt-3 space-y-1.5 text-xs font-semibold text-muted border-t border-border/40 pt-3">
                <p className="flex items-center gap-1.5"><Icon name="person" className="text-sm" />{vendor.contact}</p>
                <p className="flex items-center gap-1.5 truncate"><Icon name="mail" className="text-sm" />{vendor.email}</p>
                <p className="flex items-center gap-1.5"><Icon name="call" className="text-sm" />{vendor.phone}</p>
                <p className="flex items-center gap-1.5"><Icon name="schedule" className="text-sm" />Lead time: {vendor.leadTime}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center mt-4"
                icon={vendor.status === 'Active' ? 'block' : 'check_circle'}
                onClick={() => toggleStatus(vendor.id)}
              >
                {vendor.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}
              </Button>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      )}

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add new vendor" size="sm">
        <form onSubmit={handleAddVendor} className="space-y-4">
          <Input label="Vendor name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Input label="Contact person" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" icon="add_business">
              Save vendor
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  )
}
