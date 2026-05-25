// ─────────────────────────────────────────────
//  DashboardLayout — shared shell for all tiers
//  Provides: sidebar, mobile drawer, topbar
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, LogOut, Menu, X, RefreshCw, Bell } from 'lucide-react'
import { COMPANY_NAME } from './config'
import { clearSession, formatDate } from './utils'

export default function DashboardLayout({
  session,
  title     = 'Dashboard',
  subtitle,
  navItems  = [],
  children,
  onRefresh,
  activeNav,
  onNavChange,
}) {
  const navigate   = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [spinning,   setSpinning]   = useState(false)

  function handleLogout() {
    clearSession()
    navigate('/')
  }

  function handleRefresh() {
    setSpinning(true)
    onRefresh?.()
    setTimeout(() => setSpinning(false), 800)
  }

  /* ── Shared nav list ── */
  function NavList({ onItemClick }) {
    return (
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon, locked }) => (
          <button
            key={id}
            onClick={() => { onNavChange?.(id); onItemClick?.() }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeNav === id
                ? 'bg-brand-700/30 text-brand-300 border border-brand-700/30'
                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Icon size={16} />
            <span className="flex-1 text-left">{label}</span>
            {locked && <span className="text-xs text-gray-600">🔒</span>}
          </button>
        ))}
      </nav>
    )
  }

  /* ── Shared user footer ── */
  function UserFooter() {
    const tierLabel = session?.tier === 'admin' ? 'Admin' : session?.tier === 'premium' ? 'Premium Client' : 'Design Client'
    const tierColor = session?.tier === 'admin' ? 'text-brand-300' : session?.tier === 'premium' ? 'text-brand-300' : 'text-amber-300'
    return (
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {session?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{session?.username}</div>
            <div className={`text-xs truncate font-semibold ${tierColor}`}>{tierLabel}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-gray-950 border-r border-white/10 z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
                    <Palette size={14} className="text-white" />
                  </div>
                  <span className="font-bold gradient-text">{COMPANY_NAME}</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <NavList onItemClick={() => setMobileOpen(false)} />
              <UserFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden lg:flex flex-col w-56 min-h-screen border-r border-white/10 bg-gray-950/80 fixed left-0 top-0 bottom-0 z-40">
          <div className="flex items-center gap-2 h-16 px-5 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
              <Palette size={14} className="text-white" />
            </div>
            <span className="font-bold gradient-text">{COMPANY_NAME}</span>
          </div>
          <NavList />
          <UserFooter />
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 lg:pl-56">
          {/* Topbar */}
          <div className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/10 bg-gray-950/90 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                aria-label="Open navigation"
              >
                <Menu size={17} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white">{title}</h1>
                <p className="text-xs text-gray-500">{subtitle || formatDate(Date.now())}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onRefresh && (
                <button
                  onClick={handleRefresh}
                  className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                  title="Refresh"
                >
                  <RefreshCw size={15} className={spinning ? 'animate-spin' : ''} />
                </button>
              )}
              <button className="relative w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 pointer-events-none" />
              </button>
              <Link to="/" className="btn-ghost text-xs hidden sm:flex">← Home</Link>
              <button
                onClick={handleLogout}
                className="lg:hidden w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>

          {/* Page content */}
          <div className="p-4 sm:p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
