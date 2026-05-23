# NexusAI — AI & Analytics Business Website

A production-ready, dark-mode business website for an AI analytics company built with React 18 + Vite 5 + Tailwind CSS v3 + Framer Motion. Features a floating AI chatbot, authentication, a live dashboard, and full Google Apps Script backend integration — no Node.js server required.

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 18 (functional components)    |
| Build Tool   | Vite 5                              |
| Styling      | Tailwind CSS v3 + custom design tokens |
| Animation    | Framer Motion v11                   |
| Routing      | React Router v6 (HashRouter)        |
| Icons        | Lucide React                        |
| Toasts       | react-hot-toast                     |
| Backend      | Google Apps Script (REST)           |
| Hosting      | GitHub Pages / Vercel               |

---

## Project Structure

```
ai-analytics-site/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx          # Entry point
│   ├── App.jsx           # Router, layout, global components
│   ├── index.css         # Tailwind layers + custom utility classes
│   ├── config.js         # API URL, company info, nav links
│   ├── api.js            # All fetch calls to Google Apps Script
│   ├── utils.js          # Session helpers, validators, formatters
│   ├── chatbot.js        # Chatbot constants and message builders
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── Services.jsx
│   ├── Products.jsx
│   ├── Solutions.jsx
│   ├── Pricing.jsx
│   ├── Testimonials.jsx
│   ├── Clients.jsx
│   ├── FAQ.jsx
│   ├── Newsletter.jsx
│   ├── Contact.jsx
│   ├── Chatbot.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   └── ProtectedRoute.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Prerequisites

- **Node.js** 18+ (or Bun 1.x)
- **npm** 9+ (or `bun`)
- A deployed **Google Apps Script** web app (see Backend Setup below)

---

## Quick Start

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd ai-analytics-site

# 2. Install dependencies
npm install

# 3. Configure the backend URL (see config.js)
# Edit src/config.js and replace API_URL with your Apps Script URL

# 4. Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Configuration

All site-wide settings live in **`src/config.js`**:

```js
// src/config.js

export const API_URL = 'https://script.google.com/macros/s/<YOUR_DEPLOYMENT_ID>/exec'

export const COMPANY_NAME    = 'NexusAI'
export const COMPANY_EMAIL   = 'hello@nexusai.io'
export const COMPANY_PHONE   = '+1 (555) 000-0000'
export const COMPANY_ADDRESS = '100 Market St, Suite 300, San Francisco, CA 94105'
```

Replace `API_URL` with your own Google Apps Script deployment URL. No `.env` file is needed — all config is in source.

---

## Backend Setup (Google Apps Script)

The entire backend runs as a single Google Apps Script web app connected to a Google Sheet.

### Sheet structure

| Sheet name    | Columns                                          |
|---------------|--------------------------------------------------|
| `users`       | username, password (hashed), email, company, createdAt |
| `contacts`    | name, company, email, message, submittedAt       |
| `chat_logs`   | query, response, timestamp                       |

### Supported actions (POST body)

| `action`    | Required fields                                   |
|-------------|---------------------------------------------------|
| `signup`    | `username`, `password`, `email`, `company`        |
| `login`     | `username`, `password`                            |
| `contact`   | `name`, `company`, `email`, `message`             |
| `chat`      | `query`                                           |

### Deploy the script

1. Open [script.google.com](https://script.google.com) and create a new project.
2. Paste your Apps Script code into `Code.gs`.
3. Click **Deploy → New deployment** → select **Web app**.
4. Set **Execute as**: Me, **Who has access**: Anyone.
5. Copy the deployment URL and paste it into `src/config.js` as `API_URL`.

> **CORS note**: The frontend sends `Content-Type: text/plain;charset=utf-8` (not `application/json`). This avoids CORS preflight (OPTIONS) requests, which Google Apps Script cannot respond to. The Apps Script side should parse `e.postData.contents` as JSON.

---

## Available Scripts

```bash
npm run dev        # Start Vite dev server (hot reload)
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
npm run deploy     # Build + push dist/ to gh-pages branch
```

---

## Deployment

### GitHub Pages

```bash
# One-time setup: make sure the gh-pages package is installed
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

Then go to your repository **Settings → Pages** and set the source to the `gh-pages` branch, root folder. Your site will be live at:

```
https://<your-username>.github.io/<repo-name>/
```

> **Why HashRouter?** GitHub Pages serves a single `index.html` at the repo root. `BrowserRouter` causes 404s on direct URL access (e.g. `/dashboard`). `HashRouter` uses `/#/path` URLs that always resolve to `index.html`, making every route work without a server rewrite rule.

### Vercel (recommended for easier setup)

1. Push the repo to GitHub.
2. Import the project in [vercel.com](https://vercel.com).
3. Vercel auto-detects Vite — no extra config needed.
4. Click **Deploy**.

For Vercel you can safely switch `HashRouter` → `BrowserRouter` in `src/App.jsx` and add a `vercel.json` rewrite:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Authentication

Authentication is handled entirely client-side using `localStorage`. There is no JWT or server-side session — credentials are verified by the Apps Script backend, and a session object is stored in the browser.

```js
// Session shape (stored in localStorage)
{
  username: 'jane',
  email:    'jane@company.com',
  role:     'user',
  company:  'Acme Inc.'
}
```

- `getSession()` — read session (returns `null` if not logged in)
- `saveSession(data)` — write session after login/signup
- `clearSession()` — wipe session on logout

The `/dashboard` route is wrapped in `<ProtectedRoute>` which redirects to `/login` if no session is found.

---

## Design System

Custom Tailwind tokens defined in `tailwind.config.js`:

| Token          | Usage                                    |
|----------------|------------------------------------------|
| `brand-*`      | Primary blue-indigo palette (CTAs, links)|
| `accent-*`     | Purple accent palette (gradients)        |
| `neon-*`       | Vivid glow effects                       |
| `shadow-glow`  | Diffuse indigo glow drop-shadow          |
| `shadow-glass` | Subtle glassmorphism panel shadow        |

Reusable CSS component classes (in `src/index.css`):

| Class            | Description                          |
|------------------|--------------------------------------|
| `.glass`         | Frosted glass card                   |
| `.glass-dark`    | Darker frosted glass panel           |
| `.gradient-text` | Brand gradient text fill             |
| `.btn-primary`   | Filled brand CTA button              |
| `.btn-secondary` | Ghost/outline button                 |
| `.section-wrapper` | Centered max-width content block   |
| `.section-badge` | Small pill label above section titles|
| `.input-field`   | Dark form input / textarea           |
| `.orb`           | Blurred background decoration blob   |

---

## Browser Support

Targets modern browsers (last 2 versions). No IE11 support. Requires:
- CSS `backdrop-filter` (glassmorphism) — Chrome 76+, Firefox 103+, Safari 9+
- CSS custom properties
- ES2020 (optional chaining, nullish coalescing)

---

## License

MIT — free to use, modify, and distribute.
