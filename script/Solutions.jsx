import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, HeartPulse, Landmark, Truck, Globe2, CheckCircle } from 'lucide-react'

const SOLUTIONS = [
  {
    id:    'retail',
    icon:  ShoppingBag,
    label: 'Retail',
    headline: 'Intelligent Retail Transformation',
    desc:  'Drive same-store sales with AI-powered merchandising, dynamic pricing, and personalised promotions that work across online and offline channels.',
    bullets: [
      'Planogram & space optimisation',
      'Personalised recommendation engines',
      'Shrink and loss-prevention AI',
      'Customer lifetime value modelling',
      'Markdown and clearance automation',
    ],
    kpi: [{ v: '23%', l: 'Avg. Revenue Lift' }, { v: '41%', l: 'Inventory Reduction' }, { v: '18%', l: 'Margin Improvement' }],
    color:  'from-brand-900 to-gray-900',
    accent: 'text-brand-400',
    border: 'border-brand-700/30',
  },
  {
    id:    'healthcare',
    icon:  HeartPulse,
    label: 'Healthcare',
    headline: 'AI for Better Patient Outcomes',
    desc:  'Predictive care models, clinical NLP, and operational AI that help healthcare organisations deliver better outcomes while cutting costs.',
    bullets: [
      'Patient readmission prediction',
      'Clinical document intelligence',
      'Supply chain demand forecasting',
      'Staffing & scheduling optimisation',
      'Claims anomaly detection',
    ],
    kpi: [{ v: '31%', l: 'Readmission Reduction' }, { v: '28%', l: 'Cost Savings' }, { v: '94%', l: 'Model Accuracy' }],
    color:  'from-rose-900 to-gray-900',
    accent: 'text-rose-400',
    border: 'border-rose-700/30',
  },
  {
    id:    'fintech',
    icon:  Landmark,
    label: 'FinTech',
    headline: 'AI-Driven Financial Intelligence',
    desc:  'From real-time fraud detection to credit risk scoring and portfolio optimisation — our AI models are built for the speed and precision finance demands.',
    bullets: [
      'Real-time fraud & AML detection',
      'Alternative data credit scoring',
      'Algorithmic trading signals',
      'Regulatory reporting automation',
      'Customer churn prediction',
    ],
    kpi: [{ v: '99.2%', l: 'Fraud Detection Rate' }, { v: '3.5x', l: 'ROI on AI Spend' }, { v: '<50ms', l: 'Scoring Latency' }],
    color:  'from-emerald-900 to-gray-900',
    accent: 'text-emerald-400',
    border: 'border-emerald-700/30',
  },
  {
    id:    'supply-chain',
    icon:  Truck,
    label: 'Supply Chain',
    headline: 'Resilient, Intelligent Supply Chains',
    desc:  'Synchronise demand, supply, and logistics with AI that anticipates disruptions, optimises routes, and keeps your network running at peak efficiency.',
    bullets: [
      'End-to-end supply chain visibility',
      'Disruption early-warning system',
      'Route and load optimisation',
      'Supplier risk scoring',
      'Automated replenishment signals',
    ],
    kpi: [{ v: '19%', l: 'Logistics Cost Cut' }, { v: '38%', l: 'Lead Time Reduction' }, { v: '99.6%', l: 'On-Time Delivery' }],
    color:  'from-amber-900 to-gray-900',
    accent: 'text-amber-400',
    border: 'border-amber-700/30',
  },
  {
    id:    'ecommerce',
    icon:  Globe2,
    label: 'E-Commerce',
    headline: 'Personalise Every Digital Experience',
    desc:  'Turn anonymous visitors into loyal buyers with AI-powered search, real-time personalisation, and A/B optimisation baked into your digital storefront.',
    bullets: [
      'AI-powered site search & ranking',
      'Real-time product recommendations',
      'Conversion funnel optimisation',
      'Cart abandonment recovery AI',
      'Review sentiment & insights',
    ],
    kpi: [{ v: '34%', l: 'Conversion Lift' }, { v: '2.8x', l: 'AOV Increase' }, { v: '22%', l: 'Return Rate Reduction' }],
    color:  'from-sky-900 to-gray-900',
    accent: 'text-sky-400',
    border: 'border-sky-700/30',
  },
]

export default function Solutions() {
  const [active, setActive] = useState('retail')
  const current = SOLUTIONS.find((s) => s.id === active)

  return (
    <section id="solutions" className="py-24 relative bg-gray-950 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="orb w-80 h-80 bg-brand-800 bottom-0 right-0 opacity-10" />

      <div className="section-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4">Industry Solutions</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Built for <span className="gradient-text">Your Industry</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-lg">
            Deep domain expertise paired with cutting-edge AI.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {SOLUTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === id
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className={`glass border ${current.border} rounded-3xl overflow-hidden`}
            >
              <div className={`bg-gradient-to-br ${current.color} p-8 md:p-12 grid md:grid-cols-2 gap-10`}>
                {/* Left */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <current.icon size={24} className={current.accent} />
                    </div>
                    <span className={`text-sm font-semibold uppercase tracking-widest ${current.accent}`}>
                      {current.label}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    {current.headline}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-8">{current.desc}</p>

                  {/* Bullets */}
                  <ul className="space-y-3">
                    {current.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-gray-300 text-sm">
                        <CheckCircle size={16} className={`flex-shrink-0 mt-0.5 ${current.accent}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right — KPIs */}
                <div className="flex flex-col justify-center gap-4">
                  {current.kpi.map(({ v, l }) => (
                    <div key={l} className="glass rounded-2xl p-6 text-center border border-white/5">
                      <div className={`text-4xl font-black mb-1 ${current.accent}`}>{v}</div>
                      <div className="text-gray-400 text-sm">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
