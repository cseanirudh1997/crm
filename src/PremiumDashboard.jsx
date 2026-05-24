// ─────────────────────────────────────────────
//  PremiumDashboard — full experience for Premium / Enterprise users
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, ArrowUpRight, ArrowDownRight,
  CheckCircle, Clock, Loader2, Zap, Headphones, LayoutDashboard,
  Rocket, Lightbulb, Phone, BarChart2, AlertTriangle, MessageSquare,
  PhoneIncoming, PhoneOutgoing, Server, Activity, Mail, User,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
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

/* ── Pie chart colors ── */
const PIE_COLORS = ['#10b981', '#4a5eff', '#8b5cf6', '#f59e0b']

/* ── Mock: recent call log ── */
const RECENT_CALLS = [
  { id: 'CA-8821', type: 'inbound',  duration: '4m 12s', intent: 'Billing Inquiry',    outcome: 'resolved',  sentiment: 'positive', time: '2m ago'  },
  { id: 'CA-8820', type: 'outbound', duration: '2m 54s', intent: 'Follow-up Outreach', outcome: 'resolved',  sentiment: 'neutral',  time: '5m ago'  },
  { id: 'CA-8819', type: 'inbound',  duration: '7m 03s', intent: 'Technical Support',  outcome: 'escalated', sentiment: 'negative', time: '9m ago'  },
  { id: 'CA-8818', type: 'inbound',  duration: '1m 45s', intent: 'Order Status',       outcome: 'resolved',  sentiment: 'positive', time: '14m ago' },
  { id: 'CA-8817', type: 'outbound', duration: '3m 22s', intent: 'Renewal Reminder',   outcome: 'resolved',  sentiment: 'positive', time: '21m ago' },
  { id: 'CA-8816', type: 'inbound',  duration: '5m 57s', intent: 'Cancellation',       outcome: 'escalated', sentiment: 'negative', time: '28m ago' },
]

/* ── Mock: AI system health ── */
const SYSTEM_HEALTH = [
  { name: 'ASR Engine',    status: 'operational', latency: '62ms',  model: 'Whisper v3'     },
  { name: 'LLM Core',      status: 'operational', latency: '1.1s',  model: 'GPT-4o'         },
  { name: 'TTS Synthesis', status: 'operational', latency: '180ms', model: 'ElevenLabs v2'  },
  { name: 'CRM Sync',      status: 'operational', latency: '44ms',  model: 'Salesforce API' },
]

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

