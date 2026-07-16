import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import { SectionCard, StatusPill } from '../components/ui'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { Checkbox } from '../components/forms/Checkbox'
import { Tabs } from '../components/navigation/Tabs'
import { useToast } from '../components/feedback/Toast'

const tabs = [
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'team', label: 'Team & Roles', icon: 'groups' },
]

const notificationChannels = [
  { key: 'materialRequests', label: 'Material requests', description: 'New purchase requests awaiting review' },
  { key: 'budgetAlerts', label: 'Budget alerts', description: 'When a project trends over estimated cost' },
  { key: 'siteIssues', label: 'Urgent site issues', description: 'Safety, delay, or shortage flags from site managers' },
  { key: 'clientApprovals', label: 'Client approvals', description: 'When a client approves or comments on a quote' },
]

const roleRows = [
  { role: 'Lead Architect', permissions: 'Full access — all projects, approvals, and settings', count: 2 },
  { role: 'Project Manager', permissions: 'Manage assigned projects, approve purchases up to $50k', count: 4 },
  { role: 'Site Engineer', permissions: 'Update site logs, tasks, and QC photos', count: 6 },
  { role: 'Procurement Lead', permissions: 'Manage vendors and purchase requests', count: 3 },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('notifications')
  const [channels, setChannels] = useState({
    materialRequests: true,
    budgetAlerts: true,
    siteIssues: true,
    clientApprovals: false,
  })
  const [twoFactor, setTwoFactor] = useState(false)

  const toggleChannel = (key) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveNotifications = () => {
    showToast('Notification preferences saved.', 'success')
  }

  const handleToggle2FA = () => {
    setTwoFactor((prev) => !prev)
    showToast(twoFactor ? 'Two-factor authentication disabled.' : 'Two-factor authentication enabled.', twoFactor ? 'warning' : 'success')
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Manage notification preferences, security, and team roles for the whole studio."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'My Profile', desc: 'Name, role, and contact info', icon: 'person', to: '/profile' },
          { label: 'Site Settings', desc: 'Add and manage construction sites', icon: 'location_on', to: '/site-settings' },
          { label: 'Team Directory', desc: 'View every staff member', icon: 'groups', to: '/team' },
        ].map((item) => (
          <motion.button
            key={item.label}
            variants={itemVariants}
            onClick={() => navigate(item.to)}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-soft hover:-translate-y-0.5 hover:shadow-md transition-all"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon name={item.icon} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text">{item.label}</p>
              <p className="text-xs font-semibold text-muted truncate">{item.desc}</p>
            </div>
            <Icon name="chevron_right" className="ml-auto text-muted shrink-0" />
          </motion.button>
        ))}
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <motion.div variants={itemVariants}>
        {activeTab === 'notifications' && (
          <SectionCard title="Notification preferences" subtitle="Choose what you get notified about">
            <div className="space-y-3 pt-2">
              {notificationChannels.map((channel) => (
                <div
                  key={channel.key}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface-2/30 px-4 py-3.5"
                >
                  <Checkbox
                    label={channel.label}
                    description={channel.description}
                    checked={channels[channel.key]}
                    onChange={() => toggleChannel(channel.key)}
                  />
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <Button icon="task_alt" onClick={handleSaveNotifications}>
                  Save preferences
                </Button>
              </div>
            </div>
          </SectionCard>
        )}

        {activeTab === 'security' && (
          <SectionCard title="Security" subtitle="Protect your workspace account">
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-2/30 p-4">
                <div>
                  <p className="text-sm font-bold text-text">Two-factor authentication</p>
                  <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">
                    Require a verification code in addition to your password when signing in.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusPill tone={twoFactor ? 'success' : 'muted'}>{twoFactor ? 'Enabled' : 'Disabled'}</StatusPill>
                  <Button variant="outline" size="sm" onClick={handleToggle2FA}>
                    {twoFactor ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
                <p className="text-sm font-bold text-text">Active session</p>
                <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">
                  You're signed in on this device. Use the Logout action in the sidebar to end this session.
                </p>
              </div>
            </div>
          </SectionCard>
        )}

        {activeTab === 'team' && (
          <SectionCard
            title="Roles & permissions"
            subtitle="What each role can access"
            action={
              <Button variant="outline" size="sm" icon="groups" onClick={() => navigate('/team')}>
                View Team Directory
              </Button>
            }
          >
            <div className="space-y-3 pt-2">
              {roleRows.map((row) => (
                <div key={row.role} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-2/30 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text">{row.role}</p>
                    <p className="mt-1 text-xs font-semibold text-muted leading-relaxed">{row.permissions}</p>
                  </div>
                  <StatusPill tone="primary">{row.count} members</StatusPill>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </motion.div>
    </motion.div>
  )
}
