import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Brain, LogIn, AlertCircle, Mail, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUser } from './api'
import { saveSession, isValidEmail } from './utils'
import { COMPANY_NAME, COMPANY_EMAIL, TIERS, ONBOARDING_STAGES } from './config'

export default function Login() {
  const navigate = useNavigate()
  const [form,          setForm]          = useState({ username: '', password: '' })
  const [showPw,        setShowPw]        = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [showForgot,    setShowForgot]    = useState(false)
  const [forgotEmail,   setForgotEmail]   = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSent,    setForgotSent]    = useState(false)

  function handleChange(e) {
    setError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleForgotSubmit(e) {
    e.preventDefault()
    if (!isValidEmail(forgotEmail)) {
      toast.error('Please enter a valid email address.')
      return
    }
    setForgotLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setForgotLoading(false)
    setForgotSent(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await loginUser({ username: form.username, password: form.password })

      if (res.success) {
        saveSession({
          username:        res.user?.username || form.username,
          email:           res.user?.email    || '',
          role:            res.user?.role     || 'user',
          phone:           res.user?.phone    || '',
          tier:            res.user?.tier            || TIERS.CUSTOMER,
          onboardingStage: res.user?.onboardingStage || ONBOARDING_STAGES.PENDING,
        })
        toast.success(`Welcome back, ${res.user?.username || form.username}! 🎉`)
        navigate('/dashboard')
      } else {
        setError(res.message || 'Invalid credentials. Please try again.')
      }
    } catch (err) {
      setError('Unable to connect. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="orb w-80 h-80 bg-brand-700 top-20 -left-20" />
      <div className="orb w-64 h-64 bg-accent-700 bottom-20 right-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="glass border border-white/10 rounded-3xl p-8 shadow-glass">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
                <Brain size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">{COMPANY_NAME}</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-white mb-1">Welcome back</h1>
            <p className="text-gray-400 text-sm">Sign in to access your AI mentorship portal</p>
          </div>

          {/* Error banner */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="your_username"
                className="input-field"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <button
                  type="button"
                  onClick={() => { setShowForgot((v) => !v); setForgotSent(false); setForgotEmail('') }}
                  className="text-xs text-brand-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password panel */}
            <AnimatePresence>
              {showForgot && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{   opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl bg-brand-900/20 border border-brand-700/30">
                    {forgotSent ? (
                      <div className="text-center py-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center mx-auto mb-3">
                          <Mail size={18} className="text-emerald-400" />
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">Check your inbox</p>
                        <p className="text-xs text-gray-400 leading-relaxed mb-3">
                          If <span className="text-white">{forgotEmail}</span> is registered,
                          reset instructions are on their way.
                        </p>
                        <button
                          type="button"
                          onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail('') }}
                          className="text-xs text-brand-400 hover:underline"
                        >
                          Back to sign in
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-gray-400 mb-3">
                          Enter your work email and we'll send reset instructions.
                        </p>
                        <form onSubmit={handleForgotSubmit} className="space-y-2">
                          <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                              type="email"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              placeholder="you@email.com"
                              className="input-field pl-9 text-sm"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={forgotLoading}
                              className="btn-primary flex-1 justify-center py-2 text-sm"
                            >
                              {forgotLoading
                                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                : <><ArrowRight size={14} /> Send Link</>
                              }
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowForgot(false)}
                              className="btn-secondary py-2 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          Need immediate help?{' '}
                          <a href={`mailto:${COMPANY_EMAIL}`} className="text-brand-400 hover:underline">
                            Contact support
                          </a>
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base mt-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
