import React from 'react';
import { AuditResult, Control, Risk } from '../types';
import { X, Printer, Download, ShieldCheck, AlertTriangle, Terminal, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AuditResult;
  risk: Risk;
  control: Control;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, result, risk, control }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-endava-dark/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white text-endava-dark rounded-lg max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header - Looks like a formal document */}
        <div className="bg-endava-blue-90 border-b border-white/10 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-900 mb-2">
              <img src="/endava-logo.svg" alt="Endava Logo" className="w-6 h-6 object-contain" />
              <span className="font-serif font-bold text-xl tracking-tight text-endava-orange">SENTINEL ASSURANCE</span>
            </div>
            <h2 className="text-sm font-semibold text-endava-blue-60 uppercase tracking-widest">Internal Audit Memorandum</h2>
          </div>
          <button onClick={onClose} className="text-endava-blue-40 hover:text-endava-blue-60">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-8 font-serif leading-relaxed">

          {/* Meta Data Table */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm font-sans">
            <div className="p-3 bg-endava-blue-90 rounded border border-white/5">
              <div className="text-endava-blue-50 text-xs uppercase mb-1">Target Control</div>
              <div className="font-semibold text-white">{control.name}</div>
            </div>
            <div className="p-3 bg-endava-blue-90 rounded border border-white/5">
              <div className="text-endava-blue-50 text-xs uppercase mb-1">Risk Category</div>
              <div className="font-semibold text-white">{risk.category}</div>
            </div>
            <div className="p-3 bg-endava-blue-90 rounded border border-white/5">
              <div className="text-endava-blue-50 text-xs uppercase mb-1">Audit Date</div>
              <div className="font-semibold text-white">{new Date().toLocaleDateString()}</div>
            </div>
            <div className="p-3 bg-endava-blue-90 rounded border border-white/5">
              <div className="text-endava-blue-50 text-xs uppercase mb-1">Verification Status</div>
              <div className={`font-bold ${result.effective ? 'text-emerald-700' : 'text-red-700'}`}>
                {result.effective ? 'EFFECTIVE' : 'INEFFECTIVE / DEFICIENCY'}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-2 border-b border-white/10 pb-1">Executive Summary</h3>
              <p className="text-slate-700">{result.summary}</p>
            </section>

            {result.gaps && result.gaps.length > 0 && (
              <section className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Identified Gaps
                </h3>
                <ul className="list-disc list-inside space-y-1 text-red-900">
                  {result.gaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-2 border-b border-white/10 pb-1">Recommendations</h3>
              <ul className="list-decimal list-inside space-y-2 text-slate-700">
                {result.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-2 border-b border-white/10 pb-1">Testing Methodology</h3>
              <p className="text-endava-blue-60 text-sm">
                This verification was conducted using Autonomous AI Agents performing 100% population testing against the target dataset.
                Scenario executed: <span className="font-mono text-white bg-endava-dark px-1 rounded">{result.scenario || 'STANDARD_PROTOCOL'}</span>.
                Evidence has been cryptographically hashed and stored in the immutable audit ledger.
              </p>
            </section>

            {/* Detailed Execution Logs / Audit Trail */}
            <section className="mt-8 pt-4 border-t-2 border-white/5">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Terminal className="w-5 h-5 mr-2 text-endava-blue-50" />
                Detailed Execution Audit Trail
              </h3>
              <div className="bg-endava-blue-90 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                {result.executionLogs && result.executionLogs.length > 0 ? (
                  <div className="space-y-2">
                    {result.executionLogs.map((log, index) => (
                      <div key={index} className="flex space-x-3 border-b border-white/5 pb-2 last:border-0">
                        <div className="text-endava-blue-50 shrink-0 w-20">{log.timestamp}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${log.status === 'error' ? 'text-endava-orange' :
                              log.status === 'warning' ? 'text-yellow-500' :
                                'text-emerald-500'
                              }`}>
                              {log.action}
                            </span>
                          </div>
                          <div className="text-endava-blue-40 mt-0.5">{log.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-endava-blue-50 italic">No execution logs available for this audit run.</div>
                )}
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center">
            <div className="font-script text-3xl text-endava-blue-40 mb-2">Sentinel AI</div>
            <div className="text-xs text-endava-blue-40 uppercase tracking-widest">Digitally Signed by Autonomous Agent</div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-endava-blue-90 border-t border-white/10 p-4 flex justify-between items-center">
          <div className="text-xs text-endava-blue-40">Ref: {result.scenario}-{Date.now()}</div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-endava-blue-60 hover:bg-white/10 rounded-lg transition-colors text-sm font-medium border border-transparent">
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-endava-dark hover:bg-endava-orange text-white rounded-lg transition-colors text-sm font-medium shadow-lg">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
