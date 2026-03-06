
import React from 'react';
import { SequenceStep } from '../types';
import { Server, Smartphone, Globe, Database, ShieldCheck, ArrowDown } from 'lucide-react';

interface SequenceDiagramProps {
  steps: SequenceStep[];
}

const SequenceDiagram: React.FC<SequenceDiagramProps> = ({ steps }) => {
  // Define systems (columns)
  const systems = [
    { id: 'user', label: 'User / App', icon: Smartphone },
    { id: 'gateway', label: 'API Gateway', icon: Globe },
    { id: 'auth', label: 'CIAM / Auth', icon: ShieldCheck },
    { id: 'backend', label: 'Core / DB', icon: Server },
  ];

  const getSystemX = (systemId: string) => {
    const idx = systems.findIndex(s => s.id === systemId);
    // Dynamic spacing based on count to fit better, but fixed for predictability
    return 80 + (idx * 200);
  };

  const getSystemFromLabel = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('user') || l.includes('app') || l.includes('mobile')) return 'user';
    if (l.includes('gateway') || l.includes('api')) return 'gateway';
    if (l.includes('auth') || l.includes('ciam') || l.includes('token')) return 'auth';
    return 'backend';
  };

  return (
    <div className="w-full h-full overflow-auto bg-endava-dark rounded-lg border border-white/5 p-6 relative">
      <div className="min-w-[750px] min-h-[550px] relative mx-auto pt-10">

        {/* Render Columns/Lifelines */}
        {systems.map(sys => {
          const x = getSystemX(sys.id);
          return (
            <div key={sys.id} className="absolute top-10 bottom-0 flex flex-col items-center" style={{ left: x - 40, width: 80 }}>
              {/* Header Icon */}
              <div className="p-3 bg-endava-blue-90 rounded-xl border border-white/10 flex flex-col items-center z-10 mb-4 shadow-xl ring-1 ring-white/5">
                <sys.icon className="w-6 h-6 text-endava-orange mb-1.5" />
                <span className="text-[10px] font-bold text-endava-blue-40 uppercase whitespace-nowrap tracking-wide">{sys.label}</span>
              </div>
              {/* Vertical Lifeline */}
              <div className="flex-1 w-0.5 bg-gradient-to-b from-white/10 via-white/5 to-transparent border-l border-dashed border-white/20"></div>
            </div>
          )
        })}

        {/* Render Steps */}
        <div className="absolute top-40 left-0 right-0">
          {steps.map((step, index) => {
            const fromSys = getSystemFromLabel(step.from);
            const toSys = getSystemFromLabel(step.to);
            const x1 = getSystemX(fromSys);
            const x2 = getSystemX(toSys);
            const y = index * 70; // Increased spacing for clarity
            const isRight = x2 > x1;

            // Define styles based on status
            let statusColor = 'text-endava-blue-30 border-endava-blue-60/30 bg-endava-blue-60/10';
            let lineColor = 'bg-endava-blue-60';
            let arrowColor = 'border-endava-blue-60';

            if (step.status === 'success') {
              statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
              lineColor = 'bg-emerald-500';
              arrowColor = 'border-emerald-500';
            } else if (step.status === 'error') {
              statusColor = 'text-endava-orange border-endava-orange/30 bg-endava-orange/10';
              lineColor = 'bg-endava-orange';
              arrowColor = 'border-endava-orange';
            } else if (step.status === 'warning') {
              statusColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
              lineColor = 'bg-amber-500';
              arrowColor = 'border-amber-500';
            }

            return (
              <div key={step.id} className="absolute w-full animate-in fade-in slide-in-from-top-2 duration-500" style={{ top: y, height: 40, animationDelay: `${index * 100}ms` }}>
                <div className="relative h-full">
                  {/* Horizontal Line */}
                  <div
                    className={`absolute top-1/2 h-0.5 ${lineColor} opacity-40`}
                    style={{
                      left: Math.min(x1, x2),
                      width: Math.abs(x2 - x1),
                    }}
                  />

                  {/* Arrow Head */}
                  <div
                    className={`absolute top-1/2 -mt-1.5 w-3 h-3 border-t-2 border-r-2 ${arrowColor}`}
                    style={{
                      left: isRight ? x2 - 8 : x2 - 4,
                      transform: isRight ? 'rotate(45deg)' : 'rotate(225deg)'
                    }}
                  />

                  {/* Label Bubble */}
                  <div
                    className={`absolute top-1/2 -mt-8 transform -translate-x-1/2 text-xs font-mono px-3 py-1 rounded-full border ${statusColor} shadow-lg z-20 backdrop-blur-sm`}
                    style={{ left: (x1 + x2) / 2 }}
                  >
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <span className="font-semibold tracking-tight">{step.label}</span>
                      {step.status === 'error' && <span className="text-[9px] font-bold bg-endava-orange/20 px-1.5 rounded text-endava-orange">FAIL</span>}
                      {step.status === 'warning' && <span className="text-[9px] font-bold bg-amber-500/20 px-1.5 rounded text-amber-300">WARN</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default SequenceDiagram;
