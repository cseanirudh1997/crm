import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'How quickly can I get started with NexusAI?',
    a: 'Most teams are up and running within 24–48 hours. Our onboarding team handles data connector setup, model configuration, and a live walkthrough so you can start seeing value from day one.',
  },
  {
    q: 'Do I need to have an existing data infrastructure?',
    a: 'No. NexusAI works with over 150 pre-built connectors including data warehouses, ERPs, CRMs, e-commerce platforms, and flat files. We meet you where your data lives.',
  },
  {
    q: 'Is my data secure and compliant?',
    a: 'Absolutely. NexusAI is SOC 2 Type II, GDPR, HIPAA, and CCPA compliant. All data is encrypted in transit and at rest. Enterprise plans include private cloud or on-premise deployment options.',
  },
  {
    q: 'Can I integrate NexusAI with my existing tools?',
    a: 'Yes. We offer native integrations with Salesforce, SAP, Oracle, Snowflake, Databricks, Power BI, Looker, and 150+ other platforms. Custom integrations are available on Professional and Enterprise plans.',
  },
  {
    q: 'What kind of support do you offer?',
    a: 'Foundation plans include standard email support with an 8-hour response SLA. Enterprise plans include priority 1-hour critical response and a dedicated Solutions Architect. Transformation engagements include 24/7 NOC & AI Ops support with an embedded engineering team. SLAs and penalty clauses are fully customisable on multi-year programs.',
  },
  {
    q: 'How is pricing calculated for large enterprises?',
    a: 'Enterprise pricing is custom and based on usage volume, number of users, deployment model, and support requirements. Contact our sales team for a tailored quote and ROI analysis.',
  },
  {
    q: 'Do you offer professional services or implementation support?',
    a: 'Yes. Our Professional Services team handles end-to-end implementations, custom model development, and ongoing AI strategy consulting. Packages start at a fixed project fee.',
  },
  {
    q: 'What is your uptime SLA for production deployments?',
    a: 'Enterprise plans include a 99.9% monthly uptime SLA backed by a service credit policy. Our global infrastructure runs across multi-region cloud deployments with automated failover.',
  },
]

function FAQItem({ q, a, isOpen, toggle }) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className={`font-medium transition-colors ${isOpen ? 'text-brand-300' : 'text-gray-200 group-hover:text-white'}`}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-400' : 'group-hover:text-gray-300'}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{   height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-400 leading-relaxed text-sm pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-gray-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="orb w-64 h-64 bg-brand-800 bottom-10 left-10 opacity-10" />

      <div className="section-wrapper">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24"
          >
            <span className="section-badge mb-4">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Can't find your answer here? Our team is happy to help.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Contact Support
            </button>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 md:p-8 border border-white/10"
          >
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={open === i}
                toggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
