import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, HeartPulse, Landmark, Truck, Globe2, CheckCircle } from 'lucide-react'

const SOLUTIONS = [
  {
    id:    'retail',
    icon:  ShoppingBag,
    label: 'Retail',
    headline: 'AI Operations for Retail Enterprises',
    desc:  'Deploy NexusGPT, SmartCall AI, and AI Automation Studio to transform retail customer experience, store operations, and back-office workflows — all from a single operations platform.',
    bullets: [
      'NexusGPT-powered customer service copilot',
      'SmartCall AI for inbound & outbound inquiries',
      'AI Automation Studio for order processing',
      'RAG on product catalog, policy & knowledge base',
      'Voice AI for store associate & field support',
    ],
    kpi: [{ v: '68%', l: 'Call Deflection Rate' }, { v: '4.2x', l: 'ROI on AI Deployment' }, { v: '94%', l: 'CSAT Score' }],
    color:  'from-brand-900 to-gray-900',
    accent: 'text-brand-400',
    border: 'border-brand-700/30',
  },
  {
    id:    'healthcare',
    icon:  HeartPulse,
    label: 'Healthcare',
    headline: 'Healthcare AI Deployment & Compliance',
    desc:  'HIPAA-compliant private LLMs for clinical documentation, voice AI for patient intake automation, and RAG on medical guidelines — deployed air-gapped or in your VPC.',
    bullets: [
      'Air-gapped NexusGPT for clinical documentation',
      'VoiceFlow AI for patient scheduling & intake',
      'RAG on medical guidelines & internal protocols',
      'AI Automation Studio for prior auth workflows',
      'Full audit trails & role-based access control',
    ],
    kpi: [{ v: '82%', l: 'Documentation Time Saved' }, { v: '97%', l: 'Intake Accuracy' }, { v: '99.9%', l: 'Compliance Uptime' }],
    color:  'from-rose-900 to-gray-900',
    accent: 'text-rose-400',
    border: 'border-rose-700/30',
  },
  {
    id:    'fintech',
    icon:  Landmark,
    label: 'FinTech',
    headline: 'Financial Services AI Platform',
    desc:  'Private LLM deployments, conversational AI for banking clients, and RAG across regulatory and compliance documentation — built for the security and latency that finance demands.',
    bullets: [
      'Private NexusGPT for analyst & advisor copilots',
      'SmartCall AI for banking customer service at scale',
      'RAG on regulatory, compliance & policy documents',
      'AI Automation Studio for KYC & AML workflows',
      'SOC 2 Type II compliant deployment architecture',
    ],
    kpi: [{ v: '99.2%', l: 'Intent Recognition' }, { v: '3.5x', l: 'ROI on AI Spend' }, { v: '<62ms', l: 'Voice AI Latency' }],
    color:  'from-emerald-900 to-gray-900',
    accent: 'text-emerald-400',
    border: 'border-emerald-700/30',
  },
  {
    id:    'supply-chain',
    icon:  Truck,
    label: 'Supply Chain',
    headline: 'AI Operations for Logistics & Supply Chain',
    desc:  'AI Automation Studio for document-heavy workflows, voice AI agents for warehouse operations, and intelligent orchestration that keeps your supply chain running in real time.',
    bullets: [
      'AI document extraction for POs & invoices',
      'Voice AI agents for warehouse & field ops',
      'NexusGPT copilot for procurement teams',
      'Automated exception handling & escalation',
      '200+ ERP & logistics connector integrations',
    ],
    kpi: [{ v: '74%', l: 'Processing Time Saved' }, { v: '38%', l: 'Exception Rate Reduction' }, { v: '99.6%', l: 'Workflow Accuracy' }],
    color:  'from-amber-900 to-gray-900',
    accent: 'text-amber-400',
    border: 'border-amber-700/30',
  },
  {
    id:    'ecommerce',
    icon:  Globe2,
    label: 'E-Commerce',
    headline: 'E-Commerce AI Customer Experience',
    desc:  'Deploy SmartCall AI and conversational agents that handle millions of support, returns, and order management interactions — with seamless escalation to human agents.',
    bullets: [
      'SmartCall AI for customer support at scale',
      'AI Customer Support Suite — email, chat & voice',
      'NexusGPT real-time agent assist copilot',
      'RAG on product catalog for instant answers',
      'CSAT scoring & live sentiment analysis',
    ],
    kpi: [{ v: '85%', l: 'AI Resolution Rate' }, { v: '2.1min', l: 'Avg. Handle Time' }, { v: '4.8/5', l: 'Customer Satisfaction' }],
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
            AI Deployments Built for{' '}
            <span className="gradient-text">Your Industry</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Every vertical has unique compliance, workflow, and scale requirements.
            NexusAI products are configured and deployed to match — not shoe-horned.
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
