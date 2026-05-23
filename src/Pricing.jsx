import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, X, Zap } from 'lucide-react'

const PLANS = [
  {
    name:       'Starter',
    tagline:    'Perfect for teams exploring AI.',
    monthly:    499,
    annual:     399,
    color:      'border-white/10',
    badge:      null,
    highlight:  false,
    features:   [
      { text: 'Up to 5 users',           ok: true  },
      { text: '3 AI data connectors',    ok: true  },
      { text: 'Basic BI dashboards',     ok: true  },
      { text: '100K API calls / month',  ok: true  },
      { text: 'Email support',           ok: true  },
      { text: 'Advanced forecasting',    ok: false },
      { text: 'Custom ML models',        ok: false },
      { text: 'Dedicated CSM',           ok: false },
      { text: 'SSO / SAML',             ok: false },
      { text: 'SLA guarantee',           ok: false },
    ],
    cta:   'Start Free Trial',
    ctaCls: 'btn-secondary w-full justify-center',
  },
  {
    name:       'Professional',
    tagline:    'Scale AI across your whole team.',
    monthly:    1999,
    annual:     1599,
    color:      'border-brand-600/60',
    badge:      'Most Popular',
    highlight:  true,
    features:   [
      { text: 'Up to 50 users',          ok: true  },
      { text: '15 AI data connectors',   ok: true  },
      { text: 'Advanced BI dashboards',  ok: true  },
      { text: '5M API calls / month',    ok: true  },
      { text: 'Priority email & chat',   ok: true  },
      { text: 'Advanced forecasting',    ok: true  },
      { text: 'Custom ML models',        ok: true  },
      { text: 'Dedicated CSM',           ok: false },
      { text: 'SSO / SAML',             ok: false },
      { text: 'SLA guarantee',           ok: false },
    ],
    cta:   'Start Free Trial',
    ctaCls: 'btn-primary  w-full justify-center',
  },
  {
    name:       'Enterprise',
    tagline:    'Unlimited scale with white-glove support.',
    monthly:    null,
    annual:     null,
    color:      'border-white/10',
    badge:      null,
    highlight:  false,
    features:   [
      { text: 'Unlimited users',         ok: true  },
      { text: 'Unlimited connectors',    ok: true  },
      { text: 'Custom BI & reporting',   ok: true  },
      { text: 'Unlimited API calls',     ok: true  },
      { text: '24 / 7 phone support',    ok: true  },
      { text: 'Advanced forecasting',    ok: true  },
      { text: 'Custom ML models',        ok: true  },
      { text: 'Dedicated CSM',           ok: true  },
      { text: 'SSO / SAML',             ok: true  },
      { text: '99.9% SLA guarantee',     ok: true  },
    ],
    cta:   'Contact Sales',
    ctaCls: 'btn-secondary w-full justify-center',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }
const fadeUp    = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

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
          className="text-center mb-10"
        >
          <span className="section-badge mb-4">Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-lg mb-8">
            No hidden fees. Cancel anytime. All plans include a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!annual ? 'bg-brand-600 text-white shadow-glow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${annual ? 'bg-brand-600 text-white shadow-glow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Annual
              <span className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
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
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-400 mb-6">{plan.tagline}</p>

                {/* Price */}
                <div className="mb-8">
                  {plan.monthly ? (
                    <>
                      <span className="text-4xl font-black text-white">
                        ${annual ? plan.annual : plan.monthly}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">/month</span>
                      {annual && (
                        <div className="text-xs text-emerald-400 mt-1">
                          Save ${(plan.monthly - plan.annual) * 12}/year
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-3xl font-black text-white">Custom</div>
                  )}
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map(({ text, ok }) => (
                    <li key={text} className={`flex items-center gap-2 text-sm ${ok ? 'text-gray-300' : 'text-gray-600'}`}>
                      {ok
                        ? <CheckCircle size={15} className="flex-shrink-0 text-brand-400" />
                        : <X          size={15} className="flex-shrink-0 text-gray-700" />
                      }
                      {text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.name === 'Enterprise' ? (
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className={plan.ctaCls}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link to="/signup" className={plan.ctaCls}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          All prices in USD. VAT may apply depending on your location.
          Need a custom quote?{' '}
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-brand-400 hover:underline"
          >
            Talk to sales
          </button>
        </motion.p>
      </div>
    </section>
  )
}
