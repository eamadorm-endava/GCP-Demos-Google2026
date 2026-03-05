# Agile Artifacts: Epics, Features, & Stories

## Epic 1: Intelligent Data Ingestion
**Goal:** Create a unified data layer from disparate construction systems.
*   **Feature 1.1:** Procore Integration.
    *   *Story:* As a Data Engineer, I want to fetch RFI data from Procore API daily so that the AI has up-to-date context.
*   **Feature 1.2:** Schedule Parsing.
    *   *Story:* As a Scheduler, I want to upload an .XER file and have it parsed into the database automatically.

## Epic 2: Predictive Risk Engine (The "Agents")
**Goal:** Shift from reactive reporting to proactive alerting.
*   **Feature 2.1:** Agent Configuration UI.
    *   *Story:* As a Project Exec, I want to configure a "Budget Watchdog" agent to alert me if variances exceed 5%.
*   **Feature 2.2:** AI Prompt Assistance.
    *   *Story:* As a user, I want Gemini to suggest optimal monitoring prompts based on the agent type (Safety vs. Schedule) so I don't have to be a prompt engineer.
*   **Feature 2.3:** Anomaly Detection.
    *   *Story:* As a System, I need to scan daily logs vs. schedule to identify slippage patterns.

## Epic 3: Schedule & Impact Analysis
**Goal:** Quantify the impact of day-to-day blockers.
*   **Feature 3.1:** RFI Impact Predictor.
    *   *Story:* As a PM, I want to click an RFI and see exactly which schedule tasks are blocked and the estimated delay in days.
*   **Feature 3.2:** Priority Simulator.
    *   *Story:* As a PM, I want to toggle an RFI from "Low" to "High" priority and see how the predicted completion date changes.

## Epic 4: Conversational Intelligence
**Goal:** Democratize access to complex data.
*   **Feature 4.1:** Project Context Chatbot.
    *   *Story:* As a CTO, I want to ask "Why is the Ashburn project delayed?" and get a summary citing specific RFIs and Weather events.
*   **Feature 4.2:** Actionable Suggestions.
    *   *Story:* As a user, when the AI identifies a risk, I want it to suggest specific actions (e.g., "Draft email to structural engineer").
