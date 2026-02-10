import React from 'react';
import { PROJECTS } from '../services/mockData';
import { 
  Globe, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Activity, DollarSign, Building2, Users
} from 'lucide-react';

interface PortfolioDashboardProps {
  onSelectProject: (id: string) => void;
}

const PortfolioDashboard: React.FC<PortfolioDashboardProps> = ({ onSelectProject }) => {
  // Aggregate Metrics
  const totalProjects = PROJECTS.length;
  const criticalProjects = PROJECTS.filter(p => p.aiForecast?.riskLevel === 'High').length;
  const totalVariance = PROJECTS.reduce((acc, p) => acc + p.financials.reduce((fAcc, f) => fAcc + f.variance, 0), 0);
  const totalActiveWorkers = PROJECTS.reduce((acc, p) => acc + p.workforce.activeWorkers, 0);
  const activeAlerts = PROJECTS.reduce((acc, p) => acc + p.agentAlerts.filter(a => a.status === 'New' || a.status === 'Verified').length, 0);

  const formatCurrency = (val: number) => {
    const absVal = Math.abs(val);
    const suffix = absVal >= 1000000 ? 'M' : 'K';
    const num = absVal >= 1000000 ? absVal / 1000000 : absVal / 1000;
    return `$${num.toFixed(1)}${suffix}`;
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8 custom-scrollbar">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Global Portfolio</h2>
          <p className="text-slate-400 mt-1">Real-time oversight across {totalProjects} active data center constructions.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-slate-300">Agents Active</span>
        </div>
      </div>

      {/* Global KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-500 font-medium bg-slate-800 px-2 py-1 rounded">Active</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Total Projects</h3>
            <p className="text-2xl font-bold text-white mt-1">{totalProjects}</p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${criticalProjects > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Critical Risks</h3>
            <p className="text-2xl font-bold text-white mt-1">{criticalProjects} <span className="text-sm font-normal text-slate-500">Projects</span></p>
            <p className="text-xs text-slate-500 mt-1">{activeAlerts} active agent alerts</p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${totalVariance < 0 ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Portfolio Variance</h3>
            <p className={`text-2xl font-bold mt-1 ${totalVariance < 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
               {totalVariance < 0 ? '-' : '+'}{formatCurrency(totalVariance)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Forecast at Completion</p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-400">Total Workforce</h3>
            <p className="text-2xl font-bold text-white mt-1">{totalActiveWorkers}</p>
            <p className="text-xs text-slate-500 mt-1">Active across all sites</p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-primary-400" /> 
            Active Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PROJECTS.map(project => (
                <div 
                    key={project.id} 
                    onClick={() => onSelectProject(project.id)}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-primary-500/30 hover:bg-slate-900/80 transition-all cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-primary-500/50 transition-colors">
                                <Building2 className="w-5 h-5 text-slate-400 group-hover:text-primary-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors">{project.projectName}</h4>
                                <p className="text-xs text-slate-500">{project.location}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                            project.aiForecast?.riskLevel === 'High' 
                                ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                : project.aiForecast?.riskLevel === 'Medium'
                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                            {project.aiForecast?.riskLevel} Risk
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Progress</span>
                                <span>{project.totalCompletion}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full" style={{width: `${project.totalCompletion}%`}}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                <span className="text-slate-500 block">Forecast</span>
                                <span className="text-slate-300 font-medium">Nov 2024</span>
                            </div>
                            <div className="bg-slate-900 p-2 rounded border border-slate-800">
                                <span className="text-slate-500 block">Alerts</span>
                                <span className={`font-medium ${project.agentAlerts.length > 0 ? 'text-white' : 'text-slate-400'}`}>
                                    {project.agentAlerts.length} Active
                                </span>
                            </div>
                        </div>

                        {project.aiForecast && (
                            <div className="p-3 rounded-lg bg-indigo-900/10 border border-indigo-500/20">
                                <div className="flex items-center text-xs font-semibold text-indigo-300 mb-1">
                                    <Activity className="w-3 h-3 mr-1.5" /> AI Insight
                                </div>
                                <p className="text-xs text-indigo-200/80 line-clamp-2">
                                    {project.aiForecast.summary}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;