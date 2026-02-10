# Data Integration Strategy

To power BuildIntel, we must unify fragmented data sources into a standardized schema for Gemini Enterprise to analyze.

## 1. Data Sources & Connectors

| Source Category | Typical Systems | Integration Method | Frequency |
| :--- | :--- | :--- | :--- |
| **Schedule** | Oracle Primavera P6, MS Project | .XER File Upload / API | Daily |
| **Project Mgmt** | Procore, Autodesk Build | REST API (Webhooks) | Real-time |
| **Financials** | SAP, Oracle NetSuite, Sage | JDBC / ERP Connectors | Weekly/Monthly |
| **Design/BIM** | Revit, Navisworks | Autodesk Forge API | On Revision |
| **IoT/Field** | Sensors, DroneDeploy, Cameras | MQTT / PubSub | Streaming |

## 2. Ingestion Pipeline (ELT)

### Step 1: Ingestion (Cloud Run / Dataflow)
*   **API Pollers:** Scheduled Cloud Functions fetch changes from Procore/ACC APIs.
*   **File Drop:** Cloud Storage triggers Cloud Functions when PDFs/XLSX/XER files are uploaded.

### Step 2: Storage (BigQuery & Cloud Storage)
*   **Structured Data:** Raw JSON logs from APIs are loaded into BigQuery tables (`raw_rfis`, `raw_schedule`).
*   **Unstructured Data:** Documents stored in GCS buckets.

### Step 3: Transformation & Normalization (dbt / BigQuery SQL)
*   **Normalization:** Map proprietary statuses (e.g., Procore "Initiated" vs. ACC "Draft") to a canonical BuildIntel status (`Open`, `Closed`).
*   **Entity Resolution:** Link "Task ID" in P6 to "Cost Code" in SAP.

### Step 4: AI Enrichment (Vertex AI)
*   **Document AI:** OCR and parse PDF invoices and contracts; extract key-value pairs to BigQuery.
*   **Vector Embeddings:** Generate embeddings for all textual data (RFI descriptions, meeting minutes) and store in **Vertex AI Vector Search** for RAG (Retrieval Augmented Generation).

## 3. Handling Unstructured Data with Gemini
*   **Scenario:** Daily Field Reports are often unstructured text blocks.
*   **Technique:** Use Gemini 1.5 Pro with a large context window to process an entire week's worth of daily logs.
*   **Prompt:** "Extract all safety incidents and delay reasons from these logs and output JSON."
*   **Result:** Structured risk data populated in the `AgentAlerts` table.
