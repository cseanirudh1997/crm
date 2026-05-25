// ─────────────────────────────────────────────
//  VN.AI — Centralized API Helper
//  Google Apps Script backend via text/plain POST (avoids CORS preflight)
//
//  Field conventions (JSDoc on each function is source of truth):
//  Projects         → { projectId, title, industry, impact, technologies, featured, imageUrl, description }
//  CaseStudies      → { caseStudyId, title, client, summary, impact, featured, imageUrl, duration }
//  Blogs            → { blogId, title, category, summary, readTime, featured, imageUrl, date }
//  Services         → { serviceId, title, category, description, price, featured, icon }
//  Testimonials     → { id, name, title, review, rating }
//  Videos           → { videoId, title, description, youtubeId, thumbnail, duration, views, featured }
//  MediaAssets      → { assetId, entityType, entityId, assetUrl, assetType, featured, caption }
//  AIInsights       → { timestamp, insight, severity }
//  Metrics          → { profileViews, mentorshipCalls, bookings, newsletterSubscribers }
//  PaymentLinks     → { paymentId, title, amount, paymentUrl, active }
//  SpeakingEvents   → { eventId, title, event, date, location, topic, recordingUrl }
//  Publications     → { pubId, title, publisher, date, url, type, featured }
//  Certifications   → { certId, title, issuer, date, credentialUrl, featured }
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
          featuredProject:      'pricing-ai-2026',
          supportEmail:         'connect@vnai.in',
          bookingMode:          'online',
        },
      }
    }
  })
}

// ── AI Projects ────────────────────────────────

