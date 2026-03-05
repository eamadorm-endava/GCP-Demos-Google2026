
# Team Roles & Responsibilities

This document provides a detailed breakdown of the responsibilities for each role within the Agentic Vendor Governance Platform team.

### 1. Product Owner
- **Primary Objective:** Maximize the value of the product resulting from the work of the Development Team.
- **Responsibilities:**
  - Owns and manages the Product Backlog, including creating, prioritizing, and refining user stories.
  - Defines the product vision and roadmap.
  - Represents the stakeholders and customers, ensuring their needs are met.
  - Is the final authority on feature acceptance during Sprint Reviews.
  - Works closely with the development team to ensure a clear understanding of backlog items.

### 2. Scrum Master
- **Primary Objective:** Ensure the Scrum framework is understood and enacted.
- **Responsibilities:**
  - Facilitates all Scrum ceremonies (Daily Stand-up, Sprint Planning, Sprint Review, Retrospective).
  - Removes impediments blocking the Development Team's progress.
  - Coaches the team in agile practices and self-organization.
  - Protects the team from external distractions and interruptions.
  - Helps the Product Owner with backlog management techniques.

### 3. Engineering Lead
- **Primary Objective:** Ensure the technical integrity and quality of the platform.
- **Responsibilities:**
  - Makes key architectural decisions and defines technical standards.
  - Leads code reviews with a specific focus on validating and refactoring AI-generated code.
  - Owns the Vite build configuration, TypeScript setup, and deployment strategy.
  - Manages dependency decisions (React 19, Recharts, Lucide, @google/genai SDK).
  - Mentors and supports other engineers on the team.
  - Collaborates with the Product Owner on technical feasibility and estimation.

### 4. Senior Frontend Engineer
- **Primary Objective:** Build a responsive, performant, and intuitive user interface.
- **Responsibilities:**
  - Develops and maintains React components using TypeScript, leveraging AI-assisted tooling for acceleration.
  - Implements page components (`Dashboard.tsx`, `FinanceHub.tsx`, `MeetingHub.tsx`, `VendorDetail.tsx`, `Settings.tsx`).
  - Builds and maintains shared components (`Modal.tsx`, `StatCard.tsx`, `AgentFeed.tsx`) and the `Layout.tsx` shell.
  - Creates data visualizations using Recharts (Bar, Area, Line, Pie, Composed charts).
  - Manages client-side state, React Router navigation, and custom hooks.
  - Ensures responsive design across desktop, tablet, and mobile breakpoints.
  - Reviews AI-generated frontend code for correctness, performance, and accessibility.

### 5. AI / Backend Engineer
- **Primary Objective:** Implement and manage the AI-driven "agentic" logic and data integrations.
- **Responsibilities:**
  - Develops and maintains all functions in `geminiService.ts` interacting with the Google GenAI SDK.
  - Designs and optimizes prompts and JSON response schemas for `gemini-3-pro-preview`.
  - Builds custom hooks for AI workflows: `useQBRGenerator` (QBR + slide generation) and `useScribe` (audio recording + transcription).
  - Manages multimodal inputs (Base64 audio, PDF, image) and structured JSON outputs.
  - Future: builds serverless functions or API layer for third-party integrations (Jira, SAP, Slack).
  - Ensures security and performance of all AI processing pipelines.

### 6. UI/UX Designer
- **Primary Objective:** Create a user-centric, visually appealing, and easy-to-use product.
- **Responsibilities:**
  - Conducts user research to inform design decisions.
  - Creates user flows, wireframes, and high-fidelity mockups in Figma.
  - Maintains the Endava-branded design system: color palette, typography (Poppins), card styles, animations.
  - Defines the TailwindCSS custom theme configuration and CSS custom properties.
  - Works closely with Frontend Engineers to ensure faithful implementation of designs.
  - Gathers user feedback to iterate on and improve the user experience.

### 7. QA Engineer
- **Primary Objective:** Ensure the product meets quality standards before release.
- **Responsibilities:**
  - Creates and manages test plans and test cases for all agentic workflows (invoice audit, audio transcription, QBR generation).
  - Performs manual testing for new features and bug fixes across desktop and mobile viewports.
  - Develops automated testing suites (e.g., Playwright, Cypress) with focus on validating AI outputs and multimodal inputs.
  - Validates edge cases: Gemini API failures, empty state handling, recording permissions, file format support.
  - Reports and tracks defects in the project management tool.
  - Participates in Sprint Planning to identify testing requirements for user stories.
