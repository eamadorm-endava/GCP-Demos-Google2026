# Presentation Slides: Agentic Vendor Governance

## Slide 1: Title
**Headline:** Agentic Vendor Governance Platform
**Sub-headline:** AI-Powered Multi-Vendor Management with Google Gemini
**Speaker Notes:** Introduce the vision of a neutral, automated governance layer powered by Google's latest Gemini models.

## Slide 2: The Problem
**Visual:** Graphic showing "$450k/yr Manual Governance" vs "Inconsistent Vendor Reporting"
**Bullet Points:**
- Manual "self-grading" by vendors — no neutral verification.
- Hidden overbilling buried in complex PDF invoices.
- Weeks of manual effort for QBR preparation across 6+ vendors.
- No real-time SLA visibility — issues discovered post-impact.
- Disconnected governance touchpoints across dev, security, AI, and marketing vendors.

## Slide 3: The Solution
**Visual:** Architecture diagram: React SPA → Google Gemini API (gemini-3-pro-preview)
**Bullet Points:**
- **Neutrality:** Data-driven truth from automated auditing, not vendor-reported "fluff."
- **Agency:** AI Agents that proactively audit invoices, transcribe meetings, and generate strategic reports.
- **Efficiency:** 90% reduction in reporting overhead — QBR prep in 10 seconds, not 2 weeks.
- **Intelligence:** Head-to-head vendor comparison across standardized KPIs.

## Slide 4: Feature Focus — The Auditor Agent
**Visual:** Screenshot of the Financial Hub (`/finance` route)
**Bullet Points:**
- Multimodal PDF/Image ingestion via drag-and-drop.
- Real-time rate card validation against MSA-contracted rates.
- Automatic flagging: rate violations, role mismatches, capacity breaches (>45h/week).
- Rate Comparison Matrix across all 6 vendors for cost arbitrage.
- Predictive "Burn Rate" forecasting with actual vs. budget overlays.

## Slide 5: Feature Focus — The Scribe Agent
**Visual:** Screenshot of the Meeting Hub (`/hub` route) with audio recording controls
**Bullet Points:**
- Live audio recording with real-time audio level visualization.
- AI-powered meeting transcription and summarization via Gemini.
- Automated action item extraction in structured JSON format.
- Chronological governance timeline for audit compliance.
- Supports WebM, MP4, and WAV audio formats.

## Slide 6: Feature Focus — QBR Generator
**Visual:** Screenshot of QBR slide preview in Vendor Detail (`/vendor/:id` route)
**Bullet Points:**
- One-click executive summary generation from 90-day performance data.
- AI-structured presentation deck with recommended chart types per slide.
- Live chart preview using Recharts before export.
- Visual type intelligence: AI selects Spend Charts, Velocity Graphs, SLA Charts, or Scorecards.

## Slide 7: Business Impact & ROI
**Visual:** Comparison Table
| Feature | Manual Model | Agentic Model |
|:---|:---|:---|
| **Audit Coverage** | 10% Spot Checks | 100% Automated |
| **QBR Prep Time** | 2 Weeks | 10 Seconds |
| **Annual Cost** | $450,000 | $100,000 |
| **Discrepancy Detection** | Post-payment | Pre-payment |
| **Meeting Documentation** | Manual Minutes | AI Transcription |
| **Vendor Comparison** | Quarterly Reports | Real-time Dashboard |

## Slide 8: Technology Stack
**Visual:** Tech stack icons
**Bullet Points:**
- **Frontend:** React 19, TypeScript, Vite 7, TailwindCSS, Recharts
- **AI Engine:** Google Gemini (gemini-3-pro-preview) via @google/genai SDK
- **Audio Processing:** Web Audio API + MediaRecorder → Gemini multimodal
- **Design:** Endava branding, Poppins typography, glassmorphism cards

## Slide 9: Next Steps
**Headline:** From Prototype to Production
**Bullet Points:**
- Implement data persistence layer (database + API).
- Connect live Jira/Linear instances for real-time metrics.
- Integrate with SAP Ariba/Coupa for financial workflow.
- Add SSO authentication (Okta/Google Workspace).
- Deploy "Negotiator Agent" for automated vendor rate challenges.
- Launch Vendor Self-Service Portal for direct scorecard access.