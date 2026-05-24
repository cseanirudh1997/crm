// ═══════════════════════════════════════════════════════════════════
//  NexusAI — Google Apps Script Backend
//  Spreadsheet tabs:
//    Users, Contacts, Chats,
//    UserAccess, ServiceRequests, SupportRequests,
//    AIInsights, DeploymentStatus, EnterpriseMetrics
// ═══════════════════════════════════════════════════════════════════

var SS  = SpreadsheetApp.getActiveSpreadsheet();
var NOW = function() { return new Date().toISOString(); };

// ── Sheet helpers ───────────────────────────────────────────────────

function sheet(name) {
  var s = SS.getSheetByName(name);
  if (!s) s = SS.insertSheet(name);
  return s;
}

function appendRow(sheetName, rowArr) {
  sheet(sheetName).appendRow(rowArr);
}

function findRowByEmail(sheetName, emailCol, email) {
  var data = sheet(sheetName).getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][emailCol]).toLowerCase() === String(email).toLowerCase()) {
      return { row: i + 1, data: data[i] };
    }
  }
  return null;
}

// ── CORS / entry point ──────────────────────────────────────────────

function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var payload = JSON.parse(e.postData.contents);
    var result  = dispatch(payload);
    output.setContent(JSON.stringify(result));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, message: err.message }));
  }

  return output;
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'NexusAI API — POST only.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function dispatch(p) {
  switch (p.action) {
    // ── Auth ──────────────────────────────────────
    case 'signup':           return handleSignup(p);
    case 'login':            return handleLogin(p);
    // ── Contact / Chat ────────────────────────────
    case 'contact':          return handleContact(p);
    case 'chat':             return handleChat(p);
    // ── Enterprise ───────────────────────────────
    case 'getUserAccess':    return handleGetUserAccess(p);
    case 'createServiceRequest': return handleCreateServiceRequest(p);
    case 'createSupportRequest': return handleCreateSupportRequest(p);
    case 'getDeploymentStatus':  return handleGetDeploymentStatus(p);
    case 'getEnterpriseMetrics': return handleGetEnterpriseMetrics(p);
    case 'getAIInsights':        return handleGetAIInsights(p);
    default:
      return { success: false, message: 'Unknown action: ' + p.action };
  }
}

// ═══════════════════════════════════════════════════════════════════
//  Auth handlers
// ═══════════════════════════════════════════════════════════════════

function handleSignup(p) {
  var username = (p.username || '').trim();
  var password = (p.password || '').trim();
  var email    = (p.email    || '').trim().toLowerCase();
  var company  = (p.company  || '').trim();

  if (!username || !password || !email) {
    return { success: false, message: 'Missing required fields.' };
  }

  var s    = sheet('Users');
  var data = s.getDataRange().getValues();

  // Ensure header row
  if (data.length === 0) {
    s.appendRow(['username','password','email','company','role','tier','onboardingStage','createdAt']);
  }

  // Check duplicate username / email
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === username.toLowerCase()) {
      return { success: false, message: 'Username already taken.' };
    }
    if (String(data[i][2]).toLowerCase() === email) {
      return { success: false, message: 'Email already registered.' };
    }
  }

  s.appendRow([username, password, email, company, 'user', 'trial', 'pending', NOW()]);

  // Also create UserAccess entry
  var ua = sheet('UserAccess');
  if (ua.getLastRow() === 0) {
    ua.appendRow(['email','username','company','tier','onboardingStage','activatedAt','notes']);
  }
  ua.appendRow([email, username, company, 'trial', 'pending', '', '']);

  return {
    success: true,
    message: 'Account created.',
    user:    { username: username, email: email, role: 'user', company: company, tier: 'trial', onboardingStage: 'pending' },
  };
}

function handleLogin(p) {
  var username = (p.username || '').trim();
  var password = (p.password || '').trim();

  if (!username || !password) {
    return { success: false, message: 'Missing username or password.' };
  }

  var data = sheet('Users').getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (String(row[0]).toLowerCase() === username.toLowerCase() && String(row[1]) === password) {
      return {
        success: true,
        message: 'Login successful.',
        user: {
          username:        row[0],
          email:           row[2],
          company:         row[3],
          role:            row[4] || 'user',
          tier:            row[5] || 'trial',
          onboardingStage: row[6] || 'pending',
        },
      };
    }
  }

  return { success: false, message: 'Invalid username or password.' };
}

