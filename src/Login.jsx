import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Zap, LogIn, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUser } from './api'
import { saveSession } from './utils'
import { COMPANY_NAME } from './config'

export default function Login() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ username: '', password: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  function handleChange(e) {
    setError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
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
          username: res.user?.username || form.username,
          email:    res.user?.email    || '',
          role:     res.user?.role     || 'user',
          company:  res.user?.company  || '',
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
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">{COMPANY_NAME}</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-white mb-1">Welcome back</h1>
            <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
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
                <button type="button" className="text-xs text-brand-400 hover:underline">
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
