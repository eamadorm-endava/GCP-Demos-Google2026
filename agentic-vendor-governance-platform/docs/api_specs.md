
# API Specifications (Agentic Layer)

This document outlines the internal AI-service interfaces leveraging Google GenAI SDK (@google/genai).

## 1. Financial Auditor API (Ingestion)
**Model:** `gemini-3-pro-preview`
**Function:** `parseInvoiceAndAudit`
**Input:** Base64 Encoded PDF/Image, MIME type, Rate Card Context (JSON)
**Output Schema:**
- `invoiceNumber`: String
- `vendorName`: String
- `date`: String
- `amount`: Number
- `status`: Enum (Passed, Flagged, Rejected)
- `agentNotes`: String
- `lineItems`: Array<{ 
    `role`: String, 
    `hours`: Number, 
    `rate`: Number, 
    `total`: Number, 
    `discrepancy`: Boolean 
  }>
**Logic:**
1. Extract text and structured data via multimodal understanding.
2. Cross-reference `rate_card` provided in the context.
3. Identify rate violations, role mismatches, or excessive hours (>45/week).
4. Return structured JSON with specific "discrepancy" flags on line items.

## 2. Financial Auditor API (Re-Check)
**Model:** `gemini-3-pro-preview`
**Function:** `auditInvoice`
**Input:** Invoice Object (JSON), Rate Card (JSON)
**Output Schema:**
- `status`: Enum (Passed, Flagged)
- `flags`: Array<String>
- `agentNotes`: String
**Logic:**
1. Re-evaluate specific line items against the MSA.
2. Provide a second-pass opinion on "Flagged" items.

## 3. Meeting Scribe API
**Model:** `gemini-3-pro-preview`
**Function:** `transcribeAndSummarizeMeeting`
**Input:** Base64 Encoded Audio (WAV/WebM/MP4), MIME Type
**Output Schema:**
- `summary`: String (Executive summary of the discussion)
- `actionItems`: Array<String> (List of assigned tasks)
**Logic:**
1. Process raw audio blob using Gemini's multimodal audio understanding.
2. Distinguish context and key decisions.
3. Extract specific action items/tasks suitable for a project tracker.

## 4. QBR Generator API
**Model:** `gemini-3-pro-preview`
**Function:** `generateQBRContent`
**Input:** Aggregated Metrics (JSON), Invoice History (JSON), Past Events (JSON)
**Output Schema:**
- `executiveSummary`: String
- `keySuccesses`: Array<String>
- `risks`: Array<String>
- `recommendations`: Array<String>
**Logic:**
1. Analyze metric trends (e.g., Velocity vs. Bug Count correlations).
2. Synthesize past meeting summaries and financial audit results.
3. Generate strategic insights and executive-level narrative.

## 5. Slide Deck Structure API
**Model:** `gemini-3-pro-preview`
**Function:** `generateSlidesJSON`
**Input:** QBR Data (JSON from Step 4)
**Output Schema:**
- Array of Slide Objects: 
  - `title`: String
  - `content`: Array<String> (Bullet points)
  - `visualType`: Enum (`CHART_SPEND`, `CHART_VELOCITY`, `CHART_SLA`, `SCORECARD`, `NONE`)
**Logic:**
1. Transform analytical text into presentation-ready bullet points.
2. **Contextual Visualization:** Analyze the content of the slide to determine the best visual aid (e.g., if discussing budget, suggest `CHART_SPEND`).
3. Output structure ready for rendering in the Slide Preview modal or export to Google Slides/PPTX.
