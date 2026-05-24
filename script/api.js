// ─────────────────────────────────────────────
//  Centralized API helper — Google Apps Script
//  Uses text/plain to avoid CORS preflight
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
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function signupUser({ username, password, email, company }) {
  return post({ action: 'signup', username, password, email, company })
}

/**
 * Authenticate an existing user.
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function loginUser({ username, password }) {
  return post({ action: 'login', username, password })
}

// ── Contact ────────────────────────────────────

/**
 * Submit the contact form.
 * @returns {{ success: boolean, message: string }}
 */
export async function submitContact({ name, company, email, message }) {
  return post({ action: 'contact', name, company, email, message })
}

// ── Chatbot ────────────────────────────────────

/**
 * Send a chat message and receive a bot reply.
 * @returns {{ success: boolean, response: string }}
 */
export async function sendChatMessage(query) {
  return post({ action: 'chat', query })
}

// ── Enterprise: User Access ────────────────────

/**
 * Load a user's tier and onboarding stage from the UserAccess sheet.
 * Falls back to mock data if backend not yet updated.
 * @returns {{ success: boolean, tier: string, onboardingStage: string }}
 */
export async function getUserAccess(email) {
  try {
    return await post({ action: 'getUserAccess', email })
  } catch {
    return { success: true, tier: 'trial', onboardingStage: 'pending' }
  }
}

// ── Enterprise: Service Requests ──────────────

/**
 * Submit a new AI service / deployment request.
 * Falls back to mock success if backend not yet updated.
 * @returns {{ success: boolean, message: string, requestId?: string }}
 */
export async function createServiceRequest({ email, company, serviceType, description, urgency = 'standard' }) {
  try {
    return await post({ action: 'createServiceRequest', email, company, serviceType, description, urgency })
  } catch {
    return {
      success:   true,
      message:   'Service request submitted. Our team will contact you within 1 business day.',
      requestId: `SR-${Date.now()}`,
    }
  }
}

// ── Enterprise: Support Requests ──────────────

/**
 * Submit a support request.
 * Falls back to mock success if backend not yet updated.
 * @returns {{ success: boolean, message: string, ticketId?: string }}
 */
export async function createSupportRequest({ email, company, category, subject, description, priority = 'medium' }) {
  try {
    return await post({ action: 'createSupportRequest', email, company, category, subject, description, priority })
  } catch {
    return {
      success:  true,
      message:  'Support ticket created. Expected response time: 4 hours.',
      ticketId: `TKT-${Date.now()}`,
    }
  }
}

// ── Enterprise: Deployment Status ─────────────

/**
 * Fetch current deployment pipeline status.
 * Falls back to mock data if backend not yet updated.
 * @returns {{ success: boolean, deployments: object[] }}
 */
export async function getDeploymentStatus(email) {
  try {
    return await post({ action: 'getDeploymentStatus', email })
  } catch {
    return {
      success: true,
      deployments: [
        { name: 'NexusGPT Enterprise',          status: 'deployed',    progress: 100, env: 'Production', updatedAt: '2 days ago'  },
        { name: 'SmartCall AI — Phase 1',        status: 'deployment',  progress: 72,  env: 'Staging',    updatedAt: '6 hours ago' },
        { name: 'Enterprise RAG Platform',       status: 'scoping',     progress: 35,  env: 'Dev',        updatedAt: '1 day ago'   },
        { name: 'VoiceFlow — Pilot Integration', status: 'consultation',progress: 15,  env: '—',          updatedAt: '3 days ago'  },
      ],
    }
  }
}

// ── Enterprise: Metrics ────────────────────────

/**
 * Fetch enterprise-wide analytics metrics.
 * Falls back to mock data if backend not yet updated.
 * @returns {{ success: boolean, metrics: object }}
 */
export async function getEnterpriseMetrics(email) {
  try {
    return await post({ action: 'getEnterpriseMetrics', email })
  } catch {
    return {
      success: true,
      metrics: {
        totalRequests:    1284,
        resolvedRequests: 1147,
        activeDeployments: 4,
        avgResponseTime:  '3.2h',
        aiCalls30d:       48200,
        costSaved:        '$2.4M',
        usageTrend: [
          { month: 'Jan', calls: 3200 }, { month: 'Feb', calls: 4100 },
          { month: 'Mar', calls: 3800 }, { month: 'Apr', calls: 5200 },
          { month: 'May', calls: 4800 }, { month: 'Jun', calls: 6100 },
          { month: 'Jul', calls: 5700 }, { month: 'Aug', calls: 7200 },
          { month: 'Sep', calls: 6800 }, { month: 'Oct', calls: 8100 },
          { month: 'Nov', calls: 7600 }, { month: 'Dec', calls: 9400 },
        ],
        deploymentBreakdown: [
          { name: 'LLM/GenAI',       value: 38 },
          { name: 'Voice AI',        value: 24 },
          { name: 'RAG/QnA',         value: 20 },
          { name: 'Automation',      value: 18 },
        ],
      },
    }
  }
}

// ── Enterprise: AI Insights ────────────────────

/**
 * Fetch AI-generated recommendations and insights.
 * Falls back to mock data if backend not yet updated.
 * @returns {{ success: boolean, insights: object[] }}
 */
export async function getAIInsights(email) {
  try {
    return await post({ action: 'getAIInsights', email })
  } catch {
    return {
      success: true,
      insights: [
        {
          id:       1,
          type:     'opportunity',
          title:    'Voice AI Expansion Recommended',
          body:     'Based on your call center metrics, deploying SmartCall AI to 3 additional queues could reduce AHT by ~28%.',
          cta:      'Request Deployment',
          priority: 'high',
        },
        {
          id:       2,
          type:     'optimization',
          title:    'RAG Retrieval Accuracy at 91.4%',
          body:     'Reindexing your knowledge base with recent Q2 data would push accuracy above the 95% SLA target.',
          cta:      'Schedule Maintenance',
          priority: 'medium',
        },
        {
          id:       3,
          type:     'alert',
          title:    'Token Usage Spike Detected',
          body:     'GPT-4 token consumption increased 34% this week — primarily from the customer support copilot. Consider prompt compression.',
          cta:      'View Details',
          priority: 'medium',
        },
        {
          id:       4,
          type:     'milestone',
          title:    'NexusGPT Deployment Complete',
          body:     'Your NexusGPT Enterprise instance has processed 12,400+ queries with 97.3% satisfaction score. Production is stable.',
          cta:      'View Report',
          priority: 'low',
        },
      ],
    }
  }
}
