import { RiskSeverity, CapabilityDefinition, CIAMApplication } from './types';
import { Shield, FileSearch, Zap, Bot, Lock, Search, Cloud, FileText, Database, UserCheck, MessageSquare, Server, Code, GitBranch, Key } from 'lucide-react';

export const SEVERITY_COLORS = {
  [RiskSeverity.LOW]: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  [RiskSeverity.MEDIUM]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  [RiskSeverity.HIGH]: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  [RiskSeverity.CRITICAL]: 'bg-red-500/20 text-red-400 border-red-500/50',
};

export const INITIAL_CAPABILITIES: CapabilityDefinition[] = [
  {
    id: 'GENERIC_AUDIT',
    name: 'General Auditor',
    description: 'Standard control verification logic for general purpose auditing.',
    iconName: 'Shield'
  },
  {
    id: 'IAM_ASSURANCE',
    name: 'IAM Specialist',
    description: 'Analyzes identity graphs, toxic combinations, and segregation of duties.',
    iconName: 'Lock'
  },
  {
    id: 'EVIDENCE_COLLECTION',
    name: 'Evidence Collector',
    description: 'Automates log retrieval, hashing, and chain-of-custody preservation.',
    iconName: 'FileSearch'
  },
  {
    id: 'ANOMALY_DETECTION',
    name: 'Anomaly Detector',
    description: 'Statistical analysis for fraud detection using Benford\'s Law and Z-Scores.',
    iconName: 'Zap'
  },
  {
    id: 'CIAM_ATTESTATION',
    name: 'CIAM Scout',
    description: 'Source code analysis to map business logic to authentication flows.',
    iconName: 'Code'
  }
];

export const AGENT_BLUEPRINTS: Record<string, string> = {
  'IAM_ASSURANCE': `// AGENT BLUEPRINT: IDENTITY_GRAPH_SENTINEL
// MODEL: GEMINI-3.1-FLASH
// TARGET: IAM_HYBRID_INFRA

class IAMAssuranceAgent extends AssuranceAgent {
  async execute(context) {
    // 1. Ingest Data from Heterogeneous Sources
    const idpGraph = await this.connect('Okta_API').fetchEntitlementGraph();
    const adForest = await this.connect('AD_Gateway').fetchGPOs();
    const hrData = await this.connect('Workday_API').fetchCurrentLifecycleStatus();

    // 2. Toxic Combination Analysis (Multi-Hops)
    const criticalPaths = idpGraph.crossReference(adForest).findConflictingPaths({
      constraints: SEPARATION_OF_DUTIES_MATRIX,
      maxHops: 5
    });

    if (criticalPaths.length > 0) {
      this.flagRisk('SOD_VIOLATION_DETECTED', {
        paths: criticalPaths,
        impact: "Potential Unauthorized Financial Approval"
      });
    }

    // 3. Orphaned/Stale Account Logic
    const orphans = idpGraph.identities.filter(id => 
      id.isActive && hrData.isTerminated(id.email)
    );
    
    return this.generateForensicReport(criticalPaths, orphans);
  }
}`,
  'CIAM_ATTESTATION': `// AGENT BLUEPRINT: CODE_TO_LOGIC_SCOUT
// MODEL: GEMINI-3.1-FLASH
// ARCHITECTURE: RAG + MCP (Model Context Protocol)

class CIAMAttestationAgent extends Agent {
  async auditApplication(appId: string) {
    const codeRepo = await this.mcpServer.query('repos').getById(appId);
    
    // 1. Recursive Execution Trace
    const trace = await this.ragEngine.recursiveTrace({
      entry: 'POST /v1/payments/transfer',
      depth: 'fullstack',
      languages: ['Java', 'TS', 'Golang']
    });

    // 2. Logic Stitching & Intent Extraction
    const logicMap = this.stitchLogic(trace);
    
    // 3. Security Policy Validation
    const gaps = this.verifyPolicies(logicMap, {
      requiresMFA: true,
      requiresStepUp: entryValue > 5000,
      requiresApprover: true
    });

    return new AttestationReport(logicMap, gaps);
  }
}`,
  'EVIDENCE_COLLECTION': `// AGENT BLUEPRINT: IMMUTABLE_EVIDENCE_VAULT
// MODEL: GEMINI-3.1-FLASH
// COMPLIANCE: SOX Sec 404 / ISO 27001

class EvidenceCollectionAgent extends Agent {
  async collectEvidence(period: string) {
    // 1. Stream Logs from Secure Sources
    const logs = await this.splunk.streamEvents({
      query: 'index=prod_audit action=change status=success',
      timerange: period
    });

    // 2. Cryptographic Integrity Verification
    const validatedArtifacts = logs.map(event => {
      const hash = crypto.createHash('sha256').update(event.raw).digest('hex');
      return { 
        ...event, 
        integrityHash: hash,
        timestamp: event.metadata.ingest_time
      };
    });

    // 3. Chain-of-Custody Preservation
    await this.storage.vault(validatedArtifacts, {
      retention: '7y',
      encryption: 'AES-256-GCM'
    });

    return { count: validatedArtifacts.length, vaultStatus: 'Sealed' };
  }
}`,
  'ANOMALY_DETECTION': `// AGENT BLUEPRINT: TRANSACTIONAL_ANOMALY_ENGINE
// MODEL: GEMINI-3.1-FLASH
// ENGINES: LLM_REASONING + STATISTICAL_ANALYSIS

class AnomalyDetectionAgent extends Agent {
  async monitorTransactions(stream) {
    // 1. Statistical Pre-Filtering (Z-Score & Velocity)
    const anomalies = stream.filter(tx => 
      this.stats.calculateZScore(tx.amount) > 3.0 || 
      this.stats.getVelocity(tx.sender) > thresholds.senderFreq
    );

    // 2. LLM Intent & Context Analysis
    for (const tx of anomalies) {
      const context = await this.fetchContext(tx);
      const reasoning = await this.llm.reason("Verify if this outlier is expected business behavior", {
        transaction: tx,
        history: context.recentHistory
      });

      if (reasoning.confidence < 0.2) {
        this.emitAlert('FRAUD_PROBABILITY_HIGH', { tx, reason: reasoning.summary });
      }
    }
  }
}`
};

