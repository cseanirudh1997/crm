// ─────────────────────────────────────────────
//  TrialDashboard — limited view for trial users
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Lock, Calendar, ArrowRight, TrendingUp, Brain,
  Database, Users, Star, ChevronRight, LayoutDashboard,
  Headphones, Rocket,
} from 'lucide-react'
import DashboardLayout from './DashboardLayout'
import { ServiceRequestModal } from './Modals'

const NAV_ITEMS = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'deployments', label: 'Deployments', icon: Rocket,         locked: true },
  { id: 'analytics',   label: 'Analytics',   icon: TrendingUp,     locked: true },
  { id: 'support',     label: 'Support',     icon: Headphones },
]

const LOCKED_METRICS = [
  { label: 'AI Models Deployed',    icon: Brain,      color: 'from-brand-600 to-brand-800',   bg: 'bg-brand-900/20',  border: 'border-brand-700/30'  },
  { label: 'Data Points / Day',     icon: Database,   color: 'from-teal-600 to-teal-800',     bg: 'bg-teal-900/20',   border: 'border-teal-700/30'   },
  { label: 'Revenue Impact (Est.)', icon: TrendingUp, color: 'from-accent-600 to-accent-800', bg: 'bg-accent-900/20', border: 'border-accent-700/30' },
  { label: 'Active Users',          icon: Users,      color: 'from-amber-600 to-amber-800',   bg: 'bg-amber-900/20',  border: 'border-amber-700/30'  },
]

const ENTERPRISE_PRODUCTS = [
  { name: 'NexusGPT Enterprise',      desc: 'Private LLM deployment on your infrastructure'  },
  { name: 'SmartCall AI',             desc: 'AI-powered call center automation at scale'      },
  { name: 'VoiceFlow Enterprise',     desc: 'Conversational voice agents for any workflow'    },
  { name: 'Enterprise RAG Platform',  desc: 'Private knowledge base + QnA engine'            },
  { name: 'AI Automation Studio',     desc: 'No-code workflow automation powered by AI'       },
  { name: 'AI Customer Support Suite',desc: 'GPT-powered helpdesk with live agent handoff'   },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  transition: { delay, duration: 0.4 },
})

export default function TrialDashboard({ session }) {
  const [activeNav,  setActiveNav]  = useState('overview')
  const [showModal,  setShowModal]  = useState(false)

  return (
    <>
      <DashboardLayout
        session={session}
        title="Dashboard"
        subtitle="Trial Account"
        navItems={NAV_ITEMS}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      >
        {/* ── Welcome / trial banner ── */}
        <motion.div {...fadeUp(0)} className="glass border border-brand-800/40 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-brand-900/40 to-accent-900/20">
          <div className="flex items-start sm:items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                  Trial Account
                </span>
                <span className="text-gray-400 text-sm">· 14 days remaining</span>
              </div>
              <h2 className="text-xl font-bold text-white">Welcome, {session?.username || 'there'}! 👋</h2>
              <p className="text-gray-400 text-sm mt-1 max-w-xl">
                Explore NexusAI's enterprise AI platform. Book a consultation to unlock full deployments, analytics, and your dedicated AI infrastructure.
              </p>
            </div>
            <button onClick={() => setShowModal(true)} className="btn-primary shrink-0">
              Book Consultation <ChevronRight size={15} />
            </button>
          </div>
        </motion.div>

        {/* ── Locked metrics ── */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
            Platform Metrics — Available after Enterprise Activation
          </p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {LOCKED_METRICS.map(({ label, icon: Icon, color, bg, border }, i) => (
              <motion.div
                key={label}
                {...fadeUp(i * 0.06)}
                className={`relative glass ${bg} border ${border} rounded-2xl p-5 overflow-hidden`}
              >
                {/* Lock overlay */}
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
                <div className="text-2xl font-extrabold text-white mb-1">–––</div>
                <div className="text-xs text-gray-400">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CTA cards ── */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            {...fadeUp(0.1)}
            className="glass border border-brand-700/30 rounded-2xl p-6 bg-gradient-to-br from-brand-900/30 to-transparent group hover:border-brand-500/50 transition-all cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center mb-4 shadow-glow-sm">
              <Calendar size={22} className="text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Book a Consultation</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Speak with a NexusAI solutions architect to scope your AI deployment roadmap and get a custom proposal.
            </p>
            <div className="flex items-center gap-2 text-brand-300 text-sm font-medium group-hover:gap-3 transition-all">
              Schedule now <ArrowRight size={14} />
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.15)}
            className="glass border border-accent-700/30 rounded-2xl p-6 bg-gradient-to-br from-accent-900/30 to-transparent group hover:border-accent-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-600 to-neon-pink flex items-center justify-center mb-4">
              <Star size={22} className="text-white" />
            </div>
            <h3 className="font-semibold text-white mb-2">Activate Enterprise Access</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Unlock Recharts dashboards, deployment tracking, AI Insights panel, Voice AI monitoring, and a dedicated SLA.
            </p>
            <div className="flex items-center gap-2 text-accent-300 text-sm font-medium group-hover:gap-3 transition-all">
              Contact Sales <ArrowRight size={14} />
            </div>
          </motion.div>
        </div>

        {/* ── Locked chart preview ── */}
        <motion.div
          {...fadeUp(0.2)}
          className="relative glass border border-white/10 rounded-2xl p-6 overflow-hidden"
          style={{ minHeight: '220px' }}
        >
          <div className="absolute inset-0 backdrop-blur-[5px] bg-gray-950/60 flex flex-col items-center justify-center z-10 rounded-2xl gap-3">
            <Lock size={28} className="text-gray-500" />
            <p className="text-gray-300 font-semibold">AI Usage Analytics</p>
            <p className="text-sm text-gray-500">Available on Premium & Enterprise plans</p>
            <button onClick={() => setShowModal(true)} className="btn-primary text-sm mt-1">
              Request Access
            </button>
          </div>
          {/* Ghost chart (behind blur) */}
          <h3 className="font-semibold text-white mb-4 opacity-20">AI API Calls — 12 Month Trend</h3>
          <div className="flex items-end gap-1.5 h-28 opacity-10">
            {[32, 41, 38, 52, 48, 61, 57, 72, 68, 81, 76, 94].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-brand-500" style={{ height: `${h}%` }} />
            ))}
          </div>
        </motion.div>

        {/* ── Enterprise products grid ── */}
        <motion.div {...fadeUp(0.25)} className="glass border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-1">Enterprise AI Products</h3>
          <p className="text-sm text-gray-500 mb-5">Included in your enterprise activation — starting at $5,000/mo</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ENTERPRISE_PRODUCTS.map(({ name, desc }) => (
              <div key={name} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all">
                <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white">{name}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </DashboardLayout>

      {showModal && (
        <ServiceRequestModal session={session} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
