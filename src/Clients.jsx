// ─────────────────────────────────────────────
//  AICredentials — marquee of tech companies, certifications
//  & AI achievements (compositor-threaded animation)
// ─────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

const COMPANIES_ROW1 = [
  { name: 'Walmart Global Tech',  tag: 'Senior Data Scientist'      },
  { name: 'AWS',                   tag: 'ML Specialty Certified'      },
  { name: 'Google Cloud',          tag: 'Data Engineer Certified'     },
  { name: 'Databricks',            tag: 'Data Engineer Certified'     },
  { name: 'DeepLearning.AI',       tag: 'Deep Learning Specialization'},
  { name: 'Flipkart',              tag: 'Enterprise AI Consulting'    },
  { name: 'KDD 2025',              tag: 'Published Research'          },
  { name: 'Forbes India',          tag: 'Featured Expert'             },
  { name: 'Walmart Global Tech',  tag: 'Senior Data Scientist'       },
  { name: 'AWS',                   tag: 'ML Specialty Certified'      },
  { name: 'Google Cloud',          tag: 'Data Engineer Certified'     },
  { name: 'Databricks',            tag: 'Data Engineer Certified'     },
]

const ACHIEVEMENTS_ROW2 = [
  { name: '$42M GMV Impact',             tag: 'Pricing AI System'          },
  { name: '1,300+ Newsletter Readers',   tag: '68% Open Rate'              },
  { name: 'DataHack Summit Speaker',     tag: 'AI & ML Track 2026'         },
  { name: '50+ Mentees',                 tag: 'FAANG & Unicorn Placements'  },
  { name: '8 Enterprise AI Deployments', tag: 'Production ML Systems'      },
  { name: 'arXiv & KDD Publications',    tag: 'Peer-Reviewed Research'     },
  { name: 'NeurIPS Industry Track',      tag: 'Responsible AI Talk'        },
  { name: '$42M GMV Impact',             tag: 'Pricing AI System'          },
  { name: '1,300+ Newsletter Readers',   tag: '68% Open Rate'              },
  { name: 'DataHack Summit Speaker',     tag: 'AI & ML Track 2026'         },
  { name: '50+ Mentees',                 tag: 'FAANG & Unicorn Placements' },
  { name: '8 Enterprise AI Deployments', tag: 'Production ML Systems'      },
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
              <Zap size={12} className="text-brand-400" />
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

export default function AICredentials() {
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
          Trusted by — enterprise clients · certified credentials · published research · speaking circuit
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        <MarqueeTrack items={COMPANIES_ROW1}     direction="fwd" />
        <MarqueeTrack items={ACHIEVEMENTS_ROW2}  direction="rev" />
      </div>
    </section>
  )
}
