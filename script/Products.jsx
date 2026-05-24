import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Brain, Phone, Mic, BookOpen, Zap, Headphones,
  CheckCircle, ChevronRight,
} from 'lucide-react'

const PRODUCTS = [
  {
    icon:      Brain,
    name:      'NexusGPT Enterprise',
    badge:     'Flagship',
    badgeColor:'bg-brand-700/60 text-brand-200',
    tagline:   'Your private LLM — fully air-gapped or VPC.',
    desc:      'Deploy GPT-4 class models on your own infrastructure with SSO, audit logs, and compliance. Includes RAG on internal docs, multi-agent orchestration, and fine-tuning pipelines.',
    features:  [
      'Private LLM on your infra',
      'Enterprise SSO / SAML',
      'Multi-agent orchestration',
      'RAG on internal knowledge',
      'Full audit trails & compliance',
    ],
    color:     'from-brand-900/60 via-brand-900/20 to-transparent',
    border:    'border-brand-700/40',
    accentText:'text-brand-400',
    glow:      'hover:shadow-glow',
    cta:       'Request Demo',
    pricing:   'Starting at $8,000/mo',
  },
  {
    icon:      Phone,
    name:      'SmartCall AI',
    badge:     'Voice AI',
    badgeColor:'bg-teal-900/60 text-teal-300',
    tagline:   'AI call agents that handle millions of calls.',
    desc:      'Inbound and outbound voice AI with real-time transcription, intent classification, sentiment analysis, live agent escalation, and CRM auto-logging.',
    features:  [
      'Real-time speech-to-text',
      'Intent & sentiment analysis',
      'Auto escalation to human agents',
      'CRM integration (Salesforce, HubSpot)',
      '97%+ intent recognition accuracy',
    ],
    color:     'from-teal-900/60 via-teal-900/20 to-transparent',
    border:    'border-teal-700/40',
    accentText:'text-teal-400',
    glow:      'hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]',
    cta:       'Request Demo',
    pricing:   'Starting at $5,000/mo',
  },
  {
    icon:      Mic,
    name:      'VoiceFlow Enterprise',
    badge:     'New',
    badgeColor:'bg-accent-900/60 text-accent-300',
    tagline:   'Conversational voice agents for any workflow.',
    desc:      'Build and deploy complex multi-turn voice agents for internal HR, IT helpdesk, field support, and customer-facing use cases — with visual flow builder and A/B testing.',
    features:  [
      'Visual flow builder (no-code)',
      'Multi-turn conversation memory',
      'Multi-language support (40+)',
      'A/B testing & analytics',
      'WebRTC & telephony integration',
    ],
    color:     'from-accent-900/60 via-accent-900/20 to-transparent',
    border:    'border-accent-700/40',
    accentText:'text-accent-400',
    glow:      'hover:shadow-glow-purple',
    cta:       'Request Demo',
    pricing:   'Custom Enterprise Pricing',
  },
  {
    icon:      BookOpen,
    name:      'Enterprise RAG Platform',
    badge:     'Knowledge AI',
    badgeColor:'bg-sky-900/60 text-sky-300',
    tagline:   'Your knowledge base, made intelligent.',
    desc:      'Retrieval-Augmented Generation platform that ingests your internal docs, wikis, PDFs, and databases into a hallucination-resistant, permission-aware QnA engine.',
    features:  [
      'Multi-source ingestion (PDF, Confluence, SharePoint)',
      'Permission-aware retrieval',
      'Hallucination guardrails',
      'Hybrid search (dense + sparse)',
      'Citation & source tracking',
    ],
    color:     'from-sky-900/60 via-sky-900/20 to-transparent',
    border:    'border-sky-700/40',
    accentText:'text-sky-400',
    glow:      'hover:shadow-[0_0_30px_rgba(2,132,199,0.3)]',
    cta:       'Request Demo',
    pricing:   'Starting at $6,000/mo',
  },
  {
    icon:      Zap,
    name:      'AI Automation Studio',
    badge:     'No-Code',
    badgeColor:'bg-amber-900/60 text-amber-300',
    tagline:   'Automate complex workflows with AI, visually.',
    desc:      'No-code intelligent process automation platform. Connect to 200+ enterprise apps, build AI-powered approval workflows, document processing, and exception handling pipelines.',
    features:  [
      '200+ enterprise connectors',
      'AI document extraction (OCR + NLP)',
      'Visual workflow builder',
      'Human-in-the-loop approvals',
      'SLA monitoring & alerting',
    ],
    color:     'from-amber-900/60 via-amber-900/20 to-transparent',
    border:    'border-amber-700/40',
    accentText:'text-amber-400',
    glow:      'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    cta:       'Request Demo',
    pricing:   'Starting at $4,500/mo',
  },
  {
    icon:      HeadphonesIcon,
    name:      'AI Customer Support Suite',
    badge:     'CX AI',
    badgeColor:'bg-rose-900/60 text-rose-300',
    tagline:   'GPT-powered helpdesk with human fallback.',
    desc:      'End-to-end AI customer support platform — from ticket classification and auto-resolution to live agent assist, quality scoring, and CSAT prediction.',
    features:  [
      'Auto ticket classification & routing',
      'AI-generated reply suggestions',
      'Live agent assist copilot',
      'CSAT & sentiment prediction',
      'Omnichannel (email, chat, voice)',
    ],
    color:     'from-rose-900/60 via-rose-900/20 to-transparent',
    border:    'border-rose-700/40',
    accentText:'text-rose-400',
    glow:      'hover:shadow-[0_0_30px_rgba(225,29,72,0.3)]',
    cta:       'Request Demo',
    pricing:   'Consultation Required',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const fadeUp    = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } }

export default function Products() {
  return (
    <section id="products" className="py-24 relative overflow-hidden bg-gray-950">
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
            Enterprise <span className="gradient-text">AI Products</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Production-ready AI systems purpose-built for enterprise scale.
            Each product ships with dedicated support, SLA guarantees, and a phased deployment roadmap.
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
          {PRODUCTS.map(({ icon: Icon, name, badge, badgeColor, tagline, desc, features, color, border, accentText, glow, cta, pricing }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className={`group glass-dark ${glow} transition-all duration-300 hover:-translate-y-2 border ${border} rounded-2xl overflow-hidden flex flex-col`}
            >
              {/* Gradient stripe */}
              <div className={`h-1.5 bg-gradient-to-r ${color}`} />

              <div className="p-6 flex-1 flex flex-col">
                {/* Icon + badge */}
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
                <ul className="flex-1 space-y-2 mb-4">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className={`flex-shrink-0 ${accentText}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Pricing label */}
                <div className="mb-4 text-xs text-gray-500 font-medium border-t border-white/10 pt-4">
                  {pricing}
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
