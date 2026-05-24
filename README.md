# NexusAI — Enterprise AI Operations & Deployment Portal

A production-ready, dark-mode enterprise SaaS portal for an AI deployment and operations company. Built with React 18 + Vite 6 + Tailwind CSS v3 + Framer Motion. Features a full marketing site, floating AI chatbot, three-tier authenticated dashboard, and a complete Google Apps Script + Google Sheets backend — no Node.js server required.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Quick Start](#quick-start)
4. [Configuration](#configuration)
5. [Backend Architecture](#backend-architecture)
6. [Google Sheets Schema](#google-sheets-schema)
7. [API Reference](#api-reference)
8. [Authentication & Sessions](#authentication--sessions)
9. [Dashboard System (Tier Routing)](#dashboard-system-tier-routing)
10. [Component Reference](#component-reference)
11. [Design System](#design-system)
12. [Routing](#routing)
13. [Build & Deployment](#build--deployment)
14. [Known Limitations & Notes](#known-limitations--notes)

---

## Tech Stack

| Layer         | Technology                                      | Version    |
|---------------|-------------------------------------------------|------------|
| Framework     | React (functional components, hooks)            | 18.3.1     |
| Build Tool    | Vite                                            | 6.0.0      |
| Styling       | Tailwind CSS + custom design tokens             | 3.4.6      |
| Animation     | Framer Motion                                   | 11.3.0     |
| Routing       | React Router v6 — **HashRouter**                | 6.24.1     |
| Icons         | Lucide React                                    | 0.395.0    |
| Charts        | Recharts (AreaChart, BarChart, PieChart)        | 2.12.7     |
| Toasts        | react-hot-toast                                 | 2.4.1      |
| Backend       | Google Apps Script REST API                     | —          |
| Database      | Google Sheets (9 sheets)                        | —          |
| Hosting       | GitHub Pages / Vercel                           | —          |

---

## Project Structure

```
ai-analytics-site/
├── public/
│   └── favicon.svg
│
├── src/
│   │
│   ├── main.jsx                # React DOM entry point
│   ├── App.jsx                 # Root router, scroll progress bar, Toaster
│   ├── index.css               # Tailwind base + all custom utility classes
│   │
│   ├── config.js               # API URL, company info, nav links, tier/role/stage constants
│   ├── api.js                  # All 10 Google Apps Script API calls + mock fallbacks
│   ├── utils.js                # Session helpers, validators, formatters
│   ├── chatbot-helpers.js      # Suggested prompts and chatbot message builders
│   │
│   ├── ─── Public Marketing Site ───
│   ├── Navbar.jsx              # Fixed nav with active-section highlighting, notification bell
│   ├── Footer.jsx              # Links, social icons, contact info
│   ├── Hero.jsx                # Typing-effect hero with animated gradient
│   ├── Clients.jsx             # Infinite marquee of client logos (2 rows)
│   ├── Services.jsx            # 8-card grid of enterprise AI services
│   ├── Products.jsx            # Product cards: NexusGPT, SmartCall AI, VoiceFlow, RAG, Automation Studio
│   ├── Solutions.jsx           # Tabbed industry solutions (Retail, Healthcare, FinTech, Supply Chain, E-Commerce)
│   ├── Pricing.jsx             # 3-tier pricing cards (Foundation, Enterprise, Transformation)
│   ├── Testimonials.jsx        # Auto-advancing testimonial carousel with mini cards
│   ├── FAQ.jsx                 # Animated accordion with 8 FAQs
│   ├── Newsletter.jsx          # Email subscribe form
│   ├── Contact.jsx             # Contact form + method cards (API-connected)
│   ├── Chatbot.jsx             # Floating AI chat widget with typing indicator
│   │
│   ├── ─── Auth ───
│   ├── Login.jsx               # Username + password login; inline forgot-password flow
│   ├── Signup.jsx              # Registration with password strength meter
│   ├── ProtectedRoute.jsx      # Auth guard → redirects to /login if no session
│   │
│   ├── ─── Dashboard ───
│   ├── Dashboard.jsx           # Tier router → renders Trial / Premium / Admin dashboard
│   ├── DashboardLayout.jsx     # Shared shell: fixed sidebar, mobile drawer, topbar
│   ├── TrialDashboard.jsx      # Locked view for trial users with upgrade CTA
│   ├── PremiumDashboard.jsx    # Full enterprise dashboard (6 nav sections)
│   ├── AdminDashboard.jsx      # Admin operational view with user/system metrics
│   └── Modals.jsx              # ServiceRequestModal + SupportRequestModal
│
├── apps-script/
│   └── Code.gs                 # Full Google Apps Script backend source
│
├── index.html                  # HTML shell (loads Google Fonts, sets dark class)
├── vite.config.js              # Vite config with manual chunk splitting
├── tailwind.config.js          # Custom design tokens, animations, shadows
├── postcss.config.js           # Tailwind + Autoprefixer
└── package.json
```

---

## Quick Start

**Prerequisites:** Node.js 18+ (or Bun 1.x), npm 9+

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd ai-analytics-site

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open `http://localhost:5173`. The site loads immediately with mock data fallbacks — no backend required for local development.

---

## Configuration

All site-wide settings live in **`src/config.js`**. Edit this file to rebrand or point to a different backend:

```js
// src/config.js

export const API_URL = 'https://script.google.com/macros/s/<YOUR_DEPLOYMENT_ID>/exec'

export const COMPANY_NAME    = 'NexusAI'
export const COMPANY_TAGLINE = 'Enterprise AI Solutions & Automation'
export const COMPANY_EMAIL   = 'enterprise@nexusai.io'
export const COMPANY_PHONE   = '+1 (888) 639-8724'
export const COMPANY_ADDRESS = '350 5th Avenue, New York, NY 10118'

export const SOCIAL_LINKS = {
  twitter:  'https://twitter.com/nexusai',
  linkedin: 'https://linkedin.com/company/nexusai',
  github:   'https://github.com/nexusai',
  youtube:  'https://youtube.com/@nexusai',
}

export const NAV_LINKS = [
  { label: 'Services',  href: '#services'     },
  { label: 'Products',  href: '#products'     },
  { label: 'Solutions', href: '#solutions'    },
  { label: 'Pricing',   href: '#pricing'      },
  { label: 'About',     href: '#testimonials' },
]
```

No `.env` file is needed. All configuration is source-controlled in `config.js`.

### Tier / Role / Stage Constants

These are also exported from `config.js` and used throughout the app — do not hardcode these strings anywhere else:

```js
export const TIERS = {
  TRIAL:   'trial',
  PREMIUM: 'premium',
  ADMIN:   'admin',
}

export const ROLES = { USER: 'user', ADMIN: 'admin' }

export const ONBOARDING_STAGES = {
  PENDING:      'pending',
  CONSULTATION: 'consultation',
  SCOPING:      'scoping',
  DEPLOYMENT:   'deployment',
  DEPLOYED:     'deployed',
}

export const STORAGE_KEYS = {
  IS_LOGGED_IN:     'isLoggedIn',
  USERNAME:         'username',
  EMAIL:            'email',
  ROLE:             'role',
  COMPANY:          'company',
  TIER:             'tier',
  ONBOARDING_STAGE: 'onboardingStage',
}
```

---

## Backend Architecture

The entire backend is a single **Google Apps Script** web app deployed as a public REST endpoint. It reads and writes to a connected **Google Sheet**.

### How requests work

```
Frontend (fetch)
  → POST https://script.google.com/macros/s/<id>/exec
  → Content-Type: text/plain;charset=utf-8   ← avoids CORS preflight
  → Body: JSON.stringify({ action: '...', ...fields })
  → Apps Script parses e.postData.contents as JSON
  → Returns JSON response
```

> **Why `text/plain`?** Google Apps Script cannot respond to CORS preflight (OPTIONS) requests. Using `Content-Type: text/plain` (a "simple" request) bypasses the preflight entirely and lets the request go through without any server-side CORS configuration.

All API calls go through the single `post()` helper in `src/api.js`:

```js
async function post(payload) {
  const response = await fetch(API_URL, {
    method:   'POST',
    headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
    redirect: 'follow',
    body:     JSON.stringify(payload),
  })
  return response.json()
}
```

### Mock-first fallback pattern

All enterprise data endpoints (`getDeploymentStatus`, `getEnterpriseMetrics`, `getAIInsights`, `createServiceRequest`, `createSupportRequest`, `getUserAccess`) wrap their `post()` call in a `try/catch`. If the backend is unavailable or returns an error, they fall back to realistic mock data. This means the dashboard is always functional even if the Apps Script backend hasn't been updated yet.

```js
export async function getEnterpriseMetrics(username) {
  try {
    return await post({ action: 'getEnterpriseMetrics', username })
  } catch {
    return { success: true, metrics: [ /* 12 months of mock data */ ] }
  }
}
```

### Deploy the Apps Script

1. Open [script.google.com](https://script.google.com) → New project
2. Paste `apps-script/Code.gs` into the editor
3. **Deploy → New deployment → Web app**
4. Execute as: **Me** | Who has access: **Anyone**
5. Copy the deployment URL → paste into `src/config.js` as `API_URL`
6. Every time you update Code.gs, click **Deploy → Manage deployments → Create new version**

---

## Google Sheets Schema

The backend reads from and writes to these 9 sheets in a single Google Spreadsheet. Sheet names are case-sensitive.

| Sheet              | Columns (in order)                                                           | Written by                        |
|--------------------|------------------------------------------------------------------------------|-----------------------------------|
| `Users`            | `username`, `password`, `email`, `company`, `role`, `createdAt`             | `signup` action                   |
| `UserAccess`       | `username`, `tier`, `status`, `onboardingStage`                              | Manual (admin manages tier/stage) |
| `Contacts`         | `name`, `company`, `email`, `message`, `submittedAt`                        | `contact` action                  |
| `ChatbotRules`     | `keyword`, `response`                                                        | Manual (curate chatbot answers)   |
| `ServiceRequests`  | `username`, `company`, `service`, `requestType`, `priority`, `submittedAt`  | `createServiceRequest` action     |
| `SupportRequests`  | `username`, `category`, `message`, `submittedAt`                            | `createSupportRequest` action     |
| `DeploymentStatus` | `company`, `solution`, `deploymentStage`, `completionPercent`               | Manual (team updates)             |
| `EnterpriseMetrics`| `date`, `aiCalls`, `chatbotSessions`, `automationHoursSaved`, `satisfactionScore` | Manual or automated pipeline |
| `AIInsights`       | `timestamp`, `insight`, `severity`                                           | Manual or AI pipeline             |

### UserAccess — tier values

| Value     | Dashboard rendered    |
|-----------|-----------------------|
| `trial`   | `TrialDashboard`      |
| `premium` | `PremiumDashboard`    |
| `admin`   | `AdminDashboard`      |

### DeploymentStatus — deploymentStage values

`pending` → `consultation` → `scoping` → `deployment` → `deployed`

### AIInsights — severity values

`low` | `medium` | `high`

---

## API Reference

All functions are exported from `src/api.js`.

### Auth

#### `signupUser({ username, password, email, company })`
Creates a new account in the `Users` sheet.
- Returns: `{ success: boolean, message: string, user?: object }`

#### `loginUser({ username, password })`
Authenticates against the `Users` sheet.
- Returns: `{ success: boolean, message: string, user?: { username, email, role, company, tier, onboardingStage } }`

### Contact & Chat

#### `submitContact({ name, company, email, message })`
Appends a row to the `Contacts` sheet.
- Returns: `{ success: boolean, message: string }`

#### `sendChatMessage(query)`
Queries the `ChatbotRules` sheet for a keyword match and returns a response.
- Returns: `{ success: boolean, response: string }`

### Enterprise (all have mock fallbacks)

#### `getUserAccess(username)`
Reads tier and onboarding stage from `UserAccess`. Called on every login to hydrate the session.
- Returns: `{ success: boolean, tier: string, onboardingStage: string }`

#### `createServiceRequest({ username, company, service, requestType, priority })`
Appends to `ServiceRequests`.
- `priority`: `'standard'` | `'high'` | `'critical'`
- Returns: `{ success: boolean, message: string, requestId?: string }`

#### `createSupportRequest({ username, category, message })`
Appends to `SupportRequests`.
- Returns: `{ success: boolean, message: string, ticketId?: string }`

#### `getDeploymentStatus(username)`
Returns deployment pipeline rows from `DeploymentStatus`.
- Returns: `{ success: boolean, deployments: Array<{ company, solution, deploymentStage, completionPercent }> }`

#### `getEnterpriseMetrics(username)`
Returns monthly metric rows from `EnterpriseMetrics`.
- Returns: `{ success: boolean, metrics: Array<{ date, aiCalls, chatbotSessions, automationHoursSaved, satisfactionScore }> }`

#### `getAIInsights(username)`
Returns insight rows from `AIInsights`.
- Returns: `{ success: boolean, insights: Array<{ timestamp, insight, severity }> }`

---

## Authentication & Sessions

Authentication is entirely client-side. The Apps Script backend validates credentials and returns a user object; the frontend stores the session in `localStorage`.

### Session shape

```js
// Stored across 7 localStorage keys (see STORAGE_KEYS in config.js)
{
  isLoggedIn:      true,
  username:        'jane_doe',
  email:           'jane@acme.com',
  role:            'user',       // 'user' | 'admin'
  company:         'Acme Corp',
  tier:            'premium',    // 'trial' | 'premium' | 'admin'
  onboardingStage: 'deployed',   // 'pending' | 'consultation' | 'scoping' | 'deployment' | 'deployed'
}
```

### Session utilities (`src/utils.js`)

| Function            | Description                                      |
|---------------------|--------------------------------------------------|
| `saveSession(data)` | Write all session fields to localStorage         |
| `getSession()`      | Read session; returns `null` if not logged in    |
| `clearSession()`    | Remove all session keys (logout)                 |
| `isAdmin()`         | `true` if tier is `admin` or role is `admin`     |
| `isPremium()`       | `true` if tier is `premium` or `admin`           |

### Login flow

1. User submits username + password
2. `loginUser()` calls Apps Script → validates against `Users` sheet
3. On success, `getUserAccess()` fetches tier and onboarding stage from `UserAccess`
4. `saveSession()` persists everything to localStorage
5. `navigate('/dashboard')` — `Dashboard.jsx` reads tier and renders the correct dashboard

### Protected routes

`/dashboard` is wrapped in `<ProtectedRoute>`. It calls `getSession()` — if `null`, redirects to `/login` immediately.

### Forgot password

The login page has an inline forgot-password flow (no dedicated route). It slides open below the password field, accepts an email address, simulates a 1.2s submission, then shows a success state. There is no backend email-sending endpoint; the UI is complete but actual reset emails require a future Apps Script extension.

---

## Dashboard System (Tier Routing)

`Dashboard.jsx` reads `tier` from the session and renders the appropriate dashboard:

```
tier === 'admin'   → AdminDashboard
tier === 'premium' → PremiumDashboard
tier === 'trial'   → TrialDashboard  (default)
```

All three dashboards use `DashboardLayout` as their shell.

### DashboardLayout props

| Prop          | Type       | Description                                      |
|---------------|------------|--------------------------------------------------|
| `session`     | `object`   | Current session (from `getSession()`)            |
| `title`       | `string`   | Topbar title                                     |
| `subtitle`    | `string`   | Topbar subtitle                                  |
| `navItems`    | `array`    | `[{ id, label, icon }]` — sidebar nav items      |
| `activeNav`   | `string`   | Currently selected nav item id                   |
| `onNavChange` | `function` | Called when a nav item is clicked                |
| `onRefresh`   | `function` | Called when the refresh button is clicked        |

### PremiumDashboard nav sections

| Section      | Content                                                                    |
|--------------|----------------------------------------------------------------------------|
| `overview`   | Welcome banner, metric cards, quick-link stat cards                        |
| `analytics`  | Area chart (AI calls over time), bar chart (automation hours), pie chart (deployment stages) |
| `deployments`| Deployment status table with filter, stage badges, completion percentages  |
| `voice`      | Live voice waveform, system health table, recent call log with sentiment   |
| `insights`   | AI recommendation cards with severity icons, filter by severity            |
| `support`    | Support request modal trigger, service request modal trigger               |

### TrialDashboard

Shows a limited overview with locked sections (Analytics, Deployments, AI Insights) displaying upgrade overlays. Includes a consultation CTA and a list of what premium unlocks.

### AdminDashboard

Operational view showing aggregate user metrics, all service requests, deployment pipeline overview, and system health status. Bar charts and KPI cards. Uses the same `getEnterpriseMetrics`, `getDeploymentStatus`, and `getAIInsights` endpoints.

---

## Component Reference

### Marketing Site

#### `Navbar`
- Fixed top bar, scrolled state detection (`window.scrollY > 20` → adds background blur + border)
- **Active section highlighting** via `IntersectionObserver` (`rootMargin: '-20% 0px -60% 0px'`) — highlights the nav link for whichever section is in the upper portion of the viewport
- **Notification bell** — click opens a dropdown panel with 4 mock notifications; red dot clears on first open; click-outside closes the panel
- Session-aware: shows Dashboard + Logout when logged in, Sign In + Get Started when logged out
- Mobile: full-width animated drawer with same nav links and auth buttons

#### `Hero`
- Animated typing effect cycling through AI product names
- Scroll-triggered CTA buttons linking to `#contact` and `#products`
- Gradient animated background orbs

#### `Clients`
- Two-row infinite marquee of 12 client company logos (gradient avatar initials)
- Top row scrolls left, bottom row scrolls right
- Edge fade gradients for seamless loop

#### `Products`
- 5 product cards: NexusGPT Enterprise, SmartCall AI, VoiceFlow Enterprise, Enterprise RAG Platform, AI Automation Studio
- Each card has badge, description, feature list with check icons, and a CTA

#### `Solutions`
- Tab bar for 5 industry verticals: Retail, Healthcare, FinTech, Supply Chain, E-Commerce
- Each tab shows headline, description, bullet list, and 3 KPI cards
- Tab content animates in/out with `AnimatePresence`

#### `Pricing`
- 3 plan cards: Foundation ($5,000/mo), Enterprise (custom), Transformation (contact)
- Enterprise card is highlighted (scale + ring + glow)
- Feature comparison list with ✓ / — per plan
- Reassurance row: No Per-Seat Pricing, 30-day pilot, IP ownership

#### `Testimonials`
- 6 testimonials, auto-advances every 5s (pauses on manual navigation)
- Dot pagination + previous/next arrows
- Mini-card row below main quote showing 3 other testimonials as quick-jump buttons

#### `FAQ`
- 8 accordion items, first open by default
- Smooth height animation with `AnimatePresence`
- Two-column layout on large screens (sticky left CTA, right accordion)

#### `Chatbot`
- Floating button (bottom-right) with animated spin icon
- Opens a chat panel with message history, typing indicator (3 bouncing dots)
- Suggested prompts always visible when not loading (previously gated — fixed)
- Sends messages to Apps Script `chat` action; falls back to generic response on error

### Auth

#### `Login`
- Username + password with show/hide toggle
- Inline **forgot password panel**: slides open on click, accepts email, simulates submission, shows success state with "Check your inbox" message
- Falls back to `enterprise@nexusai.io` "Contact support" link

#### `Signup`
- Full name, username, email, company, password + confirm
- Live password strength indicator (Weak / Fair / Strong / Very Strong)
- On success: calls `signupUser()` + `getUserAccess()`, saves session, navigates to dashboard

### Dashboard

#### `Modals`
Two modal components rendered inside `PremiumDashboard`:

**`ServiceRequestModal`** — for requesting a new AI deployment:
- Fields: service (dropdown), request type, priority, notes
- On submit: calls `createServiceRequest()`, shows success toast

**`SupportRequestModal`** — for technical support:
- Fields: category (dropdown), message textarea
- On submit: calls `createSupportRequest()`, shows success toast + ticket ID

---

## Design System

### Custom Tailwind tokens (`tailwind.config.js`)

**Color palettes:**

| Token       | Description                              | Range    |
|-------------|------------------------------------------|----------|
| `brand-*`   | Primary blue-indigo (CTAs, active states)| 50–950   |
| `accent-*`  | Purple (gradients, secondary highlights) | 300–950  |
| `neon-*`    | Vivid colors for glows                   | blue/purple/pink/cyan |

**Shadow utilities:**

| Token            | Value                                        |
|------------------|----------------------------------------------|
| `shadow-glow-sm` | `0 0 15px rgba(74,94,255,0.3)`              |
| `shadow-glow`    | `0 0 30px rgba(74,94,255,0.4)`              |
| `shadow-glow-lg` | `0 0 60px rgba(74,94,255,0.5)`              |
| `shadow-glass`   | `0 8px 32px rgba(0,0,0,0.3)`               |

**Custom animations:**

| Class               | Effect                                     |
|---------------------|--------------------------------------------|
| `animate-gradient-x`| Horizontally shifting gradient background  |
| `animate-float`     | Gentle vertical float (6s loop)            |
| `animate-pulse-slow`| Slow opacity pulse (4s loop)               |
| `animate-spin-slow` | 8s full rotation                           |
| `animate-shimmer`   | Loading skeleton sweep                     |

### CSS utility classes (`src/index.css`)

| Class              | Description                                      |
|--------------------|--------------------------------------------------|
| `.glass`           | `bg-white/5 backdrop-blur-xl` frosted glass card |
| `.glass-dark`      | Darker `bg-gray-900/80` frosted glass            |
| `.gradient-text`   | Brand gradient text fill (CSS `background-clip`) |
| `.btn-primary`     | Filled brand CTA button with glow pulse          |
| `.btn-secondary`   | Ghost/outline button                             |
| `.btn-ghost`       | Transparent hover button (nav items)             |
| `.section-wrapper` | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`       |
| `.section-badge`   | Small pill label (`Industry Solutions`, etc.)    |
| `.input-field`     | Dark form input / textarea with brand focus ring |
| `.orb`             | Absolutely-positioned blurred gradient blob      |
| `.animated-bg`     | Animated gradient page background               |
| `.dot-grid`        | SVG dot-pattern background overlay              |
| `.shimmer`         | Skeleton loading sweep (`shimmer 1.5s infinite`)|
| `.chat-bubble-user`| Right-aligned brand-colored chat bubble         |
| `.chat-bubble-bot` | Left-aligned glass chat bubble                  |

---

## Routing

`App.jsx` uses **`HashRouter`** (required for GitHub Pages — see note below).

| Route        | Component          | Auth required |
|--------------|--------------------|---------------|
| `/`          | Full marketing page | No           |
| `/login`     | `Login`            | No            |
| `/signup`    | `Signup`           | No            |
| `/dashboard` | `Dashboard` (tier-routed) | Yes — `ProtectedRoute` redirects to `/login` |
| `*`          | 404 fallback       | No            |

### Why HashRouter?

GitHub Pages serves a single `index.html` at the root. `BrowserRouter` causes 404s on direct URL access (e.g., loading `/dashboard` directly). `HashRouter` uses `/#/dashboard` URLs that always resolve to `index.html`, so every route works without any server rewrite rule.

If deploying to **Vercel**, you can switch to `BrowserRouter` and add a `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Scroll-to-section after navigation

`Hero.jsx` and other components use `navigate('/', { state: { scrollTo: '#products' } })`. `App.jsx` listens for `location.state.scrollTo` in a `useEffect` and calls `scrollToSection()` after the page mounts. This enables deep-linking to sections from non-home routes.

---

## Build & Deployment

### Scripts

```bash
npm run dev        # Vite dev server with hot reload (http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Serve dist/ locally for production testing
npm run deploy     # Build + push dist/ to gh-pages branch (GitHub Pages)
```

### Vite build config

Manual chunk splitting for optimal caching:
- `vendor` chunk: `react`, `react-dom`, `react-router-dom`
- `animations` chunk: `framer-motion`
- `recharts` chunk (auto-split by Vite)

### GitHub Pages

```bash
npm run deploy
```

Then: repository **Settings → Pages → Source: gh-pages branch, root folder**.

Live URL: `https://<username>.github.io/<repo-name>/`

### Vercel

1. Push to GitHub → import at [vercel.com](https://vercel.com)
2. Vite is auto-detected — no extra config needed
3. Click Deploy

---

## Known Limitations & Notes

### No backend email for password reset
The "Forgot password?" flow on the login page shows a complete UI (email input, loading state, success state) but does not actually send an email — there is no Apps Script email endpoint. To implement: add a `sendPasswordReset` action to `Code.gs` using `GmailApp.sendEmail()` and call it from `handleForgotSubmit` in `Login.jsx`.

### Notification bell — mock data only
The bell icon in `Navbar` shows 4 hardcoded notifications defined in the `NOTIFICATIONS` constant. To make these real, add a `getNotifications(username)` API function and replace the constant with the API response on mount.

### Chatbot — keyword matching only
`sendChatMessage()` sends the user's query to Apps Script, which does a keyword lookup against the `ChatbotRules` sheet. There is no LLM integration in the chat widget itself — it returns the matched rule's response, or a generic fallback. To upgrade: replace the Apps Script handler with a call to an LLM API.

### localStorage session
Sessions persist until the user clicks Logout or clears browser storage. There is no token expiry or refresh mechanism. For production with real user data, consider migrating to JWTs with an expiry and a server-side session store.

### `animate-counter` — no-op in tailwind.config.js
`animation.counter` is declared in `tailwind.config.js` but the corresponding `keyframes.counter` entry is missing. If `animate-counter` is used anywhere it will silently have no effect. Fix: add the keyframe, or remove the animation declaration.

### CORS — Google Apps Script redirect
Google Apps Script web apps redirect on POST (302 → actual endpoint). The fetch call uses `redirect: 'follow'` to handle this transparently.

---

## Browser Support

Targets modern browsers (last 2 versions, ES2020+). Requires:

- `backdrop-filter` for glassmorphism — Chrome 76+, Firefox 103+, Safari 9+
- CSS custom properties
- `IntersectionObserver` (Navbar active-section tracking) — all modern browsers
- Optional chaining (`?.`) and nullish coalescing (`??`) — transpiled by Vite

No IE11 support.
