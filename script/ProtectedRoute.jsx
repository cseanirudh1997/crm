import { Navigate } from 'react-router-dom'
import { getSession } from './utils'

/**
 * Wraps a route that requires authentication.
 * Redirects to /login if no session is found.
 */
export default function ProtectedRoute({ children }) {
  const session = getSession()
  return session ? children : <Navigate to="/login" replace />
}
