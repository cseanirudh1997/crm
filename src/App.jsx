import { useEffect, useRef } from 'react'
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Building2 } from 'lucide-react'

// Utils
import { scrollToSection } from './utils'

// Layout pieces
import Navbar         from './Navbar'
import Footer         from './Footer'
import Chatbot        from './Chatbot'
import ProtectedRoute from './ProtectedRoute'

// Home page sections
import Hero         from './Hero'
import Services     from './Services'
import Products     from './Products'
import Solutions    from './Solutions'
import Pricing      from './Pricing'
import Testimonials from './Testimonials'
import Clients      from './Clients'
import FAQ          from './FAQ'
import Newsletter   from './Newsletter'
import Contact      from './Contact'

// Auth + Dashboard
import Login     from './Login'
import Signup    from './Signup'
import Dashboard from './Dashboard'

// ─────────────────────────────────────────────
//  Scroll progress bar — mutates the DOM directly via ref
//  to avoid React re-renders on every scroll event.
// ─────────────────────────────────────────────
function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct       = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      bar.style.width = pct + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div ref={barRef} id="scroll-progress" />
}

// ─────────────────────────────────────────────
//  Home page — all sections assembled
// ─────────────────────────────────────────────
function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const { scrollTo } = location.state || {}
    if (scrollTo) {
      // Clear state immediately so back-navigation doesn't re-trigger scroll
      navigate(location.pathname, { replace: true, state: {} })
      setTimeout(() => scrollToSection(scrollTo), 100)
    }
  }, [location.state])

  return (
    <>
      <Hero />
      <Clients />
      <Solutions />
      <Products />
      <Services />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Newsletter />
    </>
  )
}

// ─────────────────────────────────────────────
//  Root App
// ─────────────────────────────────────────────
export default function App() {
  return (
    <HashRouter>
      {/* Global scroll progress bar */}
      <ScrollProgress />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background:   '#111827',
            color:        '#f9fafb',
            border:       '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize:     '14px',
          },
          success: { iconTheme: { primary: '#c99a1a', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          duration: 4000,
        }}
      />

      <Routes>
        {/* ── Public home page ── */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>
                <HomePage />
              </main>
              <Footer />
              <Chatbot />
            </>
          }
        />

        {/* ── Auth pages (no navbar/footer) ── */}
        <Route path="/login"  element={<Login  />} />
        <Route path="/signup" element={<Signup />} />

        {/* ── Protected dashboard ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Fallback 404 ── */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-glow mx-auto mb-6">
                    <Building2 size={36} className="text-white" />
                  </div>
                  <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
                  <p className="text-gray-400 text-lg mb-2">Page not found.</p>
                  <p className="text-gray-600 text-sm mb-8">The property you're looking for doesn't exist or has been moved.</p>
                  <Link to="/" className="btn-primary">← Back to Home</Link>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </HashRouter>
  )
}
