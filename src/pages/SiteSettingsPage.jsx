import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard, StatusPill } from '../components/ui'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Input } from '../components/forms/Input'
import { Dialog } from '../components/feedback/Dialog'
import { useToast } from '../components/feedback/Toast'

const initialSites = [
  { id: 'skyline', name: 'Skyline Penthouse', location: 'New York, NY', manager: 'Rajesh K.', active: true },
  { id: 'zenhub', name: 'Zen Office Hub', location: 'Brooklyn, NY', manager: 'Amit S.', active: true },
  { id: 'luxe', name: 'Luxe Retail', location: 'Malibu, CA', manager: 'Nora P.', active: true },
  { id: 'sunset', name: 'Sunset Villa II', location: 'Malibu, CA', manager: 'Vikram M.', active: false },
]

export function SiteSettingsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [sites, setSites] = useState(initialSites)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: '', location: '', manager: '' })

  const toggleSite = (id) => {
    setSites((prev) => prev.map((site) => (site.id === id ? { ...site, active: !site.active } : site)))
    const site = sites.find((s) => s.id === id)
    showToast(`${site?.name} ${site?.active ? 'paused' : 'activated'}.`, site?.active ? 'warning' : 'success')
  }

  const handleAddSite = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.location.trim()) return
    setSites((prev) => [
      { id: `site-${Date.now()}`, name: form.name.trim(), location: form.location.trim(), manager: form.manager.trim() || 'Unassigned', active: true },
      ...prev,
    ])
    showToast('New site added.', 'success')
    setForm({ name: '', location: '', manager: '' })
    setDialogOpen(false)
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Site Logistics"
        title="Site settings"
        description="Add construction sites, assign site managers, and control which sites are active."
        actions={[
          <Button key="back" variant="outline" size="sm" icon="arrow_back" onClick={() => navigate('/site-manager')}>
            Back to Overview
          </Button>,
          <Button key="add" variant="primary" size="sm" icon="add" onClick={() => setDialogOpen(true)}>
            Add Site
          </Button>,
        ]}
      />

      <motion.div variants={itemVariants}>
        <SectionCard title="All sites" subtitle={`${sites.length} registered sites`}>
          <div className="space-y-3 pt-2">
            {sites.map((site) => (
              <div
                key={site.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface-2/35 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name="location_on" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text truncate">{site.name}</p>
                    <p className="text-xs font-semibold text-muted mt-0.5">{site.location} · Manager: {site.manager}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusPill tone={site.active ? 'success' : 'muted'}>{site.active ? 'Active' : 'Paused'}</StatusPill>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={site.active ? 'pause_circle' : 'play_circle'}
                    onClick={() => toggleSite(site.id)}
                  >
                    {site.active ? 'Pause' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </motion.div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Add new site">
        <form onSubmit={handleAddSite} className="space-y-4">
          <Input
            label="Site name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Harbor View Residence"
            required
          />
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="San Francisco, CA"
            required
          />
          <Input
            label="Site manager"
            value={form.manager}
            onChange={(e) => setForm({ ...form, manager: e.target.value })}
            placeholder="Optional"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" icon="task_alt">
              Save site
            </Button>
          </div>
        </form>
      </Dialog>
    </motion.div>
  )
}
