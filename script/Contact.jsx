import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Building2, User, MessageSquare, Send, Check, AlertCircle, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { submitContact } from './api'
import { isValidEmail } from './utils'
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS } from './config'

const CONTACT_METHODS = [
  { icon: Mail,    label: 'Email',   value: COMPANY_EMAIL,   href: `mailto:${COMPANY_EMAIL}`   },
  { icon: Phone,   label: 'Phone',   value: COMPANY_PHONE,   href: `tel:${COMPANY_PHONE}`      },
  { icon: MapPin,  label: 'Office',  value: COMPANY_ADDRESS, href: '#'                         },
]

export default function Contact() {
  const [form,      setForm]      = useState({ name: '', company: '', email: '', message: '' })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  function handleChange(e) {
    setError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { name, company, email, message } = form

    if (!name || !email || !message) {
      setError('Please fill in name, email, and message.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await submitContact({ name, company, email, message })
      if (res.success !== false) {
        setSubmitted(true)
        toast.success('Message sent! We\'ll get back to you within 24 hours.')
      } else {
        setError(res.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Unable to send. Please try again or email us directly.')
      toast.error('Could not send message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-gray-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/40 to-transparent" />
      <div className="orb w-80 h-80 bg-brand-800 top-10 right-10 opacity-10" />
      <div className="orb w-64 h-64 bg-accent-800 bottom-10 left-10 opacity-10" />

      <div className="section-wrapper">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-4">Contact Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Let's <span className="gradient-text">Start a Conversation</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-lg">
            Ready to transform your business with AI? Our team responds within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {CONTACT_METHODS.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="glass border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-900/60 border border-brand-700/40 flex items-center justify-center flex-shrink-0 group-hover:shadow-glow-sm transition-all">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-sm text-gray-200 leading-relaxed">{value}</div>
                </div>
              </a>
            ))}

            {/* Extra note */}
            <div className="glass rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-brand-900/20 to-transparent">
              <p className="text-sm text-gray-400 leading-relaxed">
                For enterprise inquiries, our solutions team can prepare a customised demo
                and ROI analysis for your specific industry and use case.
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass border border-emerald-700/40 rounded-3xl p-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-600/20 border-2 border-emerald-600/40 flex items-center justify-center mb-6">
                  <Check size={36} className="text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Received!</h3>
                <p className="text-gray-400 mb-6">
                  Thank you for reaching out. We'll get back to you at <span className="text-white">{form.email}</span> within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name:'', company:'', email:'', message:'' }) }}
                  className="btn-secondary"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <div className="glass border border-white/10 rounded-3xl p-8">
                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        <User size={13} className="inline mr-1 text-brand-400" />
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jane Smith"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        <Building2 size={13} className="inline mr-1 text-brand-400" />
                        Company
                      </label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Acme Inc."
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      <Mail size={13} className="inline mr-1 text-brand-400" />
                      Work Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      <MessageSquare size={13} className="inline mr-1 text-brand-400" />
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project, goals, and timeline…"
                      rows={5}
                      className="input-field resize-none"
                      required
                    />
                    <div className="text-xs text-gray-600 text-right mt-1">
                      {form.message.length} / 1000
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center py-3.5 text-base"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <><Send size={17} /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
