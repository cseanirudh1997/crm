// ─────────────────────────────────────────────
//  PremiumClientDashboard — premium interior design client
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, ArrowUpRight, Home, CalendarCheck,
  Palette, LayoutDashboard, BarChart2, Lightbulb, Bell,
  CheckCircle, Clock, RefreshCw, ChevronRight, Star,
  Sparkles, ExternalLink, Package,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import DashboardLayout from './DashboardLayout'
import { fetchDashboardMetrics, fetchAIInsights, fetchPaymentLinks } from './api'

/* ── Nav ── */
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',         icon: LayoutDashboard },
  { id: 'projects',      label: 'My Projects',      icon: Home            },
  { id: 'consultations', label: 'Consultations',    icon: CalendarCheck   },
  { id: 'insights',      label: 'Design Insights',  icon: Lightbulb       },
  { id: 'trends',        label: 'Style Trends',     icon: BarChart2       },
  { id: 'payments',      label: 'Payments',         icon: Package         },
  { id: 'alerts',        label: 'Notifications',    icon: Bell            },
]

/* ── Mock: active design projects ── */
const MY_PROJECTS = [
  { id: 'P-01', name: '3BHK — Bandra West, Mumbai',  service: 'Full Home Interior',   area: '1,850 sq ft', stage: 'execution',   stageLabel: 'Execution',   pct: 72  },
  { id: 'P-02', name: 'Villa — Whitefield, Bengaluru',service: 'Luxury Villa Design',  area: '4,200 sq ft', stage: 'design',      stageLabel: 'Design',      pct: 45  },
  { id: 'P-03', name: 'Kitchen — DLF Cyber City',    service: 'Modular Kitchen',       area: '380 sq ft',   stage: 'completed',   stageLabel: 'Completed',   pct: 100 },
  { id: 'P-04', name: 'Penthouse — Juhu, Mumbai',    service: 'Premium Living Suite',  area: '2,600 sq ft', stage: 'consultation',stageLabel: 'Consultation',pct: 20  },
]

/* ── Mock: consultations ── */
const MY_CONSULTATIONS = [
  { id: 'C-01', type: 'Initial Design Brief',    designer: 'Aisha Kapoor',   date: '2026-06-04', time: '11:00 AM', status: 'confirmed' },
  { id: 'C-02', type: '3D Walkthrough Review',   designer: 'Rohan Mehta',    date: '2026-05-20', time: '2:00 PM',  status: 'completed' },
  { id: 'C-03', type: 'Material Selection',      designer: 'Priya Nair',     date: '2026-06-18', time: '10:00 AM', status: 'pending'   },
]

/* ── Project timeline chart — design phase progress ── */
const PHASE_TIMELINE = [
  { month: 'Jan', consultation: 2, design: 1, execution: 0, completed: 0 },
  { month: 'Feb', consultation: 1, design: 2, execution: 1, completed: 0 },
  { month: 'Mar', consultation: 0, design: 2, execution: 2, completed: 0 },
  { month: 'Apr', consultation: 1, design: 1, execution: 2, completed: 1 },
  { month: 'May', consultation: 2, design: 2, execution: 1, completed: 1 },
  { month: 'Jun', consultation: 1, design: 3, execution: 2, completed: 2 },
]

/* ── Style trend data ── */
const STYLE_POPULARITY = [
  { style: 'Warm Minimal', score: 92 },
  { style: 'Japandi',      score: 85 },
  { style: 'Neo-Classic',  score: 78 },
  { style: 'Contemporary', score: 74 },
  { style: 'Luxury Art',   score: 67 },
]