/**
 * Fetch AI/ML enterprise projects.
 * Sheet: Projects — projectId | title | industry | impact | technologies | featured
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
            projectId:    'p1',
            title:        'Enterprise Pricing Intelligence Platform',
            industry:     'Retail & E-commerce',
            category:     'Pricing AI',
            impact:       '18% revenue uplift · $42M incremental GMV · 99.9% uptime',
            designStyle:  'Pricing AI',
            technologies: 'XGBoost, PySpark, Kafka, AWS SageMaker',
            materials:    'XGBoost, PySpark, Kafka, AWS SageMaker',
            featured:     'yes',
            imageUrl:     'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            description:  'Real-time dynamic pricing engine serving 50M+ SKUs. ML model ensemble combining demand elasticity, competitor signals, and inventory state — deployed on SageMaker with sub-100ms inference.',
            duration:     '8 months',
            area:         '50M+ SKUs',
            budget:       'Enterprise',
          },
          {
            projectId:    'p2',
            title:        'GenAI Content Intelligence System',
            industry:     'Media & Publishing',
            category:     'GenAI',
            impact:       '74% content ops cost reduction · 3× throughput improvement',
            designStyle:  'GenAI',
            technologies: 'LangChain, GPT-4, RAG, Pinecone, FastAPI',
            materials:    'LangChain, GPT-4, RAG, Pinecone, FastAPI',
            featured:     'yes',
            imageUrl:     'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
            description:  'End-to-end GenAI content pipeline with multi-modal RAG. Automates brief-to-draft workflows using domain-tuned LLMs, vector retrieval, and a custom evaluation harness for quality gating.',
            duration:     '6 months',
            area:         '200K+ articles/month',
            budget:       'Enterprise',
          },
          {
            projectId:    'p3',
            title:        'Real-Time Fraud Detection Engine',
            industry:     'FinTech',
            category:     'MLOps',
            impact:       '96.8% precision · $8M fraud prevented · <5ms p99 latency',
            designStyle:  'MLOps',
            technologies: 'Gradient Boosting, Flink, Redis, Kubernetes, Grafana',
            materials:    'Gradient Boosting, Flink, Redis, Kubernetes, Grafana',
            featured:     'yes',
            imageUrl:     'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
            description:  'Streaming ML fraud detection on 2M+ transactions/day. Graph-based feature engineering captures behavioral patterns across device, geo, and velocity signals with real-time model serving via Kubernetes.',
            duration:     '5 months',
            area:         '2M+ tx/day',
            budget:       'Enterprise',
          },
          {
            projectId:    'p4',
            title:        'Customer Churn Prediction & Intervention',
            industry:     'Telecom',
            category:     'Predictive AI',
            impact:       '22% churn reduction · 4.1× retention ROI',
            designStyle:  'Predictive AI',
            technologies: 'LightGBM, SHAP, MLflow, Airflow, Tableau',
            materials:    'LightGBM, SHAP, MLflow, Airflow, Tableau',
            featured:     'yes',
            imageUrl:     'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
            description:  'Explainable churn model with SHAP-driven intervention playbooks. Integrates behavioral, billing, and NPS signals across 12M subscribers. Model-in-the-loop decision engine triggers personalized retention campaigns.',
            duration:     '4 months',
            area:         '12M subscribers',
            budget:       'Enterprise',
          },
          {
            projectId:    'p5',
            title:        'Demand Forecasting & Inventory Optimization',
            industry:     'Supply Chain',
            category:     'Forecasting',
            impact:       '31% stockout reduction · $15M inventory cost saved',
            designStyle:  'Forecasting',
            technologies: 'Prophet, DeepAR, Optuna, Databricks, dbt',
            materials:    'Prophet, DeepAR, Optuna, Databricks, dbt',
            featured:     'yes',
            imageUrl:     'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
            description:  'Hierarchical time-series forecasting across 800K+ SKUs and 3,000+ store locations. Ensemble model with automatic seasonality, event-calendar features, and Bayesian hyperparameter optimization via Optuna.',
            duration:     '7 months',
            area:         '800K+ SKUs',
            budget:       'Enterprise',
          },
          {
            projectId:    'p6',
            title:        'NLP Document Intelligence Platform',
            industry:     'Legal & Enterprise',
            category:     'NLP',
            impact:       '89% manual review reduction · 10× processing speed',
            designStyle:  'NLP',
            technologies: 'BERT, Hugging Face, Elasticsearch, FastAPI, Docker',
            materials:    'BERT, Hugging Face, Elasticsearch, FastAPI, Docker',
            featured:     'no',
            imageUrl:     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
            description:  'Contract intelligence platform using fine-tuned BERT for clause extraction, risk classification, and obligation tracking. Processes 50,000+ pages/day with 94% extraction accuracy on complex legal documents.',
            duration:     '6 months',
            area:         '50K+ pages/day',
            budget:       'Enterprise',
          },
          {
            projectId:    'p7',
            title:        'Personalization Engine for D2C Platform',
            industry:     'D2C Retail',
            category:     'Personalization',
            impact:       '28% CTR lift · 19% basket size increase',
            designStyle:  'Personalization',
            technologies: 'Two-Tower Model, ALS, Feast, Redis, A/B Testing',
            materials:    'Two-Tower Model, ALS, Feast, Redis, A/B Testing',
            featured:     'yes',
            imageUrl:     'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            description:  'Real-time personalization across homepage, search, and email channels for 8M users. Two-tower neural retrieval with ALS-based collaborative filtering, online feature serving via Feast, and rigorous A/B test framework.',
            duration:     '9 months',
            area:         '8M users',
            budget:       'Enterprise',
          },
          {
            projectId:    'p8',
            title:        'Computer Vision Quality Control System',
            industry:     'Manufacturing',
            category:     'Computer Vision',
            impact:       '99.2% defect detection rate · 67% QC labor reduction',
            designStyle:  'Computer Vision',
            technologies: 'YOLOv8, OpenCV, TensorRT, Edge AI, MQTT',
            materials:    'YOLOv8, OpenCV, TensorRT, Edge AI, MQTT',
            featured:     'no',
            imageUrl:     'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80',
            description:  'Edge-deployed computer vision pipeline for real-time manufacturing defect detection. YOLOv8 model optimized with TensorRT for 30fps inference on NVIDIA Jetson hardware across 14 production lines.',
            duration:     '5 months',
            area:         '14 production lines',
            budget:       'Enterprise',
          },
        ],
      }
    }
  })
}

// ── Enterprise AI Case Studies ─────────────────

/**
 * Fetch enterprise AI transformation case studies.
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
            title:       'From Manual Pricing to Real-Time AI Engine',
            client:      'Fortune 500 Retailer',
            summary:     'Replaced a rules-based weekly pricing process with a real-time ML ensemble serving 50M+ SKUs. Built from data strategy through SageMaker deployment — including a custom drift-detection layer and explainability dashboard for merchant teams.',
            impact:      '$42M incremental GMV · 18% revenue uplift · 40% pricing ops headcount reduction',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            duration:    '8 months end-to-end',
            style:       'Pricing AI',
            area:        '50M+ SKUs',
          },
          {
            caseStudyId: 'cs2',
            title:       'Scaling GenAI Across a 200-Person Content Team',
            client:      'Global Media Company',
            summary:     'Designed and deployed a RAG-powered content intelligence platform enabling editorial teams to produce 3× volume at 74% lower cost. Included LLM fine-tuning on proprietary style guides, multi-stage quality evaluation, and editor-in-the-loop human review workflows.',
            impact:      '74% content ops cost reduction · 3× throughput · 98% editorial quality score',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
            duration:    '6 months',
            style:       'GenAI',
            area:        '200K articles/month',
          },
          {
            caseStudyId: 'cs3',
            title:       'AI-First Churn Prevention for 12M Telecom Subscribers',
            client:      'Tier-1 Telecom Operator',
            summary:     'Architected an end-to-end churn prediction and intervention system. Unified behavioral, billing, and NPS signals into a feature platform — deployed LightGBM with SHAP explanations and model-in-the-loop campaign triggers integrated with CRM automation.',
            impact:      '22% churn reduction · 4.1× retention campaign ROI · 97.3% model AUC',
            featured:    'yes',
            imageUrl:    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
            duration:    '4 months',
            style:       'Predictive AI',
            area:        '12M subscribers',
          },
          {
            caseStudyId: 'cs4',
            title:       'Intelligent Demand Forecasting Across 800K SKUs',
            client:      'Pan-India FMCG Distributor',
            summary:     'Replaced spreadsheet-based forecasting with a hierarchical DeepAR model stack on Databricks. Automated data pipeline from ERP to forecast-to-replenishment in under 4 hours, with Grafana dashboards for supply planners and configurable overrides.',
            impact:      '31% stockout reduction · $15M inventory cost saved annually · 3-hour forecast refresh',
            featured:    'no',
            imageUrl:    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
            duration:    '7 months',
            style:       'Forecasting',
            area:        '800K+ SKUs',
          },
        ],
      }
    }
  })
}

// ── AI/ML Articles & Publications ─────────────

/**
 * Fetch AI/ML blog articles and publications.
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
            title:    'Building Production-Grade RAG Systems: Lessons from 10M+ Queries',
            category: 'GenAI',
            summary:  'What nobody tells you about RAG in production — chunking strategies, embedding model selection, reranking pipelines, evaluation harnesses, and the hidden failure modes that kill user trust at scale.',
            readTime: '12 min read',
            featured: 'yes',
            imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
            date:     '2026-04-10',
          },
          {
            blogId:   'b2',
            title:    'Pricing AI That Actually Ships: A Practitioner\'s Framework',
            category: 'Pricing AI',
            summary:  'From elasticity estimation to competitive signal fusion and multi-objective optimization — a complete practitioner\'s guide to building pricing AI systems that survive real-world data chaos and org politics.',
            readTime: '15 min read',
            featured: 'yes',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            date:     '2026-03-22',
          },
          {
            blogId:   'b3',
            title:    'MLOps in 2026: The Stack Every Senior DS Should Know',
            category: 'MLOps',
            summary:  'A practitioner\'s review of the modern MLOps landscape — feature stores, model registries, drift detection, online serving architectures, and what separates ML teams that ship from those stuck in notebook hell.',
            readTime: '10 min read',
            featured: 'no',
            imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80',
            date:     '2026-03-05',
          },
          {
            blogId:   'b4',
            title:    'SHAP vs LIME vs Integrated Gradients: When to Use What',
            category: 'Explainable AI',
            summary:  'A rigorous comparison of explainability methods across tabular, text, and image models. Includes implementation gotchas, computational trade-offs, and when "explainability theater" does more harm than good.',
            readTime: '8 min read',
            featured: 'yes',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            date:     '2026-02-15',
          },
        ],
      }
    }
  })
}

// ── AI Consulting Services ─────────────────────

/**
 * Fetch AI consulting and mentorship services.
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
            title:       'Enterprise AI Strategy',
            category:    'Consulting',
            description: 'End-to-end AI roadmap for your organization — from use-case prioritization and build-vs-buy analysis to team structure, data infrastructure, and board-ready ROI frameworks.',
            price:       'From ₹2.5L / engagement',
            featured:    'yes',
            icon:        'Brain',
          },
          {
            serviceId:   's2',
            title:       'GenAI System Design',
            category:    'Architecture',
            description: 'Custom GenAI architecture design — RAG pipelines, LLM orchestration, fine-tuning strategy, evaluation harnesses, and production deployment playbooks for real-world scale.',
            price:       'From ₹1.5L / engagement',
            featured:    'yes',
            icon:        'Cpu',
          },
          {
            serviceId:   's3',
            title:       'Pricing AI Consulting',
            category:    'Pricing & Revenue',
            description: 'Specialized consulting for retail/e-commerce pricing intelligence — elasticity modeling, competitive signal fusion, markdown optimization, and real-time inference architecture.',
            price:       'From ₹2L / engagement',
            featured:    'yes',
            icon:        'TrendingUp',
          },
          {
            serviceId:   's4',
            title:       '1-on-1 AI/ML Mentorship',
            category:    'Mentorship',
            description: 'Structured mentorship for data scientists targeting senior DS, principal, or staff roles. Covers system design, ML fundamentals, portfolio review, and personalized career acceleration strategy.',
            price:       '₹8,000 / session',
            featured:    'yes',
            icon:        'Users',
          },
          {
            serviceId:   's5',
            title:       'Mock Interviews & Prep',
            category:    'Interview Prep',
            description: 'Realistic mock interviews for top-tier DS/ML roles at FAANG, Walmart, Flipkart, and unicorn startups. Covers ML design rounds, case studies, coding, and behavioral — with detailed written feedback.',
            price:       '₹5,000 / session',
            featured:    'yes',
            icon:        'MessageSquare',
          },
          {
            serviceId:   's6',
            title:       'AI/ML Team Workshops',
            category:    'Workshop',
            description: 'Full-day or multi-day workshops for data science teams — GenAI fundamentals, MLOps best practices, pricing AI, responsible AI, and hands-on project-based learning for cross-functional teams.',
            price:       'Custom Quote',
            featured:    'yes',
            icon:        'BookOpen',
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
            name:   'Arjun Mehta',
            title:  'Senior Data Scientist · Flipkart',
            city:   'Bengaluru',
            review: 'The 1-on-1 mentorship sessions completely changed my trajectory. I went from a mid-level DS to a Staff Data Scientist at Flipkart in under 8 months. The ML system design coaching was unlike anything I found online.',
            rating: 5,
          },
          {
            id:     't2',
            name:   'Priya Nair',
            title:  'VP Engineering · Unicorn Startup',
            city:   'Mumbai',
            review: 'We hired this team for an enterprise GenAI strategy engagement. In 6 weeks they helped us evaluate 12 use cases, build a POC scoring framework, and presented a board-ready AI roadmap. Exceptional depth and speed.',
            rating: 5,
          },
          {
            id:     't3',
            name:   'Rohan Gupta',
            title:  'ML Engineer → Data Science Lead · Swiggy',
            city:   'Bengaluru',
            review: 'The mock interview prep was brutally honest and incredibly useful. Went through 4 mock FAANG-style rounds and got specific written feedback after each. Cracked my dream role at Amazon 3 months later.',
            rating: 5,
          },
          {
            id:     't4',
            name:   'Kavya Reddy',
            title:  'Chief Data Officer · BFSI Company',
            city:   'Hyderabad',
            review: 'Brought this team in for a pricing AI consulting engagement. They transformed a decade-old rules engine into a live ML system in 8 months — delivered $42M incremental GMV in the first quarter. Exceptional ROI.',
            rating: 5,
          },
          {
            id:     't5',
            name:   'Siddharth Joshi',
            title:  'Principal Data Scientist · Walmart Global Tech',
            city:   'Gurugram',
            review: 'The GenAI workshop for our 30-person DS team was perfectly calibrated — practical, opinionated, and immediately applicable. Weeks later our team had shipped 3 GenAI POCs that are now in production.',
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
            title:       'Building a Real-Time Pricing AI System from Scratch',
            description: 'Complete walkthrough of designing and deploying a production pricing ML system — data architecture, feature engineering, model ensembling, SageMaker deployment, and drift monitoring.',
            youtubeId:   'dQw4w9WgXcQ',
            thumbnail:   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
            duration:    '42:18',
            views:       '87K views',
            featured:    'yes',
          },
          {
            videoId:     'v2',
            title:       'RAG vs Fine-Tuning: When to Use Which for Enterprise GenAI',
            description: 'A practitioner\'s deep dive into choosing between RAG and fine-tuning for different GenAI use cases — with live demos, cost analysis, and latency benchmarks on real production data.',
            youtubeId:   'dQw4w9WgXcQ',
            thumbnail:   'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
            duration:    '38:55',
            views:       '124K views',
            featured:    'yes',
          },
          {
            videoId:     'v3',
            title:       'Staff DS Interview: Live ML System Design Mock Round',
            description: 'Full 45-minute mock ML system design interview for a Staff Data Scientist role. Covers feature stores, model serving, A/B testing, and the feedback loop — with detailed review commentary.',
            youtubeId:   'dQw4w9WgXcQ',
            thumbnail:   'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
            duration:    '48:22',
            views:       '63K views',
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
            assetUrl:  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
            assetType: 'hero',
            featured:  'yes',
            caption:   'Keynote at DataHack Summit 2026 — Bengaluru',
          },
          {
            assetId:   'a2',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1200&q=80',
            assetType: 'gallery',
            featured:  'yes',
            caption:   'Workshop session — GenAI for Enterprise teams',
          },
          {
            assetId:   'a3',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80',
            assetType: 'gallery',
            featured:  'no',
            caption:   'AI career mentorship 1:1 coaching session',
          },
          {
            assetId:   'a4',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
            assetType: 'gallery',
            featured:  'no',
            caption:   'Pricing AI dashboard — real-time ML inference',
          },
          {
            assetId:   'a5',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
            assetType: 'gallery',
            featured:  'no',
            caption:   'GenAI system architecture — RAG pipeline design',
          },
          {
            assetId:   'a6',
            entityType,
            entityId,
            assetUrl:  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80',
            assetType: 'gallery',
            featured:  'no',
            caption:   'Speaking panel — NeurIPS Industry Track, Vancouver',
          },
        ],
      }
    }
  })
}

// ── AI Insights (Platform Intelligence) ────────

/**
 * Fetch AI-generated platform insights and intelligence.
 * Sheet: AIInsights — timestamp | insight | severity
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
          timestamp:    new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          insight:      'Profile views up 34% this week — GenAI content is outperforming MLOps by 2.8×. Consider publishing your RAG article this week.',
          severity:     'info',
          category:     'Growth',
          title:        'Content Performance Surge',
          body:         'Profile views up 34% this week — GenAI content is outperforming MLOps by 2.8×.',
          icon:         'TrendingUp',
          trend:        '+34%',
          trendLabel:   'Profile Views',
          displayOrder: 1,
        },
        {
          id:           'ai2',
          timestamp:    new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          insight:      '3 unread mentorship inquiry emails — 2 from senior DS candidates targeting FAANG roles. Respond within 24h for best conversion.',
          severity:     'warning',
          category:     'Mentorship',
          title:        'New Mentorship Inquiries',
          body:         '3 unread mentorship inquiry emails — 2 from senior DS candidates targeting FAANG roles.',
          icon:         'Users',
          trend:        '3 new',
          trendLabel:   'Inquiries',
          displayOrder: 2,
        },
        {
          id:           'ai3',
          timestamp:    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          insight:      'Newsletter open rate this month: 68% — industry benchmark is 22%. Your pricing AI series has the highest engagement.',
          severity:     'success',
          category:     'Newsletter',
          title:        'Newsletter Outperforming Benchmark',
          body:         'Newsletter open rate: 68% vs 22% industry benchmark. Pricing AI series leads engagement.',
          icon:         'BarChart2',
          trend:        '68%',
          trendLabel:   'Open Rate',
          displayOrder: 3,
        },
        {
          id:           'ai4',
          timestamp:    new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          insight:      'Upcoming speaking slot at DataHack Summit confirmed. Add the event to your profile and share on LinkedIn for maximum visibility.',
          severity:     'info',
          category:     'Speaking',
          title:        'Speaking Engagement Confirmed',
          body:         'DataHack Summit speaking slot confirmed. Update profile and share on LinkedIn.',
          icon:         'Sparkles',
          trend:        'Live',
          trendLabel:   'Event Status',
          displayOrder: 4,
        },
      ],
    }
  }
}

// ── Dashboard Metrics ──────────────────────────

/**
 * Fetch AI platform dashboard metrics.
 * Sheet: DashboardMetrics — date | profileViews | mentorshipCalls | bookings | newsletterSubscribers
 */
