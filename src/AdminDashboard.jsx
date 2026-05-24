// ─────────────────────────────────────────────
//  AdminDashboard — operational view for admins
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Ticket, Rocket, BarChart2,
  CheckCircle, Clock, AlertCircle, Loader2, ArrowUpRight,
  TrendingUp, Zap, Shield, Activity,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import DashboardLayout from './DashboardLayout'
import { getEnterpriseMetrics } from './api'

/* ── Nav ── */
const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',         icon: LayoutDashboard },
  { id: 'requests',  label: 'Service Requests', icon: Rocket          },
  { id: 'support',   label: 'Support Queue',    icon: Ticket          },
  { id: 'users',     label: 'User Management',  icon: Users           },
  { id: 'analytics', label: 'Analytics',        icon: BarChart2       },
]

/* ── Mock service requests (admin view) ── */
const MOCK_SERVICE_REQUESTS = [
  { id: 'SR-001', company: 'Acme Corp',      service: 'LLM / SLM Deployment',       status: 'in_progress', urgency: 'priority',  submitted: '2 days ago'  },
  { id: 'SR-002', company: 'Bloom Retail',   service: 'Voice AI / Call Center',      status: 'pending',     urgency: 'standard',  submitted: '1 day ago'   },
  { id: 'SR-003', company: 'Techwave Inc.',  service: 'Enterprise RAG Platform',     status: 'completed',   urgency: 'urgent',    submitted: '5 days ago'  },
  { id: 'SR-004', company: 'NovaBridge',     service: 'Workflow Automation',         status: 'pending',     urgency: 'standard',  submitted: '3 hours ago' },
  { id: 'SR-005', company: 'CoreLogix',      service: 'Transformation Consulting',  status: 'in_progress', urgency: 'priority',  submitted: '4 days ago'  },
]

/* ── Mock support tickets (admin view) ── */
const MOCK_SUPPORT_TICKETS = [
  { id: 'TKT-1084', company: 'Acme Corp',     subject: 'Model latency spike in prod', priority: 'critical', status: 'open',        assigned: '–' },
  { id: 'TKT-1083', company: 'Techwave Inc.', subject: 'API auth token expiry issue', priority: 'high',     status: 'in_progress', assigned: 'Alex M.' },
  { id: 'TKT-1082', company: 'Bloom Retail',  subject: 'RAG retrieval accuracy drop', priority: 'medium',   status: 'open',        assigned: '–' },
  { id: 'TKT-1081', company: 'CoreLogix',     subject: 'Voice agent routing config',  priority: 'low',      status: 'resolved',    assigned: 'Sarah K.' },
]

/* ── Onboarding pipeline stages ── */
const PIPELINE_STAGES = [
  { stage: 'pending',      label: 'Pending',      count: 3,  color: 'bg-gray-500'    },
  { stage: 'consultation', label: 'Consultation', count: 5,  color: 'bg-amber-500'   },
  { stage: 'scoping',      label: 'Scoping',      count: 4,  color: 'bg-brand-500'   },
  { stage: 'deployment',   label: 'Deploying',    count: 2,  color: 'bg-accent-500'  },
  { stage: 'deployed',     label: 'Deployed',     count: 12, color: 'bg-emerald-500' },
]

