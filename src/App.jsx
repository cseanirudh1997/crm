import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout pieces
import Navbar        from './Navbar'
import Footer        from './Footer'
import Chatbot       from './Chatbot'
import ProtectedRoute from './ProtectedRoute'

// Home page sections
import Hero          from './Hero'
import Services      from './Services'
import Products      from './Products'
import Solutions     from './Solutions'
import Pricing       from './Pricing'
import Testimonials  from './Testimonials'
import Clients       from './Clients'
import FAQ           from './FAQ'
import Newsletter    from './Newsletter'
import Contact       from './Contact'

// Auth + Dashboard
import Login         from './Login'
import Signup        from './Signup'
import Dashboard     from './Dashboard'

// ─────────────────────────────────────────────
//  Scroll progress bar
// ─────────────────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop    = window.scrollY
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight
      const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(pct)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      id="scroll-progress"
      style={{ width: `${progress}%` }}
    />
  )
}

// ─────────────────────────────────────────────
//  Home page — all sections assembled
// ─────────────────────────────────────────────
function HomePage() {
  return (
    <>
      <Hero />
      <Clients />
      <Services />
      <Products />
      <Solutions />
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
            background: '#111827',
            color:      '#f9fafb',
            border:     '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize:   '14px',
          },
          success: { iconTheme: { primary: '#4a5eff', secondary: '#fff' } },
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

        {/* ── Fallback ── */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-center">
                  <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
                  <p className="text-gray-400 text-lg mb-8">Page not found.</p>
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
