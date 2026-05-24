// ─────────────────────────────────────────────
//  EstateFlow — Global Configuration
// ─────────────────────────────────────────────

export const API_URL =
  'https://script.google.com/macros/s/AKfycbxoI24ic-ykU-QeQxkfOI0mo3AaIhCz9_zt2eCzSOAEASYGzNMe_oFnJ9ntEl6uTrLsWg/exec'

export const COMPANY_NAME    = 'EstateFlow'
export const COMPANY_TAGLINE = 'Premium Indian Real Estate Platform'
export const COMPANY_EMAIL   = 'concierge@estateflow.in'
export const COMPANY_PHONE   = '+91 98765 43210'
export const COMPANY_ADDRESS = 'DLF Cyber City, Sector 24, Gurugram, Haryana 122002'

export const SOCIAL_LINKS = {
  twitter:   'https://twitter.com/estateflow',
  linkedin:  'https://linkedin.com/company/estateflow',
  instagram: 'https://instagram.com/estateflow',
  youtube:   'https://youtube.com/@estateflow',
}

export const NAV_LINKS = [
  { label: 'Cities',    href: '#cities'     },
  { label: 'Projects',  href: '#projects'   },
  { label: 'Amenities', href: '#amenities'  },
  { label: 'Insights',  href: '#insights'   },
  { label: 'Contact',   href: '#contact'    },
]

// ── Payments feature flag ──────────────────────
// Set to true once Razorpay integration is wired up
export const paymentsEnabled = false

// ── Tier constants ─────────────────────────────
export const TIERS = {
  CUSTOMER: 'customer',   // free registered user
  PREMIUM:  'premium',    // verified investor / premium buyer
  ADMIN:    'admin',
}

// ── Role constants ─────────────────────────────
export const ROLES = {
  USER:  'user',
  ADMIN: 'admin',
}

// ── Onboarding stage constants ─────────────────
export const ONBOARDING_STAGES = {
  PENDING:      'pending',
  CONSULTATION: 'consultation',
  SITE_VISIT:   'site_visit',
  NEGOTIATION:  'negotiation',
  BOOKED:       'booked',
}

// ── LocalStorage keys ──────────────────────────
export const STORAGE_KEYS = {
  IS_LOGGED_IN:     'isLoggedIn',
  USERNAME:         'username',
  EMAIL:            'email',
  ROLE:             'role',
  PHONE:            'phone',
  TIER:             'tier',
  ONBOARDING_STAGE: 'onboardingStage',
}
