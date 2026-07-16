import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard, StatusPill } from '../components/ui'
import { Input } from '../components/forms/Input'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { updateProfile } from '../features/auth/authSlice'
import { useToast } from '../components/feedback/Toast'

export function ProfilePage() {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const user = useSelector((state) => state.auth.user)

  const [form, setForm] = useState({
    name: user?.name ?? 'David Chen',
    role: user?.role ?? 'Lead Architect',
    email: user?.email ?? 'architect@atelier.pro',
    phone: user?.phone ?? '+1 (555) 010-2938',
  })

  const initials =
    form.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || 'DA'

  const handleSave = (event) => {
    event.preventDefault()
    dispatch(updateProfile(form))
    showToast('Profile updated successfully.', 'success')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Account"
        title="My profile"
        description="Manage your personal information, role, and contact details."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <motion.div variants={itemVariants}>
          <SectionCard title="Account overview" subtitle="Workspace identity">
            <div className="flex flex-col items-center gap-4 pt-2 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-extrabold text-primary border border-primary/15">
                {initials}
              </div>
              <div>
                <p className="text-lg font-bold text-text">{form.name}</p>
                <p className="text-xs font-semibold text-muted mt-0.5">{form.role}</p>
              </div>
              <StatusPill tone="success">Active Session</StatusPill>
              <div className="w-full border-t border-border/40 pt-4 text-left text-xs font-semibold text-muted space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="mail" className="text-base text-muted" />
                  <span className="truncate">{form.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="call" className="text-base text-muted" />
                  <span>{form.phone}</span>
                </div>
              </div>
            </div>
          </SectionCard>
        </motion.div>

        <motion.div variants={itemVariants} className="min-w-0">
          <SectionCard title="Edit details" subtitle="Personal information form">
            <form onSubmit={handleSave} className="grid gap-4.5 md:grid-cols-2 pt-2">
              <Input
                label="Full name"
                icon="person"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Role"
                icon="badge"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />
              <Input
                label="Email"
                icon="alternate_email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Phone"
                icon="call"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <div className="md:col-span-2 flex justify-end pt-2">
                <Button type="submit" icon="task_alt">
                  Save changes
                </Button>
              </div>
            </form>
          </SectionCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