export const INITIAL_AGENT_CATALOG = [
  {
    id: 'CIAM_ATTESTATION',
    name: 'CIAM Compliance Scout',
    description: 'An autonomous agent using RAG and MCP to reverse-engineer source code. It maps business logic to technical execution flows across Java, COBOL, and APIs to validate authentication hurdles, optimized for Gemini 3.1 Flash.',
    icon: Code,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    model: 'Gemini 3.1 Flash (Preview)',
    capabilities: ['Source Code RAG', 'MCP Integration', 'Sequence Mapping'],
    requiredIntegrations: ['github', 'sonarqube', 'servicenow'],
    useCases: [
      'Detect "Toxic Combinations" in CICD pipelines',
      'Validate Step-Up Auth in Legacy Mainframe flows',
      'Automate Self-Attestation for 1000+ Apps'
    ],
    config: {
      temperature: 0.1,
      maxTokens: 8192,
      systemInstruction: "*** CIAM COMPLIANCE SCOUT *** Initialize MCP connection to codebase. Scan AST for execution paths matching 'Transaction View'. Extract logic bypassing 'Step-Up Auth' for high-value transactions. Optimize tokens and generate sequence trace."
    }
  },
  {
    id: 'IAM_ASSURANCE',
    name: 'Access Control Effectiveness',
    description: 'Powered by Gemini 3.1 Flash (Preview) to analyze complex Identity Graphs. It specializes in IGA, utilizing graph theory to detect toxic combinations, SoD conflicts, and lateral movement paths.',
    icon: Shield,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    model: 'Gemini 3.1 Flash (Preview)',
    capabilities: ['Graph Analysis', 'SoD Conflict Detection', 'Entitlement Review'],
    requiredIntegrations: ['okta', 'workday', 'servicenow'],
    useCases: [
      'Detect "Create Vendor" + "Pay Vendor" conflicts',
      'Identify orphaned accounts vs. HR termination logs',
      'Validate Break-Glass emergency access justification'
    ],
    config: {
      temperature: 0.0,
      maxTokens: 4096,
      systemInstruction: "*** ACCESS CONTROL EFFECTIVENESS *** Connect to IdP and HRIS API. Execute graph analysis on entitlements to detect SoD toxic combinations (e.g. 'Vendor.Create' + 'Payment.Approve'). Cross-reference emergency break-glass logs."
    }
  },
  {
    id: 'EVIDENCE_COLLECTION',
    name: 'Audit Evidence Collection',
    description: 'Utilizing Gemini 3.1 Flash for high-speed log processing, this agent automates the retrieval, validation, and SHA-256 hashing of compliance artifacts. It ensures strict chain-of-custody by cross-referencing immutable logs.',
    icon: FileSearch,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    model: 'Gemini 3.1 Flash (Preview)',
    capabilities: ['Log Aggregation', 'SHA-256 Hashing', 'Timestamp Verification'],
    requiredIntegrations: ['splunk', 'jira', 'gcp_audit'],
    useCases: [
      'Validate 100% of change tickets against logs',
      'Verify configuration drift in production servers',
      'Collect and hash evidence for SOX/ISO audits'
    ],
    config: {
      temperature: 0.0,
      maxTokens: 2048,
      systemInstruction: "*** EVIDENCE COLLECTION AGENT *** Query SIEM logs for deployments tracking EventID 4624/4625. Validate timestamp continuity. Generate SHA-256 hashes for all retrieved artifacts to ensure chain-of-custody immutability."
    }
  },
  {
    id: 'ANOMALY_DETECTION',
    name: 'Transaction Anomaly Detection',
    description: 'A hybrid agent combining Gemini 3.1 Flash reasoning with SciKit-Learn statistical models. It applies Benford\'s Law, Z-Score velocity checks, and Isolation Forests to detect high-fidelity fraud patterns.',
    icon: Zap,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    model: 'Gemini 3.1 Flash (Preview)',
    capabilities: ["Benford's Law", "Z-Score Analysis", "Pattern Recognition"],
    requiredIntegrations: ['bigquery', 'workday'],
    useCases: [
      'Detect invoice structuring/smurfing',
      'Identify ghost vendors via fuzzy matching',
      'Flag duplicate payments across periods'
    ],
    config: {
      temperature: 0.4,
      maxTokens: 16384,
      systemInstruction: "*** TRANSACTION ANOMALY DETECTOR *** Ingest GL dataset. Apply Benford's Law and calculate Z-Scores for vendor payment velocity. Identify potential 'Structuring' patterns and cross-reference with 'Ghost Vendor' logic signatures."
    }
  }
];

