
# API Specifications (Agentic Layer)

This document specifies the AI service interfaces in [`geminiService.ts`](file:///Users/ngarg/workspace/agentic-governance-ai/geminiService.ts), all using the Google GenAI SDK (`@google/genai` v1.34.0).

**Common Configuration:**
- **Model:** `gemini-3-pro-preview` (all functions)
- **Output Format:** `responseMimeType: "application/json"` with typed `responseSchema`
- **Authentication:** API key via `process.env.API_KEY` (injected by Vite from `GEMINI_API_KEY` env var)

---

## 1. QBR Content Generator

**Function:** `generateQBRContent(vendor, metrics, events)`

**Input Parameters:**
| Param | Type | Source |
|:---|:---|:---|
| `vendor` | `Vendor` | Selected vendor profile |
| `metrics` | `MetricLog[]` | Vendor-filtered performance data |
| `events` | `GovernanceEvent[]` | Vendor-filtered governance history |

**Prompt Tasks:**
1. Analyze metric trends — correlate Velocity, Bug Count, and Response Time
2. Review action item adherence from past meetings
3. Identify 3 successes, 3 risks (data-backed), and 3 recommendations

**Response Schema:**
```json
{
  "executiveSummary": "string",
  "keySuccesses": ["string"],
  "risks": ["string"],
  "recommendations": ["string"]
}
```

**Used By:** `useQBRGenerator` hook → `VendorDetail.tsx`

---

## 2. Slide Deck Structure Generator

**Function:** `generateSlidesJSON(qbrResult)`

**Input:** QBR data object from function #1.

**Prompt Tasks:**
1. Create 5-6 slides with title, bullet points, and recommended visual type
2. Visual type selection logic:
   - Finance/budget → `CHART_SPEND`
   - Velocity/bugs/efficiency → `CHART_VELOCITY`
   - SLAs/uptime → `CHART_SLA`
   - Risks/scores → `SCORECARD`
   - Otherwise → `NONE`

**Response Schema:**
```json
[
  {
    "title": "string",
    "content": ["string"],
    "visualType": "CHART_SPEND | CHART_VELOCITY | CHART_SLA | SCORECARD | NONE"
  }
]
```

**Used By:** `useQBRGenerator` hook → slide preview modal in `VendorDetail.tsx`

---

## 3. Meeting Transcription & Summarization

**Function:** `transcribeAndSummarizeMeeting(audioBase64, mimeType)`

**Input:** Multimodal — inline Base64 audio data + text prompt in a single Content object.

| Param | Type | Source |
|:---|:---|:---|
| `audioBase64` | `string` | Base64-encoded audio from `MediaRecorder` or file upload |
| `mimeType` | `string` | `audio/webm`, `audio/mp4`, or `audio/wav` |

**Prompt:** "You are the 'Agentic Scribe'. Listen to this vendor governance meeting. Provide a concise executive summary and extract specific action items."

**Response Schema:**
```json
{
  "summary": "string",
  "actionItems": ["string"]
}
```

**Used By:** `useScribe` hook → `MeetingHub.tsx`

---

## 4. Invoice Parsing & Audit (New Upload)

**Function:** `parseInvoiceAndAudit(fileBase64, mimeType, rateCard)`

**Input:** Multimodal — inline Base64 document (PDF/image) + text prompt with embedded rate card.

| Param | Type | Source |
|:---|:---|:---|
| `fileBase64` | `string` | Base64-encoded invoice file |
| `mimeType` | `string` | PDF or image MIME type |
| `rateCard` | `object` | Vendor-specific rate card from `RATE_CARDS` |

**Prompt Tasks:**
1. Extract invoice number, date, amount, vendor name
2. Extract all line items (role, hours, rate, total)
3. Cross-reference rates against provided rate card
4. Flag items where rate exceeds card or hours exceed 45/week

**Response Schema:**
```json
{
  "invoiceNumber": "string",
  "vendorName": "string",
  "date": "string",
  "amount": "number",
  "status": "Passed | Flagged | Rejected",
  "agentNotes": "string",
  "lineItems": [
    {
      "role": "string",
      "hours": "number",
      "rate": "number",
      "total": "number",
      "discrepancy": "boolean"
    }
  ]
}
```

**Used By:** `FinanceHub.tsx` (drag-and-drop upload handler)

---

## 5. Invoice Re-Audit

**Function:** `auditInvoice(invoice, rateCard)`

**Input:** Text-only prompt with serialized invoice and rate card data.

| Param | Type | Source |
|:---|:---|:---|
| `invoice` | `Invoice` | Existing invoice object |
| `rateCard` | `object` | Vendor-specific rate card |

**Prompt Tasks:**
1. Re-evaluate line items against MSA rate card
2. Flag rates exceeding card or hours exceeding 50/week
3. Return second-pass audit opinion

**Response Schema:**
```json
{
  "status": "string",
  "flags": ["string"],
  "agentNotes": "string"
}
```

**Used By:** `FinanceHub.tsx` (re-audit action on existing invoices)
