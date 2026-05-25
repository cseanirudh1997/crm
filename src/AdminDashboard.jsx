// ─────────────────────────────────────────────
//  AdminDashboard — AI consulting studio operations
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, CalendarCheck, Brain,
  BarChart2, CheckCircle, Clock, AlertCircle, Loader2,
  ArrowUpRight, TrendingUp, Shield, Star, Mail,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import DashboardLayout from './DashboardLayout'
import { fetchDashboardMetrics } from './api'

/* ── Nav ── */
const NAV_ITEMS = [
  { id: 'overview',    label: 'Overview',          icon: LayoutDashboard },
  { id: 'bookings',    label: 'Bookings',           icon: CalendarCheck   },
  { id: 'engagements', label: 'Engagements',        icon: Brain           },
  { id: 'mentees',     label: 'Mentees & Clients',  icon: Users           },
  { id: 'analytics',   label: 'Analytics',          icon: BarChart2       },
]

/* ── Mock consultation/session bookings ── */
const MOCK_BOOKINGS = [
  { id: 'B-001', name: 'Priya Sharma',      email: 'priya@techcorp.in',  service: 'GenAI Mentorship Pack',   budget: '₹25,000',  status: 'confirmed',   submitted: '10m ago' },
  { id: 'B-002', name: 'Arjun Mehta',       email: 'arjun@startup.io',   service: 'AI Strategy Session',     budget: '₹8,000',   status: 'pending',     submitted: '2h ago'  },
  { id: 'B-003', name: 'Divya Krishnan',    email: 'divya@bank.in',      service: 'FAANG Prep Sprint',        budget: '₹45,000',  status: 'in_progress', submitted: '1d ago'  },
  { id: 'B-004', name: 'Rohan Nair',        email: 'rohan@fintech.com',  service: 'Enterprise AI Workshop',  budget: '₹1,20,000',status: 'completed',   submitted: '2d ago'  },
  { id: 'B-005', name: 'Sneha Gupta',       email: 'sneha@ecomm.in',     service: 'GenAI Mentorship Pack',   budget: '₹25,000',  status: 'confirmed',   submitted: '4d ago'  },
  { id: 'B-006', name: 'Karan Verma',       email: 'karan@saas.io',      service: 'AI Strategy Session',     budget: '₹8,000',   status: 'pending',     submitted: '5h ago'  },
]

/* ── Mock active AI consulting engagements ── */
const MOCK_ENGAGEMENTS = [
  { id: 'E-001', name: 'GenAI & RAG System Design',     client: 'Priya Sharma',   service: 'GenAI Mentorship Pack', stage: 'active',    sessions: '2 / 4', focus: 'LangChain + RAG' },
  { id: 'E-002', name: 'FAANG ML System Design Prep',   client: 'Divya Krishnan', service: 'FAANG Prep Sprint',     stage: 'active',    sessions: '3 / 8', focus: 'System Design'   },
  { id: 'E-003', name: 'Enterprise Pricing AI Workshop', client: 'Rohan Nair',    service: 'Enterprise Workshop',   stage: 'completed', sessions: '3 / 3', focus: 'ML Ensemble'     },
  { id: 'E-004', name: 'AI Career Roadmap',             client: 'Sneha Gupta',    service: 'GenAI Mentorship Pack', stage: 'strategy',  sessions: '0 / 4', focus: 'Roadmap'         },
  { id: 'E-005', name: 'MLOps Feature Store Design',    client: 'Arjun Mehta',    service: 'AI Strategy Session',   stage: 'pending',   sessions: '0 / 1', focus: 'MLOps'           },
  { id: 'E-006', name: 'Fraud Detection ML System',     client: 'Karan Verma',    service: 'AI Strategy Session',   stage: 'pending',   sessions: '0 / 1', focus: 'ML Engineering'  },
]

