
import { Vendor, MetricType, MetricLog, Invoice, AuditStatus, GovernanceEventType, GovernanceEvent, AgentNotification } from './types';

export const VENDORS: Vendor[] = [
  { 
    id: 'v1', 
    name: 'Nexus Systems Global', 
    msaId: 'MSA-2023-NX01', 
    status: 'Active', 
    color: 'indigo',
    description: 'Premier enterprise development partner specializing in legacy modernization and high-scale Java/Spring architectures. Primary vendor for Core Banking & Payments modules.',
    contactName: 'Sarah Jenkins',
    contactEmail: 's.jenkins@nexus-global.com',
    renewalDate: '2025-12-31'
  },
  { 
    id: 'v2', 
    name: 'Aether Cloud Dynamics', 
    msaId: 'MSA-2022-ACD9', 
    status: 'Active', 
    color: 'teal',
    description: 'Specialized CloudOps and SRE boutique firm. Manages our GCP infrastructure, Kubernetes clusters, and 24/7 security monitoring.',
    contactName: 'David Chen',
    contactEmail: 'd.chen@aethercloud.io',
    renewalDate: '2024-11-15'
  },
  { 
    id: 'v3', 
    name: 'Synthetix AI Labs', 
    msaId: 'MSA-2024-SYN2', 
    status: 'Probation', 
    color: 'orange',
    description: 'Innovation partner for Generative AI and ML initiatives. Currently under probation due to recent model compliance issues.',
    contactName: 'Elena Rostova',
    contactEmail: 'elena@synthetix.ai',
    renewalDate: '2024-06-30'
  },
  { 
    id: 'v4', 
    name: 'Orbit 9 Studios', 
    msaId: 'MSA-2023-ORB5', 
    status: 'Active', 
    color: 'purple',
    description: 'Digital experience agency responsible for Mobile App UI/UX and Frontend design systems. Known for high accessibility standards.',
    contactName: 'Marcus Cole',
    contactEmail: 'm.cole@orbit9.studio',
    renewalDate: '2025-03-01'
  },
  { 
    id: 'v5', 
    name: 'IronClad Security', 
    msaId: 'MSA-2023-ICS8', 
    status: 'Active', 
    color: 'rose',
    description: 'Top-tier cybersecurity firm providing 24/7 SOC monitoring, penetration testing, and ISO 27001 compliance auditing. Critical partner for data privacy.',
    contactName: 'Alex Mercer',
    contactEmail: 'a.mercer@ironclad.sec',
    renewalDate: '2024-10-31'
  },
  { 
    id: 'v6', 
    name: 'FlowState Digital', 
    msaId: 'MSA-2024-FSD1', 
    status: 'Probation', 
    color: 'blue',
    description: 'Marketing technology agency managing our CRM (Salesforce) and marketing automation workflows. Probation due to missed Q4 deliverables.',
    contactName: 'Priya Patel',
    contactEmail: 'p.patel@flowstate.io',
    renewalDate: '2025-01-15'
  }
];

export const RATE_CARDS: Record<string, { roles: { role: string; rate: number }[]; currency: string; effectiveDate: string }> = {
  'v1': { // Nexus
    roles: [
      { role: "Principal Architect", rate: 210 },
      { role: "Senior Java Developer", rate: 165 },
      { role: "Fullstack Engineer", rate: 150 },
      { role: "QA Automation Lead", rate: 135 },
      { role: "Project Manager", rate: 175 },
      { role: "Business Analyst", rate: 140 }
    ],
    currency: "USD",
    effectiveDate: "2023-01-01"
  },
  'v2': { // Aether
    roles: [
      { role: "Cloud Security Architect", rate: 225 },
      { role: "DevOps Engineer", rate: 160 },
      { role: "SRE (Site Reliability)", rate: 180 },
      { role: "Database Administrator", rate: 155 },
      { role: "Network Engineer", rate: 145 }
    ],
    currency: "USD",
    effectiveDate: "2023-06-15"
  },
  'v3': { // Synthetix
    roles: [
      { role: "Lead Data Scientist", rate: 250 },
      { role: "ML Ops Engineer", rate: 195 },
      { role: "Data Engineer", rate: 170 },
      { role: "Python Developer", rate: 145 },
      { role: "AI Ethicist", rate: 200 }
    ],
    currency: "USD",
    effectiveDate: "2024-02-01"
  },
  'v4': { // Orbit 9
    roles: [
      { role: "Creative Director", rate: 200 },
      { role: "Senior UX Researcher", rate: 160 },
      { role: "UI Designer", rate: 130 },
      { role: "Frontend Specialist", rate: 145 },
      { role: "Mobile Developer (iOS)", rate: 155 }
    ],
    currency: "USD",
    effectiveDate: "2023-09-01"
  },
  'v5': { // IronClad
    roles: [
      { role: "Penetration Tester", rate: 240 },
      { role: "SOC Analyst", rate: 160 },
      { role: "Compliance Auditor", rate: 210 },
      { role: "CISO Advisory", rate: 350 }
    ],
    currency: "USD",
    effectiveDate: "2023-11-01"
  },
  'v6': { // FlowState
    roles: [
      { role: "Salesforce Architect", rate: 190 },
      { role: "CRM Developer", rate: 150 },
      { role: "Marketing Ops Specialist", rate: 130 },
      { role: "Data Analyst", rate: 125 }
    ],
    currency: "USD",
    effectiveDate: "2024-01-01"
  }
};

