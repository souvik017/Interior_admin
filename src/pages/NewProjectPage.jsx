import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import { Icon } from '../components/ui/Icon'
import { SectionCard, StatusPill } from '../components/ui'
import { Input } from '../components/forms/Input'
import { Select } from '../components/forms/Select'
import { Textarea } from '../components/forms/Textarea'
import { Checkbox } from '../components/forms/Checkbox'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/feedback/Toast'
import { teamData } from '../data/mockData'

const projectTypes = ['Residential', 'Commercial', 'Retail', 'Hospitality']

const steps = [
  { id: 1, label: 'Basic Info', icon: 'badge' },
  { id: 2, label: 'Budget & Timeline', icon: 'payments' },
  { id: 3, label: 'Scope & Team', icon: 'groups' },
  { id: 4, label: 'Review', icon: 'fact_check' },
]

export function NewProjectPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    client: '',
    budget: '',
    startDate: '',
    type: 'Residential',
    scope: '',
    team: [],
  })

  const toggleTeamMember = (initials) => {
    setForm((prev) => ({
      ...prev,
      team: prev.team.includes(initials) ? prev.team.filter((t) => t !== initials) : [...prev.team, initials],
    }))
  }

  const stepValid = {
    1: form.name.trim() && form.client.trim(),
    2: form.budget.trim() && form.startDate,
    3: true,
    4: true,
  }

  const goNext = () => {
    if (!stepValid[step]) {
      showToast('Please fill in the required fields before continuing.', 'danger')
      return
    }
    setStep((prev) => Math.min(prev + 1, steps.length))
  }

  const goBack = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleSave = () => {
    showToast(`"${form.name}" was created as a draft project.`, 'success')
    navigate('/project-studio')
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 select-none">
      <PageHeader
        eyebrow="Operations Management"
        title="New project setup"
        description="Configure milestones, define budget parameters, assign teams, and initiate logs."
        actions={[
          <StatusPill key="draft" tone="muted">
            Draft Mode
          </StatusPill>,
        ]}
      />

      {/* Step indicator */}
      <div className="flex items-center rounded-[2rem] border border-border/70 bg-surface/80 p-5 shadow-soft backdrop-blur-xl sm:p-6">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex flex-1 items-center last:flex-none">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              disabled={s.id > step}
              className="flex flex-col items-center gap-1.5 disabled:cursor-not-allowed"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition sm:h-10 sm:w-10 ${
                  s.id < step
                    ? 'bg-primary text-on-primary shadow-sm'
                    : s.id === step
                      ? 'border-2 border-primary bg-surface text-primary'
                      : 'bg-surface-2 text-muted border border-border'
                }`}
              >
                {s.id < step ? <Icon name="check" className="text-base" /> : <Icon name={s.icon} className="text-base" />}
              </span>
              <span className={`hidden text-[10px] font-bold uppercase tracking-wider sm:block ${s.id === step ? 'text-primary' : 'text-muted'}`}>
                {s.label}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 ${s.id < step ? 'bg-primary' : 'bg-surface-3'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Form panel */}
        <motion.div variants={itemVariants} className="min-w-0">
          <SectionCard title={steps[step - 1].label} subtitle={`Step ${step} of ${steps.length}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && (
                  <div className="grid gap-4.5 md:grid-cols-2 pt-2">
                    <div className="md:col-span-2">
                      <Input
                        label="Project name"
                        placeholder="Zen Office Hub"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <Input
                      label="Client name"
                      placeholder="Apex Holdings"
                      value={form.client}
                      onChange={(e) => setForm({ ...form, client: e.target.value })}
                      required
                    />
                    <Select
                      label="Project type"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    >
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-4.5 md:grid-cols-2 pt-2">
                    <Input
                      label="Budget Est."
                      placeholder="$250,000"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      required
                    />
                    <Input
                      label="Start date"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      required
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5 pt-2">
                    <Textarea
                      label="Project Scope Description"
                      rows={5}
                      value={form.scope}
                      onChange={(e) => setForm({ ...form, scope: e.target.value })}
                      placeholder="Describe design milestones, deliverables, raw structural specs, and constraints..."
                    />
                    <div>
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                        Assign team members
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {teamData.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 rounded-2xl border border-border bg-surface-2/30 px-3.5 py-2.5"
                          >
                            <Checkbox
                              label={`${member.name} · ${member.role}`}
                              checked={form.team.includes(member.initials)}
                              onChange={() => toggleTeamMember(member.initials)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3 pt-2">
                    {[
                      ['Project name', form.name || '—'],
                      ['Client', form.client || '—'],
                      ['Type', form.type],
                      ['Budget', form.budget || '—'],
                      ['Start date', form.startDate || '—'],
                      ['Team assigned', form.team.length ? form.team.join(', ') : 'None'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold">
                        <span className="text-muted">{label}</span>
                        <span className="text-text font-bold text-right">{value}</span>
                      </div>
                    ))}
                    {form.scope && (
                      <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Scope</p>
                        <p className="text-xs font-semibold text-text leading-relaxed">{form.scope}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-5">
              <Button variant="outline" icon="arrow_back" onClick={goBack} disabled={step === 1}>
                Back
              </Button>
              {step < steps.length ? (
                <Button iconRight="arrow_forward" onClick={goNext}>
                  Continue
                </Button>
              ) : (
                <Button icon="task_alt" onClick={handleSave}>
                  Save Project
                </Button>
              )}
            </div>
          </SectionCard>
        </motion.div>

        {/* Sidebar checklist & summaries */}
        <motion.div variants={itemVariants} className="space-y-6">
          <SectionCard title="Setup Readiness Checklist" subtitle="Initial validation controls">
            <div className="space-y-3 pt-2">
              {[
                { label: 'Assign architectural design lead', done: form.team.length > 0 },
                { label: 'Upload baseline floor layout blueprints', done: false },
                { label: 'Confirm initial estimated budget thresholds', done: !!form.budget.trim() },
                { label: 'Establish first phase milestone schedule', done: !!form.startDate },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-border bg-surface-2/30 px-4 py-3 text-xs sm:text-sm font-semibold"
                >
                  <div className="min-w-0 pr-3">
                    <p className="text-text font-bold leading-normal truncate">{item.label}</p>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-0.5">Verification Step {index + 1}</p>
                  </div>
                  <div className="shrink-0">
                    <StatusPill tone={item.done ? 'success' : 'muted'}>{item.done ? 'Done' : 'Pending'}</StatusPill>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="rounded-3xl bg-navy-deep p-6 text-white shadow-soft relative overflow-hidden select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(175,16,26,0.3),transparent_60%)]" />
            <div className="relative z-10 flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Icon name="info" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Next Step Actions</p>
                <h4 className="mt-2 text-base font-bold text-white tracking-tight leading-snug">Draft setup validation is active.</h4>
                <p className="mt-2 text-xs font-semibold text-white/70 leading-relaxed">
                  Saving this draft saves configurations to client storage. Once reviewed by PM, synchronizations route directly to operational pipelines.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