export const INTEGRATIONS = [
  { id: 'github', name: 'GitHub Enterprise', category: 'Source Control', status: 'connected', lastSync: '1 min ago', icon: GitBranch, color: 'text-white' },
  { id: 'okta', name: 'Okta Identity Cloud', category: 'IAM & Security', status: 'connected', lastSync: '2 mins ago', icon: Lock, color: 'text-blue-500' },
  { id: 'splunk', name: 'Splunk Enterprise', category: 'Log Aggregation', status: 'connected', lastSync: '30 sec ago', icon: Search, color: 'text-emerald-500' },
  { id: 'gcp_audit', name: 'Google Cloud Audit Logs', category: 'Infrastructure', status: 'connected', lastSync: '5 mins ago', icon: Cloud, color: 'text-blue-400' },
  { id: 'jira', name: 'Jira Software', category: 'Ticketing & Approvals', status: 'connected', lastSync: '10 mins ago', icon: FileText, color: 'text-blue-400' },
  { id: 'bigquery', name: 'Google BigQuery', category: 'Data Warehouse', status: 'connected', lastSync: '1 hour ago', icon: Database, color: 'text-teal-400' },
  { id: 'workday', name: 'Workday HRIS', category: 'HR & People', status: 'error', lastSync: '2 days ago', icon: UserCheck, color: 'text-indigo-500' },
  { id: 'servicenow', name: 'ServiceNow ITSM', category: 'Service Management', status: 'pending', lastSync: '-', icon: Server, color: 'text-green-600' }
];

export const MOCK_CIAM_APPS: CIAMApplication[] = [
  { id: 'app-1', name: 'Retail Banking Mobile', language: 'React Native / Node.js', repo: 'fintech/retail-mobile', status: 'Compliant', framework: 'NIST 800-63B', lastScan: '2 hrs ago', monitoringEnabled: true, driftStatus: 'Stable', lastCommit: 'feat: update payment gateway' },
  { id: 'app-2', name: 'Legacy Wire Transfer', language: 'Java / COBOL', repo: 'fintech/core-payments', status: 'Non-Compliant', framework: 'PCI-DSS 4.0', lastScan: '1 day ago', monitoringEnabled: true, driftStatus: 'Re-Auth Required', lastCommit: 'fix: hotfix auth logic' },
  { id: 'app-3', name: 'Wealth Management Portal', language: 'Angular / .NET', repo: 'fintech/wealth-portal', status: 'Compliant', framework: 'SOC 2 Type II', lastScan: '5 hrs ago', monitoringEnabled: false, driftStatus: 'Stable', lastCommit: 'chore: update deps' },
];