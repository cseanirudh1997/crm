import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, Users, Brain, Activity, Zap, LogOut,
  BarChart2, Database, AlertCircle, CheckCircle,
  ArrowUpRight, ArrowDownRight, RefreshCw,
} from 'lucide-react'
import { getSession, clearSession, formatDate } from './utils'
import { COMPANY_NAME } from './config'

/* ─── Mock Data ─────────────────────────────────────── */
const METRIC_CARDS = [
  {
    label:    'Revenue Forecasted',
    value:    '$12.4M',
    change:   '+8.2%',
    up:       true,
    icon:     TrendingUp,
    color:    'from-brand-600 to-brand-800',
    bg:       'bg-brand-900/20',
    border:   'border-brand-700/30',
  },
  {
    label:    'Active AI Models',
    value:    '47',
    change:   '+3 this week',
    up:       true,
    icon:     Brain,
    color:    'from-accent-600 to-accent-800',
    bg:       'bg-accent-900/20',
    border:   'border-accent-700/30',
  },
  {
    label:    'Data Points / Day',
    value:    '48.2M',
    change:   '+12.5%',
    up:       true,
    icon:     Database,
    color:    'from-teal-600 to-teal-800',
    bg:       'bg-teal-900/20',
    border:   'border-teal-700/30',
  },
  {
    label:    'Active Users',
    value:    '1,284',
    change:   '-2.1%',
    up:       false,
    icon:     Users,
    color:    'from-amber-600 to-amber-800',
    bg:       'bg-amber-900/20',
    border:   'border-amber-700/30',
  },
]

const ACTIVITIES = [
  { id: 1, text: 'RetailIQ model retrained with Q2 data',         time: '2 hours ago',   ok: true  },
  { id: 2, text: 'Pricing Engine detected margin opportunity',     time: '4 hours ago',   ok: true  },
  { id: 3, text: 'Forecast accuracy dipped below 90% threshold',  time: '6 hours ago',   ok: false },
  { id: 4, text: 'GenAssist processed 12,400 queries today',      time: '8 hours ago',   ok: true  },
  { id: 5, text: 'New data connector: Shopify synced',            time: 'Yesterday',     ok: true  },
  { id: 6, text: 'Supply chain disruption alert issued',          time: 'Yesterday',     ok: false },
]

const CHART_BARS = [65, 80, 55, 90, 72, 88, 95, 70, 85, 78, 92, 87]
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const INQUIRIES = [
  { name: 'Acme Corp',      email: 'cto@acme.com',      subject: 'Enterprise pricing enquiry',   ts: Date.now() - 3600000  },
  { name: 'Bloom Retail',   email: 'it@bloomretail.com', subject: 'RetailIQ demo request',       ts: Date.now() - 7200000  },
  { name: 'Techwave Inc.',  email: 'ana@techwave.io',   subject: 'GenAssist POC scope',          ts: Date.now() - 86400000 },
]

/* ─── Animated Counter ───────────────────────────── */
function AnimCounter({ end, duration = 1500 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const isStr  = typeof end === 'string'
    const num    = isStr ? parseFloat(end.replace(/[^0-9.]/g, '')) : end
    const steps  = 40
    const inc    = num / steps
    let cur      = 0
    const t = setInterval(() => {
      cur += inc
      if (cur >= num) { setVal(end); clearInterval(t) }
      else setVal(isStr ? end.replace(num.toString(), Math.floor(cur).toString()) : Math.floor(cur))
    }, duration / steps)
    return () => clearInterval(t)
  }, [end, duration])
  return <>{val}</>
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }

