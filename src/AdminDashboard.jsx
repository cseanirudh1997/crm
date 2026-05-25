// ─────────────────────────────────────────────
//  AdminDashboard — real estate operations view
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, CalendarCheck, Building2,
  BarChart2, CheckCircle, Clock, AlertCircle, Loader2,
  ArrowUpRight, TrendingUp, Shield, Heart, MapPin,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import DashboardLayout from './DashboardLayout'
import { fetchDashboardMetrics } from './api'

/* ── Nav ── */
const NAV_ITEMS = [
  { id: 'overview',  label: 'Overview',        icon: LayoutDashboard },
  { id: 'leads',     label: 'Interest Leads',  icon: Heart           },
  { id: 'visits',    label: 'Site Visits',     icon: CalendarCheck   },
  { id: 'projects',  label: 'Projects',        icon: Building2       },
  { id: 'analytics', label: 'Analytics',       icon: BarChart2       },
]

/* ── Mock interest leads (admin view) ── */
const MOCK_LEADS = [
  { id: 'L-001', name: 'Rahul Sharma',    phone: '+91 98101 23456', project: 'The Arbour, DLF',          budget: '₹4–6 Cr',   status: 'contacted',   submitted: '10m ago'  },
  { id: 'L-002', name: 'Ananya Krishnan', phone: '+91 91234 56789', project: 'Prestige Lakeside',        budget: '₹2–5 Cr',   status: 'pending',     submitted: '2h ago'   },
  { id: 'L-003', name: 'Vikram Malhotra', phone: '+91 99871 23456', project: 'Lodha Bellavista',         budget: '₹3–5 Cr',   status: 'site_visit',  submitted: '1d ago'   },
  { id: 'L-004', name: 'Deepika Shetty',  phone: '+91 87654 32109', project: 'Smartworld One DXP',      budget: '₹5–8 Cr',   status: 'negotiation', submitted: '2d ago'   },
  { id: 'L-005', name: 'Arjun Nair',      phone: '+91 70001 23456', project: 'Lodha Park, Mumbai',      budget: '₹8–12 Cr',  status: 'booked',      submitted: '4d ago'   },
  { id: 'L-006', name: 'Priya Mehta',     phone: '+91 93456 78901', project: 'ATS Homekraft',            budget: '₹1–2 Cr',   status: 'pending',     submitted: '5h ago'   },
]

/* ── Mock site visits (admin view) ── */
const MOCK_VISITS = [
  { id: 'V-001', customerName: 'Rahul Sharma',    projectName: 'The Arbour, DLF',     preferredDate: '2026-05-26', preferredTime: '10:00 AM', status: 'confirmed', transport: true  },
  { id: 'V-002', customerName: 'Vikram Malhotra', projectName: 'Lodha Bellavista',    preferredDate: '2026-05-25', preferredTime: '2:00 PM',  status: 'pending',   transport: false },
  { id: 'V-003', customerName: 'Ananya Krishnan', projectName: 'Prestige Lakeside',   preferredDate: '2026-05-27', preferredTime: '10:00 AM', status: 'confirmed', transport: true  },
  { id: 'V-004', customerName: 'Arjun Nair',      projectName: 'Lodha Park, Mumbai',  preferredDate: '2026-05-28', preferredTime: '5:00 PM',  status: 'completed', transport: false },
]

/* ── Mock projects summary ── */
const MOCK_PROJECTS = [
  { id: 'P-001', name: 'The Arbour',        builder: 'DLF',        city: 'Gurugram',   leads: 18, visits: 7, status: 'active' },
  { id: 'P-002', name: 'Prestige Lakeside', builder: 'Prestige',   city: 'Bengaluru',  leads: 12, visits: 4, status: 'active' },
  { id: 'P-003', name: 'Lodha Bellavista',  builder: 'Lodha',      city: 'Noida',      leads: 21, visits: 9, status: 'active' },
  { id: 'P-004', name: 'Smartworld DXP',    builder: 'Smartworld', city: 'Gurugram',   leads: 9,  visits: 3, status: 'active' },
  { id: 'P-005', name: 'Lodha Park',        builder: 'Lodha',      city: 'Mumbai',     leads: 31, visits: 14,status: 'active' },
  { id: 'P-006', name: 'ATS Homekraft',     builder: 'ATS',        city: 'Noida',      leads: 7,  visits: 2, status: 'active' },
]

/* ── Sales pipeline stages ── */
const PIPELINE_STAGES = [
  { stage: 'pending',      label: 'Pending',     count: 8,  color: 'bg-gray-500'     },
  { stage: 'contacted',    label: 'Contacted',   count: 12, color: 'bg-amber-500'    },
  { stage: 'site_visit',   label: 'Site Visit',  count: 7,  color: 'bg-brand-500'    },
  { stage: 'negotiation',  label: 'Negotiation', count: 4,  color: 'bg-accent-500'   },
  { stage: 'booked',       label: 'Booked',      count: 5,  color: 'bg-emerald-500'  },
]

