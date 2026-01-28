
# Team Structure & Composition

To effectively execute the implementation plan, a dedicated, cross-functional agile team is proposed. This structure is designed for high-velocity development, clear communication, and end-to-end ownership of features.

## Core Delivery Team (Scrum Team)

- **Product Owner (1)**
  - Reports to: Head of Procurement / VMO
  - Role: The single point of contact for product vision, backlog management, and feature prioritization. Acts as the voice of the customer.

- **Scrum Master (1)**
  - Role: Facilitator for agile ceremonies, responsible for removing impediments, and ensuring the team adheres to Scrum principles. Can be a dual role for an experienced engineer.

- **Engineering Lead (1)**
  - Role: Technical authority for the team. Responsible for architectural decisions, code quality, and mentoring other engineers.

- **Senior Frontend Engineer (2)**
  - Specialization: React, TypeScript, UI/UX Implementation
  - Role: Responsible for building the client-side application, component library, and data visualizations.

- **AI / Backend Engineer (1)**
  - Specialization: Google GenAI SDK, Node.js, API Integration
  - Role: Owns the `geminiService.ts` layer, implements all AI-driven logic, and manages integrations with third-party systems (Jira, SAP).

- **UI/UX Designer (1)**
  - Role: Responsible for all visual design, user experience flows, prototyping in Figma, and maintaining the design system.

- **QA Engineer (1)**
  - Role: Develops and executes the testing strategy, including manual and automated testing, to ensure platform reliability and quality.

## Visual Representation

```
+---------------------+
|   Product Owner     |
| (Head of VMO)       |
+---------------------+
          |
+---------------------+
|    Scrum Master     |
+---------------------+
          |
+-------------------------------------------------------------+
|                      Engineering Team                       |
+-------------------------------------------------------------+
|        |                |              |            |       |
| +-----------+  +-------------+  +-----------+  +-------+  +------+
| | Eng. Lead |  |  Frontend   |  | AI/Backend|  | UI/UX |  |  QA  |
| |           |  |  Engineers  |  |  Engineer |  |       |  |      |
| +-----------+  +-------------+  +-----------+  +-------+  +------+
```
