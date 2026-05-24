// ─────────────────────────────────────────────
//  Chatbot helpers — luxury real estate prompts
// ─────────────────────────────────────────────

export const SUGGESTED_PROMPTS = [
  'Show me luxury projects in Gurugram',
  'What are the best NRI investment options?',
  'How does site visit booking work?',
  'Tell me about Lodha Park Mumbai',
  'What is the current market appreciation rate?',
  'How do I register my interest?',
]

export const FALLBACK_RESPONSE =
  "I'm not able to answer that right now. Please reach out to our concierge at concierge@estateflow.in or use the consultation form on our website."

/** Build the initial bot greeting message */
export function getWelcomeMessage() {
  return {
    id:   Date.now(),
    role: 'bot',
    text: "🏙️ Welcome to EstateFlow! I'm your AI Property Assistant. Ask me about projects, cities, pricing, site visits, NRI services, or investment insights.",
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
