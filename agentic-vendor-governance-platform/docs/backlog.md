
# Product Backlog & Roadmap: Agentic Vendor Governance Platform

## Status Legend
- ✅ **[DONE]**: Implemented and functional in current build.
- 🚧 **[IN PROGRESS]**: UI exists, logic partially mocked or pending backend.
- 📋 **[BACKLOG]**: Planned for future sprints.

---

## Epic 1: Multi-Vendor Command Center
**Goal:** Provide a single pane of glass for all vendor metrics to eliminate "swivel-chair" management.

### Features
- ✅ **Head-to-Head Dashboard** (`Dashboard.tsx`)
  - **Story:** As a Procurement Lead, I need to compare vendors side-by-side on specific KPIs (Velocity, Bugs, Response Time).
  - **Tech:** Recharts `ComposedChart` with dynamic vendor toggle chips and custom tooltips.
- ✅ **Global Metric Alerts — Agent Feed** (`AgentFeed.tsx`)
  - **Story:** As a user, I need a sidebar feed that pushes real-time alerts about SLA breaches or critical invoice flags.
  - **Tech:** `AgentNotification` model with alert/check/calendar types, plus "Strategic Insight" card.
- ✅ **Vendor Detail Profile** (`VendorDetail.tsx`)
  - **Story:** As a VMO, I need a dedicated page for each vendor showing contract details, health trends, and historical invoices.
  - **Tech:** Dynamic routing `/vendor/:id`, color-coded vendor branding, performance charts, rate card display.
- ✅ **Trend Analytics**
  - **Story:** As an Exec, I want to see multi-month trend lines for "Velocity vs. Quality" to detect quality trade-offs.
  - **Tech:** Composed Charts (Bar + Line) with 7-month historical data per vendor.
- ✅ **Stat Cards** (`StatCard.tsx`)
  - **Story:** As a user, I need top-level KPI cards showing vendor count, flagged invoices, alerts, and upcoming events.
  - **Tech:** Reusable `StatCard` component with trend badges and optional navigation links.

---

## Epic 2: Agentic Financial Audit
**Goal:** Automate the reconciliation of invoices against contracts to prevent revenue leakage.

### Features
- ✅ **Multimodal Invoice Ingestion** (`FinanceHub.tsx`)
  - **Story:** As a Finance Analyst, I want to drag-and-drop PDF/Image invoices and have the AI extract line items automatically.
  - **Tech:** `gemini-3-pro-preview` with multimodal input (Base64 PDF/Image) via `parseInvoiceAndAudit`.
- ✅ **Automated Rate Card Validation**
  - **Story:** As a System, I must cross-reference every extracted line item against vendor `RATE_CARDS` and flag discrepancies.
  - **Tech:** AI prompt injects rate card context; flags rate violations, role mismatches, capacity breaches (>45h/week).
- ✅ **Rate Comparison Matrix**
  - **Story:** As a Procurement Negotiator, I want a matrix comparing role rates across all vendors for cost arbitrage.
  - **Tech:** Tabbed view in `FinanceHub.tsx` with vendor-by-role rate table.
- ✅ **Smart Spend Forecaster**
  - **Story:** As a Budget Owner, I want to see actual vs. projected budget burn rate.
  - **Tech:** Recharts Area Chart overlay in the Analytics tab.
- ✅ **Bulk Invoice Actions**
  - **Story:** As a Finance Manager, I want to select multiple invoices and approve/reject them in bulk.
  - **Tech:** Multi-select checkboxes with bulk status update actions.
- ✅ **Paginated Invoice Ledger**
  - **Story:** As a user, I need paginated, filterable invoice lists.
  - **Tech:** 8 items/page, vendor and status dropdown filters.
- 📋 **[BACKLOG] Bulk Invoice Export**
  - **Story:** Export audited invoice data to CSV/Excel for import into SAP/Oracle.

---

## Epic 3: Automated Governance & Meeting Intelligence
**Goal:** Eliminate manual minute-taking and ensure contractual commitments are tracked.

