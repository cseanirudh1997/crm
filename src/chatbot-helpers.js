// ─────────────────────────────────────────────
//  Maison — Chatbot helpers (interior design assistant)
// ─────────────────────────────────────────────

export const SUGGESTED_PROMPTS = [
  'Show modern luxury interiors',
  'Explain modular kitchen packages',
  'How do consultations work?',
  'Show villa transformation ideas',
  'What design styles are available?',
  'What is the cost of full home interior?',
]

export const FALLBACK_RESPONSE =
  "I'm unable to fetch a response right now. Please reach out directly at studio@maisonstudio.in or use the consultation form on our website — our design team responds within 24 hours."

/** Build the initial bot greeting message */
export function getWelcomeMessage() {
  return {
    id:   Date.now(),
    role: 'bot',
    text: '✨ Welcome to Maison! I\'m your AI Design Assistant. Ask me about our interior design collections, modular kitchens, 3D visualization, consultation packages, or luxury design styles.',
    ts:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

/** Create a user message object */
export function buildUserMessage(text) {
  return {
    id:   Date.now(),
    role: 'user',
    text,
    ts:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

/** Create a bot message object */
export function buildBotMessage(text) {
  return {
    id:   Date.now() + 1,
    role: 'bot',
    text: text || FALLBACK_RESPONSE,
    ts:   new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}
