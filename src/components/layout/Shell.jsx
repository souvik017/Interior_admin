import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '../ui/Icon'
import { Tooltip } from '../ui/Tooltip'
import { Button } from '../ui/Button'
import { useTheme } from '../../theme/ThemeContext'
import { themeOptions } from '../../theme/colors'
import { logout } from '../../features/auth/authSlice'
import { sidebarLinks, quickLinks, dashboardNotifications } from '../../data/mockData'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function SectionLabel({ label, compact = false }) {
  if (compact) return <div className="my-2 border-t border-border/60" />
  return (
    <p className="mt-4 mb-1.5 px-3.5 text-[9px] font-bold uppercase tracking-[0.24em] text-muted/70 select-none first:mt-0">
      {label}
    </p>
  )
}

function NavItem({ to, icon, label, compact = false }) {
  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          isActive
            ? 'bg-primary/10 text-primary border-l-4 border-primary pl-2.5'
            : 'text-muted hover:bg-primary/5 hover:text-text border-l-4 border-transparent',
          compact ? 'justify-center px-1' : '',
        ].join(' ')
      }
    >
      <Icon name={icon} className="text-[20px] md:text-[22px] shrink-0" filled />
      {!compact && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="truncate"
        >
          {label}
        </motion.span>
      )}
    </NavLink>
  )

  if (compact) {
    return (
      <Tooltip content={label} position="right">
        {content}
      </Tooltip>
    )
  }

  return content
}

