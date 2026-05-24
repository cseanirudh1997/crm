import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Building2, ArrowRight } from 'lucide-react'
import { fetchCities } from './api'

export default function CityShowcase() {
  const [cities,  setCities]  = useState([])
  const [loading, setLoading] = useState(true)
  const [active,  setActive]  = useState(null)

  useEffect(() => {
    fetchCities().then((res) => {
      if (res.success && res.cities?.length) {
        setCities(res.cities)
        setActive(res.cities[0].id)
      }
      setLoading(false)
    })
  }, [])

  function scrollToProjects() {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="cities" className="py-24 relative bg-gray-950 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/30 to-transparent" />
      <div className="orb w-96 h-96 bg-brand-900 bottom-0 right-0 opacity-10" />

      <div className="section-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4">Prime Locations</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            India's Most Coveted{' '}
            <span className="gradient-text">Real Estate Markets</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            From the millennium city of Gurugram to Mumbai's iconic sea-facing boulevards —
            curated luxury across India's fastest-appreciating markets.
          </p>
        </motion.div>

        {/* Skeleton loaders */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/5">
                <div className="shimmer h-48 bg-white/5" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-4 w-3/4 rounded-md bg-white/5" />
                  <div className="shimmer h-3 w-1/2 rounded-md bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* City cards grid */}
        {!loading && cities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {cities.map((city, i) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActive(city.id)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                  active === city.id
                    ? 'border-brand-600/60 shadow-gold scale-[1.02]'
                    : 'border-white/5 hover:border-brand-700/40 hover:shadow-gold hover:-translate-y-1'
                }`}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  {/* Fallback gradient */}
                  <div
                    className="w-full h-full hidden items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, hsl(${i * 55 + 30}, 30%, 18%), hsl(${i * 55 + 60}, 20%, 10%))`,
                    }}
                  >
                    <Building2 size={40} className="text-brand-600/40" />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                  {/* Project count badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-brand-600/80 backdrop-blur-sm border border-brand-500/50 text-xs font-bold text-white">
                    {city.projectCount} Projects
                  </div>

                  {/* Active indicator */}
                  {active === city.id && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-brand-500 text-xs font-bold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow inline-block" />
                      Selected
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 bg-gradient-to-b from-gray-900/80 to-gray-950">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                      {city.name}
                    </h3>
                    <ArrowRight
                      size={14}
                      className="text-gray-600 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <MapPin size={10} />
                    {city.state}
                  </div>
                  {city.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {city.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Selected city detail panel */}
        {!loading && active && (() => {
          const city = cities.find((c) => c.id === active)
          if (!city) return null
          return (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 glass border border-brand-800/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-brand-400" />
                  <span className="text-brand-400 text-sm font-semibold">{city.state}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">{city.name}</h3>
                <p className="text-gray-400 leading-relaxed">{city.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                <div className="glass rounded-2xl px-6 py-4 text-center border border-brand-800/30 min-w-[120px]">
                  <div className="text-3xl font-black text-brand-400">{city.projectCount}+</div>
                  <div className="text-xs text-gray-400 mt-1">Curated Projects</div>
                </div>
                <button
                  onClick={scrollToProjects}
                  className="btn-primary justify-center py-3 px-6 text-sm whitespace-nowrap"
                >
                  View Projects <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )
        })()}
      </div>
    </section>
  )
}
