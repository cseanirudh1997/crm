import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Play, TrendingUp, Cpu, Globe } from 'lucide-react'

const TYPING_STRINGS = [
  'Enterprise AI & Analytics',
  'Retail Intelligence Platforms',
  'GenAI Integration Suite',
  'Forecasting & Pricing Engine',
  'Decision Intelligence Hub',
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
  { value: 500,  suffix: '+', label: 'Enterprise Clients',  icon: Globe },
  { value: 98,   suffix: '%', label: 'Customer Satisfaction', icon: TrendingUp },
  { value: 10,   suffix: 'B+', label: 'Data Points Processed', icon: Cpu },
  { value: 3.2,  suffix: 'x', label: 'Avg. ROI Improvement',  icon: TrendingUp },
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

      {/* Glowing orbs */}
      <div className="orb w-96 h-96 bg-brand-600  top-20 -left-20"   />
      <div className="orb w-80 h-80 bg-accent-600 bottom-20 right-10" />
      <div className="orb w-64 h-64 bg-neon-cyan  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Hero grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/20 to-gray-950" />
      </div>

      <div className="section-wrapper relative z-10 py-24 lg:py-32">
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
              Trusted by 500+ Enterprise Teams
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-none mb-4"
          >
            <span className="text-white">Solutions for</span>
            <br />
            <span className="gradient-text">Modern Businesses</span>
          </motion.h1>

          {/* Typing subheadline */}
          <motion.div
            variants={fadeUp}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-300 mb-6 h-10"
          >
            <span className="typing-cursor">{typedText}</span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="max-w-2xl mx-auto text-gray-400 text-base sm:text-lg leading-relaxed mb-10"
          >
            Unlock the full potential of your data with our enterprise-grade AI platform.
            From GenAI integration to real-time retail analytics and intelligent forecasting —
            NexusAI accelerates growth at every stage.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/signup" className="btn-primary text-base px-8 py-4">
              Start Free Trial <ChevronRight size={18} />
            </Link>
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-base px-8 py-4"
            >
              <Play size={16} className="fill-current" /> Watch Demo
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

        {/* Floating UI preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="glass p-4 rounded-3xl shadow-glow-lg border border-brand-800/40">
            {/* Window bar */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 h-6 rounded-md bg-white/5 mx-4 flex items-center px-3">
                <span className="text-xs text-gray-500 font-mono">nexusai.io/dashboard</span>
              </div>
            </div>
            {/* Mock dashboard UI */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Revenue Forecast', value: '$12.4M', color: 'from-brand-600 to-brand-800' },
                { label: 'AI Accuracy',       value: '97.3%',   color: 'from-accent-600 to-accent-800' },
                { label: 'Processed Today',   value: '48.2M',  color: 'from-teal-600 to-teal-800' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`rounded-xl p-3 bg-gradient-to-br ${color} bg-opacity-30 border border-white/10`}>
                  <div className="text-xs text-gray-400 mb-1">{label}</div>
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40 rounded-full w-3/4 animate-pulse-slow" />
                  </div>
                </div>
              ))}
            </div>
            {/* Mock chart bars */}
            <div className="h-20 flex items-end gap-1 px-2">
              {[40, 65, 45, 80, 55, 70, 90, 60, 85, 75, 95, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 1.2 + i * 0.05, duration: 0.5 }}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-brand-700 to-brand-400 opacity-80"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
    </section>
  )
}
