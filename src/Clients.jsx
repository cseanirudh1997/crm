// ─────────────────────────────────────────────
//  DesignPartners — marquee of luxury brand partners
//  & design accolades (compositor-threaded animation)
// ─────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

const PARTNERS_ROW1 = [
  { name: 'Poliform',           tag: 'Italian Furniture'      },
  { name: 'Miele',              tag: 'Premium Appliances'     },
  { name: 'Häfele',             tag: 'Hardware & Fittings'    },
  { name: 'Minotti',            tag: 'Luxury Sofas'           },
  { name: 'Versace Home',       tag: 'Luxury Furnishings'     },
  { name: 'Armani Casa',        tag: 'Designer Collection'    },
  { name: 'Boffi',              tag: 'Premium Kitchens'       },
  { name: 'Flos',               tag: 'Architectural Lighting' },
  { name: 'Poliform',           tag: 'Italian Furniture'      },
  { name: 'Miele',              tag: 'Premium Appliances'     },
  { name: 'Häfele',             tag: 'Hardware & Fittings'    },
  { name: 'Minotti',            tag: 'Luxury Sofas'           },
]

const AWARDS_ROW2 = [
  { name: 'AD100 Studio 2025',      tag: 'Architectural Digest'    },
  { name: 'Elle Décor Award',       tag: 'Best Interior Studio'    },
  { name: 'India Design Awards',    tag: 'Residential Category'    },
  { name: 'CII Design Excellence',  tag: '2024 Winner'             },
  { name: 'Houzz Best of Design',   tag: '5 Consecutive Years'     },
  { name: 'FX International Award', tag: 'Residential Project'     },
  { name: 'CNBC Awaaz RE Award',    tag: 'Design Partner 2025'     },
  { name: 'AD100 Studio 2025',      tag: 'Architectural Digest'    },
  { name: 'Elle Décor Award',       tag: 'Best Interior Studio'    },
  { name: 'India Design Awards',    tag: 'Residential Category'    },
  { name: 'CII Design Excellence',  tag: '2024 Winner'             },
  { name: 'Houzz Best of Design',   tag: '5 Consecutive Years'     },
]

function MarqueeTrack({ items, direction = 'fwd' }) {
  const cls = direction === 'fwd' ? 'marquee-fwd' : 'marquee-rev'
  return (
    <div className="overflow-hidden">
      <div className={`flex gap-3 w-max ${cls}`}>
        {items.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-xl glass border border-white/8 hover:border-brand-700/40 transition-all duration-300 cursor-default"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-900/60 border border-brand-700/30 flex items-center justify-center">
              <Award size={12} className="text-brand-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-200 whitespace-nowrap">{item.name}</div>
              <div className="text-xs text-gray-500 whitespace-nowrap">{item.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DesignPartners() {
  return (
    <section className="py-14 relative overflow-hidden border-y border-white/5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
          Trusted by — premium brands · award-winning designs · global partners
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        <MarqueeTrack items={PARTNERS_ROW1} direction="fwd" />
        <MarqueeTrack items={AWARDS_ROW2}   direction="rev" />
      </div>
    </section>
  )
}
