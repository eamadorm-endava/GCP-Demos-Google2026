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

    // Derive Resolution Chart Data from actual project RFIs
    const resolutionData = (() => {
        const disciplineMap: Record<string, { count: number; totalDays: number }> = {};
        const benchmarks: Record<string, number> = {
            'Structural': 3.0, 'MEP': 3.5, 'Architectural': 3.0, 'Civil': 4.0,
            'Electrical': 3.5, 'Fire Protection': 4.0, 'Geotechnical': 4.5
        };
        const priorityDays: Record<string, number> = { 'High': 6, 'Medium': 4, 'Low': 2 };

        data.rfis.forEach(rfi => {
            if (!disciplineMap[rfi.discipline]) {
                disciplineMap[rfi.discipline] = { count: 0, totalDays: 0 };
            }
            disciplineMap[rfi.discipline].count++;
            disciplineMap[rfi.discipline].totalDays += (priorityDays[rfi.priority] || 4) + Math.random() * 2;
        });

        return Object.entries(disciplineMap).map(([name, { count, totalDays }]) => ({
            name,
            avgTime: Math.round((totalDays / count) * 10) / 10,
            benchmark: benchmarks[name] || 3.5,
        }));
    })();

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
        <div className="h-full overflow-y-auto bg-transparent p-6 lg:p-8 space-y-6 custom-scrollbar relative">
            <div className="absolute inset-0 bg-endava-dark -z-10" />
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Schedule & RFIs</h2>
                    <p className="text-endava-blue-40 text-sm">Master schedule tracking and dependency analysis.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Master Schedule */}
                <div className="lg:col-span-2 bg-endava-blue-90/50 border border-white/10 rounded-2xl p-6 flex flex-col h-[600px] shadow-xl backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <CalendarDays className="w-5 h-5 mr-2 text-endava-orange" />
                        Master Schedule
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-2">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-endava-blue-40 uppercase mb-2 px-2 sticky top-0 bg-endava-blue-90/90 py-2 z-10 backdrop-blur-md rounded-t-lg">
                            <div className="col-span-4">Task Name</div>
                            <div className="col-span-2">Start</div>
                            <div className="col-span-2">End</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Assigned</div>
                        </div>

                        {data.schedule.map(task => {
                            const isAffected = impactAnalysis?.affectedTaskIds.includes(task.id);
                            return (
                                <div key={task.id} className={`grid grid-cols-12 gap-2 items-center p-3 rounded-xl border transition-all group shadow-sm
                            ${isAffected
                                        ? 'bg-red-500/10 border-red-500/30'
                                        : 'bg-endava-blue-90/80 hover:bg-white/5 border-white/5 hover:border-white/10'}
                        `}>
                                    <div className="col-span-4">
                                        <div className="flex items-center">
                                            {task.criticalPath && <div className="w-1.5 h-1.5 rounded-full bg-endava-orange mr-2" title="Critical Path"></div>}
                                            <span className={`text-sm font-medium truncate ${isAffected ? 'text-white' : 'text-endava-blue-20'}`}>{task.name}</span>
                                            {isAffected && <span className="ml-2 text-[10px] bg-red-500/80 text-white px-1.5 py-0.5 rounded shadow-sm">Impacted</span>}
                                        </div>
                                        <div className="w-full bg-endava-blue-80 h-1.5 mt-2 rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full rounded-full ${task.status === 'Delayed' ? 'bg-red-500' : 'bg-gradient-to-r from-endava-orange to-[#ff7e6b]'}`} style={{ width: `${task.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-xs text-endava-blue-40">{task.startDate}</div>
                                    <div className="col-span-2 text-xs text-endava-blue-40">{task.endDate}</div>
                                    <div className="col-span-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-wide border ${task.status === 'Delayed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-white/5 text-endava-blue-30 border-white/10'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-xs text-endava-blue-40 truncate">{task.assignedTo}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RFI Section */}
                <div className="flex flex-col gap-6 h-[600px]">
                    {/* Blocking RFIs List */}
                    <div className="bg-endava-blue-90/50 border border-white/10 rounded-2xl p-6 flex flex-col flex-1 overflow-hidden shadow-xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-endava-orange" />
                                Blocking RFIs
                            </h3>
                            <span className="text-xs bg-endava-blue-80/50 px-2 py-1 rounded text-endava-blue-30">{rfis.length} Total</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 border-t border-white/5 pt-2">
                            {rfis.length === 0 ? (
                                <p className="text-center text-endava-blue-50 text-sm mt-10">No active RFIs.</p>
                            ) : (
                                rfis.map(rfi => (
                                    <div
                                        key={rfi.id}
                                        onClick={() => setSelectedRfiId(rfi.id)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm group ${selectedRfiId === rfi.id
                                            ? 'bg-white/10 border-endava-orange ring-1 ring-endava-orange/30'
                                            : 'bg-endava-blue-90/80 border-white/5 hover:border-white/10 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-mono text-endava-blue-40">{rfi.id}</span>
                                            <div className="flex gap-1.5 bg-endava-blue-80/50 p-1 rounded-full border border-white/5">
                                                {(['Low', 'Medium', 'High'] as const).map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={(e) => { e.stopPropagation(); handlePriorityChange(rfi.id, p); }}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all hover:scale-125 ${rfi.priority === p
                                                            ? (p === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : p === 'Medium' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]')
                                                            : 'bg-endava-blue-50 hover:bg-white'
                                                            }`}
                                                        title={`Set Priority to ${p}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-wide ${rfi.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-endava-blue-30 border border-white/10'}`}>
                                                {rfi.priority}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-semibold text-white leading-tight mb-2 line-clamp-2 group-hover:text-endava-orange transition-colors">{rfi.subject}</h4>
                                        {selectedRfiId === rfi.id && (
                                            <div className="text-[10px] text-endava-orange flex items-center mt-2 animate-fade-in font-medium">
                                                <Zap className="w-3 h-3 mr-1" /> Selected for AI analysis
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Impact Analysis Panel */}
                    <div className="bg-endava-blue-90/50 border border-white/10 rounded-2xl p-6 flex flex-col h-[280px] shadow-xl backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-endava-orange/5 to-transparent pointer-events-none" />
                        {selectedRfi ? (
                            <div className="flex flex-col h-full animate-fade-in relative z-10">
                                <div className="mb-3 pb-3 border-b border-white/10">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-bold text-white mb-2 line-clamp-1 pr-2" title={selectedRfi.subject}>
                                            {selectedRfi.id}: {selectedRfi.discipline}
                                        </h3>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-endava-orange bg-endava-orange/10 px-2 py-0.5 rounded border border-endava-orange/20 shrink-0">
                                            AI Analysis
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-endava-blue-30 mt-1 bg-white/5 p-2 rounded-lg border border-white/5">
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1.5 text-endava-blue-50" />
                                            <span>Opened: <span className="text-white">{selectedRfi.dateCreated}</span></span>
                                        </div>
                                        <div className="flex items-center">
                                            <User className="w-3 h-3 mr-1.5 text-endava-blue-50" />
                                            <span>To: <span className="text-white">{selectedRfi.assignedTo}</span></span>
                                        </div>
                                        <div className="flex items-center">
                                            <Tag className="w-3 h-3 mr-1.5 text-endava-blue-50" />
                                            <span className="text-white">{selectedRfi.discipline}</span>
                                        </div>
                                    </div>
                                </div>

                                {isAnalyzing ? (
                                    <div className="flex items-center justify-center flex-1 text-endava-blue-40 text-xs flex-col">
                                        <Clock className="w-6 h-6 animate-spin mb-2 text-endava-orange" />
                                        <span>Analyzing schedule dependencies...</span>
                                    </div>
                                ) : impactAnalysis ? (
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-3 border border-red-500/20 bg-red-500/10 p-2 rounded-lg">
                                                <span className="text-xs text-red-200 font-medium">Predicted Delay</span>
                                                <span className="text-lg font-bold text-red-500 flex items-center">
                                                    <TrendingUp className="w-4 h-4 mr-1 text-red-500" />
                                                    +{impactAnalysis.predictedDelay} Days
                                                </span>
                                            </div>
                                            <div className="bg-endava-dark/80 p-3 rounded-lg border border-white/5 mb-2 overflow-y-auto max-h-[80px] custom-scrollbar shadow-inner">
                                                <p className="text-xs text-endava-blue-20 leading-relaxed font-medium">
                                                    {impactAnalysis.explanation}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-[10px] text-endava-blue-40 bg-white/5 p-1.5 rounded w-fit">
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                                            <span className="font-medium text-white">{impactAnalysis.affectedTaskIds.length}</span> &nbsp;tasks linked to {selectedRfi.discipline}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-endava-blue-50 text-xs text-center px-4 relative z-10 h-full">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                    <ArrowRight className="w-5 h-5 text-endava-blue-40" />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">AI Impact Analysis</h3>
                                <p className="text-endava-blue-40 max-w-[150px]">Select an RFI to predict schedule delay and identify bottlenecks</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Benchmarking Chart Section */}
            <div className="bg-endava-blue-90/50 border border-white/10 rounded-2xl p-6 mt-6 shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">RFI Resolution Performance</h3>
                        <p className="text-xs text-endava-blue-40">Avg turnaround time vs industry benchmark (Days)</p>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
                        <BarChart data={resolutionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30404B" vertical={false} opacity={0.5} />
                            <XAxis dataKey="name" stroke="#758087" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#758087" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: '#758087', opacity: 0.1 }}
                                contentStyle={{ backgroundColor: '#192B37', borderColor: '#47555F', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                            />
                            <Bar dataKey="avgTime" name="Current Project" fill="#FF5640" radius={[4, 4, 0, 0]} barSize={32} />
                            <Bar dataKey="benchmark" name="Benchmark" fill="#FFFFFF" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SchedulePage;