import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Waves, Dumbbell, Shield, Leaf, Car, Wifi, Coffee, Star } from 'lucide-react'
import { fetchAmenities } from './api'

// Map amenity name keywords → Lucide icon + gradient + glow
function getAmenityMeta(amenity) {
  const n = (amenity || '').toLowerCase()
  if (n.includes('pool') || n.includes('spa') || n.includes('swim'))
    return { Icon: Waves,    color: 'from-sky-600 to-sky-800',       glow: 'group-hover:shadow-[0_0_30px_rgba(2,132,199,0.35)]'   }
  if (n.includes('sport') || n.includes('gym') || n.includes('fitness') || n.includes('arena'))
    return { Icon: Dumbbell, color: 'from-emerald-600 to-emerald-800', glow: 'group-hover:shadow-[0_0_30px_rgba(5,150,105,0.35)]'   }
  if (n.includes('security') || n.includes('safe') || n.includes('access'))
    return { Icon: Shield,   color: 'from-accent-600 to-accent-800',  glow: 'group-hover:shadow-glow-purple'                       }
  if (n.includes('garden') || n.includes('green') || n.includes('land') || n.includes('nature'))
    return { Icon: Leaf,     color: 'from-lime-600 to-lime-800',      glow: 'group-hover:shadow-[0_0_30px_rgba(101,163,13,0.35)]'  }
  if (n.includes('park') || n.includes('ev') || n.includes('car') || n.includes('garage'))
    return { Icon: Car,      color: 'from-slate-600 to-slate-800',    glow: 'group-hover:shadow-[0_0_30px_rgba(100,116,139,0.35)]' }
  if (n.includes('smart') || n.includes('auto') || n.includes('wifi') || n.includes('tech') || n.includes('home'))
    return { Icon: Wifi,     color: 'from-violet-600 to-violet-800',  glow: 'group-hover:shadow-[0_0_30px_rgba(124,58,237,0.35)]'  }
  if (n.includes('lounge') || n.includes('club') || n.includes('sky') || n.includes('concierge'))
    return { Icon: Star,     color: 'from-brand-600 to-brand-800',    glow: 'group-hover:shadow-gold'                              }
  if (n.includes('retail') || n.includes('dining') || n.includes('cafe') || n.includes('food'))
    return { Icon: Coffee,   color: 'from-amber-600 to-amber-800',    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]'  }
  return   { Icon: Star,     color: 'from-brand-600 to-brand-800',    glow: 'group-hover:shadow-gold'                              }
}

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function LuxuryAmenities() {
  const [amenities, setAmenities] = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetchAmenities().then((res) => {
      setAmenities(res.amenities || [])
      setLoading(false)
    })
  }, [])

  return (
    <section id="amenities" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-950" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/20 to-transparent" />
      <div className="orb w-80 h-80 bg-brand-800 top-0 right-0 opacity-10" />

      <div className="section-wrapper relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">World-Class Lifestyle</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
            Amenities That Define{' '}
            <span className="gradient-text">Luxury Living</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Every project in our portfolio is curated for residents who demand more than just
            a home — they demand a lifestyle that reflects their success.
          </p>
        </motion.div>

        {/* Skeleton loaders */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="shimmer w-12 h-12 rounded-xl bg-white/5" />
                <div className="shimmer h-4 w-3/4 rounded bg-white/5" />
                <div className="shimmer h-12 rounded bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {/* Amenity cards */}
        {!loading && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {amenities.map((a) => {
              const { Icon, color, glow } = getAmenityMeta(a.amenity)
              return (
                <motion.div
                  key={a.amenityId}
                  variants={item}
                  className={`group glass p-6 rounded-2xl cursor-default transition-all duration-300 border border-white/10 hover:border-brand-700/30 ${glow} hover:-translate-y-2`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{a.amenity}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{a.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore amenity
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
