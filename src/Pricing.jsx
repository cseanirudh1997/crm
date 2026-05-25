import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, BookOpen, Clock, ArrowRight, Sparkles, Eye } from 'lucide-react'
import { fetchYouTubeVideos, fetchBlogs } from './api'
import { normalizeImageUrl, handleImageError } from './imageUtils'

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="group glass border border-white/5 rounded-2xl overflow-hidden card-glow hover:border-brand-700/40">
      <div className="relative aspect-video overflow-hidden cursor-pointer" onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
        ) : (
          <>
            <img src={normalizeImageUrl(video.thumbnail, { width: 800, quality: 75 })} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => handleImageError(e)} />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-brand-600/90 border-2 border-brand-400/50 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                <Play size={22} className="text-white ml-1" fill="white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-mono">{video.duration}</div>
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-xs text-gray-300"><Eye size={9} />{video.views}</div>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-white leading-snug mb-1 group-hover:text-brand-200 transition-colors">{video.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{video.description}</p>
      </div>
    </motion.div>
  )
}

function BlogCard({ blog }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="group glass border border-white/5 rounded-2xl overflow-hidden card-glow hover:border-brand-700/40 cursor-pointer">
      <div className="relative h-40 overflow-hidden">
        <img src={normalizeImageUrl(blog.imageUrl, { width: 600, quality: 70 })} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => handleImageError(e)} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
        <div className="absolute top-3 left-3"><span className="property-badge">{blog.category}</span></div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-brand-200 transition-colors">{blog.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{blog.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600 flex items-center gap-1"><Clock size={9} />{blog.readTime}</span>
          <div className="flex items-center gap-1 text-xs text-brand-400 font-medium group-hover:gap-2 transition-all">Read <ArrowRight size={10} /></div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Inspirations() {
  const [videos, setVideos] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('videos')

  useEffect(() => {
    Promise.allSettled([fetchYouTubeVideos(), fetchBlogs()]).then(([vRes, bRes]) => {
      if (vRes.status === 'fulfilled') setVideos(vRes.value?.videos || [])
      if (bRes.status === 'fulfilled') setBlogs(bRes.value?.blogs || [])
      setLoading(false)
    })
  }, [])

  return (
    <section id="inspirations" className="py-20 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="orb w-80 h-80 bg-brand-800 top-0 -right-20 opacity-8" />
      <div className="section-wrapper relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-10">
          <span className="section-badge mb-4"><Sparkles size={11} /> Design Inspirations</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Stories, Walkthroughs <span className="gradient-text">&amp; Insights</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore cinematic design walkthroughs, expert articles, and interior inspiration curated by the Maison studio team.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center gap-2 mb-10">
          {[{ id: 'videos', label: 'Video Walkthroughs', icon: Play }, { id: 'blogs', label: 'Design Articles', icon: BookOpen }].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === id ? 'bg-brand-600 text-white shadow-glow-sm' : 'glass border border-white/10 text-gray-400 hover:text-white'}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass border border-white/5 rounded-2xl overflow-hidden">
                <div className="aspect-video shimmer bg-white/5" />
                <div className="p-4 space-y-2"><div className="h-4 w-3/4 shimmer bg-white/5 rounded-full" /><div className="h-3 w-full shimmer bg-white/5 rounded-full" /></div>
              </div>
            ))}
          </div>
        ) : tab === 'videos' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((v) => <VideoCard key={v.videoId} video={v} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {blogs.map((b) => <BlogCard key={b.blogId} blog={b} />)}
          </div>
        )}
      </div>
    </section>
  )
}
