import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown } from 'lucide-react'

const FAQS = [
  { q: 'What types of AI consulting engagements do you offer?', a: 'I offer three main engagement types: (1) Enterprise AI Strategy — a scoped consulting engagement to define your AI roadmap, prioritize use cases, and build business cases for AI investment. (2) System Design & Architecture — technical deep-dives to design production-grade ML systems from scratch. (3) Fractional AI Leadership — ongoing advisory for companies building their first DS/ML team. All engagements begin with a free 30-minute scoping call.' },
  { q: 'How does the 1-on-1 mentorship program work?', a: 'Mentorship sessions are 60 minutes, conducted via video call. We start with a 1-session onboarding to understand your current role, target, and blockers. Sessions cover ML system design, portfolio reviews, career strategy, interview preparation, and code walkthroughs. Most mentees see a clear impact in 60–90 days. Sessions are bookable as single sessions or bundles of 4.' },
  { q: 'What is your expertise in GenAI and LLMs?', a: 'I specialize in production GenAI systems — specifically RAG pipelines, LLM orchestration with LangChain/LlamaIndex, fine-tuning strategy, evaluation harnesses (G-Eval, RAGAS), and multi-agent architectures. I\'ve built systems processing 200K+ articles/month and handling 10M+ queries. I advise on build-vs-buy decisions, vendor selection, and the full path from POC to production.' },
  { q: 'Can you help with pricing AI and personalization?', a: 'This is one of my core specializations. I\'ve built pricing intelligence systems serving 50M+ SKUs, personalization engines for 8M+ users, and demand forecasting systems across 800K SKUs. I can help with elasticity modeling, competitive signal integration, markdown optimization, real-time inference architecture, and A/B testing frameworks for revenue optimization systems.' },
  { q: 'What does mock interview preparation cover?', a: 'Mock sessions are structured exactly like real top-tier DS/ML interviews. I cover: ML System Design (end-to-end system design for search, recommendations, pricing, fraud), Practical ML (model selection, feature engineering, evaluation, trade-offs), Behavioral/Leadership (STAR-format answers, stakeholder stories), and Coding (pandas, SQL, ML implementation). Each session includes detailed written feedback within 24 hours.' },
  { q: 'Do you work with companies outside India?', a: 'Yes. I work with clients globally — US, Europe, SEA, and Middle East — via video calls. Enterprise consulting engagements can include on-site workshops at an additional travel cost. All mentorship sessions are fully remote and timezone-flexible, with slots available from 6 AM to 10 PM IST.' },
  { q: 'How do I book a strategy session or mentorship call?', a: 'Fill out the consultation form on this page with your background and what you want to achieve. I personally review all requests and respond within 24 hours to confirm availability and share a calendar link. For urgent enterprise engagements, email connect@vnai.in directly.' },
  { q: 'What results have your mentees achieved?', a: 'Mentees have landed roles at Amazon, Google, Flipkart, Swiggy, PhonePe, unicorn startups, and Fortune 500 companies. 50+ mentees placed in senior DS, staff, and principal ML roles across FAANG-equivalent firms. Typical mentees go from mid-level DS to senior/staff in 6–18 months. Results depend on your starting point, commitment, and target role complexity.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" className="py-20 relative">
      <div className="section-wrapper">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-badge mb-4"><HelpCircle size={11} /> FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">Everything you need to know about AI consulting, mentorship, and working together.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.04 }} className={`glass border rounded-2xl overflow-hidden transition-all duration-300 ${open === i ? 'border-brand-700/40 shadow-gold' : 'border-white/5 hover:border-white/10'}`}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                <span className={`text-sm font-semibold leading-snug transition-colors ${open === i ? 'text-brand-300' : 'text-white'}`}>{q}</span>
                <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${open === i ? 'rotate-180 text-brand-400' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <p className="text-gray-500 text-sm mb-3">Still have questions?</p>
          <button onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">Book a Free Strategy Call</button>
        </motion.div>
      </div>
    </section>
  )
}