export const METRIC_LOGS: MetricLog[] = [
  // Nexus Systems - Extended History
  { id: 'm1-0', vendorId: 'v1', date: '2023-09-01', type: MetricType.Velocity, value: 40, target: 40 },
  { id: 'm1-1', vendorId: 'v1', date: '2023-10-01', type: MetricType.Velocity, value: 42, target: 40 },
  { id: 'm1-2', vendorId: 'v1', date: '2023-11-01', type: MetricType.Velocity, value: 44, target: 40 },
  { id: 'm1-3', vendorId: 'v1', date: '2023-12-01', type: MetricType.Velocity, value: 41, target: 40 },
  { id: 'm1-4', vendorId: 'v1', date: '2024-01-01', type: MetricType.Velocity, value: 38, target: 40 },
  { id: 'm1-5', vendorId: 'v1', date: '2024-02-01', type: MetricType.Velocity, value: 45, target: 40 },
  { id: 'm1-6', vendorId: 'v1', date: '2024-03-01', type: MetricType.Velocity, value: 46, target: 40 },
  
  // Nexus SLA History
  { id: 'm1-sla-1', vendorId: 'v1', date: '2023-12-01', type: MetricType.SLAAdherence, value: 99.2, target: 99.0 },
  { id: 'm1-sla-2', vendorId: 'v1', date: '2024-01-01', type: MetricType.SLAAdherence, value: 99.4, target: 99.0 },
  { id: 'm1-sla-3', vendorId: 'v1', date: '2024-02-01', type: MetricType.SLAAdherence, value: 98.9, target: 99.0 },
  { id: 'm1-sla-4', vendorId: 'v1', date: '2024-03-01', type: MetricType.SLAAdherence, value: 99.5, target: 99.0 },

  { id: 'm1-8', vendorId: 'v1', date: '2024-03-01', type: MetricType.BugCount, value: 12, target: 15 },
  { id: 'm1-9', vendorId: 'v1', date: '2024-03-01', type: MetricType.ResponseTime, value: 2.5, target: 4.0 },

  // Aether Cloud - Extended History
  { id: 'm2-0', vendorId: 'v2', date: '2023-09-01', type: MetricType.Velocity, value: 25, target: 30 },
  { id: 'm2-1', vendorId: 'v2', date: '2023-10-01', type: MetricType.Velocity, value: 28, target: 30 },
  { id: 'm2-2', vendorId: 'v2', date: '2023-11-01', type: MetricType.Velocity, value: 32, target: 30 },
  { id: 'm2-3', vendorId: 'v2', date: '2023-12-01', type: MetricType.Velocity, value: 35, target: 30 },
  { id: 'm2-4', vendorId: 'v2', date: '2024-01-01', type: MetricType.Velocity, value: 34, target: 30 },
  { id: 'm2-5', vendorId: 'v2', date: '2024-02-01', type: MetricType.Velocity, value: 39, target: 30 },
  { id: 'm2-6', vendorId: 'v2', date: '2024-03-01', type: MetricType.Velocity, value: 41, target: 30 },
  
  { id: 'm2-7', vendorId: 'v2', date: '2024-03-01', type: MetricType.SLAAdherence, value: 99.9, target: 99.5 },
  { id: 'm2-8', vendorId: 'v2', date: '2024-03-01', type: MetricType.BugCount, value: 3, target: 10 },
  { id: 'm2-9', vendorId: 'v2', date: '2024-03-01', type: MetricType.ResponseTime, value: 0.8, target: 2.0 },

  // Synthetix AI - Extended History
  { id: 'm3-0', vendorId: 'v3', date: '2023-09-01', type: MetricType.Velocity, value: 40, target: 45 },
  { id: 'm3-1', vendorId: 'v3', date: '2023-10-01', type: MetricType.Velocity, value: 50, target: 45 },
  { id: 'm3-2', vendorId: 'v3', date: '2023-11-01', type: MetricType.Velocity, value: 65, target: 45 },
  { id: 'm3-3', vendorId: 'v3', date: '2023-12-01', type: MetricType.Velocity, value: 20, target: 45 }, // Crash
  { id: 'm3-4', vendorId: 'v3', date: '2024-01-01', type: MetricType.Velocity, value: 55, target: 45 },
  { id: 'm3-5', vendorId: 'v3', date: '2024-02-01', type: MetricType.Velocity, value: 62, target: 45 },
  { id: 'm3-6', vendorId: 'v3', date: '2024-03-01', type: MetricType.Velocity, value: 68, target: 45 },
  
  { id: 'm3-sla-1', vendorId: 'v3', date: '2024-01-01', type: MetricType.SLAAdherence, value: 98.0, target: 99.0 },
  { id: 'm3-sla-2', vendorId: 'v3', date: '2024-02-01', type: MetricType.SLAAdherence, value: 97.5, target: 99.0 },
  { id: 'm3-7', vendorId: 'v3', date: '2024-03-01', type: MetricType.SLAAdherence, value: 96.5, target: 99.0 }, // Fail
  
  { id: 'm3-8', vendorId: 'v3', date: '2024-03-01', type: MetricType.BugCount, value: 38, target: 15 }, // Fail
  { id: 'm3-9', vendorId: 'v3', date: '2024-03-01', type: MetricType.ResponseTime, value: 5.2, target: 4.0 }, // Fail

  // Orbit 9 - Extended History
  { id: 'm4-0', vendorId: 'v4', date: '2023-12-01', type: MetricType.Velocity, value: 20, target: 25 },
  { id: 'm4-1', vendorId: 'v4', date: '2024-01-01', type: MetricType.Velocity, value: 22, target: 25 },
  { id: 'm4-2', vendorId: 'v4', date: '2024-02-01', type: MetricType.Velocity, value: 24, target: 25 },
  { id: 'm4-3', vendorId: 'v4', date: '2024-03-01', type: MetricType.Velocity, value: 26, target: 25 },
  { id: 'm4-4', vendorId: 'v4', date: '2024-03-01', type: MetricType.SLAAdherence, value: 98.2, target: 99.0 },
  { id: 'm4-5', vendorId: 'v4', date: '2024-03-01', type: MetricType.BugCount, value: 14, target: 15 },
  { id: 'm4-6', vendorId: 'v4', date: '2024-03-01', type: MetricType.ResponseTime, value: 3.1, target: 4.0 },

  // IronClad (Security)
  { id: 'm5-0', vendorId: 'v5', date: '2024-01-01', type: MetricType.Velocity, value: 15, target: 15 },
  { id: 'm5-1', vendorId: 'v5', date: '2024-02-01', type: MetricType.Velocity, value: 18, target: 15 },
  { id: 'm5-2', vendorId: 'v5', date: '2024-03-01', type: MetricType.Velocity, value: 16, target: 15 },
  { id: 'm5-3', vendorId: 'v5', date: '2024-03-01', type: MetricType.SLAAdherence, value: 99.99, target: 99.9 },
  { id: 'm5-4', vendorId: 'v5', date: '2024-03-01', type: MetricType.BugCount, value: 0, target: 0 },
  { id: 'm5-5', vendorId: 'v5', date: '2024-03-01', type: MetricType.ResponseTime, value: 0.5, target: 1.0 },

  // FlowState (Marketing/CRM)
  { id: 'm6-0', vendorId: 'v6', date: '2024-01-01', type: MetricType.Velocity, value: 35, target: 40 },
  { id: 'm6-1', vendorId: 'v6', date: '2024-02-01', type: MetricType.Velocity, value: 32, target: 40 },
  { id: 'm6-2', vendorId: 'v6', date: '2024-03-01', type: MetricType.Velocity, value: 28, target: 40 }, // Trending down
  { id: 'm6-3', vendorId: 'v6', date: '2024-03-01', type: MetricType.SLAAdherence, value: 95.5, target: 98.0 },
  { id: 'm6-4', vendorId: 'v6', date: '2024-03-01', type: MetricType.BugCount, value: 8, target: 5 },
  { id: 'm6-5', vendorId: 'v6', date: '2024-03-01', type: MetricType.ResponseTime, value: 12.0, target: 8.0 },
];