export async function fetchDashboardMetrics(username) {
  try {
    return await post({ action: 'getDashboardMetrics', username })
  } catch {
    return {
      success: true,
      metrics: {
        profileViews:          1284,
        mentorshipCalls:       48,
        bookings:              12,
        newsletterSubscribers: 1342,
        // Legacy fallback field names (kept for dashboard backward compat)
        activeProjects:        8,
        consultations:         12,
        completedDesigns:      48,
        designInsights:        1284,
      },
    }
  }
}

// ── Booking Request (Consultations) ──────────────

/**
 * Create an AI strategy session / consultation booking request.
 * Sheet: BookingRequests — bookingId | username | serviceId | preferredDate | preferredTime | notes | status
 */
export async function createBookingRequest({ username, serviceId, preferredDate, preferredTime, notes, name, email, phone }) {
  return post({ action: 'createBookingRequest', username, serviceId, preferredDate, preferredTime, notes, name, email, phone })
}

// ── Newsletter Subscription ────────────────────

/**
 * Subscribe to the VN.AI weekly GenAI & AI career newsletter.
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
            paymentId:   'pl1',
            id:          'pl1',
            title:       'AI Strategy Session',
            description: '60-minute 1-on-1 AI strategy consultation — enterprise AI roadmap, use-case scoping, or team assessment.',
            amount:      '₹8,000',
            paymentUrl:  'https://rzp.io/l/vnai-strategy',
            url:         'https://rzp.io/l/vnai-strategy',
            active:      'yes',
            featured:    'yes',
          },
          {
            paymentId:   'pl2',
            id:          'pl2',
            title:       'Mentorship Bundle (4 Sessions)',
            description: 'Four 60-minute mentorship sessions — structured DS/ML career growth, portfolio review, and interview prep.',
            amount:      '₹28,000',
            paymentUrl:  'https://rzp.io/l/vnai-mentor-4x',
            url:         'https://rzp.io/l/vnai-mentor-4x',
            active:      'yes',
            featured:    'yes',
          },
          {
            paymentId:   'pl3',
            id:          'pl3',
            title:       'Team Workshop (Full Day)',
            description: 'Full-day AI/GenAI workshop for your data science team — hands-on, opinionated, immediately applicable.',
            amount:      '₹1,20,000',
            paymentUrl:  'https://rzp.io/l/vnai-workshop',
            url:         'https://rzp.io/l/vnai-workshop',
            active:      'yes',
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
          { platform: 'linkedin',  url: 'https://linkedin.com/in/vnai'   },
          { platform: 'youtube',   url: 'https://youtube.com/@vnai'       },
          { platform: 'instagram', url: 'https://instagram.com/vnai'      },
          { platform: 'twitter',   url: 'https://twitter.com/vnai'        },
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

// ── Speaking Events ────────────────────────────

/**
 * Fetch speaking events and conference appearances.
 * Sheet: SpeakingEvents — eventId | title | conference | type | date | location | slidesUrl | featured
 */
