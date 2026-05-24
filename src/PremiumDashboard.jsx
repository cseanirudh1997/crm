// ─────────────────────────────────────────────
//  InvestorDashboard — Premium / verified investor view
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, ArrowUpRight, ArrowDownRight, Heart, CalendarCheck,
  Building2, LayoutDashboard, BarChart2, Lightbulb, Bell, MapPin,
  CheckCircle, Clock, Shield, Star, RefreshCw, ChevronRight,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import DashboardLayout from './DashboardLayout'
import { fetchDashboardMetrics, fetchAIInsights } from './api'

/* ── Nav ── */
const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',        icon: LayoutDashboard },
  { id: 'saved',     label: 'Saved Projects',   icon: Heart           },
  { id: 'visits',    label: 'Site Visits',      icon: CalendarCheck   },
  { id: 'insights',  label: 'AI Insights',      icon: Lightbulb       },
  { id: 'trends',    label: 'Market Trends',    icon: BarChart2       },
  { id: 'alerts',    label: 'Notifications',    icon: Bell            },
]

/* ── Mock: saved projects ── */
const SAVED_PROJECTS = [
  { id: 'p1', name: 'The Arbour',             builder: 'DLF',      city: 'Gurugram', price: '₹4.5 Cr+', possession: 'Ready', status: 'saved',      tag: 'Golf Course View' },
  { id: 'p3', name: 'Lodha Bellavista',       builder: 'Lodha',    city: 'Noida',    price: '₹3.8 Cr+', possession: 'Mar 2026', status: 'interested', tag: 'Villa Community' },
  { id: 'p5', name: 'Smartworld One DXP',     builder: 'Smartworld',city:'Bengaluru', price: '₹5.2 Cr+', possession: 'Dec 2026', status: 'saved',     tag: 'Ultra Luxury'   },
  { id: 'p6', name: 'Lodha Park',             builder: 'Lodha',    city: 'Mumbai',   price: '₹12 Cr+',  possession: 'Ready', status: 'visit_done', tag: 'Sea Facing'      },
  { id: 'p4', name: 'Prestige Lakeside',      builder: 'Prestige', city: 'Bengaluru',price: '₹1.8 Cr+', possession: 'Jun 2025', status: 'interested',tag: 'Lakeside'       },
  { id: 'p7', name: 'My Home Avatar',         builder: 'My Home',  city: 'Hyderabad',price: '₹1.4 Cr+', possession: 'Sep 2026', status: 'saved',     tag: 'HITEC City'     },
]

/* ── Mock: site visits ── */
const SITE_VISITS = [
  { id: 'v1', project: 'The Arbour', builder: 'DLF',      city: 'Gurugram', date: '2026-06-08', slot: 'Morning (10AM–1PM)', status: 'confirmed' },
  { id: 'v2', project: 'Lodha Park', builder: 'Lodha',    city: 'Mumbai',   date: '2026-05-18', slot: 'Afternoon (2PM–5PM)',status: 'completed' },
  { id: 'v3', project: 'Prestige Lakeside', builder: 'Prestige', city: 'Bengaluru', date: '2026-06-22', slot: 'Morning (10AM–1PM)', status: 'pending' },
]

/* ── Mock: market trend data ── */
const PRICE_TREND = [
  { month: 'Jun 25', gurugram: 12400, noida: 8200,  bangalore: 9800  },
  { month: 'Jul 25', gurugram: 12700, noida: 8400,  bangalore: 10200 },
  { month: 'Aug 25', gurugram: 12900, noida: 8600,  bangalore: 10500 },
  { month: 'Sep 25', gurugram: 13200, noida: 8900,  bangalore: 10800 },
  { month: 'Oct 25', gurugram: 13600, noida: 9100,  bangalore: 11200 },
  { month: 'Nov 25', gurugram: 13900, noida: 9400,  bangalore: 11500 },
  { month: 'Dec 25', gurugram: 14200, noida: 9700,  bangalore: 11900 },
  { month: 'Jan 26', gurugram: 14600, noida: 10000, bangalore: 12200 },
  { month: 'Feb 26', gurugram: 14900, noida: 10300, bangalore: 12600 },
  { month: 'Mar 26', gurugram: 15300, noida: 10600, bangalore: 13000 },
  { month: 'Apr 26', gurugram: 15700, noida: 10900, bangalore: 13400 },
  { month: 'May 26', gurugram: 16100, noida: 11200, bangalore: 13800 },
]

const YIELD_DATA = [
  { city: 'Gurugram', yield: 3.8 },
  { city: 'Noida',    yield: 4.1 },
  { city: 'Bengaluru',yield: 4.6 },
  { city: 'Mumbai',   yield: 2.9 },
  { city: 'Hyderabad',yield: 5.8 },
]

