export interface ScheduleTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'In Progress' | 'Delayed' | 'Not Started';
  progress: number;
  criticalPath: boolean;
  assignedTo: string;
}

export interface RFI {
  id: string;
  subject: string;
  dateCreated: string;
  status: 'Open' | 'Closed' | 'Draft';
  priority: 'High' | 'Medium' | 'Low';
  discipline: 'Structural' | 'Mechanical' | 'Electrical' | 'Architectural' | 'Civil';
  impact: string; // e.g., "Schedule delay imminent"
  assignedTo: string;
}

export interface FinancialMetric {
  category: string;
  budget: number;
  actual: number;
  forecast: number;
  variance: number;
}

export interface Inspection {
  id: string;
  date: string;
  location: string;
  result: 'Pass' | 'Fail' | 'Pass with Conditions';
  notes: string;
}

export interface Trend {
  value: number; // e.g., 5, -2
  direction: 'up' | 'down' | 'neutral';
  label: string; // e.g., "vs last week"
}

export interface PredictiveInsight {
  riskLevel: 'High' | 'Medium' | 'Low';
  summary: string;
  probability: number; // 0-100
  affectedTaskIds: string[];
}

export type AgentType = 'Schedule Guardian' | 'Budget Watchdog' | 'Safety Sentinel' | 'Supply Chain Scout' | 'Productivity Benchmarker' | 'RFI Bottleneck Detector' | 'Quality Control';

export interface AgentAlert {
  id: string;
  agentType: AgentType;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  confidenceScore: number; // 0-100
  status: 'New' | 'Verified' | 'Dismissed';
  dateDetected: string;
  source: string; // e.g., "Daily Field Report #402" or "ERP Invoice #992"
}

export interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'DWG' | 'XLSX';
  category: 'Contracts' | 'Drawings' | 'Reports' | 'Invoices';
  date: string;
  size: string;
  summary?: string; // AI generated summary
}

export interface ProjectData {
  id: string;
  projectId: string; // Display ID like DC-ASH-001
  projectName: string;
  location: string;
  totalCompletion: number;
  weeklyProgressTrend: Trend;
  schedule: ScheduleTask[];
  rfis: RFI[];
  financials: FinancialMetric[];
  inspections: Inspection[];
  lastUpdated: string;
  workforce: {
    activeWorkers: number;
    trend: Trend;
  };
  safety: {
    incidents: number;
    daysWithoutIncident: number;
  };
  // Pre-calculated predictive insights for demo purposes (can be augmented by live AI)
  aiForecast?: PredictiveInsight; 
  agentAlerts: AgentAlert[];
  documents: Document[];
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isActionable?: boolean; // If the AI suggests an action
  actions?: string[]; // List of suggested actions
}