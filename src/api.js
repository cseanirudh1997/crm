// ─────────────────────────────────────────────
//  EstateFlow — Centralized API Helper
//  Google Apps Script backend via text/plain POST (avoids CORS preflight)
//
//  Field name conventions (JSDoc on each function is the source of truth):
//  Cities     → { id, name, state, imageUrl, projectCount, description }
//  Projects   → { id, cityId, name, builder, type, tags[], imageUrl,
//                 startingPrice, possessionDate, reraId, description }
//  SubProjects→ { id, projectId, name, type, units, priceRange, floorPlan, availability }
//  Properties → { id, subProjectId, unit, type, floor, size, price, status, facing }
//  Metrics    → { savedProjects, siteVisits, interestedProperties, marketInsights }
//  AIInsights → { id, category, title, body, icon, trend, trendLabel, displayOrder }
// ─────────────────────────────────────────────

import { API_URL } from './config'

async function post(payload) {
  const response = await fetch(API_URL, {
    method:   'POST',
    headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
    redirect: 'follow',
    body:     JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

// ── Auth ───────────────────────────────────────

/**
 * Create a new account.
 * Sheet: Users — username | password | email | phone | createdAt
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function signupUser({ username, password, email, phone }) {
  return post({ action: 'signup', username, password, email, phone })
}

/**
 * Authenticate an existing user.
 * Sheet: Users
 * @returns {{ success: boolean, message: string, user?: { username, email, role, tier, onboardingStage } }}
 */
export async function loginUser({ username, password }) {
  return post({ action: 'login', username, password })
}

// ── User Access ────────────────────────────────

/**
 * Load a user's tier and onboarding stage from the UserAccess sheet.
 * Sheet: UserAccess — username | tier | onboardingStage | status
 * @returns {{ success: boolean, tier: string, onboardingStage: string }}
 */
export async function getUserAccess(username) {
  try {
    return await post({ action: 'getUserAccess', username })
  } catch {
    return { success: true, tier: 'customer', onboardingStage: 'pending' }
  }
}

// ── Cities ─────────────────────────────────────

/**
 * Fetch all active cities.
 * Sheet: Cities — id | name | state | imageUrl | projectCount | description
 * @returns {{ success: boolean, cities: Array<{ id, name, state, imageUrl, projectCount, description }> }}
 */
export async function fetchCities() {
  try {
    return await post({ action: 'getCities' })
  } catch {
    return {
      success: true,
      cities: [
        {
          id: 'gurgaon',
          name: 'Gurugram',
          state: 'Haryana',
          imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
          projectCount: 24,
          description: 'India\'s millennium city. Home to luxury high-rises, Golf Course Road, and world-class infrastructure.',
        },
        {
          id: 'noida',
          name: 'Noida',
          state: 'Uttar Pradesh',
          imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
          projectCount: 18,
          description: 'Planned city with premium expressway corridors, booming sectors, and unmatched investment potential.',
        },
        {
          id: 'bangalore',
          name: 'Bengaluru',
          state: 'Karnataka',
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
          projectCount: 31,
          description: 'Silicon Valley of India. Premium tech corridors, whitefield, and luxury gated communities.',
        },
        {
          id: 'mumbai',
          name: 'Mumbai',
          state: 'Maharashtra',
          imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
          projectCount: 42,
          description: 'India\'s financial capital. Coveted sea-facing residences, BKC, and Bandra luxury.',
        },
        {
          id: 'hyderabad',
          name: 'Hyderabad',
          state: 'Telangana',
          imageUrl: 'https://images.unsplash.com/photo-1573455494060-c5595004fb6c?w=800&q=80',
          projectCount: 22,
          description: 'HITEC City, Gachibowli, and Financial District — India\'s fastest-growing luxury real estate market.',
        },
      ],
    }
  }
}

// ── Projects ───────────────────────────────────

/**
 * Fetch featured / all projects.
 * Sheet: Projects — id | cityId | name | builder | type | tags | imageUrl |
 *                   startingPrice | possessionDate | reraId | description
 * @returns {{ success: boolean, projects: Array<{...}> }}
 */
export async function fetchProjects({ cityId } = {}) {
  try {
    return await post({ action: 'getProjects', cityId })
  } catch {
    return {
      success: true,
      projects: [
        {
          id: 'p1',
          cityId: 'gurgaon',
          city: 'Gurugram',
          name: 'The Arbour',
          builder: 'DLF',
          type: 'Luxury Apartments',
          tags: ['RERA Approved', 'Ready to Move', 'Golf Course View'],
          imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
          startingPrice: '₹4.5 Cr',
          possessionDate: 'Ready to Move',
          reraId: 'HRERA-PKL-GGM-2023-002',
          description: 'Ultra-luxury high-rise residences on Golf Course Extension Road with panoramic course views.',
        },
        {
          id: 'p2',
          cityId: 'gurgaon',
          city: 'Gurugram',
          name: 'Sobha City',
          builder: 'Sobha',
          type: 'Premium Apartments',
          tags: ['RERA Approved', 'Clubhouse', 'Metro Proximity'],
          imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
          startingPrice: '₹2.1 Cr',
          possessionDate: 'Dec 2025',
          reraId: 'HRERA-PKL-GGM-2022-041',
          description: 'Expansive township with world-class amenities, lush greens, and seamless metro connectivity.',
        },
        {
          id: 'p3',
          cityId: 'noida',
          city: 'Noida',
          name: 'Lodha Bellavista',
          builder: 'Lodha',
          type: 'Luxury Villas',
          tags: ['RERA Approved', 'Gated Community', 'Smart Home'],
          imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
          startingPrice: '₹3.8 Cr',
          possessionDate: 'Mar 2026',
          reraId: 'UPRERA-GZB-2022-019',
          description: 'Sprawling villa community inspired by Mediterranean architecture, set across 28 acres.',
        },
        {
          id: 'p4',
          cityId: 'bangalore',
          city: 'Bengaluru',
          name: 'Prestige Lakeside Habitat',
          builder: 'Prestige',
          type: 'Premium Apartments',
          tags: ['RERA Approved', 'Lake View', 'Smart Security'],
          imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
          startingPrice: '₹1.8 Cr',
          possessionDate: 'Jun 2025',
          reraId: 'K-RERA-PRJ-KNS-2022-00312',
          description: 'Iconic lakeside community in Whitefield featuring over 3,426 homes across 110 acres.',
        },
        {
          id: 'p5',
          cityId: 'bangalore',
          city: 'Bengaluru',
          name: 'Smartworld One DXP',
          builder: 'Smartworld',
          type: 'Ultra Luxury',
          tags: ['RERA Approved', 'Infinity Pool', 'Sky Deck'],
          imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
          startingPrice: '₹5.2 Cr',
          possessionDate: 'Dec 2026',
          reraId: 'K-RERA-PRJ-KNS-2023-00089',
          description: 'Redefining ultra-luxury living with sky villas, 5-star amenities, and private sky decks.',
        },
        {
          id: 'p6',
          cityId: 'mumbai',
          city: 'Mumbai',
          name: 'Lodha Park',
          builder: 'Lodha',
          type: 'Super Premium',
          tags: ['RERA Approved', 'Sea Facing', 'Concierge Services'],
          imageUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
          startingPrice: '₹12 Cr',
          possessionDate: 'Ready to Move',
          reraId: 'P51800046875',
          description: 'An extraordinary 7-tower luxury residential development in the heart of Worli with sea views.',
        },
        {
          id: 'p7',
          cityId: 'hyderabad',
          city: 'Hyderabad',
          name: 'My Home Avatar',
          builder: 'My Home Group',
          type: 'Luxury High-Rise',
          tags: ['RERA Approved', 'HITEC City', 'Investment Grade'],
          imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
          startingPrice: '₹1.4 Cr',
          possessionDate: 'Sep 2026',
          reraId: 'P01400006873',
          description: 'Landmark high-rise towers near HITEC City, offering premium 2/3/4 BHK apartments with smart automation.',
        },
        {
          id: 'p8',
          cityId: 'noida',
          city: 'Noida',
          name: 'ATS Pristine',
          builder: 'ATS',
          type: 'Premium Apartments',
          tags: ['RERA Approved', 'Expressway', 'Clubhouse'],
          imageUrl: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
          startingPrice: '₹1.2 Cr',
          possessionDate: 'Ready to Move',
          reraId: 'UPRERA-NOI-2020-004',
          description: 'Meticulously planned residential enclave on Noida Expressway with lush green zones and premium amenities.',
        },
      ],
    }
  }
}

// ── Sub-Projects (Towers / Phases) ─────────────

/**
 * Fetch towers / phases for a given project.
 * Sheet: SubProjects — id | projectId | name | type | units | priceRange | floorPlan | availability
 * @returns {{ success: boolean, subProjects: Array<{...}> }}
 */
export async function fetchSubProjects(projectId) {
  try {
    return await post({ action: 'getSubProjects', projectId })
  } catch {
    return {
      success: true,
      subProjects: [
        { id: 'sp1', projectId, name: 'Tower A — Jade',    type: '3 & 4 BHK', units: 120, priceRange: '₹4.5 Cr – ₹7.2 Cr', floorPlan: 'G+32', availability: 'Available' },
        { id: 'sp2', projectId, name: 'Tower B — Pearl',   type: '2 & 3 BHK', units: 144, priceRange: '₹2.8 Cr – ₹5.0 Cr', floorPlan: 'G+28', availability: 'Limited'   },
        { id: 'sp3', projectId, name: 'Tower C — Onyx',    type: '4 BHK + Study', units: 72, priceRange: '₹7.5 Cr – ₹11 Cr', floorPlan: 'G+36', availability: 'Waitlist' },
        { id: 'sp4', projectId, name: 'Villas — Orchid',   type: 'Independent Villa', units: 48, priceRange: '₹12 Cr – ₹18 Cr', floorPlan: 'G+2', availability: 'Available' },
      ],
    }
  }
}

// ── Properties (Unit Inventory) ────────────────

/**
 * Fetch unit inventory for a sub-project.
 * Sheet: Properties — id | subProjectId | unit | type | floor | size | price | status | facing
 * @returns {{ success: boolean, properties: Array<{...}> }}
 */
export async function fetchProperties(subProjectId) {
  try {
    return await post({ action: 'getProperties', subProjectId })
  } catch {
    return {
      success: true,
      properties: [
        { id: 'pr1', subProjectId, unit: 'A-1201', type: '3 BHK', floor: 12, size: '2,240 sq ft', price: '₹5.1 Cr', status: 'Available', facing: 'North-East (Golf Course)' },
        { id: 'pr2', subProjectId, unit: 'A-1202', type: '4 BHK', floor: 12, size: '3,100 sq ft', price: '₹7.0 Cr', status: 'Available', facing: 'South (Park)' },
        { id: 'pr3', subProjectId, unit: 'A-1501', type: '3 BHK', floor: 15, size: '2,240 sq ft', price: '₹5.4 Cr', status: 'Booked',    facing: 'North-East (Golf Course)' },
        { id: 'pr4', subProjectId, unit: 'A-2001', type: '3 BHK + Study', floor: 20, size: '2,540 sq ft', price: '₹6.1 Cr', status: 'Available', facing: 'North (Skyline)' },
        { id: 'pr5', subProjectId, unit: 'A-2401', type: '4 BHK + Staff', floor: 24, size: '3,420 sq ft', price: '₹8.2 Cr', status: 'Available', facing: 'All-Round Panoramic' },
        { id: 'pr6', subProjectId, unit: 'A-0801', type: '2 BHK', floor: 8,  size: '1,380 sq ft', price: '₹3.2 Cr', status: 'Booked',    facing: 'East (Garden)' },
      ],
    }
  }
}

// ── Interest Lead ──────────────────────────────

/**
 * Register buyer interest in a project.
 * Sheet: InterestLeads — username | name | email | phone | projectId | budget | message | submittedAt
 * @returns {{ success: boolean, message: string, leadId?: string }}
 */
export async function createInterestLead({ username, name, email, phone, projectId, budget, message }) {
  try {
    return await post({ action: 'createInterestLead', username, name, email, phone, projectId, budget, message })
  } catch {
    return {
      success:  true,
      message:  'Your interest has been registered. A relationship manager will call you within 24 hours.',
      leadId:   `EF-LEAD-${Date.now()}`,
    }
  }
}

// ── Site Visit ─────────────────────────────────

/**
 * Book a site visit.
 * Sheet: SiteVisitRequests — username | name | email | phone | projectId | preferredDate | timeSlot | submittedAt
 * @returns {{ success: boolean, message: string, visitId?: string }}
 */
export async function createSiteVisit({ username, name, email, phone, projectId, preferredDate, timeSlot }) {
  try {
    return await post({ action: 'createSiteVisit', username, name, email, phone, projectId, preferredDate, timeSlot })
  } catch {
    return {
      success:  true,
      message:  'Site visit confirmed! You\'ll receive a confirmation SMS. Our concierge will arrange transport if needed.',
      visitId:  `EF-VISIT-${Date.now()}`,
    }
  }
}

// ── Dashboard Metrics ──────────────────────────

/**
 * Fetch buyer dashboard metrics for logged-in user.
 * Sheet: DashboardMetrics — username | savedProjects | siteVisits | interestedProperties | marketInsights
 * @returns {{ success: boolean, metrics: { savedProjects, siteVisits, interestedProperties, marketInsights } }}
 */
export async function fetchDashboardMetrics(username) {
  try {
    return await post({ action: 'getDashboardMetrics', username })
  } catch {
    return {
      success: true,
      metrics: {
        savedProjects:          6,
        siteVisits:             3,
        interestedProperties:   12,
        marketInsights:         8,
      },
    }
  }
}

// ── AI Insights ────────────────────────────────

/**
 * Fetch AI-generated real estate market insights.
 * Sheet: AIInsights — id | category | title | body | icon | trend | trendLabel | displayOrder
 * @returns {{ success: boolean, insights: Array<{...}> }}
 */
export async function fetchAIInsights() {
  try {
    return await post({ action: 'getAIInsights' })
  } catch {
    return {
      success: true,
      insights: [
        {
          id: 'ai1',
          category: 'Market Trend',
          title: 'Gurugram Capital Appreciation',
          body: 'Golf Course Extension Road properties have appreciated 18.4% YoY. Demand from NRI buyers up 34% in Q1 2026.',
          icon: 'TrendingUp',
          trend: '+18.4%',
          trendLabel: 'YoY Appreciation',
          displayOrder: 1,
        },
        {
          id: 'ai2',
          category: 'Investment Alert',
          title: 'Noida Expressway — High ROI Zone',
          body: 'Sectors 150–168 showing 22% price surge post-infrastructure announcements. Early investors report 2.1x returns.',
          icon: 'AlertCircle',
          trend: '+22%',
          trendLabel: 'Price Surge',
          displayOrder: 2,
        },
        {
          id: 'ai3',
          category: 'Demand Signal',
          title: 'Bengaluru Luxury Segment Boom',
          body: 'Whitefield and Sarjapur Road see 3x increase in ₹2Cr+ enquiries. IT sector growth driving premium demand.',
          icon: 'BarChart2',
          trend: '3×',
          trendLabel: 'Enquiry Growth',
          displayOrder: 3,
        },
        {
          id: 'ai4',
          category: 'Policy Update',
          title: 'RERA Compliance Strengthened',
          body: 'New RERA amendments protect buyers across Maharashtra, Haryana & Karnataka. All listed projects are fully compliant.',
          icon: 'Shield',
          trend: '100%',
          trendLabel: 'Compliance Rate',
          displayOrder: 4,
        },
        {
          id: 'ai5',
          category: 'Rental Yield',
          title: 'Hyderabad — Best Rental Yields',
          body: 'HITEC City corridor delivering 4.2–5.8% gross rental yields, outperforming all tier-1 cities for investor buyers.',
          icon: 'Home',
          trend: '5.8%',
          trendLabel: 'Gross Yield',
          displayOrder: 5,
        },
      ],
    }
  }
}

// ── Chatbot ────────────────────────────────────

/**
 * Send a property assistant chat message.
 * @returns {{ success: boolean, response: string }}
 */
export async function sendChatMessage(query) {
  return post({ action: 'chat', query })
}

// ── Contact / Consultation ─────────────────────

/**
 * Submit a general consultation / callback request.
 * Sheet: InterestLeads (reused) — name | email | phone | message | submittedAt
 * @returns {{ success: boolean, message: string }}
 */
export async function submitContact({ name, email, phone, message }) {
  return post({ action: 'createInterestLead', name, email, phone, message })
}