export function AppShell() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { themeMode, activeTheme, setThemeMode, lightSubTheme, setLightSubTheme } = useTheme()
  const user = useSelector((state) => state.auth.user)
  const profileMenuRef = useRef(null)
  const notificationMenuRef = useRef(null)
  const accountMenuRef = useRef(null)

  // Layout states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('interior-sidebar-collapsed') === 'true'
  })
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Command palette state
  const [cmdSearch, setCmdSearch] = useState('')
  const [activeCmdIdx, setActiveCmdIdx] = useState(0)

  const activeLabel =
    sidebarLinks.find((item) => item.to && location.pathname.startsWith(item.to))?.label ?? 'Dashboard'

  const initials =
    user?.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() ?? 'DA'

  // Scroll listener for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Profile & notification click listener
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  // Command palette listener (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = useCallback(() => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }, [dispatch, navigate])

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('interior-sidebar-collapsed', String(next))
      }
      return next
    })
  }

  // Filter commands
  const allCommands = useMemo(
    () => [
      { label: 'Navigate: Dashboard', action: () => navigate('/dashboard'), icon: 'dashboard', category: 'Navigation' },
      { label: 'Navigate: All Projects', action: () => navigate('/projects'), icon: 'folder_open', category: 'Navigation' },
      { label: 'Navigate: Project Studio', action: () => navigate('/project-studio'), icon: 'architecture', category: 'Navigation' },
      { label: 'Navigate: Task Board', action: () => navigate('/task-board'), icon: 'view_kanban', category: 'Navigation' },
      { label: 'Navigate: Calendar', action: () => navigate('/calendar'), icon: 'calendar_month', category: 'Navigation' },
      { label: 'Navigate: Site Manager', action: () => navigate('/site-manager'), icon: 'construction', category: 'Navigation' },
      { label: 'Navigate: Room Management', action: () => navigate('/room-management'), icon: 'meeting_room', category: 'Navigation' },
      { label: 'Navigate: Clients', action: () => navigate('/clients'), icon: 'contacts', category: 'Navigation' },
      { label: 'Navigate: Vendors', action: () => navigate('/vendors'), icon: 'storefront', category: 'Navigation' },
      { label: 'Navigate: Team Directory', action: () => navigate('/team'), icon: 'groups', category: 'Navigation' },
      { label: 'Navigate: Purchase Approval', action: () => navigate('/purchase-approval'), icon: 'shopping_cart', category: 'Navigation' },
      { label: 'Navigate: Invoices', action: () => navigate('/invoices'), icon: 'receipt_long', category: 'Navigation' },
      { label: 'Navigate: Project Analytics', action: () => navigate('/project-analytics'), icon: 'bar_chart', category: 'Navigation' },
      { label: 'Navigate: Quotation View', action: () => navigate('/quotation-view'), icon: 'request_quote', category: 'Navigation' },
      { label: 'Navigate: Documents', action: () => navigate('/documents'), icon: 'folder', category: 'Navigation' },
      { label: 'Navigate: My Profile', action: () => navigate('/profile'), icon: 'person', category: 'Navigation' },
      { label: 'Navigate: Settings', action: () => navigate('/settings'), icon: 'settings', category: 'Navigation' },
      { label: 'Action: Create New Project', action: () => navigate('/new-project'), icon: 'add', category: 'Quick Action' },
      { label: 'Action: Add New Task', action: () => navigate('/add-task'), icon: 'playlist_add', category: 'Quick Action' },
      { label: 'Theme: Toggle Dark Mode', action: () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark'), icon: 'dark_mode', category: 'Preferences' },
      { label: 'Theme: Toggle Light Theme', action: () => setLightSubTheme(lightSubTheme === 'atelier' ? 'sandstone' : 'atelier'), icon: 'palette', category: 'Preferences' },
      { label: 'Theme: Set to System Default', action: () => setThemeMode('system'), icon: 'settings_brightness', category: 'Preferences' },
      { label: 'Action: Logout Session', action: handleLogout, icon: 'logout', category: 'System' },
    ],
    [navigate, themeMode, lightSubTheme, setThemeMode, setLightSubTheme, handleLogout],
  )

  const filteredCommands = useMemo(
    () =>
      allCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(cmdSearch.toLowerCase()) ||
          cmd.category.toLowerCase().includes(cmdSearch.toLowerCase()),
      ),
    [allCommands, cmdSearch],
  )

  const handleCommandKey = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveCmdIdx((prev) => (prev + 1) % filteredCommands.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveCmdIdx((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (filteredCommands[activeCmdIdx]) {
        filteredCommands[activeCmdIdx].action()
        setCommandPaletteOpen(false)
        setCmdSearch('')
      }
    } else if (event.key === 'Escape') {
      setCommandPaletteOpen(false)
      setCmdSearch('')
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-brand-radial text-text" data-theme={activeTheme}>
      <ScrollToTop />
      <div className="flex min-h-screen w-full min-w-0 max-w-full">
        {/* Desktop Sidebar */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? '76px' : '260px' }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed inset-y-0 left-0 z-30 hidden flex-col overflow-hidden border-r border-border/80 bg-glass/80 backdrop-blur-xl lg:flex"
        >
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-border/70 p-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-glow">
                <Icon name="architecture" filled />
              </div>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <p className="truncate text-base font-bold tracking-tight text-primary">Atelier Pro</p>
                  <p className="truncate text-[9px] font-bold uppercase tracking-[0.3em] text-muted">
                    Interior Admin
                  </p>
                </motion.div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="rounded-xl p-1.5 hover:bg-primary/5 text-muted hover:text-text transition-colors"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={sidebarCollapsed ? 'chevron_right' : 'chevron_left'} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 hide-scrollbar">
            <nav className="space-y-1">
              {sidebarLinks.map((item) =>
                item.section ? (
                  <SectionLabel key={`section-${item.section}`} label={item.section} compact={sidebarCollapsed} />
                ) : (
                  <NavItem key={item.to} {...item} compact={sidebarCollapsed} />
                ),
              )}
            </nav>
          </div>

          {!sidebarCollapsed && (
            <div className="border-t border-border/70 p-4 shrink-0">
              <Button
                variant="primary"
                onClick={() => navigate('/new-project')}
                className="w-full justify-center"
                icon="add"
              >
                New Project
              </Button>
            </div>
          )}
        </motion.aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <div className="fixed inset-0 z-40 lg:hidden" role="dialog">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileDrawerOpen(false)}
                className="fixed inset-0 bg-navy/40 dark:bg-black/60 backdrop-blur-sm"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                className="absolute left-0 inset-y-0 z-10 flex w-72 flex-col bg-surface p-5 border-r border-border shadow-glow"
              >
                <div className="flex items-center gap-3 border-b border-border/50 pb-5 mb-5 shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-on-primary">
                    <Icon name="architecture" filled />
                  </div>
                  <div>
                    <p className="text-base font-bold text-primary">Atelier Pro</p>
                    <p className="text-[10px] font-bold tracking-wider text-muted">INTERIOR DASHBOARD</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <nav className="space-y-1">
                    {sidebarLinks.map((item) =>
                      item.section ? (
                        <SectionLabel key={`section-${item.section}`} label={item.section} />
                      ) : (
                        <NavItem key={item.to} {...item} />
                      ),
                    )}
                  </nav>
                </div>
                <div className="border-t border-border/50 pt-4 mt-5 flex flex-col gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      navigate('/new-project')
                    }}
                    className="w-full justify-center"
                    icon="add"
                  >
                    New Project
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-center"
                    icon="logout"
                  >
                    Logout
                  </Button>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Content Wrapper */}
        <div
          className="flex min-h-screen w-full min-w-0 max-w-full flex-1 flex-col transition-all duration-300"
          style={{
            paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 1024
              ? sidebarCollapsed ? '76px' : '260px'
              : '0px'
          }}
        >
          {/* Header Bar */}
          <header
            className={`sticky top-0 z-20 w-full min-w-0 max-w-full border-b transition-all duration-200 ${
              scrolled
                ? 'bg-surface/90 border-border/80 shadow-soft backdrop-blur-md'
                : 'bg-glass/85 border-border/70 backdrop-blur-xl'
            }`}
          >
            <div className="min-w-0 max-w-full px-4 py-3 sm:px-6 md:px-8">
              <div className="flex min-w-0 max-w-full items-center justify-between gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* Drawer Open Trigger */}
                  <button
                    onClick={() => setMobileDrawerOpen(true)}
                    className="rounded-xl p-2 hover:bg-surface-2 text-muted hover:text-text lg:hidden transition"
                    aria-label="Open mobile navigation menu"
                  >
                    <Icon name="menu" />
                  </button>

                  <div className="hidden min-w-0 select-none rounded-full border border-border bg-surface-2/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-muted sm:flex">
                    {activeLabel}
                  </div>

                  {/* Ctrl+K Search Bar Trigger */}
                  <div
                    onClick={() => setCommandPaletteOpen(true)}
                    className="relative hidden min-w-0 max-w-md flex-1 cursor-pointer select-none lg:block"
                  >
                    <Icon
                      name="search"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <div className="w-full rounded-2xl border border-border bg-surface pl-10 pr-12 py-2 text-sm text-muted/60 transition-all hover:border-primary/20 flex items-center justify-between">
                      <span>Search commands, actions, or views...</span>
                      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold text-muted">
                        Ctrl K
                      </kbd>
                    </div>
                  </div>
                </div>

                <div className="relative flex shrink-0 items-center gap-2" ref={profileMenuRef}>
                  {/* Command Palette Trigger for Mobile/Tablet */}
                  <button
                    onClick={() => setCommandPaletteOpen(true)}
                    className="rounded-full border border-border bg-surface p-2.5 text-muted hover:bg-primary/5 transition lg:hidden"
                    aria-label="Search"
                  >
                    <Icon name="search" />
                  </button>

                  {/* Theme Selector Popover */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-bold text-muted transition hover:bg-primary/5"
                      aria-label="Select theme"
                      aria-haspopup="true"
                      aria-expanded={profileOpen}
                    >
                      <Icon name="palette" className="text-[18px]" />
                      <span className="hidden sm:inline capitalize">{themeMode}</span>
                    </button>
                    {profileOpen && (
                      <div className="absolute right-0 top-[110%] z-30 w-48 rounded-2xl border border-border bg-surface p-3 shadow-xl">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 px-1">
                          Select Mode
                        </p>
                        <div className="grid gap-1 mb-2">
                          {['light', 'dark', 'system'].map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setThemeMode(mode)}
                              className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-semibold text-left transition ${
                                themeMode === mode
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-text hover:bg-surface-2'
                              }`}
                            >
                              <Icon name={mode === 'dark' ? 'dark_mode' : mode === 'light' ? 'light_mode' : 'settings_brightness'} className="text-base" />
                              <span className="capitalize">{mode}</span>
                            </button>
                          ))}
                        </div>
                        {themeMode !== 'dark' && (
                          <>
                            <div className="h-px bg-border my-2" />
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2 px-1">
                              Light SubTheme
                            </p>
                            <div className="grid gap-1">
                              {themeOptions
                                .filter((opt) => opt.id !== 'noir')
                                .map((opt) => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setLightSubTheme(opt.id)}
                                    className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-semibold text-left transition ${
                                      lightSubTheme === opt.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text hover:bg-surface-2'
                                    }`}
                                  >
                                    <span className="capitalize">{opt.label}</span>
                                  </button>
                                ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative flex items-center" ref={notificationMenuRef}>
                    <button
                      onClick={() => setNotificationsOpen((prev) => !prev)}
                      className="relative hidden rounded-full border border-border bg-surface p-2.5 text-muted transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/40 lg:inline-flex"
                      aria-label="View notifications"
                      aria-haspopup="true"
                      aria-expanded={notificationsOpen}
                    >
                      <Icon name="notifications" />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
                    </button>
                    {notificationsOpen && (
                      <div className="absolute right-0 top-[115%] z-30 w-80 rounded-3xl border border-border bg-surface p-4 shadow-xl select-none">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/40">
                          <p className="text-xs font-bold text-text">Notifications</p>
                          <button
                            onClick={() => {
                              setNotificationsOpen(false)
                              navigate('/notifications')
                            }}
                            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                          >
                            View All
                          </button>
                        </div>
                        <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                          {dashboardNotifications.map((note, idx) => (
                            <div key={idx} className="flex gap-2.5 text-xs font-semibold text-text border-b border-border/20 pb-2.5 last:border-b-0 last:pb-0">
                              <span className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg ${
                                note.tone === 'danger' ? 'bg-rose-500/10 text-rose-600' : 'bg-primary/10 text-primary'
                              }`}>
                                <Icon name={note.tone === 'danger' ? 'error' : 'info'} className="text-sm" />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold truncate text-text">{note.title}</p>
                                <p className="text-[10px] text-muted truncate mt-0.5">{note.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Profile Avatar & Account Menu */}
                  <div className="relative border-l border-border pl-2" ref={accountMenuRef}>
                    <button
                      type="button"
                      onClick={() => setAccountMenuOpen((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full transition hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      aria-label="Account menu"
                      aria-haspopup="true"
                      aria-expanded={accountMenuOpen}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {initials}
                      </span>
                      <span className="hidden pr-1 text-left md:block select-none">
                        <p className="text-xs font-bold text-text">{user?.name ?? 'David Chen'}</p>
                        <p className="text-[10px] font-semibold text-muted leading-tight">{user?.role ?? 'Lead Architect'}</p>
                      </span>
                      <Icon name="expand_more" className="hidden text-muted text-base md:block" />
                    </button>

                    {accountMenuOpen && (
                      <div className="absolute right-0 top-[115%] z-30 w-56 rounded-2xl border border-border bg-surface p-2 shadow-xl select-none">
                        <div className="px-3 py-2.5 border-b border-border/40 mb-1.5">
                          <p className="text-xs font-bold text-text truncate">{user?.name ?? 'David Chen'}</p>
                          <p className="text-[10px] font-semibold text-muted truncate">{user?.email ?? 'architect@atelier.pro'}</p>
                        </div>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false)
                            navigate('/profile')
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-text transition hover:bg-surface-2"
                        >
                          <Icon name="person" className="text-base text-muted" />
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false)
                            navigate('/settings')
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-text transition hover:bg-surface-2"
                        >
                          <Icon name="settings" className="text-base text-muted" />
                          Settings
                        </button>
                        <div className="h-px bg-border my-1.5" />
                        <button
                          onClick={() => {
                            setAccountMenuOpen(false)
                            handleLogout()
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-danger transition hover:bg-danger/5"
                        >
                          <Icon name="logout" className="text-base" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="w-full min-w-0 max-w-full flex-1 overflow-x-hidden px-4 py-5 pb-24 sm:px-6 lg:px-8 xl:py-6 3xl:px-10">
            <div className="mx-auto w-full min-w-0 max-w-[1800px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Bottom Nav Bar on Mobile view */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-glass/95 px-3 py-2 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {quickLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center justify-center rounded-xl py-1 text-[10px] font-bold transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-primary/5 hover:text-text',
                ].join(' ')
              }
            >
              <Icon name={item.icon} className="text-[20px]" filled />
              <span className="mt-0.5 truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Command Palette Modal Dialog */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-28"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setCommandPaletteOpen(false)
                setCmdSearch('')
              }}
              className="fixed inset-0 bg-navy/40 dark:bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="relative z-10 w-full max-w-xl rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden"
            >
              <div className="relative border-b border-border/60">
                <Icon
                  name="search"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl"
                />
                <input
                  autoFocus
                  value={cmdSearch}
                  onChange={(e) => {
                    setCmdSearch(e.target.value)
                    setActiveCmdIdx(0)
                  }}
                  onKeyDown={handleCommandKey}
                  placeholder="Type a command, page route, or preference..."
                  className="w-full bg-transparent pl-12 pr-4 py-4 text-sm font-semibold text-text outline-none placeholder:text-muted/50"
                />
              </div>

              <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
                {filteredCommands.length > 0 ? (
                  <div className="grid gap-1">
                    {filteredCommands.map((cmd, idx) => {
                      const isActive = idx === activeCmdIdx
                      return (
                        <button
                          key={cmd.label}
                          onClick={() => {
                            cmd.action()
                            setCommandPaletteOpen(false)
                            setCmdSearch('')
                          }}
                          onMouseEnter={() => setActiveCmdIdx(idx)}
                          className={`
                            flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition
                            ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-surface-2 text-text'}
                          `}
                        >
                          <Icon name={cmd.icon} className="text-lg shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold truncate">{cmd.label}</p>
                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-primary/70' : 'text-muted'}`}>{cmd.category}</p>
                          </div>
                          <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[9px] font-bold text-muted">
                            Enter
                          </kbd>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted">
                    <Icon name="search_off" className="text-3xl text-muted/50 mb-2" />
                    <p className="text-xs font-semibold">No results match your query.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/40 bg-surface-2/60 px-4 py-3 text-[10px] font-bold tracking-wider text-muted">
                <span>Use arrows to navigate, Enter to run</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
