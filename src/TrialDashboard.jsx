// ─────────────────────────────────────────────
//  AIClientDashboard — free tier (registered AI mentorship portal user)
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, CalendarCheck, ArrowRight, Brain,
  BookOpen, Users, Star, ChevronRight,
  LayoutDashboard, Phone, TrendingUp, ExternalLink,
  Sparkles, Zap,
} from 'lucide-react'
import DashboardLayout from './DashboardLayout'
import { fetchPaymentLinks } from './api'

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',            icon: LayoutDashboard },
  { id: 'payments',   label: 'AI Services',          icon: Star            },
  { id: 'sessions',   label: 'Mentorship Sessions',  icon: Users,    locked: true },
  { id: 'resources',  label: 'AI Resources',         icon: Brain,    locked: true },
]

const LOCKED_METRICS = [
  { label: 'Mentorship Sessions',    icon: Users,         color: 'from-brand-600 to-brand-800',    bg: 'bg-brand-900/20',   border: 'border-brand-700/30'   },
  { label: 'Strategy Calls Booked',  icon: CalendarCheck, color: 'from-emerald-600 to-emerald-800', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30' },
  { label: 'AI Case Studies',        icon: BookOpen,      color: 'from-accent-600 to-accent-800',   bg: 'bg-accent-900/20',  border: 'border-accent-700/30'  },
  { label: 'Progress Score',         icon: TrendingUp,    color: 'from-amber-600 to-amber-800',     bg: 'bg-amber-900/20',   border: 'border-amber-700/30'   },
]

const AI_RESOURCES = [
  { name: 'Building Production RAG Systems',    topic: 'GenAI Engineering',    level: 'Advanced',     tag: 'Most Popular'    },
  { name: 'Pricing AI with ML Ensembles',       topic: 'Pricing Intelligence', level: 'Intermediate', tag: 'Trending 2026'   },
  { name: 'MLOps: Feature Stores & Pipelines',  topic: 'MLOps',                level: 'Advanced',     tag: 'Client Favorite' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  transition: { delay, duration: 0.4 },
})

export default function AIClientDashboard({ session }) {
  const [activeNav,  setActiveNav]  = useState('overview')
  const [payLinks,   setPayLinks]   = useState([])
  const [payLoading, setPayLoading] = useState(false)

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
      subtitle="AI Mentorship Portal"
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
                    Free Member
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">Welcome, {session?.username || 'there'}! 🚀</h2>
                <p className="text-gray-400 text-sm mt-1 max-w-xl">
                  You're on the VN.AI mentorship portal. Book a free strategy call to unlock your
                  personalised AI career roadmap with a senior data scientist.
                </p>
              </div>
              <button onClick={() => setActiveNav('payments')} className="btn-primary shrink-0">
                View AI Services <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>

          {/* Locked metrics */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Your Progress — Upgrade to unlock full mentorship tracking
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
              <h3 className="font-semibold text-white mb-2">Book a Free Strategy Call</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Speak with a senior data scientist to get a personalised AI career roadmap,
                skill gap analysis, and a 90-day action plan.
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
              <h3 className="font-semibold text-white mb-2">Upgrade to Premium Mentorship</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Unlock session tracking, exclusive AI case studies, mock interview prep,
                and a dedicated AI mentor for your FAANG journey.
              </p>
              <div className="flex items-center gap-2 text-brand-400 text-sm font-medium group-hover:gap-3 transition-all">
                Explore services <ArrowRight size={14} />
              </div>
            </motion.div>
          </div>

          {/* AI learning resources */}
          <motion.div {...fadeUp(0.2)} className="glass border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white">Featured AI Learning Resources</h3>
                <p className="text-xs text-gray-500 mt-0.5">Curated by your AI mentor</p>
              </div>
              <span className="text-xs text-brand-400 font-medium flex items-center gap-1">
                <Zap size={10} /> Mentor-Curated
              </span>
            </div>
            <div className="space-y-3">
              {AI_RESOURCES.map((r, i) => (
                <div key={r.name} className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 hover:border-brand-800/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-800/40 border border-brand-700/30 flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{r.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{r.topic} · {r.level}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-brand-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-900/40 border border-brand-800/30">{r.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* ══ AI SERVICES (PAYMENTS) ══ */}
      {activeNav === 'payments' && (
        <motion.div {...fadeUp(0)}>
          <h2 className="text-lg font-bold text-white mb-1">AI Mentorship Services</h2>
          <p className="text-sm text-gray-400 mb-6">Choose a service to accelerate your AI career with expert guidance from a senior data scientist.</p>

          {payLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="shimmer h-28 rounded-2xl bg-white/5" />)}
            </div>
          ) : payLinks.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {payLinks.map((pkg, i) => (
                <motion.div
                  key={pkg.paymentId || pkg.id || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass border border-brand-800/30 rounded-2xl p-6 flex flex-col gap-4 hover:border-brand-600/40 hover:shadow-gold transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{pkg.title || pkg.name}</h3>
                      {(pkg.active === 'yes' || pkg.featured) && (
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
                    onClick={() => window.open(pkg.paymentUrl || pkg.url || pkg.link, '_blank', 'noopener,noreferrer')}
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
                {
                  name: 'AI Strategy Session',
                  price: '₹8,000',
                  desc: 'A focused 60-min 1:1 session to diagnose your AI skill gaps and build a personalized roadmap.',
                  features: ['60-min video session', 'Skill gap assessment', 'Personalized 90-day roadmap', 'Resource recommendations', 'Recording + notes shared'],
                },
                {
                  name: 'GenAI Mentorship Pack',
                  price: '₹25,000',
                  popular: true,
                  desc: '4 sessions of intensive GenAI/LLM mentorship — from RAG systems to production deployment.',
                  features: ['4 × 60-min 1:1 sessions', 'RAG + LLM system design', 'Code review & feedback', 'Mock system design interview', 'Async Q&A support', 'Session recordings'],
                },
                {
                  name: 'FAANG Prep Sprint',
                  price: '₹45,000',
                  desc: '8-week intensive FAANG/senior ML role prep with mock interviews and full feedback loops.',
                  features: ['8 × 60-min sessions', 'ML system design mastery', '4 mock interviews + feedback', 'Resume & portfolio review', 'Referral network access', '90-day post-placement support'],
                },
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
                    Book Now <ChevronRight size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* ══ LOCKED: MENTORSHIP SESSIONS ══ */}
      {activeNav === 'sessions' && (
        <motion.div {...fadeUp(0)} className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-900/40 border border-brand-700/30 flex items-center justify-center">
            <Lock size={24} className="text-brand-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">Session Tracking — Premium Only</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Upgrade to a premium mentorship plan to track your sessions, view progress
            milestones, and access session recordings.
          </p>
          <button onClick={() => setActiveNav('payments')} className="btn-primary mt-2">
            View AI Services <ChevronRight size={15} />
          </button>
        </motion.div>
      )}

      {/* ══ LOCKED: AI RESOURCES ══ */}
      {activeNav === 'resources' && (
        <motion.div {...fadeUp(0)} className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-900/40 border border-amber-700/30 flex items-center justify-center">
            <Brain size={24} className="text-amber-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">AI Resource Library — Premium Only</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Get access to exclusive AI case studies, production system walkthroughs,
            and mentor-curated GenAI learning paths with a premium plan.
          </p>
          <button onClick={() => setActiveNav('payments')} className="btn-primary mt-2">
            View AI Services <ChevronRight size={15} />
          </button>
        </motion.div>
      )}

    </DashboardLayout>
  )
}
