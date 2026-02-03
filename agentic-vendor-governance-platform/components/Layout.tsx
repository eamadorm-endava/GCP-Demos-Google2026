
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Settings, 
  Bell, 
  ShieldCheck, 
  Menu, 
  X,
  User,
  Users,
  LogOut
} from 'lucide-react';
import { VENDORS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine the first vendor alphabetically for the sidebar link
  const firstVendorId = [...VENDORS].sort((a, b) => a.name.localeCompare(b.name))[0]?.id || 'v1';

  const navItems = [
    { to: "/", icon: <LayoutDashboard size={20} />, label: "Command Center" },
    { to: "/finance", icon: <ShieldCheck size={20} />, label: "Financial Audit" },
    { to: `/vendor/${firstVendorId}`, icon: <Users size={20} />, label: "Vendor Profiles" },
    { to: "/hub", icon: <CalendarRange size={20} />, label: "Meeting Hub" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-[color:var(--color-brand-600)] ring-2 ring-[color:var(--color-brand-200)]">A</div>
            <span className="font-black text-slate-800 text-lg leading-tight tracking-tight">Agentic Governance</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-[color:var(--color-brand-600)] text-white shadow-xl shadow-brand-100 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <span className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="text-sm tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-1">
          <NavLink 
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors text-sm font-medium
              ${isActive ? 'bg-[color:var(--color-brand-600)] text-white' : 'text-slate-500 hover:bg-slate-50'}
            `}
          >
            <Settings size={20} />
            Settings
          </NavLink>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-4 text-slate-600">
              <span className="text-xs font-black text-[color:var(--color-brand-600)] bg-brand-50 px-2 py-1 rounded uppercase tracking-widest">Enterprise</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-all group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-600 rounded-full border-2 border-[color:var(--color-brand-50)] group-hover:scale-125 transition-transform"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-black text-slate-800 leading-none">Vignesh S.</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Procurement Ops</p>
              </div>
              <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <img src="https://picsum.photos/seed/vignesh/100/100" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
          {/* Mobile Bottom Spacer */}
          <div className="h-20 lg:hidden"></div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 px-6 py-3 flex justify-between items-center z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 transition-colors
                ${isActive ? 'text-[color:var(--color-brand-600)]' : 'text-slate-400'}
              `}
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button className="flex flex-col items-center gap-1 text-slate-400">
            <User size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tight">Profile</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default Layout;
