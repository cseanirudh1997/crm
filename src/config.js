// ─────────────────────────────────────────────
//  Global configuration
// ─────────────────────────────────────────────

export const API_URL =
  'https://script.google.com/macros/s/AKfycbw-SYvVnL6sNyVNI_yEY2UyrTMVU1nybWDiK6wMoyPxOjhka66F6qr3z-2x8Qh9ckbYoQ/exec'

export const COMPANY_NAME    = 'NexusAI'
export const COMPANY_TAGLINE = 'Enterprise AI Solutions & Automation'
export const COMPANY_EMAIL   = 'enterprise@nexusai.io'
export const COMPANY_PHONE   = '+1 (888) 639-8724'
export const COMPANY_ADDRESS = '350 5th Avenue, New York, NY 10118'

export const SOCIAL_LINKS = {
  twitter:  'https://twitter.com/nexusai',
  linkedin: 'https://linkedin.com/company/nexusai',
  github:   'https://github.com/nexusai',
  youtube:  'https://youtube.com/@nexusai',
}

export const NAV_LINKS = [
  { label: 'Services',  href: '#services'     },
  { label: 'Products',  href: '#products'     },
  { label: 'Solutions', href: '#solutions'    },
  { label: 'Pricing',   href: '#pricing'      },
  { label: 'About',     href: '#testimonials' },
]

// ── Tier constants ─────────────────────────────
export const TIERS = {
  TRIAL:   'trial',
  PREMIUM: 'premium',
  ADMIN:   'admin',
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
  SCOPING:      'scoping',
  DEPLOYMENT:   'deployment',
  DEPLOYED:     'deployed',
}

// ── LocalStorage keys ──────────────────────────
export const STORAGE_KEYS = {
  IS_LOGGED_IN:     'isLoggedIn',
  USERNAME:         'username',
  EMAIL:            'email',
  ROLE:             'role',
  COMPANY:          'company',
  TIER:             'tier',
  ONBOARDING_STAGE: 'onboardingStage',
}
