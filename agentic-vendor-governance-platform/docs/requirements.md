
# Product Requirements: Agentic Vendor Governance Platform

## 1. Executive Summary
The Agentic Vendor Governance Platform is a browser-based, AI-driven governance layer that replaces manual vendor management overhead with an automated, neutral solution. Built on React and Google's Gemini API, it monitors multi-vendor ecosystems across development, security, marketing, and infrastructure domains using standardized metrics, automated financial auditing, and AI-powered meeting intelligence.

## 2. Target Audience
- **Procurement Operations:** Managing multi-vendor risk and contract compliance.
- **Vendor Management Offices (VMO):** Tracking performance against SLAs.
- **C-Suite/Finance:** Oversight of multi-million dollar outsourced engineering spend.

## 3. Core Functional Requirements (Implemented)

### 3.1 Multi-Vendor Command Center (`Dashboard.tsx`)
- **Head-to-Head Dashboard:** Side-by-side visualization of up to 6 vendors on key metrics (Velocity, Bug Count, SLA, Response Time) using Recharts ComposedCharts with dynamic filtering via toggleable vendor chips.
- **Agent Feed (`AgentFeed.tsx`):** Real-time sidebar displaying `AgentNotification` alerts (alert/check/calendar types) with a "Strategic Insight" card for proactive AI observations.
- **Stat Cards:** Top-level KPIs including total vendors, flagged invoices, active alerts, and upcoming events with trend badges and navigation links.
- **Diverse Ecosystem Support:** Tracks 6 vendor types — Enterprise Development (Nexus), CloudOps (Aether), AI/ML (Synthetix), Design (Orbit 9), Security (IronClad), and Marketing/CRM (FlowState).

### 3.2 Vendor Profile Detail (`VendorDetail.tsx`)
- **Dedicated Vendor Page:** Dynamic routing `/vendor/:id` with vendor-specific color coding, MSA details, contact info, and renewal dates.
- **Performance Analytics:** Historical velocity trend charts, SLA adherence, bug counts, and response time visualizations.
- **Invoice History:** Vendor-filtered invoice list with audit status indicators and line item details.
- **Rate Card Display:** Contracted roles and rates pulled from `RATE_CARDS` data.
- **QBR Generation:** AI-powered report generation integrated via `useQBRGenerator` hook (see §3.4).

### 3.3 Agentic Financial Governance (`FinanceHub.tsx`)
- **Tabbed Interface:** Three views — Invoice Ledger, Rate Comparison Matrix, and Spend Analytics.
- **Invoice Ingestion:** Drag-and-drop PDF/Image upload with AI extraction via `parseInvoiceAndAudit` using `gemini-3-pro-preview` multimodal input.
- **Automated Rate Card Validation:** Cross-references extracted line items against per-vendor `RATE_CARDS` data, flagging rate violations, role mismatches, and capacity breaches (>45 hours/week).
- **Rate Comparison Matrix:** Tabular view comparing equivalent role rates across all 6 vendors for cost arbitrage analysis.
- **Smart Spend Forecaster:** Area chart overlay showing actual vs. projected budget burn rate.
- **Bulk Actions:** Multi-select invoices with bulk approve/reject capabilities.
- **Paginated Invoice List:** 8 items per page with vendor/status filtering.
- **Discrepancy Flagging:** Instant visual alerts for rate violations, role mismatches, and excessive hours.

### 3.4 Automated Meeting & Cadence Hub (`MeetingHub.tsx`)
- **Governance Timeline:** Chronological display of all governance events (QBRs, Monthly Syncs, Weekly Standups) with vendor attribution and action item lists.
- **Agentic Scribe (`useScribe` hook):** Real-time audio recording via `MediaRecorder` API with live audio level visualization using Web Audio API's `AnalyserNode`. Supports WebM, MP4, and WAV formats. Max recording: 1 hour. Pause/resume capability.
- **AI Transcription:** Audio processed via `transcribeAndSummarizeMeeting` Gemini function, returning structured summary + action items.
- **Event Scheduling:** Modal form to manually create new governance events with vendor selection and event type.
- **Audio File Upload:** Alternative to live recording for processing pre-recorded meeting audio.

### 3.5 Strategic Reporting — QBR Generator (`useQBRGenerator` hook)
- **One-Click QBR Generation:** Aggregates vendor metrics and governance events, sends to `generateQBRContent` Gemini function, returns executive summary, key successes, risks, and recommendations.
- **Intelligent Slide Generation:** Second AI pass via `generateSlidesJSON` creates 5-6 slide structures with AI-selected `visualType` hints (`CHART_SPEND`, `CHART_VELOCITY`, `CHART_SLA`, `SCORECARD`, `NONE`).
- **Slide Preview Modal:** Live preview in `VendorDetail.tsx` rendering actual Recharts visualizations inside each slide card. Previous/next navigation.
- **Export Simulation:** Generates mock Google Slides URL (not yet connected to real API).

### 3.6 Platform Administration & Configuration (`Settings.tsx`)
- **Agent Personality Tuning:** Configurable audit tolerance threshold (slider), auto-approve toggle, and model selection for the Scribe agent.
- **Report Tone Setting:** Professional / Concise / Detailed options for AI-generated content.
- **Integration Management:** Connection toggles for Jira, Slack, ServiceNow, and SAP Ariba (UI-only, not functional).
- **Notification Preferences:** Individual toggles for SLA breaches, invoice flags, vendor status changes, weekly digests, QBR reminders, and budget alerts.
- **Save Confirmation:** Visual save feedback with toast-style confirmation.

## 4. Non-Functional Requirements
- **Security:** API key managed via environment variable (`.env.local`); no server-side storage. Microphone access requires browser permission grant.
- **Performance:** Optimistic UI patterns; skeleton loaders during AI generation; 2–3 second simulated delays for UX polish.
- **Responsive Design:** Full mobile support with hamburger menu sidebar, bottom navigation bar, and adaptive grid layouts. Desktop optimized with xl breakpoint (≥1280px) for AgentFeed sidebar.
- **Accessibility:** Modal has `aria-modal`, `aria-labelledby`, and ESC-to-close. Nav links use semantic `NavLink` with active state.
- **Browser Compatibility:** HashRouter for static hosting compatibility. MediaRecorder API required for audio features.
