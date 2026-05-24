import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, MapPin, Calendar, Shield, Heart, CalendarCheck, ChevronRight, X, Bed, Ruler } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchProjects, fetchSubProjects, fetchProperties } from './api'
import { getSession } from './utils'

// ── Project Detail Modal ──────────────────────────────────────────────────────
function ProjectModal({ project, onClose, onInterest, onVisit }) {
  const [tab,         setTab]         = useState('overview')
  const [subProjects, setSubProjects] = useState([])
  const [properties,  setProperties]  = useState([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [activeSub,   setActiveSub]   = useState(null)

  useEffect(() => {
    if (!project) return
    setLoadingSubs(true)
    fetchSubProjects(project.id).then((res) => {
      const subs = res.subProjects || []
      setSubProjects(subs)
      if (subs.length) {
        setActiveSub(subs[0].id)
        fetchProperties(subs[0].id).then((r) => {
          setProperties(r.properties || [])
          setLoadingSubs(false)
        })
      } else {
        setLoadingSubs(false)
      }
    })
  }, [project])

  function handleSubClick(sub) {
    setActiveSub(sub.id)
    fetchProperties(sub.id).then((r) => setProperties(r.properties || []))
  }

  if (!project) return null

  const statusColor = { Available: 'text-emerald-400', Booked: 'text-red-400', Waitlist: 'text-amber-400' }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        className="w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[88vh] overflow-hidden bg-gray-900 border border-white/10 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-glass"
      >
        {/* Header */}
        <div className="relative flex-shrink-0">
          <div className="h-48 sm:h-64 overflow-hidden">
            <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-4 left-4 right-16">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {project.tags?.slice(0, 2).map((t) => (
                <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600/80 text-white border border-brand-500/40">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{project.name}</h2>
            <p className="text-gray-300 text-sm">{project.builder} · {project.city}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-4 flex-shrink-0 border-b border-white/10">
          {['overview', 'towers', 'inventory'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg capitalize transition-colors ${
                tab === t ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === 'towers' ? 'Towers / Phases' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Starting Price', value: project.startingPrice },
                  { label: 'Possession',     value: project.possessionDate },
                  { label: 'Type',           value: project.type },
                  { label: 'RERA ID',        value: project.reraId || 'Verified', mono: true },
                ].map(({ label, value, mono }) => (
                  <div key={label} className="glass rounded-xl p-3 border border-white/5">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className={`text-sm font-semibold text-white ${mono ? 'font-mono text-xs' : ''}`}>{value}</div>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
            </div>
          )}

          {tab === 'towers' && (
            <div className="space-y-3">
              {loadingSubs
                ? [...Array(3)].map((_, i) => <div key={i} className="shimmer h-16 rounded-xl bg-white/5" />)
                : subProjects.map((sp) => (
                  <div
                    key={sp.id}
                    onClick={() => handleSubClick(sp)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      activeSub === sp.id ? 'border-brand-600/60 bg-brand-950/30' : 'border-white/5 bg-white/3 hover:border-brand-700/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-white text-sm">{sp.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{sp.type} · {sp.units} Units · {sp.floorPlan}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-brand-400 text-sm font-bold">{sp.priceRange}</div>
                        <div className={`text-xs font-medium ${statusColor[sp.availability] || 'text-gray-400'}`}>
                          {sp.availability}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {tab === 'inventory' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="text-left pb-3 pr-4">Unit</th>
                    <th className="text-left pb-3 pr-4">Type</th>
                    <th className="text-left pb-3 pr-4">Floor</th>
                    <th className="text-left pb-3 pr-4">Size</th>
                    <th className="text-left pb-3 pr-4">Price</th>
                    <th className="text-left pb-3">Facing</th>
                    <th className="text-left pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loadingSubs
                    ? [...Array(4)].map((_, i) => (
                      <tr key={i}><td colSpan={7} className="py-3"><div className="shimmer h-4 rounded bg-white/5" /></td></tr>
                    ))
                    : properties.map((p) => (
                      <tr key={p.id} className="hover:bg-white/3 transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs text-gray-300">{p.unit}</td>
                        <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                          <span className="flex items-center gap-1"><Bed size={12} className="text-brand-400" />{p.type}</span>
                        </td>
                        <td className="py-3 pr-4 text-gray-400">{p.floor}</td>
                        <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">
                          <span className="flex items-center gap-1"><Ruler size={12} />{p.size}</span>
                        </td>
                        <td className="py-3 pr-4 text-brand-400 font-bold whitespace-nowrap">{p.price}</td>
                        <td className="py-3 pr-4 text-gray-400 text-xs max-w-[150px] truncate">{p.facing}</td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold ${statusColor[p.status] || 'text-gray-400'}`}>{p.status}</span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex-shrink-0 flex items-center gap-3 p-4 border-t border-white/10 bg-gray-900/80">
          <button onClick={() => { onClose(); onInterest(project) }} className="btn-primary flex-1 justify-center py-3 text-sm">
            <Heart size={15} /> I'm Interested
          </button>
          <button onClick={() => { onClose(); onVisit(project) }} className="btn-secondary flex-1 justify-center py-3 text-sm">
            <CalendarCheck size={15} /> Schedule Visit
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Interest / Visit Modal ────────────────────────────────────────────────────
function LeadModal({ project, type, onClose }) {
  const session = getSession()
  const [form, setForm] = useState({
    name: session?.username || '',
    email: session?.email || '',
    phone: '',
    budget: '',
    message: '',
    preferredDate: '',
    timeSlot: 'Morning (10AM–1PM)',
  })
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
    toast.success(type === 'interest' ? 'Interest registered! Expect a call within 24 hours.' : 'Site visit booked! Confirmation SMS on its way.')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-glass"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white">
              {type === 'interest' ? 'Register Interest' : 'Book Site Visit'}
            </h3>
            {project && <p className="text-xs text-gray-400 mt-0.5">{project.name} · {project.builder}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <X size={14} className="text-gray-400" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-brand-400" />
            </div>
            <h4 className="font-bold text-white mb-2">
              {type === 'interest' ? 'Interest Registered!' : 'Visit Confirmed!'}
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {type === 'interest'
                ? 'Our relationship manager will contact you within 24 hours to discuss this property in detail.'
                : 'You\'ll receive an SMS with visit details. Our concierge can arrange transport if needed.'}
            </p>
            <button onClick={onClose} className="btn-secondary text-sm px-8">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                <input className="input-field text-sm" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Phone</label>
                <input className="input-field text-sm" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" required />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <input type="email" className="input-field text-sm" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@email.com" required />
            </div>
            {type === 'interest' ? (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Budget Range</label>
                <select className="input-field text-sm" value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} required>
                  <option value="">Select budget</option>
                  {['₹1–2 Cr', '₹2–5 Cr', '₹5–10 Cr', '₹10 Cr+'].map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Preferred Date</label>
                  <input type="date" className="input-field text-sm" value={form.preferredDate} onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Time Slot</label>
                  <select className="input-field text-sm" value={form.timeSlot} onChange={(e) => setForm((f) => ({ ...f, timeSlot: e.target.value }))}>
                    {['Morning (10AM–1PM)', 'Afternoon (2PM–5PM)', 'Evening (5PM–7PM)'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm mt-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : type === 'interest' ? <><Heart size={15} /> Register Interest</> : <><CalendarCheck size={15} /> Confirm Booking</>
              }
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Main FeaturedProjects ─────────────────────────────────────────────────────
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp    = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function FeaturedProjects() {
  const [projects,       setProjects]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [leadProject,    setLeadProject]    = useState(null)
  const [leadType,       setLeadType]       = useState(null)
  const [filter,         setFilter]         = useState('all')

  useEffect(() => {
    fetchProjects().then((res) => {
      setProjects(res.projects || [])
      setLoading(false)
    })
  }, [])

  const cities = ['all', ...Array.from(new Set(projects.map((p) => p.cityId)))]
  const filtered = filter === 'all' ? projects : projects.filter((p) => p.cityId === filter)
  const cityLabel = { all: 'All Cities', gurgaon: 'Gurugram', noida: 'Noida', bangalore: 'Bengaluru', mumbai: 'Mumbai', hyderabad: 'Hyderabad' }

  function openLead(project, type) {
    setLeadProject(project)
    setLeadType(type)
  }

  return (
    <>
      <section id="projects" className="py-24 relative bg-gray-950 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/30 to-transparent" />
        <div className="orb w-96 h-96 bg-accent-800 -top-20 -left-20 opacity-10" />

        <div className="section-wrapper">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="section-badge mb-4">Curated Portfolio</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
              Featured{' '}
              <span className="gradient-text">Luxury Projects</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 text-lg">
              Hand-picked by our investment advisory team — only RERA-approved, reputed-builder
              projects make the cut.
            </p>
          </motion.div>

          {/* City filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === c
                    ? 'bg-brand-600 text-white shadow-glow-sm'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cityLabel[c] || c}
              </button>
            ))}
          </div>

          {/* Skeleton loaders */}
          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/5">
                  <div className="shimmer h-48 bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="shimmer h-4 w-3/4 rounded bg-white/5" />
                    <div className="shimmer h-3 w-1/2 rounded bg-white/5" />
                    <div className="shimmer h-8 rounded-xl bg-white/5 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Project cards */}
          {!loading && (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filtered.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={fadeUp}
                    layout
                    className="group glass-dark border border-white/5 hover:border-brand-700/40 hover:shadow-gold hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                        {project.tags?.slice(0, 1).map((t) => (
                          <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600/80 text-white border border-brand-500/40">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-brand-300 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-brand-700/40">
                        <MapPin size={10} />
                        {project.city}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="mb-1">
                        <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-gray-500">{project.builder} · {project.type}</p>
                      </div>

                      <div className="flex items-center gap-3 my-3 py-3 border-y border-white/5">
                        <div>
                          <div className="text-brand-400 font-bold text-sm">{project.startingPrice}</div>
                          <div className="text-xs text-gray-600">Starting Price</div>
                        </div>
                        <div className="h-8 w-px bg-white/5" />
                        <div>
                          <div className="flex items-center gap-1 text-white text-xs font-medium">
                            <Calendar size={10} className="text-gray-500" />
                            {project.possessionDate}
                          </div>
                          <div className="text-xs text-gray-600">Possession</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        <Shield size={11} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 truncate">{project.reraId || 'RERA Verified'}</span>
                      </div>

                      {/* Buttons */}
                      <div className="mt-auto space-y-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="btn-secondary w-full justify-center py-2.5 text-xs gap-1"
                        >
                          View Details <ChevronRight size={13} />
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => openLead(project, 'interest')}
                            className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold bg-brand-600/20 border border-brand-700/40 text-brand-300 hover:bg-brand-600/30 transition-colors"
                          >
                            <Heart size={11} /> Interested
                          </button>
                          <button
                            onClick={() => openLead(project, 'visit')}
                            className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                          >
                            <CalendarCheck size={11} /> Visit
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onInterest={(p) => openLead(p, 'interest')}
            onVisit={(p) => openLead(p, 'visit')}
          />
        )}
        {leadProject && (
          <LeadModal
            project={leadProject}
            type={leadType}
            onClose={() => { setLeadProject(null); setLeadType(null) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
