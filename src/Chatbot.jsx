import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react'
import { sendChatMessage } from './api'
import { SUGGESTED_PROMPTS, FALLBACK_RESPONSE, getWelcomeMessage, buildUserMessage, buildBotMessage } from './chatbot-helpers'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm bg-white/10 border border-white/10 w-16">
      {[0, 0.15, 0.3].map((delay) => (
        <motion.div
          key={delay}
          className="w-2 h-2 rounded-full bg-gray-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay }}
        />
      ))}
    </div>
  )
}

export default function Chatbot() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([getWelcomeMessage()])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showDot,  setShowDot]  = useState(true)
  const endRef  = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
      setShowDot(false)
    }
  }, [open])

  async function sendMessage(text) {
    const query = text || input.trim()
    if (!query || loading) return

    setInput('')
    const userMsg = buildUserMessage(query)
    setMessages((m) => [...m, userMsg])
    setLoading(true)

    try {
      const res  = await sendChatMessage(query)
      const reply = res?.response || res?.message || FALLBACK_RESPONSE
      setMessages((m) => [...m, buildBotMessage(reply)])
    } catch {
      setMessages((m) => [...m, buildBotMessage(FALLBACK_RESPONSE)])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Notification dot */}
        {showDot && !open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full border-2 border-gray-950 z-10 animate-pulse-slow"
          />
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{  scale: 0.9 }}
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shadow-glow text-white"
          aria-label="Open AI chat"
        >
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} /></motion.div>
              : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={22} /></motion.div>
            }
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.85, y: 20  }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col"
            style={{ maxHeight: '540px' }}
          >
            <div className="glass-dark border border-white/10 rounded-2xl shadow-glass flex flex-col overflow-hidden" style={{ maxHeight: '540px' }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-brand-900/80 to-accent-900/60 border-b border-white/10">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-1">
                    NexusAI Assistant <Sparkles size={12} className="text-brand-300" />
                  </div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse-slow" />
                    Online
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-auto text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-600 px-1">{msg.ts}</span>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <TypingIndicator />
                  </motion.div>
                )}

                <div ref={endRef} />
              </div>

              {/* Suggested prompts */}
              {messages.length === 1 && !loading && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="text-xs px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-white/10">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-brand-500 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything…"
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                    disabled={loading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{  scale: 0.9  }}
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-500 transition-colors"
                  >
                    <Send size={13} />
                  </motion.button>
                </div>
                <p className="text-center text-gray-700 text-xs mt-2">
                  Powered by NexusAI backend
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
