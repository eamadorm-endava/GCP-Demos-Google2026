import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PortfolioDashboard from './components/PortfolioDashboard';
import IntelligenceHub from './components/IntelligenceHub';
import SchedulePage from './components/SchedulePage';
import RiskPage from './components/RiskPage';
import DocumentsPage from './components/DocumentsPage';
import SettingsPage from './components/SettingsPage';
import { PROJECTS } from './services/mockData';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState(PROJECTS[0].id);
  const [viewMode, setViewMode] = useState<'portfolio' | 'project'>('portfolio');
  
  // Shared state for Risk Threshold
  const [riskConfidenceThreshold, setRiskConfidenceThreshold] = useState(70);
  
  // Find current project data based on ID, fallback to first if not found
  const currentProject = PROJECTS.find(p => p.id === currentProjectId) || PROJECTS[0];

  const handleProjectSelect = (id: string) => {
      setCurrentProjectId(id);
      setViewMode('project');
      setActiveTab('dashboard');
  };

  const renderContent = () => {
      if (viewMode === 'portfolio') {
          return <PortfolioDashboard onSelectProject={handleProjectSelect} />;
      }

      switch (activeTab) {
          case 'dashboard':
              return (
                <Dashboard 
                    key={currentProject.id} 
                    data={currentProject} 
                    riskThreshold={riskConfidenceThreshold}
                />
              );
          case 'intelligence':
              return (
                <div className="h-full p-4 lg:p-6">
                    <IntelligenceHub key={currentProject.id} projectData={currentProject} />
                </div>
              );
          case 'schedule':
              return <SchedulePage key={currentProject.id} data={currentProject} />;
          case 'risks':
              return (
                <RiskPage 
                    key={currentProject.id} 
                    data={currentProject} 
                    threshold={riskConfidenceThreshold}
                    setThreshold={setRiskConfidenceThreshold}
                />
              );
          case 'documents':
              return <DocumentsPage key={currentProject.id} data={currentProject} />;
          case 'settings':
              return <SettingsPage />;
          default:
              return (
                <Dashboard 
                    key={currentProject.id} 
                    data={currentProject}
                    riskThreshold={riskConfidenceThreshold} 
                />
              );
      }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentProjectId={currentProjectId}
        setCurrentProjectId={setCurrentProjectId}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden transition-all duration-300">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;