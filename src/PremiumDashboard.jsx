// ─────────────────────────────────────────────
//  AIPremiumDashboard — AI executive command center (premium mentorship client)
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, ArrowUpRight, Brain, CalendarCheck,
  BookOpen, LayoutDashboard, BarChart2, Lightbulb, Bell,
  CheckCircle, Clock, RefreshCw, ChevronRight, Users,
  Sparkles, ExternalLink, Package, Eye, Mail,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import DashboardLayout from './DashboardLayout'
import { fetchDashboardMetrics, fetchAIInsights, fetchPaymentLinks } from './api'

/* ── Nav ── */
const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',           icon: LayoutDashboard },
  { id: 'sessions',   label: 'Mentorship Sessions', icon: Users           },
  { id: 'calls',      label: 'Strategy Calls',      icon: CalendarCheck   },
  { id: 'insights',   label: 'AI Insights',         icon: Lightbulb       },
  { id: 'analytics',  label: 'Platform Analytics',  icon: BarChart2       },
  { id: 'payments',   label: 'AI Services',         icon: Package         },
  { id: 'alerts',     label: 'Notifications',       icon: Bell            },
]

/* ── Mock: mentorship sessions ── */
const MY_SESSIONS = [
  { id: 'S-01', topic: 'GenAI & RAG System Design',      type: 'Mentorship',     date: '2026-06-04', mentor: 'VN',  status: 'confirmed', pct: 100 },
  { id: 'S-02', topic: 'Pricing AI — ML Ensemble Design', type: 'Deep Dive',      date: '2026-05-20', mentor: 'VN',  status: 'completed', pct: 100 },
  { id: 'S-03', topic: 'MLOps: Feature Store Setup',     type: 'Technical',      date: '2026-06-18', mentor: 'VN',  status: 'pending',   pct: 0   },
  { id: 'S-04', topic: 'Mock System Design Interview',   type: 'Interview Prep', date: '2026-06-25', mentor: 'VN',  status: 'pending',   pct: 0   },
]

/* ── Mock: strategy calls ── */
const MY_CALLS = [
  { id: 'SC-01', type: 'AI Career Roadmap Review',   mentor: 'Senior Data Scientist', date: '2026-06-04', time: '11:00 AM', status: 'confirmed' },
  { id: 'SC-02', type: 'FAANG Interview Debrief',    mentor: 'Senior Data Scientist', date: '2026-05-22', time: '2:00 PM',  status: 'completed' },
  { id: 'SC-03', type: 'ML System Design Strategy',  mentor: 'Senior Data Scientist', date: '2026-06-20', time: '10:00 AM', status: 'pending'   },
]

/* ── Newsletter growth chart ── */
const NEWSLETTER_GROWTH = [
  { month: 'Nov', subscribers: 980,  views: 3200, calls: 8  },
  { month: 'Dec', subscribers: 1050, views: 3800, calls: 10 },
  { month: 'Jan', subscribers: 1120, views: 4100, calls: 12 },
  { month: 'Feb', subscribers: 1185, views: 4600, calls: 11 },
  { month: 'Mar', subscribers: 1240, views: 5200, calls: 15 },
  { month: 'Apr', subscribers: 1300, views: 6100, calls: 18 },
  { month: 'May', subscribers: 1342, views: 7800, calls: 22 },
]

/* ── AI topic popularity ── */
const TOPIC_POPULARITY = [
  { topic: 'GenAI / LLMs',   score: 94 },
  { topic: 'Pricing AI',     score: 87 },
  { topic: 'MLOps',          score: 79 },
  { topic: 'NLP',            score: 73 },
  { topic: 'Forecasting',    score: 68 },
]

