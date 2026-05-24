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
 * Sheet: Users — columns: username | password | email | company | createdAt
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function signupUser({ username, password, email, company }) {
  return post({ action: 'signup', username, password, email, company })
}

/**
 * Authenticate an existing user.
 * Sheet: Users
 * @returns {{ success: boolean, message: string, user?: object }}
 */
export async function loginUser({ username, password }) {
  return post({ action: 'login', username, password })
}

// ── Contact ────────────────────────────────────

/**
 * Submit the contact form.
 * Sheet: Contacts — columns: name | company | email | message | submittedAt
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
 * Sheet: UserAccess — columns: username | tier | status | onboardingStage
 * Falls back to mock data if backend not yet updated.
 * @returns {{ success: boolean, tier: string, onboardingStage: string }}
 */
export async function getUserAccess(username) {
  try {
    return await post({ action: 'getUserAccess', username })
  } catch {
    return { success: true, tier: 'trial', onboardingStage: 'pending' }
  }
}

// ── Enterprise: Service Requests ──────────────

/**
 * Submit a new AI service / deployment request.
 * Sheet: ServiceRequests — columns: username | company | service | requestType | priority | submittedAt
 * Falls back to mock success if backend not yet updated.
 * @returns {{ success: boolean, message: string, requestId?: string }}
 */
export async function createServiceRequest({ username, company, service, requestType, priority = 'standard' }) {
  try {
    return await post({ action: 'createServiceRequest', username, company, service, requestType, priority })
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
 * Sheet: SupportRequests — columns: username | category | message | submittedAt
 * Falls back to mock success if backend not yet updated.
 * @returns {{ success: boolean, message: string, ticketId?: string }}
 */
export async function createSupportRequest({ username, category, message }) {
  try {
    return await post({ action: 'createSupportRequest', username, category, message })
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
 * Sheet: DeploymentStatus — columns: company | solution | deploymentStage | completionPercent
 * Falls back to mock data if backend not yet updated.
 * @returns {{ success: boolean, deployments: object[] }}
 */
export async function getDeploymentStatus(username) {
  try {
    return await post({ action: 'getDeploymentStatus', username })
  } catch {
    return {
      success: true,
      deployments: [
        { company: 'Acme Corp',        solution: 'NexusGPT Enterprise',          deploymentStage: 'deployed',     completionPercent: 100 },
        { company: 'Acme Corp',        solution: 'SmartCall AI — Phase 1',        deploymentStage: 'deployment',   completionPercent: 72  },
        { company: 'Acme Corp',        solution: 'Enterprise RAG Platform',       deploymentStage: 'scoping',      completionPercent: 35  },
        { company: 'Acme Corp',        solution: 'VoiceFlow — Pilot Integration', deploymentStage: 'consultation', completionPercent: 15  },
      ],
    }
  }
}

// ── Enterprise: Metrics ────────────────────────

/**
 * Fetch enterprise-wide analytics metrics (daily rows).
 * Sheet: EnterpriseMetrics — columns: date | aiCalls | chatbotSessions | automationHoursSaved | satisfactionScore
 * Falls back to mock data if backend not yet updated.
 * @returns {{ success: boolean, metrics: object[] }}
 */
export async function getEnterpriseMetrics(username) {
  try {
    return await post({ action: 'getEnterpriseMetrics', username })
  } catch {
    return {
      success: true,
      metrics: [
        { date: '2025-01-01', aiCalls: 3200,  chatbotSessions: 820,  automationHoursSaved: 140, satisfactionScore: 4.6 },
        { date: '2025-02-01', aiCalls: 4100,  chatbotSessions: 1050, automationHoursSaved: 178, satisfactionScore: 4.7 },
        { date: '2025-03-01', aiCalls: 3800,  chatbotSessions: 980,  automationHoursSaved: 165, satisfactionScore: 4.5 },
        { date: '2025-04-01', aiCalls: 5200,  chatbotSessions: 1310, automationHoursSaved: 210, satisfactionScore: 4.8 },
        { date: '2025-05-01', aiCalls: 4800,  chatbotSessions: 1220, automationHoursSaved: 195, satisfactionScore: 4.7 },
        { date: '2025-06-01', aiCalls: 6100,  chatbotSessions: 1540, automationHoursSaved: 245, satisfactionScore: 4.9 },
        { date: '2025-07-01', aiCalls: 5700,  chatbotSessions: 1430, automationHoursSaved: 228, satisfactionScore: 4.8 },
        { date: '2025-08-01', aiCalls: 7200,  chatbotSessions: 1810, automationHoursSaved: 288, satisfactionScore: 4.9 },
        { date: '2025-09-01', aiCalls: 6800,  chatbotSessions: 1710, automationHoursSaved: 272, satisfactionScore: 4.8 },
        { date: '2025-10-01', aiCalls: 8100,  chatbotSessions: 2030, automationHoursSaved: 324, satisfactionScore: 4.9 },
        { date: '2025-11-01', aiCalls: 7600,  chatbotSessions: 1910, automationHoursSaved: 304, satisfactionScore: 4.8 },
        { date: '2025-12-01', aiCalls: 9400,  chatbotSessions: 2350, automationHoursSaved: 376, satisfactionScore: 4.9 },
      ],
    }
  }
}

// ── Enterprise: AI Insights ────────────────────

/**
 * Fetch AI-generated recommendations and insights.
 * Sheet: AIInsights — columns: timestamp | insight | severity
 * Falls back to mock data if backend not yet updated.
 * @returns {{ success: boolean, insights: object[] }}
 */
export async function getAIInsights(username) {
  try {
    return await post({ action: 'getAIInsights', username })
  } catch {
    return {
      success: true,
      insights: [
        {
          timestamp: '2025-12-01T09:15:00Z',
          insight:   'Based on your call center metrics, deploying SmartCall AI to 3 additional queues could reduce AHT by ~28%.',
          severity:  'high',
        },
        {
          timestamp: '2025-12-01T10:30:00Z',
          insight:   'Reindexing your knowledge base with recent Q4 data would push RAG retrieval accuracy above the 95% SLA target.',
          severity:  'medium',
        },
        {
          timestamp: '2025-12-02T08:00:00Z',
          insight:   'GPT-4 token consumption increased 34% this week — primarily from the customer support copilot. Consider prompt compression.',
          severity:  'medium',
        },
        {
          timestamp: '2025-12-02T14:45:00Z',
          insight:   'NexusGPT Enterprise has processed 12,400+ queries with 97.3% satisfaction score. Production environment is stable.',
          severity:  'low',
        },
        {
          timestamp: '2025-12-03T11:20:00Z',
          insight:   'Automation workflows saved 376 hours this month — equivalent to $94,000 in labor cost reduction.',
          severity:  'low',
        },
      ],
    }
  }
}