/* ── Insight icon — severity-based ── */
function InsightIcon({ severity }) {
  const map = {
    high:   { icon: AlertTriangle, cls: 'bg-amber-900/40 text-amber-400 border-amber-700/30'    },
    medium: { icon: Zap,           cls: 'bg-brand-900/40 text-brand-400 border-brand-700/30'    },
    low:    { icon: CheckCircle,   cls: 'bg-accent-900/40 text-accent-400 border-accent-700/30' },
  }
  const { icon: Icon, cls } = map[severity] || map.low
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

function toMonth(dateStr) {
  try {
    return new Date(dateStr).toLocaleString('default', { month: 'short' })
  } catch {
    return dateStr
  }
}

/* ════════════════════════════════════════════
   PremiumDashboard
   ════════════════════════════════════════════ */
export default function PremiumDashboard({ session }) {
  const [activeNav,     setActiveNav]     = useState('overview')
  const [showSupport,   setShowSupport]   = useState(false)
  const [showService,   setShowService]   = useState(false)
  const [metrics,       setMetrics]       = useState([])
  const [summary,       setSummary]       = useState(null)
  const [deployments,   setDeployments]   = useState([])
  const [insights,      setInsights]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [voiceActive,   setVoiceActive]   = useState(true)
  const [deployFilter,  setDeployFilter]  = useState('all')
  const [insightFilter, setInsightFilter] = useState('all')

  async function loadData() {
    setLoading(true)
    const [m, d, ins] = await Promise.all([
      getEnterpriseMetrics(session?.username),
      getDeploymentStatus(session?.username),
      getAIInsights(session?.username),
    ])
    const rows = m.metrics || []
    setMetrics(rows)

    if (rows.length) {
      const totalCalls    = rows.reduce((s, r) => s + (r.aiCalls || 0), 0)
      const totalHours    = rows.reduce((s, r) => s + (r.automationHoursSaved || 0), 0)
      const avgScore      = (rows.reduce((s, r) => s + (r.satisfactionScore || 0), 0) / rows.length).toFixed(1)
      const totalSessions = rows.reduce((s, r) => s + (r.chatbotSessions || 0), 0)
      setSummary({ totalCalls, totalHours, avgScore, totalSessions })
    }

    setDeployments(d.deployments || [])
    setInsights(ins.insights || [])
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  /* ── Derived data ── */
  const stageBreakdown = [
    { name: 'Deployed',   value: deployments.filter(d => d.deploymentStage === 'deployed').length     || 1 },
    { name: 'Deploying',  value: deployments.filter(d => d.deploymentStage === 'deployment').length   || 1 },
    { name: 'Scoping',    value: deployments.filter(d => d.deploymentStage === 'scoping').length      || 1 },
    { name: 'Consulting', value: deployments.filter(d => d.deploymentStage === 'consultation').length || 1 },
  ]

  const filteredDeployments = deployFilter === 'all'
    ? deployments
    : deployments.filter(d => d.deploymentStage === deployFilter)

  const filteredInsights = insightFilter === 'all'
    ? insights
    : insights.filter(ins => ins.severity === insightFilter)

  const METRIC_CARDS = [
    { label: 'Total AI Calls',       value: summary?.totalCalls?.toLocaleString() || '–', change: '+18%', up: true, icon: Zap,        color: 'from-brand-600 to-brand-800',   bg: 'bg-brand-900/20',  border: 'border-brand-700/30'  },
    { label: 'Active Deployments',   value: deployments.length || '–',                    change: '+1',   up: true, icon: Rocket,     color: 'from-accent-600 to-accent-800', bg: 'bg-accent-900/20', border: 'border-accent-700/30' },
    { label: 'Automation Hrs Saved', value: summary?.totalHours?.toLocaleString() || '–', change: '+32%', up: true, icon: TrendingUp, color: 'from-teal-600 to-teal-800',    bg: 'bg-teal-900/20',   border: 'border-teal-700/30'   },
    { label: 'Avg Satisfaction',     value: summary ? `${summary.avgScore} / 5` : '–',    change: '+0.2', up: true, icon: Clock,      color: 'from-amber-600 to-amber-800',   bg: 'bg-amber-900/20',  border: 'border-amber-700/30'  },
  ]

  /* ── Shared welcome banner ── */
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
            OVERVIEW
            ══════════════════════════════════ */}
        {activeNav === 'overview' && (
          <>
            {WelcomeBanner}
            {MetricCards}

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Active Deployments', value: deployments.length || 4,  sub: 'across all environments',  color: 'text-brand-400',                                                  onClick: () => setActiveNav('deployments') },
                { label: 'AI Recommendations', value: insights.length || 5,     sub: 'awaiting your review',     color: 'text-accent-400',                                                 onClick: () => setActiveNav('insights')    },
                { label: 'Voice AI Status',     value: voiceActive ? 'Live' : 'Paused', sub: 'SmartCall AI + VoiceFlow', color: voiceActive ? 'text-emerald-400' : 'text-gray-400', onClick: () => setActiveNav('voice')       },
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
            ANALYTICS
            ══════════════════════════════════ */}
        {activeNav === 'analytics' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white mb-1">Analytics</h2>
              <p className="text-sm text-gray-400 mb-5">Usage trends and deployment distribution across your enterprise.</p>
            </motion.div>

            {MetricCards}

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Area chart — AI call volume */}
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
                  <AreaChart data={metrics} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4a5eff" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4a5eff" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tickFormatter={toMonth} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                      labelStyle={{ color: '#e5e7eb' }}
                      itemStyle={{ color: '#4a5eff' }}
                      labelFormatter={toMonth}
                    />
                    <Area type="monotone" dataKey="aiCalls" name="AI Calls" stroke="#4a5eff" strokeWidth={2} fill="url(#areaGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Pie chart — deployment mix */}
              <motion.div {...fadeUp(0.15)} className="glass border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-1">Deployment Mix</h3>
                <p className="text-xs text-gray-500 mb-4">By pipeline stage</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stageBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stageBreakdown.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {stageBreakdown.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-gray-400">{item.name}</span>
                      </div>
                      <span className="text-gray-300 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom charts row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Chatbot sessions */}
              <motion.div {...fadeUp(0.2)} className="glass border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-white">Chatbot Sessions</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Monthly volume</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <ArrowUpRight size={12} /> +186% YoY
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={metrics} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tickFormatter={toMonth} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                      labelFormatter={toMonth}
                    />
                    <Area type="monotone" dataKey="chatbotSessions" name="Sessions" stroke="#8b5cf6" strokeWidth={2} fill="url(#sessionGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Automation hours — bar chart */}
              <motion.div {...fadeUp(0.25)} className="glass border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-white">Automation Hours Saved</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Monthly labor hours recovered</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <ArrowUpRight size={12} /> +168% YoY
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={metrics} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tickFormatter={toMonth} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                      labelFormatter={toMonth}
                    />
                    <Bar dataKey="automationHoursSaved" name="Hours Saved" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════
            DEPLOYMENTS
            ══════════════════════════════════ */}
        {activeNav === 'deployments' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white mb-1">Deployment Pipeline</h2>
              <p className="text-sm text-gray-400 mb-5">Track the status and progress of all your enterprise AI deployments.</p>
            </motion.div>

            {/* Pipeline summary tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Projects', value: deployments.length || 4,                                                                                color: 'text-white'         },
                { label: 'Live',           value: deployments.filter(d => d.deploymentStage === 'deployed').length || 1,                                  color: 'text-emerald-400'   },
                { label: 'In Progress',    value: deployments.filter(d => ['deployment','scoping'].includes(d.deploymentStage)).length || 2,              color: 'text-brand-400'     },
                { label: 'Consulting',     value: deployments.filter(d => d.deploymentStage === 'consultation').length || 1,                              color: 'text-amber-400'     },
              ].map(({ label, value, color }) => (
                <motion.div key={label} {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl p-4 text-center">
                  <div className={`text-3xl font-extrabold ${color} mb-1`}>{loading ? '—' : value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Filter tabs + table */}
            <motion.div {...fadeUp(0.08)} className="glass border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-3 p-5 border-b border-white/10 flex-wrap">
                <div className="flex gap-1 flex-wrap">
                  {[
                    { id: 'all',          label: 'All',       count: deployments.length                                                    },
                    { id: 'deployed',     label: 'Live',      count: deployments.filter(d => d.deploymentStage === 'deployed').length     },
                    { id: 'deployment',   label: 'Deploying', count: deployments.filter(d => d.deploymentStage === 'deployment').length   },
                    { id: 'scoping',      label: 'Scoping',   count: deployments.filter(d => d.deploymentStage === 'scoping').length      },
                    { id: 'consultation', label: 'Consult.',  count: deployments.filter(d => d.deploymentStage === 'consultation').length },
                  ].map(({ id, label, count }) => (
                    <button
                      key={id}
                      onClick={() => setDeployFilter(id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        deployFilter === id
                          ? 'bg-brand-700/60 text-brand-200 border border-brand-600/40'
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {label} <span className="ml-1 opacity-60">{count}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowService(true)} className="btn-primary text-xs shrink-0">
                  + New Request
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={24} className="animate-spin text-brand-400" />
                </div>
              ) : filteredDeployments.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-gray-500">
                  <Rocket size={32} className="mb-3 opacity-40" />
                  <p className="text-sm">No deployments in this stage.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredDeployments.map((dep, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-5 hover:bg-white/5 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-medium text-white truncate">{dep.solution}</span>
                          <StatusBadge status={dep.deploymentStage} />
                        </div>
                        <div className="text-xs text-gray-500">{dep.company}</div>
                      </div>
                      <div className="shrink-0 w-36">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs text-gray-300 font-semibold">{dep.completionPercent}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${dep.completionPercent}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${dep.deploymentStage === 'deployed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-600 to-accent-500'}`}
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
            VOICE AI
            ══════════════════════════════════ */}
        {activeNav === 'voice' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white mb-1">Voice AI Suite</h2>
              <p className="text-sm text-gray-400 mb-5">Live monitoring for SmartCall AI and VoiceFlow Enterprise.</p>
            </motion.div>

            {/* Live status card */}
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
                    { label: 'Calls Today',     value: '1,284' },
                    { label: 'Avg Handle Time', value: '3m 42s' },
                    { label: 'Intent Accuracy', value: '97.3%' },
                    { label: 'Auto-Resolved',   value: '68.4%' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                      <div className="text-2xl font-bold gradient-text">{value}</div>
                      <div className="text-xs text-gray-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* System health + channel breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* AI system health */}
              <motion.div {...fadeUp(0.1)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Server size={16} className="text-brand-400" />
                  <h3 className="font-semibold text-white">AI System Health</h3>
                  <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow inline-block" />
                    All Operational
                  </span>
                </div>
                <div className="space-y-3">
                  {SYSTEM_HEALTH.map(({ name, status, latency, model }) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${status === 'operational' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">{name}</div>
                        <div className="text-xs text-gray-500 truncate">{model}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-semibold text-gray-300">{latency}</div>
                        <div className="text-xs text-emerald-400 capitalize">{status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Channel breakdown */}
              <motion.div {...fadeUp(0.12)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Activity size={16} className="text-brand-400" />
                  <h3 className="font-semibold text-white">Channel Breakdown</h3>
                </div>
                <div className="space-y-4 mb-6">
                  {[
                    { label: 'Inbound',  count: 847, pct: 66, color: 'bg-brand-500',  text: 'text-brand-400',  icon: PhoneIncoming  },
                    { label: 'Outbound', count: 437, pct: 34, color: 'bg-accent-500', text: 'text-accent-400', icon: PhoneOutgoing  },
                  ].map(({ label, count, pct, color, text, icon: Icon }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className={text} />
                          <span className="text-sm text-gray-300">{label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-white">{count.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                          className={`h-full rounded-full ${color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Avg Queue Wait', value: '18s'    },
                    { label: 'Peak Hour',       value: '2–3 PM' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                      <div className="text-lg font-bold text-white">{value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent call log */}
            <motion.div {...fadeUp(0.15)} className="glass border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h3 className="font-semibold text-white">Recent Calls</h3>
                <p className="text-xs text-gray-500 mt-0.5">Live call log — last 30 minutes</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Call ID', 'Type', 'Duration', 'Intent', 'Outcome', 'Sentiment', 'Time'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {RECENT_CALLS.map((call) => (
                      <tr key={call.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-400 whitespace-nowrap">{call.id}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            {call.type === 'inbound'
                              ? <PhoneIncoming  size={12} className="text-brand-400"  />
                              : <PhoneOutgoing  size={12} className="text-accent-400" />}
                            <span className="text-xs capitalize text-gray-300">{call.type}</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-300 whitespace-nowrap">{call.duration}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-300">{call.intent}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            call.outcome === 'resolved'
                              ? 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300'
                              : 'bg-amber-900/40 border-amber-700/40 text-amber-300'
                          }`}>
                            {call.outcome}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className={`text-xs font-medium capitalize ${
                            call.sentiment === 'positive' ? 'text-emerald-400'
                              : call.sentiment === 'negative' ? 'text-red-400'
                              : 'text-gray-400'
                          }`}>{call.sentiment}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">{call.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Expansion CTA */}
            <motion.div {...fadeUp(0.2)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="font-semibold text-white mb-1">Expand Voice AI Coverage</h3>
              <p className="text-sm text-gray-400 mb-4">Deploy SmartCall AI to additional queues or add VoiceFlow workflows to new use cases.</p>
              <button onClick={() => setShowService(true)} className="btn-primary text-sm">
                + Request Voice AI Expansion
              </button>
            </motion.div>
          </>
        )}

        {/* ══════════════════════════════════
            AI INSIGHTS
            ══════════════════════════════════ */}
        {activeNav === 'insights' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                <Lightbulb size={18} className="text-brand-400" /> AI Recommendations
              </h2>
              <p className="text-sm text-gray-400 mb-5">Auto-generated based on your usage patterns and deployment telemetry.</p>
            </motion.div>

            {/* Summary count row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'High Priority',   count: insights.filter(i => i.severity === 'high').length,   color: 'text-amber-400',  border: 'border-amber-700/30',  bg: 'bg-amber-900/10'  },
                { label: 'Medium Priority', count: insights.filter(i => i.severity === 'medium').length, color: 'text-brand-400',  border: 'border-brand-700/30',  bg: 'bg-brand-900/10'  },
                { label: 'Low Priority',    count: insights.filter(i => i.severity === 'low').length,    color: 'text-accent-400', border: 'border-accent-700/30', bg: 'bg-accent-900/10' },
              ].map(({ label, count, color, border, bg }) => (
                <motion.div key={label} {...fadeUp(0.05)} className={`glass border ${border} ${bg} rounded-2xl p-4 text-center`}>
                  <div className={`text-3xl font-extrabold ${color} mb-1`}>{loading ? '—' : count}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Filter tabs */}
            <motion.div {...fadeUp(0.08)} className="flex gap-2 flex-wrap">
              {[
                { id: 'all',    label: 'All',    count: insights.length                                           },
                { id: 'high',   label: 'High',   count: insights.filter(i => i.severity === 'high').length    },
                { id: 'medium', label: 'Medium', count: insights.filter(i => i.severity === 'medium').length  },
                { id: 'low',    label: 'Low',    count: insights.filter(i => i.severity === 'low').length     },
              ].map(({ id, label, count }) => (
                <button
                  key={id}
                  onClick={() => setInsightFilter(id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    insightFilter === id
                      ? 'bg-brand-700/60 text-brand-200 border-brand-600/40'
                      : 'bg-white/5 text-gray-500 border-white/10 hover:text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {label} <span className="ml-1 opacity-60">{count}</span>
                </button>
              ))}
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={24} className="animate-spin text-brand-400" />
                </div>
              ) : filteredInsights.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-gray-500">
                  <Lightbulb size={32} className="mb-3 opacity-40" />
                  <p className="text-sm">No {insightFilter} priority insights.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredInsights.map((ins, i) => (
                    <motion.div
                      key={ins.timestamp || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0  }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-3 p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all"
                    >
                      <InsightIcon severity={ins.severity} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold uppercase tracking-wide ${
                            ins.severity === 'high' ? 'text-amber-400' : ins.severity === 'medium' ? 'text-brand-400' : 'text-accent-400'
                          }`}>{ins.severity} priority</span>
                          {ins.timestamp && (
                            <span className="text-xs text-gray-600">
                              {new Date(ins.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed mb-3">{ins.insight}</p>
                        <button
                          onClick={() => ins.severity === 'high' ? setShowService(true) : setShowSupport(true)}
                          className="text-xs text-brand-300 hover:text-brand-200 font-medium transition-colors flex items-center gap-1"
                        >
                          {ins.severity === 'high' ? 'Request Deployment' : 'Open Support Ticket'} <ArrowUpRight size={11} />
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
            SUPPORT
            ══════════════════════════════════ */}
        {activeNav === 'support' && (
          <>
            <motion.div {...fadeUp(0)}>
              <h2 className="text-lg font-bold text-white mb-1">Enterprise Support</h2>
              <p className="text-sm text-gray-400 mb-5">Submit tickets, track open issues, and reach your dedicated solutions team.</p>
            </motion.div>

            {/* SLA cards — 4 priority tiers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { priority: 'Critical', sla: '1 hour',   color: 'border-red-700/40 bg-red-900/10',       text: 'text-red-300',    desc: 'System down / data loss'      },
                { priority: 'High',     sla: '4 hours',  color: 'border-orange-700/40 bg-orange-900/10', text: 'text-orange-300', desc: 'Major feature impaired'       },
                { priority: 'Medium',   sla: '8 hours',  color: 'border-amber-700/40 bg-amber-900/10',   text: 'text-amber-300',  desc: 'Partial functionality loss'   },
                { priority: 'Low',      sla: '24 hours', color: 'border-gray-700/40 bg-gray-800/20',     text: 'text-gray-400',   desc: 'Questions & how-to requests'  },
              ].map(({ priority, sla, color, text, desc }) => (
                <motion.div
                  key={priority}
                  {...fadeUp(0.05)}
                  className={`glass border rounded-2xl p-5 ${color}`}
                >
                  <div className={`text-xs font-semibold mb-1 ${text}`}>{priority} Priority</div>
                  <div className="text-2xl font-bold text-white">{sla}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-snug">{desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Support action card */}
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

            {/* Contact channel cards */}
            <motion.div {...fadeUp(0.15)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
              <h3 className="font-semibold text-white mb-4">Direct Contact Channels</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Mail,          label: 'Enterprise Support',  value: 'enterprise@nexusai.io',    color: 'from-brand-600 to-brand-800'   },
                  { icon: Phone,         label: 'Emergency Hotline',   value: '+1 (888) 639-8724',        color: 'from-teal-600 to-teal-800'     },
                  { icon: MessageSquare, label: 'Slack Connect',       value: 'Dedicated workspace',      color: 'from-accent-600 to-accent-800' },
                  { icon: User,          label: 'Solutions Architect', value: 'Assigned to your account', color: 'from-amber-600 to-amber-800'   },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                    <div className="text-sm font-medium text-white">{value}</div>
                  </div>
                ))}
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
