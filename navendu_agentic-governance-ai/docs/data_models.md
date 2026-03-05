
# Data Models

The platform uses TypeScript-defined data structures in [`types.ts`](file:///Users/ngarg/workspace/agentic-governance-ai/types.ts). All data is currently client-side mock data defined in [`constants.ts`](file:///Users/ngarg/workspace/agentic-governance-ai/constants.ts).

## 1. Enums

### AuditStatus
```typescript
enum AuditStatus {
  Passed = 'Passed',
  Flagged = 'Flagged',
  Rejected = 'Rejected',
  Pending = 'Pending'
}
```

### MetricType
```typescript
enum MetricType {
  Velocity = 'Velocity',
  BugCount = 'Bug Count',
  SLAAdherence = 'SLA Adherence',
  Uptime = 'Uptime',
  ResponseTime = 'Response Time'
}
```

### GovernanceEventType
```typescript
enum GovernanceEventType {
  QBR = 'QBR',
  MonthlySync = 'Monthly Sync',
  WeeklyStandup = 'Weekly Standup'
}
```

## 2. Core Entities

### Vendor
| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | `string` | ✅ | Unique identifier (e.g., `'v1'`) |
| `name` | `string` | ✅ | Display name |
| `msaId` | `string` | ✅ | Master Services Agreement ID |
| `status` | `'Active' \| 'Probation'` | ✅ | Current vendor standing |
| `color` | `string` | ✅ | UI theme color key (e.g., `'indigo'`, `'teal'`) |
| `description` | `string` | ❌ | Brief description of vendor specialty |
| `contactName` | `string` | ❌ | Primary contact name |
| `contactEmail` | `string` | ❌ | Primary contact email |
| `renewalDate` | `string` | ❌ | MSA renewal date (ISO format) |

**Mock data:** 6 vendors — Nexus Systems Global, Aether Cloud Dynamics, Synthetix AI Labs, Orbit 9 Studios, IronClad Security, FlowState Digital.

### MetricLog
| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | `string` | ✅ | Unique identifier |
| `vendorId` | `string` | ✅ | Foreign key to Vendor |
| `date` | `string` | ✅ | ISO date |
| `type` | `MetricType` | ✅ | Metric category |
| `value` | `number` | ✅ | Actual metric value |
| `target` | `number` | ✅ | Target/threshold value |

**Mock data:** 45+ records spanning Sep 2023–Mar 2024 across all vendors and metric types.

### Invoice
| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | `string` | ✅ | Unique identifier |
| `vendorId` | `string` | ✅ | Foreign key to Vendor |
| `invoiceNumber` | `string` | ✅ | Vendor's invoice reference |
| `date` | `string` | ✅ | Invoice date |
| `amount` | `number` | ✅ | Total invoice amount (USD) |
| `status` | `AuditStatus` | ✅ | AI audit result |
| `agentNotes` | `string` | ❌ | AI-generated audit observations |
| `lineItems` | `InvoiceLineItem[]` | ✅ | Itemized billing breakdown |

**Mock data:** 11 invoices across 6 vendors with various audit statuses.

### InvoiceLineItem
| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `role` | `string` | ✅ | Billed role title |
| `hours` | `number` | ✅ | Hours billed |
| `rate` | `number` | ✅ | Hourly rate (USD) |
| `total` | `number` | ✅ | Line item total |
| `discrepancy` | `boolean` | ❌ | Flagged by Auditor Agent |

### GovernanceEvent
| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | `string` | ✅ | Unique identifier |
| `type` | `GovernanceEventType` | ✅ | Event category |
| `date` | `string` | ✅ | Event date |
| `summary` | `string` | ✅ | Meeting summary text |
| `vendorId` | `string` | ❌ | Associated vendor |
| `actionItems` | `string[]` | ✅ | List of action items |

**Mock data:** 7 events spanning Jan–Mar 2024 across QBRs, Monthly Syncs, and Weekly Standups.

### AgentNotification
| Field | Type | Required | Description |
|:---|:---|:---|:---|
| `id` | `string` | ✅ | Unique identifier |
| `type` | `'alert' \| 'check' \| 'calendar'` | ✅ | Notification category |
| `message` | `string` | ✅ | Notification text |
| `timestamp` | `string` | ✅ | Relative time (e.g., `'2h ago'`) |

**Mock data:** 7 notifications covering invoice discrepancies, audit completions, and schedule reminders.

## 3. Supporting Data Structures

### Rate Card (in `constants.ts`, not in `types.ts`)
```typescript
Record<string, {
  roles: { role: string; rate: number }[];
  currency: string;
  effectiveDate: string;
}>
```
Per-vendor rate card with contracted roles, hourly rates (USD), and MSA effective dates. Used by the Auditor Agent for cross-referencing invoice line items.

### Slide (AI-generated, not persisted)
Returned by `generateSlidesJSON` — used in QBR slide preview modal.
```typescript
{
  title: string;
  content: string[];  // Bullet points
  visualType: 'CHART_SPEND' | 'CHART_VELOCITY' | 'CHART_SLA' | 'SCORECARD' | 'NONE';
}
```

## 4. Configuration Entities (Settings UI — Local State Only)

These are managed as local React state in `Settings.tsx` and are **not persisted** across sessions.

### Agent Settings
- `auditTolerance`: Number — threshold for financial flag severity
- `autoApprove`: Boolean — auto-approve clean invoices
- `scribeModel`: String — AI model for meeting transcription
- `tone`: `'professional' | 'concise' | 'detailed'` — report tone

### Integration Toggles
- `jira`: Boolean — Jira connection status (UI-only)
- `slack`: Boolean — Slack connection status (UI-only)
- `serviceNow`: Boolean — ServiceNow connection status (UI-only)
- `sap`: Boolean — SAP Ariba connection status (UI-only)

### Notification Preferences
Array of toggleable notification types: SLA Breaches, Invoice Flags, Vendor Status Changes, Weekly Digest, QBR Reminders, Budget Alerts.
