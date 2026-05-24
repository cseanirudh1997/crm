// ─────────────────────────────────────────────
//  Utility helpers
// ─────────────────────────────────────────────

import { STORAGE_KEYS, TIERS, ONBOARDING_STAGES } from './config'

/**
 * Persist session data to localStorage after login / signup.
 * tier and onboardingStage are optional — defaults applied on read.
 */
export function saveSession({
  username,
  email,
  role            = 'user',
  company         = '',
  tier            = TIERS.TRIAL,
  onboardingStage = ONBOARDING_STAGES.PENDING,
}) {
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN,     'true')
  localStorage.setItem(STORAGE_KEYS.USERNAME,          username)
  localStorage.setItem(STORAGE_KEYS.EMAIL,             email)
  localStorage.setItem(STORAGE_KEYS.ROLE,              role)
  localStorage.setItem(STORAGE_KEYS.COMPANY,           company)
  localStorage.setItem(STORAGE_KEYS.TIER,              tier)
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_STAGE,  onboardingStage)
}

/** Clear all session data */
export function clearSession() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k))
}

/**
 * Return the current session object (or null if not logged in).
 * Backward-compatible: existing sessions without tier/onboardingStage
 * default to 'trial' / 'pending'.
 */
export function getSession() {
  const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true'
  if (!isLoggedIn) return null
  return {
    isLoggedIn,
    username:        localStorage.getItem(STORAGE_KEYS.USERNAME)         || '',
    email:           localStorage.getItem(STORAGE_KEYS.EMAIL)            || '',
    role:            localStorage.getItem(STORAGE_KEYS.ROLE)             || 'user',
    company:         localStorage.getItem(STORAGE_KEYS.COMPANY)          || '',
    tier:            localStorage.getItem(STORAGE_KEYS.TIER)             || TIERS.TRIAL,
    onboardingStage: localStorage.getItem(STORAGE_KEYS.ONBOARDING_STAGE) || ONBOARDING_STAGES.PENDING,
  }
}

/** Returns true if the current session has admin tier */
export function isAdmin() {
  const s = getSession()
  return s?.tier === TIERS.ADMIN || s?.role === 'admin'
}

/** Returns true if the current session has premium or admin tier */
export function isPremium() {
  const s = getSession()
  return s?.tier === TIERS.PREMIUM || s?.tier === TIERS.ADMIN || s?.role === 'admin'
}

/** Scroll smoothly to a hash anchor */
export function scrollToSection(hash) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

/** Format a number with commas */
export function formatNumber(n) {
  return n.toLocaleString()
}

/** Clamp a value between min and max */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/** Simple email validation */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Debounce */
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/** Format a timestamp to readable date */
export function formatDate(ts) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(new Date(ts))
}
