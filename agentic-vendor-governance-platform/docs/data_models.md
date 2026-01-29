
# Data Models

The platform uses a TypeScript-defined data structure optimized for React state and Gemini JSON schemas.

## 1. Core Entities

### Vendor
- `id`: String (e.g., 'v1')
- `name`: String
- `msaId`: String
- `status`: 'Active' | 'Probation'
- `color`: String (UI theme: 'indigo', 'teal', 'orange', 'purple', 'rose', 'blue')
- `description`: String
- `contactName`: String
- `contactEmail`: String
- `renewalDate`: String (ISO Date)

### MetricLog
- `id`: String
- `vendorId`: String
- `date`: String (ISO Date)
- `type`: Enum (Velocity, Bug Count, SLA Adherence, Uptime, Response Time)
- `value`: Number
- `target`: Number

### Invoice
- `id`: String
- `vendorId`: String
- `invoiceNumber`: String
- `date`: String
- `amount`: Number
- `status`: Enum (Passed, Flagged, Rejected, Pending)
- `agentNotes`: String (AI Generated)
- `lineItems`: Array<InvoiceLineItem>

### InvoiceLineItem
- `role`: String
- `hours`: Number
- `rate`: Number
- `total`: Number
- `discrepancy`: Boolean (Optional - Flagged by Auditor Agent)

### GovernanceEvent
- `id`: String
- `type`: Enum (QBR, Monthly Sync, Weekly Standup)
- `date`: String
- `summary`: String
- `vendorId`: String
- `actionItems`: Array<String>

### Slide (QBR Generated)
- `title`: String
- `content`: Array<String>
- `visualType`: Enum (CHART_SPEND, CHART_VELOCITY, CHART_SLA, SCORECARD, NONE)

### AgentNotification
- `id`: String
- `type`: 'alert' | 'check' | 'calendar'
- `message`: String
- `timestamp`: String

## 2. Configuration Entities

### AgentSettings
- `auditTolerance`: Number (Threshold for financial flag severity)
- `autoApprove`: Boolean (Auto-approve clean invoices)
- `scribeModel`: String (e.g., 'gemini-3-flash-preview', 'gemini-3-pro-preview')
- `tone`: Enum ('professional', 'concise', 'detailed')

### IntegrationConfig
- `jira`: Boolean (Connection Status)
- `slack`: Boolean (Connection Status)
- `serviceNow`: Boolean (Connection Status)
- `sap`: Boolean (Connection Status)
