import React from 'react';
import { AnalyzedContract } from '../types';
import { AlertTriangle, CheckCircle, Clock, ChevronRight, FileText } from 'lucide-react';

interface ContractListProps {
  contracts: AnalyzedContract[];
  onContractSelect?: (contract: AnalyzedContract) => void;
}

export const ContractList: React.FC<ContractListProps> = ({ contracts, onContractSelect }) => {
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-[var(--color-brand-sc-negative)] border-[var(--color-brand-sc-negative)]';
      case 'Medium': return 'bg-yellow-100 text-[var(--color-brand-sc-warning)] border-[var(--color-brand-sc-warning)]';
      case 'Low': return 'bg-emerald-100 text-[var(--color-brand-sc-positive)] border-[var(--color-brand-sc-positive)]';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-brand-primary-300)]">Processed Contracts</h2>
        <p className="text-[var(--color-brand-sb-shade-30)] mt-1">
          Detailed list of all contracts analyzed by Gemini.
        </p>
      </div>

      <div className="bg-[var(--color-brand-sb-shade-30)] border border-[var(--color-brand-sb-shade-20)] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-brand-sb-shade-70)] text-[var(--color-brand-sb-shade-10)] font-medium border-b border-[var(--color-brand-sb-shade-60)]">
              <tr>
                <th className="px-6 py-4">Contract Name</th>
                <th className="px-6 py-4">Parties</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4">Missing Clauses</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map((contract) => (
                <React.Fragment key={contract.id}>
                  <tr 
                    onClick={() => onContractSelect?.(contract)}
                    className="hover:bg-slate-50 group transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[var(--color-brand-primary-200)] group-hover:text-[var(--color-brand-primary-50)] transition-colors">{contract.title}</div>
                      <div className="text-xs text-[var(--color-brand-sb-shade-90)] mt-1">{contract.effectiveDate} — {contract.expirationDate}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-[var(--color-brand-primary-200)]">
                      {contract.parties.join(', ')}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-brand-primary-200)]">
                      {contract.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(contract.riskLevel)}`}>
                        {contract.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {contract.missingClauses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {contract.missingClauses.slice(0, 2).map((clause, idx) => (
                             <span key={idx} className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                               {clause}
                             </span>
                          ))}
                          {contract.missingClauses.length > 2 && (
                            <span className="text-xs text-slate-400">+{contract.missingClauses.length - 2} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--color-brand-sc-positive-light)] flex items-center gap-1 text-xs">
                          <CheckCircle size={12} /> All Clear
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                        <div className="flex-1 w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${contract.riskScore > 7 ? 'bg-[var(--color-brand-sc-negative)]' : contract.riskScore > 4 ? 'bg-[var(--color-brand-sc-warning)]' : 'bg-[var(--color-brand-sc-positive)]'}`} 
                            style={{ width: `${contract.riskScore * 10}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{contract.riskScore}/10</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 text-slate-400 hover:text-secondary transition-colors">
                         <ChevronRight size={18} />
                       </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          {contracts.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No contracts yet</h3>
              <p className="text-slate-500 text-sm">Upload a contract to start the analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};