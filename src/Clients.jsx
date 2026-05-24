import { motion } from 'framer-motion'

const BUILDERS = [
  { name: 'DLF',          abbr: 'DLF', color: 'from-blue-600 to-blue-800',     tagline: 'India\'s Largest Real Estate Co.' },
  { name: 'Sobha',        abbr: 'SB',  color: 'from-emerald-600 to-emerald-800', tagline: 'Bengaluru\'s Finest Builder'     },
  { name: 'Lodha',        abbr: 'LH',  color: 'from-teal-600 to-teal-800',     tagline: 'World\'s No.1 Premium Developer'  },
  { name: 'Prestige',     abbr: 'PR',  color: 'from-rose-600 to-rose-800',     tagline: 'South India\'s Iconic Builders'  },
  { name: 'Smartworld',   abbr: 'SW',  color: 'from-brand-600 to-brand-800',   tagline: 'Gurugram Ultra-Luxury'           },
  { name: 'ATS',          abbr: 'ATS', color: 'from-amber-600 to-amber-800',   tagline: 'Noida\'s Premium Developer'      },
  { name: 'My Home Group',abbr: 'MH',  color: 'from-sky-600 to-sky-800',       tagline: 'Hyderabad Mega-Projects'         },
  { name: 'Godrej',       abbr: 'GR',  color: 'from-orange-600 to-orange-800', tagline: 'Trusted Since 1897'              },
  { name: 'Mahindra',     abbr: 'ML',  color: 'from-indigo-600 to-indigo-800', tagline: 'The Right Kind of Life'          },
  { name: 'Brigade',      abbr: 'BG',  color: 'from-cyan-600 to-cyan-800',     tagline: 'South India\'s Trusted Brand'    },
  { name: 'Puravankara',  abbr: 'PV',  color: 'from-fuchsia-600 to-fuchsia-800', tagline: 'Built on Trust Since 1975'    },
  { name: 'Shapoorji',    abbr: 'SP',  color: 'from-lime-600 to-lime-800',     tagline: 'Real Estate Conglomerate'        },
]

export default function BuilderPartners() {
  const doubled = [...BUILDERS, ...BUILDERS]

  return (
    <section className="py-16 relative overflow-hidden bg-gray-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/20 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/20 to-transparent" />

      <div className="section-wrapper mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-2">
            Partnered with India's most respected builders
          </p>
          <h2 className="text-2xl font-bold text-white">
            Trusted by <span className="gradient-text">25+ Premium Developers</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee row 1 */}
      <div className="relative">
        <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
            className="flex gap-5 flex-shrink-0"
          >
            {doubled.map((b, i) => (
              <div
                key={`${b.name}-${i}`}
                className="flex-shrink-0 flex items-center gap-3 glass border border-white/8 rounded-xl px-5 py-3 hover:border-brand-700/30 transition-all duration-300 group"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${b.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                  {b.abbr}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors whitespace-nowrap">{b.name}</div>
                  <div className="text-xs text-gray-600 whitespace-nowrap">{b.tagline}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Marquee row 2 — reversed */}
      <div className="relative mt-4">
        <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            className="flex gap-5 flex-shrink-0"
          >
            {[...doubled].reverse().map((b, i) => (
              <div
                key={`rev-${b.name}-${i}`}
                className="flex-shrink-0 flex items-center gap-3 glass border border-white/8 rounded-xl px-5 py-3 hover:border-brand-700/30 transition-all duration-300 group"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${b.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                  {b.abbr}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors whitespace-nowrap">{b.name}</div>
                  <div className="text-xs text-gray-600 whitespace-nowrap">{b.tagline}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
