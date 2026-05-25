import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { fetchTestimonials } from './api'

const PALETTE = [
  'from-brand-600 to-brand-800',
  'from-emerald-600 to-emerald-800',
  'from-sky-600 to-sky-800',
  'from-accent-600 to-accent-800',
  'from-rose-600 to-rose-800',
]

// Derive initials from full name
function getInitials(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [idx,          setIdx]          = useState(0)
  const [dir,          setDir]          = useState(1)
  const intervalRef                     = useRef(null)

  useEffect(() => {
    fetchTestimonials().then((res) => {
      setTestimonials(res.testimonials || [])
      setIdx(0)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!testimonials.length) return
    intervalRef.current = setInterval(() => {
      setDir(1)
      setIdx((i) => (i + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(intervalRef.current)
  }, [testimonials])

  function goTo(next) {
    clearInterval(intervalRef.current)
    setDir(next > idx ? 1 : -1)
    setIdx(next)
  }

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d * 60 }),
    center: { opacity: 1, x: 0 },
    exit:   (d) => ({ opacity: 0, x: d * -60 }),
  }

  const current = testimonials[idx]

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-gray-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/20 to-transparent" />
      <div className="orb w-96 h-96 bg-brand-900 -top-20 left-1/2 -translate-x-1/2 opacity-15" />

      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4">Success Stories</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
            Trusted by{' '}
            <span className="gradient-text">India's Top Investors</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-lg">
            From first-time home buyers to seasoned real estate investors — EstateFlow
            delivers exceptional results across every budget and city.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="max-w-3xl mx-auto">
            <div className="glass border border-white/10 rounded-3xl p-8 md:p-10 space-y-5">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <div key={i} className="shimmer w-4 h-4 rounded bg-white/5" />)}
              </div>
              <div className="shimmer h-24 rounded-xl bg-white/5" />
              <div className="flex items-center gap-4">
                <div className="shimmer w-12 h-12 rounded-full bg-white/5" />
                <div className="space-y-2 flex-1">
                  <div className="shimmer h-4 w-1/3 rounded bg-white/5" />
                  <div className="shimmer h-3 w-1/4 rounded bg-white/5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Testimonial carousel */}
        {!loading && testimonials.length > 0 && (
          <div className="max-w-3xl mx-auto">
            {/* Card */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={idx}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className={`glass border border-white/10 rounded-3xl p-8 md:p-10 bg-gradient-to-br ${PALETTE[idx % PALETTE.length]}/10 relative`}
                >
                  {/* Quote icon */}
                  <Quote size={40} className="text-brand-700/40 absolute top-6 right-8" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(current.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} className="text-brand-400 fill-brand-400" />
                    ))}
                  </div>

                  {/* Review text — uses t.review from API */}
                  <p className="text-white text-lg leading-relaxed mb-8 relative z-10">
                    "{current.review}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${PALETTE[idx % PALETTE.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md`}>
                        {current.avatar || getInitials(current.name)}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{current.name}</div>
                        {(current.title || current.company) && (
                          <div className="text-gray-400 text-sm">
                            {[current.title, current.company].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {current.project && (
                        <div className="text-brand-400 text-xs font-semibold">{current.project}</div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mt-0.5">
                        <MapPin size={10} /> {current.city}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-7">
              <button
                onClick={() => goTo((idx - 1 + testimonials.length) % testimonials.length)}
                className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-700/40 transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === idx ? 'w-6 h-2.5 bg-brand-500' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => goTo((idx + 1) % testimonials.length)}
                className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-700/40 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && testimonials.length === 0 && (
          <div className="max-w-3xl mx-auto text-center py-16">
            <Quote size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Reviews Yet</h3>
            <p className="text-gray-500 text-sm">Client success stories will appear here soon.</p>
          </div>
        )}
      </div>
    </section>
  )
}
