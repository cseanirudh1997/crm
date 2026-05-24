// ─────────────────────────────────────────────
//  Chatbot helpers — enterprise-focused prompts
// ─────────────────────────────────────────────

export const SUGGESTED_PROMPTS = [
  'What AI products do you offer?',
  'How does SmartCall AI work?',
  'Tell me about enterprise pricing',
  'How quickly can you deploy a RAG platform?',
  'What industries do you specialize in?',
  'How do I book a consultation?',
]

export const FALLBACK_RESPONSE =
  "I'm not sure about that. Please contact our enterprise team at enterprise@nexusai.io or book a consultation using the form below."

/** Build the initial bot greeting message */
export function getWelcomeMessage() {
  return {
    id:   Date.now(),
    role: 'bot',
    text: "👋 Hi! I'm NexusAI Assistant. Ask me about our enterprise AI products, LLM deployments, voice AI, pricing, or how to get started.",
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
