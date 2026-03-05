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

  const getForecastDate = (schedule: { endDate: string }[]) => {
    const endDates = schedule.map(t => new Date(t.endDate)).filter(d => !isNaN(d.getTime()));
    if (endDates.length === 0) return 'TBD';
    const latest = new Date(Math.max(...endDates.map(d => d.getTime())));
    return latest.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto bg-transparent p-6 lg:p-8 space-y-8 custom-scrollbar relative">
      <div className="absolute inset-0 bg-endava-dark -z-10" />
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Global Portfolio</h2>
          <p className="text-endava-blue-40 mt-1">Real-time oversight across {totalProjects} active data center constructions.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm bg-endava-blue-90/50 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-endava-blue-30">Agents Active</span>
        </div>
      </div>

      {/* Global KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-endava-blue-90/50 border border-white/10 p-5 rounded-2xl hover:border-endava-blue-70 transition-all backdrop-blur-sm shadow-xl group">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-endava-blue-80 text-endava-orange">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs text-endava-blue-30 font-medium bg-endava-blue-80/50 px-2 py-1 rounded">Active</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-endava-blue-40">Total Projects</h3>
            <p className="text-2xl font-bold text-white mt-1">{totalProjects}</p>
          </div>
        </div>

        <div className="bg-endava-blue-90/50 border border-white/10 p-5 rounded-2xl hover:border-endava-blue-70 transition-all backdrop-blur-sm shadow-xl group">
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${criticalProjects > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-endava-blue-40">Critical Risks</h3>
            <p className="text-2xl font-bold text-white mt-1">{criticalProjects} <span className="text-sm font-normal text-endava-blue-50">Projects</span></p>
            <p className="text-xs text-endava-blue-50 mt-1">{activeAlerts} active agent alerts</p>
          </div>
        </div>

        <div className="bg-endava-blue-90/50 border border-white/10 p-5 rounded-2xl hover:border-endava-blue-70 transition-all backdrop-blur-sm shadow-xl group">
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${totalVariance < 0 ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-endava-blue-40">Portfolio Variance</h3>
            <p className={`text-2xl font-bold mt-1 ${totalVariance < 0 ? 'text-orange-400' : 'text-emerald-400'}`}>
              {totalVariance < 0 ? '-' : '+'}{formatCurrency(totalVariance)}
            </p>
            <p className="text-xs text-endava-blue-50 mt-1">Forecast at Completion</p>
          </div>
        </div>

        <div className="bg-endava-blue-90/50 border border-white/10 p-5 rounded-2xl hover:border-endava-blue-70 transition-all backdrop-blur-sm shadow-xl group">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 rounded-lg bg-endava-blue-80 text-white">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-endava-blue-40">Total Workforce</h3>
            <p className="text-2xl font-bold text-white mt-1">{totalActiveWorkers}</p>
            <p className="text-xs text-endava-blue-50 mt-1">Active across all sites</p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-endava-orange" />
          Active Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PROJECTS.map(project => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="bg-endava-blue-90/50 border border-white/10 rounded-2xl p-6 hover:border-endava-orange/30 hover:bg-endava-blue-80/50 transition-all cursor-pointer group backdrop-blur-sm shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-endava-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4 relative">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-endava-blue-80 flex items-center justify-center border border-white/5 group-hover:border-endava-orange/50 transition-colors shadow-inner">
                    <Building2 className="w-5 h-5 text-white group-hover:text-endava-orange transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-endava-orange transition-colors">{project.projectName}</h4>
                    <p className="text-xs text-endava-blue-40">{project.location}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-medium border shadow-sm ${project.aiForecast?.riskLevel === 'High'
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : project.aiForecast?.riskLevel === 'Medium'
                    ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                  {project.aiForecast?.riskLevel} Risk
                </span>
              </div>

              <div className="space-y-4 relative">
                <div>
                  <div className="flex justify-between text-xs text-endava-blue-30 mb-1 font-medium">
                    <span>Progress</span>
                    <span>{project.totalCompletion}%</span>
                  </div>
                  <div className="w-full bg-endava-blue-80 h-1.5 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-endava-orange to-[#ff7e6b] rounded-full" style={{ width: `${project.totalCompletion}%` }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-endava-blue-80/50 p-2 rounded border border-white/5">
                    <span className="text-endava-blue-50 block mb-0.5">Forecast</span>
                    <span className="text-white font-medium">{getForecastDate(project.schedule)}</span>
                  </div>
                  <div className="bg-endava-blue-80/50 p-2 rounded border border-white/5">
                    <span className="text-endava-blue-50 block mb-0.5">Alerts</span>
                    <span className={`font-medium ${project.agentAlerts.length > 0 ? 'text-white' : 'text-endava-blue-50'}`}>
                      {project.agentAlerts.length} Active
                    </span>
                  </div>
                </div>

                {project.aiForecast && (
                  <div className="p-3 rounded-lg bg-gradient-to-r from-endava-blue-80/80 to-endava-blue-90/80 border border-white/10 shadow-sm">
                    <div className="flex items-center text-xs font-semibold text-endava-orange mb-1">
                      <Activity className="w-3 h-3 mr-1.5 animate-pulse" /> AI Insight
                    </div>
                    <p className="text-xs text-endava-blue-20 line-clamp-2 leading-relaxed">
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