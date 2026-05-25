// ─────────────────────────────────────────────
//  VN.AI — Global Configuration
//  Premium Personal Branding + AI Leadership Platform
//  Senior Data Scientist · GenAI Leader · Enterprise AI Consultant
// ─────────────────────────────────────────────

// TODO: Replace with your personal brand Google Apps Script deployment URL
export const API_URL =
  'https://script.google.com/macros/s/AKfycbzVulNq3OJDhedqXtHcNKt25ntv9rYdJRBX1jfJetsrwXKLP4TYw9KJ087lEzQfM5xF/exec'

export const COMPANY_NAME    = 'VN.AI'
export const COMPANY_TAGLINE = 'Senior Data Scientist · GenAI Leader · Enterprise AI Consultant'
export const COMPANY_EMAIL   = 'connect@vnai.in'
export const COMPANY_PHONE   = '+91 98765 43210'
export const COMPANY_ADDRESS = 'Gurugram, Haryana, India'

export const SOCIAL_LINKS = {
  linkedin:  'https://linkedin.com/in/vnai',
  youtube:   'https://youtube.com/@vnai',
  instagram: 'https://instagram.com/vnai',
  twitter:   'https://twitter.com/vnai',
}

export const NAV_LINKS = [
  { label: 'About',        href: '#about'        },
  { label: 'Projects',     href: '#projects'     },
  { label: 'Case Studies', href: '#casestudies'  },
  { label: 'Services',     href: '#services'     },
  { label: 'Publications', href: '#publications' },
  { label: 'Ecosystem',    href: '#ecosystem'    },
  { label: 'Consult',      href: '#consult'      },
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
