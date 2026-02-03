import { RiskSeverity, CapabilityDefinition, CIAMApplication } from './types';
import { Shield, FileSearch, Zap, Lock, Search, Cloud, FileText, Database, UserCheck, Server, Code, GitBranch } from 'lucide-react';

// Colores alineados a la identidad Endava
export const SEVERITY_COLORS = {
  [RiskSeverity.LOW]: 'bg-brand-charcoal text-brand-gray border-brand-gray/30',
  [RiskSeverity.MEDIUM]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  [RiskSeverity.HIGH]: 'bg-[#FF5540]/10 text-[#FF5540] border-[#FF5540]/30', // Naranja Endava
  [RiskSeverity.CRITICAL]: 'bg-red-600/10 text-red-500 border-red-500/30',
};

export const INITIAL_CAPABILITIES: CapabilityDefinition[] = [
  { id: 'GENERIC_AUDIT', name: 'General Auditor', description: 'Standard control verification logic.', iconName: 'Shield' },
  { id: 'IAM_ASSURANCE', name: 'IAM Specialist', description: 'Analyzes identity graphs and SoD.', iconName: 'Lock' },
  { id: 'EVIDENCE_COLLECTION', name: 'Evidence Collector', description: 'Automates log retrieval and hashing.', iconName: 'FileSearch' },
  { id: 'ANOMALY_DETECTION', name: 'Anomaly Detector', description: 'Statistical analysis for fraud detection.', iconName: 'Zap' },
  { id: 'CIAM_ATTESTATION', name: 'CIAM Scout', description: 'Source code analysis for auth flows.', iconName: 'Code' }
];

export const INITIAL_AGENT_CATALOG = [
  {
    id: 'CIAM_ATTESTATION',
    name: 'CIAM Compliance Scout',
    description: 'Autonomous agent using RAG to reverse-engineer source code.',
    icon: Code,
    color: 'text-brand-primary', // Usando el naranja
    bg: 'bg-brand-primary/10',
    border: 'border-brand-primary/20',
    model: 'Gemini 1.5 Pro',
    capabilities: ['Source Code RAG', 'MCP Integration'],
    requiredIntegrations: ['github', 'sonarqube'],
    useCases: ['Detect Toxic Combinations', 'Validate Step-Up Auth'],
    config: { temperature: 0.1, maxTokens: 8192, systemInstruction: "Focus on auth paths." }
  },
  {
    id: 'IAM_ASSURANCE',
    name: 'Access Control Effectiveness',
    description: 'Analyzes complex Identity Graphs for IGA and SoD conflicts.',
    icon: Shield,
    color: 'text-white',
    bg: 'bg-white/5',
    border: 'border-white/10',
    model: 'Gemini 1.5 Pro',
    capabilities: ['Graph Analysis', 'SoD Detection'],
    requiredIntegrations: ['okta', 'workday'],
    useCases: ['Detect SOD conflicts', 'Identify orphaned accounts'],
    config: { temperature: 0.0, maxTokens: 4096, systemInstruction: "Strict IAM Auditor." }
  },
  // ... (puedes añadir más agentes siguiendo este patrón)
];

// Integraciones con colores neutros y acentos de marca
export const INTEGRATIONS = [
  { id: 'github', name: 'GitHub Enterprise', category: 'Source Control', status: 'connected', lastSync: '1 min ago', icon: GitBranch, color: 'text-white' },
  { id: 'okta', name: 'Okta Identity Cloud', category: 'IAM & Security', status: 'connected', lastSync: '2 mins ago', icon: Lock, color: 'text-brand-primary' },
  { id: 'splunk', name: 'Splunk Enterprise', category: 'Log Aggregation', status: 'connected', lastSync: '30 sec ago', icon: Search, color: 'text-brand-gray' },
  { id: 'gcp_audit', name: 'Google Cloud Audit', category: 'Infrastructure', status: 'connected', lastSync: '5 mins ago', icon: Cloud, color: 'text-white' },
];

export const MOCK_CIAM_APPS: CIAMApplication[] = [
  { id: 'app-1', name: 'Retail Banking Mobile', language: 'React Native', repo: 'fintech/retail-mobile', status: 'Compliant', framework: 'NIST 800-63B', lastScan: '2 hrs ago', monitoringEnabled: true, driftStatus: 'Stable', lastCommit: 'feat: update payment' },
];

export const AGENT_BLUEPRINTS: Record<string, string> = {
  'IAM_ASSURANCE': `// AGENT BLUEPRINT\nclass AccessControlAgent extends Agent { ... }`,
  'CIAM_ATTESTATION': `// AGENT BLUEPRINT\nclass CIAMScout extends Agent { ... }`
};