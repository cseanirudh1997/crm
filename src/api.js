// ─────────────────────────────────────────────
//  Centralized API helper — Google Apps Script
//  Uses text/plain to avoid CORS preflight
// ─────────────────────────────────────────────

import { API_URL } from './config'

async function post(payload) {
  const response = await fetch(API_URL, {
    method:   'POST',
    headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
    redirect: 'follow',
    body:     JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

// ── Auth ───────────────────────────────────────

/**
 * Create a new account.
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function signupUser({ username, password, email, company }) {
  return post({ action: 'signup', username, password, email, company })
}

/**
 * Authenticate an existing user.
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function loginUser({ username, password }) {
  return post({ action: 'login', username, password })
}

// ── Contact ────────────────────────────────────

/**
 * Submit the contact form.
 * @returns {{ success: boolean, message: string }}
 */
export async function submitContact({ name, company, email, message }) {
  return post({ action: 'contact', name, company, email, message })
}

// ── Chatbot ────────────────────────────────────

/**
 * Send a chat message and receive a bot reply.
 * @returns {{ success: boolean, response: string }}
 */
export async function sendChatMessage(query) {
  return post({ action: 'chat', query })
}