/* ── Lead analytics chart data ── */
const LEADS_CHART = [
  { month: 'Nov', leads: 14, visits: 5  },
  { month: 'Dec', leads: 18, visits: 8  },
  { month: 'Jan', leads: 22, visits: 11 },
  { month: 'Feb', leads: 19, visits: 9  },
  { month: 'Mar', leads: 28, visits: 13 },
  { month: 'Apr', leads: 35, visits: 17 },
  { month: 'May', leads: 42, visits: 20 },
]

/* ── Status badge ── */
function Badge({ value, map }) {
  const { label, cls } = map[value] || { label: value, cls: 'bg-gray-800 text-gray-400 border-gray-700' }
  return <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${cls}`}>{label}</span>
}

const LEAD_STATUS_MAP = {
  pending:     { label: 'Pending',     cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'          },
  contacted:   { label: 'Contacted',   cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'        },
  site_visit:  { label: 'Site Visit',  cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300'        },
  negotiation: { label: 'Negotiation', cls: 'bg-accent-900/40 border-accent-700/40 text-accent-300'     },
  booked:      { label: 'Booked 🎉',  cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300'   },
}

const VISIT_STATUS_MAP = {
  pending:   { label: 'Pending',   cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'      },
  confirmed: { label: 'Confirmed', cls: 'bg-brand-900/40 border-brand-700/40 text-brand-300'      },
  completed: { label: 'Completed', cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-900/40 border-red-700/40 text-red-300'            },
}

const PROJECT_STATUS_MAP = {
  active:   { label: 'Active',   cls: 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300' },
  upcoming: { label: 'Upcoming', cls: 'bg-amber-900/40 border-amber-700/40 text-amber-300'       },
  sold_out: { label: 'Sold Out', cls: 'bg-gray-800/60 border-gray-700/40 text-gray-400'          },
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
    const m = await fetchDashboardMetrics(session?.username)
    setMetrics(m.metrics || {})
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  /* ── Derived totals for admin ── */
  const totalLeads      = MOCK_LEADS.length
  const pendingLeads    = MOCK_LEADS.filter(l => l.status === 'pending').length
  const bookedLeads     = MOCK_LEADS.filter(l => l.status === 'booked').length
  const confirmedVisits = MOCK_VISITS.filter(v => v.status === 'confirmed').length

  const ADMIN_METRICS = [
    { label: 'Total Leads',      value: totalLeads,      sub: `${pendingLeads} pending`,   icon: Heart,         color: 'from-brand-600 to-brand-800',    bg: 'bg-brand-900/20',   border: 'border-brand-700/30',   change: '+24%' },
    { label: 'Site Visits',      value: MOCK_VISITS.length, sub: `${confirmedVisits} confirmed`, icon: CalendarCheck, color: 'from-emerald-600 to-emerald-800', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30', change: '+18%' },
    { label: 'Deals Closed',     value: bookedLeads,     sub: 'this month',                icon: CheckCircle,   color: 'from-accent-600 to-accent-800',  bg: 'bg-accent-900/20',  border: 'border-accent-700/30',  change: '+12%' },
    { label: 'Active Projects',  value: MOCK_PROJECTS.length, sub: '6 cities',             icon: Building2,     color: 'from-teal-600 to-teal-800',      bg: 'bg-teal-900/20',    border: 'border-teal-700/30',    change: '+3'   },
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

  /* ── Sales pipeline panel ── */
  const SalesPipeline = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
      <h3 className="font-semibold text-white mb-0.5">Sales Pipeline</h3>
      <p className="text-xs text-gray-500 mb-5">Leads by conversion stage</p>
      <div className="flex flex-wrap gap-3 mb-5">
        {PIPELINE_STAGES.map(({ label, count, color }) => (
          <div key={label} className="flex-1 min-w-[90px] p-4 rounded-xl bg-white/5 border border-white/5 text-center">
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
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {PIPELINE_STAGES.map((_, i) => (
              <Cell key={i} fill={['#6b7280','#f59e0b','#c99a1a','#b8915a','#10b981'][i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )

  /* ── Leads table ── */
  const LeadsTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Interest Leads</h3>
          <p className="text-xs text-gray-500 mt-0.5">{totalLeads} total · {pendingLeads} need follow-up</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['ID', 'Name', 'Phone', 'Project', 'Budget', 'Status', 'Received'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_LEADS.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{lead.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{lead.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{lead.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{lead.project}</td>
                <td className="px-4 py-3 text-sm text-brand-300 whitespace-nowrap font-medium">{lead.budget}</td>
                <td className="px-4 py-3"><Badge value={lead.status} map={LEAD_STATUS_MAP} /></td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{lead.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  /* ── Visits table ── */
  const VisitsTable = (
    <motion.div {...fadeUp(0.05)} className="glass border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div>
          <h3 className="font-semibold text-white">Site Visit Requests</h3>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_VISITS.length} scheduled · {confirmedVisits} confirmed</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['ID', 'Customer Name', 'Project', 'Date', 'Time', 'Transport', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_VISITS.map((v) => (
              <tr key={v.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{v.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{v.customerName}</td>
                <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{v.projectName}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{v.preferredDate}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{v.preferredTime}</td>
                <td className="px-4 py-3 text-xs text-center">{v.transport ? '🚗 Yes' : '–'}</td>
                <td className="px-4 py-3"><Badge value={v.status} map={VISIT_STATUS_MAP} /></td>
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
          <h3 className="font-semibold text-white">Project Overview</h3>
          <p className="text-xs text-gray-500 mt-0.5">{MOCK_PROJECTS.length} active listings on platform</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['Project', 'Builder', 'City', 'Leads', 'Visits', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_PROJECTS.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-white whitespace-nowrap">{p.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{p.builder}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                    <MapPin size={10} />{p.city}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-brand-300">{p.leads}</td>
                <td className="px-4 py-3 text-sm font-semibold text-emerald-400">{p.visits}</td>
                <td className="px-4 py-3"><Badge value={p.status} map={PROJECT_STATUS_MAP} /></td>
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
      subtitle="Real Estate Operations & Lead Management"
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
                <h2 className="font-bold text-white">Welcome, {session?.username}. Manage leads, visits, and listings below.</h2>
              </div>
            </div>
          </motion.div>

          {MetricCards}
          {SalesPipeline}

          {/* Quick nav cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Pending Leads',   count: pendingLeads,    sub: 'awaiting contact', nav: 'leads',    color: 'text-amber-400'   },
              { label: 'Upcoming Visits', count: confirmedVisits, sub: 'confirmed',         nav: 'visits',   color: 'text-brand-400'   },
              { label: 'Active Projects', count: MOCK_PROJECTS.length, sub: 'on platform',  nav: 'projects', color: 'text-emerald-400' },
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
          LEADS
          ══════════════════════════════════ */}
      {activeNav === 'leads' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Interest Leads</h2>
            <p className="text-sm text-gray-400 mb-5">All buyer interest registrations across all projects.</p>
          </motion.div>
          {MOCK_LEADS.some(l => l.status === 'pending') && (
            <motion.div {...fadeUp(0.03)} className="flex items-center gap-3 p-4 rounded-xl bg-amber-900/20 border border-amber-700/40 text-amber-300 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{pendingLeads} lead(s) awaiting initial contact — follow up within 24 hours.</span>
            </motion.div>
          )}
          {LeadsTable}
        </>
      )}

      {/* ══════════════════════════════════
          VISITS
          ══════════════════════════════════ */}
      {activeNav === 'visits' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Site Visit Requests</h2>
            <p className="text-sm text-gray-400 mb-5">All scheduled and completed property visits.</p>
          </motion.div>
          {VisitsTable}
        </>
      )}

      {/* ══════════════════════════════════
          PROJECTS
          ══════════════════════════════════ */}
      {activeNav === 'projects' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Project Management</h2>
            <p className="text-sm text-gray-400 mb-5">All listed projects and their lead performance.</p>
          </motion.div>
          {SalesPipeline}
          {ProjectsTable}
        </>
      )}

      {/* ══════════════════════════════════
          ANALYTICS
          ══════════════════════════════════ */}
      {activeNav === 'analytics' && (
        <>
          <motion.div {...fadeUp(0)}>
            <h2 className="text-lg font-bold text-white mb-1">Platform Analytics</h2>
            <p className="text-sm text-gray-400 mb-5">Monthly lead and site visit trends.</p>
          </motion.div>
          {MetricCards}

          {/* Leads vs Visits chart */}
          <motion.div {...fadeUp(0.1)} className="glass border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 className="font-semibold text-white mb-0.5">Leads &amp; Visits — Last 7 Months</h3>
            <p className="text-xs text-gray-500 mb-5">Monthly inbound interest registrations and site visits</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={LEADS_CHART} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="leads"  name="Leads"  radius={[4,4,0,0]} fill="#c99a1a" />
                <Bar dataKey="visits" name="Visits" radius={[4,4,0,0]} fill="#5eead4" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 justify-center">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#c99a1a]" /><span className="text-xs text-gray-400">Leads</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#5eead4]" /><span className="text-xs text-gray-400">Site Visits</span></div>
            </div>
          </motion.div>

          {SalesPipeline}
        </>
      )}

    </DashboardLayout>
  )
}
