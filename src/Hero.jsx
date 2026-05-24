import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, MapPin, Building2, Users, TrendingUp, CalendarCheck, Phone } from 'lucide-react'

const TYPING_STRINGS = [
  'Luxury Apartments in Gurugram',
  'Premium Villas in Bengaluru',
  'Ultra-Premium High-Rises in Mumbai',
  'Investment-Grade Projects in Noida',
  'Smart Homes in Hyderabad',
]

function useTypingEffect(strings, speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState('')
  const [idx,       setIdx]       = useState(0)
  const [charIdx,   setCharIdx]   = useState(0)
  const [deleting,  setDeleting]  = useState(false)

  useEffect(() => {
    const current = strings[idx]
    let timeout

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed)
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2)
    } else if (deleting && charIdx === 0) {
      setDeleting(false)
      setIdx((i) => (i + 1) % strings.length)
    }

    setDisplayed(current.slice(0, charIdx))
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, idx, strings, speed, pause])

  return displayed
}

const STATS = [
  { value: 5,    suffix: '+',   label: 'Premium Cities',     icon: MapPin     },
  { value: 100,  suffix: '+',   label: 'Curated Projects',   icon: Building2  },
  { value: 25,   suffix: '+',   label: 'Trusted Builders',   icon: Users      },
  { value: 18.4, suffix: '%',   label: 'Avg Appreciation',   icon: TrendingUp },
]

function AnimatedCounter({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const isFloat   = !Number.isInteger(target)
        const steps     = 60
        const increment = target / steps
        let current     = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            setCount(target)
            clearInterval(timer)
          } else {
            setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current))
          }
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function Hero() {
  const typedText = useTypingEffect(TYPING_STRINGS)

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden animated-bg">
      {/* Background grid */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Luxury gold orbs */}
      <div className="orb w-[500px] h-[500px] bg-brand-800  top-10 -left-40   opacity-15" />
      <div className="orb w-80   h-80   bg-accent-700 bottom-10 right-10  opacity-10" />
      <div className="orb w-64   h-64   bg-brand-700  top-1/2  left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-8" />

      {/* Subtle image overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=60)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-transparent to-gray-950 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-gray-950/80 pointer-events-none" />

      <div className="section-wrapper relative z-10 py-24 lg:py-36">
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="section-badge gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow inline-block" />
              India's Premium Property Platform
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none mb-4"
          >
            <span className="text-white">Discover Premium</span>
            <br />
            <span className="gradient-text">Living Across India</span>
          </motion.h1>

          {/* Typing subheadline */}
          <motion.div
            variants={fadeUp}
            className="text-xl sm:text-2xl font-semibold text-gray-300 mb-6 min-h-[2.5rem] flex items-center justify-center"
          >
            <span className="typing-cursor">{typedText}</span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed mb-10"
          >
            Explore luxury apartments, ultra-premium villas, plots, and investment-grade opportunities
            across Gurugram, Noida, Bengaluru, Mumbai, and Hyderabad — curated by India's most trusted
            real estate concierge.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-base px-8 py-4"
            >
              Explore Projects <ChevronRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-base px-8 py-4"
            >
              <Phone size={16} /> Book Consultation
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost text-base px-6 py-4 border border-brand-700/30 hover:border-brand-600/50 hover:bg-brand-950/40"
            >
              <CalendarCheck size={16} /> Schedule Site Visit
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map(({ value, suffix, label, icon: Icon }) => (
              <div key={label} className="glass p-4 rounded-2xl text-center card-glow">
                <div className="flex justify-center mb-2">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating property preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="glass rounded-3xl shadow-gold border border-brand-800/40 overflow-hidden">
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse-slow" />
                <span className="text-xs text-gray-400 font-medium">Featured Properties</span>
              </div>
              <span className="text-xs text-brand-400 font-semibold">RERA Verified</span>
            </div>

            {/* Property grid */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  name: 'The Arbour',
                  builder: 'DLF',
                  city: 'Gurugram',
                  price: '₹4.5 Cr+',
                  type: 'Luxury Apartments',
                  badge: 'Ready to Move',
                  img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70',
                },
                {
                  name: 'Prestige Lakeside',
                  builder: 'Prestige',
                  city: 'Bengaluru',
                  price: '₹1.8 Cr+',
                  type: 'Premium Apartments',
                  badge: 'RERA Approved',
                  img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70',
                },
                {
                  name: 'Lodha Park',
                  builder: 'Lodha',
                  city: 'Mumbai',
                  price: '₹12 Cr+',
                  type: 'Sea-Facing Luxury',
                  badge: 'Sea View',
                  img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&q=70',
                },
              ].map((p) => (
                <div key={p.name} className="rounded-xl overflow-hidden border border-white/5 bg-white/5 group">
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600/80 text-white border border-brand-500/50">
                      {p.badge}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold text-white leading-snug">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.builder} · {p.city}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-brand-400 text-xs font-bold">{p.price}</span>
                      <span className="text-gray-600 text-xs">{p.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer bar */}
            <div className="px-5 py-2.5 border-t border-white/5 bg-black/20 flex items-center justify-between">
              <span className="text-xs text-gray-500">100+ projects across 5 cities</span>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-brand-400 font-semibold hover:text-brand-300 flex items-center gap-1"
              >
                View All <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
    </section>
  )
}
