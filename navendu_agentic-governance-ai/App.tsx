import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FinanceHub from './components/FinanceHub';
import MeetingHub from './components/MeetingHub';
import Settings from './components/Settings';
import VendorDetail from './components/VendorDetail';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendor/:id" element={<VendorDetail />} />
          <Route path="/finance" element={<FinanceHub />} />
          <Route path="/hub" element={<MeetingHub />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;