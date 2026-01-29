
export enum AuditStatus {
  Passed = 'Passed',
  Flagged = 'Flagged',
  Rejected = 'Rejected',
  Pending = 'Pending'
}

export enum MetricType {
  Velocity = 'Velocity',
  BugCount = 'Bug Count',
  SLAAdherence = 'SLA Adherence',
  Uptime = 'Uptime',
  ResponseTime = 'Response Time'
}

export enum GovernanceEventType {
  QBR = 'QBR',
  MonthlySync = 'Monthly Sync',
  WeeklyStandup = 'Weekly Standup'
}

export interface Vendor {
  id: string;
  name: string;
  msaId: string;
  status: 'Active' | 'Probation';
  color: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  renewalDate?: string;
}

export interface MetricLog {
  id: string;
  vendorId: string;
  date: string;
  type: MetricType;
  value: number;
  target: number;
}

export interface Invoice {
  id: string;
  vendorId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: AuditStatus;
  agentNotes?: string;
  lineItems: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  role: string;
  hours: number;
  rate: number;
  total: number;
  discrepancy?: boolean;
}

export interface GovernanceEvent {
  id: string;
  type: GovernanceEventType;
  date: string;
  summary: string;
  vendorId?: string;
  actionItems: string[];
}

export interface AgentNotification {
  id: string;
  type: 'alert' | 'check' | 'calendar';
  message: string;
  timestamp: string;
}
