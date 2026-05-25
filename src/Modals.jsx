// ─────────────────────────────────────────────
//  Modals — InterestLeadModal + SiteVisitModal
//  (Kept as named exports for backward compat;
//   ServiceRequestModal & SupportRequestModal
//   are aliased so existing imports don't break)
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, Loader, Heart, CalendarCheck, Phone, Mail, Shield, AlertCircle } from 'lucide-react'
import { createInterestLead, createSiteVisit } from './api'
import { isValidEmail } from './utils'
import toast from 'react-hot-toast'

/* ── Shared modal shell ── */
function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{   opacity: 0, y: 40, scale: 0.96  }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-lg glass-dark border border-white/10 rounded-2xl shadow-glass overflow-hidden"
        >
          <div className="flex items-start justify-between p-5 border-b border-white/10 bg-gradient-to-r from-brand-950/60 to-gray-900/40">
            <div>
              <h2 className="text-base font-semibold text-white">{title}</h2>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors ml-4 shrink-0">
              <X size={18} />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Success state ── */
function SuccessState({ message, onClose }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
        <Shield size={28} className="text-brand-400" />
      </div>
      <div>
        <p className="font-semibold text-white mb-1">All Done!</p>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{message}</p>
      </div>
      <button onClick={onClose} className="btn-primary mt-2">Close</button>
    </div>
  )
}

/* ════════════════════════════════════════════
   InterestLeadModal — register buyer interest
   ════════════════════════════════════════════ */
export function InterestLeadModal({ session, project, onClose }) {
  const [form, setForm] = useState({
    name:    session?.username || '',
    email:   session?.email   || '',
    phone:   '',
    budget:  '',
    message: '',
  })
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(null)
  const [formError, setFormError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const name  = form.name.trim()
    const phone = form.phone.trim()
    const email = form.email.trim()
    if (!name)  { setFormError('Full name is required.'); return }
    if (!phone) { setFormError('Phone number is required.'); return }
    if (email && !isValidEmail(email)) { setFormError('Please enter a valid email address.'); return }

    setFormError('')
    setLoading(true)
    try {
      const res = await createInterestLead({
        username:    session?.username || '',
        name,
        email,
        phone,
        projectId:   project?.id   || '',
        projectName: project?.name || '',
        budget:      form.budget,
        message:     form.message.trim(),
      })
      setSuccess(res.message || 'Your interest has been registered. A relationship manager will call within 24 hours.')
      toast.success('Interest registered! We\'ll call you shortly.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell
      title={project ? `I'm Interested — ${project.name}` : 'Register Interest'}
      subtitle={project ? `${project.builder} · ${project.city} · ${project.startingPrice}` : 'Our team will reach out within 24 hours.'}
      onClose={onClose}
    >
      {success ? (
        <SuccessState message={success} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 border border-red-700/40 text-red-300 text-sm">
              <AlertCircle size={14} className="flex-shrink-0" />
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
              <input value={form.name} onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, name: e.target.value })) }} className="input-field text-sm" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Phone <span className="text-red-400">*</span></label>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="tel" value={form.phone} onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, phone: e.target.value })) }} className="input-field text-sm pl-8" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email <span className="text-gray-600">(optional)</span></label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" value={form.email} onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, email: e.target.value })) }} className="input-field text-sm pl-8" placeholder="you@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Budget Range</label>
            <select value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} className="input-field text-sm">
              <option value="">Select budget</option>
              {['Under ₹1 Cr', '₹1–2 Cr', '₹2–5 Cr', '₹5–10 Cr', '₹10 Cr+'].map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Message <span className="text-gray-600">(optional)</span></label>
            <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={3} className="input-field text-sm resize-none" placeholder="Any specific requirements, preferred floor, facing…" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading
              ? <><Loader size={15} className="animate-spin" /> Submitting…</>
              : <><Heart size={15} /> Register My Interest</>
            }
          </button>
        </form>
      )}
    </ModalShell>
  )
}

/* ════════════════════════════════════════════
   SiteVisitModal — book a site visit
   ════════════════════════════════════════════ */
const TIME_SLOTS_VISIT = ['Morning (10AM–1PM)', 'Afternoon (2PM–5PM)', 'Evening (5PM–7PM)']

export function SiteVisitModal({ session, project, onClose }) {
  const [form, setForm] = useState({
    name:          session?.username || '',
    email:         session?.email   || '',
    phone:         '',
    preferredDate: '',           // optional
    preferredTime: TIME_SLOTS_VISIT[0],
  })
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(null)
  const [formError, setFormError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const name  = form.name.trim()
    const phone = form.phone.trim()
    const email = form.email.trim()
    if (!name)  { setFormError('Full name is required.'); return }
    if (!phone) { setFormError('Phone number is required.'); return }
    if (email && !isValidEmail(email)) { setFormError('Please enter a valid email address.'); return }

    setFormError('')
    setLoading(true)
    try {
      const res = await createSiteVisit({
        username:      session?.username || '',
        name,
        email,
        phone,
        projectId:     project?.id   || '',
        projectName:   project?.name || '',
        preferredDate: form.preferredDate,    // empty string is fine
        preferredTime: form.preferredTime,
      })
      setSuccess(res.message || 'Site visit confirmed! You\'ll receive an SMS confirmation with visit details.')
      toast.success('Site visit booked! Confirmation SMS on its way.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell
      title={project ? `Schedule Visit — ${project.name}` : 'Book Site Visit'}
      subtitle={project ? `${project.builder} · ${project.city}` : 'Our concierge will confirm within 4 hours.'}
      onClose={onClose}
    >
      {success ? (
        <SuccessState message={success} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 border border-red-700/40 text-red-300 text-sm">
              <AlertCircle size={14} className="flex-shrink-0" />
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
              <input value={form.name} onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, name: e.target.value })) }} className="input-field text-sm" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Phone <span className="text-red-400">*</span></label>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="tel" value={form.phone} onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, phone: e.target.value })) }} className="input-field text-sm pl-8" placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email <span className="text-gray-600">(optional)</span></label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" value={form.email} onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, email: e.target.value })) }} className="input-field text-sm pl-8" placeholder="you@email.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Preferred Date <span className="text-gray-600">(optional)</span>
              </label>
              <input
                type="date"
                value={form.preferredDate}
                onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Time Slot</label>
              <select
                value={form.preferredTime}
                onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
                className="input-field text-sm"
              >
                {TIME_SLOTS_VISIT.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-600">Premium transport can be arranged — let us know if needed.</p>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading
              ? <><Loader size={15} className="animate-spin" /> Submitting…</>
              : <><CalendarCheck size={15} /> Confirm Site Visit</>
            }
          </button>
        </form>
      )}
    </ModalShell>
  )
}

/* ── Backward-compat aliases (used by TrialDashboard) ── */
export const ServiceRequestModal = InterestLeadModal
export const SupportRequestModal  = SiteVisitModal
