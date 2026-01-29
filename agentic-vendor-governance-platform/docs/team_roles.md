
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
  - Leads code reviews to ensure quality and adherence to best practices, with a specific focus on validating and refactoring AI-generated code.
  - Mentors and supports other engineers on the team.
  - Collaborates with the Product Owner on technical feasibility and estimation.
  - Owns the CI/CD pipeline and deployment strategy.

### 4. Senior Frontend Engineer
- **Primary Objective:** Build a responsive, performant, and intuitive user interface.
- **Responsibilities:**
  - Develops and maintains React components using TypeScript, leveraging AI tools for acceleration.
  - Implements the user interface based on Figma designs.
  - Manages client-side state and data fetching.
  - Builds data visualizations using libraries like `recharts`.
  - Critically reviews AI-generated frontend code for correctness, performance, and accessibility.
  - Writes unit and integration tests for frontend components.

### 5. AI / Backend Engineer
- **Primary Objective:** Implement and manage the AI-driven "agentic" logic and data integrations.
- **Responsibilities:**
  - Develops and maintains all functions interacting with the Google GenAI SDK (`geminiService.ts`).
  - Designs and optimizes prompts and JSON schemas for Gemini models.
  - Builds and manages serverless functions or backend services needed for third-party integrations.
  - Designs and implements data mapping and transformation logic for disparate enterprise data sources (e.g., Jira, SAP).
  - Ensures the security and performance of all backend processes.

### 6. UI/UX Designer
- **Primary Objective:** Create a user-centric, visually appealing, and easy-to-use product.
- **Responsibilities:**
  - Conducts user research to inform design decisions.
  - Creates user flows, wireframes, and high-fidelity mockups in Figma.
  - Develops and maintains the platform's design system and component library.
  - Works closely with Frontend Engineers to ensure faithful implementation of designs.
  - Gathers user feedback to iterate on and improve the user experience.

### 7. QA Engineer
- **Primary Objective:** Ensure the product meets quality standards before release.
- **Responsibilities:**
  - Creates and manages test plans and test cases.
  - Performs manual testing for new features and bug fixes.
  - Develops and maintains automated testing suites (e.g., Cypress, Playwright), with a focus on validating outputs from both AI logic and integrated data sources.
  - Reports and tracks defects in the project management tool.
  - Participates in Sprint Planning to identify testing requirements for user stories.
