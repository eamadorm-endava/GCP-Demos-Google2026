
# Product Backlog & Roadmap: Agentic Vendor Governance Platform

## Status Legend
- ✅ **[DONE]**: Implemented and functional in current build.
- 🚧 **[IN PROGRESS]**: UI exists, logic partially mocked or pending backend.
- 📋 **[BACKLOG]**: Planned for future sprints.

---

## Epic 1: Multi-Vendor Command Center
**Goal:** Provide a single pane of glass for all vendor metrics to eliminate "swivel-chair" management.

### Features
- ✅ **Head-to-Head Dashboard**
  - **Story:** As a Procurement Lead, I need to compare Vendor A vs. Vendor B on specific KPIs (Velocity, Bugs, Response Time) side-by-side.
  - **Tech:** `recharts` dynamic data filtering based on `selectedVendorIds`.
- ✅ **Global Metric Alerts (Agent Feed)**
  - **Story:** As a user, I need a sidebar feed that pushes real-time alerts about SLA breaches or critical invoice flags without me searching for them.
  - **Tech:** `AgentNotification` model, sidebar component.
- ✅ **Vendor Detail Profile**
  - **Story:** As a VMO, I need a dedicated page for each vendor showing their contract details (MSA ID, Renewal Date) and specific health trends.
  - **Tech:** Dynamic routing `/vendor/:id`, color-coded vendor branding.
- ✅ **Trend Analytics**
  - **Story:** As an Exec, I want to see a 6-month trend line for "Velocity vs. Quality" to detect if a vendor is shipping faster but breaking more things.
  - **Tech:** Composed Charts (Bar + Line) in `recharts`.

---

## Epic 2: Agentic Financial Audit
**Goal:** Automate the reconciliation of invoices against contracts to prevent revenue leakage.

### Features
- ✅ **Multimodal Invoice Ingestion**
  - **Story:** As a Finance Analyst, I want to drag-and-drop PDF/Image invoices and have the AI extract line items automatically.
  - **Tech:** `gemini-3-pro-preview` with multimodal input (Base64 PDF/Image).
- ✅ **Automated Rate Card Validation**
  - **Story:** As a System, I must cross-reference every extracted line item against the `RATE_CARDS` constant and flag discrepancies immediately.
  - **Tech:** Logic in `geminiService.ts` to compare billed rates vs. MSA limits.
- ✅ **Rate Comparison Matrix**
  - **Story:** As a Procurement Negotiator, I want a matrix view comparing "Senior Developer" rates across *all* vendors to identify cost arbitrage opportunities.
  - **Tech:** Data pivot table in `FinanceHub.tsx`.
- ✅ **Smart Spend Forecaster**
  - **Story:** As a Budget Owner, I want an AI prediction of whether we will burn through our Q2 budget based on current spending velocity.
  - **Tech:** Visualized via Area Chart overlays (Actual vs. Budget).
- 📋 **[BACKLOG] Bulk Invoice Export**
  - **Story:** Export audited invoice data to CSV/Excel for import into SAP/Oracle.

---

## Epic 3: Automated Governance & Meeting Intelligence
**Goal:** Eliminate manual minute-taking and ensure contractual commitments are tracked.

### Features
- ✅ **Native Audio Scribe**
  - **Story:** As a Vendor Manager, I want to record a live governance sync and have the AI transcribe and summarize it instantly.
  - **Tech:** `gemini-2.5-flash-native-audio-preview-12-2025` via `useScribe` hook (Microphone Stream -> Blob -> Gemini).
- ✅ **Action Item Extraction**
  - **Story:** As a Project Manager, I want the AI to parse the meeting audio and output a JSON list of "Action Items" to populate my timeline.
  - **Tech:** Structured JSON output schema in Gemini prompt.
- ✅ **Governance Timeline**
  - **Story:** As an Auditor, I want a chronological audit trail of all QBRs, Monthly Syncs, and Standups to prove governance compliance.
  - **Tech:** `MeetingHub` timeline component.
- 📋 **[BACKLOG] Speaker Diarization**
  - **Story:** The transcript should distinguish between "Vendor Rep" and "Internal Stakeholder" to better attribute action items.

---

## Epic 4: Strategic Reporting (QBRs)
**Goal:** Reduce QBR preparation time from 2 weeks to minutes.

### Features
- ✅ **One-Click QBR Generation**
  - **Story:** As a VMO, I want to generate a strategic Executive Summary based on the last 90 days of Metrics, Invoices, and Meetings.
  - **Tech:** Context-aware prompting in `geminiService` aggregating `METRIC_LOGS` and `EVENTS`.
- ✅ **Intelligent Slide Generation**
  - **Story:** As a Presenter, I want the AI to structure the data into slides and *recommend* the specific chart type (e.g., "Use a Spend Chart here").
  - **Tech:** `visualType` enum in Gemini response schema (`CHART_SPEND`, `CHART_VELOCITY`).
- ✅ **Slide Preview Modal**
  - **Story:** As a User, I want to preview the generated slides with real live charts rendered inside them before exporting.
  - **Tech:** Dynamic component injection in `VendorDetail.tsx`.
- 🚧 **[IN PROGRESS] Real Google Slides API Integration**
  - **Story:** Clicking "Export" should create a real file in the user's Google Drive via the Slides API (currently generates a mock URL).

---

## Epic 5: Enterprise Integrations
**Goal:** Connect the "Agentic Layer" to the System of Record.

### Features
- 🚧 **[IN PROGRESS] Settings & Configuration**
  - **Story:** Users can toggle integrations and adjust Agent "Personality" (Tolerance thresholds, Tone).
  - **Status:** UI implemented in `Settings.tsx`, state is local-only.
- 📋 **[BACKLOG] Jira / Linear Sync**
  - **Story:** Fetch real `BugCount` and `Velocity` metrics from live Jira projects instead of static constants.
- 📋 **[BACKLOG] SAP Ariba / Coupa Connector**
  - **Story:** Push "Approved" invoices directly to the ERP for payment processing.
- 📋 **[BACKLOG] Slack / Teams Bots**
  - **Story:** Push `AgentNotification` alerts to a specific `#vendor-governance` Slack channel.

---

## Epic 6: Future "Agentic" Capabilities
**Goal:** Move from "Monitoring" to "Acting".

- 📋 **[BACKLOG] The Negotiator Agent**
  - **Concept:** AI that drafts an email to the vendor challenging a rate increase based on historical data and market benchmarks.
- 📋 **[BACKLOG] The Legal Review Agent**
  - **Concept:** AI that scans uploaded SOWs (Statements of Work) against the Master Agreement to catch scope creep before signature.
- 📋 **[BACKLOG] Vendor Self-Service Portal**
  - **Concept:** A restricted view where Vendors can log in to see their own Scorecard and upload invoices directly.
