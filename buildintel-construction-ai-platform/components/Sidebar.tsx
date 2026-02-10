import React from 'react';
import { LayoutDashboard, MessageSquareText, HardHat, FileText, Settings, BarChart3, AlertTriangle, LogOut, ChevronDown, Building2, LayoutGrid } from 'lucide-react';
import { PROJECTS } from '../services/mockData';

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
    <div className="w-20 lg:w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full flex-shrink-0 transition-all duration-300 relative z-20">
      {/* Brand Header */}
      <div 
        className="p-6 flex items-center justify-center lg:justify-start space-x-3 border-b border-slate-900/50 bg-slate-950 cursor-pointer"
        onClick={handlePortfolioSelect}
      >
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg shadow-lg shadow-primary-500/20">
          <HardHat className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight hidden lg:block font-sans">BuildIntel</h1>
      </div>

      {/* Context Selector */}
      <div className="px-4 py-6 hidden lg:block">
        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            {viewMode === 'portfolio' ? 'Portfolio View' : 'Active Project'}
        </p>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full border rounded-xl p-3 flex items-center justify-between transition-all ${viewMode === 'portfolio' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
                <div className={`p-1.5 rounded-lg ${viewMode === 'portfolio' ? 'bg-indigo-500 text-white' : 'bg-slate-800'}`}>
                    {viewMode === 'portfolio' ? <LayoutGrid className="w-4 h-4" /> : <Building2 className="w-4 h-4 text-primary-400" />}
                </div>
                <div className="text-left overflow-hidden">
                    <p className="text-sm font-medium text-white truncate w-32">
                        {viewMode === 'portfolio' ? 'Global Portfolio' : currentProject.projectName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate w-32">
                        {viewMode === 'portfolio' ? `${PROJECTS.length} Active Projects` : currentProject.location}
                    </p>
                </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                <button
                    onClick={handlePortfolioSelect}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center space-x-3 hover:bg-slate-800 transition-colors ${viewMode === 'portfolio' ? 'bg-slate-800/50 text-indigo-400' : 'text-slate-400'}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Global Portfolio</span>
                </button>
                <div className="h-px bg-slate-800 my-1"></div>
                {PROJECTS.map(p => (
                    <button
                        key={p.id}
                        onClick={() => handleProjectSelect(p.id)}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-slate-800 transition-colors ${currentProjectId === p.id && viewMode === 'project' ? 'bg-slate-800/50 text-white' : 'text-slate-400'}`}
                    >
                        <span className="truncate">{p.projectName}</span>
                        {currentProjectId === p.id && viewMode === 'project' && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
                    </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Only show active tabs if in project mode, otherwise just simplified list */}
      {viewMode === 'project' ? (
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
                <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                    ? 'bg-slate-900 text-white border border-slate-800 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
                >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-primary-500 transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-medium text-sm hidden lg:block">{item.label}</span>
                </button>
            );
            })}
        </nav>
      ) : (
          <div className="flex-1 px-4 py-4">
              <p className="text-xs text-slate-500 mb-4 px-2">Select a project to view details, alerts, and AI insights.</p>
          </div>
      )}

      {/* User Footer */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex items-center justify-between group hover:border-slate-700 transition-colors cursor-pointer">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-orange to-red-500 flex items-center justify-center font-bold text-xs text-white shadow-lg flex-shrink-0">
              CTO
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">James Chen</p>
              <div className="flex items-center text-[10px] text-emerald-500">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                Online
              </div>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-slate-500 hidden lg:block hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;