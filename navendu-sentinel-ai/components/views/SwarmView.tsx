
import React, { useState, useEffect } from 'react';
import { SwarmCluster } from '../../types';
import { Play, Pause, RefreshCw, Server, Globe, Database, Layers, Zap, Terminal, Shield, Key, Scan, ChevronDown } from 'lucide-react';
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
      color: 'endava-blue-60',
      icon: Globe
   },
   'CIAM_ATTESTATION': {
      label: 'CIAM Logic Verification',
      description: 'Deep analysis of Authentication & Authorization flows, SSO integrations, and MFA logic.',
      color: 'endava-blue-50',
      icon: Shield
   },
   'SECRET_SCANNING': {
      label: 'Hardcoded Secret Detection',
      description: 'Pattern matching and entropy analysis for API keys, tokens, and credentials in code.',
      color: 'endava-orange',
      icon: Key
   }
};

const MOCK_LOGS_POOL = {
   GENERAL_AUDIT: {
      mainframe: [
         "Scanning member: ACCT_VAL.CBL...", "Analyzing COPYBOOK: CPY_GL_01...", "JCL dependency mapped: JOB_NIGHTLY_BATCH", "Detected hardcoded credentials in WORKING-STORAGE SECTION", "Mapping CICS transaction flow: TX_001 -> DB2"
      ],
      microservices: [
         "Parsing pom.xml dependencies...", "Tracing gRPC calls in payment-service", "Detected SQL Injection vulnerability in query builder", "Mapping Kafka topic topology...", "Spring Boot actuator endpoint exposed publically"
      ],
      frontend: [
         "Analyzing package.json for vulnerable deps...", "React Hook dependency check...", "XSS vector found in SearchComponent.tsx", "Scanning verified API calls to /v1/auth", "Redux state flow mapped"
      ],
      data: [
         "Parsing Jupyter Notebook cells...", "Analyzing SQL strictly for PII exposure", "Python pickling vulnerability detected", "BigQuery IAM policy validation...", "ETL pipeline mapped: Airflow -> Snowflake"
      ]
   },
   CIAM_ATTESTATION: {
      mainframe: [
         "Parsing RACF profile definitions for 'PAYROLL'...", "Verifying CICS transaction auth check 'EZACIC01'...", "Validating Top Secret (TSS) permission bits...", "Checking COBOL 'CALL' statements for AuthZ wrapper...", "Auditing JCL user impersonation privileges..."
      ],
      microservices: [
         "Validating JWT signature verification in Gateway...", "Checking OAuth2 scope enforcement in 'PaymentController'...", "Verifying OIDC discovery endpoint reachability...", "Auditing @PreAuthorize annotations in Spring Security...", "Detecting missing role checks in gRPC interceptors..."
      ],
      frontend: [
         "Checking storage of Access Tokens in localStorage...", "Verifying 'SameSite' attribute on Session Cookies...", "Analyzing login form for CSRF protection...", "Validating MFA challenge UI flow...", "Checking for sensitive data in Redux logger..."
      ],
      data: [
         "Scanning BigQuery IAM for public access...", "Verifying Column-Level Security on PII fields...", "Checking Service Account key rotation age...", "Auditing access logs for 'admin' user patterns...", "Validating Row-Level Security policies..."
      ]
   },
   SECRET_SCANNING: {
      mainframe: [
         "Entropy scan on JCL PARM fields...", "Checking COBOL literals for password patterns...", "Scanning VSAM dataset names for sensitive keywords...", "Analyzing DB2 connection strings in source...", "Checking FTP scripts for cleartext credentials..."
      ],
      microservices: [
         "Scanning 'application.yml' for AWS Keys...", "Checking environment variable defaults in Dockerfile...", "Detecting private keys in test resource folders...", "Scanning commit history for removed secrets...", "Verifying hardcoded API tokens in unit tests..."
      ],
      frontend: [
         "Scanning bundle.js for exposed API keys...", "Checking .env.example for real values...", "Detecting AWS Cognito secrets in client code...", "Scanning hardcoded Bearer tokens in fetch() calls...", "Checking for Google Maps API keys without restrictions..."
      ],
      data: [
         "Scanning SQL dumps for inserted passwords...", "Checking Jupyter notebooks for connection strings...", "Scanning airflow DAGs for variable leakage...", "Detecting S3 bucket credentials in scripts...", "Checking unencrypted connection URIs..."
      ]
   }
};

