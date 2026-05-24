import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, BarChart2, Shield, Home, ArrowUpRight } from 'lucide-react'
import { fetchAIInsights } from './api'

const ICON_MAP = {
  TrendingUp,
  AlertCircle,
  BarChart2,
  Shield,
  Home,
}

const TREND_COLORS = [
  'from-brand-900/60 to-gray-900  border-brand-700/30',
  'from-amber-900/60 to-gray-900  border-amber-700/30',
  'from-sky-900/60   to-gray-900  border-sky-700/30',
  'from-emerald-900/60 to-gray-900 border-emerald-700/30',
  'from-rose-900/60  to-gray-900  border-rose-700/30',
]

const ACCENT_COLORS = [
  'text-brand-400',
  'text-amber-400',
  'text-sky-400',
  'text-emerald-400',
  'text-rose-400',
]

const MARKET_STATS = [
  { label: 'Avg. Price Appreciation (Gurugram)', value: '18.4%', sub: 'YoY — Golf Course Road corridor' },
  { label: 'NRI Investment Surge',               value: '34%',   sub: 'Increase in NRI buyer enquiries Q1 2026' },
  { label: 'RERA Registered Projects',           value: '100%',  sub: 'All EstateFlow listed properties' },
  { label: 'Avg. Rental Yield (HITEC City)',      value: '5.8%',  sub: 'Gross yield — Hyderabad premium segment' },
]

export default function InvestmentInsights() {
  const [insights, setInsights] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    fetchAIInsights().then((res) => {
      setInsights(res.insights || [])
      setLoading(false)
    })
  }, [])

  return (
    <section id="insights" className="py-24 relative bg-gray-950 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/20 to-transparent" />
      <div className="orb w-96 h-96 bg-brand-900 top-0 -right-20 opacity-15" />

      <div className="section-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4">AI Market Intelligence</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Real Estate{' '}
            <span className="gradient-text">Investment Insights</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Our AI engine continuously analyses market trends, RERA filings, demand signals,
            and builder performance to surface the best investment opportunities.
          </p>
        </motion.div>

        {/* Market stat tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {MARKET_STATS.map(({ label, value, sub }) => (
            <div key={label} className="glass border border-brand-800/30 rounded-2xl p-5 text-center">
              <div className="text-3xl font-black gradient-text mb-1">{value}</div>
              <div className="text-xs font-semibold text-white mb-1">{label}</div>
              <div className="text-xs text-gray-500">{sub}</div>
            </div>
          ))}
        </motion.div>

        {/* AI Insight cards */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/5">
                <div className="p-6 space-y-3">
                  <div className="shimmer h-4 w-1/3 rounded bg-white/5" />
                  <div className="shimmer h-5 w-3/4 rounded bg-white/5" />
                  <div className="shimmer h-12 rounded bg-white/5" />
                  <div className="shimmer h-8 w-1/3 rounded-xl bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {insights.map((insight, i) => {
              const Icon     = ICON_MAP[insight.icon] || TrendingUp
              const gradient = TREND_COLORS[i % TREND_COLORS.length]
              const accent   = ACCENT_COLORS[i % ACCENT_COLORS.length]

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass-dark bg-gradient-to-br ${gradient} border rounded-2xl p-6 flex flex-col gap-3 hover:shadow-gold hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${accent}`}>
                      {insight.category}
                    </span>
                    <div className={`flex items-center gap-1 text-sm font-black ${accent}`}>
                      {insight.trend}
                      <ArrowUpRight size={14} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={18} className={accent} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug mb-1">{insight.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{insight.body}</p>
                    </div>
                  </div>

                  <div className={`mt-auto pt-3 border-t border-white/5 text-xs font-medium ${accent}`}>
                    {insight.trendLabel}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">
            Get personalised investment recommendations based on your budget and goals.
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary px-10"
          >
            <TrendingUp size={16} /> Book Investment Consultation
          </button>
        </motion.div>
      </div>
    </section>
  )
}
