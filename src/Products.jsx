import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion' // AnimatePresence kept for modal open/close
import { Building2, MapPin, Calendar, Shield, Heart, CalendarCheck, ChevronRight, ChevronLeft, X, Bed, Ruler, Waves, Dumbbell, Leaf, Car, Wifi, Star, Coffee, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchProjects, fetchCities, fetchSubProjects, fetchProperties, fetchProjectImages, fetchAmenities, fetchFloorPlans, createInterestLead, createSiteVisit } from './api'
import { getSession, isValidEmail } from './utils'
import { normalizeImageUrl, getImageSrc, handleImageError, LazyImage, FALLBACK_IMG } from './imageUtils'

// ── Amenity icon mapper ───────────────────────────────────────────────────────
function getAmenityIcon(amenity) {
  const n = (amenity || '').toLowerCase()
  if (n.includes('pool') || n.includes('spa') || n.includes('swim'))
    return { Icon: Waves,    color: 'from-sky-600 to-sky-800' }
  if (n.includes('sport') || n.includes('gym') || n.includes('fitness') || n.includes('arena'))
    return { Icon: Dumbbell, color: 'from-emerald-600 to-emerald-800' }
  if (n.includes('security') || n.includes('safe') || n.includes('access'))
    return { Icon: Shield,   color: 'from-accent-600 to-accent-800' }
  if (n.includes('garden') || n.includes('green') || n.includes('land') || n.includes('nature'))
    return { Icon: Leaf,     color: 'from-lime-600 to-lime-800' }
  if (n.includes('park') || n.includes('ev') || n.includes('car') || n.includes('garage'))
    return { Icon: Car,      color: 'from-slate-600 to-slate-800' }
  if (n.includes('smart') || n.includes('auto') || n.includes('wifi') || n.includes('tech') || n.includes('home'))
    return { Icon: Wifi,     color: 'from-violet-600 to-violet-800' }
  if (n.includes('lounge') || n.includes('club') || n.includes('sky') || n.includes('concierge'))
    return { Icon: Star,     color: 'from-brand-600 to-brand-800' }
  if (n.includes('retail') || n.includes('dining') || n.includes('cafe') || n.includes('food'))
    return { Icon: Coffee,   color: 'from-amber-600 to-amber-800' }
  return { Icon: Star,       color: 'from-brand-600 to-brand-800' }
}

const MODAL_TABS  = ['gallery', 'overview', 'amenities', 'floorplans', 'inventory']
const TAB_LABELS  = { gallery: 'Gallery', overview: 'Overview', amenities: 'Amenities', floorplans: 'Floor Plans', inventory: 'Inventory' }
const STATUS_CLR  = { Available: 'text-emerald-400', Booked: 'text-red-400', Waitlist: 'text-amber-400' }

