import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react'
import { NAV_LINKS, COMPANY_NAME } from './config'
import { getSession, clearSession, scrollToSection } from './utils'

export default function Navbar() {
  const [open,      setOpen]      = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const [darkMode,  setDarkMode]  = useState(true)
  const navigate  = useNavigate()
  const location  = useLocation()
  const session   = getSession()
  const isHome    = location.pathname === '/'

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Dark mode toggle */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  function handleNavClick(href) {
    setOpen(false)
    if (isHome) {
      scrollToSection(href)
    } else {
      navigate('/' + href)
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
          ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/10 shadow-glass'
          : 'bg-transparent'
      }`}
    >
      <div className="section-wrapper">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
                <Zap size={16} className="text-white" />
              </div>
              <div className="absolute inset-0 w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight gradient-text">{COMPANY_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="btn-ghost"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-gray-300 hover:text-white"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

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
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
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
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium"
                >
                  {link.label}
                </button>
              ))}
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