export const INVOICES: Invoice[] = [
  // Nexus Invoices
  {
    id: 'inv-nx-101',
    vendorId: 'v1',
    invoiceNumber: 'INV-NX-24-001',
    date: '2024-02-15',
    amount: 145000,
    status: AuditStatus.Flagged,
    agentNotes: 'Principal Architect billed 55 hours in Week 2 (MSA Cap: 45h). Detected duplicate line item for "Cloud Migration Tooling".',
    lineItems: [
      { role: 'Principal Architect', hours: 55, rate: 210, total: 11550, discrepancy: true },
      { role: 'Senior Java Developer', hours: 160, rate: 165, total: 26400 },
      { role: 'Fullstack Engineer', hours: 320, rate: 150, total: 48000 },
      { role: 'QA Automation Lead', hours: 160, rate: 135, total: 21600 },
    ]
  },
  {
    id: 'inv-nx-102',
    vendorId: 'v1',
    invoiceNumber: 'INV-NX-24-002',
    date: '2024-01-15',
    amount: 142000,
    status: AuditStatus.Passed,
    agentNotes: 'Audit complete. All roles match MSA-2023-NX01. Overtime hours pre-approved via email match attached receipt.',
    lineItems: [
      { role: 'Principal Architect', hours: 40, rate: 210, total: 8400 },
      { role: 'Senior Java Developer', hours: 160, rate: 165, total: 26400 },
      { role: 'Fullstack Engineer', hours: 320, rate: 150, total: 48000 },
    ]
  },
  {
    id: 'inv-nx-103',
    vendorId: 'v1',
    invoiceNumber: 'INV-NX-23-012',
    date: '2023-12-15',
    amount: 138000,
    status: AuditStatus.Passed,
    agentNotes: 'Standard monthly billing. No anomalies detected.',
    lineItems: [
      { role: 'Principal Architect', hours: 40, rate: 210, total: 8400 },
      { role: 'Senior Java Developer', hours: 160, rate: 165, total: 26400 },
      { role: 'Fullstack Engineer', hours: 300, rate: 150, total: 45000 },
    ]
  },

  // Aether Invoices
  {
    id: 'inv-ac-201',
    vendorId: 'v2',
    invoiceNumber: 'AC-INV-9921',
    date: '2024-02-28',
    amount: 88500,
    status: AuditStatus.Passed,
    agentNotes: 'Clean audit. SRE hours correlate with the major incident response on Feb 12th.',
    lineItems: [
      { role: 'Cloud Security Architect', hours: 40, rate: 225, total: 9000 },
      { role: 'SRE (Site Reliability)', hours: 120, rate: 180, total: 21600 },
      { role: 'DevOps Engineer', hours: 160, rate: 160, total: 25600 },
    ]
  },
  {
    id: 'inv-ac-202',
    vendorId: 'v2',
    invoiceNumber: 'AC-INV-9855',
    date: '2024-01-30',
    amount: 85000,
    status: AuditStatus.Passed,
    agentNotes: 'Verified against PO#9932.',
    lineItems: [
      { role: 'Cloud Security Architect', hours: 40, rate: 225, total: 9000 },
      { role: 'DevOps Engineer', hours: 300, rate: 160, total: 48000 },
    ]
  },

  // Synthetix Invoices
  {
    id: 'inv-syn-301',
    vendorId: 'v3',
    invoiceNumber: 'SYN-AI-0043',
    date: '2024-03-01',
    amount: 62000,
    status: AuditStatus.Rejected,
    agentNotes: 'CRITICAL: "AI Ethicist" rate of $350/hr does not match MSA rate of $200/hr. Unidentified "Consultant" role billed for $12,000.',
    lineItems: [
      { role: 'AI Ethicist', hours: 40, rate: 350, total: 14000, discrepancy: true },
      { role: 'Lead Data Scientist', hours: 80, rate: 250, total: 20000 },
      { role: 'Consultant', hours: 40, rate: 300, total: 12000, discrepancy: true },
    ]
  },
  {
    id: 'inv-syn-302',
    vendorId: 'v3',
    invoiceNumber: 'SYN-AI-0038',
    date: '2024-02-01',
    amount: 45000,
    status: AuditStatus.Pending,
    agentNotes: 'Processing... Analyzing timesheet attachments against Jira logs.',
    lineItems: [
      { role: 'ML Ops Engineer', hours: 160, rate: 195, total: 31200 },
      { role: 'Python Developer', hours: 80, rate: 145, total: 11600 },
    ]
  },
  {
    id: 'inv-syn-303',
    vendorId: 'v3',
    invoiceNumber: 'SYN-AI-0029',
    date: '2024-01-01',
    amount: 42000,
    status: AuditStatus.Passed,
    agentNotes: 'Pilot Phase 1 completed successfully.',
    lineItems: [
      { role: 'ML Ops Engineer', hours: 140, rate: 195, total: 27300 },
    ]
  },

  // Orbit 9 Invoices
  {
    id: 'inv-orb-401',
    vendorId: 'v4',
    invoiceNumber: 'ORB-DES-112',
    date: '2024-02-20',
    amount: 32000,
    status: AuditStatus.Passed,
    agentNotes: 'Approved. UX Research phase concluded.',
    lineItems: [
      { role: 'Senior UX Researcher', hours: 120, rate: 160, total: 19200 },
      { role: 'Creative Director', hours: 20, rate: 200, total: 4000 },
    ]
  },
  {
    id: 'inv-orb-402',
    vendorId: 'v4',
    invoiceNumber: 'ORB-DES-115',
    date: '2024-03-05',
    amount: 28500,
    status: AuditStatus.Flagged,
    agentNotes: 'Flagged: Mobile Developer billed rate $185 exceeds MSA rate $155.',
    lineItems: [
      { role: 'Mobile Developer (iOS)', hours: 80, rate: 185, total: 14800, discrepancy: true },
      { role: 'UI Designer', hours: 80, rate: 130, total: 10400 },
    ]
  },
  {
    id: 'inv-orb-403',
    vendorId: 'v4',
    invoiceNumber: 'ORB-DES-108',
    date: '2024-01-15',
    amount: 25000,
    status: AuditStatus.Passed,
    agentNotes: 'Initial retainer payment.',
    lineItems: [
      { role: 'Creative Director', hours: 40, rate: 200, total: 8000 },
      { role: 'UI Designer', hours: 100, rate: 130, total: 13000 },
    ]
  },
  
  // IronClad Invoices
  {
    id: 'inv-ics-501',
    vendorId: 'v5',
    invoiceNumber: 'ICS-SEC-882',
    date: '2024-03-01',
    amount: 52000,
    status: AuditStatus.Passed,
    agentNotes: 'Approved. SOC2 Audit readiness preparation completed ahead of schedule.',
    lineItems: [
      { role: 'Compliance Auditor', hours: 120, rate: 210, total: 25200 },
      { role: 'CISO Advisory', hours: 20, rate: 350, total: 7000 },
      { role: 'Penetration Tester', hours: 80, rate: 240, total: 19200 },
    ]
  },

  // FlowState Invoices
  {
    id: 'inv-fsd-601',
    vendorId: 'v6',
    invoiceNumber: 'FSD-CRM-104',
    date: '2024-02-28',
    amount: 38000,
    status: AuditStatus.Flagged,
    agentNotes: 'Flagged: Billed 60 hours for "CRM Developer" but git commit logs show low activity. Requesting timesheet verification.',
    lineItems: [
      { role: 'Salesforce Architect', hours: 40, rate: 190, total: 7600 },
      { role: 'CRM Developer', hours: 160, rate: 150, total: 24000, discrepancy: true },
      { role: 'Data Analyst', hours: 50, rate: 125, total: 6250 },
    ]
  }
];

