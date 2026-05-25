// ─────────────────────────────────────────────
//  Modals — InterestLeadModal + SiteVisitModal
//  (Kept as named exports for backward compat;
//   ServiceRequestModal & SupportRequestModal
//   are aliased so existing imports don't break)
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, Loader, Heart, CalendarCheck, Phone, Mail, Shield, AlertCircle, User, MapPin, Clock, Star } from 'lucide-react'
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
   SiteVisitModal — book a luxury site visit
   ════════════════════════════════════════════ */
const VISIT_TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

export function SiteVisitModal({ session, project, onClose }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    customerName:  session?.username || '',
    email:         session?.email   || '',
    phone:         '',
    preferredDate: '',
    preferredTime: VISIT_TIMES[1],   // 10:00 AM default
    notes:         '',
  })
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(null)
  const [formError, setFormError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const customerName = form.customerName.trim()
    const phone        = form.phone.trim()
    const email        = form.email.trim()

    if (!customerName)               { setFormError('Full name is required.'); return }
    if (!phone)                      { setFormError('Phone number is required.'); return }
    if (!email)                      { setFormError('Email address is required.'); return }
    if (!isValidEmail(email))        { setFormError('Please enter a valid email address.'); return }
    if (!form.preferredDate)         { setFormError('Please select your preferred visit date.'); return }

    setFormError('')
    setLoading(true)
    try {
      const res = await createSiteVisit({
        username:      session?.username || '',
        projectId:     project?.id   || '',
        propertyId:    '',
        customerName,
        phone,
        email,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        notes:         form.notes.trim(),
      })
      setSuccess(res.message || 'Your luxury property visit has been scheduled successfully. Our property advisor will contact you shortly.')
      toast.success('Private viewing confirmed! Our concierge will reach out soon.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Success state — stays visible until user dismisses ── */
  if (success) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.92, y: 24  }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="w-full max-w-md bg-gray-900 border border-brand-700/30 rounded-3xl shadow-glass overflow-hidden"
          >
            {/* Gold gradient header bar */}
            <div className="h-1.5 bg-gradient-to-r from-brand-600 via-amber-400 to-brand-600" />
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center mx-auto mb-5">
                <Star size={34} className="text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Private Viewing Confirmed</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto mb-6">{success}</p>

              {/* Booking summary */}
              <div className="text-left bg-white/5 border border-white/8 rounded-2xl p-4 mb-6 space-y-2.5">
                {project && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <MapPin size={14} className="text-brand-400 shrink-0" />
                    <span className="text-gray-300">{project.name}{project.city ? ` · ${project.city}` : ''}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm">
                  <CalendarCheck size={14} className="text-brand-400 shrink-0" />
                  <span className="text-gray-300">{form.preferredDate}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Clock size={14} className="text-brand-400 shrink-0" />
                  <span className="text-gray-300">{form.preferredTime}</span>
                </div>
              </div>

              <button onClick={onClose} className="btn-primary w-full justify-center">Close</button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{   opacity: 0, y: 40, scale: 0.96  }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-3xl shadow-glass overflow-hidden"
        >
          {/* Gold gradient accent bar */}
          <div className="h-1 bg-gradient-to-r from-brand-600 via-amber-400 to-brand-600" />

          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-white/8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={13} className="text-brand-400" />
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">Private Viewing</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {project ? project.name : 'Schedule Site Visit'}
              </h2>
              {project && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {[project.builder, project.city, project.startingPrice].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors ml-4 shrink-0 mt-1">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-7 py-5 space-y-5">
            {formError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/20 border border-red-700/40 text-red-300 text-sm">
                <AlertCircle size={14} className="flex-shrink-0" />
                {formError}
              </div>
            )}

            {/* ── Personal Details ── */}
            <div>
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">Personal Details</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      <input
                        value={form.customerName}
                        onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, customerName: e.target.value })) }}
                        className="input-field text-sm pl-8"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Phone <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, phone: e.target.value })) }}
                        className="input-field text-sm pl-8"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, email: e.target.value })) }}
                      className="input-field text-sm pl-8"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Appointment Details ── */}
            <div>
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-3">Appointment Details</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Visit Date <span className="text-red-400">*</span></label>
                    <input
                      type="date"
                      min={today}
                      value={form.preferredDate}
                      onChange={(e) => { setFormError(''); setForm((f) => ({ ...f, preferredDate: e.target.value })) }}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Preferred Time</label>
                    <div className="relative">
                      <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      <select
                        value={form.preferredTime}
                        onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))}
                        className="input-field text-sm pl-8"
                      >
                        {VISIT_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Notes <span className="text-gray-600">(optional)</span></label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={2}
                    className="input-field text-sm resize-none"
                    placeholder="Specific unit preference, accessibility needs, transport required…"
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
              {loading
                ? <><Loader size={15} className="animate-spin" /> Confirming…</>
                : <><CalendarCheck size={15} /> Confirm Private Viewing</>
              }
            </button>

            <p className="text-center text-xs text-gray-600 -mt-1">
              Our concierge will confirm your appointment within 2 hours.
            </p>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Backward-compat aliases (used by TrialDashboard) ── */
export const ServiceRequestModal = InterestLeadModal
export const SupportRequestModal  = SiteVisitModal