/* ── Session stage config ── */
const SESSION_CONFIG = {
  pending:   { label: 'Upcoming',    cls: 'bg-gray-800/60 border-gray-700/40 text-gray-300',          bar: 'bg-gray-600'    },
  confirmed: { label: 'Confirmed',   cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300',       bar: 'bg-brand-500'   },
  completed: { label: 'Completed ✓', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300', bar: 'bg-emerald-500' },
}

const CALL_STATUS = {
  confirmed: { label: 'Confirmed', cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300',       icon: CalendarCheck },
  completed: { label: 'Completed', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300', icon: CheckCircle   },
  pending:   { label: 'Pending',   cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300',       icon: Clock         },
}

/* ── Metric card ── */
function MetricCard({ label, value, change, icon: Icon, color, loading }) {
  const up = !change?.startsWith('-')
  return (
    <div className={`glass border ${color} rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
          color.includes('brand')   ? 'from-brand-600 to-brand-900'     :
          color.includes('emerald') ? 'from-emerald-600 to-emerald-900' :
          color.includes('accent')  ? 'from-accent-600 to-accent-900'   :
          'from-amber-600 to-amber-900'
        } flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
            {up && <ArrowUpRight size={12} />}
            {change}
          </span>
        )}
      </div>
      {loading
        ? <div className="shimmer h-7 w-16 rounded-lg bg-white/5" />
        : <div className="text-2xl font-extrabold text-white">{value}</div>
      }
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

/* ── Custom chart tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-dark border border-white/10 rounded-xl p-3 text-xs shadow-glass">
      <div className="text-gray-400 mb-1.5 font-medium">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  transition: { delay, duration: 0.4 },
})

export default function AIPremiumDashboard({ session }) {
  const [activeNav,  setActiveNav]  = useState('overview')
  const [metrics,    setMetrics]    = useState({})
  const [insights,   setInsights]   = useState([])
  const [payLinks,   setPayLinks]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [payLoading, setPayLoading] = useState(false)

  async function loadData() {
    setLoading(true)
    const [mRes, iRes] = await Promise.all([
      fetchDashboardMetrics(session?.username),
      fetchAIInsights(),
    ])
    setMetrics(mRes.metrics || {})
    setInsights(iRes.insights || [])
    setLoading(false)
  }

  async function loadPayLinks() {
    setPayLoading(true)
    try {
      const res = await fetchPaymentLinks()
      setPayLinks(res.paymentLinks || [])
    } catch { setPayLinks([]) }
    setPayLoading(false)
  }

  useEffect(() => { loadData() }, [])
  useEffect(() => { if (activeNav === 'payments') loadPayLinks() }, [activeNav])

  const METRIC_CARDS = [
    { label: 'Profile Views',         value: metrics.profileViews          ?? 1284, change: '+18% this month', icon: Eye,          color: 'border-brand-700/30'   },
    { label: 'Mentorship Calls',       value: metrics.mentorshipCalls       ?? 48,   change: '+4 this month',   icon: Users,        color: 'border-emerald-700/30' },
    { label: 'Consultation Bookings',  value: metrics.bookings              ?? 12,   change: '+2 this week',    icon: CalendarCheck,color: 'border-accent-700/30'  },
    { label: 'Newsletter Subscribers', value: metrics.newsletterSubscribers ?? 1342, change: '+42 this month',  icon: Mail,         color: 'border-amber-700/30'   },
  ]

  return (
    <DashboardLayout
      session={session}
      title="AI Command Center"
      subtitle="Premium Mentorship Account"
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onRefresh={loadData}
    >

      {/* ══ OVERVIEW ══ */}
      {activeNav === 'overview' && (
        <>
          {/* Welcome */}
          <motion.div {...fadeUp(0)} className="glass border border-brand-800/30 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-brand-950/60 to-gray-900/20">
            <div className="flex items-start sm:items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-semibold tracking-wide uppercase">
                    Premium Member
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow inline-block" />
                  <span className="text-emerald-400 text-xs font-medium">Active</span>
                </div>
                <h2 className="text-xl font-bold text-white">Welcome back, {session?.username || 'Mentee'}! 🚀</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Your AI journey is on track. {metrics.mentorshipCalls || 2} mentorship calls completed this month.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setActiveNav('insights')} className="btn-ghost text-sm border border-brand-700/30 hover:border-brand-600/50 hover:bg-brand-950/30">
                  <Lightbulb size={14} /> Insights
                </button>
                <button onClick={() => setActiveNav('sessions')} className="btn-primary text-sm">
                  <Users size={14} /> My Sessions
                </button>
              </div>
            </div>
          </motion.div>

          {/* Metric cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {METRIC_CARDS.map(({ label, value, change, icon, color }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)}>
                <MetricCard label={label} value={value} change={change} icon={icon} color={color} loading={loading} />
              </motion.div>
            ))}
          </div>

          {/* Newsletter growth area chart */}
          <motion.div {...fadeUp(0.15)} className="glass border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white">Platform Growth — Last 7 Months</h3>
                <p className="text-xs text-gray-500 mt-0.5">Newsletter subscribers, profile views & mentorship calls</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {[{ c: '#c99a1a', l: 'Subscribers' }, { c: '#5eead4', l: 'Profile Views (÷10)' }, { c: '#10b981', l: 'Calls' }].map(({ c, l }) => (
                  <div key={l} className="hidden sm:flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                    <span className="text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={NEWSLETTER_GROWTH} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {[{ id: 'aSub', c: '#c99a1a' }, { id: 'aView', c: '#5eead4' }, { id: 'aCall', c: '#10b981' }].map(({ id, c }) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="subscribers" name="Subscribers"        stroke="#c99a1a" fill="url(#aSub)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="views"       name="Profile Views (÷10)" stroke="#5eead4" fill="url(#aView)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="calls"       name="Calls"              stroke="#10b981" fill="url(#aCall)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Summary tiles */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Top Requested Topic', value: 'GenAI / LLMs',      sub: '94% engagement rate in 2026',           icon: Brain,       color: 'text-brand-400'   },
              { label: 'Avg Session Rating',  value: '4.9 / 5.0',         sub: 'Across 50+ mentorship sessions',         icon: Sparkles,    color: 'text-emerald-400' },
              { label: 'Mentee Placement',    value: '90% FAANG / Tier-1', sub: 'Within 6 months of mentorship',         icon: TrendingUp,  color: 'text-sky-400'     },
            ].map(({ label, value, sub, icon: Icon, color }) => (
              <motion.div key={label} {...fadeUp(0.2)} className="glass border border-white/8 rounded-2xl p-5 hover:border-brand-800/30 transition-colors">
                <Icon size={18} className={`${color} mb-3`} />
                <div className="text-xl font-extrabold text-white mb-0.5">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
                <div className="text-xs text-gray-600 mt-1">{sub}</div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* ══ MENTORSHIP SESSIONS ══ */}
      {activeNav === 'sessions' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">My Mentorship Sessions ({MY_SESSIONS.length})</h3>
            <span className="text-xs text-brand-400 font-medium">Sorted by date</span>
          </div>
          <div className="space-y-4">
            {MY_SESSIONS.map((s, i) => {
              const cfg = SESSION_CONFIG[s.status] || SESSION_CONFIG.pending
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass border border-white/8 rounded-2xl p-5 hover:border-brand-800/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="text-sm font-bold text-white">{s.topic}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.type} · {s.date} · with {s.mentor}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls} shrink-0`}>{cfg.label}</span>
                  </div>
                  {s.status === 'completed' && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`} style={{ width: '100%' }} />
                      </div>
                      <span className="text-xs text-gray-400 font-semibold shrink-0">Done</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ══ STRATEGY CALLS ══ */}
      {activeNav === 'calls' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Strategy Calls</h3>
            <button
              onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-xs py-2 px-4"
            >
              <CalendarCheck size={13} /> Book New
            </button>
          </div>
          <div className="space-y-4">
            {MY_CALLS.map((c, i) => {
              const s = CALL_STATUS[c.status]
              const StatusIcon = s.icon
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass border border-white/8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between hover:border-brand-800/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      c.status === 'completed' ? 'bg-emerald-900/40' : c.status === 'confirmed' ? 'bg-brand-900/40' : 'bg-amber-900/40'
                    }`}>
                      <StatusIcon size={18} className={c.status === 'completed' ? 'text-emerald-300' : c.status === 'confirmed' ? 'text-brand-300' : 'text-amber-300'} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{c.type}</div>
                      <div className="text-xs text-gray-500 mt-0.5">with {c.mentor}</div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>📅 {c.date}</span>
                        <span>⏰ {c.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${s.cls} shrink-0`}>{s.label}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ══ AI INSIGHTS ══ */}
      {activeNav === 'insights' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">AI Platform Insights</h3>
            <button onClick={loadData} className="w-8 h-8 glass rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <RefreshCw size={13} />
            </button>
          </div>
          {loading
            ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-24 rounded-2xl bg-white/5" />)}</div>
            : (
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <motion.div
                    key={insight.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass border border-white/8 rounded-2xl p-5 hover:border-brand-800/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                        (insight.severity || insight.category) === 'critical' || (insight.severity || insight.category) === 'alert'
                          ? 'text-red-400 bg-red-900/30 border-red-800/30'
                          : (insight.severity || insight.category) === 'warning'
                          ? 'text-amber-400 bg-amber-900/30 border-amber-800/30'
                          : 'text-brand-400 bg-brand-900/30 border-brand-800/30'
                      }`}>
                        {insight.category || insight.severity || 'Insight'}
                      </span>
                      {insight.trend && (
                        <span className="text-brand-400 font-black text-sm flex items-center gap-1">
                          {insight.trend} <ArrowUpRight size={13} />
                        </span>
                      )}
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1.5">{insight.title || 'AI Insight'}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{insight.body || insight.insight}</p>
                    {insight.trendLabel && <div className="mt-3 text-xs text-gray-600 font-medium">{insight.trendLabel}</div>}
                  </motion.div>
                ))}
              </div>
            )
          }
        </motion.div>
      )}

      {/* ══ PLATFORM ANALYTICS ══ */}
      {activeNav === 'analytics' && (
        <motion.div {...fadeUp(0)} className="space-y-6">
          {/* Newsletter + calls area chart */}
          <div className="glass border border-white/8 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Platform Growth — 2026</h3>
            <p className="text-xs text-gray-500 mb-5">Newsletter subscribers and mentorship call volume</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={NEWSLETTER_GROWTH}>
                <defs>
                  {[{ id: 'g1', c: '#c99a1a' }, { id: 'g2', c: '#10b981' }].map(({ id, c }) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="subscribers" name="Subscribers"  stroke="#c99a1a" fill="url(#g1)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="calls"       name="Calls × 50"   stroke="#10b981" fill="url(#g2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI topic popularity bar chart */}
          <div className="glass border border-white/8 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">AI Topic Demand Index</h3>
            <p className="text-xs text-gray-500 mb-5">Session and inquiry popularity by AI domain — Q1/Q2 2026</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={TOPIC_POPULARITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="topic" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Demand" fill="#c99a1a" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ══ AI SERVICES (PAYMENTS) ══ */}
      {activeNav === 'payments' && (
        <motion.div {...fadeUp(0)}>
          <h2 className="text-lg font-bold text-white mb-1">AI Mentorship Services</h2>
          <p className="text-sm text-gray-400 mb-6">Manage your active packages and explore new AI consulting services.</p>

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
                    <ul className="space-y-1.5 text-xs text-gray-400 flex-1">
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
                    Pay Now <ExternalLink size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass border border-white/10 rounded-2xl p-8 text-center">
              <Package size={32} className="text-brand-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">Service Links Unavailable</h3>
              <p className="text-gray-400 text-sm mb-4">Please book a free strategy call to discuss mentorship package options.</p>
              <button
                onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                Book Strategy Call <ChevronRight size={14} />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ══ NOTIFICATIONS ══ */}
      {activeNav === 'alerts' && (
        <motion.div {...fadeUp(0)}>
          <h3 className="font-semibold text-white mb-5">Platform Notifications</h3>
          <div className="space-y-3">
            {[
              { title: 'New Article Published — Pricing AI',          body: 'Your RAG vs Fine-Tuning article crossed 10K reads on Towards Data Science.',                   time: '2h ago',  dot: 'bg-brand-500',   read: false },
              { title: 'Mentorship Session Confirmed',                 body: 'GenAI & RAG System Design session confirmed for June 4 at 11:00 AM.',                           time: '1d ago',  dot: 'bg-emerald-500', read: false },
              { title: 'Newsletter Milestone — 1,300+ Subscribers',   body: 'Your weekly AI newsletter just crossed 1,300 active subscribers. Strong engagement this week.',  time: '2d ago',  dot: 'bg-accent-500',  read: false },
              { title: 'Strategy Call Reminder',                       body: 'ML System Design Strategy call with mentee scheduled for June 20 at 10:00 AM.',                  time: '3d ago',  dot: 'bg-amber-500',   read: true  },
              { title: 'New Mentee Inquiry',                           body: 'A new FAANG prep inquiry received from a senior engineer at a Series-B startup.',                time: '4d ago',  dot: 'bg-sky-500',     read: true  },
            ].map(({ title, body, time, dot, read }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`glass border rounded-2xl p-4 flex items-start gap-3 transition-all ${
                  read ? 'border-white/5 opacity-60' : 'border-brand-800/30 hover:border-brand-700/40'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${read ? 'bg-gray-600' : dot}`} />
                <div>
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{body}</div>
                  <div className="text-xs text-gray-600 mt-1.5">{time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

    </DashboardLayout>
  )
}
