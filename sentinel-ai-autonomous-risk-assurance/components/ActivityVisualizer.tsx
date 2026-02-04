import React, { useEffect, useState, useMemo } from 'react';
import { AgentStatus, AgentCapability } from '../types';
import { Globe, Server, Database, ShieldCheck, User, FileText, Lock, Cloud, Key, CreditCard, Activity, FileSearch, Scale, Smartphone, Code } from 'lucide-react';

interface ActivityVisualizerProps {
  status: AgentStatus;
  logsCount: number;
  capability: AgentCapability;
}

const ActivityVisualizer: React.FC<ActivityVisualizerProps> = ({ status, logsCount, capability }) => {
  const [activeNodes, setActiveNodes] = useState<number[]>([]);

  // Define topologies based on capability - Colors updated to Endava Palette (Orange/Grey/Dark)
  const topology = useMemo(() => {
    switch(capability) {
        case 'IAM_ASSURANCE':
            return [
                { id: 0, x: 50, y: 50, icon: Lock, label: 'Okta Identity Cloud', color: 'text-brand-primary', border: 'border-brand-primary' },
                { id: 1, x: 20, y: 20, icon: User, label: 'Workday HRIS', color: 'text-brand-primary', border: 'border-brand-primary' },
                { id: 2, x: 80, y: 20, icon: Server, label: 'Active Directory', color: 'text-slate-400', border: 'border-slate-500' },
                { id: 3, x: 20, y: 80, icon: Key, label: 'PAM Vault', color: 'text-brand-gray', border: 'border-brand-gray' },
                { id: 4, x: 80, y: 80, icon: Cloud, label: 'Salesforce CRM', color: 'text-slate-300', border: 'border-slate-400' },
                { id: 5, x: 50, y: 15, icon: ShieldCheck, label: 'Governance Engine', color: 'text-emerald-400', border: 'border-emerald-500' },
            ];
        case 'EVIDENCE_COLLECTION':
            return [
                { id: 0, x: 50, y: 50, icon: Database, label: 'Evidence Lake', color: 'text-brand-primary', border: 'border-brand-primary' },
                { id: 1, x: 20, y: 30, icon: Server, label: 'Prod Cluster A', color: 'text-slate-400', border: 'border-slate-500' },
                { id: 2, x: 20, y: 70, icon: Server, label: 'Prod Cluster B', color: 'text-slate-400', border: 'border-slate-500' },
                { id: 3, x: 80, y: 30, icon: FileText, label: 'Jira Ticketing', color: 'text-brand-primary', border: 'border-brand-primary' },
                { id: 4, x: 80, y: 70, icon: FileSearch, label: 'Splunk Logs', color: 'text-emerald-400', border: 'border-emerald-500' },
                { id: 5, x: 50, y: 85, icon: Scale, label: 'Blockchain Ledger', color: 'text-slate-200', border: 'border-slate-400' },
            ];
        case 'ANOMALY_DETECTION':
            return [
                 { id: 0, x: 50, y: 50, icon: Activity, label: 'Inference Engine', color: 'text-red-500', border: 'border-red-600' },
                 { id: 1, x: 20, y: 50, icon: Database, label: 'ERP Ledger', color: 'text-brand-primary', border: 'border-brand-primary' },
                 { id: 2, x: 80, y: 50, icon: Globe, label: 'Vendor Portal', color: 'text-brand-gray', border: 'border-brand-gray' },
                 { id: 3, x: 50, y: 20, icon: CreditCard, label: 'Swift Gateway', color: 'text-emerald-400', border: 'border-emerald-500' },
                 { id: 4, x: 30, y: 80, icon: User, label: 'Payroll Data', color: 'text-slate-400', border: 'border-slate-500' },
                 { id: 5, x: 70, y: 80, icon: FileSearch, label: 'Sanctions List', color: 'text-brand-gray', border: 'border-brand-gray' },
            ];
        case 'CIAM_ATTESTATION':
            return [
                 { id: 0, x: 50, y: 50, icon: Globe, label: 'API Gateway', color: 'text-brand-primary', border: 'border-brand-primary' },
                 { id: 1, x: 20, y: 30, icon: Smartphone, label: 'Client App', color: 'text-slate-300', border: 'border-slate-400' },
                 { id: 2, x: 80, y: 30, icon: ShieldCheck, label: 'Auth Service', color: 'text-brand-primary', border: 'border-brand-primary' },
                 { id: 3, x: 50, y: 80, icon: Server, label: 'Legacy Core', color: 'text-slate-500', border: 'border-slate-600' },
                 { id: 4, x: 20, y: 80, icon: Code, label: 'Source Repo', color: 'text-emerald-400', border: 'border-emerald-500' },
                 { id: 5, x: 80, y: 80, icon: Database, label: 'User Store', color: 'text-slate-400', border: 'border-slate-500' },
            ];
        default:
             return [
                { id: 0, x: 50, y: 50, icon: Server, label: 'Target System', color: 'text-slate-400', border: 'border-slate-500' },
                { id: 1, x: 20, y: 20, icon: FileText, label: 'Policy Doc', color: 'text-brand-primary', border: 'border-brand-primary' },
                { id: 2, x: 80, y: 20, icon: Database, label: 'Audit Store', color: 'text-emerald-400', border: 'border-emerald-500' },
                { id: 3, x: 20, y: 80, icon: User, label: 'Process Owner', color: 'text-slate-300', border: 'border-slate-400' },
                { id: 4, x: 80, y: 80, icon: ShieldCheck, label: 'Control Framework', color: 'text-brand-primary', border: 'border-brand-primary' },
            ];
    }
  }, [capability]);

  // Simulate scanning nodes based on log activity
  useEffect(() => {
    if (status === AgentStatus.EXECUTING) {
      const randomNode = Math.floor(Math.random() * topology.length);
      setActiveNodes(prev => [...prev.slice(-3), randomNode]);
    } else {
      setActiveNodes([]);
    }
  }, [logsCount, status, topology.length]);

  return (
    <div className="relative h-64 w-full bg-slate-900/50 rounded-lg overflow-hidden border-b border-slate-800 mb-4">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
      
      {/* Connecting Lines and Packets */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {/* CORREGIDO: Usar var() para parametrización real */}
            <stop offset="0%" stopColor="var(--color-brand-primary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--color-brand-primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-brand-primary)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {topology.slice(1).map((node, index) => {
            const center = topology[0];
            const isActive = activeNodes.includes(node.id) || activeNodes.includes(0);
            return (
              <g key={`link-${index}`}>
                <line 
                    x1={`${center.x}%`} 
                    y1={`${center.y}%`} 
                    x2={`${node.x}%`} 
                    y2={`${node.y}%`} 
                    stroke="url(#lineGradient)" 
                    strokeWidth="1" 
                    className="opacity-30" 
                />
                {status === AgentStatus.EXECUTING && isActive && (
                  <circle r="2" fill="#fff" className="animate-ping">
                    <animate 
                      attributeName="cx" 
                      from={`${center.x}%`} 
                      to={`${node.x}%`} 
                      dur={`${0.8 + Math.random() * 0.5}s`} 
                      repeatCount="indefinite"
                    />
                     <animate 
                      attributeName="cy" 
                      from={`${center.y}%`} 
                      to={`${node.y}%`} 
                      dur={`${0.8 + Math.random() * 0.5}s`} 
                      repeatCount="indefinite"
                    />
                    <animate attributeName="opacity" values="0;1;0" dur={`${0.8 + Math.random() * 0.5}s`} repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
        })}
      </svg>

      {/* Nodes */}
      {topology.map((node) => {
        const isActive = activeNodes.includes(node.id);
        const Icon = node.icon;
        return (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="relative group">
              {/* Ripple Effect when Active */}
              {isActive && (
                <div className={`absolute -inset-4 rounded-full ${node.color.replace('text-', 'bg-')}/20 animate-ping`}></div>
              )}
              
              {/* Icon Container */}
              <div className={`
                p-2 rounded-lg border backdrop-blur-sm transition-all duration-300 relative z-10
                ${isActive 
                  ? `bg-slate-800 ${node.border} ${node.color} shadow-[0_0_15px_rgba(255,85,64,0.5)] scale-110` 
                  : 'bg-slate-900/80 border-slate-800 text-slate-600'}
              `}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              <div className={`
                absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-slate-950/90 text-[10px] font-mono whitespace-nowrap border border-slate-800
                transition-opacity duration-300 z-10
                ${isActive ? `opacity-100 ${node.color}` : 'opacity-0 group-hover:opacity-100 text-slate-500'}
              `}>
                {node.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* Status Overlay */}
      {status === AgentStatus.EXECUTING && (
        <div className="absolute bottom-2 right-2 flex items-center space-x-2 bg-slate-900/80 px-3 py-1 rounded-full border border-brand-primary/30 z-20">
          <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
          <span className="text-[10px] text-brand-primary font-mono tracking-wider">LIVE MAPPING</span>
        </div>
      )}
    </div>
  );
};

export default ActivityVisualizer;