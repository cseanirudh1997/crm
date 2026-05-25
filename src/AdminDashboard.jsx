// ─────────────────────────────────────────────
//  AdminDashboard — interior design studio operations
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, CalendarCheck, Home,
  BarChart2, CheckCircle, Clock, AlertCircle, Loader2,
  ArrowUpRight, TrendingUp, Shield, Palette, Star,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import DashboardLayout from './DashboardLayout'
import { fetchDashboardMetrics } from './api'

/* ── Nav ── */
const NAV_ITEMS = [
  { id: 'overview',      label: 'Overview',       icon: LayoutDashboard },
  { id: 'consultations', label: 'Consultations',  icon: CalendarCheck   },
  { id: 'projects',      label: 'Projects',       icon: Home            },
  { id: 'clients',       label: 'Clients',        icon: Users           },
  { id: 'analytics',     label: 'Analytics',      icon: BarChart2       },
]

/* ── Mock consultation bookings ── */
const MOCK_BOOKINGS = [
  { id: 'B-001', name: 'Rahul Sharma',     phone: '+91 98101 23456', service: 'Full Home Interior',   budget: '₹10–15L',  status: 'confirmed',   submitted: '10m ago' },
  { id: 'B-002', name: 'Ananya Krishnan',  phone: '+91 91234 56789', service: 'Modular Kitchen',      budget: '₹3–5L',    status: 'pending',     submitted: '2h ago'  },
  { id: 'B-003', name: 'Vikram Malhotra',  phone: '+91 99871 23456', service: 'Luxury Villa Design',  budget: '₹30–50L',  status: 'in_progress', submitted: '1d ago'  },
  { id: 'B-004', name: 'Deepika Shetty',   phone: '+91 87654 32109', service: 'Premium Bedroom Suite',budget: '₹4–6L',    status: 'completed',   submitted: '2d ago'  },
  { id: 'B-005', name: 'Arjun Nair',       phone: '+91 70001 23456', service: 'Full Home Interior',   budget: '₹12–18L',  status: 'confirmed',   submitted: '4d ago'  },
  { id: 'B-006', name: 'Priya Mehta',      phone: '+91 93456 78901', service: 'Living Room Makeover', budget: '₹2–3L',    status: 'pending',     submitted: '5h ago'  },
]

/* ── Mock active design projects ── */
const MOCK_PROJECTS = [
  { id: 'P-001', name: '3BHK — Bandra West',        client: 'Rahul Sharma',   service: 'Full Home Interior',  stage: 'execution',    designer: 'Aisha Kapoor', area: '1,850 sq ft' },
  { id: 'P-002', name: 'Villa — Whitefield',         client: 'Vikram Malhotra',service: 'Luxury Villa Design', stage: 'design',       designer: 'Rohan Mehta',  area: '4,200 sq ft' },
  { id: 'P-003', name: 'Kitchen — DLF Cyber City',   client: 'Deepika Shetty', service: 'Modular Kitchen',     stage: 'completed',    designer: 'Priya Nair',   area: '380 sq ft'   },
  { id: 'P-004', name: 'Penthouse — Juhu',           client: 'Arjun Nair',     service: 'Premium Living Suite',stage: 'consultation', designer: 'Aisha Kapoor', area: '2,600 sq ft' },
  { id: 'P-005', name: 'Office Lobby — BKC',         client: 'Mehta Corp.',    service: 'Commercial Interior', stage: 'design',       designer: 'Rohan Mehta',  area: '900 sq ft'   },
  { id: 'P-006', name: 'Bedroom Suite — Powai',      client: 'Ananya Krishnan',service: 'Bedroom & Bath Suite',stage: 'pending',      designer: 'TBD',          area: '480 sq ft'   },
]

/* ── Mock clients ── */
const MOCK_CLIENTS = [
  { id: 'C-001', name: 'Rahul Sharma',    tier: 'premium', projects: 2, since: 'Jan 2025', status: 'active'   },
  { id: 'C-002', name: 'Vikram Malhotra', tier: 'premium', projects: 1, since: 'Oct 2024', status: 'active'   },
  { id: 'C-003', name: 'Deepika Shetty',  tier: 'client',  projects: 1, since: 'Mar 2025', status: 'completed'},
  { id: 'C-004', name: 'Arjun Nair',      tier: 'premium', projects: 1, since: 'Feb 2026', status: 'active'   },
  { id: 'C-005', name: 'Ananya Krishnan', tier: 'client',  projects: 1, since: 'Apr 2026', status: 'new'      },
  { id: 'C-006', name: 'Priya Mehta',     tier: 'client',  projects: 0, since: 'May 2026', status: 'new'      },
]