// ═══════════════════════════════════════════════════════════════════
//  Contact / Chat handlers
// ═══════════════════════════════════════════════════════════════════

function handleContact(p) {
  var s = sheet('Contacts');
  if (s.getLastRow() === 0) {
    s.appendRow(['name','company','email','message','submittedAt']);
  }
  s.appendRow([p.name || '', p.company || '', p.email || '', p.message || '', NOW()]);
  return { success: true, message: 'Thank you! We will be in touch shortly.' };
}

function handleChat(p) {
  var query = (p.query || '').toLowerCase();
  var reply = generateChatReply(query);

  var s = sheet('Chats');
  if (s.getLastRow() === 0) {
    s.appendRow(['query','reply','timestamp']);
  }
  s.appendRow([p.query, reply, NOW()]);

  return { success: true, response: reply };
}

function generateChatReply(q) {
  if (q.includes('price') || q.includes('cost') || q.includes('pricing')) {
    return 'Our enterprise engagements start at $5,000/month for the Foundation tier. Custom pricing is available based on the scope, number of products deployed, and SLA requirements. I recommend booking a free consultation with our solutions team.';
  }
  if (q.includes('voice') || q.includes('call') || q.includes('smartcall')) {
    return 'SmartCall AI is our voice AI platform for call centers. It handles inbound and outbound calls with 97%+ intent recognition accuracy, real-time transcription, sentiment analysis, and automatic escalation to human agents. It integrates natively with Salesforce, HubSpot, and most CRM platforms.';
  }
  if (q.includes('rag') || q.includes('knowledge') || q.includes('qna')) {
    return 'Our Enterprise RAG Platform connects your internal documents, wikis, and databases to a hallucination-resistant QnA engine. It supports multi-source ingestion (PDF, Confluence, SharePoint), permission-aware retrieval, and citation tracking. Deployable on-prem or VPC.';
  }
  if (q.includes('llm') || q.includes('gpt') || q.includes('nexusgpt')) {
    return 'NexusGPT Enterprise is our flagship private LLM deployment — GPT-4 class models running on your own infrastructure. We handle setup, fine-tuning, alignment, SSO integration, and ongoing model ops. Starting at $8,000/month.';
  }
  if (q.includes('consult') || q.includes('start') || q.includes('get started')) {
    return 'The best way to get started is a free 30-minute consultation with a NexusAI solutions architect. We will assess your use case, recommend the right products, and outline a phased deployment roadmap. Use the contact form on our site to schedule one.';
  }
  if (q.includes('service') || q.includes('what do')) {
    return 'NexusAI offers: LLM/SLM Deployment, Conversational AI Agents, Voice AI & Call Center Automation, Enterprise Copilots, RAG/Knowledge QnA, Workflow Automation, AI Transformation Consulting, and Managed AI Ops. We are an end-to-end enterprise AI partner.';
  }
  if (q.includes('industry') || q.includes('sector') || q.includes('speciali')) {
    return 'We work across Retail & CPG, Financial Services, Healthcare & Life Sciences, Logistics & Supply Chain, Insurance, Telecom, and Professional Services. Each engagement is deeply customized to the industry context.';
  }
  return 'Great question! I will connect you with a NexusAI specialist who can help. Please use the contact form or email us at enterprise@nexusai.io for a personalized response.';
}

// ═══════════════════════════════════════════════════════════════════
//  Enterprise handlers
// ═══════════════════════════════════════════════════════════════════

// ── getUserAccess ───────────────────────────────────────────────────

function handleGetUserAccess(p) {
  var email = (p.email || '').toLowerCase();
  if (!email) return { success: false, message: 'Email required.' };

  var found = findRowByEmail('UserAccess', 0, email);
  if (!found) {
    return { success: true, tier: 'trial', onboardingStage: 'pending' };
  }

  var row = found.data;
  return {
    success:         true,
    tier:            row[3] || 'trial',
    onboardingStage: row[4] || 'pending',
  };
}

// ── createServiceRequest ───────────────────────────────────────────

function handleCreateServiceRequest(p) {
  var s = sheet('ServiceRequests');
  if (s.getLastRow() === 0) {
    s.appendRow(['requestId','email','company','serviceType','description','urgency','status','submittedAt']);
  }

  var requestId = 'SR-' + Date.now();
  s.appendRow([
    requestId,
    p.email       || '',
    p.company     || '',
    p.serviceType || '',
    p.description || '',
    p.urgency     || 'standard',
    'pending',
    NOW(),
  ]);

  return {
    success:   true,
    message:   'Service request submitted. Our solutions team will contact you within 1 business day.',
    requestId: requestId,
  };
}