### Features
- ✅ **Native Audio Scribe** (`useScribe` hook → `MeetingHub.tsx`)
  - **Story:** As a Vendor Manager, I want to record a live governance sync and have the AI transcribe and summarize it.
  - **Tech:** `MediaRecorder` API → Base64 audio → `transcribeAndSummarizeMeeting` Gemini function. Live audio visualization via `AnalyserNode`.
- ✅ **Action Item Extraction**
  - **Story:** As a PM, I want the AI to parse meeting audio and output action items to populate my timeline.
  - **Tech:** Structured JSON output schema with `actionItems` array.
- ✅ **Governance Timeline**
  - **Story:** As an Auditor, I want a chronological audit trail of all QBRs, Monthly Syncs, and Standups.
  - **Tech:** Chronological event list in `MeetingHub.tsx` with vendor attribution and action item lists.
- ✅ **Event Scheduling**
  - **Story:** As a VMO, I want to manually schedule new governance events with vendor selection.
  - **Tech:** Modal form in `MeetingHub.tsx` with event type, vendor, date, and summary fields.
- ✅ **Audio File Upload**
  - **Story:** As a VMO, I want to upload pre-recorded meeting audio for processing.
  - **Tech:** File input handler in `MeetingHub.tsx` feeding into `useScribe.processAudio`.
- 📋 **[BACKLOG] Speaker Diarization**
  - **Story:** The transcript should distinguish between "Vendor Rep" and "Internal Stakeholder."

---

## Epic 4: Strategic Reporting (QBRs)
**Goal:** Reduce QBR preparation time from 2 weeks to minutes.

### Features
- ✅ **One-Click QBR Generation** (`useQBRGenerator` hook)
  - **Story:** As a VMO, I want to generate a strategic Executive Summary from the last 90 days of metrics and meetings.
  - **Tech:** `generateQBRContent` Gemini function aggregating `METRIC_LOGS` and `EVENTS` per vendor.
- ✅ **Intelligent Slide Generation**
  - **Story:** As a Presenter, I want the AI to structure data into slides with recommended chart types.
  - **Tech:** `generateSlidesJSON` with `visualType` enum (`CHART_SPEND`, `CHART_VELOCITY`, `CHART_SLA`, `SCORECARD`, `NONE`).
- ✅ **Slide Preview Modal** (`VendorDetail.tsx`)
  - **Story:** As a User, I want to preview generated slides with real live charts before exporting.
  - **Tech:** Dynamic Recharts rendering inside slide cards via `renderSlideVisual` function. Previous/next navigation.
- 🚧 **[IN PROGRESS] Real Google Slides API Integration**
  - **Story:** Clicking "Export" should create a real file in the user's Google Drive.
  - **Status:** Currently generates a mock Google Slides URL. Mock delay simulates export flow.

---

## Epic 5: Enterprise Integrations
**Goal:** Connect the "Agentic Layer" to the System of Record.

### Features
- 🚧 **[IN PROGRESS] Settings & Configuration** (`Settings.tsx`)
  - **Story:** Users can toggle integrations and adjust Agent personality (tolerance, tone, model).
  - **Status:** Full UI implemented with sliders, toggles, and model selector. State is local React state only — not persisted.
- 📋 **[BACKLOG] Jira / Linear Sync**
  - **Story:** Fetch real `BugCount` and `Velocity` metrics from live Jira projects.
- 📋 **[BACKLOG] SAP Ariba / Coupa Connector**
  - **Story:** Push "Approved" invoices directly to the ERP for payment processing.
- 📋 **[BACKLOG] Slack / Teams Bots**
  - **Story:** Push `AgentNotification` alerts to a `#vendor-governance` Slack channel.

---

## Epic 6: Future "Agentic" Capabilities
**Goal:** Move from "Monitoring" to "Acting."

- 📋 **[BACKLOG] The Negotiator Agent**
  - **Concept:** AI drafts emails to vendors challenging rate increases with historical data and market benchmarks.
- 📋 **[BACKLOG] The Legal Review Agent**
  - **Concept:** AI scans SOWs against the Master Agreement to catch scope creep before signature.
- 📋 **[BACKLOG] Vendor Self-Service Portal**
  - **Concept:** Restricted view where vendors log in to see their Scorecard and upload invoices.
