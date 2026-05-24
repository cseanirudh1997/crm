import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, ArrowRight, Check, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidEmail } from './utils'

const ALERT_TYPES = [
  { id: 'price_drop',    label: 'Price Drops',         desc: 'Alerts when project prices reduce' },
  { id: 'new_launches',  label: 'New Launches',         desc: 'First access to upcoming projects'  },
  { id: 'insights',      label: 'Market Insights',      desc: 'Weekly appreciation & trend reports' },
  { id: 'possession',    label: 'Possession Updates',   desc: 'Ready-to-move inventory alerts'     },
]

export default function PropertyAlerts() {
  const [email,     setEmail]     = useState('')
  const [selected,  setSelected]  = useState(['new_launches', 'insights'])
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function toggleAlert(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.')
      return
    }
    if (selected.length === 0) {
      toast.error('Please select at least one alert type.')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1100))
    setLoading(false)
    setSubmitted(true)
    toast.success('Property alerts activated! 🎉')
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gray-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/20 to-transparent" />
      <div className="orb w-96 h-96 bg-brand-900 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto glass border border-brand-800/30 rounded-3xl p-8 sm:p-10 text-center shadow-gold"
        >
          <div className="w-14 h-14 rounded-2xl bg-brand-700/30 border border-brand-600/40 flex items-center justify-center mx-auto mb-5">
            <Bell size={24} className="text-brand-400" />
          </div>

          <span className="section-badge mb-4 mx-auto">Never Miss an Opportunity</span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 mb-3">
            Get Instant{' '}
            <span className="gradient-text">Property Alerts</span>
          </h2>

          <p className="text-gray-400 mb-6 leading-relaxed">
            Be the first to know about new launches, price drops, and investment opportunities
            across your preferred cities.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-4"
            >
              <div className="w-12 h-12 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mx-auto mb-3">
                <Check size={22} className="text-brand-400" />
              </div>
              <p className="text-white font-semibold mb-1">You're all set!</p>
              <p className="text-gray-400 text-sm">
                Property alerts are now active for <span className="text-white">{email}</span>.
                We'll notify you as soon as relevant opportunities are identified.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Alert type selectors */}
              <div className="grid grid-cols-2 gap-2 text-left">
                {ALERT_TYPES.map(({ id, label, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleAlert(id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                      selected.includes(id)
                        ? 'border-brand-600/60 bg-brand-950/40 text-white'
                        : 'border-white/8 bg-white/3 text-gray-400 hover:border-brand-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className={`w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected.includes(id) ? 'border-brand-500 bg-brand-500' : 'border-gray-600'
                      }`}>
                        {selected.includes(id) && <Check size={8} className="text-white" />}
                      </div>
                      <span className="text-xs font-semibold">{label}</span>
                    </div>
                    <div className="text-xs text-gray-600 pl-5">{desc}</div>
                  </button>
                ))}
              </div>

              {/* Email input + CTA */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field pl-9 text-sm"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary px-5 py-3 flex-shrink-0">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <ArrowRight size={16} />
                  }
                </button>
              </div>

              <p className="text-xs text-gray-600">
                No spam. Unsubscribe anytime. Your data is protected.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
