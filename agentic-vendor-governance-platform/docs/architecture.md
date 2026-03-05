# Technical Architecture: Agentic Vendor Governance Platform

## 1. Architecture Overview

The platform is a **client-side Single Page Application (SPA)** that communicates directly with Google's Generative AI APIs. There is no custom backend server—all business logic, state management, and AI orchestration happen in the browser.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (SPA)                           │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │  React   │  │  React       │  │  Gemini Service Layer     │  │
│  │  Router  │──│  Components  │──│  (geminiService.ts)       │  │
│  │  (Hash)  │  │  + Hooks     │  │  @google/genai SDK        │  │
│  └──────────┘  └──────────────┘  └───────────┬───────────────┘  │
│                                               │                  │
└───────────────────────────────────────────────┼──────────────────┘
                                                │ HTTPS
                                    ┌───────────▼───────────┐
                                    │  Google Gemini API     │
                                    │  gemini-3-pro-preview  │
                                    └────────────────────────┘
```

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|:---|:---|:---|:---|
| **Runtime** | React | 19.2.3 | UI framework with StrictMode |
| **Language** | TypeScript | 5.8.2 | Type safety across the codebase |
| **Bundler** | Vite | 7.3.1 | Dev server (port 3000) and production builds |
| **Routing** | React Router DOM | 7.11.0 | Client-side routing via `HashRouter` |
| **Styling** | TailwindCSS (CDN) | Latest | Utility-first CSS via `cdn.tailwindcss.com` |
| **Typography** | Google Fonts (Poppins) | — | Primary font family (weights 100–900) |
| **Charts** | Recharts | 3.6.0 | Data visualizations (Bar, Area, Line, Pie, Composed) |
| **Icons** | Lucide React | 0.562.0 | SVG icon library |
| **AI SDK** | @google/genai | 1.34.0 | Direct browser-to-Gemini API calls |
| **Build Plugin** | @vitejs/plugin-react | 5.0.0 | React JSX transform for Vite |

## 3. Project Structure

```
agentic-governance-ai/
├── index.html              # Entry point — TailwindCSS config, importmap, Poppins font
├── index.tsx               # React root mount (StrictMode)
├── index.css               # CSS custom properties, card styles, scrollbar, animations
├── App.tsx                 # Route definitions (HashRouter)
├── types.ts                # TypeScript interfaces & enums
├── constants.ts            # All mock data (vendors, metrics, invoices, events, notifications)
├── geminiService.ts        # 5 Gemini API functions
├── metadata.json           # App metadata (name, description, permissions)
├── vite.config.ts          # Vite config (port 3000, env vars, path aliases)
├── tsconfig.json           # TypeScript config (ES2022, bundler resolution)
├── package.json            # Dependencies and scripts
├── components/
│   ├── Layout.tsx           # Shell: sidebar nav, header, mobile nav, content area
│   ├── Dashboard.tsx        # Command Center — multi-vendor comparison charts
│   ├── VendorDetail.tsx     # Individual vendor profile with QBR generation
│   ├── FinanceHub.tsx       # Invoice auditing, rate comparison, spend forecasting
│   ├── MeetingHub.tsx       # Governance timeline, audio scribe, event scheduling
│   ├── Settings.tsx         # Agent configuration, integrations, notification prefs
│   ├── AgentFeed.tsx        # Real-time notification sidebar
│   └── common/
│       ├── Modal.tsx        # Reusable modal with ESC-to-close, backdrop blur
│       └── StatCard.tsx     # KPI card with icon, trend badge, optional link
├── hooks/
│   ├── useQBRGenerator.ts   # QBR content generation + slide preparation workflow
│   └── useScribe.ts         # Audio recording, visualization, and AI transcription
└── docs/                    # Project documentation (this folder)
```

## 4. Routing Architecture

All routes use `HashRouter` for compatibility with static hosting.

| Route | Component | Description |
|:---|:---|:---|
| `/` | `Dashboard` | Multi-vendor command center with comparison charts |
| `/vendor/:id` | `VendorDetail` | Individual vendor profile, QBR generation, slide preview |
| `/finance` | `FinanceHub` | Invoice auditing, rate matrix, spend analytics |
| `/hub` | `MeetingHub` | Governance event timeline, audio scribe |
| `/settings` | `Settings` | Platform configuration, integrations, agent tuning |

## 5. Component Architecture

### Core Layout (`Layout.tsx`)
- Desktop sidebar with collapsible navigation (4 main items + Settings + Sign Out)
- Top header bar with "Enterprise" badge, notification bell, and user avatar
- Mobile: hamburger menu + bottom navigation bar
- Content area with max-width constraint and custom scrollbar

### Page Components
- **Dashboard** (306 lines): Vendor selection toggles, head-to-head bar/composed charts, stat cards, integrated `AgentFeed` sidebar
- **VendorDetail** (629 lines): Vendor profile card, performance charts, invoice history, rate card display, QBR generator with slide preview modal
- **FinanceHub** (940 lines): Tabbed interface (Invoices/Rate Matrix/Analytics), drag-and-drop invoice upload, AI audit results, bulk actions, spend forecasting charts
- **MeetingHub** (159 lines): Event timeline, scheduling modal, audio recording with live visualizer, AI transcription results
- **Settings** (287 lines): Agent personality sliders, integration toggles, notification preferences

### Shared Components
- **AgentFeed**: Notification feed with alert/check/calendar indicators and "Strategic Insight" card
- **Modal**: Accessible dialog with backdrop blur, escape-to-close, and configurable max-width
- **StatCard**: KPI display card with icon, trend badge, and optional routing link

## 6. AI Integration Layer (`geminiService.ts`)

All 5 functions use `gemini-3-pro-preview` with structured JSON output schemas.

| Function | Input | Output | Use Case |
|:---|:---|:---|:---|
| `generateQBRContent` | Vendor, Metrics, Events | Executive summary, successes, risks, recommendations | QBR report generation |
| `generateSlidesJSON` | QBR result data | Array of slide objects with visual type hints | Presentation deck structuring |
| `transcribeAndSummarizeMeeting` | Base64 audio + MIME type | Meeting summary + action items | Audio meeting transcription |
| `parseInvoiceAndAudit` | Base64 file + MIME + rate card | Parsed invoice with flagged line items | New invoice ingestion |
| `auditInvoice` | Invoice object + rate card | Audit status, flags, agent notes | Re-audit existing invoices |

**Authentication:** API key injected via Vite's `define` config from `GEMINI_API_KEY` environment variable.

## 7. Custom Hooks

### `useQBRGenerator`
Multi-step workflow orchestrator:
1. Select vendor → gather metrics/events
2. Call `generateQBRContent` → display executive summary
3. Call `generateSlidesJSON` → render slide preview with live Recharts visuals
4. Simulate Google Slides export (mock URL generation)

### `useScribe`
Audio recording lifecycle manager:
1. Request microphone access via `getUserMedia`
2. Record with `MediaRecorder` (WebM/MP4/WAV)
3. Live audio visualization via `AnalyserNode` + `requestAnimationFrame`
4. On stop: send Base64 audio to `transcribeAndSummarizeMeeting`
5. Create `GovernanceEvent` from AI response

## 8. Data Architecture

All data is currently **client-side mock data** defined in `constants.ts`:

| Dataset | Count | Description |
|:---|:---|:---|
| `VENDORS` | 6 | Vendor profiles with MSA details, contacts, status |
| `RATE_CARDS` | 6 | Per-vendor role/rate definitions |
| `METRIC_LOGS` | 45+ | Historical performance metrics (velocity, SLA, bugs, response time) |
| `INVOICES` | 11 | Invoice records with line items and audit statuses |
| `EVENTS` | 7 | Governance meeting records with action items |
| `NOTIFICATIONS` | 7 | Agent alert feed items |

## 9. Design System

### Color Palette (Endava Branding)
| Token | Hex | Usage |
|:---|:---|:---|
| `endava-orange` | `#FF5640` | Primary accent, active nav, CTAs |
| `endava-dark` | `#192B37` | Background, body |
| `endava-blue-90` | `#30404B` | Cards, sidebar |
| `endava-blue-80` | `#47555F` | Hover states, secondary surfaces |
| `endava-blue-70` to `10` | Gradient scale | Text hierarchy, borders, subtle elements |