const SwarmView: React.FC = () => {
   const [clusters, setClusters] = useState<SwarmCluster[]>(INITIAL_CLUSTERS);
   const [isRunning, setIsRunning] = useState(false);
   const [selectedMission, setSelectedMission] = useState<MissionType>('GENERAL_AUDIT');
   const [globalThroughput, setGlobalThroughput] = useState(0); // Lines per second
   const [activeLogs, setActiveLogs] = useState<{ cluster: string, msg: string, time: string }[]>([]);
   const [throughputHistory, setThroughputHistory] = useState<{ time: number, value: number }[]>([]);

   // Simulation Loop
   useEffect(() => {
      let interval: ReturnType<typeof setInterval>;

      if (isRunning) {
         interval = setInterval(() => {

            // Update Clusters
            setClusters(prev => prev.map(c => {
               if (c.progress >= 100) return { ...c, status: 'completed', activeAgents: 0 };

               const speedFactor = c.id === 'c-1' ? 0.2 : 0.8; // Mainframe scans slower
               const newProgress = Math.min(100, c.progress + (Math.random() * 2 * speedFactor));
               const isScanning = newProgress < 100;

               return {
                  ...c,
                  status: isScanning ? 'scanning' : 'synthesizing',
                  activeAgents: isScanning ? Math.floor(c.repoCount * 0.4) : 0, // 40% concurrency
                  findings: c.findings + (Math.random() > 0.8 ? 1 : 0),
                  progress: newProgress
               };
            }));

            // Update Global Stats
            const currentSpeed = clusters.reduce((acc, c) => acc + (c.status === 'scanning' ? (c.id === 'c-1' ? 45000 : 120000) : 0), 0);
            setGlobalThroughput(prev => {
               const noise = (Math.random() - 0.5) * 10000;
               return Math.floor((prev * 0.8) + (currentSpeed * 0.2) + noise);
            });

            // Add history point
            setThroughputHistory(prev => {
               const newHistory = [...prev, { time: Date.now(), value: currentSpeed }];
               return newHistory.slice(-20); // Keep last 20 points
            });

            // Generate Logs based on Mission
            const activeClusters = clusters.filter(c => c.status === 'scanning');
            if (activeClusters.length > 0) {
               const randomCluster = activeClusters[Math.floor(Math.random() * activeClusters.length)];
               let logMsg = "";
               const logs = MOCK_LOGS_POOL[selectedMission];

               if (randomCluster.id === 'c-1') logMsg = logs.mainframe[Math.floor(Math.random() * logs.mainframe.length)];
               else if (randomCluster.id === 'c-2') logMsg = logs.microservices[Math.floor(Math.random() * logs.microservices.length)];
               else if (randomCluster.id === 'c-3') logMsg = logs.frontend[Math.floor(Math.random() * logs.frontend.length)];
               else logMsg = logs.data[Math.floor(Math.random() * logs.data.length)];

               setActiveLogs(prev => [{
                  cluster: randomCluster.name,
                  msg: logMsg,
                  time: new Date().toLocaleTimeString()
               }, ...prev].slice(0, 8));
            }

         }, 600);
      } else {
         setGlobalThroughput(0);
         setClusters(prev => prev.map(c => ({ ...c, activeAgents: 0 })));
      }

      return () => clearInterval(interval);
   }, [isRunning, selectedMission]);

   const handleStart = () => {
      setIsRunning(true);
   };

   const handleReset = () => {
      setIsRunning(false);
      setClusters(INITIAL_CLUSTERS.map(c => ({ ...c, progress: 0, findings: 0, status: 'idle' })));
      setActiveLogs([]);
      setThroughputHistory([]);
      setGlobalThroughput(0);
   };

   const totalAgents = clusters.reduce((acc, c) => acc + c.activeAgents, 0);
   const totalRepos = clusters.reduce((acc, c) => acc + c.repoCount, 0);
   const totalFindings = clusters.reduce((acc, c) => acc + c.findings, 0);
   const MissionIcon = MISSIONS[selectedMission].icon;

   return (
      <div className="flex-1 overflow-y-auto bg-endava-dark p-6 flex flex-col h-screen">

         {/* Header / Control Plane */}
         <header className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
            <div>
               <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-6 h-6 text-endava-blue-60" />
                  Swarm Intelligence <span className="text-endava-blue-40 text-sm font-normal font-mono">| GLOBAL_ORCHESTRATOR</span>
               </h1>
               <p className="text-endava-blue-30 mt-1 text-sm">
                  Massive-scale Map-Reduce architecture for analyzing heterogeneous repositories.
               </p>
            </div>

            <div className="flex items-center space-x-6">
               {/* Mission Selector */}
               <div className="relative group">
                  <button disabled={isRunning} className={`flex items-center space-x-3 bg-endava-blue-90 border ${isRunning ? 'border-white/5 opacity-50 cursor-not-allowed' : 'border-white/10 hover:border-endava-orange'} rounded-lg px-4 py-2 transition-all min-w-[260px]`}>
                     <div className={`p-1.5 rounded bg-${MISSIONS[selectedMission].color}/10 text-${MISSIONS[selectedMission].color}`}>
                        <MissionIcon className="w-4 h-4" />
                     </div>
                     <div className="text-left flex-1">
                        <div className="text-[10px] text-endava-blue-50 uppercase font-bold tracking-wider">Mission Profile</div>
                        <div className="text-sm font-bold text-white">{MISSIONS[selectedMission].label}</div>
                     </div>
                     <ChevronDown className="w-4 h-4 text-endava-blue-40" />
                  </button>

                  {/* Dropdown */}
                  {!isRunning && (
                     <div className="absolute top-full right-0 pt-2 w-80 hidden group-hover:block z-50">
                        <div className="bg-endava-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden mt-0">
                           {Object.entries(MISSIONS).map(([key, config]) => {
                              const MIcon = config.icon;
                              return (
                                 <button
                                    key={key}
                                    onClick={() => setSelectedMission(key as MissionType)}
                                    className={`w-full text-left p-4 hover:bg-white/5 transition-colors flex items-start space-x-3 ${selectedMission === key ? 'bg-white/10' : ''}`}
                                 >
                                    <div className={`p-2 rounded bg-${config.color}/10 text-${config.color} mt-0.5`}>
                                       <MIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                       <div className={`text-sm font-bold ${selectedMission === key ? 'text-white' : 'text-endava-blue-20'}`}>{config.label}</div>
                                       <div className="text-xs text-endava-blue-40 mt-1 leading-relaxed">{config.description}</div>
                                    </div>
                                 </button>
                              )
                           })}
                        </div>
                     </div>
                  )}
               </div>

               <div className="h-10 w-px bg-white/10"></div>

               <div className="text-right">
                  <div className="text-xs text-endava-blue-50 uppercase tracking-wider font-bold">Total Scope</div>
                  <div className="text-xl font-mono text-white">{totalRepos.toLocaleString()} Repos</div>
               </div>

               <div className="h-10 w-px bg-white/10"></div>

               {isRunning ? (
                  <button onClick={() => setIsRunning(false)} className="bg-red-500/10 text-endava-orange border border-red-500/50 hover:bg-red-500/20 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
                     <Pause className="w-4 h-4" /> <span>Halt Swarm</span>
                  </button>
               ) : (
                  <div className="flex space-x-2">
                     {totalFindings > 0 && (
                        <button onClick={handleReset} className="bg-endava-blue-90 text-endava-blue-40 border border-white/5 hover:text-white px-4 py-2 rounded-lg transition-all">
                           <RefreshCw className="w-4 h-4" />
                        </button>
                     )}
                     <button
                        onClick={handleStart}
                        className={`text-white shadow-lg px-6 py-2 rounded-lg flex items-center space-x-2 transition-all font-bold endava-gradient shadow-endava-orange/20`}
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
               <div className="bg-endava-blue-90 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                     <Zap className="w-24 h-24 text-endava-blue-60" />
                  </div>
                  <div className="flex justify-between items-end mb-4 relative z-10">
                     <div>
                        <h3 className="text-endava-blue-40 text-sm uppercase tracking-wider font-semibold">Global Processing Throughput</h3>
                        <div className="text-4xl font-mono font-bold text-white mt-2">
                           {(globalThroughput / 1000).toFixed(1)}k <span className="text-lg text-endava-blue-50">lines/sec</span>
                        </div>
                     </div>
                     <div className="h-16 w-48">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                           <AreaChart data={throughputHistory}>
                              <Area type="monotone" dataKey="value" stroke={selectedMission === 'CIAM_ATTESTATION' ? '#2196f3' : selectedMission === 'SECRET_SCANNING' ? '#ff5640' : '#497cf6'} fillOpacity={0.2} isAnimationActive={false} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-endava-dark rounded-full overflow-hidden">
                     <div
                        className={`h-full transition-all duration-300 bg-${MISSIONS[selectedMission].color}`}
                        style={{ width: `${(clusters.reduce((acc, c) => acc + c.progress, 0) / 4)}%` }}
                     ></div>
                  </div>
               </div>

               {/* Swarm Clusters */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  {clusters.map((cluster) => {
                     const isMainframe = cluster.techStack.includes('Mainframe');
                     const Icon = isMainframe ? Server : cluster.techStack.includes('Frontend') ? Layers : cluster.techStack.includes('Data') ? Database : Globe;
                     const color = isMainframe ? 'endava-orange' : cluster.techStack.includes('Frontend') ? 'endava-blue-60' : cluster.techStack.includes('Data') ? 'endava-blue-50' : 'endava-blue-40';

                     // Tailwind dynamic classes workaround
                     const borderClass = cluster.status === 'scanning' ? `border-${color}/50` : 'border-white/10';
                     const bgClass = cluster.status === 'scanning' ? `bg-${color}/5` : 'bg-endava-blue-90';
                     const textClass = `text-${color}`;
                     const ringClass = cluster.status === 'scanning' ? `ring-1 ring-${color}/30` : '';

                     return (
                        <div key={cluster.id} className={`${bgClass} border ${borderClass} ${ringClass} rounded-xl p-5 transition-all duration-300 relative overflow-hidden group`}>

                           {/* Header */}
                           <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center space-x-3">
                                 <div className={`p-2 rounded-lg bg-endava-dark border border-white/5 ${textClass}`}>
                                    <Icon className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-white">{cluster.name}</h3>
                                    <div className="text-xs text-endava-blue-40 font-mono">{cluster.techStack}</div>
                                 </div>
                              </div>
                              <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold border bg-endava-dark ${textClass} border-white/5`}>
                                 {cluster.status}
                              </div>
                           </div>

                           {/* Metrics Grid */}
                           <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-endava-dark/50 p-2 rounded border border-white/5">
                                 <div className="text-[10px] text-endava-blue-50 uppercase">Scale</div>
                                 <div className="text-sm font-mono text-white">{cluster.repoCount} Repos</div>
                              </div>
                              <div className="bg-endava-dark/50 p-2 rounded border border-white/5">
                                 <div className="text-[10px] text-endava-blue-50 uppercase">Volume</div>
                                 <div className="text-sm font-mono text-white">{cluster.linesOfCode} LOC</div>
                              </div>
                              <div className="bg-endava-dark/50 p-2 rounded border border-white/5">
                                 <div className="text-[10px] text-endava-blue-50 uppercase">Workers</div>
                                 <div className={`text-sm font-mono ${cluster.status === 'scanning' ? 'text-white' : 'text-endava-blue-40'}`}>
                                    {cluster.activeAgents} <span className="text-[10px] text-endava-blue-50">active</span>
                                 </div>
                              </div>
                              <div className="bg-endava-dark/50 p-2 rounded border border-white/5">
                                 <div className="text-[10px] text-endava-blue-50 uppercase">Findings</div>
                                 <div className="text-sm font-mono text-endava-orange">{cluster.findings}</div>
                              </div>
                           </div>

                           {/* Mini Visualization of "Nodes" */}
                           <div className="h-16 w-full flex flex-wrap gap-0.5 content-start overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity">
                              {Array.from({ length: 120 }).map((_, i) => (
                                 <div
                                    key={i}
                                    className={`w-1 h-1 rounded-full transition-all duration-500 ${i < (cluster.progress * 1.2)
                                       ? (Math.random() > 0.9 ? 'bg-endava-orange' : `bg-${color}`)
                                       : 'bg-white/10'
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
            <div className="col-span-12 lg:col-span-4 flex flex-col bg-endava-blue-90 border border-white/10 rounded-xl overflow-hidden">
               <div className="p-4 border-b border-white/5 bg-endava-dark/30 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                     <Terminal className="w-4 h-4 text-endava-blue-40" />
                     <h3 className="text-sm font-bold text-white">Global Event Stream</h3>
                  </div>
                  <div className="flex items-center space-x-1.5">
                     <div className="w-2 h-2 rounded-full bg-endava-orange animate-pulse"></div>
                     <span className="text-xs text-endava-blue-50 font-mono">LIVE</span>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs bg-endava-dark/80">
                  {activeLogs.length === 0 && (
                     <div className="text-endava-blue-50 italic text-center mt-10">
                        Swarm is idle. <br /> Deploy to start stream.
                     </div>
                  )}
                  {activeLogs.map((log, idx) => (
                     <div key={idx} className="animate-in fade-in slide-in-from-right-4 duration-300 border-l-2 border-white/10 pl-3 py-1">
                        <div className="flex justify-between text-endava-blue-40 mb-0.5">
                           <span>{log.cluster}</span>
                           <span>{log.time}</span>
                        </div>
                        <div className={`leading-relaxed ${log.msg.includes('vulnerability') || log.msg.includes('XSS') || log.msg.includes('Injection')
                           ? 'text-endava-orange'
                           : 'text-endava-blue-20'
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
