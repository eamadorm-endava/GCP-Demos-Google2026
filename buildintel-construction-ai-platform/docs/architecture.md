# BuildIntel System Architecture

## Technology Stack
*   **Cloud Provider:** Google Cloud Platform (GCP)
*   **Frontend:** React (TypeScript), Tailwind CSS, Recharts.
*   **AI Models:** Gemini 1.5 Pro (Reasoning), Gemini 1.5 Flash (High volume/speed), Vertex AI Embeddings.
*   **Backend:** Node.js / Python.

## Architecture Diagram Description

1.  **Data Sources Layer:**
    *   Autodesk Construction Cloud, Procore, P6, ERP, IoT Sensors.

2.  **Ingestion & Orchestration Layer:**
    *   **Cloud Pub/Sub:** Queues incoming data events.
    *   **Cloud Functions:** Lightweight connectors to fetch/push data.
    *   **Document AI:** Extracts text from PDFs/Drawings.

3.  **Data Persistence Layer:**
    *   **BigQuery:** Data Warehouse for structured construction data (Schedules, Financials).
    *   **Cloud Storage:** Object storage for raw documents.
    *   **Vertex AI Vector Search:** Database for semantic embeddings (used for RAG).

4.  **The Intelligence Engine (Vertex AI):**
    *   **Gemini Enterprise API:**
        *   *Agent Reasoning:* Processes monitoring prompts against data.
        *   *Impact Analysis:* Correlates RFIs with Schedule logic.
        *   *Summarization:* Generates executive briefs.
    *   **Grounding:** Gemini output is grounded in the Vector Search index to prevent hallucinations.

5.  **Application Layer:**
    *   **Cloud Run:** Hosts the API and Frontend assets (containerized).
    *   **Firebase Authentication:** User management and RBAC.

6.  **Frontend Layer:**
    *   React SPA consuming REST APIs.
    *   Real-time updates via WebSockets (or Firebase Realtime DB) for alert feeds.

## Data Flow: "RFI Impact Analysis"
1.  User selects RFI in Frontend.
2.  Frontend sends RFI ID + Current Schedule Context to Backend.
3.  Backend retrieves RFI details and Critical Path tasks from BigQuery.
4.  Backend constructs a prompt for **Gemini 1.5 Pro**: *"Given RFI X and Schedule Y, predict the delay..."*
5.  Gemini analyzes dependencies and returns JSON (Delay Days, Explanation).
6.  Backend returns result to Frontend for visualization.
