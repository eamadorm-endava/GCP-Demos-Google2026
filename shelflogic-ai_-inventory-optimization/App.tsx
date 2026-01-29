

import React, { useEffect } from 'react';
import { STORE_DUBUQUE } from './constants';
import { useStore } from './store/useStore';

// Layout & View Components
import { MainLayout } from './components/MainLayout';
import { AuthView } from './components/AuthView';
import { HQDashboard } from './components/HQDashboard';
import { StoreDashboard } from './components/StoreDashboard';
import { AnalysisView } from './components/AnalysisView';
import { MLSimulationView } from './components/MLSimulationView';
import { StoreListView } from './components/StoreListView';
import { StoreDetailView } from './components/StoreDetailView';
import { ShelfVisionView } from './components/ShelfVisionView';
import AdminView from './components/AdminView';
import QuickPitch from './components/QuickPitch';
import { theme } from './theme';

const App: React.FC = () => {
  // Get all state and actions from the centralized store
  const { 
    user, 
    currentView, 
    isAdminOpen, 
    setAdminOpen,
    isQuickPitchOpen,
    getSelectedOpportunity,
    getSelectedStore,
    login
  } = useStore();

  // Hidden Keyboard Shortcut for Admin Panel (Control + M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'm') {
        setAdminOpen(!isAdminOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminOpen, setAdminOpen]);

  // --- Render Views based on state ---
  const renderCurrentView = () => {
    if (!user) return null;

    switch (currentView) {
      case 'dashboard':
        return user.role !== 'STORE' ? <HQDashboard /> : <StoreDashboard store={STORE_DUBUQUE} />;
      
      case 'analysis':
        const opp = getSelectedOpportunity();
        return opp ? <AnalysisView opportunity={opp} /> : <div>Opportunity not found.</div>;
      
      case 'stores':
        return <StoreListView />;
        
      case 'store_detail':
        const store = getSelectedStore();
        return store ? <StoreDetailView store={store} /> : <div>Store not found.</div>;
      
      case 'shelf_vision':
        return <ShelfVisionView />;
      
      case 'ml_lab':
        return <MLSimulationView />;
      
      default:
        return <div>Unknown view.</div>;
    }
  };

  if (!user) {
    // FIX: Pass the login action to the AuthView component to handle user login.
    return <AuthView onLogin={login} />;
  }

  return (
    <div className={`min-h-screen ${theme.colors.background.main} ${theme.colors.text.primary} font-sans overflow-hidden`}>
      {isAdminOpen && <AdminView />}
      {isQuickPitchOpen && <QuickPitch />}

      <MainLayout>
        {renderCurrentView()}
      </MainLayout>
    </div>
  );
};

export default App;