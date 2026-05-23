import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { isValidEmail } from './utils'

export default function Newsletter() {
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setLoading(true)
    // Simulate subscription (no dedicated backend endpoint)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
    toast.success('You\'re subscribed! Welcome to the NexusAI newsletter.')
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-gray-950 to-gray-950" />
      <div className="orb w-96 h-96 bg-brand-700 top-0 right-0 opacity-15" />
      <div className="orb w-64 h-64 bg-accent-700 bottom-0 left-0 opacity-10" />

      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-glow">
              <Mail size={28} className="text-white" />
            </div>
          </div>

          <span className="section-badge mb-4">Newsletter</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
            Stay Ahead with <span className="gradient-text">AI Insights</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Get weekly AI research summaries, product updates, and enterprise use cases
            delivered straight to your inbox. No spam — ever.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-600/40 flex items-center justify-center">
                <Check size={28} className="text-emerald-400" />
              </div>
              <p className="text-emerald-400 font-semibold text-lg">You're subscribed!</p>
              <p className="text-gray-400 text-sm">Thanks for joining. We'll be in touch soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="input-field flex-1"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-shrink-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subscribing...
                  </span>
                ) : (
                  <>Subscribe <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          )}

          <p className="text-gray-600 text-xs mt-4">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
