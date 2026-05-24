// ─────────────────────────────────────────────
//  CustomerDashboard — registered buyer (free tier)
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, CalendarCheck, ArrowRight, TrendingUp,
  Building2, Heart, MapPin, Star, ChevronRight,
  LayoutDashboard, Bell, Phone,
} from 'lucide-react'
import DashboardLayout from './DashboardLayout'

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',       icon: LayoutDashboard },
  { id: 'saved',     label: 'Saved Projects',  icon: Heart,   locked: true },
  { id: 'visits',    label: 'Site Visits',     icon: CalendarCheck, locked: true },
  { id: 'insights',  label: 'AI Insights',     icon: TrendingUp,    locked: true },
]

const LOCKED_METRICS = [
  { label: 'Saved Projects',         icon: Heart,        color: 'from-brand-600 to-brand-800',   bg: 'bg-brand-900/20',  border: 'border-brand-700/30'  },
  { label: 'Site Visits Booked',     icon: CalendarCheck,color: 'from-emerald-600 to-emerald-800',bg:'bg-emerald-900/20',border:'border-emerald-700/30'  },
  { label: 'Interested Properties',  icon: Building2,    color: 'from-accent-600 to-accent-800', bg: 'bg-accent-900/20', border: 'border-accent-700/30' },
  { label: 'Market Insights Viewed', icon: TrendingUp,   color: 'from-amber-600 to-amber-800',   bg: 'bg-amber-900/20',  border: 'border-amber-700/30'  },
]

const FEATURED_PICKS = [
  { name: 'The Arbour', builder: 'DLF', city: 'Gurugram', price: '₹4.5 Cr+', tag: 'Ready to Move' },
  { name: 'Lodha Bellavista', builder: 'Lodha', city: 'Noida', price: '₹3.8 Cr+', tag: 'Mar 2026' },
  { name: 'Smartworld One DXP', builder: 'Smartworld', city: 'Bengaluru', price: '₹5.2 Cr+', tag: 'Ultra Luxury' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  transition: { delay, duration: 0.4 },
})

export default function CustomerDashboard({ session }) {
  const [activeNav, setActiveNav] = useState('overview')

  return (
    <DashboardLayout
      session={session}
      title="My Dashboard"
      subtitle="Registered Buyer Account"
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavChange={setActiveNav}
    >
      {/* ── Welcome banner ── */}
      <motion.div {...fadeUp(0)} className="glass border border-brand-800/40 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-brand-950/60 to-gray-900/40">
        <div className="flex items-start sm:items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                Registered Buyer
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Welcome, {session?.username || 'there'}! 🏙️</h2>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Explore India's finest luxury properties. Book a consultation with our concierge team to
              unlock your personalised investor dashboard.
            </p>
          </div>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary shrink-0"
          >
            Book Consultation <ChevronRight size={15} />
          </button>
        </div>
      </motion.div>

      {/* ── Locked metrics ── */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
          Your Activity — Upgrade to Premium to unlock full tracking
        </p>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {LOCKED_METRICS.map(({ label, icon: Icon, color, bg, border }, i) => (
            <motion.div
              key={label}
              {...fadeUp(i * 0.06)}
              className={`relative glass ${bg} border ${border} rounded-2xl p-5 overflow-hidden`}
            >
              <div className="absolute inset-0 backdrop-blur-[2px] bg-gray-950/50 flex items-center justify-center rounded-2xl z-10">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Lock size={14} className="text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Premium Only</span>
                </div>
              </div>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white mb-1">–</div>
              <div className="text-xs text-gray-400">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA cards ── */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          {...fadeUp(0.1)}
          className="glass border border-brand-700/30 rounded-2xl p-6 bg-gradient-to-br from-brand-950/40 to-transparent group hover:border-brand-600/40 hover:shadow-gold transition-all cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center mb-4 shadow-glow-sm">
            <Phone size={22} className="text-white" />
          </div>
          <h3 className="font-semibold text-white mb-2">Schedule a Consultation</h3>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Speak with an investment advisor to get a personalised property shortlist, pricing analysis, and site visit plan.
          </p>
          <div className="flex items-center gap-2 text-brand-300 text-sm font-medium group-hover:gap-3 transition-all">
            Book now <ArrowRight size={14} />
          </div>
        </motion.div>

        <motion.div
          {...fadeUp(0.15)}
          className="glass border border-accent-700/30 rounded-2xl p-6 bg-gradient-to-br from-accent-950/30 to-transparent group hover:border-accent-600/40 hover:shadow-gold transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-600 to-brand-700 flex items-center justify-center mb-4">
            <Star size={22} className="text-white" />
          </div>
          <h3 className="font-semibold text-white mb-2">Upgrade to Premium Investor</h3>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Unlock saved project tracking, site visit management, AI investment insights, and priority relationship manager access.
          </p>
          <div className="flex items-center gap-2 text-brand-400 text-sm font-medium group-hover:gap-3 transition-all">
            Learn more <ArrowRight size={14} />
          </div>
        </motion.div>
      </div>

      {/* ── Featured picks preview ── */}
      <motion.div {...fadeUp(0.2)} className="glass border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-white">Projects You May Like</h3>
            <p className="text-xs text-gray-500 mt-0.5">Curated picks based on your profile</p>
          </div>
          <span className="text-xs text-brand-400 font-medium">AI-Curated</span>
        </div>
        <div className="space-y-3">
          {FEATURED_PICKS.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 hover:border-brand-800/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-800/40 border border-brand-700/30 flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{p.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{p.builder}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><MapPin size={9} />{p.city}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-brand-400 text-sm font-bold">{p.price}</div>
                <div className="text-xs text-gray-600">{p.tag}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
