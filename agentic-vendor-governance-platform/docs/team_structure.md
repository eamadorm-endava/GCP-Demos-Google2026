
# Team Structure & Composition

To effectively execute the implementation plan, a dedicated, cross-functional agile team is proposed. This structure is designed for high-velocity development, clear communication, and end-to-end ownership of features.

## Core Delivery Team (Scrum Team)

- **Product Owner (1)**
  - Reports to: Head of Procurement / VMO
  - Role: The single point of contact for product vision, backlog management, and feature prioritization. Acts as the voice of the customer.

- **Scrum Master (1)**
  - Role: Facilitator for agile ceremonies, responsible for removing impediments, and ensuring the team adheres to Scrum principles. Can be a dual role for an experienced engineer.

- **Engineering Lead (1)**
  - Role: Technical authority for the team. Responsible for architectural decisions, code quality, build tooling (Vite, TypeScript), and mentoring other engineers.

- **Senior Frontend Engineer (2)**
  - Specialization: React 19, TypeScript, Recharts, TailwindCSS
  - Role: Responsible for building page components, shared UI components, responsive layouts, and data visualizations. Manages React Router navigation and custom hooks.

- **AI / Backend Engineer (1)**
  - Specialization: Google GenAI SDK (@google/genai), Prompt Engineering, Multimodal AI
  - Role: Owns `geminiService.ts` and AI workflow hooks (`useQBRGenerator`, `useScribe`). Implements all AI-driven logic and future third-party integrations (Jira, SAP, Slack).

- **UI/UX Designer (1)**
  - Role: Responsible for visual design, UX flows, Figma prototyping, and maintaining the Endava-branded design system (color palette, Poppins typography, card styles).

- **QA Engineer (1)**
  - Role: Develops and executes the testing strategy, including manual and automated testing of agentic AI workflows, multimodal inputs, and cross-device responsiveness.

## Team Composition Summary

| Role | Count | Phase 1 Focus | Phase 2 Focus |
|:---|:---|:---|:---|
| Product Owner | 1 | Feature prioritization, MVP scope | Enterprise requirements, vendor partnerships |
| Scrum Master | 1 | Process establishment | Scaling ceremonies |
| Engineering Lead | 1 | Architecture, build config | Integration architecture, security |
| Sr. Frontend Engineer | 2 | Page components, charts, responsive UI | SSO UI, real-time data binding |
| AI / Backend Engineer | 1 | Gemini prompts, hooks, workflows | API layer, Jira/SAP connectors |
| UI/UX Designer | 1 | Design system, page layouts | Self-service portal design |
| QA Engineer | 1 | AI workflow testing, manual QA | Integration testing, automated suites |
| **Total** | **8** | | |

## Visual Representation

```
┌─────────────────────────┐
│     Product Owner        │
│   (Head of VMO)          │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│      Scrum Master        │
└────────────┬────────────┘
             │
┌────────────▼──────────────────────────────────────────────────┐
│                     Engineering Team                          │
├──────────┬───────────────┬──────────────┬─────────┬──────────┤
│ Eng Lead │ 2× Frontend   │ AI/Backend   │ UI/UX   │    QA    │
│          │ Engineers      │ Engineer     │ Designer│ Engineer │
└──────────┴───────────────┴──────────────┴─────────┴──────────┘
```