/* ── Design pipeline stages ── */
const PIPELINE_STAGES = [
  { stage: 'pending',      label: 'Pending',     count: 1, color: 'bg-gray-500'   },
  { stage: 'consultation', label: 'Consult',     count: 2, color: 'bg-accent-500' },
  { stage: 'design',       label: 'Design',      count: 2, color: 'bg-brand-500'  },
  { stage: 'execution',    label: 'Execution',   count: 2, color: 'bg-amber-500'  },
  { stage: 'completed',    label: 'Completed',   count: 1, color: 'bg-emerald-500'},
]

/* ── Monthly bookings & projects chart ── */
const ANALYTICS_CHART = [
  { month: 'Nov', bookings: 8,  projects: 4  },
  { month: 'Dec', bookings: 12, projects: 6  },
  { month: 'Jan', bookings: 15, projects: 9  },
  { month: 'Feb', bookings: 11, projects: 7  },
  { month: 'Mar', bookings: 18, projects: 11 },
  { month: 'Apr', bookings: 22, projects: 14 },
  { month: 'May', bookings: 28, projects: 16 },
]

/* ── Status maps ── */
const BOOKING_STATUS_MAP = {
  pending:     { label: 'Pending',     cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'          },
  confirmed:   { label: 'Confirmed',   cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300'       },
  in_progress: { label: 'In Progress', cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'       },
  completed:   { label: 'Completed ✓', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
  cancelled:   { label: 'Cancelled',   cls: 'bg-red-900/40 border-red-700/40 text-red-300'             },
}

const PROJECT_STAGE_MAP = {
  pending:     { label: 'Pending',     cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'          },
  consultation:{ label: 'Consultation',cls: 'bg-accent-900/40 border-accent-700/40 text-accent-300'    },
  design:      { label: 'Design',      cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300'       },
  execution:   { label: 'Execution',   cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'       },
  completed:   { label: 'Completed ✓', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
}

const CLIENT_STATUS_MAP = {
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
  const totalBookings    = MOCK_BOOKINGS.length
  const pendingBookings  = MOCK_BOOKINGS.filter(b => b.status === 'pending').length
  const confirmedBookings= MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length
  const activeProjects   = MOCK_PROJECTS.filter(p => p.stage !== 'completed').length
  const completedProjects= MOCK_PROJECTS.filter(p => p.stage === 'completed').length

  const ADMIN_METRICS = [
    { label: 'Total Consultations', value: totalBookings,     sub: `${pendingBookings} pending`,   icon: CalendarCheck, color: 'from-brand-600 to-brand-800',    bg: 'bg-brand-900/20',   border: 'border-brand-700/30',   change: '+28%' },
    { label: 'Active Projects',     value: activeProjects,    sub: 'in-progress',                  icon: Home,          color: 'from-emerald-600 to-emerald-800', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30', change: '+15%' },
    { label: 'Completed Designs',   value: completedProjects, sub: 'this season',                  icon: Star,          color: 'from-accent-600 to-accent-800',   bg: 'bg-accent-900/20',  border: 'border-accent-700/30',  change: '+9%'  },
    { label: 'Total Clients',       value: MOCK_CLIENTS.length, sub: `${MOCK_CLIENTS.filter(c => c.tier === 'premium').length} premium`, icon: Users, color: 'from-teal-600 to-teal-800', bg: 'bg-teal-900/20', border: 'border-teal-700/30', change: '+4'  },
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

  /* ── Design pipeline panel ── */
  const DesignPipeline = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
      <h3 className="font-semibold text-white mb-0.5">Design Pipeline</h3>
      <p className="text-xs text-gray-500 mb-5">Projects by stage</p>
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
          <Bar dataKey="count" name="Projects" radius={[4, 4, 0, 0]}>
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
              {['ID', 'Client', 'Phone', 'Service', 'Budget', 'Status', 'Received'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_BOOKINGS.map((b) => (
              <tr key={b.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{b.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{b.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{b.phone}</td>
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

  /* ── Projects table ── */
  const ProjectsTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Design Projects</h3>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_PROJECTS.length} total · {activeProjects} active</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['Project', 'Client', 'Service', 'Designer', 'Area', 'Stage'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_PROJECTS.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{p.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{p.client}</td>
                <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{p.service}</td>
                <td className="px-4 py-3 text-sm text-brand-300 whitespace-nowrap">{p.designer}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{p.area}</td>
                <td className="px-4 py-3"><Badge value={p.stage} map={PROJECT_STAGE_MAP} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  /* ── Clients table ── */
  const ClientsTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Client Directory</h3>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_CLIENTS.length} registered clients</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['ID', 'Name', 'Tier', 'Projects', 'Client Since', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_CLIENTS.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{c.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{c.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                    c.tier === 'premium'
                      ? 'bg-brand-900/40 border-brand-700/40 text-brand-300'
                      : 'bg-gray-800/60 border-gray-700/40 text-gray-400'
                  }`}>
                    {c.tier === 'premium' ? '⭐ Premium' : 'Design Client'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 text-center">{c.projects}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{c.since}</td>
                <td className="px-4 py-3"><Badge value={c.status} map={CLIENT_STATUS_MAP} /></td>
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
      subtitle="Interior Design Studio Operations"
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
                <h2 className="font-bold text-white">Welcome, {session?.username}. Manage consultations, projects, and clients below.</h2>
              </div>
            </div>
          </motion.div>

          {MetricCards}
          {DesignPipeline}

          {/* Quick nav cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Pending Bookings', count: pendingBookings,  sub: 'need follow-up',    nav: 'consultations', color: 'text-amber-400'   },
              { label: 'Active Projects',  count: activeProjects,   sub: 'in-progress',       nav: 'projects',      color: 'text-brand-400'   },
              { label: 'Total Clients',    count: MOCK_CLIENTS.length, sub: 'registered',     nav: 'clients',       color: 'text-emerald-400' },
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

      {/* ══ CONSULTATIONS ══ */}
      {activeNav === 'consultations' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Consultation Bookings</h2>
            <p className="text-sm text-gray-400 mb-5">All client consultation requests across all design services.</p>
          </motion.div>
          {pendingBookings > 0 && (
            <motion.div {...fadeUp(0.03)} className="flex items-center gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/40 text-amber-300 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{pendingBookings} booking(s) awaiting confirmation — follow up within 24 hours.</span>
            </motion.div>
          )}
          {BookingsTable}
        </>
      )}

      {/* ══ PROJECTS ══ */}
      {activeNav === 'projects' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Design Projects</h2>
            <p className="text-sm text-gray-400 mb-5">All active and completed interior design projects.</p>
          </motion.div>
          {DesignPipeline}
          {ProjectsTable}
        </>
      )}

      {/* ══ CLIENTS ══ */}
      {activeNav === 'clients' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Client Directory</h2>
            <p className="text-sm text-gray-400 mb-5">All registered clients and their design journey status.</p>
          </motion.div>
          {ClientsTable}
        </>
      )}

      {/* ══ ANALYTICS ══ */}
      {activeNav === 'analytics' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Studio Analytics</h2>
            <p className="text-sm text-gray-400 mb-5">Monthly consultation and project activity trends.</p>
          </motion.div>

          {MetricCards}

          {/* Bookings vs Projects chart */}
          <motion.div {...fadeUp(0.1)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-semibold text-white mb-0.5">Bookings &amp; Projects — Last 7 Months</h3>
            <p className="text-xs text-gray-500 mb-5">Monthly consultation bookings and new project starts</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ANALYTICS_CHART} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="bookings" name="Consultations" radius={[4,4,0,0]} fill="#c99a1a" />
                <Bar dataKey="projects" name="Projects"      radius={[4,4,0,0]} fill="#5eead4" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 justify-center">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#c99a1a]" /><span className="text-xs text-gray-400">Consultations</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#5eead4]" /><span className="text-xs text-gray-400">Projects</span></div>
            </div>
          </motion.div>

          {DesignPipeline}
        </>
      )}

    </DashboardLayout>
  )
}
