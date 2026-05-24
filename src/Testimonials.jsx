import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

const TESTIMONIALS = [
  {
    name:    'Rahul Sharma',
    title:   'Senior Vice President',
    company: 'Tech Mahindra',
    city:    'Gurugram',
    avatar:  'RS',
    rating:  5,
    project: 'The Arbour by DLF',
    quote:   "EstateFlow made the entire process seamless. From shortlisting projects in Gurugram to the final registration — their concierge guided us at every step. The property has already appreciated 14% in 18 months.",
    color:   'from-brand-600 to-brand-800',
  },
  {
    name:    'Ananya Krishnan',
    title:   'Director, Finance',
    company: 'Infosys',
    city:    'Bengaluru',
    avatar:  'AK',
    rating:  5,
    project: 'Prestige Lakeside Habitat',
    quote:   "As an NRI buyer based in the US, I was nervous about a remote purchase. EstateFlow's team handled FEMA compliance, power of attorney, and full documentation. The property I bought in Whitefield has been generating 5.2% rental yield.",
    color:   'from-emerald-600 to-emerald-800',
  },
  {
    name:    'Vikram Malhotra',
    title:   'Managing Director',
    company: 'IndusInd Bank',
    city:    'Noida',
    avatar:  'VM',
    rating:  5,
    project: 'Lodha Bellavista',
    quote:   "I've invested in multiple properties through EstateFlow. Their AI market insights flagged the Noida Expressway sector 150 opportunity before mainstream media caught on. That early signal translated into 22% appreciation in under a year.",
    color:   'from-sky-600 to-sky-800',
  },
  {
    name:    'Deepika Shetty',
    title:   'Co-Founder',
    company: 'ZeroError Technologies',
    city:    'Hyderabad',
    avatar:  'DS',
    rating:  5,
    project: 'My Home Avatar',
    quote:   "Zero brokerage is a game changer. We saved ₹8 lakhs in fees and got direct-builder pricing on a 3BHK in HITEC City. The property assistant chatbot answered every question we had at 11PM — truly 24×7 service.",
    color:   'from-accent-600 to-accent-800',
  },
  {
    name:    'Arjun Nair',
    title:   'Head of Strategy',
    company: 'HDFC Securities',
    city:    'Mumbai',
    avatar:  'AN',
    rating:  5,
    project: 'Lodha Park, Worli',
    quote:   "Lodha Park at this price would have been impossible to close without EstateFlow's builder relationships. Their team negotiated a preferential allotment that saved us ₹35 lakhs versus the open-market price. Best real estate decision of my life.",
    color:   'from-rose-600 to-rose-800',
  },
]

export default function Testimonials() {
  const [idx,     setIdx]     = useState(0)
  const [dir,     setDir]     = useState(1)
  const intervalRef           = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => { setDir(1); setIdx((i) => (i + 1) % TESTIMONIALS.length) }, 6000)
    return () => clearInterval(intervalRef.current)
  }, [])

  function goTo(next) {
    clearInterval(intervalRef.current)
    setDir(next > idx ? 1 : -1)
    setIdx(next)
  }

  const current = TESTIMONIALS[idx]

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d * 60 }),
    center: { opacity: 1, x: 0 },
    exit:   (d) => ({ opacity: 0, x: d * -60 }),
  }

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-gray-950">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-700/20 to-transparent" />
      <div className="orb w-96 h-96 bg-brand-900 -top-20 left-1/2 -translate-x-1/2 opacity-15" />

      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-4">Success Stories</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 mb-4">
            Trusted by{' '}
            <span className="gradient-text">India's Top Investors</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-lg">
            From first-time home buyers to seasoned real estate investors — EstateFlow
            delivers exceptional results across every budget and city.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Card */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={idx}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className={`glass border border-white/10 rounded-3xl p-8 md:p-10 bg-gradient-to-br ${current.color}/10 relative`}
              >
                {/* Quote icon */}
                <Quote size={40} className="text-brand-700/40 absolute top-6 right-8" />

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-brand-400 fill-brand-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white text-lg leading-relaxed mb-8 relative z-10">
                  "{current.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${current.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md`}>
                      {current.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{current.name}</div>
                      <div className="text-gray-400 text-sm">{current.title}, {current.company}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-brand-400 text-xs font-semibold">{current.project}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mt-0.5">
                      <MapPin size={10} /> {current.city}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-7">
            <button
              onClick={() => goTo((idx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-700/40 transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === idx ? 'w-6 h-2.5 bg-brand-500' : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo((idx + 1) % TESTIMONIALS.length)}
              className="w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-700/40 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
