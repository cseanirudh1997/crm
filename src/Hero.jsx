import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Sparkles, Brain, CalendarCheck, Award, Users, BookOpen, TrendingUp } from 'lucide-react'

const TYPING_STRINGS = [
  'Building Enterprise AI Systems at Scale',
  'GenAI Architecture · RAG · LLM Fine-Tuning',
  'Pricing AI · Personalization · Demand Forecasting',
  'Mentoring the Next Generation of AI Leaders',
  'Turning AI Research into Production Impact',
  'From ML Model to $42M Business Outcome',
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
  { value: 8,    suffix: '+',  label: 'Enterprise AI Systems',  icon: Brain      },
  { value: 50,   suffix: '+',  label: 'Mentees Placed',         icon: Users      },
  { value: 42,   suffix: 'M+', label: 'GMV Impact ($)',         icon: TrendingUp },
  { value: 1300, suffix: '+',  label: 'Newsletter Subscribers', icon: BookOpen   },
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

const FEATURED_PROJECTS = [
  {
    name:    'Pricing Intelligence Platform',
    style:   'Retail · SageMaker',
    metric:  '$42M GMV Impact',
    badge:   'Featured Project',
    img:     'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=70',
  },
  {
    name:    'GenAI Content Platform',
    style:   'Media · RAG + LangChain',
    metric:  '74% Cost Reduction',
    badge:   'Production System',
    img:     'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=70',
  },
  {
    name:    'Real-Time Fraud Detection',
    style:   'FinTech · Flink + ML',
    metric:  '96.8% Precision',
    badge:   'High-Impact',
    img:     'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=70',
  },
]

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function Hero() {
  const typedText = useTypingEffect(TYPING_STRINGS)

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden animated-bg">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-25" />

      {/* AI-themed orbs */}
      <div className="orb w-[600px] h-[600px] bg-brand-800  top-0  -left-60    opacity-12" />
      <div className="orb w-96   h-96   bg-accent-700 bottom-0 right-0    opacity-10" />
      <div className="orb w-72   h-72   bg-brand-700  top-1/2  left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-8" />

      {/* Hero background visual */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1920&q=60)',
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
          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="section-badge gap-2">
              <Sparkles size={11} className="text-brand-400" />
              Senior Data Scientist · GenAI Leader · Enterprise AI Consultant
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-none mb-4"
          >
            <span className="text-white">Enterprise AI That</span>
            <br />
            <span className="gradient-text">Drives Real Business Impact</span>
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
            Pricing AI · GenAI Systems · MLOps · Personalization · Forecasting.
            12+ years building AI that ships — and mentoring data scientists to do the same.
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
              <CalendarCheck size={17} /> Book AI Consultation
            </button>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-base px-8 py-4"
            >
              Explore AI Projects <ChevronRight size={17} />
            </button>
            <button
              onClick={() => document.getElementById('casestudies')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost text-base px-6 py-4 border border-brand-700/30 hover:border-brand-600/50 hover:bg-brand-950/40"
            >
              <Award size={16} /> View Case Studies
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

        {/* Featured AI projects preview card */}
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
                <span className="text-xs text-gray-400 font-medium">Featured AI Projects</span>
              </div>
              <span className="text-xs text-brand-400 font-semibold tracking-wide">VN.AI</span>
            </div>

            {/* Project cards grid */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FEATURED_PROJECTS.map((d) => (
                <div key={d.name} className="rounded-xl overflow-hidden border border-white/5 bg-white/5 group cursor-pointer">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={d.img}
                      alt={d.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-600/80 text-white border border-brand-500/50">
                      {d.badge}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="text-xs font-bold text-white leading-snug">{d.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{d.style}</div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-brand-400 text-xs font-semibold">{d.metric}</span>
                      <span className="text-gray-600 text-xs">Production</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer bar */}
            <div className="px-5 py-2.5 border-t border-white/5 bg-black/20 flex items-center justify-between">
              <span className="text-xs text-gray-500">8+ enterprise AI systems · $42M+ business impact</span>
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
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
