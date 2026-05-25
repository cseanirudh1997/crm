// ─────────────────────────────────────────────
//  Maison — Global Configuration
//  Premium Interior Design & Luxury Spaces
// ─────────────────────────────────────────────

export const API_URL =
  'https://script.google.com/macros/s/AKfycbzVulNq3OJDhedqXtHcNKt25ntv9rYdJRBX1jfJetsrwXKLP4TYw9KJ087lEzQfM5xF/exec'

export const COMPANY_NAME    = 'Maison'
export const COMPANY_TAGLINE = 'Premium Interior Design & Luxury Spaces'
export const COMPANY_EMAIL   = 'studio@maisonstudio.in'
export const COMPANY_PHONE   = '+91 98765 43210'
export const COMPANY_ADDRESS = 'DLF Cyber City, Sector 24, Gurugram, Haryana 122002'

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/maisonstudio',
  pinterest: 'https://pinterest.com/maisonstudio',
  youtube:   'https://youtube.com/@maisonstudio',
  linkedin:  'https://linkedin.com/company/maisonstudio',
}

export const NAV_LINKS = [
  { label: 'Collections',     href: '#collections'     },
  { label: 'Transformations', href: '#transformations' },
  { label: 'Services',        href: '#services'        },
  { label: 'Inspirations',    href: '#inspirations'    },
  { label: 'Consult',         href: '#consult'         },
]

// ── Feature flags — driven by PlatformConfig at runtime ──────────────────
export const paymentsEnabled      = true
export const consultationsEnabled = true
export const newsletterEnabled    = true

// ── Tier constants ─────────────────────────────
export const TIERS = {
  CUSTOMER: 'customer',   // free registered client
  PREMIUM:  'premium',    // premium design client
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
  DESIGN:       'design',
  EXECUTION:    'execution',
  COMPLETED:    'completed',
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
