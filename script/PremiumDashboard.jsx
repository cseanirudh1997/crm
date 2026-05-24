// ─────────────────────────────────────────────
//  PremiumDashboard — full experience for Premium / Enterprise users
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, ArrowUpRight, ArrowDownRight,
  CheckCircle, Clock, Loader2, Zap, Headphones, LayoutDashboard,
  Rocket, Lightbulb, Phone, BarChart2, AlertTriangle, MessageSquare,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import DashboardLayout from './DashboardLayout'
import { SupportRequestModal, ServiceRequestModal } from './Modals'
import { getDeploymentStatus, getEnterpriseMetrics, getAIInsights } from './api'

/* ── Nav ── */
const NAV_ITEMS = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'analytics',   label: 'Analytics',   icon: BarChart2       },
  { id: 'deployments', label: 'Deployments', icon: Rocket          },
  { id: 'voice',       label: 'Voice AI',    icon: Phone           },
  { id: 'insights',    label: 'AI Insights', icon: Lightbulb       },
  { id: 'support',     label: 'Support',     icon: Headphones      },
]

/* ── Colors for pie chart ── */
const PIE_COLORS = ['#4a5eff', '#8b5cf6', '#00d4ff', '#10b981']

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    deployed:     { label: 'Deployed',     class: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
    deployment:   { label: 'Deploying',    class: 'bg-brand-900/40 border-brand-700/40 text-brand-300'       },
    scoping:      { label: 'Scoping',      class: 'bg-accent-900/40 border-accent-700/40 text-accent-300'    },
    consultation: { label: 'Consultation', class: 'bg-amber-900/40 border-amber-700/40 text-amber-300'       },
    pending:      { label: 'Pending',      class: 'bg-gray-800/60 border-gray-700/40 text-gray-400'          },
  }
  const { label, class: cls } = map[status] || map.pending
  return (
    <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${cls}`}>{label}</span>
  )
}

/* ── Voice waveform animation ── */
function VoiceWaveform({ active = true }) {
  const bars = [4, 7, 11, 8, 14, 10, 6, 13, 9, 5, 12, 7, 15, 8, 4, 11, 6, 9, 13, 5]
  return (
    <div className="flex items-center gap-0.5 h-12">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-brand-600 to-brand-300"
          animate={active ? { height: [`${h * 2}px`, `${h * 4}px`, `${h * 2}px`] } : { height: '4px' }}
          transition={{ duration: 0.8 + (i % 5) * 0.12, repeat: Infinity, ease: 'easeInOut', delay: i * 0.04 }}
        />
      ))}
    </div>
  )
}

/* ── Insight icon ── */
function InsightIcon({ type }) {
  const map = {
    opportunity:  { icon: TrendingUp,     cls: 'bg-emerald-900/40 text-emerald-400 border-emerald-700/30' },
    optimization: { icon: Zap,            cls: 'bg-brand-900/40 text-brand-400 border-brand-700/30'       },
    alert:        { icon: AlertTriangle,  cls: 'bg-amber-900/40 text-amber-400 border-amber-700/30'       },
    milestone:    { icon: CheckCircle,    cls: 'bg-accent-900/40 text-accent-400 border-accent-700/30'    },
  }
  const { icon: Icon, cls } = map[type] || map.milestone
  return (
    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${cls}`}>
      <Icon size={16} />
    </div>
  )
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  transition: { delay, duration: 0.4 },
})

/* ════════════════════════════════════════════
   PremiumDashboard
   ════════════════════════════════════════════ */
