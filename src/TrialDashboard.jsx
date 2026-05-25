// ─────────────────────────────────────────────
//  DesignClientDashboard — free tier (registered design client)
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, CalendarCheck, ArrowRight, Lightbulb,
  Palette, Heart, Star, ChevronRight,
  LayoutDashboard, Phone, Home, ExternalLink,
  Sparkles,
} from 'lucide-react'
import DashboardLayout from './DashboardLayout'
import { fetchPaymentLinks } from './api'

const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',         icon: LayoutDashboard },
  { id: 'payments',  label: 'Design Packages',  icon: Star            },
  { id: 'projects',  label: 'My Projects',      icon: Home,   locked: true },
  { id: 'insights',  label: 'Design Insights',  icon: Lightbulb,      locked: true },
]

const LOCKED_METRICS = [
  { label: 'Active Projects',       icon: Home,         color: 'from-brand-600 to-brand-800',    bg: 'bg-brand-900/20',   border: 'border-brand-700/30'  },
  { label: 'Consultations Booked',  icon: CalendarCheck,color: 'from-emerald-600 to-emerald-800',bg: 'bg-emerald-900/20', border: 'border-emerald-700/30' },
  { label: 'Design Moodboards',     icon: Palette,      color: 'from-accent-600 to-accent-800',  bg: 'bg-accent-900/20',  border: 'border-accent-700/30'  },
  { label: 'AI Style Matches',      icon: Lightbulb,    color: 'from-amber-600 to-amber-800',    bg: 'bg-amber-900/20',   border: 'border-amber-700/30'   },
]

const STYLE_PICKS = [
  { name: 'Modern Luxury Living Room',   style: 'Contemporary',     area: '1,200 sq ft', tag: 'Most Popular'  },
  { name: 'Warm Minimalist Bedroom',     style: 'Scandinavian',     area: '650 sq ft',   tag: 'Trending 2026' },
  { name: 'Premium Modular Kitchen',     style: 'Modern Modular',   area: '420 sq ft',   tag: 'Client Favorite' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  transition: { delay, duration: 0.4 },
})

