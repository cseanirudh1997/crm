import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Twitter, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS, SOCIAL_LINKS } from './config'

const FOOTER_LINKS = {
  'AI Services': [
    { label: 'Enterprise AI Strategy',  href: '#services'     },
    { label: 'GenAI Architecture',      href: '#services'     },
    { label: 'Pricing AI Consulting',   href: '#services'     },
    { label: '1-on-1 Mentorship',       href: '#services'     },
    { label: 'Mock Interviews',         href: '#services'     },
  ],
  'Explore': [
    { label: 'AI Projects',         href: '#projects'     },
    { label: 'Case Studies',        href: '#casestudies'  },
    { label: 'Publications',        href: '#publications' },
    { label: 'Testimonials',        href: '#testimonials' },
    { label: 'FAQ',                 href: '#faq'          },
  ],
  'Connect': [
    { label: 'About',            href: '#about'        },
    { label: 'Book a Call',      href: '#consult'      },
    { label: 'Newsletter',       href: '#consult'      },
    { label: 'Speaking',         href: '#about'        },
    { label: 'Privacy Policy',   href: '#'             },
  ],
}

const SOCIAL_ICONS = { linkedin: Linkedin, youtube: Youtube, twitter: Twitter }

export default function Footer() {
  return (
    <footer className="relative bg-gray-950 border-t border-white/8 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-10" />
      <div className="orb w-96 h-96 bg-brand-900 -bottom-20 -left-20 opacity-10" />

      <div className="section-wrapper relative z-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
                  <Brain size={17} className="text-white" />
                </div>
                <div className="absolute inset-0 w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight gradient-text">{COMPANY_NAME}</span>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-medium">AI Leadership · GenAI Consulting</div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Senior Data Scientist & Enterprise AI Consultant. 12+ years building AI systems at scale. $42M+ business impact. 50+ mentees placed at FAANG and top unicorns.
            </p>

            <div className="space-y-2.5 mb-6">
              {[
                { icon: Phone, label: COMPANY_PHONE, href: `tel:${COMPANY_PHONE}` },
                { icon: Mail,  label: COMPANY_EMAIL, href: `mailto:${COMPANY_EMAIL}` },
                { icon: MapPin, label: COMPANY_ADDRESS, href: null },
              ].map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-start gap-2.5 text-sm">
                  <Icon size={14} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  {href ? (
                    <a href={href} className="text-gray-400 hover:text-brand-400 transition-colors">{label}</a>
                  ) : (
                    <span className="text-gray-400">{label}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {Object.entries(SOCIAL_LINKS).map(([key, href]) => {
                const Icon = SOCIAL_ICONS[key]
                if (!Icon) return null
                return (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 hover:text-brand-400 hover:border-brand-700/40 hover:bg-brand-950/20 transition-all duration-200">
                    <Icon size={14} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} onClick={(e) => { if (href.startsWith('#') && href !== '#') { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }) } }} className="text-sm text-gray-500 hover:text-brand-400 transition-colors duration-200">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {COMPANY_NAME} · AI Leadership & Consulting. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            🌀 Magic applied with{' '}
            <a href="https://wibey.walmart.com/code" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-400 transition-colors">
              Wibey VS Code Extension
            </a>{' '}🪄
          </p>
        </div>
      </div>
    </footer>
  )
}
