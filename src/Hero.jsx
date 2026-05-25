import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Sparkles, Home, Eye, CalendarCheck, Award, Users, Star } from 'lucide-react'
import { normalizeImageUrl, handleImageError } from './imageUtils'

const TYPING_STRINGS = [
  'Transforming Spaces Into Timeless Luxury',
  'Crafting Premium Living Rooms & Villas',
  'Bespoke Modular Kitchen Experiences',
  'Architectural Visualization & 3D Planning',
  'Luxury Bedroom & Master Suite Design',
  'From Concept to Cinematic Reality',
]

function useTypingEffect(strings, speed = 70, pause = 2200) {
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
  { value: 500,  suffix: '+',  label: 'Projects Completed', icon: Home    },
  { value: 98,   suffix: '%',  label: 'Client Satisfaction', icon: Star   },
  { value: 12,   suffix: '+',  label: 'Years of Expertise',  icon: Award  },
  { value: 2500, suffix: '+',  label: 'Happy Clients',       icon: Users  },
]

function AnimatedCounter({ target, suffix, duration = 2000 }) {
  const [count,  setCount]  = useState(0)
  const ref     = useRef(null)
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

const FEATURED_DESIGNS = [
  {
    name:    'Modern Luxury Living Room',
    style:   'Contemporary',
    area:    '1,200 sq ft',
    badge:   'Featured Collection',
    img:     'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&q=70',
  },
  {
    name:    'Scandinavian Master Bedroom',
    style:   'Minimal Luxury',
    area:    '650 sq ft',
    badge:   'Award Winning',
    img:     'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70',
  },
  {
    name:    'Premium Modular Kitchen',
    style:   'Modern Contemporary',
    area:    '420 sq ft',
    badge:   'Client Favorite',
    img:     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70',
  },
]

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function Hero() {
  const typedText = useTypingEffect(TYPING_STRINGS)

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden animated-bg">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-25" />

      {/* Warm luxury orbs */}
      <div className="orb w-[600px] h-[600px] bg-brand-800  top-0  -left-60    opacity-12" />
      <div className="orb w-96   h-96   bg-accent-700 bottom-0 right-0    opacity-10" />
      <div className="orb w-72   h-72   bg-brand-700  top-1/2  left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-8" />

      {/* Hero background visual — interior design space */}
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1920&q=60)',
          backgroundSize:   'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-transparent to-gray-950 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-transparent to-gray-950/70 pointer-events-none" />

      <div className="section-wrapper relative z-10 py-20 lg:py-32">
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11 } } }}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center"
        >
          {/* Studio badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="section-badge gap-2">
              <Sparkles size={11} className="text-brand-400" />
              Premium Interior Design Studio · Est. 2013
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none mb-4"
          >
            <span className="text-white">Transforming Spaces Into</span>
            <br />
            <span className="gradient-text">Timeless Luxury Experiences</span>
          </motion.h1>

          {/* Typing sub-headline */}
          <motion.div
            variants={fadeUp}
            className="text-lg sm:text-xl font-medium text-gray-300 mb-4 min-h-[2.2rem] flex items-center justify-center"
          >
            <span className="typing-cursor text-brand-300">{typedText}</span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed mb-10"
          >
            Premium interior design solutions for luxury homes, villas, apartments, and modern commercial spaces.
            From concept to completion — crafted with precision, inspired by your vision.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-base px-8 py-4"
            >
              <CalendarCheck size={17} /> Book Consultation
            </button>
            <button
              onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-base px-8 py-4"
            >
              Explore Collections <ChevronRight size={17} />
            </button>
            <button
              onClick={() => document.getElementById('transformations')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost text-base px-6 py-4 border border-brand-700/30 hover:border-brand-600/50 hover:bg-brand-950/40"
            >
              <Eye size={16} /> View Transformations
            </button>
          </motion.div>

          {/* Stats grid */}
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

        {/* Featured design preview card */}
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
                <span className="text-xs text-gray-400 font-medium">Featured Design Collections</span>
              </div>
              <span className="text-xs text-brand-400 font-semibold tracking-wide">MAISON STUDIO</span>
            </div>

            {/* Design cards grid */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FEATURED_DESIGNS.map((d) => (
                <div key={d.name} className="rounded-xl overflow-hidden border border-white/5 bg-white/5 group cursor-pointer">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={normalizeImageUrl(d.img)}
                      alt={d.name}
                      loading="lazy"
                      onError={(e) => handleImageError(e)}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      style={{ '--tw-scale-x': 1.08, '--tw-scale-y': 1.08 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                    <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600/80 text-white border border-brand-500/50">
                      {d.badge}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold text-white leading-snug">{d.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{d.style}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-brand-400 text-xs font-semibold">{d.area}</span>
                      <span className="text-gray-600 text-xs">Design Studio</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer bar */}
            <div className="px-5 py-2.5 border-t border-white/5 bg-black/20 flex items-center justify-between">
              <span className="text-xs text-gray-500">500+ completed projects · 12 years of luxury design</span>
              <button
                onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-brand-400 font-semibold hover:text-brand-300 flex items-center gap-1 transition-colors"
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