/* ── Mock mentees & clients ── */
const MOCK_MENTEES = [
  { id: 'M-001', name: 'Priya Sharma',    tier: 'premium', sessions: 2,  since: 'Jan 2025', status: 'active',    outcome: 'FAANG-track'   },
  { id: 'M-002', name: 'Divya Krishnan', tier: 'premium', sessions: 3,  since: 'Oct 2024', status: 'active',    outcome: 'Senior role'   },
  { id: 'M-003', name: 'Rohan Nair',     tier: 'client',  sessions: 3,  since: 'Mar 2025', status: 'completed', outcome: 'Placed @ FAANG'},
  { id: 'M-004', name: 'Sneha Gupta',    tier: 'premium', sessions: 0,  since: 'Feb 2026', status: 'new',       outcome: 'Onboarding'    },
  { id: 'M-005', name: 'Arjun Mehta',    tier: 'client',  sessions: 0,  since: 'Apr 2026', status: 'new',       outcome: 'Strategy'      },
  { id: 'M-006', name: 'Karan Verma',    tier: 'client',  sessions: 0,  since: 'May 2026', status: 'new',       outcome: 'Inquiry'       },
]

/* ── AI engagement pipeline stages ── */
const PIPELINE_STAGES = [
  { stage: 'pending',   label: 'Pending',   count: 2, color: 'bg-gray-500'   },
  { stage: 'strategy',  label: 'Strategy',  count: 1, color: 'bg-accent-500' },
  { stage: 'active',    label: 'Active',    count: 2, color: 'bg-brand-500'  },
  { stage: 'delivery',  label: 'Delivery',  count: 1, color: 'bg-amber-500'  },
  { stage: 'completed', label: 'Completed', count: 1, color: 'bg-emerald-500'},
]

/* ── Monthly bookings & engagements chart ── */
const ANALYTICS_CHART = [
  { month: 'Nov', bookings: 6,  engagements: 3  },
  { month: 'Dec', bookings: 9,  engagements: 5  },
  { month: 'Jan', bookings: 11, engagements: 7  },
  { month: 'Feb', bookings: 10, engagements: 6  },
  { month: 'Mar', bookings: 14, engagements: 9  },
  { month: 'Apr', bookings: 18, engagements: 11 },
  { month: 'May', bookings: 22, engagements: 14 },
]

