import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShoppingCart, Tag, TrendingUp, Brain, MessageSquare,
  CheckCircle, ChevronRight, Star,
} from 'lucide-react'

const PRODUCTS = [
  {
    icon:   ShoppingCart,
    name:   'RetailIQ Platform',
    badge:  'Most Popular',
    badgeColor: 'bg-brand-700/60 text-brand-200',
    tagline: 'Unified retail intelligence, end-to-end.',
    desc:   'A comprehensive platform that unifies POS data, web analytics, inventory signals, and customer behavior into a single intelligence layer.',
    features: [
      'Real-time shelf analytics',
      'Customer journey mapping',
      'Inventory signal detection',
      'Omnichannel attribution',
      'Automated markdown alerts',
    ],
    color:   'from-brand-900/60 via-brand-900/20 to-transparent',
    border:  'border-brand-700/40',
    accentText: 'text-brand-400',
    glow:    'hover:shadow-glow',
    cta:     'Explore RetailIQ',
  },
  {
    icon:   Tag,
    name:   'Smart Pricing Engine',
    badge:  'AI-Powered',
    badgeColor: 'bg-accent-900/60 text-accent-300',
    tagline: 'Maximise margin with every price change.',
    desc:   'Elasticity-aware dynamic pricing with competitor monitoring, promotion optimisation, and real-time guardrails for retail and e-commerce.',
    features: [
      'Dynamic price modelling',
      'Elasticity curve estimation',
      'Competitor price tracking',
      'Promotion lift analysis',
      'Rule-based guardrails',
    ],
    color:   'from-accent-900/60 via-accent-900/20 to-transparent',
    border:  'border-accent-700/40',
    accentText: 'text-accent-400',
    glow:    'hover:shadow-glow-purple',
    cta:     'Explore Pricing Engine',
  },
  {
    icon:   TrendingUp,
    name:   'AI Forecast Studio',
    badge:  'Enterprise',
    badgeColor: 'bg-teal-900/60 text-teal-300',
    tagline: 'Predict demand with 95%+ accuracy.',
    desc:   'Production-grade demand forecasting platform for supply chain, workforce planning, and financial budgeting using transformer-based ML.',
    features: [
      'Multi-horizon forecasting',
      'Exogenous signal ingestion',
      'Scenario & what-if analysis',
      'Automated model retraining',
      'ERP & WMS connectors',
    ],
    color:   'from-teal-900/60 via-teal-900/20 to-transparent',
    border:  'border-teal-700/40',
    accentText: 'text-teal-400',
    glow:    'hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]',
    cta:     'Explore Forecast Studio',
  },
  {
    icon:   Brain,
    name:   'Decision Intelligence Hub',
    badge:  'New',
    badgeColor: 'bg-rose-900/60 text-rose-300',
    tagline: 'Turn complex decisions into clear actions.',
    desc:   'A decision-support layer that aggregates signals, runs automated reasoning chains, and surfaces recommended actions with confidence scores.',
    features: [
      'Multi-criteria decision trees',
      'Automated reasoning chains',
      'Confidence scoring',
      'Explainable AI outputs',
      'Alerting & workflow hooks',
    ],
    color:   'from-rose-900/60 via-rose-900/20 to-transparent',
    border:  'border-rose-700/40',
    accentText: 'text-rose-400',
    glow:    'hover:shadow-[0_0_30px_rgba(225,29,72,0.3)]',
    cta:     'Explore Decision Hub',
  },
  {
    icon:   MessageSquare,
    name:   'GenAssist Enterprise',
    badge:  'GenAI',
    badgeColor: 'bg-amber-900/60 text-amber-300',
    tagline: 'Enterprise LLM suite, private and secure.',
    desc:   'Deploy private GPT-level assistants for your teams. Includes RAG on internal docs, multi-agent workflows, and enterprise SSO support.',
    features: [
      'Private LLM deployment',
      'RAG on internal knowledge',
      'Multi-agent orchestration',
      'SSO / SAML integration',
      'Audit logs & compliance',
    ],
    color:   'from-amber-900/60 via-amber-900/20 to-transparent',
    border:  'border-amber-700/40',
    accentText: 'text-amber-400',
    glow:    'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    cta:     'Explore GenAssist',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export default function Products() {
  return (
    <section id="products" className="py-24 relative overflow-hidden bg-gray-950">
      {/* top gradient divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/50 to-transparent" />
      <div className="orb w-96 h-96 bg-accent-700 -top-20 -left-20 opacity-10" />

      <div className="section-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">Our Platform</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Powerful <span className="gradient-text">AI Products</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Purpose-built solutions that plug directly into your tech stack.
            Deploy in days, not months.
          </p>
        </motion.div>

        {/* Product cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PRODUCTS.map(({ icon: Icon, name, badge, badgeColor, tagline, desc, features, color, border, accentText, glow, cta }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className={`group glass-dark ${glow} transition-all duration-300 hover:-translate-y-2 border ${border} rounded-2xl overflow-hidden flex flex-col`}
            >
              {/* Card gradient top */}
              <div className={`h-2 bg-gradient-to-r ${color}`} />

              <div className="p-6 flex-1 flex flex-col">
                {/* Icon + badge row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon size={22} className={accentText} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>{badge}</span>
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
                <p className={`text-sm font-medium mb-3 ${accentText}`}>{tagline}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{desc}</p>

                {/* Feature list */}
                <ul className="flex-1 space-y-2 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className={`flex-shrink-0 ${accentText}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => <Star key={s} size={12} className="text-amber-400 fill-amber-400" />)}
                  <span className="text-xs text-gray-500 ml-1">5.0 / 5.0</span>
                </div>

                {/* CTA */}
                <Link to="/signup" className="btn-secondary text-sm justify-between group">
                  <span>{cta}</span>
                  <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
