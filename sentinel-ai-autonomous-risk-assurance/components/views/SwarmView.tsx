import React, { useState, useEffect } from 'react';
import { SwarmCluster } from '../../types';
import { Play, Pause, RefreshCw, Server, Globe, Database, Layers, Zap, Terminal, Shield, Key, ChevronDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

type MissionType = 'GENERAL_AUDIT' | 'CIAM_ATTESTATION' | 'SECRET_SCANNING';

const INITIAL_CLUSTERS: SwarmCluster[] = [
  { id: 'c-1', name: 'Legacy Core Systems', techStack: 'Mainframe (COBOL/JCL)', repoCount: 450, activeAgents: 0, linesOfCode: '32.5M', status: 'idle', progress: 0, findings: 0 },
  { id: 'c-2', name: 'Digital Payments Cloud', techStack: 'Microservices (Java/Go)', repoCount: 2100, activeAgents: 0, linesOfCode: '18.2M', status: 'idle', progress: 0, findings: 0 },
  { id: 'c-3', name: 'Consumer Channels', techStack: 'Frontend (React/TS)', repoCount: 850, activeAgents: 0, linesOfCode: '5.4M', status: 'idle', progress: 0, findings: 0 },
  { id: 'c-4', name: 'Data Lake & AI', techStack: 'Data (Python/SQL)', repoCount: 1200, activeAgents: 0, linesOfCode: '12.1M', status: 'idle', progress: 0, findings: 0 },
];

const MISSIONS: Record<MissionType, { label: string, description: string, color: string, icon: any }> = {
  'GENERAL_AUDIT': { 
      label: 'General Vulnerability Sweep', 
      description: 'Broad detection of OWASP Top 10, dependency vulnerabilities, and misconfigurations.', 
      color: 'orange', // Changed to Orange for Endava
      icon: Globe
  },
  'CIAM_ATTESTATION': { 
      label: 'CIAM Logic Verification', 
      description: 'Deep analysis of Authentication & Authorization flows, SSO integrations, and MFA logic.', 
      color: 'red', // Changed to Red
      icon: Shield
  },
  'SECRET_SCANNING': { 
      label: 'Hardcoded Secret Detection', 
      description: 'Pattern matching and entropy analysis for API keys, tokens, and credentials in code.', 
      color: 'emerald', // Emerald is acceptable for "Security/Safe", kept as contrast
      icon: Key
  }
};

const MOCK_LOGS_POOL = {
  GENERAL_AUDIT: {
    mainframe: ["Scanning member: ACCT_VAL.CBL...", "Analyzing COPYBOOK: CPY_GL_01...", "JCL dependency mapped: JOB_NIGHTLY_BATCH", "Detected hardcoded credentials in WORKING-STORAGE SECTION"],
    microservices: ["Parsing pom.xml dependencies...", "Tracing gRPC calls in payment-service", "Detected SQL Injection vulnerability in query builder", "Mapping Kafka topic topology..."],
    frontend: ["Analyzing package.json for vulnerable deps...", "React Hook dependency check...", "XSS vector found in SearchComponent.tsx", "Scanning verified API calls to /v1/auth"],
    data: ["Parsing Jupyter Notebook cells...", "Analyzing SQL strictly for PII exposure", "Python pickling vulnerability detected", "BigQuery IAM policy validation..."]
  },
  CIAM_ATTESTATION: {
    mainframe: ["Parsing RACF profile definitions...", "Verifying CICS transaction auth check...", "Validating Top Secret (TSS) permission bits...", "Auditing JCL user impersonation privileges..."],
    microservices: ["Validating JWT signature verification...", "Checking OAuth2 scope enforcement...", "Verifying OIDC discovery endpoint...", "Auditing @PreAuthorize annotations..."],
    frontend: ["Checking storage of Access Tokens...", "Verifying 'SameSite' attribute on Cookies...", "Analyzing login form for CSRF...", "Validating MFA challenge UI flow..."],
    data: ["Scanning BigQuery IAM for public access...", "Verifying Column-Level Security...", "Checking Service Account key rotation...", "Auditing access logs..."]
  },
  SECRET_SCANNING: {
    mainframe: ["Entropy scan on JCL PARM fields...", "Checking COBOL literals for password patterns...", "Scanning VSAM dataset names...", "Analyzing DB2 connection strings..."],
    microservices: ["Scanning 'application.yml' for AWS Keys...", "Checking environment variable defaults...", "Detecting private keys in test resource folders...", "Scanning commit history..."],
    frontend: ["Scanning bundle.js for exposed API keys...", "Checking .env.example...", "Detecting AWS Cognito secrets...", "Scanning hardcoded Bearer tokens..."],
    data: ["Scanning SQL dumps for inserted passwords...", "Checking Jupyter notebooks for connection strings...", "Scanning airflow DAGs...", "Detecting S3 bucket credentials..."]
  }
};

const SwarmView: React.FC = () => {
  const [clusters, setClusters] = useState<SwarmCluster[]>(INITIAL_CLUSTERS);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMission, setSelectedMission] = useState<MissionType>('GENERAL_AUDIT');
  const [globalThroughput, setGlobalThroughput] = useState(0); 
  const [activeLogs, setActiveLogs] = useState<{cluster: string, msg: string, time: string}[]>([]);
  const [throughputHistory, setThroughputHistory] = useState<{time: number, value: number}[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setClusters(prev => prev.map(c => {
          if (c.progress >= 100) return { ...c, status: 'completed', activeAgents: 0 };
          const speedFactor = c.id === 'c-1' ? 0.2 : 0.8;
          const newProgress = Math.min(100, c.progress + (Math.random() * 2 * speedFactor));
          const isScanning = newProgress < 100;
          return {
            ...c,
            status: isScanning ? 'scanning' : 'synthesizing',
            activeAgents: isScanning ? Math.floor(c.repoCount * 0.4) : 0,
            findings: c.findings + (Math.random() > 0.8 ? 1 : 0),
            progress: newProgress
          };
        }));

        const currentSpeed = clusters.reduce((acc, c) => acc + (c.status === 'scanning' ? (c.id === 'c-1' ? 45000 : 120000) : 0), 0);
        setGlobalThroughput(prev => Math.floor((prev * 0.8) + (currentSpeed * 0.2) + ((Math.random() - 0.5) * 10000)));

        setThroughputHistory(prev => [...prev, { time: Date.now(), value: currentSpeed }].slice(-20));

        const activeClusters = clusters.filter(c => c.status === 'scanning');
        if (activeClusters.length > 0) {
           const randomCluster = activeClusters[Math.floor(Math.random() * activeClusters.length)];
           const logs = MOCK_LOGS_POOL[selectedMission];
           const logPool = randomCluster.id === 'c-1' ? logs.mainframe : randomCluster.id === 'c-2' ? logs.microservices : randomCluster.id === 'c-3' ? logs.frontend : logs.data;
           setActiveLogs(prev => [{
              cluster: randomCluster.name,
              msg: logPool[Math.floor(Math.random() * logPool.length)],
              time: new Date().toLocaleTimeString()
           }, ...prev].slice(0, 8));
        }
      }, 600);
    } else {
        setGlobalThroughput(0);
        setClusters(prev => prev.map(c => ({...c, activeAgents: 0})));
    }
    return () => clearInterval(interval);
  }, [isRunning, clusters, selectedMission]);

  const handleStart = () => setIsRunning(true);
  const handleReset = () => {
     setIsRunning(false);
     setClusters(INITIAL_CLUSTERS.map(c => ({...c, progress: 0, findings: 0, status: 'idle'})));
     setActiveLogs([]);
     setThroughputHistory([]);
     setGlobalThroughput(0);
  };

  const totalRepos = clusters.reduce((acc, c) => acc + c.repoCount, 0);
  const totalFindings = clusters.reduce((acc, c) => acc + c.findings, 0);
  const MissionIcon = MISSIONS[selectedMission].icon;

  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark p-6 flex flex-col h-screen">
       
       {/* Header */}
       <header className="flex items-center justify-between mb-6 pb-6 border-b border-slate-800">
          <div>
             <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-brand-primary" />
                Swarm Intelligence <span className="text-slate-500 text-sm font-normal font-mono">| GLOBAL_ORCHESTRATOR</span>
             </h1>
             <p className="text-slate-400 mt-1 text-sm">
                Massive-scale Map-Reduce architecture for analyzing heterogeneous repositories.
             </p>
          </div>
          
          <div className="flex items-center space-x-6">
             {/* Mission Selector */}
             <div className="relative group">
                <button disabled={isRunning} className={`flex items-center space-x-3 bg-slate-900 border ${isRunning ? 'border-slate-800 opacity-50 cursor-not-allowed' : 'border-slate-700 hover:border-slate-600'} rounded-lg px-4 py-2 transition-all min-w-[260px]`}>
                    <div className={`p-1.5 rounded bg-${MISSIONS[selectedMission].color}-500/10 text-${MISSIONS[selectedMission].color}-400`}>
                        <MissionIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left flex-1">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Mission Profile</div>
                        <div className="text-sm font-bold text-slate-200">{MISSIONS[selectedMission].label}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>
                
                {!isRunning && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden hidden group-hover:block z-50">
                        {Object.entries(MISSIONS).map(([key, config]) => {
                            const MIcon = config.icon;
                            return (
                                <button 
                                    key={key}
                                    onClick={() => setSelectedMission(key as MissionType)}
                                    className={`w-full text-left p-4 hover:bg-slate-800 transition-colors flex items-start space-x-3 ${selectedMission === key ? 'bg-slate-800/50' : ''}`}
                                >
                                    <div className={`p-2 rounded bg-${config.color}-500/10 text-${config.color}-400 mt-0.5`}>
                                        <MIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className={`text-sm font-bold ${selectedMission === key ? 'text-white' : 'text-slate-300'}`}>{config.label}</div>
                                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">{config.description}</div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
             </div>

             <div className="h-10 w-px bg-slate-800"></div>

             <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Scope</div>
                <div className="text-xl font-mono text-white">{totalRepos.toLocaleString()} Repos</div>
             </div>
             
             <div className="h-10 w-px bg-slate-800"></div>

             {isRunning ? (
                <button onClick={() => setIsRunning(false)} className="bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
                   <Pause className="w-4 h-4" /> <span>Halt Swarm</span>
                </button>
             ) : (
                <div className="flex space-x-2">
                   {totalFindings > 0 && (
                      <button onClick={handleReset} className="bg-slate-800 text-slate-400 border border-slate-700 hover:text-white px-4 py-2 rounded-lg transition-all">
                         <RefreshCw className="w-4 h-4" />
                      </button>
                   )}
                   <button 
                    onClick={handleStart} 
                    className={`text-white shadow-lg px-6 py-2 rounded-lg flex items-center space-x-2 transition-all font-bold bg-${MISSIONS[selectedMission].color}-600 hover:bg-${MISSIONS[selectedMission].color}-500 shadow-${MISSIONS[selectedMission].color}-900/20`}
                   >
                      <Play className="w-4 h-4 fill-current" /> <span>Deploy Swarm</span>
                   </button>
                </div>
             )}
          </div>
       </header>

       <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          
          {/* Main Visualization Area */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
             
             {/* Throughput Monitor */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Zap className="w-24 h-24 text-brand-primary" />
                </div>
                <div className="flex justify-between items-end mb-4 relative z-10">
                   <div>
                      <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Global Processing Throughput</h3>
                      <div className="text-4xl font-mono font-bold text-white mt-2">
                         {(globalThroughput / 1000).toFixed(1)}k <span className="text-lg text-slate-500">lines/sec</span>
                      </div>
                   </div>
                   <div className="h-16 w-48">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={throughputHistory}>
                            <Area type="monotone" dataKey="value" stroke="#FF5540" fillOpacity={0.2} strokeWidth={2} fill="#FF5540" isAnimationActive={false} />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                      className={`h-full transition-all duration-300 bg-${MISSIONS[selectedMission].color}-500`}
                      style={{ width: `${(clusters.reduce((acc, c) => acc + c.progress, 0) / 4)}%` }}
                   ></div>
                </div>
             </div>

             {/* Swarm Clusters */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {clusters.map((cluster) => {
                   const isMainframe = cluster.techStack.includes('Mainframe');
                   const Icon = isMainframe ? Server : cluster.techStack.includes('Frontend') ? Layers : cluster.techStack.includes('Data') ? Database : Globe;
                   // Use warm/neutral colors for clusters instead of rainbows
                   const color = isMainframe ? 'amber' : cluster.techStack.includes('Frontend') ? 'orange' : cluster.techStack.includes('Data') ? 'red' : 'slate';
                   
                   const borderClass = cluster.status === 'scanning' ? `border-${color}-500/50` : 'border-slate-800';
                   const bgClass = cluster.status === 'scanning' ? `bg-${color}-500/5` : 'bg-slate-900';
                   const textClass = `text-${color}-400`;
                   const ringClass = cluster.status === 'scanning' ? `ring-1 ring-${color}-500/30` : '';

                   return (
                      <div key={cluster.id} className={`${bgClass} border ${borderClass} ${ringClass} rounded-xl p-5 transition-all duration-300 relative overflow-hidden group`}>
                         
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                               <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${textClass}`}>
                                  <Icon className="w-5 h-5" />
                               </div>
                               <div>
                                  <h3 className="font-bold text-slate-200">{cluster.name}</h3>
                                  <div className="text-xs text-slate-500 font-mono">{cluster.techStack}</div>
                               </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold border bg-slate-950 ${textClass} border-slate-800`}>
                               {cluster.status}
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                               <div className="text-[10px] text-slate-500 uppercase">Scale</div>
                               <div className="text-sm font-mono text-slate-300">{cluster.repoCount} Repos</div>
                            </div>
                            <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                               <div className="text-[10px] text-slate-500 uppercase">Volume</div>
                               <div className="text-sm font-mono text-slate-300">{cluster.linesOfCode} LOC</div>
                            </div>
                            <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                               <div className="text-[10px] text-slate-500 uppercase">Workers</div>
                               <div className={`text-sm font-mono ${cluster.status === 'scanning' ? 'text-white' : 'text-slate-500'}`}>
                                  {cluster.activeAgents} <span className="text-[10px] text-slate-600">active</span>
                               </div>
                            </div>
                            <div className="bg-slate-950/50 p-2 rounded border border-slate-800/50">
                               <div className="text-[10px] text-slate-500 uppercase">Findings</div>
                               <div className="text-sm font-mono text-red-400">{cluster.findings}</div>
                            </div>
                         </div>

                         <div className="h-16 w-full flex flex-wrap gap-0.5 content-start overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity">
                            {Array.from({ length: 120 }).map((_, i) => (
                               <div 
                                  key={i} 
                                  className={`w-1 h-1 rounded-full transition-all duration-500 ${
                                     i < (cluster.progress * 1.2) 
                                        ? (Math.random() > 0.9 ? 'bg-red-500' : `bg-${color}-500`) 
                                        : 'bg-slate-800'
                                  }`}
                               ></div>
                            ))}
                         </div>
                      </div>
                   )
                })}
             </div>
          </div>

          {/* Right Panel: Aggregated Log Stream */}
          <div className="col-span-12 lg:col-span-4 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
             <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                   <Terminal className="w-4 h-4 text-slate-400" />
                   <h3 className="text-sm font-bold text-slate-200">Global Event Stream</h3>
                </div>
                <div className="flex items-center space-x-1.5">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                   <span className="text-xs text-slate-500 font-mono">LIVE</span>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-slate-950">
                {activeLogs.length === 0 && (
                   <div className="text-slate-600 italic text-center mt-10">
                      Swarm is idle. <br/> Deploy to start stream.
                   </div>
                )}
                {activeLogs.map((log, idx) => (
                   <div key={idx} className="animate-in fade-in slide-in-from-right-4 duration-300 border-l-2 border-slate-800 pl-3 py-1">
                      <div className="flex justify-between text-slate-500 mb-0.5">
                         <span>{log.cluster}</span>
                         <span>{log.time}</span>
                      </div>
                      <div className={`leading-relaxed ${
                         log.msg.includes('vulnerability') || log.msg.includes('XSS') || log.msg.includes('Injection') 
                            ? 'text-red-400' 
                            : 'text-brand-primary' // Orange for normal logs
                      }`}>
                         {log.msg}
                      </div>
                   </div>
                ))}
             </div>
          </div>

       </div>
    </div>
  );
};

export default SwarmView;