/* ── Status maps ── */
const BOOKING_STATUS_MAP = {
  pending:     { label: 'Pending',     cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'          },
  confirmed:   { label: 'Confirmed',   cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300'       },
  in_progress: { label: 'In Progress', cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'       },
  completed:   { label: 'Completed ✓', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
  cancelled:   { label: 'Cancelled',   cls: 'bg-red-900/40 border-red-700/40 text-red-300'             },
}

const ENGAGEMENT_STAGE_MAP = {
  pending:   { label: 'Pending',   cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'          },
  strategy:  { label: 'Strategy',  cls: 'bg-accent-900/40 border-accent-700/40 text-accent-300'    },
  active:    { label: 'Active',    cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300'       },
  delivery:  { label: 'Delivery',  cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'       },
  completed: { label: 'Completed ✓', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
}

const MENTEE_STATUS_MAP = {
  active:    { label: 'Active',    cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
  new:       { label: 'New',       cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300'       },
  completed: { label: 'Completed', cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'          },
}

/* ── Shared badge ── */
function Badge({ value, map }) {
  const { label, cls } = map[value] || { label: value, cls: 'bg-gray-800 text-gray-400 border-gray-700' }
  return <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${cls}`}>{label}</span>
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  transition: { delay, duration: 0.4 },
})

/* ════════════════════════════════════════
   AdminDashboard
   ════════════════════════════════════════ */
export default function AdminDashboard({ session }) {
  const [activeNav, setActiveNav] = useState('overview')
  const [metrics,   setMetrics]   = useState(null)
  const [loading,   setLoading]   = useState(true)

  async function loadData() {
    setLoading(true)
    const m = await fetchDashboardMetrics(session?.username)
    setMetrics(m.metrics || {})
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  /* ── Derived totals ── */
  const totalBookings      = MOCK_BOOKINGS.length
  const pendingBookings    = MOCK_BOOKINGS.filter(b => b.status === 'pending').length
  const confirmedBookings  = MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length
  const activeEngagements  = MOCK_ENGAGEMENTS.filter(e => e.stage !== 'completed').length
  const completedEngagements = MOCK_ENGAGEMENTS.filter(e => e.stage === 'completed').length

  const ADMIN_METRICS = [
    { label: 'Total Bookings',       value: totalBookings,       sub: `${pendingBookings} pending`,          icon: CalendarCheck, color: 'from-brand-600 to-brand-800',    bg: 'bg-brand-900/20',   border: 'border-brand-700/30',   change: '+28%' },
    { label: 'Active Engagements',   value: activeEngagements,   sub: 'in-progress',                         icon: Brain,         color: 'from-emerald-600 to-emerald-800', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30', change: '+15%' },
    { label: 'Completed Sessions',   value: completedEngagements,sub: 'this quarter',                        icon: Star,          color: 'from-accent-600 to-accent-800',   bg: 'bg-accent-900/20',  border: 'border-accent-700/30',  change: '+9%'  },
    { label: 'Total Mentees',        value: MOCK_MENTEES.length, sub: `${MOCK_MENTEES.filter(m => m.tier === 'premium').length} premium`, icon: Users, color: 'from-teal-600 to-teal-800', bg: 'bg-teal-900/20', border: 'border-teal-700/30', change: '+4'  },
  ]

  /* ── Shared metric cards ── */
  const MetricCards = (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {ADMIN_METRICS.map(({ label, value, sub, icon: Icon, color, bg, border, change }, i) => (
        <motion.div
          key={label}
          {...fadeUp(i * 0.06)}
          className={`glass ${bg} border ${border} rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
              {loading ? <Loader2 size={18} className="text-white animate-spin" /> : <Icon size={18} className="text-white" />}
            </div>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
              <ArrowUpRight size={13} /> {change}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white mb-0.5">{loading ? '—' : value}</div>
          <div className="text-xs text-gray-400 font-medium">{label}</div>
          <div className="text-xs text-gray-600 mt-0.5">{sub}</div>
        </motion.div>
      ))}
    </div>
  )

  /* ── Engagement pipeline panel ── */
  const EngagementPipeline = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
      <h3 className="font-semibold text-white mb-0.5">Engagement Pipeline</h3>
      <p className="text-xs text-gray-500 mb-5">Active AI consulting engagements by stage</p>
      <div className="flex flex-wrap gap-3 mb-5">
        {PIPELINE_STAGES.map(({ label, count, color }) => (
          <div key={label} className="flex-1 min-w-[80px] p-4 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{count}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <BarChart data={PIPELINE_STAGES} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="count" name="Engagements" radius={[4, 4, 0, 0]}>
            {PIPELINE_STAGES.map((_, i) => (
              <Cell key={i} fill={['#6b7280','#b8915a','#c99a1a','#f59e0b','#10b981'][i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )

  /* ── Bookings table ── */
  const BookingsTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Consultation Bookings</h3>
          <p className="text-xs text-gray-500 mt-0.5">{totalBookings} total · {pendingBookings} need follow-up</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['ID', 'Name', 'Email', 'Service', 'Budget', 'Status', 'Received'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_BOOKINGS.map((b) => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{b.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{b.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{b.email}</td>
                <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{b.service}</td>
                <td className="px-4 py-3 text-sm text-brand-300 whitespace-nowrap font-medium">{b.budget}</td>
                <td className="px-4 py-3"><Badge value={b.status} map={BOOKING_STATUS_MAP} /></td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{b.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  /* ── Engagements table ── */
  const EngagementsTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">AI Consulting Engagements</h3>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_ENGAGEMENTS.length} total · {activeEngagements} active</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['Engagement', 'Client', 'Service', 'Sessions', 'Focus', 'Stage'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_ENGAGEMENTS.map((e) => (
              <tr key={e.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{e.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{e.client}</td>
                <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{e.service}</td>
                <td className="px-4 py-3 text-sm text-brand-300 whitespace-nowrap font-medium">{e.sessions}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{e.focus}</td>
                <td className="px-4 py-3"><Badge value={e.stage} map={ENGAGEMENT_STAGE_MAP} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  /* ── Mentees table ── */
  const MenteesTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Mentees & Clients</h3>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_MENTEES.length} registered</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['ID', 'Name', 'Tier', 'Sessions', 'Since', 'Outcome', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_MENTEES.map((m) => (
              <tr key={m.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{m.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{m.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                    m.tier === 'premium'
                      ? 'bg-brand-900/40 border-brand-700/40 text-brand-300'
                      : 'bg-gray-800/60 border-gray-700/40 text-gray-400'
                  }`}>
                    {m.tier === 'premium' ? '⭐ Premium' : 'Client'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 text-center">{m.sessions}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{m.since}</td>
                <td className="px-4 py-3 text-xs text-emerald-400 font-medium whitespace-nowrap">{m.outcome}</td>
                <td className="px-4 py-3"><Badge value={m.status} map={MENTEE_STATUS_MAP} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  return (
    <DashboardLayout
      session={session}
      title="Admin Dashboard"
      subtitle="AI Consulting Studio Operations"
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onRefresh={loadData}
    >

      {/* ══ OVERVIEW ══ */}
      {activeNav === 'overview' && (
        <>
          {/* Welcome banner */}
          <motion.div {...fadeUp(0)} className="glass border border-brand-800/40 rounded-2xl p-5 bg-gradient-to-r from-brand-900/40 to-accent-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-glow-sm">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold uppercase tracking-wide">Admin</span>
                  <span className="text-gray-400 text-xs">Full studio access</span>
                </div>
                <h2 className="font-bold text-white">Welcome, {session?.username}. Manage bookings, engagements, and mentees below.</h2>
              </div>
            </div>
          </motion.div>

          {MetricCards}
          {EngagementPipeline}

          {/* Quick nav cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Pending Bookings',     count: pendingBookings,    sub: 'need follow-up',  nav: 'bookings',    color: 'text-amber-400'   },
              { label: 'Active Engagements',   count: activeEngagements,  sub: 'in-progress',     nav: 'engagements', color: 'text-brand-400'   },
              { label: 'Total Mentees',        count: MOCK_MENTEES.length,sub: 'registered',      nav: 'mentees',     color: 'text-emerald-400' },
            ].map(({ label, count, sub, nav, color }) => (
              <button
                key={label}
                onClick={() => setActiveNav(nav)}
                className="glass border border-white/10 rounded-2xl p-5 text-left hover:-translate-y-1 hover:border-brand-700/40 transition-all duration-200 group"
              >
                <div className={`text-2xl font-extrabold mb-1 ${color}`}>{count}</div>
                <div className="text-sm font-semibold text-white">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  {sub} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ══ BOOKINGS ══ */}
      {activeNav === 'bookings' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Consultation Bookings</h2>
            <p className="text-sm text-gray-400 mb-5">All inbound mentorship and consulting service requests.</p>
          </motion.div>
          {pendingBookings > 0 && (
            <motion.div {...fadeUp(0.03)} className="flex items-center gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/40 text-amber-300 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{pendingBookings} booking(s) awaiting confirmation — respond within 24 hours.</span>
            </motion.div>
          )}
          {BookingsTable}
        </>
      )}

      {/* ══ ENGAGEMENTS ══ */}
      {activeNav === 'engagements' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">AI Consulting Engagements</h2>
            <p className="text-sm text-gray-400 mb-5">All active and completed mentorship and consulting engagements.</p>
          </motion.div>
          {EngagementPipeline}
          {EngagementsTable}
        </>
      )}

      {/* ══ MENTEES ══ */}
      {activeNav === 'mentees' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Mentees & Clients</h2>
            <p className="text-sm text-gray-400 mb-5">All registered mentees and consulting clients.</p>
          </motion.div>
          {MenteesTable}
        </>
      )}

      {/* ══ ANALYTICS ══ */}
      {activeNav === 'analytics' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Studio Analytics</h2>
            <p className="text-sm text-gray-400 mb-5">Monthly booking and engagement activity trends.</p>
          </motion.div>

          {MetricCards}

          {/* Bookings vs Engagements chart */}
          <motion.div {...fadeUp(0.1)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-semibold text-white mb-0.5">Bookings &amp; Engagements — Last 7 Months</h3>
            <p className="text-xs text-gray-500 mb-5">Monthly consultation bookings and new engagement starts</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ANALYTICS_CHART} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="bookings"    name="Bookings"     radius={[4,4,0,0]} fill="#c99a1a" />
                <Bar dataKey="engagements" name="Engagements"  radius={[4,4,0,0]} fill="#5eead4" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 justify-center">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#c99a1a]" /><span className="text-xs text-gray-400">Bookings</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#5eead4]" /><span className="text-xs text-gray-400">Engagements</span></div>
            </div>
          </motion.div>

          {EngagementPipeline}
        </>
      )}

    </DashboardLayout>
  )
}
