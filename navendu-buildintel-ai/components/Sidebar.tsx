import React from 'react';
import { LayoutDashboard, MessageSquareText, FileText, Settings, BarChart3, AlertTriangle, LogOut, ChevronDown, Building2, LayoutGrid } from 'lucide-react';
import { PROJECTS } from '../services/mockData';

const EndavaLogo = () => (
  <img src="/assets/endava-logo.svg" alt="Endava Logo" className="w-7 h-7" />
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentProjectId: string;
  setCurrentProjectId: (id: string) => void;
  viewMode: 'portfolio' | 'project';
  setViewMode: (mode: 'portfolio' | 'project') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentProjectId, setCurrentProjectId, viewMode, setViewMode }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'intelligence', label: 'AI Intelligence', icon: MessageSquareText },
    { id: 'schedule', label: 'Schedule & RFIs', icon: BarChart3 },
    { id: 'risks', label: 'Risk Monitor', icon: AlertTriangle },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentProject = PROJECTS.find(p => p.id === currentProjectId) || PROJECTS[0];
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleProjectSelect = (projectId: string) => {
    setCurrentProjectId(projectId);
    setViewMode('project');
    setActiveTab('dashboard'); // Reset to dashboard when switching projects
    setIsDropdownOpen(false);
  };

  const handlePortfolioSelect = () => {
    setViewMode('portfolio');
    setActiveTab('dashboard');
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-20 lg:w-72 bg-endava-blue-90 border-r border-white/10 flex flex-col h-full flex-shrink-0 transition-all duration-300 relative z-20">
      {/* Brand Header */}
      <div
        className="p-6 flex items-center justify-center lg:justify-start space-x-3 border-b border-white/10 bg-endava-blue-90 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={handlePortfolioSelect}
      >
        <EndavaLogo />
        <h1 className="text-xl font-bold text-white tracking-tight hidden lg:block font-sans">BuildIntel</h1>
      </div>

      {/* Context Selector */}
      <div className="px-4 py-6 hidden lg:block">
        <p className="text-xs font-semibold text-endava-blue-40 mb-2 uppercase tracking-wider">
          {viewMode === 'portfolio' ? 'Portfolio View' : 'Active Project'}
        </p>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full border rounded-xl p-3 flex items-center justify-between transition-all ${viewMode === 'portfolio' ? 'bg-endava-blue-80 border-white/10' : 'bg-endava-blue-90 border-white/10 hover:border-endava-blue-50'}`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className={`p-1.5 rounded-lg ${viewMode === 'portfolio' ? 'bg-endava-orange text-white' : 'bg-endava-blue-80'}`}>
                {viewMode === 'portfolio' ? <LayoutGrid className="w-4 h-4" /> : <Building2 className="w-4 h-4 text-endava-orange" />}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-medium text-white truncate w-32">
                  {viewMode === 'portfolio' ? 'Global Portfolio' : currentProject.projectName}
                </p>
                <p className="text-[10px] text-endava-blue-30 truncate w-32">
                  {viewMode === 'portfolio' ? `${PROJECTS.length} Active Projects` : currentProject.location}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-endava-blue-40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-endava-blue-90 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
              <button
                onClick={handlePortfolioSelect}
                className={`w-full text-left px-4 py-3 text-sm flex items-center space-x-3 hover:bg-endava-blue-80 transition-colors ${viewMode === 'portfolio' ? 'bg-white/5 text-endava-orange' : 'text-endava-blue-30'}`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Global Portfolio</span>
              </button>
              <div className="h-px bg-white/10 my-1"></div>
              {PROJECTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleProjectSelect(p.id)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-endava-blue-80 transition-colors ${currentProjectId === p.id && viewMode === 'project' ? 'bg-white/5 text-white' : 'text-endava-blue-30'}`}
                >
                  <span className="truncate">{p.projectName}</span>
                  {currentProjectId === p.id && viewMode === 'project' && <div className="w-1.5 h-1.5 rounded-full bg-endava-orange"></div>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Only show active tabs if in project mode, otherwise just simplified list */}
      {viewMode === 'project' ? (
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                  ? 'bg-endava-orange text-white shadow-lg'
                  : 'text-endava-blue-30 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-endava-blue-40 group-hover:text-white'}`} />
                <span className="font-medium text-sm hidden lg:block tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      ) : (
        <div className="flex-1 px-4 py-4">
          <p className="text-xs text-endava-blue-40 mb-4 px-2">Select a project to view details, alerts, and AI insights.</p>
        </div>
      )}

      {/* User Footer */}
      <div className="p-4 border-t border-white/10 bg-endava-blue-90">
        <div className="bg-endava-blue-80/50 border border-white/10 rounded-xl p-3 flex items-center justify-between group hover:border-endava-blue-60 hover:bg-white/5 transition-all cursor-pointer">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-endava-orange to-red-400 flex items-center justify-center font-bold text-xs text-white shadow-lg flex-shrink-0">
              CTO
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold text-white truncate leading-none">James Chen</p>
              <div className="flex items-center text-[10px] text-emerald-400 mt-1 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                Online
              </div>
            </div>
          </div>
          <span title="Sign out (disabled in demo)"><LogOut className="w-4 h-4 text-endava-blue-40 hidden lg:block group-hover:text-endava-orange transition-colors" /></span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;