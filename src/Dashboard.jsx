// ─────────────────────────────────────────────
//  Dashboard — thin tier router
//  Routes to the appropriate dashboard based on
//  the user's tier stored in localStorage.
// ─────────────────────────────────────────────

import { getSession } from './utils'
import { TIERS }      from './config'
import TrialDashboard   from './TrialDashboard'
import PremiumDashboard from './PremiumDashboard'
import AdminDashboard   from './AdminDashboard'

export default function Dashboard() {
  const session = getSession()
  const tier    = session?.tier || TIERS.CUSTOMER

  if (tier === TIERS.ADMIN)   return <AdminDashboard   session={session} />
  if (tier === TIERS.PREMIUM) return <PremiumDashboard session={session} />
  return                              <TrialDashboard   session={session} />
}
