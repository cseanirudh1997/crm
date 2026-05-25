import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Palette, UserPlus, AlertCircle, CheckCircle, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { signupUser } from './api'
import { saveSession, isValidEmail } from './utils'
import { COMPANY_NAME, TIERS, ONBOARDING_STAGES } from './config'

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500']

function passwordStrength(pw) {
  let score = 0
  if (pw.length >= 8)          score++
  if (/[A-Z]/.test(pw))        score++
  if (/[0-9]/.test(pw))        score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', email: '', phone: '' })
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const strength = passwordStrength(form.password)

  function handleChange(e) {
    setError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { username, password, email, phone } = form

    if (!username || !password || !email) {
      setError('Please fill in all required fields.')
      return
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await signupUser({ username, password, email, phone })

      if (res.success) {
        saveSession({
          username:        res.user?.username || username,
          email:           res.user?.email    || email,
          role:            res.user?.role     || 'user',
          phone:           res.user?.phone    || phone,
          tier:            TIERS.CUSTOMER,
          onboardingStage: ONBOARDING_STAGES.PENDING,
        })
        toast.success('Account created! Welcome to VN.AI ✨')
        navigate('/dashboard')
      } else {
        setError(res.message || 'Signup failed. Please try again.')
      }
    } catch (err) {
      setError('Unable to connect. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="orb w-80 h-80 bg-accent-700 top-10 -right-20" />
      <div className="orb w-64 h-64 bg-brand-700 bottom-10 -left-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass border border-white/10 rounded-3xl p-8 shadow-glass">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
                <Palette size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">{COMPANY_NAME}</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-white mb-1">Create your account</h1>
            <p className="text-gray-400 text-sm">Create a free account to access the AI mentorship portal and exclusive resources.</p>
          </div>

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
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Username <span className="text-red-400">*</span>
              </label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="john_doe"
                className="input-field"
                autoComplete="username"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="input-field"
                autoComplete="email"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input-field pr-11"
                  autoComplete="new-password"
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

              {/* Strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          s <= strength ? STRENGTH_COLORS[strength] : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength: <span className="text-gray-300">{STRENGTH_LABELS[strength]}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Perks */}
            <div className="pt-1 space-y-1.5">
              {[
                'Access to AI mentorship resources & session notes',
                'Dedicated AI career roadmap & progress tracking',
                'Exclusive GenAI research insights & tools',
              ].map((p) => (
                <div key={p} className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle size={12} className="text-brand-400 flex-shrink-0" />
                  {p}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-base"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
