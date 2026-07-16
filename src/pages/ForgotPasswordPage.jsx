import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '../components/ui/Icon'
import { Input } from '../components/forms/Input'
import { Button } from '../components/ui/Button'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your account email.')
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-radial flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border bg-glass/75 p-8 shadow-glow backdrop-blur-2xl sm:p-10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-glow">
          <Icon name={sent ? 'mark_email_read' : 'lock_reset'} filled />
        </div>

        {!sent ? (
          <>
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-text">Reset your password</h2>
            <p className="mt-2 text-sm font-semibold text-muted leading-relaxed">
              Enter the email linked to your account. We'll send a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <Input
                label="Email"
                icon="alternate_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@atelier.pro"
                required
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

              <Button type="submit" loading={loading} className="w-full justify-center" iconRight="send">
                Send reset link
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-text">Check your inbox</h2>
            <p className="mt-2 text-sm font-semibold text-muted leading-relaxed">
              If an account exists for <span className="font-bold text-text">{email}</span>, a password reset link is on its way.
            </p>
          </>
        )}

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-primary-soft"
        >
          <Icon name="arrow_back" className="text-base" />
          Back to sign in
        </Link>
      </motion.div>
    </div>
  )
}