// ── createSupportRequest ───────────────────────────────────────────

function handleCreateSupportRequest(p) {
  var s = sheet('SupportRequests');
  if (s.getLastRow() === 0) {
    s.appendRow(['ticketId','email','company','category','subject','description','priority','status','submittedAt']);
  }

  var ticketId = 'TKT-' + Date.now();
  s.appendRow([
    ticketId,
    p.email       || '',
    p.company     || '',
    p.category    || '',
    p.subject     || '',
    p.description || '',
    p.priority    || 'medium',
    'open',
    NOW(),
  ]);

  var slaMap = { critical: '1 hour', high: '4 hours', medium: '8 hours', low: '24 hours' };
  var sla    = slaMap[p.priority] || '8 hours';

  return {
    success:  true,
    message:  'Support ticket created. Expected response time: ' + sla + '.',
    ticketId: ticketId,
  };
}

// ── getDeploymentStatus ───────────────────────────────────────────

function handleGetDeploymentStatus(p) {
  var email = (p.email || '').toLowerCase();
  var s     = sheet('DeploymentStatus');
  var data  = s.getDataRange().getValues();

  // Ensure header
  if (data.length === 0) {
    s.appendRow(['email','name','status','progress','env','updatedAt']);
    return { success: true, deployments: [] };
  }

  var deployments = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!email || String(row[0]).toLowerCase() === email) {
      deployments.push({
        name:      row[1],
        status:    row[2],
        progress:  Number(row[3]) || 0,
        env:       row[4],
        updatedAt: row[5],
      });
    }
  }

  // Return mock if no real data found
  if (deployments.length === 0) {
    deployments = [
      { name: 'NexusGPT Enterprise',          status: 'deployed',    progress: 100, env: 'Production', updatedAt: '2 days ago'  },
      { name: 'SmartCall AI — Phase 1',        status: 'deployment',  progress: 72,  env: 'Staging',    updatedAt: '6 hours ago' },
      { name: 'Enterprise RAG Platform',       status: 'scoping',     progress: 35,  env: 'Dev',        updatedAt: '1 day ago'   },
      { name: 'VoiceFlow — Pilot Integration', status: 'consultation',progress: 15,  env: '—',          updatedAt: '3 days ago'  },
    ];
  }

  return { success: true, deployments: deployments };
}

// ── getEnterpriseMetrics ──────────────────────────────────────────

function handleGetEnterpriseMetrics(p) {
  // In production: read from EnterpriseMetrics sheet.
  // For now return static data; extend as needed.
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
        { name: 'LLM/GenAI',  value: 38 },
        { name: 'Voice AI',   value: 24 },
        { name: 'RAG/QnA',    value: 20 },
        { name: 'Automation', value: 18 },
      ],
    },
  };
}

// ── getAIInsights ────────────────────────────────────────────────

function handleGetAIInsights(p) {
  var s    = sheet('AIInsights');
  var data = s.getDataRange().getValues();

  if (data.length <= 1) {
    // Return mock if sheet is empty
    return {
      success: true,
      insights: [
        { id: 1, type: 'opportunity',  title: 'Voice AI Expansion Recommended',   body: 'Deploying SmartCall AI to 3 additional queues could reduce AHT by ~28%.',          cta: 'Request Deployment',   priority: 'high'   },
        { id: 2, type: 'optimization', title: 'RAG Retrieval Accuracy at 91.4%',  body: 'Reindexing your knowledge base with recent Q2 data would push accuracy above 95%.',  cta: 'Schedule Maintenance', priority: 'medium' },
        { id: 3, type: 'alert',        title: 'Token Usage Spike Detected',        body: 'GPT-4 token consumption increased 34% this week — primarily the support copilot.',   cta: 'View Details',         priority: 'medium' },
        { id: 4, type: 'milestone',    title: 'NexusGPT Deployment Complete',      body: 'Your NexusGPT instance has processed 12,400+ queries with 97.3% satisfaction.',      cta: 'View Report',          priority: 'low'    },
      ],
    };
  }

  var insights = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    insights.push({
      id:       i,
      type:     row[0],
      title:    row[1],
      body:     row[2],
      cta:      row[3],
      priority: row[4],
    });
  }

  return { success: true, insights: insights };
}