export function fetchSpeakingEvents() {
  return withCache('speakingEvents', async () => {
    try {
      return await post({ action: 'getSpeakingEvents' })
    } catch {
      return {
        success: true,
        events: [
          {
            eventId:    'se1',
            title:      'Pricing AI at Scale: Lessons from 50M SKUs',
            conference: 'DataHack Summit 2026',
            type:       'Keynote',
            date:       'Mar 2026',
            location:   'Bengaluru, India',
            slidesUrl:  '',
            featured:   'yes',
          },
          {
            eventId:    'se2',
            title:      'GenAI for Enterprise: Beyond the POC Graveyard',
            conference: 'AI & Analytics India Summit',
            type:       'Talk',
            date:       'Nov 2025',
            location:   'Mumbai, India',
            slidesUrl:  '',
            featured:   'yes',
          },
          {
            eventId:    'se3',
            title:      'Responsible AI in High-Stakes Pricing Systems',
            conference: 'NeurIPS Industry Track',
            type:       'Talk',
            date:       'Dec 2025',
            location:   'Vancouver, Canada',
            slidesUrl:  '',
            featured:   'yes',
          },
          {
            eventId:    'se4',
            title:      'Production ML Systems at Billion-User Scale',
            conference: 'KDD 2025',
            type:       'Workshop',
            date:       'Aug 2025',
            location:   'Toronto, Canada',
            slidesUrl:  '',
            featured:   'yes',
          },
          {
            eventId:    'se5',
            title:      'AI Career Acceleration: From DS to Staff in 18 Months',
            conference: 'Analytics Vidhya DataHour',
            type:       'Webinar',
            date:       'Jan 2026',
            location:   'Online',
            slidesUrl:  '',
            featured:   'yes',
          },
        ],
      }
    }
  })
}

