import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, Sparkles, Loader2, CheckCircle } from 'lucide-react'
import { subscribeNewsletter } from './api'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email address.'); return }
    setSending(true)
    try {
      const res = await subscribeNewsletter({ email, name })
      if (res?.success !== false) {
        setDone(true)
        toast.success('You\'re on the list! Welcome to Maison.')
      } else {
        toast.error(res?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Unable to subscribe. Please try again shortly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-brand-800 -top-20 left-1/2 -translate-x-1/2 opacity-10" />
      <div className="section-wrapper relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto text-center">
          <span className="section-badge mb-4 mx-auto"><Sparkles size={11} /> Design Newsletter</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Curated Design <span className="gradient-text">Inspiration</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Join 12,000+ design enthusiasts receiving our weekly curation of luxury interior trends, transformation stories, and exclusive Maison studio updates.
          </p>

          {done ? (
            <div className="glass border border-emerald-700/30 rounded-2xl p-8 bg-emerald-950/20">
              <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">You're on the list!</p>
              <p className="text-gray-400 text-sm">Welcome to Maison. Expect curated luxury design inspiration in your inbox every week.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass border border-white/8 rounded-2xl p-6 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="input-field" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="input-field" />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3.5">
                {sending ? (<><Loader2 size={15} className="animate-spin" /> Subscribing...</>) : (<><Mail size={15} /> Subscribe to Design Inspiration</>)}
              </button>
              <p className="text-xs text-gray-600">Weekly sends · No spam · Unsubscribe anytime</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