### CSS Architecture
- TailwindCSS via CDN with custom theme extensions in `index.html`
- CSS custom properties in `:root` (`index.css`) for use outside Tailwind
- Custom component classes: `.kiosk-card`, `.kiosk-card-glass`, `.endava-gradient`, `.endava-text-gradient`
- Custom animations: `pulse-glow` keyframes
- Custom scrollbar styling with Endava orange tint

### Typography
- **Font:** Poppins (Google Fonts)
- **Sizes:** text-[10px] for labels → text-3xl for KPI values
- **Style:** Uppercase tracking-widest for section labels, semibold for most text

## 10. Environment & Configuration

### Vite Configuration (`vite.config.ts`)
- Dev server: port 3000, host `0.0.0.0`
- Environment variables loaded from `.env.local`
- Path alias: `@/` → project root
- `GEMINI_API_KEY` exposed as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`

### TypeScript Configuration (`tsconfig.json`)
- Target: ES2022, Module: ESNext
- JSX: react-jsx (automatic runtime)
- Module resolution: bundler
- Path mapping: `@/*` → `./*`
- No emit (Vite handles compilation)

### App Metadata (`metadata.json`)
- Requests `microphone` frame permission for audio recording
- Used for deployment contexts (e.g., Google AI Studio embedding)
