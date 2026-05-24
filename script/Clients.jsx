import { motion } from 'framer-motion'

const CLIENTS = [
  { name: 'RetailMega',   abbr: 'RM',  color: 'from-blue-600 to-blue-800'    },
  { name: 'FinEdge',      abbr: 'FE',  color: 'from-emerald-600 to-emerald-800' },
  { name: 'GlobalLogix',  abbr: 'GL',  color: 'from-teal-600 to-teal-800'    },
  { name: 'HealthFirst',  abbr: 'HF',  color: 'from-rose-600 to-rose-800'    },
  { name: 'Luxera',       abbr: 'LX',  color: 'from-violet-600 to-violet-800' },
  { name: 'UrbanRetail',  abbr: 'UR',  color: 'from-amber-600 to-amber-800'  },
  { name: 'PharmaCore',   abbr: 'PC',  color: 'from-sky-600 to-sky-800'      },
  { name: 'MegaFood Co.', abbr: 'MF',  color: 'from-orange-600 to-orange-800' },
  { name: 'TechBridge',   abbr: 'TB',  color: 'from-indigo-600 to-indigo-800' },
  { name: 'SwiftAuto',    abbr: 'SA',  color: 'from-cyan-600 to-cyan-800'    },
  { name: 'DataForge',    abbr: 'DF',  color: 'from-fuchsia-600 to-fuchsia-800' },
  { name: 'PeakInsurance',abbr: 'PI',  color: 'from-lime-600 to-lime-800'    },
]

export default function Clients() {
  // Duplicate for seamless infinite scroll
  const doubled = [...CLIENTS, ...CLIENTS]

  return (
    <section className="py-16 relative overflow-hidden bg-gray-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="section-wrapper mb-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-2">
            Trusted by industry leaders worldwide
          </p>
          <h2 className="text-2xl font-bold text-white">
            Powering <span className="gradient-text">500+ Enterprises</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            className="flex gap-6 flex-shrink-0"
          >
            {doubled.map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                className="flex-shrink-0 flex items-center gap-3 glass border border-white/10 rounded-xl px-5 py-3 hover:border-white/20 transition-all duration-300 group"
              >
                {/* Logo placeholder circle */}
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${client.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                  {client.abbr}
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">
                  {client.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Second row — reversed */}
      <div className="relative mt-4">
        <div className="absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            animate={{ x: ['-50%', '0%'] }}
            transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
            className="flex gap-6 flex-shrink-0"
          >
            {[...doubled].reverse().map((client, i) => (
              <div
                key={`rev-${client.name}-${i}`}
                className="flex-shrink-0 flex items-center gap-3 glass border border-white/10 rounded-xl px-5 py-3 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${client.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                  {client.abbr}
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors whitespace-nowrap">
                  {client.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