// ── Publications ───────────────────────────────

/**
 * Fetch published papers, articles, and media features.
 * Sheet: Publications — pubId | title | publisher | date | url | type | featured
 */
export function fetchPublications() {
  return withCache('publications', async () => {
    try {
      return await post({ action: 'getPublications' })
    } catch {
      return {
        success: true,
        publications: [
          {
            pubId:     'pub1',
            title:     'Hierarchical Pricing Optimization Using Constrained Multi-Objective ML',
            venue:     'KDD 2025',
            publisher: 'KDD 2025',
            date:      'Aug 2025',
            url:       '#',
            type:      'Research Paper',
            abstract:  'A constrained multi-objective optimization framework for retail pricing across 50M+ SKUs, balancing revenue, margin, and competitive positioning under real-world data constraints.',
            featured:  'yes',
          },
          {
            pubId:     'pub2',
            title:     'Evaluating LLM Hallucination in Enterprise RAG Systems',
            venue:     'arXiv · cs.AI',
            publisher: 'arXiv',
            date:      'Jun 2025',
            url:       '#',
            type:      'Research Paper',
            abstract:  'Systematic evaluation of hallucination rates across 6 enterprise RAG architectures, introducing the HalluEval-RAG benchmark with 10K annotated query-response pairs from production deployments.',
            featured:  'yes',
          },
          {
            pubId:     'pub3',
            title:     'The $42M Pricing AI Playbook',
            venue:     'Towards Data Science',
            publisher: 'Towards Data Science',
            date:      'Jan 2026',
            url:       '#',
            type:      'Article',
            abstract:  'A practitioner\'s end-to-end blueprint for shipping pricing AI in production — elasticity modeling, competitive signal fusion, and real-time serving architecture lessons from 50M SKU deployments.',
            featured:  'yes',
          },
          {
            pubId:     'pub4',
            title:     'How AI Will Reshape Retail Pricing in 2026',
            venue:     'Forbes India',
            publisher: 'Forbes India',
            date:      'Feb 2026',
            url:       '#',
            type:      'Article',
            abstract:  'Exploring how dynamic pricing AI, demand sensing, and competitive intelligence will redefine retail margins — featuring case studies from leading Indian e-commerce players.',
            featured:  'yes',
          },
          {
            pubId:     'pub5',
            title:     'VN.AI Weekly — GenAI Systems Deep Dive',
            venue:     'Substack · 1,300+ subscribers',
            publisher: 'Substack',
            date:      'Weekly',
            url:       '#',
            type:      'Newsletter',
            abstract:  'Practitioner-grade weekly newsletter covering production GenAI, pricing AI, MLOps, and AI career strategy — direct from enterprise deployments. Every Tuesday.',
            featured:  'yes',
          },
        ],
      }
    }
  })
}

