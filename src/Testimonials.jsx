import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'

const TESTIMONIALS = [
  {
    name:    'Sarah Mitchell',
    title:   'Chief Data Officer',
    company: 'RetailMega Corp',
    avatar:  'SM',
    rating:  5,
    quote:   "NexusAI's RetailIQ platform transformed how we understand customer behavior. We saw a 28% lift in same-store sales within 6 months of deployment. The team's expertise in retail AI is unmatched.",
    color:   'from-brand-600 to-brand-800',
  },
  {
    name:    'James Okonkwo',
    title:   'VP of Technology',
    company: 'FinEdge Financial',
    avatar:  'JO',
    rating:  5,
    quote:   "The fraud detection model they built catches 99.2% of fraudulent transactions in real-time. Our false positive rate dropped by 62%. The ROI was evident within the first quarter.",
    color:   'from-emerald-600 to-emerald-800',
  },
  {
    name:    'Priya Nakashima',
    title:   'Head of Supply Chain',
    company: 'GlobalLogix',
    avatar:  'PN',
    rating:  5,
    quote:   "AI Forecast Studio reduced our inventory carrying costs by $4.2M annually. The demand forecasts are eerily accurate even across long lead-time SKUs. Implementation was smooth and fast.",
    color:   'from-teal-600 to-teal-800',
  },
  {
    name:    'Marcus Devereux',
    title:   'CEO',
    company: 'HealthFirst Systems',
    avatar:  'MD',
    rating:  5,
    quote:   "NexusAI helped us deploy clinical NLP that saves our nurses 2 hours per shift. Patient satisfaction scores improved by 19%. The team understood our compliance needs from day one.",
    color:   'from-rose-600 to-rose-800',
  },
  {
    name:    'Lena Hoffmann',
    title:   'Director of E-Commerce',
    company: 'Luxera Brands',
    avatar:  'LH',
    rating:  5,
    quote:   "Our conversion rate jumped 34% after deploying their AI personalisation engine. The product recommendation accuracy is exceptional — customers say the site 'feels like it reads their mind'.",
    color:   'from-accent-600 to-accent-800',
  },
  {
    name:    'David Castellano',
    title:   'Chief Analytics Officer',
    company: 'UrbanRetail Group',
    avatar:  'DC',
    rating:  5,
    quote:   "GenAssist Enterprise gave all 3,000 of our employees a private AI assistant that's connected to our internal knowledge base. Productivity metrics improved by 31% in the first month.",
    color:   'from-amber-600 to-amber-800',
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [auto,    setAuto]    = useState(true)
  const total = TESTIMONIALS.length

  useEffect(() => {
    if (!auto) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % total), 5000)
    return () => clearInterval(timer)
  }, [auto, total])

  const prev = () => { setAuto(false); setCurrent((c) => (c - 1 + total) % total) }
  const next = () => { setAuto(false); setCurrent((c) => (c + 1) % total) }

  const t = TESTIMONIALS[current]

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <div className="orb w-80 h-80 bg-accent-800 top-20 right-20 opacity-10" />

      <div className="section-wrapper relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">Customer Stories</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Loved by <span className="gradient-text">Industry Leaders</span>
          </h2>
        </motion.div>

        {/* Main testimonial */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{   opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative"
          >
            {/* Quote icon */}
            <Quote size={48} className="text-brand-700/40 absolute top-8 right-8" />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
              ))}
            </div>

            {/* Quote text */}
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 relative z-10">
              "{t.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-glow-sm`}>
                {t.avatar}
              </div>
              <div>
                <div className="text-white font-semibold">{t.name}</div>
                <div className="text-gray-400 text-sm">{t.title}, {t.company}</div>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAuto(false); setCurrent(i) }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 h-2 bg-brand-500'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mini cards below */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
          {TESTIMONIALS.filter((_, i) => i !== current).slice(0, 3).map((t, i) => (
            <motion.button
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => { setAuto(false); setCurrent(TESTIMONIALS.indexOf(t)) }}
              className="glass rounded-xl p-4 text-left hover:border-white/20 border border-transparent transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.company}</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">"{t.quote}"</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
