import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Twitter, Linkedin, Github, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS, SOCIAL_LINKS } from './config'

const FOOTER_LINKS = {
  Products: [
    { label: 'NexusGPT Enterprise',      href: '#products' },
    { label: 'SmartCall AI',             href: '#products' },
    { label: 'VoiceFlow Enterprise',     href: '#products' },
    { label: 'Enterprise RAG Platform',  href: '#products' },
    { label: 'AI Automation Studio',     href: '#products' },
    { label: 'AI Customer Support Suite',href: '#products' },
  ],
  Services: [
    { label: 'LLM / SLM Deployment',    href: '#services' },
    { label: 'Voice AI & Call Center',   href: '#services' },
    { label: 'RAG / Knowledge QnA',      href: '#services' },
    { label: 'Workflow Automation',      href: '#services' },
    { label: 'AI Transformation',        href: '#services' },
    { label: 'Managed AI Ops',           href: '#services' },
  ],
  Company: [
    { label: 'About Us',                 href: '#testimonials' },
    { label: 'Pricing',                  href: '#pricing'      },
    { label: 'Blog',                     href: '#'             },
    { label: 'Careers',                  href: '#'             },
    { label: 'Press',                    href: '#'             },
  ],
  Legal: [
    { label: 'Privacy Policy',           href: '#' },
    { label: 'Terms of Service',         href: '#' },
    { label: 'Cookie Policy',            href: '#' },
    { label: 'Security',                 href: '#' },
    { label: 'DPA',                      href: '#' },
  ],
}

const SOCIAL_ICONS = [
  { Icon: Twitter,  href: SOCIAL_LINKS.twitter,  label: 'Twitter'  },
  { Icon: Linkedin, href: SOCIAL_LINKS.linkedin,  label: 'LinkedIn' },
  { Icon: Github,   href: SOCIAL_LINKS.github,    label: 'GitHub'   },
  { Icon: Youtube,  href: SOCIAL_LINKS.youtube,   label: 'YouTube'  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  function scrollTo(hash) {
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gray-950 border-t border-white/10 overflow-hidden">
      <div className="orb w-64 h-64 bg-brand-900 top-0 right-0 opacity-10" />

      <div className="section-wrapper relative z-10">
        {/* Top section */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
                  <Zap size={16} className="text-white" />
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">{COMPANY_NAME}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Enterprise AI solutions — LLM deployment, voice AI, RAG platforms, and intelligent automation
              for the world's most demanding organisations.
            </p>

            {/* Contact info */}
            <div className="space-y-2">
              <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm">
                <Mail size={14} /> {COMPANY_EMAIL}
              </a>
              <a href={`tel:${COMPANY_PHONE}`} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm">
                <Phone size={14} /> {COMPANY_PHONE}
              </a>
              <div className="flex items-start gap-2 text-gray-500 text-sm">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" /> {COMPANY_ADDRESS}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith('#') ? (
                      <button
                        onClick={() => scrollTo(href)}
                        className="text-gray-500 hover:text-gray-200 text-sm transition-colors text-left"
                      >
                        {label}
                      </button>
                    ) : (
                      <a href={href} className="text-gray-500 hover:text-gray-200 text-sm transition-colors">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {year} {COMPANY_NAME}, Inc. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIAL_ICONS.map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
