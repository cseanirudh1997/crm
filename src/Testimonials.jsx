import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { fetchTestimonials } from './api'

function StarRow({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13} className={i < rating ? 'text-brand-400 fill-brand-400' : 'text-gray-600'} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    fetchTestimonials()
      .then((res) => setTestimonials(res?.testimonials || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (testimonials.length < 2) return
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [testimonials.length])

  function go(dir) {
    clearInterval(timerRef.current)
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-brand-900 -top-20 right-10 opacity-8" />
      <div className="section-wrapper relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-badge mb-4"><Users size={11} /> Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Words From <span className="gradient-text">Clients & Mentees</span>
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">Trusted by enterprise teams, data scientists, and ML leaders across India's top tech companies.</p>
        </motion.div>

        {loading ? (
          <div className="max-w-2xl mx-auto glass border border-white/5 rounded-3xl p-10 space-y-4">
            <div className="h-4 w-1/4 shimmer bg-white/5 rounded-full mx-auto" />
            <div className="h-5 w-3/4 shimmer bg-white/5 rounded-full mx-auto" />
            <div className="h-4 w-full shimmer bg-white/5 rounded-full" />
            <div className="h-4 w-2/3 shimmer bg-white/5 rounded-full mx-auto" />
          </div>
        ) : testimonials.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
                  className="glass border border-brand-700/20 rounded-3xl p-8 sm:p-10 text-center"
                >
                  <Quote size={32} className="text-brand-700/60 mx-auto mb-6" />
                  <StarRow rating={testimonials[current].rating} />
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed my-6 font-light italic">
                    "{testimonials[current].review}"
                  </p>
                  <div>
                    <div className="text-white font-bold text-base">{testimonials[current].name}</div>
                    <div className="text-brand-400 text-sm font-medium mt-0.5">{testimonials[current].title || testimonials[current].city}</div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Nav buttons */}
              {testimonials.length > 1 && (
                <>
                  <button onClick={() => go(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-700/40 transition-all">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => go(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-700/40 transition-all">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Dots */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => { clearInterval(timerRef.current); setCurrent(i) }} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-brand-500 w-5' : 'bg-gray-700 hover:bg-gray-500'}`} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
