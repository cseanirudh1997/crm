import { motion } from 'framer-motion'
import { CheckCircle, Phone, Zap, Shield } from 'lucide-react'

const PLANS = [
  {
    name:      'Foundation',
    tagline:   'Structured AI deployment for mid-market enterprises.',
    price:     'Starting at $5,000',
    period:    '/month',
    note:      'Annual contracts available',
    icon:      Zap,
    color:     'border-white/10',
    badge:     null,
    highlight: false,
    features:  [
      { text: 'NexusGPT Enterprise (up to 50 users)',    ok: true  },
      { text: 'Enterprise RAG Platform — 1 knowledge base', ok: true  },
      { text: 'AI Automation Studio — 5 workflows',     ok: true  },
      { text: 'Standard SLA (8h response)',              ok: true  },
      { text: 'Onboarding & scoping workshop',           ok: true  },
      { text: 'SmartCall AI / VoiceFlow',               ok: false },
      { text: 'AI Customer Support Suite',              ok: false },
      { text: 'Dedicated Solutions Architect',          ok: false },
      { text: 'Custom fine-tuning',                     ok: false },
      { text: '99.9% uptime SLA guarantee',             ok: false },
    ],
    cta:      'Book Consultation',
    ctaAction:'contact',
  },
  {
    name:      'Enterprise',
    tagline:   'Full AI transformation — every product, unlimited scale.',
    price:     'Custom Pricing',
    period:    '',
    note:      'Based on deployment scope',
    icon:      Shield,
    color:     'border-brand-600/60',
    badge:     'Most Requested',
    highlight: true,
    features:  [
      { text: 'Unlimited users across all products',    ok: true  },
      { text: 'NexusGPT + RAG + Automation Studio',     ok: true  },
      { text: 'SmartCall AI + VoiceFlow Enterprise',    ok: true  },
      { text: 'AI Customer Support Suite',              ok: true  },
      { text: 'Priority SLA (1h critical response)',    ok: true  },
      { text: 'Dedicated Solutions Architect',          ok: true  },
      { text: 'Custom model fine-tuning',               ok: true  },
      { text: '99.9% uptime SLA guarantee',             ok: true  },
      { text: 'Executive AI readiness program',         ok: true  },
      { text: 'Quarterly business reviews',             ok: true  },
    ],
    cta:      'Contact Sales',
    ctaAction:'contact',
  },
  {
    name:      'Transformation',
    tagline:   'Full-stack AI program with dedicated engineering team.',
    price:     'Contact Sales',
    period:    '',
    note:      'Multi-year strategic program',
    icon:      Phone,
    color:     'border-white/10',
    badge:     null,
    highlight: false,
    features:  [
      { text: 'Everything in Enterprise',               ok: true  },
      { text: 'Dedicated embedded AI team (3–5 FTEs)',  ok: true  },
      { text: 'Custom model development & research',    ok: true  },
      { text: 'On-site & remote delivery',              ok: true  },
      { text: 'Board-level AI strategy advisory',       ok: true  },
      { text: 'IP ownership & transfer',                ok: true  },
      { text: 'Custom SLA & penalty clauses',           ok: true  },
      { text: 'Regulatory & compliance support',        ok: true  },
      { text: 'White-label licensing option',           ok: true  },
      { text: '24/7 NOC & AI Ops support',              ok: true  },
    ],
    cta:      'Schedule a Call',
    ctaAction:'contact',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const fadeUp    = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Pricing() {
  function scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="pricing" className="py-24 relative bg-gray-950 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/40 to-transparent" />
      <div className="orb w-80 h-80 bg-brand-700 top-10 left-10 opacity-10" />

      <div className="section-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4">Enterprise Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Serious AI Requires a{' '}
            <span className="gradient-text">Serious Partner</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            We don't do per-seat SaaS. Every engagement is scoped to your organisation's
            goals, infrastructure, and team — then priced accordingly.
          </p>
        </motion.div>

        {/* Plan cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-3 gap-6"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative glass-dark rounded-2xl flex flex-col border ${plan.color} transition-all duration-300 hover:-translate-y-2 ${
                plan.highlight
                  ? 'shadow-glow ring-1 ring-brand-600/40 scale-[1.02]'
                  : 'hover:shadow-glass'
              }`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 text-white text-xs font-semibold shadow-glow-sm">
                    <Zap size={11} className="fill-white" /> {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                {/* Plan header */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <plan.icon size={17} className="text-brand-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">{plan.tagline}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-black text-white leading-tight">{plan.price}</div>
                  {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                  <div className="text-xs text-gray-600 mt-1">{plan.note}</div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map(({ text, ok }) => (
                    <li key={text} className={`flex items-center gap-2 text-sm ${ok ? 'text-gray-300' : 'text-gray-600'}`}>
                      {ok
                        ? <CheckCircle size={15} className="flex-shrink-0 text-brand-400" />
                        : <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center text-gray-700">–</span>
                      }
                      {text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={scrollToContact}
                  className={plan.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reassurance row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 grid sm:grid-cols-3 gap-4 text-center"
        >
          {[
            { label: 'No Per-Seat Pricing',     desc: 'Flat engagement fee scoped to your needs'      },
            { label: 'Pilot Before You Commit', desc: 'Start with a 30-day paid pilot on one use case' },
            { label: 'IP You Own',              desc: 'All custom models and code transfer to you'     },
          ].map(({ label, desc }) => (
            <div key={label} className="glass border border-white/10 rounded-2xl p-5">
              <div className="font-semibold text-white mb-1">{label}</div>
              <div className="text-xs text-gray-500">{desc}</div>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Not sure which tier fits?{' '}
          <button
            onClick={scrollToContact}
            className="text-brand-400 hover:underline font-medium"
          >
            Talk to a solutions architect
          </button>{' '}
          — free, no commitment.
        </motion.p>
      </div>
    </section>
  )
}
