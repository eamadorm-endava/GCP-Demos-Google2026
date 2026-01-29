
# Sprint Plan Roadmap

This document breaks down the project into two-week sprints. The timeline assumes an AI-assisted development workflow (e.g., using Antigravity IDE), which may accelerate the completion of scaffolding and boilerplate code, allowing for a deeper focus on complex logic earlier in the process.

---

### Phase 1: Core Agentic MVP (10 Weeks)

---

#### Sprint 1: Foundation & Scaffolding
- **Goal:** Establish the development environment, core application shell, and component library.
- **User Stories:**
  - As a Developer, I need a React/TypeScript project with routing for all main pages.
  - As a Developer, I need a `Layout.tsx` component with a responsive sidebar and header.
  - As a Designer, I need a basic component library in Storybook with core UI elements.
  - As a Developer, I can build the UI for the Command Center and Vendor Detail pages using static, mocked data.

#### Sprint 2: Financial Hub - Invoice Ingestion
- **Goal:** Implement the core invoice auditing workflow.
- **User Stories:**
  - As a Finance Analyst, I can drag-and-drop a PDF/Image invoice into the Finance Hub.
  - As a System, I can send the uploaded file (Base64) to the `parseInvoiceAndAudit` Gemini function.
  - As a System, I can receive the structured JSON response and add the new invoice to the top of the list.
  - As a User, I can click on a newly audited invoice and see the detailed Auditor Report panel with line-item analysis.

#### Sprint 3: Meeting Hub - The Agentic Scribe
- **Goal:** Implement real-time audio transcription and summarization.
- **User Stories:**
  - As a VMO, I can open the "Agentic Scribe" modal and start a live recording via my microphone.
  - As a System, the `useScribe` hook should capture audio and display a live visualizer.
  - As a VMO, when I stop the recording, the audio blob is sent to the `transcribeAndSummarizeMeeting` Gemini function.
  - As a System, the returned summary and action items create a new event on the Governance Timeline.

#### Sprint 4: Strategic Reporting - The QBR Generator
- **Goal:** Automate the creation of QBR content and slide previews.
- **User Stories:**
  - As a VMO, I can click "Run QBR" on a Vendor Detail page to open the generation modal.
  - As a System, I can gather the relevant vendor metrics and events and send them to the `generateQBRContent` Gemini function.
  - As a User, I can view the AI-generated executive summary and recommendations.
  - As a User, I can click "Preview Slides" to trigger the `generateSlidesJSON` function and view the slides with live `recharts` visuals in a modal.

#### Sprint 5: Polish, Testing & MVP Release Prep
- **Goal:** Refine all existing features, fix bugs, and prepare for the initial user feedback loop.
- **Tasks:**
  - **Testing:** End-to-end testing of all core agentic workflows.
  - **UI Polish:** Ensure consistent styling, animations, and responsiveness across all views.
  - **Error Handling:** Implement robust error handling for all Gemini API calls (e.g., show user-friendly messages on failure).
  - **Performance:** Optimize initial load time and chart rendering.
  - **Documentation:** Update `README.md` with setup and usage instructions.

---

### Phase 2: Enterprise Integration (10 Weeks)

---

#### Sprint 6: Data Integration - Foundation & Jira (Part 1)
- **Goal:** Build the foundational data mapping layer and begin Jira integration.
- **User Stories:**
  - As a Backend Engineer, I can define a data transformation service to normalize external data into our platform's `MetricLog` model.
  - As an Admin, I can securely authenticate with our Jira instance via OAuth in the Settings page.
  - As a System, I can fetch raw issue data (e.g., `Story Points`, `Bug Priority`) from a specified Jira project.

#### Sprint 7: Data Integration - Jira (Part 2) & Slack
- **Goal:** Complete Jira data mapping and implement Slack notifications.
- **User Stories:**
  - As a Backend Engineer, I can map Jira's "Story Points" to our `Velocity` metric and "High Priority Bugs" to our `BugCount` metric.
  - As a User, the Command Center charts now reflect live data from Jira.
  - As an Admin, I can connect a Slack workspace and specify a channel for notifications.
  - As a System, when the Auditor Agent flags an invoice, a message is posted to the configured Slack channel.

#### Sprint 8 & 9: Financial Workflow Integration (SAP/Coupa)
- **Goal:** Connect the platform to a financial System of Record.
- **User Stories:**
  - As an Admin, I can configure the connection to our SAP Ariba instance.
  - As a Backend Engineer, I can design the data mapping for the SAP Ariba API schema.
  - As a Finance Analyst, after approving an invoice in the platform, I have an option to "Push to SAP for Payment".
  - As a System, a successful push updates the invoice status to "Payment Processing" and includes a transaction ID.

#### Sprint 10: SSO & Final Integration Testing
- **Goal:** Implement Single Sign-On and conduct end-to-end testing of all integrated systems.
- **User Stories:**
  - As a User, I can log in to the platform using my corporate Okta/Google Workspace credentials.
  - As a QA Engineer, I can verify that data flows correctly from Jira -> Platform -> Slack.
  - As a QA Engineer, I can verify that invoice approval flows correctly from Platform -> SAP.
