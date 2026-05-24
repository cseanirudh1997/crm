import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_ADDRESS, SOCIAL_LINKS } from './config'

const FOOTER_LINKS = {
  'Quick Links': [
    { label: 'Featured Projects', href: '#projects'   },
    { label: 'City Showcase',     href: '#cities'     },
    { label: 'Amenities',         href: '#amenities'  },
    { label: 'Market Insights',   href: '#insights'   },
    { label: 'Testimonials',      href: '#testimonials'},
  ],
  'Buyer Services': [
    { label: 'Book Consultation',  href: '#contact'   },
    { label: 'Schedule Site Visit',href: '#contact'   },
    { label: 'NRI Services',       href: '#contact'   },
    { label: 'Home Loan Assist',   href: '#contact'   },
    { label: 'Property Alerts',    href: '#'          },
  ],
  'Company': [
    { label: 'About EstateFlow',   href: '#testimonials'},
    { label: 'Builder Partners',   href: '#'           },
    { label: 'Careers',            href: '#'           },
    { label: 'Blog',               href: '#'           },
    { label: 'Press',              href: '#'           },
  ],
  'Legal': [
    { label: 'Privacy Policy',    href: '#'           },
    { label: 'Terms of Service',  href: '#'           },
    { label: 'RERA Disclosures',  href: '#'           },
    { label: 'Cookie Policy',     href: '#'           },
  ],
}

const SOCIAL_ICONS = {
  twitter:   Twitter,
  linkedin:  Linkedin,
  instagram: Instagram,
  youtube:   Youtube,
}

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
                  <Building2 size={18} className="text-white" />
                </div>
                <div className="absolute inset-0 w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>
              <span className="text-xl font-bold tracking-tight gradient-text">{COMPANY_NAME}</span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              India's premium real estate advisory platform — connecting discerning buyers
              with India's finest luxury properties across Gurugram, Noida, Bengaluru,
              Mumbai, and Hyderabad.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5 mb-6">
              <a href={`tel:${COMPANY_PHONE}`} className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-brand-400 transition-colors group">
                <Phone size={14} className="text-gray-600 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
                {COMPANY_PHONE}
              </a>
              <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-brand-400 transition-colors group">
                <Mail size={14} className="text-gray-600 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
                {COMPANY_EMAIL}
              </a>
              <div className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin size={14} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <span>{COMPANY_ADDRESS}</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {Object.entries(SOCIAL_LINKS).map(([key, href]) => {
                const Icon = SOCIAL_ICONS[key]
                if (!Icon) return null
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-500 hover:text-brand-400 hover:border-brand-700/40 hover:bg-brand-950/20 transition-all duration-200"
                  >
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
                    <a
                      href={href}
                      onClick={(e) => {
                        if (href.startsWith('#') && href !== '#') {
                          e.preventDefault()
                          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className="text-sm text-gray-500 hover:text-brand-400 transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* RERA disclaimer */}
        <div className="border-t border-white/8 pt-8 mb-6">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-500">RERA Disclaimer: </span>
            All projects listed on EstateFlow are registered under their respective state RERA authorities.
            Property prices, possession dates, and specifications are subject to change and should be verified
            directly with the builder. EstateFlow is an advisory platform and not a party to the sale agreement.
            Images shown are for representation purposes only.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            🌀 Powered by{' '}
            <a href="https://wibey.walmart.com/code" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-400 transition-colors">
              Wibey VS Code Extension
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
