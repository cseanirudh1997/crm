import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown } from 'lucide-react'

const FAQS = [
  { q: 'What is included in a full home interior design package?', a: 'Our full home package covers everything — from an initial design consultation and concept development, to 3D visualization, material selection, procurement, execution oversight, and final styling. We manage every detail so you don\'t have to.' },
  { q: 'How long does a complete home interior project take?', a: 'Timelines vary based on project scope. A single room design typically takes 3–5 weeks. A full apartment (2-3BHK) takes 8–14 weeks. Villa projects can run 16–32 weeks. We provide detailed timelines after the initial consultation.' },
  { q: 'Do you provide 3D visualization before starting work?', a: 'Absolutely. All projects include photorealistic 3D renders and virtual walkthroughs of every room before a single nail is hammered. You see exactly what your finished space will look like before we begin.' },
  { q: 'Can I choose my own materials and furniture brands?', a: 'Yes. We work with a curated network of premium brands (Poliform, Miele, Häfele, and more) but we can also incorporate your preferred brands and vendors. Your vision guides every decision.' },
  { q: 'What is the minimum project investment you work with?', a: 'We typically work with projects starting at ₹5 Lakhs for single-room designs. Full home interior packages start from ₹80 per sq ft. We offer a free initial consultation to understand your space and budget before proposing a package.' },
  { q: 'Do you work outside Gurugram — in Mumbai, Bengaluru, Hyderabad?', a: 'Yes, we are a pan-India studio. Our senior designers travel to your location for site assessments. We have completed projects in Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, and internationally.' },
  { q: 'How do I book an initial consultation?', a: 'Simply fill out the consultation form on this page or call us directly. We respond within 24 hours to schedule a 60-minute complimentary design consultation at your home or virtually.' },
  { q: 'Do you handle post-completion issues or touch-ups?', a: 'Yes. All our projects come with a 1-year warranty on workmanship. We have a dedicated after-care team that handles any touch-ups, repairs, or minor additions within the warranty period.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section id="faq" className="py-20 relative">
      <div className="section-wrapper">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="section-badge mb-4"><HelpCircle size={11} /> FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto">Everything you need to know about working with Maison Interior Design Studio.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.04 }} className={`glass border rounded-2xl overflow-hidden transition-all duration-300 ${open === i ? 'border-brand-700/40 shadow-gold' : 'border-white/5 hover:border-white/10'}`}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                <span className={`text-sm font-semibold leading-snug transition-colors ${open === i ? 'text-brand-300' : 'text-white'}`}>{q}</span>
                <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${open === i ? 'rotate-180 text-brand-400' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <p className="text-gray-500 text-sm mb-3">Still have questions?</p>
          <button onClick={() => document.getElementById('consult')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">Book a Free Consultation</button>
        </motion.div>
      </div>
    </section>
  )
}
