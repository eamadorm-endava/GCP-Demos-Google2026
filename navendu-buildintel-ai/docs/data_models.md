# BuildIntel Data Models

This document outlines the core schemas used in the BigQuery (Structured) and Vertex AI Vector Search (Unstructured) databases.

## 1. Entity Relationship Diagram (Conceptual)
*   **Project** (1) ---- (Many) ----> **ScheduleTask**
*   **Project** (1) ---- (Many) ----> **RFI**
*   **Project** (1) ---- (Many) ----> **FinancialRecord**
*   **Project** (1) ---- (Many) ----> **RiskAgent**
*   **RiskAgent** (1) ---- (Many) ----> **Alert**
*   **RFI** (Many) ---- (Many) ----> **ScheduleTask** (Via *ImpactAnalysis* link)

## 2. Structured Data Schemas (BigQuery)

### 2.1. `projects`
Metadata for the construction sites.
```sql
CREATE TABLE projects (
  id STRING(36) NOT NULL,
  project_code STRING(20), -- e.g. DC-ASH-001
  name STRING(255),
  location STRING(100),
  region STRING(50),
  status STRING(20), -- Active, On Hold, Completed
  total_budget NUMERIC,
  start_date DATE,
  est_completion_date DATE,
  created_at TIMESTAMP,
  PRIMARY KEY(id)
);
```

### 2.2. `schedule_tasks`
Imported from Primavera P6 or MS Project.
```sql
CREATE TABLE schedule_tasks (
  id STRING(36) NOT NULL,
  project_id STRING(36) NOT NULL,
  wbs_code STRING(50), -- Work Breakdown Structure
  name STRING(255),
  start_date DATE,
  end_date DATE,
  status STRING(20), -- Not Started, In Progress, Completed
  percent_complete INT64,
  is_critical_path BOOL,
  assigned_contractor STRING(100),
  float_days INT64, -- Slack time
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

### 2.3. `rfis` (Requests for Information)
Synced from Procore / Autodesk Build.
```sql
CREATE TABLE rfis (
  id STRING(36) NOT NULL,
  project_id STRING(36) NOT NULL,
  external_id STRING(50), -- ID in source system (e.g., #1042)
  subject STRING(255),
  description STRING(MAX), -- Full text
  discipline STRING(50), -- Structural, MEP, Civil
  status STRING(20), -- Open, Closed, Draft
  priority STRING(10), -- High, Medium, Low
  date_opened DATE,
  date_due DATE,
  assignee_email STRING(100),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

### 2.4. `financials`
Aggregated cost data from ERP.
```sql
CREATE TABLE financials (
  id STRING(36) NOT NULL,
  project_id STRING(36) NOT NULL,
  cost_code STRING(20),
  category STRING(50), -- Concrete, Site Work
  budget_amount NUMERIC,
  actual_cost NUMERIC,
  committed_cost NUMERIC,
  forecast_at_completion NUMERIC,
  period_date DATE, -- For historical trending
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

### 2.5. `risk_agents`
Configuration for the AI monitoring agents.
```sql
CREATE TABLE risk_agents (
  id STRING(36) NOT NULL,
  project_id STRING(36) NOT NULL,
  name STRING(100),
  type STRING(50), -- Schedule, Safety, Quality
  prompt_template STRING(MAX), -- The System Instruction for Gemini
  frequency STRING(20), -- Daily, Hourly
  is_active BOOL,
  last_run_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

### 2.6. `alerts`
Anomalies detected by Agents.
```sql
CREATE TABLE alerts (
  id STRING(36) NOT NULL,
  project_id STRING(36) NOT NULL,
  agent_id STRING(36) NOT NULL,
  title STRING(255),
  description STRING(MAX),
  severity STRING(20), -- Critical, High, Medium, Low
  confidence_score INT64, -- 0-100
  status STRING(20), -- New, Verified, Dismissed
  source_reference STRING(255), -- Link to original doc/log
  detected_at TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES risk_agents(id)
);
```

## 3. Vector Data (Vertex AI)

### 3.1. `document_embeddings`
Used for RAG (Retrieval Augmented Generation).

*   **Index Structure:**
    *   `id`: Document Chunk ID.
    *   `embedding`: `FLOAT32[768]` (Output from Gecko/text-embedding-004).
    *   **Metadata Fields (for filtering):**
        *   `project_id`: String
        *   `doc_type`: String (Contract, Drawing, Report)
        *   `date`: Timestamp
        *   `page_number`: Integer
        *   `source_text`: String (The raw text chunk)

## 4. Derived / AI Tables

### 4.1. `rfi_impact_analysis`
Stores the results of the "Impact Analysis" feature.
```sql
CREATE TABLE rfi_impact_analysis (
  id STRING(36) NOT NULL,
  rfi_id STRING(36) NOT NULL,
  predicted_delay_days INT64,
  ai_explanation STRING(MAX),
  affected_task_ids ARRAY<STRING>, -- List of Schedule Task IDs
  analysis_date TIMESTAMP,
  model_version STRING(50), -- e.g., gemini-1.5-pro
  FOREIGN KEY (rfi_id) REFERENCES rfis(id)
);
```
