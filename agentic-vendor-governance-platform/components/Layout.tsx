
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

const EndavaLogo = () => (
  <svg width="36" height="36" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 55C25 45 5 40 10 20C15 0 45 0 50 20C55 35 50 45 45 55Z" fill="#FF5640" />
    <path d="M45 65C25 75 5 80 10 100C15 120 45 120 50 100C55 85 50 75 45 65Z" fill="#FF5640" />
    <path d="M65 60C75 40 100 35 110 50C120 65 115 95 95 95C75 95 70 75 65 60Z" fill="#FF5640" />
  </svg>
);

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
    <div className="flex h-screen bg-endava-dark overflow-hidden font-sans text-white">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-endava-blue-90 border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EndavaLogo />
            <span className="font-semibold text-white text-lg leading-tight tracking-tight">Agentic Governance</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-endava-blue-40 hover:bg-endava-blue-90/5 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          <p className="px-4 text-[10px] font-semibold text-endava-blue-40 uppercase tracking-widest mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? 'bg-endava-orange text-white font-medium'
                  : 'text-endava-blue-30 hover:bg-endava-blue-80 hover:text-white'}
              `}
            >
              <span className="shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
              <span className="text-sm tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <NavLink
            to="/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group
              ${isActive ? 'bg-endava-orange text-white' : 'text-endava-blue-30 hover:bg-endava-blue-80 hover:text-white'}
            `}
          >
            <span className="shrink-0 transition-transform group-hover:scale-110"><Settings size={20} /></span>
            Settings
          </NavLink>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-endava-blue-30 hover:text-white hover:bg-endava-orange/80 hover:scale-105 hover:shadow-xl hover:shadow-endava-orange/20 rounded-xl transition-all duration-200 text-sm font-medium group">
            <span className="shrink-0 transition-transform group-hover:scale-110"><LogOut size={20} /></span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-endava-dark/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 text-endava-blue-40 hover:bg-endava-blue-90/5 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-4 text-endava-blue-40">
              <span className="text-xs font-semibold text-endava-orange bg-endava-orange/10 px-2 py-1 rounded uppercase tracking-widest">Enterprise</span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2.5 text-endava-blue-40 hover:bg-endava-blue-90/5 rounded-full transition-all group">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-endava-orange rounded-full border-2 border-endava-dark group-hover:scale-125 transition-transform"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-white leading-none">Vignesh S.</p>
                <p className="text-[10px] font-medium text-endava-blue-40 mt-1 uppercase tracking-wider">Procurement Ops</p>
              </div>
              <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-endava-blue-80 overflow-hidden ring-2 ring-endava-blue-70 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                <img src="https://picsum.photos/seed/vignesh/100/100" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-10 scroll-smooth bg-endava-dark custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
          {/* Mobile Bottom Spacer */}
          <div className="h-20 lg:hidden"></div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-endava-blue-90/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex justify-between items-center z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 transition-colors
                ${isActive ? 'text-endava-orange' : 'text-endava-blue-40'}
              `}
            >
              {item.icon}
              <span className="text-[10px] font-medium uppercase tracking-tight">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button className="flex flex-col items-center gap-1 text-endava-blue-40">
            <User size={20} />
            <span className="text-[10px] font-medium uppercase tracking-tight">Profile</span>
          </button>
        </nav>
      </main>
    </div>
  );
};

export default Layout;
