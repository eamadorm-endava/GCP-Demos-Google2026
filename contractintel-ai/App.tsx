import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ContractAnalysis } from './components/ContractAnalysis';
import { ContractList } from './components/ContractList';
import { ContractDetail } from './components/ContractDetail';
import { AnalyzedContract } from './types';

// Mock initial data based on PDF charts
const INITIAL_DATA: AnalyzedContract[] = [
  {
    id: '1',
    title: 'Master Service Agreement - TechCorp',
    type: 'Service Agreement',
    parties: ['Endava', 'TechCorp Inc.'],
    effectiveDate: '2023-01-15',
    expirationDate: '2024-01-15',
    riskScore: 3,
    riskLevel: 'Low',
    summary: 'Standard MSA with standard indemnification clauses.',
    missingClauses: [],
    flaggedTerms: [],
    governingLaw: 'New York',
    status: 'Active'
  },
  {
    id: '2',
    title: 'Vendor Agreement - CloudServices',
    type: 'Software License',
    parties: ['Endava', 'CloudServices Ltd.'],
    effectiveDate: '2023-03-01',
    expirationDate: '2025-03-01',
    riskScore: 8,
    riskLevel: 'High',
    summary: 'Missing critical auto-renewal opt-out clause. Liability cap is ambiguous.',
    missingClauses: ['Auto-renewal Opt-out', 'Data Breach Notification'],
    flaggedTerms: ['Unlimited Indemnity'],
    governingLaw: 'England and Wales',
    status: 'Review Required'
  },
  {
    id: '3',
    title: 'Consulting Arrangement - FinServe',
    type: 'Services',
    parties: ['Endava', 'FinServe Global'],
    effectiveDate: '2023-06-10',
    expirationDate: '2023-12-31',
    riskScore: 6,
    riskLevel: 'Medium',
    summary: 'Non-standard payment terms detected.',
    missingClauses: ['GDPR Compliance'],
    flaggedTerms: ['Net 90 Payment'],
    governingLaw: 'Delaware',
    status: 'Active'
  },
  {
    id: '4',
    title: 'Legacy Software License',
    type: 'Software License',
    parties: ['Endava', 'LegacySoft'],
    effectiveDate: '2020-01-01',
    expirationDate: '2025-01-01',
    riskScore: 7,
    riskLevel: 'High',
    summary: 'Old contract template used. References outdated regulations.',
    missingClauses: ['Modern Security Standards'],
    flaggedTerms: ['LIBOR Reference'],
    governingLaw: 'New York',
    status: 'Review Required'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'analysis' | 'list' | 'detail'>('dashboard');
  const [contracts, setContracts] = useState<AnalyzedContract[]>(INITIAL_DATA);
  const [selectedContract, setSelectedContract] = useState<AnalyzedContract | null>(null);

  const handleAnalysisComplete = (newContract: AnalyzedContract) => {
    setContracts(prev => [newContract, ...prev]);
    setSelectedContract(newContract);
    setCurrentView('detail');
  };

  const handleContractSelect = (contract: AnalyzedContract) => {
    setSelectedContract(contract);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setSelectedContract(null);
    setCurrentView('list');
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'dashboard' && <Dashboard contracts={contracts} />}
      {currentView === 'analysis' && <ContractAnalysis onAnalysisComplete={handleAnalysisComplete} />}
      {currentView === 'list' && <ContractList contracts={contracts} onContractSelect={handleContractSelect} />}
      {currentView === 'detail' && selectedContract && (
        <ContractDetail contract={selectedContract} onBack={handleBackToList} />
      )}
    </Layout>
  );
};

export default App;