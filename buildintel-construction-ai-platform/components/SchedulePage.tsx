import React, { useState, useEffect } from 'react';
import { ProjectData, RFI } from '../types';
import { CalendarDays, AlertCircle, ArrowRight, TrendingUp, Clock, Zap, CheckCircle2, User, Calendar, Tag } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { analyzeRfiImpact, RfiImpactAnalysis } from '../services/geminiService';

interface SchedulePageProps {
  data: ProjectData;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ data }) => {
  const [selectedRfiId, setSelectedRfiId] = useState<string | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<RfiImpactAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Local state for RFIs to allow priority updates
  const [rfis, setRfis] = useState<RFI[]>(data.rfis);
  
  const selectedRfi = rfis.find(r => r.id === selectedRfiId);

  // Resolution Chart Data (Mock)
  const resolutionData = [
      { name: 'Structural', avgTime: 5.2, benchmark: 3.0 },
      { name: 'MEP', avgTime: 4.1, benchmark: 3.5 },
      { name: 'Architectural', avgTime: 2.8, benchmark: 3.0 },
      { name: 'Civil', avgTime: 3.5, benchmark: 4.0 },
  ];

  useEffect(() => {
    if (selectedRfi) {
      handleAnalyzeImpact(selectedRfi);
    }
  }, [selectedRfi?.id]); // Re-run when selection changes

  const handleAnalyzeImpact = async (rfi: RFI) => {
      setIsAnalyzing(true);
      setImpactAnalysis(null);
      const analysis = await analyzeRfiImpact(rfi, data.schedule);
      setImpactAnalysis(analysis);
      setIsAnalyzing(false);
  };

  const handlePriorityChange = async (rfiId: string, newPriority: 'High' | 'Medium' | 'Low') => {
      // Update local state
      const updatedRfis = rfis.map(r => r.id === rfiId ? { ...r, priority: newPriority } : r);
      setRfis(updatedRfis);
      
      // Trigger re-analysis if selected
      if (selectedRfiId === rfiId) {
          const rfi = updatedRfis.find(r => r.id === rfiId);
          if (rfi) handleAnalyzeImpact(rfi);
      }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-6 custom-scrollbar">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Schedule & RFIs</h2>
            <p className="text-slate-400 text-sm">Master schedule tracking and dependency analysis.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Master Schedule */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[600px]">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-primary-400" />
                Master Schedule
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase mb-2 px-2">
                    <div className="col-span-4">Task Name</div>
                    <div className="col-span-2">Start</div>
                    <div className="col-span-2">End</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Assigned</div>
                </div>
                
                {data.schedule.map(task => {
                    const isAffected = impactAnalysis?.affectedTaskIds.includes(task.id);
                    return (
                        <div key={task.id} className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg border transition-all group
                            ${isAffected 
                                ? 'bg-red-500/10 border-red-500/50' 
                                : 'bg-slate-800/50 hover:bg-slate-800 border-slate-800/50 hover:border-slate-700'}
                        `}>
                            <div className="col-span-4">
                                <div className="flex items-center">
                                    {task.criticalPath && <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2" title="Critical Path"></div>}
                                    <span className={`text-sm font-medium truncate ${isAffected ? 'text-white' : 'text-slate-200'}`}>{task.name}</span>
                                    {isAffected && <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 rounded">Impacted</span>}
                                </div>
                                <div className="w-full bg-slate-900 h-1 mt-2 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${task.status === 'Delayed' ? 'bg-red-500' : 'bg-primary-500'}`} style={{width: `${task.progress}%`}}></div>
                                </div>
                            </div>
                            <div className="col-span-2 text-xs text-slate-400">{task.startDate}</div>
                            <div className="col-span-2 text-xs text-slate-400">{task.endDate}</div>
                            <div className="col-span-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                                    task.status === 'Delayed' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                    task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {task.status}
                                </span>
                            </div>
                            <div className="col-span-2 text-xs text-slate-500 truncate">{task.assignedTo}</div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* RFI Section */}
        <div className="flex flex-col gap-6 h-[600px]">
            {/* Blocking RFIs List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-accent-orange" />
                        Blocking RFIs
                    </h3>
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{rfis.length} Total</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                    {rfis.length === 0 ? (
                        <p className="text-center text-slate-500 text-sm mt-10">No active RFIs.</p>
                    ) : (
                        rfis.map(rfi => (
                            <div 
                                key={rfi.id} 
                                onClick={() => setSelectedRfiId(rfi.id)}
                                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                                    selectedRfiId === rfi.id 
                                    ? 'bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500/50' 
                                    : 'bg-slate-800/50 border-slate-800 hover:border-slate-600'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-slate-500">{rfi.id}</span>
                                    <div className="flex gap-1">
                                        {(['Low', 'Medium', 'High'] as const).map(p => (
                                            <button
                                                key={p}
                                                onClick={(e) => { e.stopPropagation(); handlePriorityChange(rfi.id, p); }}
                                                className={`w-2 h-2 rounded-full transition-colors ${
                                                    rfi.priority === p 
                                                    ? (p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-orange-500' : 'bg-blue-500') 
                                                    : 'bg-slate-700 hover:bg-slate-600'
                                                }`}
                                                title={`Set Priority to ${p}`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${rfi.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-slate-700 text-slate-300'}`}>
                                        {rfi.priority}
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-slate-200 leading-tight mb-2 line-clamp-2">{rfi.subject}</h4>
                                {selectedRfiId === rfi.id && (
                                    <div className="text-[10px] text-indigo-300 flex items-center mt-2 animate-fade-in">
                                        <Zap className="w-3 h-3 mr-1" /> Selected for analysis
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Impact Analysis Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[280px]">
                {selectedRfi ? (
                    <div className="flex flex-col h-full animate-fade-in">
                        <div className="mb-3 pb-3 border-b border-slate-800">
                             <div className="flex justify-between items-start">
                                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1" title={selectedRfi.subject}>
                                    {selectedRfi.id}: {selectedRfi.discipline}
                                </h3>
                                <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                    AI Impact Analysis
                                </span>
                             </div>
                             <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 mt-1">
                                <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                                    <span>Opened: {selectedRfi.dateCreated}</span>
                                </div>
                                <div className="flex items-center">
                                    <User className="w-3 h-3 mr-1 text-slate-500" />
                                    <span>To: {selectedRfi.assignedTo}</span>
                                </div>
                                <div className="flex items-center">
                                    <Tag className="w-3 h-3 mr-1 text-slate-500" />
                                    <span>{selectedRfi.discipline}</span>
                                </div>
                             </div>
                        </div>

                         {isAnalyzing ? (
                            <div className="flex items-center justify-center flex-1 text-slate-500 text-xs">
                                <Clock className="w-4 h-4 animate-spin mr-2" /> Analyzing schedule dependencies...
                            </div>
                         ) : impactAnalysis ? (
                            <div className="flex flex-col flex-1 justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-400">Predicted Delay</span>
                                        <span className="text-lg font-bold text-red-400">+{impactAnalysis.predictedDelay} Days</span>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded border border-slate-800 mb-2 overflow-y-auto max-h-[80px] custom-scrollbar">
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {impactAnalysis.explanation}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center text-[10px] text-slate-500">
                                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                                    {impactAnalysis.affectedTaskIds.length} tasks linked to {selectedRfi.discipline}
                                </div>
                            </div>
                         ) : null}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-600 text-xs text-center px-4">
                        <ArrowRight className="w-6 h-6 mb-2 opacity-50" />
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">AI Impact Analysis</h3>
                        <p>Select an RFI to predict delay & cost</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Benchmarking Chart Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
          <div className="flex justify-between items-center mb-6">
              <div>
                  <h3 className="text-lg font-bold text-white">RFI Resolution Performance</h3>
                  <p className="text-xs text-slate-400">Avg turnaround time vs industry benchmark (Days)</p>
              </div>
          </div>
          <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{fill: '#1e293b', opacity: 0.5}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                        />
                        <Bar dataKey="avgTime" name="Current Project" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="benchmark" name="Benchmark" fill="#64748b" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
              </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};

export default SchedulePage;