/* ── Status badge ── */
function Badge({ value, map }) {
  const { label, cls } = map[value] || { label: value, cls: 'bg-gray-800 text-gray-400 border-gray-700' }
  return <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${cls}`}>{label}</span>
}

const STATUS_MAP = {
  pending:     { label: 'Pending',     cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'   },
  in_progress: { label: 'In Progress', cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300'   },
  completed:   { label: 'Completed',   cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
  open:        { label: 'Open',        cls: 'bg-red-900/40 border-red-700/40 text-red-300'          },
  resolved:    { label: 'Resolved',    cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
}

const URGENCY_MAP = {
  urgent:   { label: 'Urgent',   cls: 'bg-red-900/40 border-red-700/40 text-red-300'          },
  priority: { label: 'Priority', cls: 'bg-orange-900/40 border-orange-700/40 text-orange-300' },
  standard: { label: 'Standard', cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'       },
}

const PRIORITY_MAP = {
  critical: { label: 'Critical', cls: 'bg-red-900/40 border-red-700/40 text-red-300'          },
  high:     { label: 'High',     cls: 'bg-orange-900/40 border-orange-700/40 text-orange-300' },
  medium:   { label: 'Medium',   cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'    },
  low:      { label: 'Low',      cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'       },
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0  },
  transition: { delay, duration: 0.4 },
})

/* ════════════════════════════════════════════
   AdminDashboard
   ════════════════════════════════════════════ */
export default function AdminDashboard({ session }) {
  const [activeNav, setActiveNav] = useState('overview')
  const [metrics,   setMetrics]   = useState(null)
  const [loading,   setLoading]   = useState(true)

  async function loadData() {
    setLoading(true)
    const m = await getEnterpriseMetrics(session?.username)
    const rows = m.metrics || []
    // Compute summary from daily rows array: { date, aiCalls, chatbotSessions, automationHoursSaved, satisfactionScore }
    const totalCalls   = rows.reduce((s, r) => s + (r.aiCalls || 0), 0)
    const totalSessions = rows.reduce((s, r) => s + (r.chatbotSessions || 0), 0)
    const totalHours   = rows.reduce((s, r) => s + (r.automationHoursSaved || 0), 0)
    const avgScore     = rows.length
      ? (rows.reduce((s, r) => s + (r.satisfactionScore || 0), 0) / rows.length).toFixed(1)
      : '–'
    setMetrics({ totalCalls, totalSessions, totalHours, avgScore })
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const ADMIN_METRICS = [
    { label: 'Total AI Calls',       value: metrics?.totalCalls?.toLocaleString()   || '–', change: '+18%',  up: true,  icon: Activity,   color: 'from-brand-600 to-brand-800',   bg: 'bg-brand-900/20',  border: 'border-brand-700/30' },
    { label: 'Chatbot Sessions',     value: metrics?.totalSessions?.toLocaleString() || '–', change: '+22%',  up: true,  icon: CheckCircle, color: 'from-emerald-600 to-emerald-800', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30' },
    { label: 'Automation Hrs Saved', value: metrics?.totalHours?.toLocaleString()    || '–', change: '+32%',  up: true,  icon: Rocket,     color: 'from-accent-600 to-accent-800', bg: 'bg-accent-900/20', border: 'border-accent-700/30' },
    { label: 'Avg Satisfaction',     value: metrics?.avgScore ? `${metrics.avgScore}/5` : '–', change: '+0.2', up: true, icon: TrendingUp, color: 'from-teal-600 to-teal-800',   bg: 'bg-teal-900/20',   border: 'border-teal-700/30'  },
  ]

  /* ── Shared admin metric cards ── */
  const AdminMetricCards = (
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {ADMIN_METRICS.map(({ label, value, change, up, icon: Icon, color, bg, border }, i) => (
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
              <ArrowUpRight size={13} /> {change}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">{loading ? '—' : String(value)}</div>
          <div className="text-xs text-gray-400">{label}</div>
        </motion.div>
      ))}
    </div>
  )

  /* ── Onboarding pipeline panel ── */
  const OnboardingPipeline = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
      <h3 className="font-semibold text-white mb-1">Client Onboarding Pipeline</h3>
      <p className="text-xs text-gray-500 mb-5">Accounts by stage</p>
      <div className="flex flex-wrap gap-3">
        {PIPELINE_STAGES.map(({ label, count, color }) => (
          <div key={label} className="flex-1 min-w-[100px] p-4 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{count}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={PIPELINE_STAGES} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {PIPELINE_STAGES.map((_, i) => (
                <Cell key={i} fill={['#6b7280','#f59e0b','#4a5eff','#8b5cf6','#10b981'][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )

  /* ── Service requests table ── */
  const ServiceRequestsTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Service Requests</h3>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_SERVICE_REQUESTS.length} total · {MOCK_SERVICE_REQUESTS.filter(r => r.status === 'pending').length} pending</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['ID', 'Company', 'Service', 'Urgency', 'Status', 'Submitted'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_SERVICE_REQUESTS.map((req) => (
              <tr key={req.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{req.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{req.company}</td>
                <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{req.service}</td>
                <td className="px-4 py-3"><Badge value={req.urgency} map={URGENCY_MAP} /></td>
                <td className="px-4 py-3"><Badge value={req.status}  map={STATUS_MAP}  /></td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{req.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  /* ── Support queue table ── */
  const SupportQueueTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Support Queue</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {MOCK_SUPPORT_TICKETS.filter(t => t.status !== 'resolved').length} open ·{' '}
            {MOCK_SUPPORT_TICKETS.filter(t => t.priority === 'critical').length} critical
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['Ticket', 'Company', 'Subject', 'Priority', 'Status', 'Assigned'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_SUPPORT_TICKETS.map((tkt) => (
              <tr key={tkt.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{tkt.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{tkt.company}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{tkt.subject}</td>
                <td className="px-4 py-3"><Badge value={tkt.priority} map={PRIORITY_MAP} /></td>
                <td className="px-4 py-3"><Badge value={tkt.status}   map={STATUS_MAP}  /></td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{tkt.assigned}</td>
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
      subtitle="Operations & Enterprise Management"
      navItems={NAV_ITEMS}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onRefresh={loadData}
    >

      {/* ══════════════════════════════════
          OVERVIEW — welcome + metrics + pipeline summary
          ══════════════════════════════════ */}
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
                  <span className="text-gray-400 text-xs">Full operational access</span>
                </div>
                <h2 className="font-bold text-white">Welcome, {session?.username}. Manage enterprise accounts and deployments below.</h2>
              </div>
            </div>
          </motion.div>

          {AdminMetricCards}
          {OnboardingPipeline}

          {/* Quick nav to sub-sections */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Service Requests', count: MOCK_SERVICE_REQUESTS.filter(r => r.status === 'pending').length, sub: 'pending',   nav: 'requests', color: 'text-amber-400'   },
              { label: 'Support Tickets',  count: MOCK_SUPPORT_TICKETS.filter(t => t.status !== 'resolved').length,  sub: 'open',      nav: 'support',  color: 'text-red-400'     },
              { label: 'Total Clients',    count: PIPELINE_STAGES.reduce((s, p) => s + p.count, 0),                  sub: 'onboarded', nav: 'users',    color: 'text-brand-400'   },
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

      {/* ══════════════════════════════════
          REQUESTS — service requests table
          ══════════════════════════════════ */}
      {activeNav === 'requests' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Service Requests</h2>
            <p className="text-sm text-gray-400 mb-5">All inbound enterprise service requests across the platform.</p>
          </motion.div>
          {ServiceRequestsTable}
        </>
      )}

      {/* ══════════════════════════════════
          SUPPORT — support queue
          ══════════════════════════════════ */}
      {activeNav === 'support' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Support Queue</h2>
            <p className="text-sm text-gray-400 mb-5">Open and in-progress support tickets across all enterprise accounts.</p>
          </motion.div>

          {/* Critical alert if any */}
          {MOCK_SUPPORT_TICKETS.some(t => t.priority === 'critical' && t.status !== 'resolved') && (
            <motion.div {...fadeUp(0.03)} className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-700/40 text-red-300 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{MOCK_SUPPORT_TICKETS.filter(t => t.priority === 'critical' && t.status !== 'resolved').length} critical ticket(s) require immediate attention.</span>
            </motion.div>
          )}

          {SupportQueueTable}
        </>
      )}

      {/* ══════════════════════════════════
          USERS — client onboarding pipeline
          ══════════════════════════════════ */}
      {activeNav === 'users' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">User Management</h2>
            <p className="text-sm text-gray-400 mb-5">Enterprise client accounts and onboarding stage tracking.</p>
          </motion.div>
          {OnboardingPipeline}

          {/* Total summary */}
          <motion.div {...fadeUp(0.1)} className="glass border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{PIPELINE_STAGES.reduce((s, p) => s + p.count, 0)}</div>
                <div className="text-sm text-gray-400 mt-0.5">Total enterprise accounts</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-emerald-400">{PIPELINE_STAGES.find(p => p.stage === 'deployed')?.count || 0} Deployed</div>
                <div className="text-xs text-gray-500 mt-0.5">Live in production</div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* ══════════════════════════════════
          ANALYTICS — metrics + pipeline chart
          ══════════════════════════════════ */}
      {activeNav === 'analytics' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Platform Analytics</h2>
            <p className="text-sm text-gray-400 mb-5">Aggregate metrics across all enterprise accounts.</p>
          </motion.div>
          {AdminMetricCards}
          {OnboardingPipeline}
        </>
      )}

    </DashboardLayout>
  )
}
