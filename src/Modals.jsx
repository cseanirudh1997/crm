// ─────────────────────────────────────────────
//  Modals — ConsultationBookingModal
//  + backward-compat aliases for dashboard imports
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { X, CalendarCheck, Loader2, CheckCircle, Send } from 'lucide-react'
import { createBookingRequest } from './api'
import { getSession } from './utils'

const SERVICES = [
  'Full Home Interior',
  'Luxury Modular Kitchen',
  'Living Room Design',
  '3D Visualization',
  'Luxury Bedroom Design',
  'Commercial Interior Design',
  'Design Consultation Only',
  'Other',
]

export default function ConsultationBookingModal({ project, service: preService, onClose }) {
  const session = getSession()
  const [form, setForm] = useState({
    name:          session?.username || '',
    email:         session?.email || '',
    phone:         session?.phone || '',
    serviceId:     preService || (project?.title ? project.title : ''),
    preferredDate: '',
    preferredTime: '',
    notes:         project ? `Interested in: ${project.title}` : '',
  })
  const [sending, setSending] = useState(false)
  const [done,    setDone]    = useState(false)

  function update(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) { toast.error('Please fill in all required fields.'); return }
    setSending(true)
    try {
      const res = await createBookingRequest({ ...form, username: session?.username })
      if (res?.success !== false) {
        setDone(true)
        toast.success('Consultation booked! We\'ll confirm within 24 hours.')
      } else {
        toast.error(res?.message || 'Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Unable to submit. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 modal-backdrop bg-black/70" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.div
          className="relative w-full max-w-lg max-h-[90vh] bg-gray-950 border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-glass flex flex-col overflow-hidden"
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center">
                <CalendarCheck size={15} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Book a Design Consultation</h3>
                {project && <p className="text-xs text-brand-400">{project.title}</p>}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {done ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
                <h4 className="font-bold text-white text-lg mb-2">Consultation Booked!</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  Thank you, {form.name}! Our senior designer will contact you within 24 hours to confirm your consultation details.
                </p>
                <button onClick={onClose} className="btn-primary">Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Full Name *</label>
                    <input name="name" value={form.name} onChange={update} placeholder="Your name" required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Phone *</label>
                    <input name="phone" value={form.phone} onChange={update} placeholder="+91 98765 43210" required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Service Interest</label>
                  <select name="serviceId" value={form.serviceId} onChange={update} className="input-field">
                    <option value="">Select a service...</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Preferred Date</label>
                    <input name="preferredDate" type="date" value={form.preferredDate} onChange={update} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Preferred Time</label>
                    <select name="preferredTime" value={form.preferredTime} onChange={update} className="input-field">
                      <option value="">Any time</option>
                      {['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Notes / Requirements</label>
                  <textarea name="notes" value={form.notes} onChange={update} rows={3} placeholder="Describe your space, style preferences, approximate area..." className="input-field resize-none" />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3.5">
                  {sending ? (<><Loader2 size={15} className="animate-spin" /> Booking...</>) : (<><Send size={15} /> Confirm Consultation</>)}
                </button>
                <p className="text-xs text-gray-600 text-center">Free consultation · No commitment required</p>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Backward-compat aliases so existing dashboard imports don't break
export const InterestLeadModal  = ConsultationBookingModal
export const SiteVisitModal     = ConsultationBookingModal
export const ServiceRequestModal= ConsultationBookingModal
export const SupportRequestModal= ConsultationBookingModal
