import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: 'Is EstateFlow a broker? Do you charge brokerage?',
    a: 'EstateFlow is a tech-enabled real estate advisory platform — not a traditional broker. We charge zero brokerage. You get direct builder pricing on all listed projects. Our revenue comes from builder-side partnerships, which means our interests are aligned with yours.',
  },
  {
    q: 'Are all projects RERA-registered and verified?',
    a: 'Yes — 100% of projects listed on EstateFlow are RERA-registered and verified. We display the RERA ID on every project card. We also conduct independent due diligence on builder track record, delivery history, and financial health before listing any project.',
  },
  {
    q: 'I am an NRI. Can I buy property in India through EstateFlow?',
    a: 'Absolutely. We have a dedicated NRI desk that handles FEMA compliance, Power of Attorney documentation, repatriation of funds, and end-to-end coordination with builders. We\'ve helped NRI buyers from the US, UK, UAE, Singapore, and Canada invest seamlessly.',
  },
  {
    q: 'How does the site visit process work?',
    a: 'Submit your site visit request through the form or chatbot. Our concierge will contact you within 4 hours to confirm the slot. We arrange premium transport (cab/driver), builder VIP access, and a dedicated relationship manager who accompanies you throughout the visit.',
  },
  {
    q: 'What is the typical end-to-end timeline for purchasing a property?',
    a: 'From consultation to final registration, the timeline varies: ready-to-move properties can close in 30–45 days. Under-construction properties involve booking, allotment letter, agreement signing, and payment milestones over 7–10 days for paperwork, with possession as per builder schedule.',
  },
  {
    q: 'Can EstateFlow help with home loan processing?',
    a: 'Yes. We have partnerships with HDFC, SBI, ICICI, and Axis Bank for preferential interest rates and faster approvals on all EstateFlow-listed projects. Our finance desk will run a free eligibility check and connect you with the right lender.',
  },
  {
    q: 'What is the AI Property Assistant chatbot? How does it work?',
    a: 'Our AI chatbot is trained on project details, RERA data, market trends, and pricing intelligence. It can answer questions about specific projects, suggest properties based on your budget, explain legal terms, and connect you to a human advisor — all within the same conversation.',
  },
  {
    q: 'What happens after I register my interest in a project?',
    a: 'Within 24 hours, a dedicated Relationship Manager will call you to understand your requirements in detail. They\'ll share a personalized shortlist, arrange site visits, provide floor plan analysis, and guide you through the booking process at your own pace — no pressure tactics.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="py-24 relative bg-gray-950 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/20 to-transparent" />

      <div className="section-wrapper max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4">Common Questions</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-lg">
            Everything you need to know about buying premium real estate in India through EstateFlow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          {FAQS.map(({ q, a }, i) => (
            <div
              key={i}
              className={`glass border rounded-2xl overflow-hidden transition-all duration-300 ${
                open === i ? 'border-brand-700/50 shadow-gold' : 'border-white/8 hover:border-brand-800/40'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 p-5 text-left"
              >
                <span className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${open === i ? 'text-brand-300' : 'text-white'}`}>
                  {q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0 mt-0.5"
                >
                  <ChevronDown size={18} className={open === i ? 'text-brand-400' : 'text-gray-500'} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{   opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
