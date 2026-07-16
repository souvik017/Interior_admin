import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Icon } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center select-none px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 220 }}
        className="flex flex-col items-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/15">
          <Icon name="explore_off" className="text-4xl" />
        </div>
        <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-text sm:text-6xl">404</h1>
        <h2 className="mt-2 text-xl font-bold text-text sm:text-2xl">Page not found</h2>
        <p className="mt-2 max-w-md text-sm font-semibold text-muted leading-relaxed">
          The page you're looking for doesn't exist or may have been moved. Check the URL, or head back to your dashboard.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" icon="arrow_back" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button icon="dashboard" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
