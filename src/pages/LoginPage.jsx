import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginSuccess } from '../features/auth/authSlice'

const BG_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCqlvZBVpOBW4OpN6y9j93LEbS6J6Rz48NAvVhZv7LfnWUM-aU9r3JaipZBEJKOhUCKWRJC7cjVTU3Hg3i2ryBOMXcs1vJ8q0utcYzD_hTHkNpAHgkeiJ8F210Ufah0mMaEyMLNsNnD0h8-YOqMuw2RnWImJ7sLD1MRyjeqLaH2FS-tO9KKsGJAhRDWY8A18kfs9QL7sDYILKUZFxUnRYxsKuQZhAMxgDnA_04g6czBO_02opgcW_rO6A0wCj3vRZS8nQiSKL7E8q4'

/**
 * Loads the Google Fonts + Material Symbols stylesheets once, the same way
 * the static HTML mockup pulls them in via <link> tags in <head>.
 * If your app already loads these globally (e.g. in index.html), you can
 * delete this hook and the two href constants above it.
 */
function useMockupFonts() {
  useEffect(() => {
    const links = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
      'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    ]
    const created = []
    links.forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
      created.push(link)
    })
    return () => created.forEach((l) => l.remove())
  }, [])
}

function Icon({ name, className = '', filled = false, style = {} }) {
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
    >
      {name}
    </span>
  )
}

export function LoginPage() {
  useMockupFonts()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [identity, setIdentity] = useState('architect@atelier.pro')
  const [password, setPassword] = useState('atelier123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // subtle parallax on the background image, same as the mockup's <script>
  useEffect(() => {
    const bg = document.getElementById('atelier-bg-image')
    if (!bg) return
    const handleMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.005
      const moveY = (e.clientY - window.innerHeight / 2) * 0.005
      bg.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!identity.trim() || !password.trim()) {
      setError('Please enter both email/mobile and password.')
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    dispatch(
      loginSuccess({
        user: {
          name: 'David Chen',
          role: 'Lead Architect',
          email: identity.trim(),
          rememberMe,
        },
        token: 'atelier-demo-token',
      }),
    )

    setLoading(false)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto flex items-center justify-center"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background image, scaled to always cover the viewport at any zoom level */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div
          id="atelier-bg-image"
          className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-200 ease-out"
          style={{ backgroundImage: `url('${BG_IMAGE_URL}')` }}
        />
        <div className="absolute inset-0 bg-[#001A43]/10 backdrop-blur-[2px]" />
      </div>

      {/* Login card */}
      <main className="relative z-10 w-[92%] xs:w-full max-w-md mx-auto px-[4vw] py-[6vh] sm:px-0">
        <div
          className="rounded-[clamp(1rem,3vw,1.5rem)] p-[clamp(1.25rem,5vw,2.5rem)] flex flex-col items-center border border-white/40"
          style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Logo */}
          <div className="mb-[clamp(1.5rem,4vw,2.5rem)] text-center w-full">
            <div className="flex items-center justify-center mb-2 gap-2">
              <Icon
                name="architecture"
                filled
                className="text-[#af101a] text-[clamp(1.75rem,4vw,2.25rem)]"
              />
              <h1 className="font-semibold text-[clamp(1.1rem,3.5vw,1.5rem)] leading-tight text-[#191c1d] tracking-tight">
                Atelier Pro
              </h1>
            </div>
            <p className="text-[clamp(0.75rem,2vw,0.875rem)] text-[#546067]">
              Advanced Interior Project Studio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-[clamp(1rem,3vw,1.5rem)]">
            {/* Email / Mobile */}
            <div className="space-y-2">
              <label
                htmlFor="identity"
                className="block uppercase tracking-widest text-[11px] font-semibold text-[#5b403d]"
              >
                Email or Mobile
              </label>
              <div className="relative group">
                <Icon
                  name="alternate_email"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#546067] text-[20px] group-focus-within:text-[#af101a] transition-colors"
                />
                <input
                  id="identity"
                  name="identity"
                  type="text"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="architect@atelier.pro"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-lg bg-[#f3f4f5] border border-[#ECEFF1] focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] focus:bg-white outline-none transition-all text-[15px] text-[#191c1d]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block uppercase tracking-widest text-[11px] font-semibold text-[#5b403d]"
              >
                Password
              </label>
              <div className="relative group">
                <Icon
                  name="lock"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#546067] text-[20px] group-focus-within:text-[#af101a] transition-colors"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 pl-10 pr-12 rounded-lg bg-[#f3f4f5] border border-[#ECEFF1] focus:border-[#af101a] focus:ring-1 focus:ring-[#af101a] focus:bg-white outline-none transition-all text-[15px] text-[#191c1d]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#546067] hover:text-[#191c1d] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#ECEFF1] text-[#af101a] focus:ring-[#af101a]"
                />
                <span className="ml-2 text-[13px] text-[#546067] group-hover:text-[#191c1d] transition-colors">
                  Remember Me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-[13px] text-[#af101a] hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-[#ba1a1a]/20 bg-[#ffdad6]/40 px-4 py-3 text-xs font-semibold text-[#ba1a1a] flex items-center gap-2">
                <Icon name="error" className="text-[18px]" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#d32f2f] text-white font-semibold text-[16px] rounded-lg shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.96] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </>
              )}
            </button>

            <p className="text-center text-[13px] text-[#546067]">
              Not a member yet?{' '}
              <Link to="/register" className="text-[#af101a] font-semibold hover:underline">
                Apply for Workspace
              </Link>
            </p>
          </form>
        </div>

        {/* Footer links */}
        <div className="mt-[clamp(1rem,3vw,2rem)] flex justify-center flex-wrap gap-x-6 gap-y-2 text-center">
          <a className="text-[11px] font-medium text-white/70 hover:text-white transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-[11px] font-medium text-white/70 hover:text-white transition-colors" href="#">
            Terms of Service
          </a>
          <a className="text-[11px] font-medium text-white/70 hover:text-white transition-colors" href="#">
            Support
          </a>
        </div>
      </main>
    </div>
  )
}

export default LoginPage