export const EVENTS: GovernanceEvent[] = [
  {
    id: 'e1',
    type: GovernanceEventType.QBR,
    date: '2024-01-15',
    summary: 'Q1 Strategic Review with Nexus Systems. Strong stability in core legacy systems. Agreed to initiate "Project Horizon" migration in Q2. Velocity is consistent but innovation score is low.',
    vendorId: 'v1',
    actionItems: ['Submit architectural blueprint for Horizon', 'Audit legacy Java codebase', 'Review P1 incident from Dec 24th']
  },
  {
    id: 'e2',
    type: GovernanceEventType.MonthlySync,
    date: '2024-02-10',
    summary: 'Feb Sync with Aether Cloud. Security posture has improved significantly. Cloud cost optimization (FinOps) saved 12% this month.',
    vendorId: 'v2',
    actionItems: ['Implement auto-scaling policies for non-prod', 'Renew SSL certs for gateway']
  },
  {
    id: 'e3',
    type: GovernanceEventType.WeeklyStandup,
    date: '2024-03-01',
    summary: 'Emergency sync with Synthetix AI regarding model hallucinations. Deployment rolled back. Vendor promises RCA within 24 hours.',
    vendorId: 'v3',
    actionItems: ['Provide RCA for model failure', 'Implement guardrails API', 'Credit invoice for downtime']
  },
  {
    id: 'e4',
    type: GovernanceEventType.QBR,
    date: '2024-03-12',
    summary: 'Design Review with Orbit 9. New mobile app mocks approved. Accessibility audit score improved to 95/100.',
    vendorId: 'v4',
    actionItems: ['Finalize Figma assets', 'Handover specs to Nexus dev team']
  },
  {
    id: 'e5',
    type: GovernanceEventType.MonthlySync,
    date: '2024-03-15',
    summary: 'Monthly governance with Nexus. Discussed ramping up 2 new scrum teams for the Payments module.',
    vendorId: 'v1',
    actionItems: ['Approve SOW for Payments Team', 'Onboard 4 Senior Devs']
  },
  {
    id: 'e6',
    type: GovernanceEventType.MonthlySync,
    date: '2024-02-20',
    summary: 'Security Policy Review with IronClad. Identified 3 high-risk gaps in the new payment gateway integration. Pen test scheduled for next week.',
    vendorId: 'v5',
    actionItems: ['Schedule Pen Test', 'Patch CVE-2024-0012', 'Update Firewall rules']
  },
  {
    id: 'e7',
    type: GovernanceEventType.WeeklyStandup,
    date: '2024-03-05',
    summary: 'Deliverable check-in with FlowState. Salesforce migration is behind schedule by 2 weeks. Data mapping issues cited as blocker.',
    vendorId: 'v6',
    actionItems: ['Provide clean data dump', 'Accelerate mapping phase', 'Daily standups initiated']
  }
];

export const NOTIFICATIONS: AgentNotification[] = [
  { id: 'n1', type: 'alert', message: 'Agent detected a $14k discrepancy in Synthetix AI Invoice. Rate card violation for "AI Ethicist".', timestamp: '2h ago' },
  { id: 'n2', type: 'check', message: 'Nexus Systems Q1 Audit complete. 98% compliance score achieved.', timestamp: '5h ago' },
  { id: 'n3', type: 'calendar', message: 'Orbit 9 Design Review scheduled for tomorrow at 2:00 PM.', timestamp: '1d ago' },
  { id: 'n4', type: 'alert', message: 'SLA Warning: Synthetix API response time degraded to 5.2s (Target: 4.0s).', timestamp: '3h ago' },
  { id: 'n5', type: 'check', message: 'Aether Cloud successfully completed SOC2 Type II recertification.', timestamp: '2d ago' },
  { id: 'n6', type: 'alert', message: 'Orbit 9 Mobile Developer rate mismatch detected in Invoice #115.', timestamp: '1d ago' },
  { id: 'n7', type: 'alert', message: 'FlowState Digital missed Q1 milestone. Probation review triggered.', timestamp: '1h ago' },
];
