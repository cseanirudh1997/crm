// ─────────────────────────────────────────────
//  Certifications — professional credentials & badges
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, ExternalLink, ShieldCheck } from 'lucide-react'
import { fetchCertifications } from './api'

const ISSUER_COLORS = {
  'Amazon Web Services':          'from-orange-500/20 to-orange-700/5  border-orange-700/30',
  'Google Cloud':                 'from-blue-500/20   to-blue-700/5    border-blue-700/30',
  'Databricks':                   'from-red-500/20    to-red-700/5     border-red-700/30',
  'DeepLearning.AI (Coursera)':   'from-brand-500/20  to-brand-700/5   border-brand-700/30',
}

function CertCard({ cert, i }) {
  const colorClass = ISSUER_COLORS[cert.issuer] || 'from-brand-500/20 to-brand-700/5 border-brand-700/30'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.07 }}
      className={`group glass bg-gradient-to-br ${colorClass} border rounded-2xl p-5 card-glow hover:scale-[1.02] transition-transform duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <ShieldCheck size={18} className="text-brand-400" />
        </div>
        {cert.credentialUrl && cert.credentialUrl !== '#' && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-brand-400 transition-colors"
            aria-label="View credential"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-brand-200 transition-colors">{cert.title}</h3>
      <p className="text-xs text-brand-400 font-medium mb-0.5">{cert.issuer}</p>
      <p className="text-xs text-gray-600">{cert.date}</p>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="glass border border-white/5 rounded-2xl p-5 space-y-3">
      <div className="w-10 h-10 rounded-xl shimmer bg-white/5" />
      <div className="h-4 w-3/4 shimmer bg-white/5 rounded-full" />
      <div className="h-3 w-1/2 shimmer bg-white/5 rounded-full" />
    </div>
  )
}

export default function Certifications() {
  const [certs,   setCerts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertifications()
      .then((res) => setCerts(res?.certifications || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const featured = certs.filter((c) => c.featured === 'yes')
  const display  = featured.length > 0 ? featured : certs

  return (
    <section id="certifications" className="py-16 relative">
      <div className="section-wrapper">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-10">
          <span className="section-badge mb-4"><Award size={11} /> Certifications</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Verified <span className="gradient-text">Credentials</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Industry-recognized certifications across cloud ML platforms, data engineering, and deep learning.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : display.map((cert, i) => <CertCard key={cert.certId} cert={cert} i={i} />)
          }
        </div>
      </div>
    </section>
  )
}