/* ── Stage config ── */
const STAGE_CONFIG = {
  pending:     { label: 'Pending',     cls: 'bg-gray-800/60 border-gray-700/40 text-gray-300',          bar: 'bg-gray-600'    },
  consultation:{ label: 'Consultation',cls: 'bg-accent-900/40 border-accent-700/40 text-accent-300',    bar: 'bg-accent-500'  },
  design:      { label: 'Design',      cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300',       bar: 'bg-brand-500'   },
  execution:   { label: 'Execution',   cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300',       bar: 'bg-amber-500'   },
  completed:   { label: 'Completed ✓', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300', bar: 'bg-emerald-500' },
}

const CONSULT_STATUS = {
  confirmed: { label: 'Confirmed', cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300',       icon: CalendarCheck },
  completed: { label: 'Completed', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300', icon: CheckCircle   },
  pending:   { label: 'Pending',   cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300',       icon: Clock         },
}

/* ── Metric card ── */
function MetricCard({ label, value, change, icon: Icon, color, loading }) {
  const up = change?.startsWith('+')
  return (
    <div className={`glass border ${color} rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
          color.includes('brand')   ? 'from-brand-600 to-brand-900'   :
          color.includes('emerald') ? 'from-emerald-600 to-emerald-900' :
          color.includes('accent')  ? 'from-accent-600 to-accent-900'  :
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

export default function PremiumClientDashboard({ session }) {
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
    { label: 'Active Projects',    value: metrics.activeProjects    ?? MY_PROJECTS.filter(p => p.stage !== 'completed').length, change: '+1 this month', icon: Home,        color: 'border-brand-700/30'   },
    { label: 'Consultations',      value: metrics.consultations     ?? MY_CONSULTATIONS.length,                                 change: '+1 upcoming',  icon: CalendarCheck,color: 'border-emerald-700/30'  },
    { label: 'Completed Designs',  value: metrics.completedDesigns  ?? MY_PROJECTS.filter(p => p.stage === 'completed').length, change: '1 this season',icon: Star,        color: 'border-accent-700/30'  },
    { label: 'Design Insights',    value: metrics.designInsights    ?? (insights.length || 6),                                 change: '2 new today',  icon: Lightbulb,   color: 'border-amber-700/30'   },
  ]

  return (
    <DashboardLayout
      session={session}
      title="Premium Dashboard"
      subtitle="Premium Client Account"
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
                    Premium Client
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow inline-block" />
                  <span className="text-emerald-400 text-xs font-medium">Active</span>
                </div>
                <h2 className="text-xl font-bold text-white">Welcome back, {session?.username || 'Client'}! ✨</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Your design journey is on track. {metrics.designInsights || 2} new AI style insights are ready for you.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setActiveNav('insights')} className="btn-ghost text-sm border border-brand-700/30 hover:border-brand-600/50 hover:bg-brand-950/30">
                  <Lightbulb size={14} /> Insights
                </button>
                <button onClick={() => setActiveNav('projects')} className="btn-primary text-sm">
                  <Home size={14} /> My Projects
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

          {/* Phase timeline chart */}
          <motion.div {...fadeUp(0.15)} className="glass border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white">Project Phase Timeline</h3>
                <p className="text-xs text-gray-500 mt-0.5">Projects by design stage — Jan to Jun 2026</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {[{ c: '#c99a1a', l: 'Design' }, { c: '#f59e0b', l: 'Execution' }, { c: '#10b981', l: 'Completed' }].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                    <span className="text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={PHASE_TIMELINE} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {[{ id: 'aDesign', c: '#c99a1a' }, { id: 'aExec', c: '#f59e0b' }, { id: 'aComp', c: '#10b981' }].map(({ id, c }) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="design"     name="Design"     stroke="#c99a1a" fill="url(#aDesign)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="execution"  name="Execution"  stroke="#f59e0b" fill="url(#aExec)"   strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="completed"  name="Completed"  stroke="#10b981" fill="url(#aComp)"   strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Summary tiles */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Top Design Style',    value: 'Warm Minimalism', sub: 'Trending in 2026 across luxury homes', icon: Sparkles,   color: 'text-brand-400'   },
              { label: 'Avg Project Timeline', value: '90–120 Days',    sub: 'From concept to completion',           icon: Clock,      color: 'text-emerald-400' },
              { label: 'Material Quality',    value: 'Grade A+',         sub: 'Verified premium-only suppliers',       icon: TrendingUp, color: 'text-sky-400'     },
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

      {/* ══ MY PROJECTS ══ */}
      {activeNav === 'projects' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">My Design Projects ({MY_PROJECTS.length})</h3>
            <span className="text-xs text-brand-400 font-medium">Sorted by latest activity</span>
          </div>
          <div className="space-y-4">
            {MY_PROJECTS.map((p, i) => {
              const stg = STAGE_CONFIG[p.stage] || STAGE_CONFIG.pending
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass border border-white/8 rounded-2xl p-5 hover:border-brand-800/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="text-sm font-bold text-white">{p.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{p.service} · {p.area}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${stg.cls} shrink-0`}>{stg.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${stg.bar}`}
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 font-semibold shrink-0">{p.pct}%</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ══ CONSULTATIONS ══ */}
      {activeNav === 'consultations' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Consultations</h3>
            <button
              onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-xs py-2 px-4"
            >
              <CalendarCheck size={13} /> Book New
            </button>
          </div>
          <div className="space-y-4">
            {MY_CONSULTATIONS.map((c, i) => {
              const s = CONSULT_STATUS[c.status]
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
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.status === 'completed' ? 'bg-emerald-900/40' : c.status === 'confirmed' ? 'bg-brand-900/40' : 'bg-amber-900/40'}`}>
                      <StatusIcon size={18} className={c.status === 'completed' ? 'text-emerald-300' : c.status === 'confirmed' ? 'text-brand-300' : 'text-amber-300'} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{c.type}</div>
                      <div className="text-xs text-gray-500 mt-0.5">with {c.designer}</div>
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

      {/* ══ DESIGN INSIGHTS ══ */}
      {activeNav === 'insights' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">AI Design Insights</h3>
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
                      <span className="text-xs font-semibold uppercase tracking-wide text-brand-400 bg-brand-900/30 border border-brand-800/30 px-2 py-0.5 rounded-full">
                        {insight.category}
                      </span>
                      {insight.trend && (
                        <span className="text-brand-400 font-black text-sm flex items-center gap-1">
                          {insight.trend} <ArrowUpRight size={13} />
                        </span>
                      )}
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1.5">{insight.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{insight.body}</p>
                    {insight.trendLabel && <div className="mt-3 text-xs text-gray-600 font-medium">{insight.trendLabel}</div>}
                  </motion.div>
                ))}
              </div>
            )
          }
        </motion.div>
      )}

      {/* ══ STYLE TRENDS ══ */}
      {activeNav === 'trends' && (
        <motion.div {...fadeUp(0)} className="space-y-6">
          {/* Phase trend */}
          <div className="glass border border-white/8 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Project Phase Activity — 2026</h3>
            <p className="text-xs text-gray-500 mb-5">Monthly active project counts per design stage</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={PHASE_TIMELINE}>
                <defs>
                  {[{ id: 'g1', c: '#c99a1a' }, { id: 'n1', c: '#f59e0b' }, { id: 'b1', c: '#10b981' }].map(({ id, c }) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="design"     name="Design"     stroke="#c99a1a" fill="url(#g1)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="execution"  name="Execution"  stroke="#f59e0b" fill="url(#n1)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="completed"  name="Completed"  stroke="#10b981" fill="url(#b1)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Style popularity bar chart */}
          <div className="glass border border-white/8 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Design Style Popularity Index</h3>
            <p className="text-xs text-gray-500 mb-5">Studio booking trends across styles — Q1/Q2 2026</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={STYLE_POPULARITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="style" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Popularity" fill="#c99a1a" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ══ PAYMENTS ══ */}
      {activeNav === 'payments' && (
        <motion.div {...fadeUp(0)}>
          <h2 className="text-lg font-bold text-white mb-1">Your Design Packages</h2>
          <p className="text-sm text-gray-400 mb-6">Manage your active design packages and explore upgrade options.</p>

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
                    <ul className="space-y-1.5 text-xs text-gray-400 flex-1">
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
                    Pay Now <ExternalLink size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass border border-white/10 rounded-2xl p-8 text-center">
              <Package size={32} className="text-brand-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">Payment Links Unavailable</h3>
              <p className="text-gray-400 text-sm mb-4">Please contact your design manager to set up payment links for your project.</p>
              <button
                onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                Contact Studio <ChevronRight size={14} />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ══ ALERTS / NOTIFICATIONS ══ */}
      {activeNav === 'alerts' && (
        <motion.div {...fadeUp(0)}>
          <h3 className="font-semibold text-white mb-5">Studio Notifications</h3>
          <div className="space-y-3">
            {[
              { title: 'Design Phase Update',        body: 'Your Bandra West project has moved to Execution phase. Site visits begin next week.',          time: '3h ago',  dot: 'bg-brand-500',   read: false },
              { title: 'New 3D Visualization Ready', body: 'Whitefield Villa — 3D walkthrough render is now available for your review.',                    time: '1d ago',  dot: 'bg-emerald-500', read: false },
              { title: 'AI Insight — Japandi Trend', body: 'Japandi fusion is up 34% in client bookings this quarter. Consider it for your living room.', time: '2d ago',  dot: 'bg-accent-500',  read: true  },
              { title: 'Consultation Scheduled',     body: 'Material selection session with Priya Nair confirmed for June 18 at 10:00 AM.',                time: '3d ago',  dot: 'bg-amber-500',   read: true  },
              { title: 'New Design Collection Live', body: 'Summer 2026 — Warm Minimalism Collection now available to explore in our studio catalog.',      time: '5d ago',  dot: 'bg-sky-500',     read: true  },
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
