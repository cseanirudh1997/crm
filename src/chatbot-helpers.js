// ─────────────────────────────────────────────
//  VN.AI — Chatbot helpers (AI leadership assistant)
// ─────────────────────────────────────────────

export const SUGGESTED_PROMPTS = [
  'Tell me about GenAI expertise',
  'Explain pricing AI systems',
  'How do mentorship sessions work?',
  'What enterprise AI projects are available?',
  'Show AI/ML case studies',
  'How to book a consultation?',
]

export const FALLBACK_RESPONSE =
  "I'm unable to fetch a response right now. Please reach out directly at connect@vnai.in or use the consultation form — I respond to all inquiries within 24 hours."

/** Build the initial bot greeting message */
export function getWelcomeMessage() {
  return {
    id:   Date.now(),
    role: 'bot',
    text: '🤖 Hi! I\'m your AI Assistant. Ask me about GenAI systems, enterprise AI consulting, pricing AI models, mentorship programs, or how to book a strategy session.',
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
