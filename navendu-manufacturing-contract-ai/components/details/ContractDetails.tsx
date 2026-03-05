
import React, { useState } from 'react';
import { Contract, RenewalReminderConfig } from '../../types.ts';
import { AI_Summary } from './AI_Summary.tsx';
import { AI_ExtractedData } from './AI_ExtractedData.tsx';
import { DocumentViewer } from './DocumentViewer.tsx';
import { DocumentViewer as DocumentIntelligenceViewer } from './DocumentIntelligenceViewer.tsx';
import { DueDiligenceChecklist } from './DueDiligenceChecklist.tsx';
import { KeyClauses } from './KeyClauses.tsx';
import { RenewalReminderSettings } from './RenewalReminderSettings.tsx';
import { BackIcon } from '../ui/Icons.tsx';
import { KeyClause } from '../../services/ai.ts';

interface ContractDetailsProps {
  contract: Contract;
  onBack: () => void;
  onUpdateContract?: (contract: Contract) => void;
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({ contract, onBack, onUpdateContract }) => {
  const [activeClause, setActiveClause] = useState<KeyClause | null>(null);
  const [showDocIntelligence, setShowDocIntelligence] = useState(false);

  const handleUpdateReminder = (reminderConfig: RenewalReminderConfig) => {
    if (onUpdateContract) {
      onUpdateContract({
        ...contract,
        renewalReminder: reminderConfig
      });
    }
  };

  return (
    <div className="space-y-6">
      {showDocIntelligence && (
        <DocumentIntelligenceViewer contract={contract} onClose={() => setShowDocIntelligence(false)} />
      )}
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-brand-text bg-brand-accent hover:bg-brand-light hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-highlight transition-colors duration-200">
          <BackIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDocIntelligence(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-highlight/10 border border-brand-highlight/30 text-brand-highlight text-sm font-semibold hover:bg-brand-highlight/20 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Document Intelligence
          </button>
          <div className="text-xs text-brand-light font-mono bg-brand-secondary/50 px-3 py-1 rounded border border-brand-accent/30">
            Ref ID: {contract.id}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Intel & Data */}
        <div className="lg:col-span-7 space-y-6">
          <AI_Summary contract={contract} />
          <AI_ExtractedData contract={contract} />
          <RenewalReminderSettings contract={contract} onUpdate={handleUpdateReminder} />
          <KeyClauses
            contract={contract}
            onClauseSelect={setActiveClause}
            selectedClause={activeClause}
          />
        </div>

        {/* Right Column: Checklist & Document */}
        <div className="lg:col-span-5 space-y-6 flex flex-col min-h-[600px]">
          <DueDiligenceChecklist contract={contract} />
          <DocumentViewer contract={contract} selectedClause={activeClause} />
        </div>
      </div>
    </div>
  );
};
