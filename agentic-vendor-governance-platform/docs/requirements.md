
# Product Requirements: Agentic Vendor Governance Platform

## 1. Executive Summary
The Agentic Vendor Governance Platform is a neutral, AI-driven governance layer built on Google Cloud. It replaces expensive, manual self-governance models with an automated "Agentic" solution that monitors multi-vendor ecosystems (e.g., Development, Security, Marketing) using comparable metrics and automated financial auditing.

## 2. Target Audience
- **Procurement Operations:** Managing multi-vendor risk and contract compliance.
- **Vendor Management Offices (VMO):** Tracking performance against SLAs.
- **C-Suite/Finance:** Oversight of multi-million dollar outsourced engineering spend.

## 3. Core Functional Requirements (Implemented)

### 3.1 Multi-Vendor Command Center
- **Head-to-Head Dashboard:** Side-by-side visualization of vendors on key metrics: Spend, SLA Adherence, and Innovation.
- **Agent Feed:** Real-time sidebar notifications alerting users to critical flags, SLA breaches, and strategic insights.
- **Diverse Ecosystem Support:** Capable of tracking Engineering (Nexus), CloudOps (Aether), AI (Synthetix), Design (Orbit 9), Security (IronClad), and Marketing (FlowState) vendors.
- **Comparison Analytics:** Dynamic chart filtering to compare specific vendors against baseline targets using `recharts`.

### 3.2 Agentic Financial Governance
- **Invoice Ingestion:** Support for PDF/Image uploads of vendor invoices via drag-and-drop.
- **Auditor Agent:** AI-driven analysis using `gemini-3-pro-preview` to parse line items and detect anomalies.
- **Rate Card Validation:** Automated cross-referencing of billed roles/hours against Master Services Agreement (MSA) rate cards.
- **Rate Comparison Matrix:** A dedicated view comparing role rates across all active vendors to identify cost arbitrage opportunities.
- **Smart Forecaster:** AI-powered budget burn rate analysis to predict overspend before it happens.
- **Discrepancy Flagging:** Instant alerts for:
    - Rate Violations (Billed rate > MSA rate).
    - Role Mismatches (Role not in MSA).
    - Capacity Breaches (Hours > 45/week).

### 3.3 Automated Meeting & Cadence Hub
- **Agentic Scribe:** Real-time audio processing using `gemini-2.5-flash-native-audio-preview-12-2025` to transcribe and summarize governance meetings without intermediate STT steps.
- **Action Item Extraction:** Automated extraction of tasks from meeting audio.
- **QBR Generator:** One-click generation of Quarterly Business Review content using `gemini-3-pro-preview`.
- **Slide Deck Generation:** Automated creation of presentation decks with AI-selected visualizations (Spend Charts, Velocity Graphs, Scorecards).

### 3.4 Platform Administration & Configuration
- **Vendor Onboarding:** Workflows to provision new vendor profiles with MSA details and color themes.
- **Agent Tuning:** Configurable thresholds for the Auditor Agent (e.g., set Discrepancy Tolerance amounts) and Tone settings for the Scribe.
- **Integration Management:** Toggles for connecting external systems (Jira, Slack, ServiceNow, SAP Ariba).
- **Notification Preferences:** User controls for specific alert types (SLA breaches, Invoice flags).

## 4. Non-Functional Requirements
- **Security:** SOC2 compliant auditing simulation; Data processing happens in memory or via secure API calls.
- **Performance:** Real-time dashboard updates with optimistic UI; <3s response time for text generation, <10s for audio processing.
- **Scalability:** Built on client-side React with serverless AI integration via Google GenAI SDK.
- **Responsive Design:** Functional on Desktop, Tablet, and Mobile.
