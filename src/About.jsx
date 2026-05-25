// ─────────────────────────────────────────────
//  About — Personal Brand & AI Leadership Profile
// ─────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Brain, TrendingUp, Users, BookOpen, Award, Mic, Building2, Zap } from 'lucide-react'

const DOMAINS = [
  { icon: Brain,      label: 'GenAI & LLMs',          sub: 'RAG · Fine-Tuning · Agents'           },
  { icon: TrendingUp, label: 'Pricing AI',             sub: 'Elasticity · Revenue Optimization'   },
  { icon: Zap,        label: 'Real-Time ML',           sub: 'Streaming · Low-Latency Serving'      },
  { icon: Users,      label: 'Personalization',        sub: 'Recommendations · Two-Tower'          },
  { icon: BookOpen,   label: 'Forecasting',            sub: 'Time-Series · Demand Planning'        },
  { icon: Building2,  label: 'MLOps',                  sub: 'Feature Stores · Model Registry'     },
]

const TIMELINE = [
  { year: '2026', title: 'AI Consulting — Independent Practice', sub: 'Enterprise AI strategy, GenAI architecture, mentorship' },
  { year: '2022', title: 'Senior Data Scientist · Walmart Global Tech', sub: 'Pricing AI, personalization, GenAI systems' },
  { year: '2019', title: 'Data Scientist · Fortune 500 FinTech', sub: 'Fraud detection, credit risk, real-time ML' },
  { year: '2016', title: 'ML Engineer · Telecom Enterprise', sub: 'Churn prediction, NLP, demand forecasting' },
  { year: '2014', title: 'MSc. Machine Learning', sub: 'IIT Delhi · Thesis: Hierarchical Demand Forecasting' },
]

const INDUSTRIES = [
  'Retail & E-commerce', 'FinTech', 'Media & Publishing',
  'Telecom', 'Supply Chain', 'Legal & Enterprise', 'D2C',
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function About() {
  return (
    <section id="about" className="py-20 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="orb w-96 h-96 bg-brand-900 top-0 -left-20 opacity-8" />
      <div className="section-wrapper relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
          <span className="section-badge mb-4"><Award size={11} /> About</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            12 Years Building <span className="gradient-text">AI That Ships</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Senior Data Scientist and Enterprise AI Consultant with deep expertise in production ML systems.
            I build AI that creates measurable business impact — and mentor others to do the same.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* Left: Bio + Industries */}
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="glass border border-white/8 rounded-2xl p-6 mb-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                I'm a Senior Data Scientist and Enterprise AI Consultant specializing in <strong className="text-white">pricing intelligence, GenAI systems, and production MLOps</strong>. Over 12 years I've shipped AI systems used by tens of millions of users daily — delivering $42M+ in measurable business impact.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                At Walmart Global Tech, I led the development of the enterprise pricing intelligence platform — a real-time ML ensemble serving 50M+ SKUs with sub-100ms inference. I've also built GenAI content platforms, fraud detection systems, and churn prediction engines that are live in production today.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Outside of client work, I mentor data scientists targeting FAANG and senior roles, speak at AI conferences, and write a weekly newsletter read by 1,300+ AI practitioners.
              </p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <h4 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Industries Served</h4>
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((ind) => (
                  <span key={ind} className="property-badge">{ind}</span>
                ))}
              </div>
            </motion.div>

            {/* Speaking / Publications */}
            <motion.div variants={fadeUp} className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: Mic,      label: 'Conference Speaker',    sub: 'DataHack Summit · NeurIPS · AI India' },
                { icon: BookOpen, label: 'Published Researcher',  sub: 'KDD 2025 · arXiv · TDS · Forbes India' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass border border-white/8 rounded-xl p-4">
                  <Icon size={16} className="text-brand-400 mb-2" />
                  <div className="text-xs font-bold text-white mb-0.5">{label}</div>
                  <div className="text-xs text-gray-500 leading-snug">{sub}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: AI Domain expertise + Timeline */}
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Domain chips */}
            <motion.div variants={fadeUp} className="mb-8">
              <h4 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">AI Domain Expertise</h4>
              <div className="grid grid-cols-2 gap-3">
                {DOMAINS.map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="glass border border-white/8 rounded-xl p-3.5 hover:border-brand-700/40 transition-all">
                    <Icon size={15} className="text-brand-400 mb-1.5" />
                    <div className="text-xs font-bold text-white leading-snug">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-snug">{sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Career timeline */}
            <motion.div variants={fadeUp}>
              <h4 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Career Timeline</h4>
              <div className="space-y-0">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-brand-700 mt-1 flex-shrink-0 group-hover:bg-brand-400 transition-colors" />
                      {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-white/10 mt-1 mb-0" />}
                    </div>
                    <div className={`pb-5 ${i < TIMELINE.length - 1 ? '' : ''}`}>
                      <div className="text-xs text-brand-400 font-bold mb-0.5">{item.year}</div>
                      <div className="text-sm font-semibold text-white leading-snug">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
