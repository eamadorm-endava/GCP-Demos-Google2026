import "./index.css";
import React, { useState, useMemo, useCallback, useEffect } from 'react';
// FIX: Update import paths for consistency and add missing imports.
import { Header } from './components/Header';
import { ShipmentList } from '../components/ShipmentList';
import { ShipmentDetail } from '../components/ShipmentDetail';
import { NewOrderForm } from '../components/NewOrderForm';
import { NewFarmForm } from '../components/NewFarmForm';
import { Dashboard } from '../components/Dashboard';
import { Login } from './components/Login';
import { FarmManagement } from '../components/FarmManagement';
import type { Shipment, Message, Document, MilestoneStatus, ShipmentStatus, Milestone, User, Farm } from '../types';
import { INITIAL_SHIPMENTS, MILESTONE_KEYS, INITIAL_FARMS } from '../constants';
import { TruckIcon } from './components/icons';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { authenticateUser } from './auth';

// FIX: Add 'farms' to ActiveView to support farm management functionality.
type ActiveView = 'dashboard' | 'shipments' | 'farms';

const AppContent: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  // FIX: Rename state for clarity and add state for the new farm modal.
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState<boolean>(false);
  const [isNewFarmModalOpen, setIsNewFarmModalOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const { t } = useLanguage();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (username: string, password: string): void => {
    const user = authenticateUser(username, password);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
    } else {
      setLoginError(t('loginError'));
    }
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    setSelectedShipment(null);
    setActiveView('dashboard');
  };

  const handleSelectShipment = useCallback((shipmentId: string | null) => {
    if (shipmentId === null) {
      setSelectedShipment(null);
      return;
    }
    const shipment = shipments.find((s) => s.id === shipmentId);
    setSelectedShipment(shipment || null);
    if (activeView !== 'shipments') {
      setActiveView('shipments');
    }
  }, [shipments, activeView]);
  
  // FIX: Add handlers for farm status and document updates.
  const handleUpdateFarmStatus = (farmId: string, status: 'Approved' | 'Rejected') => {
      setFarms(prevFarms => prevFarms.map(f => f.id === farmId ? { ...f, status } : f));
  };
  
  const handleUpdateFarmDocumentStatus = (farmId: string, docName: string, uploaded: boolean) => {
    setFarms(prevFarms => prevFarms.map(farm => {
        if (farm.id === farmId) {
            const newDocs = { ...farm.registrationDocs };
            if (newDocs[docName]) {
                newDocs[docName] = { ...newDocs[docName], uploaded };
            }
            return { ...farm, registrationDocs: newDocs };
        }
        return farm;
    }));
  };

  // FIX: Add handler for registering a new farm.
  const handleRegisterFarm = (newFarm: Farm) => {
    setFarms(prevFarms => [newFarm, ...prevFarms]);
    setIsNewFarmModalOpen(false);
    setActiveView('farms');
  };

  const handleDashboardDrilldown = (status: string) => {
    setStatusFilter(status);
    setActiveView('shipments');
    setSelectedShipment(null);
  };
  
  const handleSelectShipmentAndDrilldown = (shipmentId: string) => {
    handleSelectShipment(shipmentId);
    setActiveView('shipments');
  };

  const handleAddShipment = (newShipmentData: Omit<Shipment, 'id' | 'milestones' | 'documents' | 'communication' | 'cost' | 'trackingUrl' | 'status' | 'attachedParties'>, selectedDocs: string[]) => {
    const newDocuments: Document[] = selectedDocs.map((docName, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: docName,
      url: '#',
      uploadedAt: new Date().toISOString().split('T')[0],
    }));
    
    const id = `SHP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const initialMilestones: Milestone[] = MILESTONE_KEYS.map((name, index) => ({
        name,
        status: index === 0 ? 'Completed' : 'Pending',
        date: index === 0 ? new Date().toISOString().split('T')[0] : null,
        documents: [],
    }));

    const selectedFarm = farms.find(f => f.id === newShipmentData.farmId);

    const shipment: Shipment = {
      ...newShipmentData,
      id: id,
      status: 'Pending',
      trackingUrl: `https://track.example.com/${id}`,
      cost: { freight: 1200, insurance: 150, customs: 350, total: 1700 },
      milestones: initialMilestones,
      documents: newDocuments,
      communication: [],
      attachedParties: [
          { name: selectedFarm?.contact.name || 'Farm Contact', role: 'Farmer' },
          { name: 'Carlos Rodriguez', role: 'Driver' },
          { name: 'Maria Garcia', role: 'Agent' },
          { name: newShipmentData.customer, role: 'Customer' },
      ],
    };
    setShipments([shipment, ...shipments]);
    setSelectedShipment(shipment);
    setActiveView('shipments');
    setIsNewShipmentModalOpen(false);
  };

  const calculateOverallStatus = (milestones: Milestone[]): ShipmentStatus => {
      if (milestones[milestones.length - 1].status === 'Completed') {
        return 'Delivered';
      }
      if (milestones.some(m => m.status === 'Delayed')) {
        return 'Delayed';
      }
      if (milestones.some(m => m.status === 'Requires Action')) {
        return 'Requires Action';
      }
      if (milestones.some(m => m.status === 'In Progress')) {
        return 'In Transit';
      }
      const allPendingOrComplete = milestones.every(m => m.status === 'Pending' || m.status === 'Completed');
      if (allPendingOrComplete) {
        const firstPendingIndex = milestones.findIndex(m => m.status === 'Pending');
        if (firstPendingIndex === -1) return 'Delivered';
        if (firstPendingIndex > 1) return 'In Transit'; 
        return 'Pending';
      }
      return 'In Transit';
  };

  const handleUpdateMilestone = (shipmentId: string, milestoneName: string, status: MilestoneStatus, details?: string) => {
    const updateShipmentState = (prevShipments: Shipment[]) =>
      prevShipments.map((shipment): Shipment => {
        if (shipment.id === shipmentId) {
          const newMilestones = shipment.milestones.map(m =>
            m.name === milestoneName 
            ? { ...m, status, date: status === 'Completed' ? new Date().toISOString().split('T')[0] : m.date, details: details ?? (status === 'In Progress' || status === 'Completed' ? undefined : m.details) } 
            : m
          );
          const overallStatus = calculateOverallStatus(newMilestones);
          return { ...shipment, milestones: newMilestones, status: overallStatus };
        }
        return shipment;
      });

    const updatedShipments = updateShipmentState(shipments);
    setShipments(updatedShipments);

    if (selectedShipment?.id === shipmentId) {
       const updatedSelectedShipment = updateShipmentState([selectedShipment])[0];
       setSelectedShipment(updatedSelectedShipment);
    }
  };

  const handleRealtimeUpdate = (shipmentId: string) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || shipment.status === 'Delivered' || shipment.status === 'Cancelled') return;
    const nextMilestoneIndex = shipment.milestones.findIndex(m => m.status === 'Pending' || m.status === 'In Progress' || m.status === 'Requires Action');
    if (nextMilestoneIndex !== -1) {
        const milestoneToUpdate = shipment.milestones[nextMilestoneIndex];
        let nextStatus: MilestoneStatus = 'In Progress';
        if (milestoneToUpdate.status === 'In Progress' || milestoneToUpdate.status === 'Requires Action') {
            nextStatus = 'Completed';
        }
        handleUpdateMilestone(shipmentId, milestoneToUpdate.name, nextStatus);
    }
  };
  
  const handleAddMessage = (shipmentId: string, message: Message) => {
    const updatedShipments = shipments.map(s => s.id === shipmentId ? { ...s, communication: [...s.communication, message] } : s);
    setShipments(updatedShipments);
    if(selectedShipment?.id === shipmentId) {
        setSelectedShipment(prev => prev ? {...prev, communication: [...prev.communication, message]} : null);
    }
  };

  const handleAddDocument = (shipmentId: string, document: Document) => {
    const updateShipmentState = (prevShipments: Shipment[]) => prevShipments.map(s => s.id === shipmentId ? { ...s, documents: [...s.documents, document] } : s);
    const updatedShipments = updateShipmentState(shipments);
    setShipments(updatedShipments);
    if (selectedShipment?.id === shipmentId) {
      setSelectedShipment(prev => prev ? { ...prev, documents: [...prev.documents, document] } : null);
    }
  };

  const handleCancelShipment = (shipmentId: string) => {
     const updateShipmentState = (prevShipments: Shipment[]) =>
      prevShipments.map((s): Shipment => s.id === shipmentId ? { ...s, status: 'Cancelled', milestones: s.milestones.map((m): Milestone => ({ ...m, status: m.status === 'Completed' ? 'Completed' : 'Cancelled' }))} : s);
    const updatedShipments = updateShipmentState(shipments);
    setShipments(updatedShipments);
    if (selectedShipment?.id === shipmentId) {
      setSelectedShipment(updateShipmentState([selectedShipment])[0]);
    }
  };

  const filteredShipments = useMemo(() => shipments
    .filter(shipment => statusFilter === 'All' || shipment.status === statusFilter)
    .filter(shipment => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        shipment.id.toLowerCase().includes(query) ||
        shipment.mawb.toLowerCase().includes(query) ||
        shipment.hawb.toLowerCase().includes(query) ||
        shipment.customer.toLowerCase().includes(query) ||
        shipment.origin.city.toLowerCase().includes(query) ||
        shipment.destination.city.toLowerCase().includes(query)
      );
    }), [shipments, statusFilter, searchQuery]);

  useEffect(() => {
    if (activeView === 'shipments' && !selectedShipment && filteredShipments.length > 0) {
        handleSelectShipment(filteredShipments[0].id);
    }
  }, [activeView, selectedShipment, filteredShipments, handleSelectShipment]);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        // FIX: Pass missing 'farms' and 'onNavigateToFarms' props to Dashboard.
        return <Dashboard user={currentUser!} shipments={shipments} farms={farms} onDrilldown={handleDashboardDrilldown} onSelectShipment={handleSelectShipmentAndDrilldown} onNavigateToFarms={(status) => setActiveView('farms')} />;
      // FIX: Add case for 'farms' view.
      case 'farms':
        return <FarmManagement user={currentUser!} farms={farms} onUpdateFarmStatus={handleUpdateFarmStatus} onUpdateFarmDocumentStatus={handleUpdateFarmDocumentStatus}/>;
      case 'shipments':
      default:
        return (
          <>
            <div className={`w-full lg:w-1/3 xl:w-1/4 border-r border-slate-200 overflow-y-auto bg-slate-50 ${selectedShipment ? 'hidden lg:block' : 'block'}`}>
              <ShipmentList shipments={filteredShipments} selectedShipmentId={selectedShipment?.id || null} onSelectShipment={handleSelectShipment} statusFilter={statusFilter} onFilterChange={setStatusFilter} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>
            <div className={`flex-1 overflow-y-auto bg-white ${selectedShipment ? 'block' : 'hidden lg:flex'}`}>
              {selectedShipment ? (
                <ShipmentDetail shipment={selectedShipment} farm={farms.find(f => f.id === selectedShipment.farmId)} currentUser={currentUser!} onUpdateMilestone={handleUpdateMilestone} onAddMessage={handleAddMessage} onAddDocument={handleAddDocument} onCancelShipment={handleCancelShipment} onRealtimeUpdate={handleRealtimeUpdate} onBack={() => handleSelectShipment(null)} />
              ) : (
                <div className="flex-col items-center justify-center h-full w-full text-slate-500 hidden lg:flex">
                  <TruckIcon className="w-16 h-16 mb-4 text-slate-400" />
                  <h2 className="text-xl font-semibold">{t('selectShipmentTitle')}</h2>
                  <p className="text-sm">{t('selectShipmentSubtitle')}</p>
                </div>
              )}
            </div>
          </>
        );
    }
  };
  
  if (!currentUser) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="h-screen w-full flex flex-col font-sans">
      <Header 
        user={currentUser} 
        onLogout={handleLogout} 
        onNewOrder={() => setIsNewShipmentModalOpen(true)} 
        onNewFarm={() => setIsNewFarmModalOpen(true)}
        activeView={activeView} 
        onNavigate={(view) => { setSelectedShipment(null); setActiveView(view); }} 
      />
      <main className="flex-1 flex overflow-hidden">
        {renderContent()}
      </main>
      {isNewShipmentModalOpen && (
        <NewOrderForm farms={farms.filter(f => f.status === 'Approved')} onClose={() => setIsNewShipmentModalOpen(false)} onAddShipment={handleAddShipment} />
      )}
      {isNewFarmModalOpen && (
        <NewFarmForm onClose={() => setIsNewFarmModalOpen(false)} onRegisterFarm={handleRegisterFarm} />
      )}
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
