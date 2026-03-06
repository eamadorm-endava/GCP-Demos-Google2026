
import React, { useState, useEffect } from 'react';
import { MOCK_CIAM_APPS } from '../../constants';
import { AgentStatus, SequenceStep, Risk, CIAMApplication } from '../../types';
import Terminal from '../Terminal';
import SequenceDiagram from '../SequenceDiagram';
import AddAppModal from '../AddAppModal';
import { streamAuditSimulation } from '../../services/geminiService';
import { Shield, Code, GitBranch, Play, CheckCircle2, AlertTriangle, FileCode, Cpu, Loader2, ArrowRight, Plus, Layers, Search, Workflow, FileCheck, Sliders, Eye, FileJson, X, RefreshCw, GitCommit, Activity } from 'lucide-react';

const SIMULATION_STAGES = [
    { id: 'init', label: 'Context Init', icon: Layers },
    { id: 'discovery', label: 'Code Discovery', icon: Search },
    { id: 'trace', label: 'Logic Tracing', icon: Workflow },
    { id: 'validate', label: 'Compliance Check', icon: Shield },
    { id: 'report', label: 'Final Report', icon: FileCheck }
];

const CIAMView: React.FC = () => {
    const [apps, setApps] = useState<CIAMApplication[]>(MOCK_CIAM_APPS);
    const [selectedApp, setSelectedApp] = useState<CIAMApplication>(apps[0]);
    const [transaction, setTransaction] = useState('POST /api/v1/transfer_funds');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [sequence, setSequence] = useState<SequenceStep[]>([]);
    const [auditResult, setAuditResult] = useState<any>(null);
    const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
    const [currentStage, setCurrentStage] = useState(0);

    // View Mode: 'config' or 'monitoring'
    const [viewMode, setViewMode] = useState<'config' | 'monitoring'>('config');
    const [activeWizardStep, setActiveWizardStep] = useState<1 | 2 | 3>(1);

    // Custom Attestation Parameters
    const [attestationParams, setAttestationParams] = useState({
        checkMFA: true,
        checkIP: true,
        checkVelocity: true,
        riskThreshold: 10000
    });

    // Logic Inspector State
    const [isLogicModalOpen, setIsLogicModalOpen] = useState(false);
    const [logicTab, setLogicTab] = useState<'blueprint' | 'prompt'>('blueprint');

    // Dynamic Content Generation for Logic Inspector
    const generatedBlueprint = `
// AGENT BLUEPRINT: ${selectedApp.name.replace(/\s+/g, '_').toUpperCase()}_VERIFIER
// TARGET_REPO: ${selectedApp.repo}
// FRAMEWORK: ${selectedApp.framework || 'NIST-800-63B'}

class CIAMVerifier extends Agent {
  config = {
    mfaThreshold: ${attestationParams.riskThreshold}, // Configurable
    enforceZeroTrust: ${attestationParams.checkIP},
    velocityCheck: ${attestationParams.checkVelocity}
  };

  async validate(transaction) {
    // 1. Static Analysis (AST)
    const code = await this.fetchSource("${selectedApp.repo}");
    
    // 2. Extract Auth Flow
    const authPath = this.extractAuthFlow(code, transaction.entryPoint);
    
    // 3. Policy Execution
    if (transaction.amount > this.config.mfaThreshold) {
       if (!authPath.includes('StepUpChallenge')) {
         this.flagViolation("MISSING_MFA_HIGH_VALUE");
       }
    }
    
    if (this.config.enforceZeroTrust && authPath.includes('TrustedIP_Bypass')) {
        this.flagViolation("ZERO_TRUST_VIOLATION");
    }
  }
}
`;

    const generatedPrompt = `
SYSTEM_INSTRUCTION:
You are an autonomous CIAM Compliance Agent.
Your mission is to audit the repository '${selectedApp.repo}' for the application '${selectedApp.name}'.
You must enforce the '${selectedApp.framework || 'Standard'}' compliance framework.

OPERATIONAL PARAMETERS:
- MFA Check Required: ${attestationParams.checkMFA ? 'YES' : 'NO'}
- Risk Threshold Amount: $${attestationParams.riskThreshold}
- IP Allow-listing Validation: ${attestationParams.checkIP ? 'ACTIVE' : 'DISABLED'}
- Velocity/Fraud Check: ${attestationParams.checkVelocity ? 'ACTIVE' : 'DISABLED'}

EXECUTION STEPS:
1. Scan source code for the entry point: '${transaction}'.
2. Trace the execution logic to identifying Authentication Gates.
3. Compare found logic against Operational Parameters.
4. If a check fails, log a 'CRITICAL' deficiency.
`;

    // Mock Sequence Data Generation - Helper to create consistent visualization
    const generateMockSequence = (isCompliant: boolean) => {
        return [
            { id: '1', from: 'Mobile App', to: 'API Gateway', label: 'POST /transfer', timestamp: Date.now(), status: 'success' },
            { id: '2', from: 'API Gateway', to: 'CIAM Auth', label: 'Validate Token', timestamp: Date.now() + 100, status: 'success' },
            { id: '3', from: 'CIAM Auth', to: 'Risk Engine', label: 'Check Risk Score', timestamp: Date.now() + 200, status: 'success' },
            { id: '4', from: 'Risk Engine', to: 'CIAM Auth', label: 'Risk > 50 (High)', timestamp: Date.now() + 300, status: 'warning' },
            { id: '5', from: 'CIAM Auth', to: 'Mobile App', label: isCompliant ? 'Challenge MFA' : 'Allow (Missing MFA)', timestamp: Date.now() + 400, status: isCompliant ? 'success' : 'error' },
            { id: '6', from: 'Mobile App', to: 'Core Banking', label: 'Execute Tx', timestamp: Date.now() + 800, status: isCompliant ? 'success' : 'default' },
        ] as SequenceStep[];
    };

    const handleRunAttestation = async () => {
        if (isAnalyzing) return;

        setActiveWizardStep(2);
        setIsAnalyzing(true);
        setCurrentStage(1);
        setLogs([]);
        setSequence([]);
        setAuditResult(null);

        let resultReceived = false;

        // Mock Risk/Control for the simulation service
        const mockRisk: Risk = {
            id: 'CIAM-RISK-1',
            title: 'Missing Step-Up Authentication',
            description: 'High-risk transactions must trigger MFA.',
            severity: 'High' as any,
            category: 'CIAM',
            scoring: 90,
            controls: []
        };

        // Simulate streaming
        try {
            const stream = streamAuditSimulation(mockRisk, 'Step-Up Auth Validation', 'CIAM_ATTESTATION');

            for await (const chunk of stream) {
                // Clean up chunk: remove markdown code blocks if present
                const cleanChunk = chunk.replace(/```json/g, '').replace(/```/g, '');
                const lines = cleanChunk.split('\n');

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;
                    try {
                        // Attempt to parse JSON line
                        if (trimmed.startsWith('{')) {
                            const data = JSON.parse(trimmed);

                            if (data.type === 'log') {
                                setLogs(prev => [...prev, { ...data, timestamp: new Date().toLocaleTimeString() }]);

                                // Heuristic stage advancement based on log content
                                const content = (data.action + ' ' + data.detail).toLowerCase();
                                if (content.includes('connect') || content.includes('init')) setCurrentStage(1);
                                else if (content.includes('scan') || content.includes('ast') || content.includes('discovery')) setCurrentStage(2);
                                else if (content.includes('stitch') || content.includes('trace') || content.includes('path')) setCurrentStage(3);
                                else if (content.includes('verify') || content.includes('validate') || content.includes('check')) setCurrentStage(4);
                                else if (content.includes('report') || content.includes('generate')) setCurrentStage(5);

                            } else if (data.type === 'result') {
                                resultReceived = true;
                                setCurrentStage(5); // Complete
                                setAuditResult(data.data);
                                setSequence(generateMockSequence(data.data.effective));
                            }
                        }
                    } catch (e) {
                        // Keep terminal alive even if parse fails
                        if (trimmed.length > 5) {
                            setLogs(prev => [...prev, {
                                timestamp: new Date().toLocaleTimeString(),
                                action: 'PROCESSING',
                                detail: trimmed,
                                status: 'info'
                            }]);
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Attestation Error:", e);
            setLogs(prev => [...prev, {
                timestamp: new Date().toLocaleTimeString(),
                action: 'SYSTEM_ERROR',
                detail: 'Attestation sequence interrupted. Attempting recovery...',
                status: 'error'
            }]);
        } finally {
            setIsAnalyzing(false);

            // FAILSAFE: If the stream finished but no result was parsed (e.g. network glitch or parse error),
            // force the simulation to complete so the user sees the output.
            if (!resultReceived) {
                const fallbackResult = {
                    score: 45,
                    effective: false,
                    summary: "The CIAM agent detected a critical logic flaw where step-up authentication is bypassed for internal subnets, violating Zero Trust policies for high-value transfers.",
                    gaps: ["MFA Bypass on Internal Subnets", "Hardcoded Trusted IP List"],
                    recommendations: ["Remove IP-based trust", "Enforce adaptive MFA globally"],
                    scenario: "CIAM_LOGIC_GAP"
                };

                setLogs(prev => [...prev, {
                    timestamp: new Date().toLocaleTimeString(),
                    action: "REPORT_GEN",
                    detail: "Compiling deficiency report and generating sequence diagram...",
                    status: "success"
                }]);

                setCurrentStage(5);
                setAuditResult(fallbackResult);
                setSequence(generateMockSequence(false));
            }
        }
    };

    const handleAddApp = (newApp: CIAMApplication) => {
        setApps(prev => [...prev, { ...newApp, monitoringEnabled: true, driftStatus: 'Stable' }]);
        setSelectedApp(newApp);
    };

    const simulateCodeDrift = (appId: string) => {
        setApps(prev => prev.map(a => {
            if (a.id === appId) {
                return {
                    ...a,
                    driftStatus: 'Re-Auth Required',
                    lastCommit: 'fix: bypass logic hotfix',
                    lastScan: 'Drift detected 1m ago'
                };
            }
            return a;
        }));
    };

    const reauthorizeApp = (appId: string) => {
        setApps(prev => prev.map(a => {
            if (a.id === appId) {
                return {
                    ...a,
                    driftStatus: 'Stable',
                    lastScan: 'Just now'
                };
            }
            return a;
        }));
        // Also trigger visualization
        if (selectedApp.id === appId) {
            handleRunAttestation();
        }
    }

    const getActiveContent = () => {
        return logicTab === 'blueprint' ? generatedBlueprint.trim() : generatedPrompt.trim();
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-endava-dark relative">

            {/* Header */}
            <header className="mb-8 border-b border-white/5 pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-endava-blue-40/10 rounded-lg border border-endava-blue-40/20 text-endava-blue-40">
                            <Code className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">CIAM Attestation Lab</h1>
                    </div>

                    {/* Mode Switcher */}
                    <div className="bg-endava-dark p-1 rounded-lg border border-white/5 flex space-x-1">
                        <button
                            onClick={() => setViewMode('config')}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${viewMode === 'config' ? 'bg-endava-orange text-white shadow-lg' : 'text-endava-blue-40 hover:text-white'}`}
                        >
                            Config & Run
                        </button>
                        <button
                            onClick={() => setViewMode('monitoring')}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${viewMode === 'monitoring' ? 'bg-endava-orange text-white shadow-lg' : 'text-endava-blue-40 hover:text-white'}`}
                        >
                            Monitored Fleet
                        </button>
                    </div>
                </div>
                <p className="text-endava-blue-40 max-w-3xl mt-2">
                    {viewMode === 'config'
                        ? 'Autonomous Agentic AI utilizing RAG and MCP to reverse-engineer source code, map business logic, and validate compliance.'
                        : 'Continuous monitoring of compliant applications. Detects code drift and automatically flags applications for re-attestation.'}
                </p>
            </header>

            {viewMode === 'config' ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
                    {/* Left Panel: Configuration Workflow */}
                    <div className="xl:col-span-1 flex flex-col space-y-4 overflow-y-auto pr-2">

                        {/* Step 1: App Selection */}
                        <div className={`transition-all duration-300 ${isAnalyzing ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-endava-dark border border-white/10 flex items-center justify-center text-xs font-bold text-endava-blue-30">1</div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Select Application</h3>
                            </div>

                            <div className="bg-endava-dark border border-white/10 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-endava-blue-40 font-semibold">Target Repository</span>
                                    <button
                                        onClick={() => setIsAddAppModalOpen(true)}
                                        className="p-1.5 rounded bg-endava-blue-60/10 text-endava-blue-60 hover:bg-endava-orange hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-medium border border-transparent"
                                    >
                                        <Plus className="w-3 h-3" />
                                        <span>NEW APP</span>
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                    {apps.map(app => (
                                        <button
                                            key={app.id}
                                            onClick={() => setSelectedApp(app)}
                                            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${selectedApp.id === app.id
                                                ? 'bg-endava-blue-60/10 border-endava-orange shadow-[0_0_10px_rgba(255,86,64,0.1)]'
                                                : 'bg-endava-blue-90 border-transparent hover:border-white/10'
                                                }`}
                                        >
                                            <div>
                                                <div className={`font-semibold text-sm ${selectedApp.id === app.id ? 'text-white' : 'text-endava-blue-30 group-hover:text-white'}`}>{app.name}</div>
                                                <div className="flex items-center space-x-2 text-[10px] text-endava-blue-50 font-mono">
                                                    <span className="truncate max-w-[120px]">{app.repo}</span>
                                                    {app.framework && <span className="text-endava-blue-60 border border-endava-blue-60/30 px-1 rounded">{app.framework}</span>}
                                                </div>
                                            </div>
                                            {selectedApp.id === app.id && <CheckCircle2 className="w-4 h-4 text-endava-orange" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Transaction Scope */}
                        <div className={`transition-all duration-300 ${isAnalyzing ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <div className="flex items-center space-x-2 mb-3 mt-2">
                                <div className="w-6 h-6 rounded-full bg-endava-dark border border-white/10 flex items-center justify-center text-xs font-bold text-endava-blue-30">2</div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Define Entry Point</h3>
                            </div>

                            <div className="bg-endava-dark border border-white/10 rounded-xl p-4">
                                <div className="flex space-x-2">
                                    <select className="bg-endava-blue-90 border border-white/5 text-endava-blue-30 text-xs rounded-lg px-2 outline-none w-20 font-mono">
                                        <option>POST</option>
                                        <option>GET</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={transaction.split(' ').slice(1).join(' ')}
                                        onChange={(e) => setTransaction(`POST ${e.target.value}`)}
                                        className="flex-1 bg-endava-blue-90 border border-white/5 text-endava-blue-30 text-xs rounded-lg px-3 py-2 outline-none focus:border-endava-orange transition-colors font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Configure Parameters */}
                        <div className={`transition-all duration-300 ${isAnalyzing ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <div className="flex items-center justify-between mb-3 mt-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-endava-dark border border-white/10 flex items-center justify-center text-xs font-bold text-endava-blue-30">3</div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Attestation Params</h3>
                                </div>
                                <button
                                    onClick={() => setIsLogicModalOpen(true)}
                                    className="text-[10px] flex items-center space-x-1 text-endava-blue-50 hover:text-white transition-colors"
                                >
                                    <Eye className="w-3 h-3" />
                                    <span>Inspect Logic</span>
                                </button>
                            </div>

                            <div className="bg-endava-dark border border-white/10 rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-endava-blue-40">Enforce MFA</span>
                                    <div
                                        onClick={() => setAttestationParams(p => ({ ...p, checkMFA: !p.checkMFA }))}
                                        className={`w-9 h-5 rounded-full cursor-pointer relative transition-colors ${attestationParams.checkMFA ? 'bg-endava-orange' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${attestationParams.checkMFA ? 'left-5' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-endava-blue-40">Validate IP Allow-list</span>
                                    <div
                                        onClick={() => setAttestationParams(p => ({ ...p, checkIP: !p.checkIP }))}
                                        className={`w-9 h-5 rounded-full cursor-pointer relative transition-colors ${attestationParams.checkIP ? 'bg-endava-orange' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${attestationParams.checkIP ? 'left-5' : 'left-1'}`}></div>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-white/5">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-endava-blue-40">Risk Threshold</span>
                                        <span className="text-endava-blue-50 font-mono">${attestationParams.riskThreshold.toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1000" max="50000" step="1000"
                                        value={attestationParams.riskThreshold}
                                        onChange={(e) => setAttestationParams(p => ({ ...p, riskThreshold: parseInt(e.target.value) }))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-endava-orange [&::-webkit-slider-thumb]:rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Execution */}
                        <div>
                            <div className="flex items-center space-x-2 mb-3 mt-2">
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${isAnalyzing ? 'bg-endava-orange border-endava-orange text-white animate-pulse' : 'bg-endava-dark border-white/10 text-endava-blue-30'}`}>4</div>
                                <h3 className={`text-sm font-bold uppercase tracking-wide ${isAnalyzing ? 'text-endava-orange' : 'text-white'}`}>Start Simulation</h3>
                            </div>

                            <div className="bg-endava-dark border border-white/10 rounded-xl p-4 space-y-4">
                                <button
                                    onClick={handleRunAttestation}
                                    disabled={isAnalyzing}
                                    className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-xl ${isAnalyzing
                                        ? 'bg-endava-blue-90 text-endava-blue-50 cursor-not-allowed border border-white/5'
                                        : 'endava-gradient text-white shadow-endava-orange/20 border border-transparent transform hover:scale-[1.02]'
                                        }`}
                                >
                                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                                    <span className="tracking-wide">{isAnalyzing ? 'Running Attestation Protocol...' : 'Run Full CIAM Attestation'}</span>
                                </button>

                                {/* Progress Tracker */}
                                {isAnalyzing && (
                                    <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="h-1 w-full bg-endava-blue-90 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-endava-orange transition-all duration-500 ease-out"
                                                style={{ width: `${(currentStage / SIMULATION_STAGES.length) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="grid grid-cols-5 gap-1">
                                            {SIMULATION_STAGES.map((stage, idx) => {
                                                const isActive = idx + 1 === currentStage;
                                                const isCompleted = idx + 1 < currentStage;
                                                return (
                                                    <div key={stage.id} className="flex flex-col items-center">
                                                        <div className={`mb-1 p-1.5 rounded-full border ${isActive ? 'bg-endava-orange/20 border-endava-orange text-endava-orange scale-110' :
                                                            isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                                                                'bg-endava-dark border-white/10 text-endava-blue-50'
                                                            } transition-all duration-300`}>
                                                            <stage.icon className="w-3 h-3" />
                                                        </div>
                                                        <span className={`text-[9px] font-medium text-center leading-tight ${isActive ? 'text-endava-orange' :
                                                            isCompleted ? 'text-emerald-500' :
                                                                'text-endava-blue-50'
                                                            }`}>{stage.label}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Terminal Preview */}
                        <div className="flex-1 min-h-[200px] border border-white/5 rounded-lg overflow-hidden mt-4">
                            <Terminal logs={logs} status={isAnalyzing ? AgentStatus.EXECUTING : AgentStatus.IDLE} controlName="CIAM_SCOUT" />
                        </div>

                    </div>

                    {/* Right Panel: Visualization & Report */}
                    <div className="xl:col-span-2 flex flex-col space-y-6 overflow-hidden">

                        {/* Sequence Diagram Visualizer */}
                        <div className="bg-endava-dark border border-white/10 rounded-xl p-1 flex-1 min-h-[400px] flex flex-col relative overflow-hidden shadow-2xl">
                            <div className="absolute top-4 left-4 z-10 flex space-x-2">
                                <div className="bg-endava-blue-90/80 backdrop-blur px-3 py-1 rounded border border-white/5 text-xs text-endava-blue-40 font-mono flex items-center">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${isAnalyzing ? 'bg-endava-orange animate-pulse' : 'bg-emerald-500'}`}></span>
                                    Live Context: {selectedApp.name}
                                </div>
                            </div>
                            {sequence.length > 0 ? (
                                <SequenceDiagram steps={sequence} />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-endava-blue-50 bg-endava-blue-90/50">
                                    <div className="w-20 h-20 border-2 border-white/10 rounded-full flex items-center justify-center mb-6 relative">
                                        <ArrowRight className="w-8 h-8 opacity-50 text-endava-blue-60" />
                                        {isAnalyzing && (
                                            <div className="absolute inset-0 border-t-2 border-endava-orange rounded-full animate-spin"></div>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-endava-blue-40">
                                        {isAnalyzing ? 'Tracing Execution Path...' : 'Ready to Visualize Transaction Flow'}
                                    </p>
                                    <p className="text-xs text-endava-blue-50 mt-2 max-w-xs text-center">
                                        Initiate the full attestation protocol to generate the live sequence diagram.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Result Report */}
                        {auditResult && (
                            <div className="bg-endava-dark border border-white/10 rounded-xl p-6 animate-in slide-in-from-bottom-4 shadow-2xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Attestation Findings</h3>
                                        <p className="text-endava-blue-40 text-sm">Generated by CIAM Compliance Scout via Source Code Analysis</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${auditResult.effective ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-endava-orange'
                                        }`}>
                                        {auditResult.effective ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                        <span className="font-bold">{auditResult.effective ? 'COMPLIANT' : 'NON-COMPLIANT'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-endava-blue-50 uppercase tracking-wider">Plain English Explanation</h4>
                                        <p className="text-sm text-endava-blue-20 leading-relaxed bg-endava-blue-90 p-3 rounded border border-white/5">
                                            {auditResult.summary}
                                        </p>
                                    </div>
                                    {auditResult.gaps && auditResult.gaps.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-endava-blue-50 uppercase tracking-wider">Identified Gaps</h4>
                                            <ul className="space-y-2">
                                                {auditResult.gaps.map((gap: string, i: number) => (
                                                    <li key={i} className="text-sm text-endava-orange flex items-start">
                                                        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-endava-orange" />
                                                        {gap}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            ) : (
                // MONITORING VIEW
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apps.filter(app => app.monitoringEnabled).map(app => {
                            const isDrifted = app.driftStatus === 'Re-Auth Required' || app.driftStatus === 'Drift Detected';

                            return (
                                <div key={app.id} className={`bg-endava-dark border rounded-xl p-6 transition-all ${isDrifted ? 'border-endava-orange/50 shadow-[0_0_20px_rgba(255,86,64,0.1)]' : 'border-white/10 hover:border-endava-orange/30'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className={`p-2 rounded-lg ${isDrifted ? 'bg-endava-orange/10 text-endava-orange' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{app.name}</h3>
                                                <div className="text-xs text-endava-blue-40 font-mono">{app.repo}</div>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${isDrifted ? 'bg-endava-orange/10 text-endava-orange border-endava-orange/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            }`}>
                                            {app.driftStatus}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-endava-blue-50 flex items-center"><GitCommit className="w-3.5 h-3.5 mr-2" /> Last Commit</span>
                                            <span className="text-white font-mono text-xs">{app.lastCommit || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-endava-blue-50 flex items-center"><RefreshCw className="w-3.5 h-3.5 mr-2" /> Last Scan</span>
                                            <span className="text-white font-mono text-xs">{app.lastScan}</span>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="pt-4 border-t border-white/10 flex justify-end space-x-2">
                                        {isDrifted ? (
                                            <button
                                                onClick={() => reauthorizeApp(app.id)}
                                                className="w-full py-2 bg-endava-blue-80 hover:bg-endava-orange text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center space-x-2"
                                            >
                                                <Play className="w-3 h-3 fill-current" />
                                                <span>Re-Run Attestation</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => simulateCodeDrift(app.id)}
                                                className="w-full py-2 bg-endava-blue-90 hover:bg-endava-blue-80 text-endava-blue-40 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-transparent hover:border-white/10"
                                            >
                                                Simulate Code Drift
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Logic Inspector Modal */}
            {isLogicModalOpen && (
                <div className="absolute inset-0 z-50 bg-endava-dark/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-endava-blue-90 border border-white/10 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-endava-dark/50">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-endava-orange/10 rounded-lg border border-endava-orange/20 text-endava-orange">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Logic Inspector</h2>
                                    <div className="text-xs text-endava-blue-40">Forward Engineering Preview</div>
                                </div>
                            </div>
                            <button onClick={() => setIsLogicModalOpen(false)} className="text-endava-blue-50 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex border-b border-white/5 bg-endava-dark/80">
                            <button
                                onClick={() => setLogicTab('blueprint')}
                                className={`px-6 py-3 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${logicTab === 'blueprint' ? 'text-endava-orange border-endava-orange' : 'text-endava-blue-40 border-transparent hover:text-white'}`}
                            >
                                <FileCode className="w-4 h-4" /> <span>Agent Blueprint (Logic)</span>
                            </button>
                            <button
                                onClick={() => setLogicTab('prompt')}
                                className={`px-6 py-3 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors ${logicTab === 'prompt' ? 'text-emerald-400 border-emerald-500' : 'text-endava-blue-40 border-transparent hover:text-white'}`}
                            >
                                <FileJson className="w-4 h-4" /> <span>System Prompt (Natural Language)</span>
                            </button>
                        </div>

                        <div className="flex-1 min-h-0 flex overflow-hidden">
                            {/* Line Numbers */}
                            <div className="w-12 bg-endava-dark/95 text-endava-blue-50 text-right pr-3 pt-6 select-none border-r border-white/10 shrink-0 overflow-hidden font-mono text-sm leading-relaxed">
                                {getActiveContent().split('\n').map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                            </div>

                            {/* Code Content */}
                            <div className="flex-1 overflow-auto p-6 bg-endava-dark/95">
                                <pre className="font-mono text-sm leading-relaxed">
                                    <code className={logicTab === 'blueprint' ? 'text-endava-blue-20' : 'text-emerald-300'}>
                                        {getActiveContent()}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        <div className="p-4 bg-endava-dark border-t border-white/10 flex justify-end">
                            <button onClick={() => setIsLogicModalOpen(false)} className="px-4 py-2 rounded-lg bg-endava-blue-90 hover:bg-white/10 text-white text-sm font-medium border border-transparent">
                                Close Inspector
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddAppModal
                isOpen={isAddAppModalOpen}
                onClose={() => setIsAddAppModalOpen(false)}
                onAdd={handleAddApp}
            />
        </div>
    );
};

export default CIAMView;
