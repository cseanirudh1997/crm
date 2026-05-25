// ─────────────────────────────────────────────
//  Ecosystem — VN.AI platform ecosystem pillars
// ─────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Brain, Youtube, BookOpen, Users, Mic, TrendingUp, ExternalLink, Layers } from 'lucide-react'
import { SOCIAL_LINKS } from './config'

const PILLARS = [
  {
    icon:  Brain,
    title: '1:1 AI Mentorship',
    sub:   'Personalised',
    desc:  'Intensive 1:1 mentorship for data scientists targeting FAANG, senior ML roles, and enterprise AI leadership. Skill gap analysis, roadmap, and mock interviews.',
    tag:   '50+ Mentees Placed',
    color: 'from-brand-600 to-brand-800',
    bg:    'bg-brand-900/15',
    border:'border-brand-700/30',
    href:  '#consult',
  },
  {
    icon:  TrendingUp,
    title: 'Enterprise AI Consulting',
    sub:   'B2B Strategy',
    desc:  'End-to-end GenAI architecture, pricing AI systems, and MLOps pipelines for product teams and Fortune 500 enterprises. From POC to production.',
    tag:   '$42M+ GMV Impact',
    color: 'from-emerald-600 to-emerald-800',
    bg:    'bg-emerald-900/15',
    border:'border-emerald-700/30',
    href:  '#services',
  },
  {
    icon:  BookOpen,
    title: 'AI Newsletter',
    sub:   'Weekly Insights',
    desc:  'Practitioner-grade insights on GenAI systems, pricing AI, MLOps, and AI career strategy — direct from production experience. Every Tuesday.',
    tag:   '1,300+ Subscribers',
    color: 'from-accent-600 to-accent-800',
    bg:    'bg-accent-900/15',
    border:'border-accent-700/30',
    href:  '#newsletter',
  },
  {
    icon:  Youtube,
    title: 'YouTube & Workshops',
    sub:   'Video Learning',
    desc:  'In-depth video tutorials on production ML systems, GenAI engineering, and FAANG interview prep. Live workshops on cutting-edge AI topics.',
    tag:   'Free Access',
    color: 'from-red-600 to-red-800',
    bg:    'bg-red-900/15',
    border:'border-red-700/30',
    href:  SOCIAL_LINKS.youtube,
    external: true,
  },
  {
    icon:  Mic,
    title: 'Speaking & Media',
    sub:   'Thought Leadership',
    desc:  'Keynotes and workshops at DataHack Summit, NeurIPS Industry Track, and AI India Summit. Forbes India contributor and KDD 2025 paper author.',
    tag:   'Global Stages',
    color: 'from-purple-600 to-purple-800',
    bg:    'bg-purple-900/15',
    border:'border-purple-700/30',
    href:  '#publications',
  },
  {
    icon:  Users,
    title: 'Community & Cohorts',
    sub:   'Peer Learning',
    desc:  'Exclusive AI practitioners community with group cohorts, peer accountability, shared resources, and live Q&A sessions with senior ML engineers.',
    tag:   'Coming Soon',
    color: 'from-teal-600 to-teal-800',
    bg:    'bg-teal-900/15',
    border:'border-teal-700/30',
    href:  '#consult',
  },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="py-20 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="orb w-96 h-96 bg-brand-900 bottom-0 right-0 opacity-8" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4"><Layers size={11} /> Ecosystem</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            The <span className="gradient-text">VN.AI Ecosystem</span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            Six interconnected pillars designed to help data scientists and enterprise teams build,
            deploy, and scale AI systems that create measurable business impact.
          </p>
        </motion.div>

        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
        >
          {PILLARS.map(({ icon: Icon, title, sub, desc, tag, color, bg, border, href, external }) => (
            <motion.a
              key={title}
              variants={fadeUp}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={`group glass ${bg} border ${border} rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] hover:shadow-glass transition-all duration-300 cursor-pointer`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon size={22} className="text-white" />
                </div>
                {external && <ExternalLink size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors mt-1" />}
              </div>

              <div>
                <div className="text-xs text-gray-500 font-medium mb-0.5 uppercase tracking-widest">{sub}</div>
                <h3 className="text-base font-bold text-white group-hover:text-brand-200 transition-colors leading-snug">{title}</h3>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed flex-1">{desc}</p>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <span className="text-xs font-semibold text-brand-400 bg-brand-900/30 border border-brand-800/30 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
                <span className="text-xs text-gray-600 group-hover:text-brand-400 transition-colors font-medium">
                  Learn more →
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
