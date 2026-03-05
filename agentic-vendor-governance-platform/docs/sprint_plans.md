
# Sprint Plan Roadmap

This document breaks down the project into two-week sprints. The timeline assumes an AI-assisted development workflow (e.g., using Antigravity IDE), which accelerates prototyping and component scaffolding.

---

### Phase 1: Core Agentic MVP (10 Weeks) — ✅ COMPLETE

---

#### Sprint 1: Foundation & Scaffolding ✅
- **Goal:** Establish the development environment, core application shell, and component library.
- **Delivered:**
  - React 19 / TypeScript / Vite 7 project with `HashRouter` routing for all pages.
  - `Layout.tsx` with responsive sidebar navigation, top header bar, and mobile bottom nav.
  - Endava-branded design system: TailwindCSS custom theme, Poppins typography, CSS custom properties.
  - Reusable components: `Modal.tsx`, `StatCard.tsx`.
  - Command Center `Dashboard.tsx` with multi-vendor comparison charts using Recharts.
  - `VendorDetail.tsx` with dynamic `/vendor/:id` routing and vendor-specific styling.
  - `AgentFeed.tsx` notification sidebar with alert/check/calendar indicators.
  - Mock data infrastructure in `constants.ts` (6 vendors, rate cards, metrics, invoices, events, notifications).
  - TypeScript type definitions in `types.ts` (enums, interfaces).

#### Sprint 2: Financial Hub — Invoice Ingestion ✅
- **Goal:** Implement the core invoice auditing workflow.
- **Delivered:**
  - `FinanceHub.tsx` with 3-tab interface (Invoices / Rate Matrix / Analytics).
  - Drag-and-drop invoice upload with `parseInvoiceAndAudit` Gemini integration.
  - Rate card cross-referencing and discrepancy flagging.
  - Rate Comparison Matrix view across all vendors.
  - Smart Spend Forecaster with Area Chart visualization.
  - Paginated invoice ledger (8/page) with vendor/status filters.
  - Bulk invoice selection with approve/reject actions.
  - `geminiService.ts` functions: `parseInvoiceAndAudit`, `auditInvoice`.

#### Sprint 3: Meeting Hub — The Agentic Scribe ✅
- **Goal:** Implement real-time audio transcription and summarization.
- **Delivered:**
  - `MeetingHub.tsx` with governance event timeline.
  - `useScribe` hook: microphone recording, live audio visualization, pause/resume.
  - `transcribeAndSummarizeMeeting` Gemini function for audio processing.
  - Automatic `GovernanceEvent` creation from AI transcription results.
  - Event scheduling modal with vendor selection.
  - Audio file upload alternative to live recording.

#### Sprint 4: Strategic Reporting — The QBR Generator ✅
- **Goal:** Automate QBR content creation and slide previews.
- **Delivered:**
  - `useQBRGenerator` hook: multi-step QBR workflow orchestration.
  - `generateQBRContent` Gemini function: executive summary, successes, risks, recommendations.
  - `generateSlidesJSON` Gemini function: slide structures with visual type recommendations.
  - Slide preview modal in `VendorDetail.tsx` with live Recharts rendering.
  - `renderSlideVisual` function mapping `visualType` to chart components.
  - Mock Google Slides export URL generation.

#### Sprint 5: Polish, Testing & MVP Release Prep ✅
- **Goal:** Refine features, fix bugs, and prepare for user feedback.
- **Delivered:**
  - `Settings.tsx`: Agent personality sliders, integration toggles, notification preferences, save feedback.
  - Brand-consistent UI polish: Endava orange accents, glassmorphism cards, animated elements.
  - Responsive design: mobile sidebar, bottom nav, adaptive grid layouts.
  - Error handling for Gemini API calls with console logging.
  - Custom scrollbar styling, pulse-glow animations, gradient utilities.

---

### Phase 2: Enterprise Integration (10 Weeks) — 📋 PLANNED

---

#### Sprint 6: Data Persistence & Authentication
- **Goal:** Replace client-side mock data with a persistent data layer and add user authentication.
- **User Stories:**
  - As a Backend Engineer, I can set up a database (e.g., Firestore, PostgreSQL) and API layer for vendor, invoice, and event data.
  - As a User, I can log in via SSO (Okta/Google Workspace).
  - As a System, settings and notification preferences persist across sessions.

#### Sprint 7: Data Integration — Jira
- **Goal:** Build the data transformation layer and connect live Jira metrics.
- **User Stories:**
  - As a Backend Engineer, I can define a transformation service normalizing Jira data into `MetricLog` format.
  - As an Admin, I can authenticate with Jira via OAuth in the Settings page.
  - As a User, Dashboard charts reflect live Velocity and BugCount data from Jira projects.

#### Sprint 8: Notification Channels — Slack/Teams
- **Goal:** Push agent alerts to external communication platforms.
- **User Stories:**
  - As an Admin, I can connect a Slack workspace and specify an alert channel.
  - As a System, `AgentNotification` items are posted to the configured Slack channel.
  - As a User, I receive Slack/Teams notifications for invoice flags and SLA breaches.

#### Sprint 9: Financial Workflow — SAP/Coupa
- **Goal:** Connect approved invoices to financial systems of record.
- **User Stories:**
  - As an Admin, I can configure connection to SAP Ariba.
  - As a Finance Analyst, I can push approved invoices to SAP for payment processing.
  - As a System, successful pushes update invoice status with a transaction ID.

#### Sprint 10: Google Slides API & Release Prep
- **Goal:** Replace mock export with real Google Slides integration and conduct full integration testing.
- **User Stories:**
  - As a User, clicking "Export" creates a real Google Slides presentation in my Drive.
  - As a QA Engineer, I can verify end-to-end data flows: Jira → Platform → Slack, Platform → SAP.
  - As a QA Engineer, I can validate invoice upload → audit → approval → export workflows.
