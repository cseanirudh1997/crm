import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { CalendarCheck, Phone, Mail, MapPin, Send, Loader2, Palette, Clock, CheckCircle } from 'lucide-react'
import { submitContact } from './api'
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS } from './config'

const SERVICES = [
  'Full Home Interior',
  'Luxury Modular Kitchen',
  'Living Room Design',
  '3D Visualization',
  'Luxury Bedroom Design',
  'Commercial Interior Design',
  'Other / Custom Project',
]

const WHYUS = [
  { icon: Clock,    label: '24-hour response guarantee' },
  { icon: CheckCircle, label: 'Free initial consultation' },
  { icon: Palette,  label: 'Bespoke design — no templates' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  function update(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSending(true)
    try {
      const res = await submitContact(form)
      if (res?.success !== false) {
        setDone(true)
        toast.success('Consultation request received! We\'ll contact you within 24 hours.')
      } else {
        toast.error(res?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Unable to submit. Please email us directly at ' + COMPANY_EMAIL)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="consult" className="py-20 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="orb w-96 h-96 bg-brand-900 -bottom-10 -left-20 opacity-8" />
      <div className="section-wrapper relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-badge mb-4"><CalendarCheck size={11} /> Book Consultation</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Begin Your <span className="gradient-text">Design Journey</span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            Tell us about your space and vision. Our senior designer will contact you within 24 hours to schedule a complimentary consultation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Left info panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-2 space-y-6">
            <div className="glass border border-brand-700/20 rounded-2xl p-6 bg-gradient-to-br from-brand-950/40 to-transparent">
              <h3 className="font-display text-xl font-bold text-white mb-2">Why Consult With Us?</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">12 years of luxury interior design. 500+ completed projects. 98% client satisfaction rate.</p>
              <div className="space-y-3">
                {WHYUS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-900/60 border border-brand-700/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-brand-400" />
                    </div>
                    <span className="text-sm text-gray-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: Phone, label: COMPANY_PHONE, href: `tel:${COMPANY_PHONE}` },
                { icon: Mail, label: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}` },
                { icon: MapPin, label: COMPANY_ADDRESS, href: null },
              ].map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-start gap-3 glass border border-white/5 rounded-xl p-3.5">
                  <Icon size={15} className="text-brand-400 mt-0.5 flex-shrink-0" />
                  {href ? (
                    <a href={href} className="text-sm text-gray-300 hover:text-brand-300 transition-colors">{label}</a>
                  ) : (
                    <span className="text-sm text-gray-400">{label}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="lg:col-span-3">
            {done ? (
              <div className="glass border border-emerald-700/30 rounded-2xl p-10 text-center bg-emerald-950/20">
                <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-white mb-2">Consultation Request Received!</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Thank you, {form.name}! Our senior designer will contact you within 24 hours to schedule your complimentary consultation.
                </p>
                <button onClick={() => { setDone(false); setForm({ name: '', email: '', phone: '', service: '', message: '' }) }} className="btn-secondary">
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass border border-white/8 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Full Name *</label>
                    <input name="name" value={form.name} onChange={update} placeholder="Priya Sharma" required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={update} placeholder="+91 98765 43210" required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={update} placeholder="priya@example.com" required className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Service Interest</label>
                  <select name="service" value={form.service} onChange={update} className="input-field">
                    <option value="">Select a service...</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Tell us about your space</label>
                  <textarea name="message" value={form.message} onChange={update} rows={4} placeholder="Describe your space, style preferences, approximate area, timeline, and any specific requirements..." className="input-field resize-none" />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-4">
                  {sending ? (<><Loader2 size={16} className="animate-spin" /> Submitting...</>) : (<><Send size={16} /> Book Free Consultation</>)}
                </button>
                <p className="text-xs text-gray-600 text-center">We respond within 24 hours · No spam · No commitment required</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
