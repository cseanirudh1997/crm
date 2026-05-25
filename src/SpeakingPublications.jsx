// ─────────────────────────────────────────────
//  SpeakingPublications — speaking events + publications
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, BookOpen, ExternalLink, Calendar, MapPin, Star } from 'lucide-react'
import { fetchSpeakingEvents, fetchPublications } from './api'

/* ── Speaking event card ── */
function EventCard({ event, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.07 }}
      className="group glass border border-white/8 rounded-2xl p-5 hover:border-brand-700/40 hover:scale-[1.01] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {event.featured === 'yes' && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 flex items-center gap-1">
              <Star size={9} /> Featured
            </span>
          )}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
            {event.type || 'Talk'}
          </span>
        </div>
        {event.slidesUrl && event.slidesUrl !== '#' && (
          <a href={event.slidesUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-400 transition-colors shrink-0">
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-brand-200 transition-colors">{event.title}</h3>
      <p className="text-xs text-brand-400 font-semibold mb-2">{event.conference}</p>

      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
        {event.date && (
          <span className="flex items-center gap-1">
            <Calendar size={10} /> {event.date}
          </span>
        )}
        {event.location && (
          <span className="flex items-center gap-1">
            <MapPin size={10} /> {event.location}
          </span>
        )}
      </div>
    </motion.div>
  )
}

/* ── Publication card ── */
function PubCard({ pub, i }) {
  const TYPE_COLORS = {
    'Research Paper': 'bg-blue-500/20 border-blue-500/40 text-blue-300',
    'Article':        'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    'Newsletter':     'bg-brand-500/20 border-brand-500/40 text-brand-300',
  }
  const colorCls = TYPE_COLORS[pub.type] || 'bg-white/5 border-white/10 text-gray-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.07 }}
      className="group glass border border-white/8 rounded-2xl p-5 hover:border-accent-700/40 hover:scale-[1.01] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colorCls}`}>
          {pub.type || 'Article'}
        </span>
        {pub.url && pub.url !== '#' && (
          <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-accent-400 transition-colors shrink-0">
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-accent-200 transition-colors">{pub.title}</h3>
      <p className="text-xs text-accent-400 font-semibold mb-2">{pub.venue}</p>

      {pub.abstract && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{pub.abstract}</p>
      )}

      {pub.date && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
          <Calendar size={10} /> {pub.date}
        </div>
      )}
    </motion.div>
  )
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl p-5 space-y-3">
      <div className="h-4 w-1/3 shimmer bg-white/5 rounded-full" />
      <div className="h-4 w-3/4 shimmer bg-white/5 rounded-full" />
      <div className="h-3 w-1/2 shimmer bg-white/5 rounded-full" />
    </div>
  )
}

export default function SpeakingPublications() {
  const [events,   setEvents]   = useState([])
  const [pubs,     setPubs]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [activeTab, setActiveTab] = useState('publications')

  useEffect(() => {
    Promise.all([fetchSpeakingEvents(), fetchPublications()])
      .then(([eRes, pRes]) => {
        setEvents(eRes?.events       || [])
        setPubs(  pRes?.publications || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featuredEvents = events.filter(e => e.featured === 'yes')
  const displayEvents  = featuredEvents.length > 0 ? featuredEvents : events

  const featuredPubs   = pubs.filter(p => p.featured === 'yes')
  const displayPubs    = featuredPubs.length > 0 ? featuredPubs : pubs

  const TABS = [
    { id: 'speaking',     label: 'Speaking',     icon: Mic,      count: displayEvents.length },
    { id: 'publications', label: 'Publications',  icon: BookOpen, count: displayPubs.length   },
  ]

  return (
    <section id="publications" className="py-16 relative">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="section-badge mb-4"><Mic size={11} /> Thought Leadership</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Speaking &amp; <span className="gradient-text">Publications</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Global conference keynotes, peer-reviewed research, and practitioner articles on GenAI systems,
            pricing AI, and production ML.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1 p-1 rounded-xl glass border border-white/8">
            {TABS.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-brand-600/30 border border-brand-600/40 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={13} />
                {label}
                {!loading && count > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-gray-400">{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Speaking events grid */}
        {activeTab === 'speaking' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {loading
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : displayEvents.map((e, i) => <EventCard key={e.eventId || i} event={e} i={i} />)
            }
          </div>
        )}

        {/* Publications grid */}
        {activeTab === 'publications' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {loading
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : displayPubs.map((p, i) => <PubCard key={p.pubId || i} pub={p} i={i} />)
            }
          </div>
        )}
      </div>
    </section>
  )
}