export default function PremiumDashboard({ session }) {
  const [activeNav,    setActiveNav]    = useState('overview')
  const [showSupport,  setShowSupport]  = useState(false)
  const [showService,  setShowService]  = useState(false)
  const [metrics,      setMetrics]      = useState(null)
  const [deployments,  setDeployments]  = useState([])
  const [insights,     setInsights]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [voiceActive,  setVoiceActive]  = useState(true)

  async function loadData() {
    setLoading(true)
    const [m, d, ins] = await Promise.all([
      getEnterpriseMetrics(session?.email),
      getDeploymentStatus(session?.email),
      getAIInsights(session?.email),
    ])
    setMetrics(m.metrics)
    setDeployments(d.deployments || [])
    setInsights(ins.insights || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const METRIC_CARDS = [
    { label: 'AI API Calls (30d)', value: metrics?.aiCalls30d?.toLocaleString() || '–',  change: '+18%',  up: true,  icon: Zap,      color: 'from-brand-600 to-brand-800',   bg: 'bg-brand-900/20',  border: 'border-brand-700/30'  },
    { label: 'Active Deployments', value: metrics?.activeDeployments || '–',              change: '+1',    up: true,  icon: Rocket,   color: 'from-accent-600 to-accent-800', bg: 'bg-accent-900/20', border: 'border-accent-700/30' },
    { label: 'Cost Savings',       value: metrics?.costSaved || '–',                      change: '+32%',  up: true,  icon: TrendingUp, color: 'from-teal-600 to-teal-800',  bg: 'bg-teal-900/20',   border: 'border-teal-700/30'   },
    { label: 'Avg. Response Time', value: metrics?.avgResponseTime || '–',                change: '-0.4h', up: true,  icon: Clock,    color: 'from-amber-600 to-amber-800',  bg: 'bg-amber-900/20',  border: 'border-amber-700/30'  },
  ]

  /* ── Shared welcome banner (overview) ── */
  const WelcomeBanner = (
    <motion.div {...fadeUp(0)} className="glass border border-brand-800/40 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-brand-900/40 to-accent-900/20">
      <div className="flex items-start sm:items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-semibold tracking-wide uppercase">
              Premium
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow inline-block" />
            <span className="text-emerald-400 text-xs font-medium">All Systems Operational</span>
          </div>
          <h2 className="text-xl font-bold text-white">Welcome back, {session?.username || 'there'}!</h2>
          {session?.company && <p className="text-gray-400 text-sm mt-0.5">{session.company}</p>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowService(true)} className="btn-primary text-sm">
            + Request Deployment
          </button>
          <button onClick={() => setShowSupport(true)} className="btn-secondary text-sm">
            <Headphones size={14} /> Support
          </button>
        </div>
      </div>
    </motion.div>
  )

  /* ── Shared metric cards ── */
  const MetricCards = (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {METRIC_CARDS.map(({ label, value, change, up, icon: Icon, color, bg, border }, i) => (
        <motion.div
          key={label}
          {...fadeUp(i * 0.06)}
          className={`glass ${bg} border ${border} rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
              {loading ? <Loader2 size={18} className="text-white animate-spin" /> : <Icon size={18} className="text-white" />}
            </div>
            <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
              {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {change}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">{loading ? '—' : value}</div>
          <div className="text-xs text-gray-400">{label}</div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <>
      <DashboardLayout
        session={session}
        title="Enterprise Dashboard"
        subtitle={`${session?.company || 'Your Organization'} · Premium`}
        navItems={NAV_ITEMS}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onRefresh={loadData}
      >

        {/* ══════════════════════════════════
            OVERVIEW — welcome + KPIs
            ══════════════════════════════════ */}
        {activeNav === 'overview' && (
          <>
            {WelcomeBanner}
            {MetricCards}

            {/* Quick-access cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Active Deployments', value: deployments.length || 4,  sub: 'across all environments', color: 'text-brand-400',   onClick: () => setActiveNav('deployments') },
                { label: 'AI Recommendations', value: insights.length || 4,     sub: 'awaiting your review',    color: 'text-accent-400',  onClick: () => setActiveNav('insights')    },
                { label: 'Voice AI Status',     value: voiceActive ? 'Live' : 'Paused', sub: 'SmartCall AI + VoiceFlow', color: voiceActive ? 'text-emerald-400' : 'text-gray-400', onClick: () => setActiveNav('voice') },
              ].map(({ label, value, sub, color, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="glass border border-white/10 rounded-2xl p-5 text-left hover:-translate-y-1 hover:border-brand-700/40 transition-all duration-200 group"
                >
                  <div className={`text-2xl font-extrabold mb-1 ${color}`}>{String(value)}</div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    {sub} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ══════════════════════════════════
            ANALYTICS — charts
            ══════════════════════════════════ */}
        {activeNav === 'analytics' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white mb-1">Analytics</h2>
              <p className="text-sm text-gray-400 mb-5">Usage trends and deployment distribution across your enterprise.</p>
            </motion.div>

            {MetricCards}

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Area chart */}
              <motion.div {...fadeUp(0.1)} className="lg:col-span-2 glass border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-white">AI API Call Volume</h3>
                    <p className="text-xs text-gray-500 mt-0.5">12-month trend</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <ArrowUpRight size={12} /> +194% YoY
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={metrics?.usageTrend || []} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4a5eff" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4a5eff" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                      labelStyle={{ color: '#e5e7eb' }}
                      itemStyle={{ color: '#4a5eff' }}
                    />
                    <Area type="monotone" dataKey="calls" stroke="#4a5eff" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Pie chart */}
              <motion.div {...fadeUp(0.15)} className="glass border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-1">Deployment Mix</h3>
                <p className="text-xs text-gray-500 mb-4">By service category</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={metrics?.deploymentBreakdown || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {(metrics?.deploymentBreakdown || []).map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                      formatter={(v) => [`${v}%`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {(metrics?.deploymentBreakdown || []).map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-gray-400">{item.name}</span>
                      </div>
                      <span className="text-gray-300 font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════
            DEPLOYMENTS — pipeline tracker
            ══════════════════════════════════ */}
        {activeNav === 'deployments' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white mb-1">Deployment Pipeline</h2>
              <p className="text-sm text-gray-400 mb-5">Track the status and progress of all your enterprise AI deployments.</p>
            </motion.div>

            <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div>
                  <h3 className="font-semibold text-white">Active Projects</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{deployments.length} deployments tracked</p>
                </div>
                <button onClick={() => setShowService(true)} className="btn-primary text-xs">
                  + New Request
                </button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={24} className="animate-spin text-brand-400" />
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {deployments.map((dep) => (
                    <div key={dep.name} className="flex items-center gap-4 px-5 py-5 hover:bg-white/5 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-medium text-white truncate">{dep.name}</span>
                          <StatusBadge status={dep.status} />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">Env: {dep.env}</span>
                          <span className="text-xs text-gray-600">·</span>
                          <span className="text-xs text-gray-500">Updated {dep.updatedAt}</span>
                        </div>
                      </div>
                      <div className="shrink-0 w-32">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs text-gray-300 font-semibold">{dep.progress}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dep.progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${dep.status === 'deployed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-600 to-accent-500'}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* ══════════════════════════════════
            VOICE AI — waveform + stats
            ══════════════════════════════════ */}
        {activeNav === 'voice' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white mb-1">Voice AI Suite</h2>
              <p className="text-sm text-gray-400 mb-5">Live monitoring for SmartCall AI and VoiceFlow Enterprise.</p>
            </motion.div>

            <motion.div {...fadeUp(0.05)} className="glass border border-brand-800/40 rounded-2xl p-5 sm:p-8 bg-gradient-to-br from-brand-900/20 to-transparent overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-600/10 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-glow-sm">
                        <Phone size={17} className="text-white" />
                      </div>
                      <span className="text-sm font-semibold text-brand-300 uppercase tracking-wide">SmartCall AI + VoiceFlow Enterprise</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Voice AI Infrastructure</h3>
                    <p className="text-gray-400 max-w-xl">
                      Your voice AI processes inbound and outbound calls with 97.3% intent accuracy. Real-time transcription, sentiment analysis, and auto-escalation are active.
                    </p>
                  </div>
                  <button
                    onClick={() => setVoiceActive((v) => !v)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                      voiceActive
                        ? 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300 hover:bg-emerald-900/60'
                        : 'bg-gray-800/60 border-gray-700/40 text-gray-400 hover:bg-gray-800/80'
                    }`}
                  >
                    {voiceActive ? '● Live' : '○ Paused'}
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                  <VoiceWaveform active={voiceActive} />
                  <div>
                    <div className="text-sm font-medium text-white">{voiceActive ? 'Processing live calls' : 'Voice processing paused'}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{voiceActive ? 'All queues active · Real-time transcription on' : 'Resume to restore live processing'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Calls Today',      value: '1,284' },
                    { label: 'Avg Handle Time',  value: '3m 42s' },
                    { label: 'Intent Accuracy',  value: '97.3%' },
                    { label: 'Auto-Resolved',    value: '68.4%' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                      <div className="text-2xl font-bold gradient-text">{value}</div>
                      <div className="text-xs text-gray-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Request expansion */}
            <motion.div {...fadeUp(0.15)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="font-semibold text-white mb-1">Expand Your Voice AI Coverage</h3>
              <p className="text-sm text-gray-400 mb-4">Deploy SmartCall AI to additional queues or add VoiceFlow workflows to new use cases.</p>
              <button onClick={() => setShowService(true)} className="btn-primary text-sm">
                + Request Voice AI Expansion
              </button>
            </motion.div>
          </>
        )}

        {/* ══════════════════════════════════
            AI INSIGHTS — recommendations
            ══════════════════════════════════ */}
        {activeNav === 'insights' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                <Lightbulb size={18} className="text-brand-400" /> AI Recommendations
              </h2>
              <p className="text-sm text-gray-400 mb-5">Auto-generated based on your usage patterns and deployment telemetry.</p>
            </motion.div>

            <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-brand-400" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {insights.map((ins) => (
                    <motion.div
                      key={ins.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0  }}
                      transition={{ delay: ins.id * 0.08 }}
                      className="flex gap-3 p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all"
                    >
                      <InsightIcon type={ins.type} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white mb-1">{ins.title}</p>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">{ins.body}</p>
                        <button
                          onClick={() => ins.type === 'alert' || ins.type === 'optimization' ? setShowSupport(true) : setShowService(true)}
                          className="text-xs text-brand-300 hover:text-brand-200 font-medium transition-colors flex items-center gap-1"
                        >
                          {ins.cta} <ArrowUpRight size={11} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* ══════════════════════════════════
            SUPPORT — ticket submission
            ══════════════════════════════════ */}
        {activeNav === 'support' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white mb-1">Enterprise Support</h2>
              <p className="text-sm text-gray-400 mb-5">Submit tickets, track open issues, and reach your dedicated solutions team.</p>
            </motion.div>

            {/* SLA cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { priority: 'Critical', sla: '1 hour',   color: 'border-red-700/40 bg-red-900/10',     text: 'text-red-300'    },
                { priority: 'High',     sla: '4 hours',  color: 'border-orange-700/40 bg-orange-900/10', text: 'text-orange-300' },
                { priority: 'Medium',   sla: '8 hours',  color: 'border-amber-700/40 bg-amber-900/10',  text: 'text-amber-300'  },
              ].map(({ priority, sla, color, text }) => (
                <motion.div
                  key={priority}
                  {...fadeUp(0.05)}
                  className={`glass border rounded-2xl p-5 ${color}`}
                >
                  <div className={`text-sm font-semibold mb-1 ${text}`}>{priority} Priority</div>
                  <div className="text-2xl font-bold text-white">{sla}</div>
                  <div className="text-xs text-gray-500 mt-1">Guaranteed response time</div>
                </motion.div>
              ))}
            </div>

            {/* Support actions */}
            <motion.div {...fadeUp(0.1)} className="glass border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-glow-sm shrink-0">
                  <MessageSquare size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Open a Support Ticket</h3>
                  <p className="text-gray-400 text-sm">
                    Our enterprise support team is available 24/7. Tickets are prioritized by severity and routed to the appropriate specialist.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setShowSupport(true)} className="btn-primary">
                  <Headphones size={15} /> Open Support Ticket
                </button>
                <button onClick={() => setShowService(true)} className="btn-secondary">
                  + Request New Service
                </button>
              </div>
            </motion.div>

            {/* Contact info */}
            <motion.div {...fadeUp(0.15)} className="glass border border-white/10 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3">Direct Contact</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-400">
                <div><span className="text-gray-300 font-medium">Enterprise Support:</span> enterprise@nexusai.io</div>
                <div><span className="text-gray-300 font-medium">Emergency Hotline:</span> +1 (800) NEX-USAI</div>
                <div><span className="text-gray-300 font-medium">Slack Connect:</span> Your dedicated workspace</div>
                <div><span className="text-gray-300 font-medium">Solutions Architect:</span> Assigned to your account</div>
              </div>
            </motion.div>
          </>
        )}

      </DashboardLayout>

      {showSupport && <SupportRequestModal session={session} onClose={() => setShowSupport(false)} />}
      {showService  && <ServiceRequestModal session={session} onClose={() => setShowService(false)} />}
    </>
  )
}
