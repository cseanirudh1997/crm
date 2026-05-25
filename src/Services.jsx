import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Cpu, TrendingUp, Users, MessageSquare, BookOpen, Sparkles, CalendarCheck, ArrowRight } from 'lucide-react'
import { fetchServices } from './api'

const ICON_MAP = { Brain, Cpu, TrendingUp, Users, MessageSquare, BookOpen }

function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl p-6 space-y-3">
      <div className="w-12 h-12 rounded-2xl shimmer bg-white/5" />
      <div className="h-4 w-2/3 shimmer bg-white/5 rounded-full" />
      <div className="h-3 w-full shimmer bg-white/5 rounded-full" />
      <div className="h-3 w-3/4 shimmer bg-white/5 rounded-full" />
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
      .then((res) => setServices(res?.services || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="services" className="py-20 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="orb w-96 h-96 bg-brand-900 -top-20 right-0 opacity-8" />
      <div className="section-wrapper relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-badge mb-4"><Sparkles size={11} /> AI Services</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Expert <span className="gradient-text">AI Consulting & Mentorship</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From enterprise AI strategy to 1-on-1 mentorship — specialized services for organizations building production AI systems and data scientists accelerating their careers.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
            : services.map((svc, i) => {
                const Icon = ICON_MAP[svc.icon] || Brain
                return (
                  <motion.div
                    key={svc.serviceId}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="group glass border border-white/5 rounded-2xl p-6 card-glow hover:border-brand-700/40 cursor-pointer"
                    onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-600/20 border border-brand-700/30 flex items-center justify-center mb-4 group-hover:from-brand-600/30 group-hover:to-accent-600/30 transition-all">
                      <Icon size={22} className="text-brand-400" />
                    </div>
                    {svc.category && <div className="text-xs text-brand-400 font-semibold uppercase tracking-wide mb-1">{svc.category}</div>}
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-brand-200 transition-colors">{svc.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">{svc.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-400 text-sm font-bold">{svc.price}</span>
                      <div className="flex items-center gap-1 text-xs text-brand-400 font-medium group-hover:gap-2 transition-all">
                        Enquire <ArrowRight size={11} />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <button onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary px-8 py-4">
            <CalendarCheck size={16} /> Book a Free Strategy Call
          </button>
          <p className="text-xs text-gray-500 mt-3">Custom enterprise packages available · No-obligation initial call</p>
        </motion.div>
      </div>
    </section>
  )
}
