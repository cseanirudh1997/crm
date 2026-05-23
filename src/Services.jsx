import { motion } from 'framer-motion'
import {
  Brain, Cpu, BarChart2, TrendingUp, DollarSign,
  Workflow, Lightbulb, PieChart,
} from 'lucide-react'

const SERVICES = [
  {
    icon:  Brain,
    title: 'AI Consulting',
    desc:  'Strategic AI roadmaps, maturity assessments, and transformation programs tailored to your enterprise.',
    color: 'from-brand-600 to-brand-800',
    glow:  'group-hover:shadow-glow',
  },
  {
    icon:  Cpu,
    title: 'GenAI Integration',
    desc:  'Deploy large language models, RAG pipelines, and generative workflows directly into your products.',
    color: 'from-accent-600 to-accent-800',
    glow:  'group-hover:shadow-glow-purple',
  },
  {
    icon:  BarChart2,
    title: 'Retail Intelligence',
    desc:  'Real-time shopper insights, basket analysis, and inventory optimization for retail and CPG.',
    color: 'from-teal-600 to-teal-800',
    glow:  'group-hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]',
  },
  {
    icon:  TrendingUp,
    title: 'Forecasting Systems',
    desc:  'ML-powered demand forecasting with 95%+ accuracy across SKUs, regions, and time horizons.',
    color: 'from-emerald-600 to-emerald-800',
    glow:  'group-hover:shadow-[0_0_30px_rgba(5,150,105,0.4)]',
  },
  {
    icon:  DollarSign,
    title: 'Pricing Optimization',
    desc:  'Dynamic, elasticity-aware pricing engines that maximise margin without losing market share.',
    color: 'from-yellow-600 to-amber-800',
    glow:  'group-hover:shadow-[0_0_30px_rgba(202,138,4,0.4)]',
  },
  {
    icon:  Workflow,
    title: 'Data Engineering',
    desc:  'End-to-end data pipelines, lakehouses, and real-time streaming infrastructure on any cloud.',
    color: 'from-rose-600 to-rose-800',
    glow:  'group-hover:shadow-[0_0_30px_rgba(225,29,72,0.4)]',
  },
  {
    icon:  Lightbulb,
    title: 'Automation Solutions',
    desc:  'Intelligent process automation and AI agents that eliminate repetitive work and cut costs.',
    color: 'from-orange-600 to-orange-800',
    glow:  'group-hover:shadow-[0_0_30px_rgba(234,88,12,0.4)]',
  },
  {
    icon:  PieChart,
    title: 'BI Dashboards',
    desc:  'Executive-grade business intelligence dashboards with live data, drill-downs, and alerts.',
    color: 'from-sky-600 to-sky-800',
    glow:  'group-hover:shadow-[0_0_30px_rgba(2,132,199,0.4)]',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Services() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-950" />
      <div className="orb w-72 h-72 bg-brand-700 top-0 right-0 opacity-10" />

      <div className="section-wrapper relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">What We Do</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Enterprise-Grade{' '}
            <span className="gradient-text">AI Services</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            From strategy to deployment — our team of AI engineers, data scientists, and domain experts
            deliver measurable outcomes across every layer of your business.
          </p>
        </motion.div>

        {/* Service cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICES.map(({ icon: Icon, title, desc, color, glow }) => (
            <motion.div
              key={title}
              variants={item}
              className={`group glass p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-white/10 hover:border-white/20 ${glow} hover:-translate-y-2`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className="text-white" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>

              {/* Arrow */}
              <div className="mt-4 flex items-center gap-1 text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
