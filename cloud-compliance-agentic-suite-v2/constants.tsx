
import { AgentRole, ComplianceFinding, AuditLogEntry, AgentLogEntry } from './types';

export const REGULATORY_SCOPE = [
  { category: 'Banking', codes: ['OCC', 'FDIC', 'Reg E', 'Reg Z', 'Reg D', 'TILA', 'RESPA', 'FCRA'] },
  { category: 'Securities', codes: ['FINRA', 'SEC Trade Surveillance', 'Market Conduct'] },
  { category: 'Privacy', codes: ['GLBA', 'CCPA/CPRA', 'State-Level Privacy'] }
];

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  primaryAgent: AgentRole;
  collaborators?: AgentRole[];
  technicalDetails: string[];
  actionLabel: string;
  outputSummary: string;
}

export const FINRA_3110_WORKFLOW: WorkflowStep[] = [
  {
    id: 1,
    title: "Initialization & Delegation",
    description: "Agent 4 receives the strategic mandate and decomposes it into executable sub-tasks.",
    primaryAgent: AgentRole.SUPERVISOR,
    collaborators: [AgentRole.DOCUMENTATION],
    technicalDetails: [
      "Objective: Test FINRA 3110 compliance for Q4 2024",
      "Task: Delegate documentation request to Agent 1",
      "Priority: High",
      "SLA: 120ms for orchestration"
    ],
    actionLabel: "Initialize Delegation",
    outputSummary: "Sub-tasks created: [DOC_RETRIEVAL_TRADE_BLOTTER], [SIGN_OFF_VERIFICATION]"
  },
  {
    id: 2,
    title: "Automated Evidence Gathering",
    description: "Agent 1 utilizes native MCP (Model Context Protocol) tools to interface with compliance platforms.",
    primaryAgent: AgentRole.DOCUMENTATION,
    technicalDetails: [
      "Tool: MCP Axos-Connector v2.1",
      "Action: Extracting daily trade blotters",
      "Action: Validating supervisor sign-off records",
      "Log: Generating Immutable Audit Log in Cloud Logging"
    ],
    actionLabel: "Execute MCP Extraction",
    outputSummary: "Artifacts staged: 1,240 trade records, 25 supervisor sign-offs classified by Control ID."
  },
  {
    id: 3,
    title: "Local Reasoning & Effectiveness",
    description: "Agent 2 performs deep analysis on the extracted datasets within protected engine memory.",
    primaryAgent: AgentRole.TOE,
    technicalDetails: [
      "Method: Intelligent Sampling (n=5000)",
      "Logic: 'Rubber-Stamping' Detection (Delta between market close & sign-off)",
      "Threshold: 90-day window comparison",
      "Metric: Confidence Score Calculation"
    ],
    actionLabel: "Run Intelligent Sampling",
    outputSummary: "Efficiency Check: 12 anomalies detected where sign-off occurred < 60s post-market-close."
  },
  {
    id: 4,
    title: "Design Validation & Gap Analysis",
    description: "Agent 3 reviews findings against the Written Supervisory Procedures (WSP) for design flaws.",
    primaryAgent: AgentRole.TOD,
    technicalDetails: [
      "Source: Firm WSP Section 3.2 (Supervisory Review)",
      "Comparison: Control frequency vs Trade volume",
      "Flag: Supervisor-to-rep ratio outside of norms",
      "Finding: Design gap in high-volume day-trading desks"
    ],
    actionLabel: "Validate Policy Design",
    outputSummary: "Gap Analysis: Current daily review frequency inadequate for 400% volume spike on Oct 14."
  },
  {
    id: 5,
    title: "Supervisory Review & Reporting",
    description: "Agent 4 synthesizes all agent outputs into an examination-ready report and updates enterprise systems.",
    primaryAgent: AgentRole.SUPERVISOR,
    technicalDetails: [
      "Action: Secondary Reasoning Path triggered for low-confidence flags",
      "Action: API Handshake with RSA Archer",
      "Action: Exam-Ready PDF Generation",
      "Notification: Escalated to Compliance Committee"
    ],
    actionLabel: "Finalize & Report",
    outputSummary: "Status: RSA Archer updated. Exam-ready report generated. Workflow Complete."
  }
];

export interface AgentDirective {
  mission: string;
  responsibilities: string[];
  constraints: string[];
  sop: string;
}

