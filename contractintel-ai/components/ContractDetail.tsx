import React from 'react';
import { AnalyzedContract } from '../types';
import { ArrowLeft, AlertTriangle, CheckCircle, Shield, Calendar, Scale, Users, FileText, AlertCircle } from 'lucide-react';

interface ContractDetailProps {
  contract: AnalyzedContract;
  onBack: () => void;
}

export const ContractDetail: React.FC<ContractDetailProps> = ({ contract, onBack }) => {
  const isHighRisk = contract.riskLevel === 'High';
  const riskColor = isHighRisk ? 'text-red-600' : contract.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-emerald-600';
  const riskBg = isHighRisk ? 'bg-red-50' : contract.riskLevel === 'Medium' ? 'bg-yellow-50' : 'bg-emerald-50';
  const riskBorder = isHighRisk ? 'border-red-200' : contract.riskLevel === 'Medium' ? 'border-yellow-200' : 'border-emerald-200';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          aria-label="Back to list"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold text-[var(--color-brand-primary-300)]">{contract.title}</h1>
             <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
               contract.status === 'Active' ? 'bg-emerald-100 text-[var(--color-brand-sc-positive-light)] border-[var(--color-brand-sc-positive-light)]' : 'bg-amber-50 text-[var(--color-brand-sc-warning)] border-[var(--color-brand-sc-warning)]'
             }`}>
               {contract.status}
             </span>
          </div>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="font-mono text-xs text-[var(--color-brand-sb-shade-40)]">ID: {contract.id}</span>
          </p>
        </div>
        
        {/* Risk Score Badge */}
        <div className={`flex flex-col items-end px-4 py-2 rounded-lg border ${riskBorder} ${riskBg}`}>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Risk Score</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${riskColor}`}>{contract.riskScore}</span>
            <span className="text-slate-400 font-medium">/10</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary */}
          <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-[var(--color-brand-primary-300)]">
              <FileText className="text-[var(--color-brand-primary-50)]" size={20} />
              <h3 className="text-lg font-semibold">Executive Summary</h3>
            </div>
            <div className="prose prose-slate max-w-none text-[var(--color-brand-primary-300)] bg-[var(--color-brand-sb-shade-80)] p-4 rounded-lg border border-[var(--color-brand-sb-shade-70)]">
              {contract.summary}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm">
             <h3 className="text-lg font-semibold text-[var(--color-brand-primary-300)] mb-6">Contract Metadata</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-brand-sb-shade-30)]">Parties Involved</p>
                    <ul className="text-[var(--color-brand-sb-shade-10)] font-medium mt-1">
                      {contract.parties.map((party, i) => <li key={i}>{party}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Scale size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-brand-sb-shade-30)]">Governing Law</p>
                    <p className="text-[var(--color-brand-sb-shade-10)] font-medium mt-1">{contract.governingLaw}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-brand-sb-shade-30)]">Effective Dates</p>
                    <p className="text-[var(--color-brand-sb-shade-10)] font-medium mt-1">
                      {contract.effectiveDate || 'N/A'} — {contract.expirationDate || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-secondary flex-shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--color-brand-sb-shade-30)]">Contract Type</p>
                    <p className="text-[var(--color-brand-sb-shade-10)] font-medium mt-1">{contract.type}</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column - Risk Analysis */}
        <div className="space-y-6">
          
          {/* Missing Clauses */}
          <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="text-[var(--color-brand-sc-negative)]" size={20} />
              <h3 className="text-lg font-semibold text-[var(--color-brand-primary-300)]">Missing Clauses</h3>
            </div>
            
            {contract.missingClauses.length > 0 ? (
              <div className="space-y-3">
                {contract.missingClauses.map((clause, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="mt-0.5">
                      <AlertTriangle size={16} className="text-red-600" />
                    </div>
                    <span className="text-sm text-red-800 font-medium">{clause}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center bg-emerald-50 rounded-lg border border-emerald-100">
                <CheckCircle size={32} className="text-emerald-500 mb-2" />
                <p className="text-emerald-800 font-medium">All standard clauses present</p>
              </div>
            )}
          </div>

          {/* Flagged Terms */}
          <div className="bg-[var(--color-brand-sb-shade-90)] p-6 rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-[var(--color-brand-sc-warning)]" size={20} />
              <h3 className="text-lg font-semibold text-[var(--color-brand-primary-300)]">Flagged Terms</h3>
            </div>
            
            {contract.flaggedTerms.length > 0 ? (
              <div className="space-y-3">
                {contract.flaggedTerms.map((term, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="mt-0.5">
                      <AlertTriangle size={16} className="text-amber-600" />
                    </div>
                    <span className="text-sm text-amber-800 font-medium">{term}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-[var(--color-brand-sb-shade-40)] text-sm italic">
                No critical terms flagged for review.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};