// ── Project Detail Modal ──────────────────────────────────────────────────────
function ProjectModal({ project, onClose, onInterest, onVisit }) {
  const [tab,         setTab]         = useState('gallery')
  const [subProjects, setSubProjects] = useState([])
  const [properties,  setProperties]  = useState([])
  const [images,      setImages]      = useState([])
  const [amenities,   setAmenities]   = useState([])
  const [floorPlans,  setFloorPlans]  = useState([])
  const [activeImg,   setActiveImg]   = useState(0)
  const [activeSub,   setActiveSub]   = useState(null)
  const [activeBhk,   setActiveBhk]   = useState('all')
  const [loadMedia,   setLoadMedia]   = useState(true)
  const [loadSubs,    setLoadSubs]    = useState(true)

  useEffect(() => {
    if (!project) return
    setTab('gallery')
    setActiveImg(0)
    setActiveBhk('all')
    setLoadMedia(true)
    setLoadSubs(true)

    // Fetch gallery images, amenities, floor plans in parallel (only on modal open)
    Promise.all([
      fetchProjectImages(project.id),
      fetchAmenities(project.id),
      fetchFloorPlans(project.id),
    ]).then(([imgRes, amRes, fpRes]) => {
      setImages(imgRes.images || [])
      setAmenities(amRes.amenities || [])
      setFloorPlans(fpRes.floorPlans || [])
      setLoadMedia(false)
    })

    // Inventory sub-projects
    fetchSubProjects(project.id).then((res) => {
      const subs = res.subProjects || []
      setSubProjects(subs)
      if (subs.length) {
        setActiveSub(subs[0].id)
        fetchProperties(subs[0].id).then((r) => {
          setProperties(r.properties || [])
          setLoadSubs(false)
        })
      } else {
        setLoadSubs(false)
      }
    })
  }, [project])

  function handleSubClick(sub) {
    setActiveSub(sub.id)
    fetchProperties(sub.id).then((r) => setProperties(r.properties || []))
  }

  if (!project) return null

  const bhkOptions    = ['all', ...Array.from(new Set(floorPlans.map((fp) => fp.bhk)))]
  const filteredPlans = activeBhk === 'all' ? floorPlans : floorPlans.filter((fp) => fp.bhk === activeBhk)
  const heroSrc       = normalizeImageUrl(
    tab === 'gallery' && !loadMedia && images[activeImg]
      ? images[activeImg].imageUrl
      : (project.imageUrl || project.image || project.featuredImage)
  )

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
        {/* ── Hero Header ────────────────────────────── */}
        <div className="relative flex-shrink-0">
          <div className={`${tab === 'gallery' ? 'h-52 sm:h-72' : 'h-28 sm:h-36'} overflow-hidden`}>
            <img src={heroSrc} alt={project.name} loading="eager" onError={(e) => handleImageError(e)} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X size={16} />
          </button>

          {/* Gallery nav + type badge */}
          {tab === 'gallery' && !loadMedia && images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          {tab === 'gallery' && !loadMedia && images[activeImg] && (
            <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-600/80 text-white border border-brand-500/40 capitalize">
              {images[activeImg].imageType?.replace('_', ' ')}
            </span>
          )}

          {/* Project meta overlay */}
          <div className="absolute bottom-3 left-4 right-14">
            {tab === 'gallery' && images[activeImg]?.caption && (
              <p className="text-xs text-gray-300 opacity-75 mb-1">
                {images[activeImg].caption} · {activeImg + 1}/{images.length}
              </p>
            )}
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              {project.tags?.slice(0, 2).map((t) => (
                <span key={t} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600/80 text-white border border-brand-500/40">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">{project.name}</h2>
            <p className="text-gray-300 text-xs">{project.builder} · {project.city}</p>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────── */}
        <div className="flex px-3 pt-3 flex-shrink-0 border-b border-white/10 overflow-x-auto gap-0.5">
          {MODAL_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                tab === t
                  ? 'text-brand-400 border-b-2 border-brand-500 bg-brand-950/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* ── Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* Gallery */}
          {tab === 'gallery' && (
            <div>
              {/* Thumbnail strip */}
              {loadMedia ? (
                <div className="flex gap-2 p-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="shimmer flex-shrink-0 w-16 h-12 rounded-lg bg-white/5" />
                  ))}
                </div>
              ) : images.length > 1 ? (
                <div className="flex gap-2 p-3 overflow-x-auto bg-gray-900/60">
                  {images.map((img, i) => (
                    <button
                      key={img.imageId}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        i === activeImg ? 'border-brand-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={normalizeImageUrl(img.imageUrl)} alt={img.caption} loading="lazy" onError={(e) => handleImageError(e)} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5">
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
            </div>
          )}

          {/* Overview */}
          {tab === 'overview' && (
            <div className="p-4 sm:p-6 space-y-5">
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

          {/* Amenities */}
          {tab === 'amenities' && (
            <div className="p-4 sm:p-6">
              {loadMedia ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="shimmer h-20 rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {amenities.map((a) => {
                    const { Icon, color } = getAmenityIcon(a.amenity)
                    return (
                      <div
                        key={a.amenityId}
                        className="flex items-start gap-3 glass rounded-xl p-4 border border-white/5 hover:border-brand-700/20 transition-colors"
                      >
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white mb-0.5">{a.amenity}</div>
                          <div className="text-xs text-gray-500 leading-relaxed">{a.description}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Floor Plans */}
          {tab === 'floorplans' && (
            <div className="p-4 sm:p-6">
              {/* BHK filter pills */}
              {!loadMedia && bhkOptions.length > 1 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {bhkOptions.map((b) => (
                    <button
                      key={b}
                      onClick={() => setActiveBhk(b)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        activeBhk === b
                          ? 'bg-brand-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {b === 'all' ? 'All BHK' : b}
                    </button>
                  ))}
                </div>
              )}
              {loadMedia ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="shimmer h-44 rounded-xl bg-white/5" />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredPlans.map((fp) => (
                    <div key={fp.planId} className="glass border border-white/5 rounded-xl overflow-hidden hover:border-brand-700/30 transition-colors">
                      {fp.imageUrl && (
                        <div className="relative h-36 overflow-hidden bg-gray-900">
                          <LazyImage
                            src={fp.imageUrl}
                            alt={`${fp.bhk} floor plan`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-bold text-white">{fp.bhk}</span>
                          <span className="text-brand-400 text-sm font-bold">{fp.price}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                          <span className="flex items-center gap-1"><Ruler size={11} />{fp.area}</span>
                          <span className="flex items-center gap-1"><Bed size={11} />{fp.bathrooms} Bath</span>
                          {fp.balconies > 0 && (
                            <span>{fp.balconies} Balcon{fp.balconies > 1 ? 'ies' : 'y'}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{fp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inventory */}
          {tab === 'inventory' && (
            <div className="p-4 sm:p-6">
              {/* Tower / Phase selector pills */}
              {subProjects.length > 1 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {subProjects.map((sp) => (
                    <button
                      key={sp.id}
                      onClick={() => handleSubClick(sp)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        activeSub === sp.id
                          ? 'bg-brand-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {sp.name}
                    </button>
                  ))}
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wide">
                      <th className="text-left pb-3 pr-4">Unit</th>
                      <th className="text-left pb-3 pr-4">Type</th>
                      <th className="text-left pb-3 pr-4">Floor</th>
                      <th className="text-left pb-3 pr-4">Size</th>
                      <th className="text-left pb-3 pr-4">Price</th>
                      <th className="text-left pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadSubs
                      ? [...Array(4)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan={6} className="py-3">
                            <div className="shimmer h-4 rounded bg-white/5" />
                          </td>
                        </tr>
                      ))
                      : properties.map((p) => (
                        <tr key={p.id} className="hover:bg-white/3 transition-colors">
                          <td className="py-3 pr-4 font-mono text-xs text-gray-300">{p.unit}</td>
                          <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <Bed size={12} className="text-brand-400" />{p.type}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-gray-400">{p.floor}</td>
                          <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">
                            <span className="flex items-center gap-1"><Ruler size={12} />{p.size}</span>
                          </td>
                          <td className="py-3 pr-4 text-brand-400 font-bold whitespace-nowrap">{p.price}</td>
                          <td className="py-3">
                            <span className={`text-xs font-semibold ${STATUS_CLR[p.status] || 'text-gray-400'}`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Action bar ─────────────────────────────── */}
        <div className="flex-shrink-0 flex items-center gap-3 p-4 border-t border-white/10 bg-gray-900/80">
          <button
            onClick={() => { onClose(); onInterest(project) }}
            className="btn-primary flex-1 justify-center py-3 text-sm"
          >
            <Heart size={15} /> I'm Interested
          </button>
          <button
            onClick={() => { onClose(); onVisit(project) }}
            className="btn-secondary flex-1 justify-center py-3 text-sm"
          >
            <CalendarCheck size={15} /> Schedule Visit
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Interest / Visit Modal ────────────────────────────────────────────────────
const TIME_SLOTS_MODAL = ['Morning (10AM–1PM)', 'Afternoon (2PM–5PM)', 'Evening (5PM–7PM)']

function LeadModal({ project, type, onClose }) {
  const session = getSession()
  const [form, setForm] = useState({
    name:          session?.username || '',
    email:         session?.email    || '',
    phone:         '',
    budget:        '',
    message:       '',
    preferredDate: '',            // optional for site visit
    preferredTime: TIME_SLOTS_MODAL[0],
  })
  const [loading,    setLoading]    = useState(false)
  const [sent,       setSent]       = useState(false)
  const [formError,  setFormError]  = useState('')

  function validateModal() {
    const name  = form.name.trim()
    const email = form.email.trim()
    const phone = form.phone.trim()
    if (!name)                return 'Full name is required.'
    if (!phone)               return 'Phone number is required.'
    if (!email)               return 'Email address is required.'
    if (!isValidEmail(email)) return 'Please enter a valid email address.'
    if (type === 'interest' && !form.budget) return 'Please select a budget range.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validateModal()
    if (err) { setFormError(err); return }

    setLoading(true)
    setFormError('')
    try {
      if (type === 'interest') {
        await createInterestLead({
          username:  session?.username || '',
          name:      form.name.trim(),
          email:     form.email.trim(),
          phone:     form.phone.trim(),
          projectId: project?.id   || '',
          projectName: project?.name || '',
          budget:    form.budget,
          message:   form.message.trim(),
        })
      } else {
        await createSiteVisit({
          username:      session?.username || '',
          name:          form.name.trim(),
          email:         form.email.trim(),
          phone:         form.phone.trim(),
          projectId:     project?.id   || '',
          projectName:   project?.name || '',
          preferredDate: form.preferredDate,   // optional — empty string is fine
          preferredTime: form.preferredTime,
        })
      }
      setSent(true)
      toast.success(type === 'interest'
        ? 'Interest registered! Expect a call within 24 hours.'
        : 'Site visit booked! Confirmation SMS on its way.')
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
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
          <form onSubmit={handleSubmit} noValidate className="p-5 space-y-3">
            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 border border-red-700/40 text-red-300 text-sm">
                <AlertCircle size={14} className="flex-shrink-0" />
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  className="input-field text-sm"
                  value={form.name}
                  onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, name: e.target.value })) }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  className="input-field text-sm"
                  value={form.phone}
                  onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, phone: e.target.value })) }}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                className="input-field text-sm"
                value={form.email}
                onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, email: e.target.value })) }}
                placeholder="you@email.com"
              />
            </div>

            {type === 'interest' ? (
              <>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Budget Range <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="input-field text-sm"
                    value={form.budget}
                    onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, budget: e.target.value })) }}
                  >
                    <option value="">Select budget</option>
                    {['Under ₹1 Cr', '₹1–2 Cr', '₹2–5 Cr', '₹5–10 Cr', '₹10 Cr+'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Message <span className="text-gray-600">(optional)</span>
                  </label>
                  <textarea
                    className="input-field text-sm resize-none"
                    rows={2}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Any specific requirements or questions..."
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Preferred Date <span className="text-gray-600">(optional)</span>
                  </label>
                  <input
                    type="date"
                    className="input-field text-sm"
                    value={form.preferredDate}
                    onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Time Slot</label>
                  <select
                    className="input-field text-sm"
                    value={form.preferredTime}
                    onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
                  >
                    {TIME_SLOTS_MODAL.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm mt-2"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : type === 'interest'
                  ? <><Heart size={15} /> Register Interest</>
                  : <><CalendarCheck size={15} /> Confirm Booking</>
              }
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Main FeaturedProjects ─────────────────────────────────────────────────────
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp    = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

// ── Project Card (memoised) ───────────────────────────────────────────────────
const ProjectCard = memo(function ProjectCard({ project, onSelect, onLead }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group glass-dark border border-white/5 hover:border-brand-700/40 hover:shadow-gold hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <LazyImage
          src={getImageSrc(project, 'imageUrl', 'image', 'featuredImage')}
          alt={project.projectName || project.name}
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
          {project.cityName || project.city}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-1">
          <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
            {project.projectName || project.name}
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
            onClick={() => onSelect(project)}
            className="btn-secondary w-full justify-center py-2.5 text-xs gap-1"
          >
            View Details <ChevronRight size={13} />
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLead(project, 'interest')}
              className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold bg-brand-600/20 border border-brand-700/40 text-brand-300 hover:bg-brand-600/30 transition-colors"
            >
              <Heart size={11} /> Interested
            </button>
            <button
              onClick={() => onLead(project, 'visit')}
              className="flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
            >
              <CalendarCheck size={11} /> Visit
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default function FeaturedProjects() {
  const [projects,        setProjects]        = useState([])
  const [cityMap,         setCityMap]         = useState({ all: 'All Cities' })
  const [loading,         setLoading]         = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [leadProject,     setLeadProject]     = useState(null)
  const [leadType,        setLeadType]        = useState(null)
  const [filter,          setFilter]          = useState('all')

  useEffect(() => {
    fetchProjects().then((res) => {
      setProjects(res.projects || [])
      setLoading(false)
    })
    fetchCities().then((res) => {
      const map = { all: 'All Cities' }
      ;(res.cities || []).forEach((c) => {
        map[c.id] = c.cityName || c.name || c.id
      })
      setCityMap(map)
    })
  }, [])

  // Listen for city-select events from CityShowcase
  useEffect(() => {
    function handleCitySelect(e) {
      const { cityId } = e.detail || {}
      if (cityId) setFilter(cityId)
    }
    window.addEventListener('estateflow:city-select', handleCitySelect)
    return () => window.removeEventListener('estateflow:city-select', handleCitySelect)
  }, [])

  const cityIds  = useMemo(
    () => ['all', ...Array.from(new Set(projects.map((p) => p.cityId).filter(Boolean)))],
    [projects],
  )
  const filtered = useMemo(
    () => filter === 'all' ? projects : projects.filter((p) => p.cityId === filter),
    [filter, projects],
  )

  const openLead = useCallback((project, type) => {
    setLeadProject(project)
    setLeadType(type)
  }, [])

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
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
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
            {cityIds.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === c
                    ? 'bg-brand-600 text-white shadow-glow-sm'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cityMap[c] || c}
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
          {!loading && filtered.length > 0 && (
            <motion.div
              key={filter}
              variants={container}
              initial="hidden"
              animate="show"
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={setSelectedProject}
                  onLead={openLead}
                />
              ))}
            </motion.div>
          )}

          {/* Empty state — no projects match the active city filter */}
          {!loading && filtered.length === 0 && (
            <div className="min-h-[300px] flex flex-col items-center justify-center text-center py-16">
              <Building2 size={48} className="text-gray-700 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Projects Found</h3>
              <p className="text-gray-500 text-sm mb-6">No projects match the selected filter. Try a different city.</p>
              <button
                onClick={() => setFilter('all')}
                className="btn-ghost text-sm px-5 py-2.5 border border-brand-700/30 hover:border-brand-600/50"
              >
                Clear Filter
              </button>
            </div>
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
