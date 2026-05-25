// ─────────────────────────────────────────────
//  Maison — Centralized API Helper
//  Google Apps Script backend via text/plain POST (avoids CORS preflight)
//
//  Field conventions (JSDoc on each function is source of truth):
//  Projects    → { projectId, title, category, designStyle, materials, featured, imageUrl, description, area, budget, duration }
//  CaseStudies → { caseStudyId, title, client, summary, impact, featured, imageUrl, duration, area, style }
//  Blogs       → { blogId, title, category, summary, readTime, featured, imageUrl, date }
//  Services    → { serviceId, title, category, description, price, featured, icon }
//  Testimonials→ { id, name, title, review, rating }
//  Videos      → { videoId, title, description, youtubeId, thumbnail, duration, views, featured }
//  MediaAssets → { assetId, entityType, entityId, assetUrl, assetType, featured, caption }
//  AIInsights  → { id, category, title, body, icon, trend, trendLabel, displayOrder }
//  Metrics     → { activeProjects, consultations, completedDesigns, designInsights }
// ─────────────────────────────────────────────

import { API_URL } from './config'

async function post(payload) {
  const controller = new AbortController()
  const timeoutId  = setTimeout(() => controller.abort(), 15_000)
  try {
    const response = await fetch(API_URL, {
      method:   'POST',
      headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      signal:   controller.signal,
      body:     JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } finally {
    clearTimeout(timeoutId)
  }
}

// ── In-memory promise cache ───────────────────────────────────────────────────
// Caches the Promise itself so concurrent callers share one in-flight request.
const _cache = new Map()

function withCache(key, fetcher) {
  if (!_cache.has(key)) _cache.set(key, fetcher())
  return _cache.get(key)
}

// ── Auth ───────────────────────────────────────

/**
 * Create a new account.
 * Sheet: Users — username | password | email | phone | createdAt
 */
export async function signupUser({ username, password, email, phone }) {
  return post({ action: 'signup', username, password, email, phone })
}

/**
 * Authenticate an existing user.
 * Sheet: Users
 */
export async function loginUser({ username, password }) {
  return post({ action: 'login', username, password })
}

// ── Platform Config ────────────────────────────

/**
 * Fetch platform feature flags and configuration.
 * Sheet: PlatformConfig — key | value
 */
export function fetchPlatformConfig() {
  return withCache('platformConfig', async () => {
    try {
      return await post({ action: 'getPlatformConfig' })
    } catch {
      return {
        success: true,
        config: {
          consultationsEnabled: true,
          paymentsEnabled:      true,
          newsletterEnabled:    true,
          featuredProject:      'lux-villa-2026',
          supportEmail:         'studio@maisonstudio.in',
          bookingMode:          'online',
        },
      }
    }
  })
}

// ── Design Collections (Projects) ─────────────

/**
 * Fetch interior design project collections.
 * Sheet: Projects — projectId | title | industry | impact | technologies | featured
 * Mapped as: projectId | designTitle | category | designStyle | materials | featured
 */
export function fetchProjects({ featured } = {}) {
  return withCache('projects:' + (featured ?? 'all'), async () => {
    try {
      return await post({ action: 'getProjects', featured })
    } catch {
      return {
        success: true,
        projects: [
          {
            projectId:   'p1',
            title:       'Modern Luxury Living Room',
            category:    'Living Room',
            industry:    'Living Room',
            designStyle: 'Contemporary Luxury',
            materials:   'Italian Marble, Velvet, Brushed Brass',
            technologies:'Italian Marble, Velvet, Brushed Brass',
            impact:      'Contemporary Luxury',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80',
            description: 'Sweeping living room design with warm marble surfaces, sculptural furniture, and curated art — transforming an empty shell into an editorial-grade luxury space.',
            area:        '1,200 sq ft',
            budget:      '₹28 Lakhs',
            duration:    '6 weeks',
          },
          {
            projectId:   'p2',
            title:       'Scandinavian Luxury Bedroom',
            category:    'Bedroom',
            industry:    'Bedroom',
            designStyle: 'Scandinavian Minimal',
            materials:   'Natural Oak, Linen, Honed Stone',
            technologies:'Natural Oak, Linen, Honed Stone',
            impact:      'Scandinavian Minimal',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
            description: 'A sanctuary of calm. This master bedroom layers textures of natural oak, cloud-soft linens, and brushed stone to create an atmosphere of pure Nordic luxury.',
            area:        '650 sq ft',
            budget:      '₹18 Lakhs',
            duration:    '4 weeks',
          },
          {
            projectId:   'p3',
            title:       'Premium Modular Kitchen',
            category:    'Kitchen',
            industry:    'Kitchen',
            designStyle: 'Contemporary Modern',
            materials:   'Lacquered Wood, Quartz, Miele Appliances',
            technologies:'Lacquered Wood, Quartz, Miele Appliances',
            impact:      'Contemporary Modern',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            description: 'Floor-to-ceiling cabinetry in matte lacquer, waterfall quartz island, and integrated Miele appliances. A chef\'s kitchen that doubles as a design statement.',
            area:        '420 sq ft',
            budget:      '₹35 Lakhs',
            duration:    '5 weeks',
          },
          {
            projectId:   'p4',
            title:       'Luxury Villa Interior',
            category:    'Villa',
            industry:    'Villa',
            designStyle: 'Grand Classical',
            materials:   'Carrara Marble, Gold Hardware, Silk Drapes',
            technologies:'Carrara Marble, Gold Hardware, Silk Drapes',
            impact:      'Grand Classical',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1600607687939-ce8a6d4b6e8e?w=800&q=80',
            description: 'A complete 5BHK villa transformation spanning 6,000 sq ft — featuring Carrara marble floors, vaulted ceilings, gold-hardware finishes, and bespoke silk drapes.',
            area:        '6,000 sq ft',
            budget:      '₹1.2 Cr',
            duration:    '20 weeks',
          },
          {
            projectId:   'p5',
            title:       'Minimalist Luxury Workspace',
            category:    'Workspace',
            industry:    'Workspace',
            designStyle: 'Japandi Minimal',
            materials:   'Dark Walnut, Saddle Leather, Polished Concrete',
            technologies:'Dark Walnut, Saddle Leather, Polished Concrete',
            impact:      'Japandi Minimal',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
            description: 'A home office that inspires focus and creativity. Dark walnut desking, saddle leather chairs, and polished concrete floors create a cinematic work environment.',
            area:        '280 sq ft',
            budget:      '₹12 Lakhs',
            duration:    '3 weeks',
          },
          {
            projectId:   'p6',
            title:       'Art Deco Dining Room',
            category:    'Dining',
            industry:    'Dining',
            designStyle: 'Art Deco Contemporary',
            materials:   'Smoked Glass, Aged Brass, Pietra Grey Marble',
            technologies:'Smoked Glass, Aged Brass, Pietra Grey Marble',
            impact:      'Art Deco Contemporary',
            featured:    'no',
            imageUrl:    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
            description: 'An art-deco inspired dining space with smoked glass table, brass pendant cluster, and hand-painted feature wall — curated for the ultimate dinner party experience.',
            area:        '380 sq ft',
            budget:      '₹22 Lakhs',
            duration:    '4 weeks',
          },
          {
            projectId:   'p7',
            title:       'Penthouse Living Suite',
            category:    'Luxury Apartment',
            industry:    'Luxury Apartment',
            designStyle: 'Ultra-Modern Luxury',
            materials:   'Black Onyx, Polished Chrome, Bouclé Velvet',
            technologies:'Black Onyx, Polished Chrome, Bouclé Velvet',
            impact:      'Ultra-Modern Luxury',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
            description: 'A 4,200 sq ft penthouse reinvented. Floating staircase in black steel, onyx feature walls, and panoramic views framed by bespoke curtain systems.',
            area:        '4,200 sq ft',
            budget:      '₹2.8 Cr',
            duration:    '24 weeks',
          },
          {
            projectId:   'p8',
            title:       'Spa-Inspired Master Bath',
            category:    'Bathroom',
            industry:    'Bathroom',
            designStyle: 'Resort Spa Luxury',
            materials:   'Travertine, Teak, Rainfall Fixtures',
            technologies:'Travertine, Teak, Rainfall Fixtures',
            impact:      'Resort Spa Luxury',
            featured:    'no',
            imageUrl:    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
            description: 'A private spa experience within your home. Double rainfall showers, freestanding stone tub, heated travertine floors, and custom teak cabinetry.',
            area:        '220 sq ft',
            budget:      '₹14 Lakhs',
            duration:    '4 weeks',
          },
        ],
      }
    }
  })
}

// ── Case Studies (Home Transformations) ────────

/**
 * Fetch client home transformation case studies.
 * Sheet: CaseStudies — caseStudyId | title | client | summary | impact | featured
 */
export function fetchCaseStudies() {
  return withCache('caseStudies', async () => {
    try {
      return await post({ action: 'getCaseStudies' })
    } catch {
      return {
        success: true,
        caseStudies: [
          {
            caseStudyId: 'cs1',
            title:       '4BHK Gurugram Villa Renovation',
            client:      'Sharma Family',
            summary:     'A complete transformation of a dated 4BHK DLF villa into a contemporary luxury home. Every surface was reimagined — from hand-laid Italian marble floors to custom millwork and smart home integration across 4,800 sq ft.',
            impact:      '₹85L invested · 2.3× property value appreciation',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1600607687939-ce8a6d4b6e8e?w=800&q=80',
            duration:    '18 weeks',
            area:        '4,800 sq ft',
            style:       'Modern Luxury',
          },
          {
            caseStudyId: 'cs2',
            title:       'Luxury Penthouse Transformation',
            client:      'Mehta Enterprises',
            summary:     'Mumbai sea-facing penthouse reimagined with a bespoke art collection, floating walnut staircase, and a living room that opens to a private sky terrace — a complete lifestyle reinvention.',
            impact:      'Featured in Architectural Digest India 2025',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
            duration:    '24 weeks',
            area:        '5,200 sq ft',
            style:       'Ultra-Modern',
          },
          {
            caseStudyId: 'cs3',
            title:       'Modern Apartment Redesign',
            client:      'Krishnan Family',
            summary:     'A Bengaluru IT-corridor apartment elevated from builder-grade to bespoke. Custom modular storage, curated lighting design, and a palette of warm neutrals transformed this 2BHK into a magazine spread.',
            impact:      '94% client satisfaction · Delivered in 8 weeks',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80',
            duration:    '8 weeks',
            area:        '1,400 sq ft',
            style:       'Contemporary',
          },
          {
            caseStudyId: 'cs4',
            title:       'Heritage Bungalow Restoration',
            client:      'Oberoi Heritage Trust',
            summary:     'Careful restoration of a 1940s Lutyens bungalow — blending original architectural character with modern comfort. Custom arched doorways, hand-restored terrazzo, and craft furniture throughout.',
            impact:      'Shortlisted — India Design Awards 2025',
            featured:    'no',
            imageUrl:    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            duration:    '32 weeks',
            area:        '7,500 sq ft',
            style:       'Heritage Contemporary',
          },
        ],
      }
    }
  })
}

// ── Blogs (Interior Design Articles) ──────────

/**
 * Fetch interior design blog articles.
 * Sheet: Blogs — blogId | title | category | summary | readTime | featured
 */
export function fetchBlogs() {
  return withCache('blogs', async () => {
    try {
      return await post({ action: 'getBlogs' })
    } catch {
      return {
        success: true,
        blogs: [
          {
            blogId:   'b1',
            title:    'Luxury Interior Trends 2026',
            category: 'Trends',
            summary:  'Discover the defining design movements of 2026 — from warm minimalism and textured neutrals to the resurgence of handcrafted materials and biophilic spaces.',
            readTime: '6 min read',
            featured: 'yes',
            imageUrl: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&q=80',
            date:     '2026-04-15',
          },
          {
            blogId:   'b2',
            title:    'The Art of Layering Textures',
            category: 'Design Guide',
            summary:  'How to combine velvet, linen, marble, and raw wood to create interiors that feel rich, warm, and deeply personal — without overwhelming the senses.',
            readTime: '5 min read',
            featured: 'yes',
            imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
            date:     '2026-03-28',
          },
          {
            blogId:   'b3',
            title:    'Best Color Palettes for Luxury Interiors',
            category: 'Color Theory',
            summary:  'A curated guide to the most sophisticated color combinations — from warm off-whites and greige to moody forest greens and architectural charcoals.',
            readTime: '4 min read',
            featured: 'no',
            imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
            date:     '2026-03-10',
          },
          {
            blogId:   'b4',
            title:    'Space Optimization in Luxury Homes',
            category: 'Spatial Design',
            summary:  'How the world\'s finest interior studios create expansive-feeling spaces in compact footprints — through lighting, mirror placement, furniture scale, and material choices.',
            readTime: '7 min read',
            featured: 'yes',
            imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
            date:     '2026-02-20',
          },
        ],
      }
    }
  })
}

// ── Services (Interior Design Services) ─────────

/**
 * Fetch interior design services offered.
 * Sheet: Services — serviceId | title | category | description | price | featured
 */
export function fetchServices() {
  return withCache('services', async () => {
    try {
      return await post({ action: 'getServices' })
    } catch {
      return {
        success: true,
        services: [
          {
            serviceId:   's1',
            title:       'Full Home Interior',
            category:    'Complete Design',
            description: 'End-to-end interior design — from concept and 3D visualization to procurement, execution, and final styling. We transform your complete home.',
            price:       '₹80/sq ft onwards',
            featured:    'yes',
            icon:        'Home',
          },
          {
            serviceId:   's2',
            title:       'Luxury Modular Kitchen',
            category:    'Kitchen',
            description: 'Premium modular kitchen with European hardware, lacquered cabinetry, quartz countertops, and integrated smart appliances. Functional luxury for culinary enthusiasts.',
            price:       '₹8 Lakhs onwards',
            featured:    'yes',
            icon:        'ChefHat',
          },
          {
            serviceId:   's3',
            title:       'Living Room Design',
            category:    'Living Spaces',
            description: 'Transform your living room into a cinematic social space — curated furniture, custom upholstery, accent walls, and bespoke lighting design.',
            price:       '₹5 Lakhs onwards',
            featured:    'yes',
            icon:        'Sofa',
          },
          {
            serviceId:   's4',
            title:       '3D Visualization',
            category:    'Visualization',
            description: 'Photorealistic 3D renders and virtual walkthroughs of your space before execution begins. See your dream interior in stunning cinematic detail.',
            price:       '₹75,000 onwards',
            featured:    'yes',
            icon:        'Layers',
          },
          {
            serviceId:   's5',
            title:       'Luxury Bedroom Design',
            category:    'Bedroom',
            description: 'A private sanctuary designed around you — custom headboards, luxury linen selection, bespoke wardrobes, and ambient lighting create the perfect sleep environment.',
            price:       '₹6 Lakhs onwards',
            featured:    'yes',
            icon:        'Bed',
          },
          {
            serviceId:   's6',
            title:       'Commercial Interior Design',
            category:    'Commercial',
            description: 'Office spaces, boutique hotels, restaurants, and retail — we design commercial interiors that create lasting impressions and enhance brand identity.',
            price:       'Custom Quote',
            featured:    'yes',
            icon:        'Building2',
          },
        ],
      }
    }
  })
}

// ── Testimonials ───────────────────────────────

/**
 * Fetch client testimonials.
 * Sheet: Testimonials — id | name | title | review | rating
 */
export function fetchTestimonials() {
  return withCache('testimonials', async () => {
    try {
      return await post({ action: 'getTestimonials' })
    } catch {
      return {
        success: true,
        testimonials: [
          {
            id:     't1',
            name:   'Priya Sharma',
            title:  'Homeowner · Gurugram',
            city:   'Gurugram',
            review: 'Maison completely transformed our DLF villa. Every detail — from the hand-laid marble to the custom millwork — was executed with extraordinary precision. Our home is now regularly featured in design magazines.',
            rating: 5,
          },
          {
            id:     't2',
            name:   'Vikram Malhotra',
            title:  'Managing Director · Mumbai',
            city:   'Mumbai',
            review: 'They turned our sea-facing penthouse into a masterpiece. The floating staircase alone is a conversation piece at every dinner party. Maison doesn\'t just design spaces — they craft experiences.',
            rating: 5,
          },
          {
            id:     't3',
            name:   'Ananya Krishnan',
            title:  'Software Executive · Bengaluru',
            city:   'Bengaluru',
            review: 'I was amazed at how they transformed my compact 2BHK into something that feels like a luxury boutique hotel. The 3D visualizations helped me trust the process completely.',
            rating: 5,
          },
          {
            id:     't4',
            name:   'Rahul Oberoi',
            title:  'Entrepreneur · Delhi',
            city:   'Delhi',
            review: 'Our heritage bungalow restoration was a complex project. Maison treated it with the respect it deserved — blending original architectural character with modern luxury seamlessly.',
            rating: 5,
          },
          {
            id:     't5',
            name:   'Deepika Nair',
            title:  'Creative Director · Hyderabad',
            city:   'Hyderabad',
            review: 'The modular kitchen they designed for us is pure perfection — waterfall quartz island, integrated Miele appliances, and storage solutions I didn\'t think were possible. Worth every rupee.',
            rating: 5,
          },
        ],
      }
    }
  })
}

// ── YouTube Videos (Design Walkthroughs) ─────────

/**
 * Fetch YouTube design walkthrough videos.
 * Sheet: YouTubeVideos — videoId | title | description | youtubeId | thumbnail | duration | views | featured
 */
export function fetchYouTubeVideos() {
  return withCache('youtubeVideos', async () => {
    try {
      return await post({ action: 'getYouTubeVideos' })
    } catch {
      return {
        success: true,
        videos: [
          {
            videoId:     'v1',
            title:       'Luxury Villa Interior Walkthrough — Gurugram',
            description: 'A cinematic tour through our award-winning 4BHK Gurugram villa project — marble floors, bespoke millwork, and panoramic city views.',
            youtubeId:   'dQw4w9WgXcQ',
            thumbnail:   'https://images.unsplash.com/photo-1600607687939-ce8a6d4b6e8e?w=800&q=80',
            duration:    '8:42',
            views:       '124K views',
            featured:    'yes',
          },
          {
            videoId:     'v2',
            title:       'Modern Kitchen Design — Before & After',
            description: 'Watch our design team transform a dated builder-grade kitchen into a premium culinary studio with European cabinetry and smart appliances.',
            youtubeId:   'dQw4w9WgXcQ',
            thumbnail:   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            duration:    '12:15',
            views:       '89K views',
            featured:    'yes',
          },
          {
            videoId:     'v3',
            title:       'Penthouse Transformation — Mumbai Sea-Facing',
            description: 'From empty shell to architectural masterpiece — 24 weeks of crafting a Mumbai penthouse featured in Architectural Digest India.',
            youtubeId:   'dQw4w9WgXcQ',
            thumbnail:   'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
            duration:    '15:30',
            views:       '218K views',
            featured:    'yes',
          },
        ],
      }
    }
  })
}

// ── Media Assets (Gallery / Hero Visuals) ─────────

/**
 * Fetch media assets for galleries, hero banners, before-after images.
 * Sheet: MediaAssets — assetId | entityType | entityId | assetUrl | assetType | featured
 * @param {{ entityType?: string, entityId?: string }} params
 */
export function fetchMediaAssets({ entityType, entityId } = {}) {
  const key = `assets:${entityType ?? 'all'}:${entityId ?? 'all'}`
  return withCache(key, async () => {
    try {
      return await post({ action: 'getMediaAssets', entityType, entityId })
    } catch {
      return {
        success: true,
        assets: [
          {
            assetId:   'a1',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80',
            assetType: 'hero',
            featured:  'yes',
            caption:   'Modern luxury living room — warm palette',
          },
          {
            assetId:   'a2',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
            assetType: 'gallery',
            featured:  'yes',
            caption:   'Master bedroom — Scandinavian minimal',
          },
          {
            assetId:   'a3',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
            assetType: 'gallery',
            featured:  'no',
            caption:   'Premium modular kitchen',
          },
          {
            assetId:   'a4',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1600607687939-ce8a6d4b6e8e?w=1200&q=80',
            assetType: 'gallery',
            featured:  'no',
            caption:   'Villa interior — grand entrance',
          },
          {
            assetId:   'a5',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80',
            assetType: 'gallery',
            featured:  'no',
            caption:   'Minimalist workspace design',
          },
          {
            assetId:   'a6',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
            assetType: 'gallery',
            featured:  'no',
            caption:   'Spa-inspired master bathroom',
          },
        ],
      }
    }
  })
}

// ── AI / Design Insights ────────────────────────

/**
 * Fetch AI-generated design insights and market intelligence.
 * Sheet: AIInsights — id | category | title | body | icon | trend | trendLabel | displayOrder
 */
export async function fetchAIInsights() {
  try {
    return await post({ action: 'getAIInsights' })
  } catch {
    return {
      success: true,
      insights: [
        {
          id:           'ai1',
          category:     'Design Trend',
          title:        'Warm Minimalism Dominates 2026',
          body:         'Tactile materials — boucle, travertine, aged brass — are replacing cold modernism. Premium Indian homes are shifting from stark white to warm, layered, richly textured interiors.',
          icon:         'TrendingUp',
          trend:        '+38%',
          trendLabel:   'Demand Increase',
          displayOrder: 1,
        },
        {
          id:           'ai2',
          category:     'Market Insight',
          title:        'Luxury Renovation Market Surging',
          body:         'Premium home renovation in India projected to grow at 22% CAGR through 2028. NRI buyers driving demand for complete redesigns in Gurugram, Mumbai, and Bengaluru.',
          icon:         'BarChart2',
          trend:        '22%',
          trendLabel:   'Market CAGR',
          displayOrder: 2,
        },
        {
          id:           'ai3',
          category:     'Style Report',
          title:        'Japandi — Most Requested Aesthetic',
          body:         'The blend of Japanese wabi-sabi and Scandinavian minimalism is now the most requested luxury interior style in India, prized for its calm, disciplined, and premium sensibility.',
          icon:         'Sparkles',
          trend:        '#1',
          trendLabel:   'Requested Style',
          displayOrder: 3,
        },
        {
          id:           'ai4',
          category:     'Investment ROI',
          title:        'Interior Design Multiplies Property Value',
          body:         'Premium interior investments of ₹50–100L on luxury homes consistently yield 1.8–2.5× returns on resale value, making it one of India\'s highest-ROI lifestyle investments.',
          icon:         'TrendingUp',
          trend:        '2.3×',
          trendLabel:   'Average ROI',
          displayOrder: 4,
        },
      ],
    }
  }
}

// ── Dashboard Metrics ──────────────────────────

/**
 * Fetch design client dashboard metrics.
 * Sheet: DashboardMetrics — username | activeProjects | consultations | completedDesigns | designInsights
 */
export async function fetchDashboardMetrics(username) {
  try {
    return await post({ action: 'getDashboardMetrics', username })
  } catch {
    return {
      success: true,
      metrics: {
        activeProjects:   3,
        consultations:    8,
        completedDesigns: 12,
        designInsights:   24,
      },
    }
  }
}

// ── Booking Request (Consultations) ──────────────

/**
 * Create an interior design consultation booking request.
 * Sheet: BookingRequests — bookingId | username | serviceId | preferredDate | preferredTime | notes | status
 */
export async function createBookingRequest({ username, serviceId, preferredDate, preferredTime, notes, name, email, phone }) {
  return post({ action: 'createBookingRequest', username, serviceId, preferredDate, preferredTime, notes, name, email, phone })
}

// ── Newsletter Subscription ────────────────────

/**
 * Subscribe to the Maison design inspiration newsletter.
 * Sheet: NewsletterSubscribers — email | name | subscribedAt
 */
export async function subscribeNewsletter({ email, name }) {
  return post({ action: 'subscribeNewsletter', email, name })
}

// ── Payment Links ──────────────────────────────

/**
 * Fetch Razorpay payment links for design packages.
 * Sheet: PaymentLinks — id | title | description | amount | url | featured
 */
export function fetchPaymentLinks() {
  return withCache('paymentLinks', async () => {
    try {
      return await post({ action: 'getPaymentLinks' })
    } catch {
      return {
        success: true,
        paymentLinks: [
          {
            id:          'pl1',
            title:       'Design Consultation',
            description: '60-minute design consultation with a senior Maison designer.',
            amount:      '₹5,000',
            url:         'https://rzp.io/l/maison-consult',
            featured:    'yes',
          },
          {
            id:          'pl2',
            title:       'Full Home Design Deposit',
            description: 'Secure your full home interior design package with 10% deposit.',
            amount:      '₹50,000',
            url:         'https://rzp.io/l/maison-deposit',
            featured:    'yes',
          },
          {
            id:          'pl3',
            title:       '3D Visualization Package',
            description: 'Photorealistic 3D renders and virtual tour of your entire space.',
            amount:      '₹75,000',
            url:         'https://rzp.io/l/maison-3d',
            featured:    'yes',
          },
        ],
      }
    }
  })
}

// ── Social Links ───────────────────────────────

/**
 * Fetch social media links from the backend.
 * Sheet: SocialLinks — platform | url
 */
export function fetchSocialLinks() {
  return withCache('socialLinks', async () => {
    try {
      return await post({ action: 'getSocialLinks' })
    } catch {
      return {
        success: true,
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/maisonstudio' },
          { platform: 'pinterest', url: 'https://pinterest.com/maisonstudio' },
          { platform: 'youtube',   url: 'https://youtube.com/@maisonstudio'  },
          { platform: 'linkedin',  url: 'https://linkedin.com/company/maisonstudio' },
        ],
      }
    }
  })
}

// ── Chatbot ────────────────────────────────────

/**
 * Send a design assistant chat message.
 * @returns {{ success: boolean, response: string }}
 */
export async function sendChatMessage(query) {
  return post({ action: 'chat', query })
}

// ── General Contact / Consultation ─────────────

/**
 * Submit a general consultation or callback request.
 * Maps to createBookingRequest action so data flows into BookingRequests sheet.
 */
export async function submitContact({ name, email, phone, service, message }) {
  const notes = [
    name    ? `Name: ${name}`       : '',
    phone   ? `Phone: ${phone}`     : '',
    service ? `Service: ${service}` : '',
    message ? `Message: ${message}` : '',
  ].filter(Boolean).join(' | ')
  return post({
    action:        'createBookingRequest',
    username:      email || name || 'guest',
    serviceId:     service || '',
    preferredDate: '',
    preferredTime: '',
    notes,
  })
}