export default function DesignClientDashboard({ session }) {
  const [activeNav,    setActiveNav]    = useState('overview')
  const [payLinks,     setPayLinks]     = useState([])
  const [payLoading,   setPayLoading]   = useState(false)

  async function loadPayLinks() {
    setPayLoading(true)
    try {
      const res = await fetchPaymentLinks()
      setPayLinks(res.paymentLinks || [])
    } catch { setPayLinks([]) }
    setPayLoading(false)
  }

  useEffect(() => {
    if (activeNav === 'payments') loadPayLinks()
  }, [activeNav])

  return (
    <DashboardLayout
      session={session}
      title="My Dashboard"
      subtitle="Design Client Account"
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavChange={setActiveNav}
    >

      {/* ══ OVERVIEW ══ */}
      {activeNav === 'overview' && (
        <>
          {/* Welcome banner */}
          <motion.div {...fadeUp(0)} className="glass border border-brand-800/40 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-brand-950/60 to-gray-900/40">
            <div className="flex items-start sm:items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                    Design Client
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">Welcome, {session?.username || 'there'}! ✨</h2>
                <p className="text-gray-400 text-sm mt-1 max-w-xl">
                  Explore luxury interior designs and book a consultation to unlock your personalised
                  design journey with Maison Studio.
                </p>
              </div>
              <button
                onClick={() => setActiveNav('payments')}
                className="btn-primary shrink-0"
              >
                View Packages <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>

          {/* Locked metrics */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Your Activity — Upgrade to unlock full project tracking
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

          {/* CTA cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              {...fadeUp(0.1)}
              className="glass border border-brand-700/30 rounded-2xl p-6 bg-gradient-to-br from-brand-950/40 to-transparent group hover:border-brand-600/40 hover:shadow-gold transition-all cursor-pointer"
              onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center mb-4 shadow-glow-sm">
                <Phone size={22} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Book a Design Consultation</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Speak with a Maison design consultant to get a personalised style brief, moodboard,
                and space planning recommendation.
              </p>
              <div className="flex items-center gap-2 text-brand-300 text-sm font-medium group-hover:gap-3 transition-all">
                Book now <ArrowRight size={14} />
              </div>
            </motion.div>

            <motion.div
              {...fadeUp(0.15)}
              className="glass border border-accent-700/30 rounded-2xl p-6 bg-gradient-to-br from-accent-950/30 to-transparent group hover:border-accent-600/40 hover:shadow-gold transition-all cursor-pointer"
              onClick={() => setActiveNav('payments')}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-600 to-brand-700 flex items-center justify-center mb-4">
                <Sparkles size={22} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Upgrade to Premium Client</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Unlock active project tracking, exclusive design moodboards, AI style recommendations,
                and a dedicated design manager.
              </p>
              <div className="flex items-center gap-2 text-brand-400 text-sm font-medium group-hover:gap-3 transition-all">
                Explore packages <ArrowRight size={14} />
              </div>
            </motion.div>
          </div>

          {/* Curated style picks */}
          <motion.div {...fadeUp(0.2)} className="glass border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white">Design Styles You May Love</h3>
                <p className="text-xs text-gray-500 mt-0.5">Curated by our studio team</p>
              </div>
              <span className="text-xs text-brand-400 font-medium flex items-center gap-1">
                <Sparkles size={10} /> AI-Curated
              </span>
            </div>
            <div className="space-y-3">
              {STYLE_PICKS.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 hover:border-brand-800/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-800/40 border border-brand-700/30 flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{p.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{p.style} · {p.area}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-900/40 border border-brand-800/30">{p.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* ══ DESIGN PACKAGES (PAYMENTS) ══ */}
      {activeNav === 'payments' && (
        <motion.div {...fadeUp(0)}>
          <h2 className="text-lg font-bold text-white mb-1">Design Packages</h2>
          <p className="text-sm text-gray-400 mb-6">Choose a package to begin your luxury interior design journey with Maison Studio.</p>

          {payLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-28 rounded-2xl bg-white/5" />)}
            </div>
          ) : payLinks.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {payLinks.map((pkg, i) => (
                <motion.div
                  key={pkg.id || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass border border-brand-800/30 rounded-2xl p-6 flex flex-col gap-4 hover:border-brand-600/40 hover:shadow-gold transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{pkg.name}</h3>
                      {pkg.popular && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 font-semibold">Popular</span>
                      )}
                    </div>
                    <div className="text-2xl font-extrabold gradient-text">{pkg.amount || pkg.price}</div>
                    {pkg.description && <p className="text-xs text-gray-400 mt-2 leading-relaxed">{pkg.description}</p>}
                  </div>
                  {pkg.features && (
                    <ul className="space-y-1.5 text-xs text-gray-400">
                      {(Array.isArray(pkg.features) ? pkg.features : pkg.features.split(',')).map((f, fi) => (
                        <li key={fi} className="flex items-center gap-1.5">
                          <span className="text-brand-400">✓</span> {f.trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => window.open(pkg.url || pkg.link, '_blank', 'noopener,noreferrer')}
                    className="btn-primary w-full justify-center mt-auto"
                  >
                    Get Started <ExternalLink size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Fallback when no payment links returned */
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[
                { name: 'Starter Package', price: '₹1,50,000', desc: 'Perfect for a single room makeover — living room or bedroom.', features: ['One room interior design', '2D layout & 3D visualization', 'Material & furniture selection', '2 design revisions', 'Site supervision (1 visit)'] },
                { name: 'Premium Package', price: '₹4,50,000', popular: true, desc: 'Full home interior for 2BHK apartments up to 1,000 sq ft.', features: ['Complete 2BHK interior', 'Modular kitchen included', 'Full 3D walkthrough', 'Dedicated design manager', 'Site supervision (5 visits)', '1-year service warranty'] },
                { name: 'Luxury Suite',    price: '₹12,00,000', desc: 'Bespoke 3BHK or villa design — cinematic luxury from concept to completion.', features: ['3BHK / Villa full interior', 'Premium material sourcing', 'Cinematic 3D visualization', 'Dedicated project manager', 'Unlimited site supervision', '2-year service warranty', 'Priority concierge support'] },
              ].map((pkg, i) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass border rounded-2xl p-6 flex flex-col gap-4 hover:shadow-gold transition-all ${
                    pkg.popular ? 'border-brand-600/50 bg-brand-950/20' : 'border-white/10 hover:border-brand-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{pkg.name}</h3>
                      {pkg.popular && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 font-semibold">Most Popular</span>
                      )}
                    </div>
                    <div className="text-2xl font-extrabold gradient-text">{pkg.price}</div>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{pkg.desc}</p>
                  </div>
                  <ul className="space-y-1.5 text-xs text-gray-400 flex-1">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-1.5">
                        <span className="text-brand-400">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
                    className={pkg.popular ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                  >
                    Book Consultation <ChevronRight size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ══ LOCKED: MY PROJECTS ══ */}
      {activeNav === 'projects' && (
        <motion.div {...fadeUp(0)} className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-900/40 border border-brand-700/30 flex items-center justify-center">
            <Lock size={24} className="text-brand-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">Project Tracking — Premium Only</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Upgrade to a Premium Client plan to track your active interior design projects, view progress
            milestones, and access design deliverables.
          </p>
          <button onClick={() => setActiveNav('payments')} className="btn-primary mt-2">
            View Packages <ChevronRight size={15} />
          </button>
        </motion.div>
      )}

      {/* ══ LOCKED: DESIGN INSIGHTS ══ */}
      {activeNav === 'insights' && (
        <motion.div {...fadeUp(0)} className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-900/40 border border-amber-700/30 flex items-center justify-center">
            <Lightbulb size={24} className="text-amber-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">AI Design Insights — Premium Only</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Get AI-powered design recommendations, trend forecasts, and personalized material
            suggestions with a Premium Client account.
          </p>
          <button onClick={() => setActiveNav('payments')} className="btn-primary mt-2">
            View Packages <ChevronRight size={15} />
          </button>
        </motion.div>
      )}

    </DashboardLayout>
  )
}