export const AGENT_DIRECTIVES: Record<AgentRole, AgentDirective> = {
  [AgentRole.DOCUMENTATION]: {
    mission: "To ensure absolute data integrity and provenance for all compliance artifacts entering the system.",
    responsibilities: [
      "Perform high-fidelity OCR on all ingested PDF/Image artifacts.",
      "Validate document hashes against the immutable blockchain ledger.",
      "Categorize evidence based on OCC and FDIC filing requirements.",
      "Flag low-confidence data for human-in-the-loop (HITL) review."
    ],
    constraints: [
      "Never modify source metadata.",
      "Strict 256-bit encryption for all data at rest.",
      "Prohibited from interpreting policy; limited to validation."
    ],
    sop: "INGEST -> SCAN -> VALIDATE_HASH -> MAP_TO_FRAMEWORK -> STAGE_FOR_TOE"
  },
  [AgentRole.TOE]: {
    mission: "To verify that established controls are functioning as intended through rigorous statistical sampling.",
    responsibilities: [
      "Execute automated sampling (n=5000) on transaction datasets.",
      "Detect anomalies in ACH, Wire, and Trade execution patterns.",
      "Cross-check evidence from Agent 1 against operational records.",
      "Calculate Control Failure rates per regulatory period."
    ],
    constraints: [
      "Must use non-biased random sampling methodology.",
      "Cannot flag a 'Success' without 3 distinct evidence points.",
      "Limit compute usage to 20% of total system overhead unless authorized."
    ],
    sop: "PULL_SAMPLE -> ANALYZE_PATTERNS -> IDENTIFY_EXCEPTIONS -> SCORE_EFFECTIVENESS"
  },
  [AgentRole.TOD]: {
    mission: "To identify structural gaps in compliance policy design before they lead to operational failures.",
    responsibilities: [
      "Compare internal policies against the latest FINRA and SEC amendments.",
      "Perform semantic gap analysis on new regulatory text.",
      "Map internal controls to the COSO 2013 Framework.",
      "Recommend remediation paths for identified design flaws."
    ],
    constraints: [
      "Interpret regulations conservatively (Default to Highest Restriction).",
      "Do not suggest policies that conflict with existing AML/KYC protocols.",
      "Reference specific legal code in every finding."
    ],
    sop: "PARSE_REGULATION -> MAP_INTERNAL_CONTROL -> SemAn_GAP_CHECK -> GENERATE_REMEDIATION"
  },
  [AgentRole.SUPERVISOR]: {
    mission: "The ultimate orchestrator and arbiter of the multi-agent system, ensuring fidelity and handling escalations.",
    responsibilities: [
      "Monitor latency and performance scores across the agent pool.",
      "Resolve conflicting conclusions between Agent 2 (TOE) and Agent 3 (TOD).",
      "Draft the final executive summary for human senior auditors.",
      "Manage API quotas and system heartbeats."
    ],
    constraints: [
      "Final Arbiter status (Human Override always takes precedence).",
      "Must log every inter-agent communication for the audit trail.",
      "Prioritize High/Critical severity findings for immediate notification."
    ],
    sop: "MONITOR_AGENTS -> SYNTHESIZE_FINDINGS -> ARBITRATE_CONFLICTS -> ESCALATE_CRITICALS"
  }
};

