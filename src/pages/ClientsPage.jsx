import { useState } from 'react'
import { motion } from 'framer-motion'
import { clientsData } from '../data/mockData'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/layout/PageHeader'
import { Card, EmptyState, StatusPill } from '../components/ui'
import { Button } from '../components/ui/Button'
import { Input } from '../components/forms/Input'
import { Dialog } from '../components/feedback/Dialog'
import { useToast } from '../components/feedback/Toast'

const statusTone = { Active: 'success', 'On Hold': 'warning', 'Past Client': 'muted' }

export function ClientsPage() {
  const { showToast } = useToast()
  const [clients, setClients] = useState(clientsData)
  const [search, setSearch] = useState('')
  const [activeClient, setActiveClient] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '' })

  const filtered = clients.filter((c) =>
    [c.name, c.company, c.email].some((v) => v.toLowerCase().includes(search.toLowerCase())),
  )

  const handleAddClient = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    setClients((prev) => [
      {
        id: `CL-${String(prev.length + 1).padStart(3, '0')}`,
        name: form.name.trim(),
        company: form.company.trim() || '—',
        email: form.email.trim(),
        phone: form.phone.trim() || '—',
        projects: [],
        status: 'Active',
        since: new Date().getFullYear().toString(),
      },
      ...prev,
    ])
    showToast(`${form.name.trim()} added to clients.`, 'success')
    setForm({ name: '', company: '', email: '', phone: '' })
    setAddOpen(false)
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="CRM"
        title="Clients"
        description="Every client relationship, contact details, and the projects tied to them."
        actions={[
          <Button key="add" variant="primary" size="sm" icon="person_add" onClick={() => setAddOpen(true)}>
            Add Client
          </Button>,
        ]}
      />

      <div className="relative max-w-md">
        <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name, company, or email..."
          className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-2.5 text-sm outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="person_search" title="No clients found" description="Try a different search, or add a new client." />
      ) : (
      <motion.div variants={containerVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((client) => (
          <motion.div key={client.id} variants={itemVariants}>
            <Card onClick={() => setActiveClient(client)} className="h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-extrabold text-primary">
                    {client.name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text truncate">{client.name}</p>
                    <p className="text-xs font-semibold text-muted truncate">{client.company}</p>
                  </div>
                </div>
                <StatusPill tone={statusTone[client.status] || 'muted'}>{client.status}</StatusPill>
              </div>
              <div className="mt-4 space-y-1.5 text-xs font-semibold text-muted border-t border-border/40 pt-3">
                <p className="flex items-center gap-1.5 truncate"><Icon name="mail" className="text-sm" />{client.email}</p>
                <p className="flex items-center gap-1.5"><Icon name="call" className="text-sm" />{client.phone}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {client.projects.length > 0 ? (
                  client.projects.map((p) => (
                    <span key={p} className="rounded-full bg-surface-2 px-2.5 py-0.5 text-[10px] font-bold text-muted">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] font-semibold text-muted/60 italic">No linked projects yet</span>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      )}

      <Dialog open={!!activeClient} onClose={() => setActiveClient(null)} title={activeClient?.name} size="sm">
        {activeClient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <div>
                <p className="text-muted">Company</p>
                <p className="mt-0.5 text-text font-bold">{activeClient.company}</p>
              </div>
              <div>
                <p className="text-muted">Client since</p>
                <p className="mt-0.5 text-text font-bold">{activeClient.since}</p>
              </div>
              <div>
                <p className="text-muted">Email</p>
                <p className="mt-0.5 text-text font-bold truncate">{activeClient.email}</p>
              </div>
              <div>
                <p className="text-muted">Phone</p>
                <p className="mt-0.5 text-text font-bold">{activeClient.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Linked projects</p>
              <div className="flex flex-wrap gap-1.5">
                {activeClient.projects.length > 0 ? (
                  activeClient.projects.map((p) => (
                    <span key={p} className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-bold text-text">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-semibold text-muted italic">None yet</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add new client" size="sm">
        <form onSubmit={handleAddClient} className="space-y-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" icon="person_add">
              Save client
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  )
}
