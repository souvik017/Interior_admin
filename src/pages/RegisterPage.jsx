import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginSuccess } from '../features/auth/authSlice'
import { Icon } from '../components/ui/Icon'
import { Input } from '../components/forms/Input'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/forms/Checkbox'

export function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!agree) {
      setError('Please accept the terms to continue.')
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch(
      loginSuccess({
        user: {
          name: form.name.trim(),
          role: 'Team Member',
          email: form.email.trim(),
          rememberMe: true,
        },
        token: 'atelier-demo-token',
      }),
    )

    setLoading(false)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-radial flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-tertiary/10 blur-3xl"
        />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-border bg-glass/75 shadow-glow backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]"
      >
        {/* Left Side Form Panel */}
        <section className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center sm:text-left select-none">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-muted">
                Create Workspace Access
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text">
                Create your account
              </h2>
              <p className="mt-2 text-sm font-semibold text-muted">
                Set up workspace access to manage projects and sites.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full name"
                icon="person"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sarah Jenkins"
                required
              />

              <Input
                label="Email"
                icon="alternate_email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@atelier.pro"
                required
              />

              <div className="space-y-1.5 w-full">
                <label className="block text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
                  Password
                </label>
                <div className="relative">
                  <Icon
                    name="lock"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full rounded-2xl border border-border/80 bg-surface-2/50 pl-11 pr-12 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10 focus:bg-surface"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition hover:text-text"
                  >
                    <Icon name={showPassword ? 'visibility_off' : 'visibility'} />
                  </button>
                </div>
              </div>

              <Input
                label="Confirm password"
                icon="lock"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
              />

              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-xs font-semibold text-danger flex items-center gap-2"
                >
                  <Icon name="error" />
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                loading={loading}
                className="w-full justify-center mt-2"
                iconRight="arrow_forward"
              >
                Create account
              </Button>

              <p className="text-center text-xs font-semibold text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:text-primary-soft">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </section>

        {/* Right Side Panel */}
        <section className="relative flex min-h-[580px] flex-col justify-between overflow-hidden bg-navy-deep p-10 text-white select-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(175,16,26,0.45),transparent_45%)]" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-glow">
              <Icon name="architecture" filled />
            </div>
            <div>
              <p className="text-2xl font-extrabold tracking-tight">Atelier Pro</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                Interior Project Studio
              </p>
            </div>
          </div>

          <div className="relative z-10 my-auto max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/60">
              Join The Studio
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight leading-tight sm:text-5xl">
              One workspace for design, site logistics, and client approvals.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              Create your account to start tracking projects, syncing site logs, and managing procurement alongside your team.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-4 gap-3 border-t border-white/10 pt-6">
            {[
              ['48', 'Projects'],
              ['12', 'Sites'],
              ['91%', 'Delivery'],
              ['24h', 'Sync'],
            ].map(([value, label]) => (
              <div key={label} className="text-left">
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/55">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  )
}