export const MOCK_AGENT_LOGS: Record<AgentRole, AgentLogEntry[]> = {
  [AgentRole.DOCUMENTATION]: [
    { id: 'DOC-1', timestamp: '2024-05-21 10:00:01', level: 'info', message: 'Scanning ERM Storage Bucket: "compliance-artifacts-v4"' },
    { id: 'DOC-2', timestamp: '2024-05-21 10:00:05', level: 'success', message: 'OCR Engine initialized. Processing 12 trade confirmation PDFs.' },
    { id: 'DOC-3', timestamp: '2024-05-21 10:01:12', level: 'info', message: 'Cross-referencing artifact hashes with blockchain ledger.' },
    { id: 'DOC-4', timestamp: '2024-05-21 10:02:45', level: 'warning', message: 'Low confidence score (72%) on handwritten signature in Document #882.' },
    { id: 'DOC-5', timestamp: '2024-05-21 10:05:00', level: 'success', message: 'Retrieval batch complete. 54 records validated and staged for Agent 2.' }
  ],
  [AgentRole.TOE]: [
    { id: 'TOE-1', timestamp: '2024-05-21 10:10:00', level: 'info', message: 'Pulling transaction sample for Reg E effectiveness testing.' },
    { id: 'TOE-2', timestamp: '2024-05-21 10:12:30', level: 'info', message: 'Applying "Threshold Pattern Logic" to ACH return code dataset.' },
    { id: 'TOE-3', timestamp: '2024-05-21 10:14:00', level: 'error', message: 'Control Failure Detected: Found 3 ACH returns without 60-day notification logging.' },
    { id: 'TOE-4', timestamp: '2024-05-21 10:15:00', level: 'success', message: 'Statistical sampling (n=5000) finished. Overall pass rate: 94.2%.' },
    { id: 'TOE-5', timestamp: '2024-05-21 10:20:00', level: 'info', message: 'Forwarding anomalies to Supervisory Agent for manual review queue.' }
  ],
  [AgentRole.TOD]: [
    { id: 'TOD-1', timestamp: '2024-05-21 11:00:00', level: 'info', message: 'Comparing "Internal Transfer Policy v2" against FDIC Part 330.' },
    { id: 'TOD-2', timestamp: '2024-05-21 11:05:00', level: 'warning', message: 'Potential Design Gap: Missing secondary authorization requirement for transfers > $100k.' },
    { id: 'TOD-3', timestamp: '2024-05-21 11:10:00', level: 'info', message: 'Ingesting latest FINRA Rule 3110 amendments for gap analysis.' },
    { id: 'TOD-4', timestamp: '2024-05-21 11:15:00', level: 'success', message: 'COSO 2013 Framework mapping complete. Efficiency score: 88%.' }
  ],
  [AgentRole.SUPERVISOR]: [
    { id: 'SUP-1', timestamp: '2024-05-21 09:00:00', level: 'success', message: 'System healthy. All 3 sub-agents reporting heartbeats.' },
    { id: 'SUP-2', timestamp: '2024-05-21 10:16:00', level: 'warning', message: 'High-severity finding escalated from Agent 2. Notifying Compliance Lead.' },
    { id: 'SUP-3', timestamp: '2024-05-21 12:00:00', level: 'info', message: 'Daily audit trail snapshot encrypted and pushed to archive storage.' },
    { id: 'SUP-4', timestamp: '2024-05-21 12:05:00', level: 'info', message: 'Performance optimization: Re-allocating compute from DocBot to EffBot for peak load.' }
  ]
};

export const MOCK_FINDINGS: ComplianceFinding[] = [
  {
    id: 'F-001',
    type: 'Control Failure',
    framework: 'Reg E (Electronic Fund Transfers)',
    severity: 'High',
    description: 'Unauthorized ACH transfers detected without 60-day notification logging.',
    remediation: 'Implement automated notification trigger on return code R10.',
    timestamp: '2024-05-20T10:30:00Z'
  },
  {
    id: 'F-002',
    type: 'Design Gap',
    framework: 'COSO 2013',
    severity: 'Medium',
    description: 'Control environment lacks periodic independent review of user access levels.',
    remediation: 'Establish quarterly SOC-1 review cadence.',
    timestamp: '2024-05-19T14:45:00Z'
  },
  {
    id: 'F-003',
    type: 'Anomaly',
    framework: 'FINRA Rule 3110',
    severity: 'Critical',
    description: 'Large volume trade execution patterns detected outside of standard business hours.',
    remediation: 'Flag for immediate supervisory manual review.',
    timestamp: '2024-05-21T02:15:00Z'
  }
];

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  { id: 'AL-1', timestamp: '2024-05-21 09:00', actor: AgentRole.SUPERVISOR, action: 'System Initialization', details: 'All agent nodes reporting 99.9% uptime.' },
  { id: 'AL-2', timestamp: '2024-05-21 09:05', actor: AgentRole.DOCUMENTATION, action: 'ERM Sync', details: 'Pulled 154 new flat files from ERM staging area.' },
  { id: 'AL-3', timestamp: '2024-05-21 10:15', actor: AgentRole.TOE, action: 'Sampling Run', details: 'Executed testing scripts on 5,000 transactions. Identified 12 potential anomalies.' },
  { id: 'AL-4', timestamp: '2024-05-21 11:20', actor: AgentRole.TOD, action: 'Gap Analysis', details: 'Regulatory cross-check against FDIC Guidelines completed.' }
];