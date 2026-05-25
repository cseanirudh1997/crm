import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, MessageSquare, Send, Check, AlertCircle, Phone, MapPin, CalendarCheck, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContact, createSiteVisit } from './api'
import { isValidEmail } from './utils'
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS } from './config'
import { getSession } from './utils'

const CONTACT_METHODS = [
  { icon: Phone,  label: 'Concierge',  value: COMPANY_PHONE,   href: `tel:${COMPANY_PHONE}`      },
  { icon: Mail,   label: 'Email',      value: COMPANY_EMAIL,   href: `mailto:${COMPANY_EMAIL}`   },
  { icon: MapPin, label: 'Head Office',value: COMPANY_ADDRESS, href: '#'                         },
]

const TIME_SLOTS    = ['Morning (10AM–1PM)', 'Afternoon (2PM–5PM)', 'Evening (5PM–7PM)']
const BUDGET_RANGES = ['Under ₹1 Cr', '₹1–2 Cr', '₹2–5 Cr', '₹5–10 Cr', '₹10 Cr+']

function emptyForm(session) {
  return {
    name:          session?.username || '',
    email:         session?.email    || '',
    phone:         '',
    message:       '',
    budget:        '',
    projectName:   '',        // human-readable project name typed by user
    preferredDate: '',        // optional — leave blank is fine
    preferredTime: TIME_SLOTS[0],
  }
}

export default function Contact() {
  const session = getSession()
  const [activeTab,  setActiveTab]  = useState('consultation')
  const [form,       setForm]       = useState(() => emptyForm(session))
  const [loading,    setLoading]    = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState('')

  function handleChange(e) {
    setError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function validate() {
    const name  = form.name.trim()
    const email = form.email.trim()
    const phone = form.phone.trim()

    if (!name)               return 'Full name is required.'
    if (!phone)              return 'Phone number is required.'
    if (!email)              return 'Email address is required.'
    if (!isValidEmail(email)) return 'Please enter a valid email address.'
    if (activeTab === 'consultation' && !form.budget)
                             return 'Please select a budget range.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    setError('')

    try {
      let res
      if (activeTab === 'consultation') {
        res = await submitContact({
          name:    form.name.trim(),
          email:   form.email.trim(),
          phone:   form.phone.trim(),
          budget:  form.budget,
          message: form.message.trim(),
        })
      } else {
        res = await createSiteVisit({
          username:      session?.username || '',
          name:          form.name.trim(),
          email:         form.email.trim(),
          phone:         form.phone.trim(),
          projectId:     '',                       // no ID from contact form
          projectName:   form.projectName.trim(),
          preferredDate: form.preferredDate,       // optional
          preferredTime: form.preferredTime,
        })
      }

      if (res.success !== false) {
        setSubmitted(true)
        toast.success(activeTab === 'consultation'
          ? 'Request sent! Our concierge will call within 24 hours.'
          : 'Site visit booked! Expect an SMS confirmation shortly.')
      } else {
        setError(res.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Unable to submit. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setSubmitted(false)
    setForm(emptyForm(session))
    setError('')
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-gray-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/30 to-transparent" />
      <div className="orb w-80 h-80 bg-brand-800 top-10 right-10 opacity-10" />
      <div className="orb w-64 h-64 bg-accent-800 bottom-10 left-10 opacity-10" />

      <div className="section-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4">Get In Touch</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4 mb-4">
            Your Property Journey{' '}
            <span className="gradient-text">Begins Here</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-lg">
            Schedule a consultation with our investment advisors or book a premium site visit
            — we handle everything from here.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5"
          >
            {CONTACT_METHODS.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-start gap-4 glass border border-white/8 rounded-2xl p-5 hover:border-brand-700/40 hover:shadow-gold transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-700/30 border border-brand-700/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-sm text-white font-medium leading-relaxed">{value}</div>
                </div>
              </a>
            ))}

            {/* Trust indicators */}
            <div className="glass border border-white/5 rounded-2xl p-5 space-y-3">
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Why Choose EstateFlow</div>
              {[
                'Zero brokerage — direct builder pricing',
                'RERA-verified projects only',
                'Dedicated relationship manager',
                'End-to-end transaction support',
                'NRI-friendly documentation',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 glass border border-white/8 rounded-3xl overflow-hidden"
          >
            {/* Tab bar */}
            <div className="flex border-b border-white/10">
              <button
                type="button"
                onClick={() => { setActiveTab('consultation'); reset() }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'consultation'
                    ? 'text-brand-400 border-b-2 border-brand-500 bg-brand-950/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart size={15} /> Book Consultation
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('visit'); reset() }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'visit'
                    ? 'text-brand-400 border-b-2 border-brand-500 bg-brand-950/20'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CalendarCheck size={15} /> Schedule Site Visit
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mx-auto mb-4">
                      <Check size={28} className="text-brand-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {activeTab === 'consultation' ? 'Request Received!' : 'Visit Confirmed!'}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                      {activeTab === 'consultation'
                        ? 'Our property concierge will reach out within 24 hours to discuss your requirements in detail.'
                        : 'You\'ll receive an SMS with the visit details. Our team will arrange premium transport if needed.'}
                    </p>
                    <button type="button" onClick={reset} className="btn-ghost border border-white/10 hover:border-white/20">
                      Submit Another Request
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 border border-red-700/40 text-red-300 text-sm">
                        <AlertCircle size={15} className="flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    {/* Row 1 — Name + Phone */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1.5">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          <input
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            className="input-field pl-9 text-sm"
                            placeholder="Your name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1.5">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            className="input-field pl-9 text-sm"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2 — Email */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="input-field pl-9 text-sm"
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>

                    {/* Tab-specific fields */}
                    {activeTab === 'consultation' ? (
                      <>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1.5">
                            Budget Range <span className="text-red-400">*</span>
                          </label>
                          <select
                            name="budget"
                            value={form.budget}
                            onChange={handleChange}
                            className="input-field text-sm"
                          >
                            <option value="">Select your budget</option>
                            {BUDGET_RANGES.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1.5">Message <span className="text-gray-600">(optional)</span></label>
                          <div className="relative">
                            <MessageSquare size={14} className="absolute left-3 top-3 text-gray-500 pointer-events-none" />
                            <textarea
                              name="message"
                              value={form.message}
                              onChange={handleChange}
                              rows={3}
                              className="input-field pl-9 text-sm resize-none"
                              placeholder="Preferred cities, property type, timeline..."
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1.5">
                              Preferred Date <span className="text-gray-600">(optional)</span>
                            </label>
                            <input
                              name="preferredDate"
                              type="date"
                              value={form.preferredDate}
                              onChange={handleChange}
                              className="input-field text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Time Slot</label>
                            <select
                              name="preferredTime"
                              value={form.preferredTime}
                              onChange={handleChange}
                              className="input-field text-sm"
                            >
                              {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1.5">
                            Project of Interest <span className="text-gray-600">(optional)</span>
                          </label>
                          <input
                            name="projectName"
                            type="text"
                            value={form.projectName}
                            onChange={handleChange}
                            className="input-field text-sm"
                            placeholder="e.g. The Arbour, Lodha Park, or leave blank"
                          />
                        </div>
                      </>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-sm mt-2">
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : activeTab === 'consultation' ? (
                        <><Send size={16} /> Submit Request</>
                      ) : (
                        <><CalendarCheck size={16} /> Confirm Site Visit</>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
