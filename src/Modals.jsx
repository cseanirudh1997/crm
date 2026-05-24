// ─────────────────────────────────────────────
//  Modals — ServiceRequestModal + SupportRequestModal
// ─────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, Loader } from 'lucide-react'
import { createServiceRequest, createSupportRequest } from './api'
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
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-white/10 bg-gradient-to-r from-brand-900/60 to-accent-900/40">
            <div>
              <h2 className="text-base font-semibold text-white">{title}</h2>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors ml-4 shrink-0"
            >
              <X size={18} />
            </button>
          </div>
          {/* Body */}
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
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
        <CheckCircle size={32} className="text-emerald-400" />
      </div>
      <div>
        <p className="font-semibold text-white mb-1">Request Submitted!</p>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
      <button onClick={onClose} className="btn-primary mt-2">Close</button>
    </div>
  )
}

/* ════════════════════════════════════════════
   ServiceRequestModal
   ════════════════════════════════════════════ */
export function ServiceRequestModal({ session, onClose }) {
  const [form, setForm] = useState({
    service:     '',
    requestType: '',
    priority:    'standard',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const SERVICE_TYPES = [
    'LLM / SLM Deployment',
    'Conversational AI Agent',
    'Voice AI / Call Center Automation',
    'Enterprise Copilot',
    'RAG / Knowledge Base QnA',
    'Workflow Automation',
    'Transformation Consulting',
    'Data Engineering & Pipeline',
    'Other',
  ]

  const PRIORITY_OPTIONS = [
    { value: 'standard', label: 'Standard',  desc: '5–7 business days' },
    { value: 'priority', label: 'Priority',  desc: '2–3 business days' },
    { value: 'urgent',   label: 'Urgent',    desc: 'Within 24 hours'   },
  ]

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.service || !form.requestType.trim()) {
      toast.error('Please complete all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await createServiceRequest({
        username:    session?.username || '',
        company:     session?.company  || '',
        service:     form.service,
        requestType: form.requestType,
        priority:    form.priority,
      })
      setSuccess(res.message || 'Request submitted successfully.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell
      title="Request AI Service / Deployment"
      subtitle="Our solutions team will reach out within 1 business day."
      onClose={onClose}
    >
      {success ? (
        <SuccessState message={success} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service type */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Service *</label>
            <select
              value={form.service}
              onChange={(e) => update('service', e.target.value)}
              className="input-field text-sm"
              required
            >
              <option value="" disabled>Select a service…</option>
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s} className="bg-gray-900">{s}</option>
              ))}
            </select>
          </div>

          {/* Pre-filled info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Username</label>
              <input type="text" value={session?.username || ''} readOnly className="input-field text-sm opacity-60 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Company</label>
              <input type="text" value={session?.company || ''} readOnly className="input-field text-sm opacity-60 cursor-not-allowed" />
            </div>
          </div>

          {/* Request type / details */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Request Details *</label>
            <textarea
              value={form.requestType}
              onChange={(e) => update('requestType', e.target.value)}
              placeholder="Describe your use case, scale, integrations, and any specific requirements…"
              rows={4}
              className="input-field text-sm resize-none"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs text-gray-400 mb-2 font-medium">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITY_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update('priority', value)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    form.priority === value
                      ? 'border-brand-500 bg-brand-900/40 text-brand-300'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-semibold">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading
              ? <><Loader size={15} className="animate-spin" /> Submitting…</>
              : <><Send size={15} /> Submit Request</>
            }
          </button>
        </form>
      )}
    </ModalShell>
  )
}

/* ════════════════════════════════════════════
   SupportRequestModal
   ════════════════════════════════════════════ */
export function SupportRequestModal({ session, onClose }) {
  const [form, setForm] = useState({
    category: '',
    message:  '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const CATEGORIES = [
    'Deployment Issue',
    'API / Integration Error',
    'Performance Degradation',
    'Model Accuracy Problem',
    'Billing & Licensing',
    'Feature Request',
    'Security Concern',
    'Other',
  ]

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.category || !form.message.trim()) {
      toast.error('Please complete all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await createSupportRequest({
        username: session?.username || '',
        category: form.category,
        message:  form.message,
      })
      setSuccess(res.message || 'Support ticket created successfully.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell
      title="Create Support Ticket"
      subtitle="Enterprise SLA: Critical — 1h, High — 4h, Medium — 8h, Low — 24h."
      onClose={onClose}
    >
      {success ? (
        <SuccessState message={success} onClose={onClose} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username (pre-filled) */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Account</label>
            <input type="text" value={session?.username || ''} readOnly className="input-field text-sm opacity-60 cursor-not-allowed" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Category *</label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="input-field text-sm"
              required
            >
              <option value="" disabled>Select category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">{c}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              placeholder="Describe the issue — include steps to reproduce, error messages, affected service, and business impact…"
              rows={5}
              className="input-field text-sm resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading
              ? <><Loader size={15} className="animate-spin" /> Submitting…</>
              : <><Send size={15} /> Create Ticket</>
            }
          </button>
        </form>
      )}
    </ModalShell>
  )
}
