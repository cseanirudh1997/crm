// ─────────────────────────────────────────────
//  Chatbot helpers — local fallback + prompt seeds
// ─────────────────────────────────────────────

export const SUGGESTED_PROMPTS = [
  'What services do you offer?',
  'Tell me about pricing',
  'How does the AI Forecasting work?',
  'How do I get started?',
  'What industries do you serve?',
  'Contact support',
]

export const FALLBACK_RESPONSE =
  "I'm not sure about that. Please contact our support team at hello@nexusai.io or use the contact form below for personalised assistance."

/** Build the initial bot greeting message */
export function getWelcomeMessage() {
  return {
    id:   Date.now(),
    role: 'bot',
    text: "👋 Hi! I'm NexusAI Assistant. Ask me about our services, pricing, products, or anything else!",
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
