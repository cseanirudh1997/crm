import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Palette, LogOut, LayoutDashboard, ChevronRight, Bell, Sparkles } from 'lucide-react'
import { NAV_LINKS, COMPANY_NAME } from './config'
import { getSession, clearSession, scrollToSection } from './utils'

const NOTIFICATIONS = [
  { id: 1, dot: 'bg-brand-500',   title: 'New Trend Report — Spring 2026',       body: 'Warm Minimalism & Japandi styles dominate the season. See our curated collection.',   time: '2m ago' },
  { id: 2, dot: 'bg-emerald-500', title: 'Your Consultation is Confirmed',        body: 'Your design consultation has been scheduled for tomorrow at 11:00 AM.',               time: '1h ago' },
  { id: 3, dot: 'bg-accent-500',  title: 'New Design Collection Live',            body: 'Luxury Penthouse Living Suite — 4,200 sq ft. View the full photo gallery.',           time: '4h ago' },
  { id: 4, dot: 'bg-amber-500',   title: '3D Visualization Package Updated',      body: 'Enhanced photorealistic renders now available for your approved design brief.',        time: '1d ago' },
]

export default function Navbar() {
  const [open,          setOpen]          = useState(false)
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [showNotif,     setShowNotif]     = useState(false)
  const [notifUnread,   setNotifUnread]   = useState(true)
  const notifRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const session  = getSession()
  const isHome   = location.pathname === '/'

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Active section highlighting via IntersectionObserver */
  useEffect(() => {
    if (!isHome) { setActiveSection(''); return }
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isHome])

  /* Close notification panel on outside click */
  useEffect(() => {
    if (!showNotif) return
    function handleOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [showNotif])

  function toggleNotif() {
    setShowNotif((v) => !v)
    setNotifUnread(false)
  }

  function handleNavClick(href) {
    setOpen(false)
    if (isHome) {
      scrollToSection(href)
    } else {
      navigate('/', { state: { scrollTo: href } })
    }
  }

  function handleLogout() {
    clearSession()
    navigate('/')
    setOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-gray-950/95 backdrop-blur-xl border-b border-white/10 shadow-glass'
          : 'bg-gray-950/20 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="section-wrapper">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
                <Palette size={15} className="text-white" />
              </div>
              <div className="absolute inset-0 w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight gradient-text">{COMPANY_NAME}</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-medium hidden sm:block">Interior Design Studio</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = isHome && activeSection === link.href.replace('#', '')
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`btn-ghost transition-colors ${isActive ? 'text-white bg-white/10 border border-white/15' : ''}`}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotif}
                className={`w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white ${showNotif ? 'bg-white/10 text-white border-white/20' : ''}`}
                aria-label="Notifications"
              >
                <Bell size={15} />
              </button>
              {notifUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border border-gray-950 pointer-events-none" />
              )}
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1    }}
                    exit={{   opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 glass-dark border border-white/10 rounded-2xl shadow-glass overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Sparkles size={12} className="text-brand-400" /> Studio Updates
                      </span>
                      <button onClick={() => setNotifUnread(false)} className="text-xs text-brand-400 hover:underline">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                      {NOTIFICATIONS.map((n, i) => (
                        <div key={n.id} className={`px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer ${i >= 2 ? 'opacity-50' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i < 2 ? n.dot : 'bg-gray-600'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-white leading-snug">{n.title}</div>
                              <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.body}</div>
                              <div className="text-xs text-gray-600 mt-1">{n.time}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-white/10 px-4 py-2.5 text-center">
                      <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                        View all updates
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {session ? (
              <>
                <Link to="/dashboard" className="btn-ghost gap-2">
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-ghost gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20">
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"  className="btn-ghost">Sign In</Link>
                <Link to="/signup" className="btn-primary">
                  Get Started <ChevronRight size={15} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotif}
                className={`w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all ${showNotif ? 'bg-white/10 text-white' : ''}`}
                aria-label="Notifications"
              >
                <Bell size={15} />
              </button>
              {notifUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 border border-gray-950 pointer-events-none" />
              )}
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1    }}
                    exit={{   opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 glass-dark border border-white/10 rounded-2xl shadow-glass overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <span className="text-sm font-semibold text-white">Studio Updates</span>
                      <button onClick={() => setNotifUnread(false)} className="text-xs text-brand-400 hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                      {NOTIFICATIONS.map((n, i) => (
                        <div key={n.id} className={`px-4 py-3 hover:bg-white/5 transition-colors ${i >= 2 ? 'opacity-50' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i < 2 ? n.dot : 'bg-gray-600'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-white leading-snug">{n.title}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{n.body}</div>
                              <div className="text-xs text-gray-600 mt-1">{n.time}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-gray-950/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="section-wrapper py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = isHome && activeSection === link.href.replace('#', '')
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium ${
                      isActive
                        ? 'text-white bg-white/10 border border-white/15'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </button>
                )
              })}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2 mt-2">
                {session ? (
                  <>
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary justify-center">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn-ghost text-red-400 justify-center">
                      <LogOut size={15} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login"  onClick={() => setOpen(false)} className="btn-secondary justify-center">Sign In</Link>
                    <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary  justify-center">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
