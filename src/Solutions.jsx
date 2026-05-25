// CaseStudies — Home Transformation showcase
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Ruler, Sparkles, TrendingUp, ChevronRight, ArrowRight } from 'lucide-react'
import { fetchCaseStudies } from './api'
import { normalizeImageUrl, handleImageError } from './imageUtils'

// SkeletonCard, DetailPanel, and CaseStudies main export

function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl overflow-hidden">
      <div className="h-28 shimmer bg-white/5" />
      <div className="p-4 space-y-2"><div className="h-3 w-3/4 shimmer bg-white/5 rounded-full" /><div className="h-3 w-1/2 shimmer bg-white/5 rounded-full" /></div>
    </div>
  )
}

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchCaseStudies()
      .then((res) => {
        const data = res?.caseStudies || []
        setCaseStudies(data)
        if (data.length > 0) setSelected(data[0])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="transformations" className="py-20 relative">
      <div className="orb w-80 h-80 bg-accent-800 -bottom-20 -left-20 opacity-8" />
      <div className="section-wrapper relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-badge mb-4"><BookOpen size={11} /> Transformation Stories</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Real Homes, <span className="gradient-text">Extraordinary Transformations</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            From concept to completion — explore how we've transformed ordinary spaces into extraordinary luxury experiences for clients across India.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: card list */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : caseStudies.map((cs, i) => (
              <motion.div
                key={cs.caseStudyId}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                onClick={() => setSelected(cs)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 ${selected?.caseStudyId === cs.caseStudyId ? 'border-brand-600/60 shadow-gold bg-brand-950/30' : 'glass border-white/5 hover:border-brand-700/40'}`}
              >
                <div className="flex gap-0">
                  <div className="relative w-28 flex-shrink-0 overflow-hidden">
                    <img src={normalizeImageUrl(cs.imageUrl, { width: 300, quality: 70 })} alt={cs.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 min-h-[100px]" onError={(e) => handleImageError(e)} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-950/20" />
                  </div>
                  <div className="flex-1 p-3 min-w-0">
                    {cs.style && <div className="text-[10px] text-brand-400 font-semibold mb-1 uppercase tracking-wide">{cs.style}</div>}
                    <h3 className="text-xs font-bold text-white leading-snug mb-1 group-hover:text-brand-200 transition-colors">{cs.title}</h3>
                    <p className="text-[11px] text-gray-500 mb-1.5 line-clamp-2 leading-relaxed">{cs.summary}</p>
                    <div className="flex items-center gap-1 text-[10px] text-brand-400 font-medium group-hover:gap-2 transition-all">View story <ChevronRight size={9} /></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-3 lg:sticky lg:top-24">
            {loading ? (
              <div className="glass border border-white/5 rounded-2xl h-[480px] shimmer bg-white/5" />
            ) : selected ? (
              <AnimatePresence mode="wait">
                <motion.div key={selected.caseStudyId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="glass border border-brand-700/30 rounded-2xl overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img src={normalizeImageUrl(selected.imageUrl, { width: 900, quality: 80 })} alt={selected.title} className="w-full h-full object-cover" onError={(e) => handleImageError(e)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/50 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      {selected.style && <span className="section-badge text-[10px] mb-2 inline-flex">{selected.style}</span>}
                      <h3 className="font-display text-xl font-bold text-white leading-tight">{selected.title}</h3>
                      <p className="text-xs text-brand-300 font-medium mt-1">{selected.client}</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{selected.summary}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ label: 'Duration', value: selected.duration || '—', icon: Clock }, { label: 'Area', value: selected.area || '—', icon: Ruler }].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="glass p-3 rounded-xl border border-white/5">
                          <div className="flex items-center gap-1.5 mb-1"><Icon size={12} className="text-brand-400" /><span className="text-xs text-gray-500">{label}</span></div>
                          <div className="text-sm font-semibold text-white">{value}</div>
                        </div>
                      ))}
                    </div>
                    {selected.impact && (
                      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-900/20 border border-brand-700/30">
                        <TrendingUp size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-brand-400 font-semibold mb-0.5">Impact & Outcome</div>
                          <div className="text-xs text-gray-300 leading-relaxed">{selected.impact}</div>
                        </div>
                      </div>
                    )}
                    <button onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary w-full justify-center text-sm">
                      Transform My Space <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : null}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-14">
          <p className="text-gray-500 text-sm mb-4">Ready to write your own transformation story?</p>
          <button onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary px-8 py-4">
            <Sparkles size={16} /> Start Your Transformation
          </button>
        </motion.div>
      </div>
    </section>
  )
}
