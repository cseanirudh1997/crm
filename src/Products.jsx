// ─────────────────────────────────────────────
//  AI Projects — enterprise AI system browser + detail modal
//  Fetches: getProjects + getMediaAssets
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, AlertCircle, Maximize2,
  Grid3X3, Filter, Layers, Brain, Cpu, Clock,
  CalendarCheck, Star, ArrowRight, ImageIcon, TrendingUp,
} from 'lucide-react'
import { fetchProjects, fetchMediaAssets } from './api'
import { normalizeImageUrl, handleImageError, LazyImage } from './imageUtils'

const CATEGORIES = [
  'All', 'Pricing AI', 'GenAI', 'MLOps', 'NLP', 'Predictive AI',
  'Forecasting', 'Personalization', 'Computer Vision',
]

function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl overflow-hidden">
      <div className="h-56 shimmer bg-white/5" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-1/3 shimmer bg-white/5 rounded-full" />
        <div className="h-4 w-3/4 shimmer bg-white/5 rounded-full" />
        <div className="h-3 w-1/2 shimmer bg-white/5 rounded-full" />
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose, onBook }) {
  const [tab,    setTab]    = useState('gallery')
  const [assets, setAssets] = useState([])
  const [aLoad,  setALoad]  = useState(true)

  useEffect(() => {
    setALoad(true)
    setTab('gallery')
    fetchMediaAssets({ entityType: 'project', entityId: project.projectId })
      .then((res) => setAssets(res?.assets || []))
      .catch(() => setAssets([]))
      .finally(() => setALoad(false))
  }, [project.projectId])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const styleLabel = project.industry || project.category || '—'
  const materials  = (project.technologies || project.materials || '').split(',').map((m) => m.trim()).filter(Boolean)

  const TABS = [
    { id: 'gallery', label: 'Screenshots',       icon: ImageIcon    },
    { id: 'details', label: 'Stack & Impact',    icon: Layers       },
    { id: 'book',    label: 'Discuss Project',   icon: CalendarCheck },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 modal-backdrop bg-black/70"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="relative w-full max-w-3xl max-h-[92vh] bg-gray-950 border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-glass flex flex-col overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      >
        <div className="relative h-48 sm:h-64 flex-shrink-0 overflow-hidden">
          <img
            src={normalizeImageUrl(project.imageUrl, { width: 1200, quality: 85 })}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="section-badge text-[10px]">{project.category || project.industry}</span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-all"
            aria-label="Close"
          >
            <X size={15} />
          </button>
          <div className="absolute bottom-4 left-4 right-12">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">{project.title}</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {project.area     && <span className="text-xs text-gray-300 flex items-center gap-1"><Ruler size={10} /> {project.area}</span>}
              {project.duration && <span className="text-xs text-gray-300 flex items-center gap-1"><Calendar size={10} /> {project.duration}</span>}
              {project.budget   && <span className="text-xs text-brand-300 font-semibold">{project.budget}</span>}
            </div>
          </div>
        </div>

        <div className="flex border-b border-white/10 px-4 flex-shrink-0 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                tab === id ? 'border-brand-500 text-brand-300' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 'gallery' && (
            <div className="p-4">
              {aLoad ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => <div key={i} className="aspect-square shimmer bg-white/5 rounded-xl" />)}
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon size={32} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Gallery images coming soon.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {assets.map((asset) => (
                    <div key={asset.assetId} className="relative aspect-square rounded-xl overflow-hidden group border border-white/5">
                      <LazyImage
                        src={asset.assetUrl}
                        alt={asset.caption || project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        width={400}
                        quality={75}
                      />
                      {asset.caption && (
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-gray-200 leading-tight">{asset.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'details' && (
            <div className="p-5 space-y-5">
              <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Industry',  value: styleLabel,               icon: Brain      },
                  { label: 'Scale',     value: project.area || '—',      icon: TrendingUp },
                  { label: 'Timeline',  value: project.duration || '—',  icon: Clock      },
                  { label: 'Tier',      value: project.budget || '—',    icon: Star       },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="glass p-3.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={13} className="text-brand-400" />
                      <span className="text-xs text-gray-500">{label}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
              {materials.length > 0 && (
                <div className="glass p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={13} className="text-brand-400" />
                    <span className="text-xs text-gray-500">Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {materials.map((mat) => <span key={mat} className="property-badge">{mat}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'book' && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center mx-auto mb-5 shadow-glow">
                <CalendarCheck size={28} className="text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">Interested in this system?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                Book a complimentary AI strategy session. We can discuss how a similar architecture could drive measurable impact for your organization.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => { onClose(); onBook(project) }}
                  className="btn-primary w-full justify-center text-sm py-3"
                >
                  <CalendarCheck size={16} /> Book AI Strategy Session
                </button>
                <button
                  onClick={() => { onClose(); document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="btn-secondary w-full justify-center text-sm py-3"
                >
                  Go to Consultation Form
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-4">Free initial call · No commitment required</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

const ProjectCard = memo(function ProjectCard({ project, onSelect }) {
  const category = project.category || project.industry || 'AI'
  const style    = project.industry || project.impact || ''
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
      onClick={() => onSelect(project)}
      className="group glass border border-white/5 rounded-2xl overflow-hidden cursor-pointer card-glow hover:border-brand-800/40"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={normalizeImageUrl(project.imageUrl)}
          alt={project.title}
          loading="lazy"
          onError={(e) => handleImageError(e)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="property-badge">{category}</span>
        </div>
        {project.featured === 'yes' && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 rounded-full bg-brand-600/80 border border-brand-500/50 flex items-center justify-center">
              <Star size={10} className="text-white" fill="white" />
            </div>
          </div>
        )}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center">
            <Maximize2 size={12} className="text-white" />
          </div>
        </div>
      </div>
      <div className="p-4">
        {style && <div className="text-xs text-brand-400 font-medium mb-1 uppercase tracking-wide">{style}</div>}
        <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-brand-200 transition-colors">{project.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {project.area     && <span className="text-xs text-gray-500 flex items-center gap-1"><Ruler size={9} />{project.area}</span>}
            {project.duration && <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={9} />{project.duration}</span>}
          </div>
          {project.budget && <span className="text-xs font-bold text-brand-400">{project.budget}</span>}
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-brand-400 font-medium group-hover:gap-2 transition-all">
          View Project <ArrowRight size={11} />
        </div>
      </div>
    </motion.div>
  )
})

export default function AIProjects() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetchProjects()
      .then((res) => setProjects(res?.projects || []))
      .catch(() => setError('Showing curated design collections.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = category === 'All'
    ? projects
    : projects.filter((p) => (p.category || p.industry) === category)

  const handleBook = useCallback(() => {
    setTimeout(() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' }), 150)
  }, [])

  return (
    <section id="projects" className="py-20 relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="orb w-96 h-96 bg-brand-900 top-10 -right-32 opacity-8" />
      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-badge mb-4"><Grid3X3 size={11} /> AI Projects</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Enterprise AI Systems <span className="gradient-text">In Production</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            8+ enterprise AI systems shipped across retail, FinTech, media, telecom, and supply chain —
            each built from data architecture to production deployment with measurable business impact.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-2 flex-wrap justify-center mb-10"
        >
          <Filter size={14} className="text-gray-500 self-center mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-glow-sm'
                  : 'glass border border-white/10 text-gray-400 hover:text-white hover:border-brand-700/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 mb-6 rounded-xl bg-amber-900/20 border border-amber-700/30 text-amber-300 text-xs max-w-lg mx-auto">
            <AlertCircle size={14} className="flex-shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Brain size={40} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-base">No projects in this domain yet.</p>
            <button onClick={() => setCategory('All')} className="btn-primary mt-4">View All Projects</button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((project) => (
                <ProjectCard key={project.projectId} project={project} onSelect={setSelected} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary px-8 py-4"
            >
              <CalendarCheck size={16} /> Book an AI Strategy Session
            </button>
            <p className="text-xs text-gray-500 mt-3">Free initial call · Discuss your AI use case and roadmap</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} onBook={handleBook} />
        )}
      </AnimatePresence>
    </section>
  )
}