export default function Dashboard() {
  const navigate  = useNavigate()
  const session   = getSession()
  const [refresh, setRefresh] = useState(false)

  function handleLogout() {
    clearSession()
    navigate('/')
  }

  function handleRefresh() {
    setRefresh(true)
    setTimeout(() => setRefresh(false), 800)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar + main layout */}
      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 min-h-screen border-r border-white/10 bg-gray-950/80 fixed left-0 top-0 bottom-0 z-40">
          {/* Logo */}
          <div className="flex items-center gap-2 h-16 px-5 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold gradient-text">{COMPANY_NAME}</span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {[
              { label: 'Overview',   icon: BarChart2,  active: true  },
              { label: 'Analytics',  icon: TrendingUp,  active: false },
              { label: 'Models',     icon: Brain,       active: false },
              { label: 'Data',       icon: Database,    active: false },
              { label: 'Users',      icon: Users,       active: false },
              { label: 'Activity',   icon: Activity,    active: false },
            ].map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-brand-700/30 text-brand-300 border border-brand-700/30'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center text-white text-xs font-bold">
                {session?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{session?.username}</div>
                <div className="text-xs text-gray-500 truncate">{session?.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-56">
          {/* Top bar */}
          <div className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-white/10 bg-gray-950/90 backdrop-blur-xl">
            <div>
              <h1 className="text-lg font-bold text-white">Dashboard</h1>
              <p className="text-xs text-gray-500">{formatDate(Date.now())}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <RefreshCw size={15} className={refresh ? 'animate-spin' : ''} />
              </button>
              {/* Mobile logout */}
              <button
                onClick={handleLogout}
                className="lg:hidden w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-red-400 hover:text-red-300 transition-all"
              >
                <LogOut size={15} />
              </button>
              <Link to="/" className="btn-ghost text-xs hidden sm:flex">← Home</Link>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">

            {/* Welcome banner */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border border-brand-800/40 rounded-2xl p-6 bg-gradient-to-r from-brand-900/40 to-accent-900/20"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Welcome back 👋</p>
                  <h2 className="text-xl font-bold text-white">
                    {session?.username ? `Hello, ${session.username}!` : 'Hello!'}
                  </h2>
                  {session?.company && (
                    <p className="text-gray-400 text-sm mt-1">{session.company}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/40 text-emerald-300 text-xs font-medium">
                    ● All systems operational
                  </span>
                  <span className="px-3 py-1 rounded-full bg-brand-900/40 border border-brand-700/40 text-brand-300 text-xs font-medium capitalize">
                    {session?.role || 'user'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Metric cards */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4"
            >
              {METRIC_CARDS.map(({ label, value, change, up, icon: Icon, color, bg, border }) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className={`glass ${bg} border ${border} rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {change}
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-white mb-1">
                    <AnimCounter end={value} />
                  </div>
                  <div className="text-xs text-gray-400">{label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Chart + Activity */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Revenue chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 glass border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-white">Revenue Forecast</h3>
                    <p className="text-xs text-gray-500">12-month projection</p>
                  </div>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight size={12} /> +24% YoY
                  </span>
                </div>
                <div className="flex items-end gap-2 h-36">
                  {CHART_BARS.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.4 + i * 0.04, duration: 0.5 }}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <div className="w-full rounded-t-sm bg-gradient-to-t from-brand-700 to-brand-400 opacity-80" style={{ height: '100%' }} />
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {MONTHS.map((m) => (
                    <span key={m} className="text-xs text-gray-600 flex-1 text-center">{m}</span>
                  ))}
                </div>
              </motion.div>

              {/* Activity feed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass border border-white/10 rounded-2xl p-6"
              >
                <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {ACTIVITIES.map(({ id, text, time, ok }) => (
                    <div key={id} className="flex items-start gap-2.5">
                      {ok
                        ? <CheckCircle size={14} className="flex-shrink-0 text-emerald-400 mt-0.5" />
                        : <AlertCircle size={14} className="flex-shrink-0 text-amber-400 mt-0.5"  />
                      }
                      <div>
                        <p className="text-xs text-gray-300 leading-relaxed">{text}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Inquiries table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h3 className="font-semibold text-white">Recent Inquiries</h3>
                <span className="text-xs text-gray-500">{INQUIRIES.length} contacts</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Company','Email','Subject','Date'].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {INQUIRIES.map(({ name, email, subject, ts }) => (
                      <tr key={email} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-white font-medium">{name}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{email}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{subject}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{formatDate(ts)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
