
export enum AgentRole {
  DOCUMENTATION = 'Documentation Retrieval',
  TOE = 'Test of Effectiveness',
  TOD = 'Test of Design',
  SUPERVISOR = 'Supervisory/Admin'
}

export interface AgentStatus {
  id: string;
  role: AgentRole;
  status: 'idle' | 'processing' | 'success' | 'warning' | 'error';
  lastAction: string;
  performanceScore: number;
}

export interface AgentLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  metadata?: string;
}

export interface ComplianceFinding {
  id: string;
  type: 'Anomaly' | 'Design Gap' | 'Control Failure';
  framework: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  remediation?: string;
  timestamp: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent?: AgentRole;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: AgentRole;
  details: string;
}