/* ── Status config ── */
const PROJECT_STATUS = {
  saved:       { label: 'Saved',        class: 'bg-gray-800/60 border-gray-700/40 text-gray-300' },
  interested:  { label: 'Interested',   class: 'bg-brand-900/40 border-brand-700/40 text-brand-300' },
  visit_done:  { label: 'Visit Done',   class: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
}

const VISIT_STATUS = {
  confirmed: { label: 'Confirmed', class: 'bg-brand-900/40 border-brand-700/40 text-brand-300',  icon: CalendarCheck },
  completed: { label: 'Completed', class: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300', icon: CheckCircle },
  pending:   { label: 'Pending',   class: 'bg-amber-900/40 border-amber-700/40 text-amber-300',  icon: Clock },
}

/* ── Metric card ── */
function MetricCard({ label, value, change, icon: Icon, color, loading }) {
  const up = change?.startsWith('+')
  return (
    <div className={`glass border ${color} rounded-2xl p-5 flex flex-col gap-3`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color.replace('border-', 'from-').replace('/30', '').replace(/border-(\w+-\d+)/, 'from-$1 to-gray-900')} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
            {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
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

/* ── Custom tooltip for charts ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-dark border border-white/10 rounded-xl p-3 text-xs shadow-glass">
      <div className="text-gray-400 mb-1.5 font-medium">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-semibold">
            {typeof p.value === 'number' && p.value > 1000 ? `₹${(p.value / 1000).toFixed(1)}K/sqft` : `${p.value}%`}
          </span>
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

export default function InvestorDashboard({ session }) {
  const [activeNav,  setActiveNav]  = useState('overview')
  const [metrics,    setMetrics]    = useState({})
  const [insights,   setInsights]   = useState([])
  const [loading,    setLoading]    = useState(true)

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

  useEffect(() => { loadData() }, [])

  const METRIC_CARDS = [
    { label: 'Saved Projects',         value: metrics.savedProjects         ?? '–', change: '+2 this week', icon: Heart,        color: 'border-brand-700/30'  },
    { label: 'Site Visits Booked',     value: metrics.siteVisits            ?? '–', change: '+1 upcoming',  icon: CalendarCheck,color: 'border-emerald-700/30' },
    { label: 'Interested Properties',  value: metrics.interestedProperties  ?? '–', change: '+3 this month',icon: Building2,    color: 'border-accent-700/30'  },
    { label: 'AI Insights Available',  value: metrics.marketInsights        ?? '–', change: '2 new alerts', icon: Lightbulb,    color: 'border-amber-700/30'   },
  ]

  return (
    <DashboardLayout
      session={session}
      title="Investor Dashboard"
      subtitle="Premium Account"
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onRefresh={loadData}
    >
      {/* ── Overview ── */}
      {activeNav === 'overview' && (
        <>
          {/* Welcome */}
          <motion.div {...fadeUp(0)} className="glass border border-brand-800/30 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-brand-950/60 to-gray-900/20">
            <div className="flex items-start sm:items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-semibold tracking-wide uppercase">
                    Premium Investor
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow inline-block" />
                  <span className="text-emerald-400 text-xs font-medium">Active</span>
                </div>
                <h2 className="text-xl font-bold text-white">Welcome back, {session?.username || 'Investor'}! 🏙️</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Your portfolio is tracking well. 2 new AI insights are available.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setActiveNav('insights')} className="btn-ghost text-sm border border-brand-700/30 hover:border-brand-600/50 hover:bg-brand-950/30">
                  <Lightbulb size={14} /> View Insights
                </button>
                <button onClick={() => setActiveNav('visits')} className="btn-primary text-sm">
                  <CalendarCheck size={14} /> My Visits
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

          {/* Price trend chart */}
          <motion.div {...fadeUp(0.15)} className="glass border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white">Price Appreciation — 12 Month Trend</h3>
                <p className="text-xs text-gray-500 mt-0.5">Average price per sq ft (₹)</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {[{ c: '#c99a1a', l: 'Gurugram' }, { c: '#5eead4', l: 'Noida' }, { c: '#818cf8', l: 'Bengaluru' }].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                    <span className="text-gray-400">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={PRICE_TREND} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {[{ id: 'cGuru',  c: '#c99a1a' }, { id: 'cNoida', c: '#5eead4' }, { id: 'cBang', c: '#818cf8' }].map(({ id, c }) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0.02} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} width={48} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="gurugram" name="Gurugram" stroke="#c99a1a" fill="url(#cGuru)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="noida"    name="Noida"    stroke="#5eead4" fill="url(#cNoida)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="bangalore" name="Bengaluru" stroke="#818cf8" fill="url(#cBang)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Quick summary cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Top Performing City', value: 'Gurugram', sub: '+18.4% YoY appreciation', icon: TrendingUp, color: 'text-brand-400' },
              { label: 'Best Rental Yield',   value: 'Hyderabad', sub: '5.8% gross yield',        icon: BarChart2, color: 'text-emerald-400' },
              { label: 'RERA Compliance',     value: '100%',       sub: 'All listed projects',    icon: Shield,    color: 'text-sky-400'   },
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

      {/* ── Saved Projects ── */}
      {activeNav === 'saved' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Saved Projects ({SAVED_PROJECTS.length})</h3>
            <span className="text-xs text-brand-400 font-medium">Sorted by latest activity</span>
          </div>
          <div className="space-y-3">
            {SAVED_PROJECTS.map((p, i) => {
              const s = PROJECT_STATUS[p.status]
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass border border-white/8 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-brand-800/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-900/40 border border-brand-800/30 flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{p.name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span>{p.builder}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><MapPin size={9} />{p.city}</span>
                        <span>·</span>
                        <span className="text-brand-400 font-medium">{p.tag}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-brand-400 text-sm font-bold">{p.price}</div>
                      <div className="text-xs text-gray-600">{p.possession}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${s.class}`}>{s.label}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ── Site Visits ── */}
      {activeNav === 'visits' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">Site Visits</h3>
            <button className="btn-primary text-xs py-2 px-4">
              <CalendarCheck size={13} /> Book New Visit
            </button>
          </div>
          <div className="space-y-4">
            {SITE_VISITS.map((v, i) => {
              const s = VISIT_STATUS[v.status]
              const StatusIcon = s.icon
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass border border-white/8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between hover:border-brand-800/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.class.split(' ')[0]}`}>
                      <StatusIcon size={18} className={s.class.split(' ').pop()} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{v.project}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span>{v.builder}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><MapPin size={9} />{v.city}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>📅 {v.date}</span>
                        <span>⏰ {v.slot}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${s.class} shrink-0`}>{s.label}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ── AI Insights ── */}
      {activeNav === 'insights' && (
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-white">AI Investment Insights</h3>
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
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="glass border border-white/8 rounded-2xl p-5 hover:border-brand-800/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-brand-400 bg-brand-900/30 border border-brand-800/30 px-2 py-0.5 rounded-full">
                        {insight.category}
                      </span>
                      <span className="text-brand-400 font-black text-sm flex items-center gap-1">
                        {insight.trend} <ArrowUpRight size={13} />
                      </span>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1.5">{insight.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{insight.body}</p>
                    <div className="mt-3 text-xs text-gray-600 font-medium">{insight.trendLabel}</div>
                  </motion.div>
                ))}
              </div>
            )
          }
        </motion.div>
      )}

      {/* ── Market Trends ── */}
      {activeNav === 'trends' && (
        <motion.div {...fadeUp(0)} className="space-y-6">
          {/* Area chart */}
          <div className="glass border border-white/8 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Price Trend (₹/sqft) — 12 Months</h3>
            <p className="text-xs text-gray-500 mb-5">Across Gurugram, Noida, and Bengaluru</p>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={PRICE_TREND}>
                <defs>
                  {[{ id: 'g2', c: '#c99a1a' }, { id: 'n2', c: '#5eead4' }, { id: 'b2', c: '#818cf8' }].map(({ id, c }) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={c} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} width={48} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="gurugram"  name="Gurugram"  stroke="#c99a1a" fill="url(#g2)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="noida"     name="Noida"     stroke="#5eead4" fill="url(#n2)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="bangalore" name="Bengaluru" stroke="#818cf8" fill="url(#b2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart — rental yield */}
          <div className="glass border border-white/8 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-1">Gross Rental Yield by City (%)</h3>
            <p className="text-xs text-gray-500 mb-5">Premium segment average, Q1 2026</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={YIELD_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="city" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={36} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="yield" name="Rental Yield" fill="#c99a1a" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ── Alerts / Notifications ── */}
      {activeNav === 'alerts' && (
        <motion.div {...fadeUp(0)}>
          <h3 className="font-semibold text-white mb-5">Recent Alerts</h3>
          <div className="space-y-3">
            {[
              { title: 'Price Drop Alert',       body: 'ATS Pristine (Noida) has reduced prices by ₹12L on select units.',           time: '2h ago',  dot: 'bg-brand-500',   read: false },
              { title: 'Site Visit Confirmed',   body: 'Your visit to The Arbour (DLF, Gurugram) is confirmed for June 8, 10AM.',     time: '1d ago',  dot: 'bg-emerald-500', read: false },
              { title: 'New AI Insight',          body: 'Gurugram Golf Course Road appreciation hits 18.4% YoY — new report ready.', time: '2d ago',  dot: 'bg-accent-500',  read: true  },
              { title: 'Possession Update',       body: 'Prestige Lakeside Habitat now ready for possession — contact us for keys.',  time: '3d ago',  dot: 'bg-amber-500',   read: true  },
              { title: 'New Project Launch',      body: 'Smartworld Orion — Phase 2 launching in Gurugram Sector 90. Pre-register.', time: '5d ago',  dot: 'bg-sky-500',     read: true  },
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