// ── Certifications ─────────────────────────────

/**
 * Fetch professional certifications and credentials.
 * Sheet: Certifications — certId | title | issuer | date | credentialUrl | featured
 */
export function fetchCertifications() {
  return withCache('certifications', async () => {
    try {
      return await post({ action: 'getCertifications' })
    } catch {
      return {
        success: true,
        certifications: [
          {
            certId:        'c1',
            title:         'AWS Certified Machine Learning – Specialty',
            issuer:        'Amazon Web Services',
            date:          '2024-09',
            credentialUrl: '#',
            featured:      'yes',
          },
          {
            certId:        'c2',
            title:         'Google Professional Data Engineer',
            issuer:        'Google Cloud',
            date:          '2024-06',
            credentialUrl: '#',
            featured:      'yes',
          },
          {
            certId:        'c3',
            title:         'Deep Learning Specialization',
            issuer:        'DeepLearning.AI (Coursera)',
            date:          '2023-12',
            credentialUrl: '#',
            featured:      'yes',
          },
          {
            certId:        'c4',
            title:         'Databricks Certified Data Engineer Associate',
            issuer:        'Databricks',
            date:          '2024-03',
            credentialUrl: '#',
            featured:      'yes',
          },
          {
            certId:        'c5',
            title:         'MLOps Specialization',
            issuer:        'DeepLearning.AI (Coursera)',
            date:          '2024-01',
            credentialUrl: '#',
            featured:      'no',
          },
        ],
      }
    }
  })
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
  // Send both the spec-required field names AND the raw contact fields so the
  // backend can read them regardless of which column names it uses.
  return post({
    action:        'createBookingRequest',
    username:      email || name || 'guest',
    name,
    email,
    phone,
    serviceId:     service || '',
    preferredDate: '',
    preferredTime: '',
    notes,
  })
}
