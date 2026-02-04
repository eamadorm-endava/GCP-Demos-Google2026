
import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  VENDORS, 
  INVOICES, 
  METRIC_LOGS, 
  EVENTS, 
  RATE_CARDS 
} from '../constants';
import { 
  ArrowLeft, ShieldCheck, FileText, Calendar, Activity, DollarSign, 
  AlertCircle, CheckCircle2, Target, Zap, Briefcase, User, Mail,
  MoreHorizontal, TrendingUp, FileCheck, ChevronDown, Plus, X,
  LayoutDashboard, BarChart3, CreditCard, Clock, ExternalLink,
  FileOutput, Sparkles, BarChart, HardDrive, MessageSquare, Loader2,
  Presentation, ChevronLeft, ChevronRight, LayoutTemplate, Bug, Timer, Users
} from 'lucide-react';
import { 
  AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar, Cell, ComposedChart as ReComposedChart, Line, Legend, LineChart as ReLineChart
} from 'recharts';
import { AuditStatus, MetricType, Vendor } from '../types';
import Modal from './common/Modal';
import StatCard from './common/StatCard';
import { useQBRGenerator } from '../hooks/useQBRGenerator';

const VendorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'rates' | 'analytics'>('overview');
  
  const [vendorsList, setVendorsList] = useState<Vendor[]>(VENDORS);
  const [isCreatingVendor, setIsCreatingVendor] = useState(false);
  const [isQbrModalOpen, setIsQbrModalOpen] = useState(false);

  const [newVendorData, setNewVendorData] = useState<Partial<Vendor>>({
    name: '', msaId: '', status: 'Active', color: 'indigo',
    description: '', contactName: '', contactEmail: ''
  });

  const vendor = vendorsList.find(v => v.id === id);
  
  const {
    isGenerating, qbrResult, isExporting, exportStep, exportSuccess, exportUrl,
    slidesData, currentSlideIndex, showSlidePreview, currentVendor, vendorMetrics, vendorEvents,
    handleGenerateQBR, handlePrepareSlides, handleFinalizeExport, 
    setShowSlidePreview, nextSlide, prevSlide, resetQBRState
  } = useQBRGenerator(id || '', EVENTS);


  const vendorInvoices = useMemo(() => INVOICES.filter(i => i.vendorId === id), [id]);
  const rateCard = RATE_CARDS[id || ''];

  const monthlySpendData = useMemo(() => {
    const monthly: Record<string, number> = {};
    vendorInvoices.forEach(inv => {
      const month = new Date(inv.date).toLocaleString('default', { month: 'short' });
      monthly[month] = (monthly[month] || 0) + inv.amount;
    });
    const order = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    return order.map(m => ({ month: m, amount: monthly[m] || 0 }));
  }, [vendorInvoices]);

  const spendByRole = useMemo(() => {
    const roles: Record<string, number> = {};
    vendorInvoices.forEach(inv => {
        inv.lineItems.forEach(item => {
            roles[item.role] = (roles[item.role] || 0) + item.total;
        });
    });
    return Object.entries(roles)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
  }, [vendorInvoices]);

  const kpiTrends = useMemo(() => {
    const velocity = vendorMetrics
      .filter(m => m.type === MetricType.Velocity)
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({ date: new Date(m.date).toLocaleString('default', { month: 'short' }), value: m.value }));

    const bugs = vendorMetrics
      .filter(m => m.type === MetricType.BugCount)
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(m => ({ date: new Date(m.date).toLocaleString('default', { month: 'short' }), value: m.value }));

    const avgVelocity = velocity.length ? Math.round(velocity.reduce((a,b) => a + b.value, 0) / velocity.length) : 0;
    const totalBugs = bugs.reduce((a,b) => a + b.value, 0);

    return { velocity, bugs, avgVelocity, totalBugs };
  }, [vendorMetrics]);

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h2 className="text-2xl font-black text-slate-800">Vendor Not Found</h2>
        <Link to="/" className="text-[color:var(--color-brand-600)] font-bold mt-4 flex items-center gap-2 hover:underline">
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const totalSpend = vendorInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const slaAvg = vendorMetrics.filter(m => m.type === MetricType.SLAAdherence).reduce((sum, m, _, arr) => sum + m.value / (arr.length || 1), 0);
  const openActionItems = vendorEvents.reduce((sum, e) => sum + e.actionItems.length, 0); 
  
  // Chart Data Preparation
  const velocityMetrics = vendorMetrics.filter(m => m.type === MetricType.Velocity);
  const bugMetrics = vendorMetrics.filter(m => m.type === MetricType.BugCount);
  const slaMetrics = vendorMetrics.filter(m => m.type === MetricType.SLAAdherence);

  // Combine for Composed Chart
  const combinedPerformanceData = velocityMetrics.map((vm, index) => {
    // Find matching bug metric if exists (assuming ordered or by date)
    const bm = bugMetrics.find(b => b.date === vm.date);
    return {
      date: new Date(vm.date).toLocaleString('default', { month: 'short' }),
      velocity: vm.value,
      bugs: bm ? bm.value : 0,
      velocityTarget: vm.target,
      bugTarget: bm ? bm.target : 0
    };
  });

  const slaPerformanceData = slaMetrics.map(m => ({
    date: new Date(m.date).toLocaleString('default', { month: 'short' }),
    value: m.value,
    target: m.target
  }));


  const getStatusClass = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.Passed: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case AuditStatus.Flagged: return 'bg-amber-50 text-amber-700 border-amber-200';
      case AuditStatus.Rejected: return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.Passed: return <CheckCircle2 size={16} />;
      case AuditStatus.Flagged: return <AlertCircle size={16} />;
      case AuditStatus.Rejected: return <X size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getVendorColorClass = (type: 'bg' | 'text' | 'border' | 'ring', intensity: string = '600') => {
    let color = 'indigo';
    if (vendor.color === 'teal') color = 'teal';
    else if (vendor.color === 'orange') color = 'orange';
    else if (vendor.color === 'purple') color = 'purple';
    else if (vendor.color === 'rose') color = 'rose';
    else if (vendor.color === 'blue') color = 'blue';
    return `${type}-${color}-${intensity}`;
  };

  const handleCreateVendor = () => {
    const newId = `v${vendorsList.length + 1}-${Date.now()}`;
    const createdVendor: Vendor = {
        id: newId,
        name: newVendorData.name || 'New Vendor',
        msaId: newVendorData.msaId || 'PENDING',
        status: (newVendorData.status as 'Active' | 'Probation') || 'Active',
        color: newVendorData.color || 'indigo',
        description: newVendorData.description || '',
        contactName: newVendorData.contactName || '',
        contactEmail: newVendorData.contactEmail || '',
        renewalDate: new Date().toISOString().split('T')[0]
    };
    setVendorsList([...vendorsList, createdVendor]);
    setIsCreatingVendor(false);
    navigate(`/vendor/${newId}`);
    setNewVendorData({ name: '', msaId: '', status: 'Active', color: 'indigo', description: '', contactName: '', contactEmail: '' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-4 mb-1 last:mb-0">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}></div>
                  <span className="text-sm font-bold">{entry.name}: {entry.dataKey === 'amount' || entry.dataKey === 'value' ? `$${entry.value.toLocaleString()}`: entry.value}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const exportSteps = [
    "Authenticating with Google Cloud...", "Generating Slide Structures...", 
    "Injecting Visuals & Charts...", "Finalizing Presentation Deck..."
  ];

  // Helper to render visuals inside slide preview
  const renderSlideVisual = (visualType: string) => {
    switch(visualType) {
        case 'CHART_SPEND':
            return (
                <div className="h-48 w-full bg-slate-50 rounded-xl p-4 border border-slate-100 mt-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Q1 Spend Velocity</h4>
                    <ResponsiveContainer width="100%" height="80%">
                        <ReAreaChart data={monthlySpendData}>
                            <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fill="#e0e7ff" />
                        </ReAreaChart>
                    </ResponsiveContainer>
                </div>
            );
        case 'CHART_VELOCITY':
            return (
                <div className="h-48 w-full bg-slate-50 rounded-xl p-4 border border-slate-100 mt-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Velocity vs. Quality</h4>
                    <ResponsiveContainer width="100%" height="80%">
                        <ReComposedChart data={combinedPerformanceData}>
                            <Bar dataKey="velocity" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="bugs" stroke="#ef4444" strokeWidth={2} dot={false} />
                        </ReComposedChart>
                    </ResponsiveContainer>
                </div>
            );
        case 'CHART_SLA':
            return (
                <div className="h-48 w-full bg-slate-50 rounded-xl p-4 border border-slate-100 mt-6">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">SLA Adherence</h4>
                    <ResponsiveContainer width="100%" height="80%">
                        <ReAreaChart data={slaPerformanceData}>
                            <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} fill="#ccfbf1" />
                        </ReAreaChart>
                    </ResponsiveContainer>
                </div>
            );
        case 'SCORECARD':
            return (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                        <span className="block text-2xl font-black text-emerald-600">{Math.round(slaAvg)}%</span>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase">SLA Score</span>
                    </div>
                    <div className="p-4 bg-[color:var(--color-brand-50)] rounded-xl border border-[color:var(--color-brand-100)] text-center">
                        <span className="block text-2xl font-black text-[color:var(--color-brand-600)]">{vendorInvoices.length}</span>
                        <span className="text-[10px] font-bold text-[color:var(--color-brand-800)] uppercase">Audits Passed</span>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                        <span className="block text-2xl font-black text-amber-600">{kpiTrends.totalBugs}</span>
                        <span className="text-[10px] font-bold text-amber-800 uppercase">Risk Events</span>
                    </div>
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <Modal isOpen={isCreatingVendor} onClose={() => setIsCreatingVendor(false)} title="Onboard New Vendor">
          <div className="space-y-5">
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Vendor Name</label><input type="text" placeholder="e.g. Acme Innovations Ltd." value={newVendorData.name} onChange={(e) => setNewVendorData({...newVendorData, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-50)]0/10 border-2 border-transparent focus:border-[color:var(--color-brand-50)]0 transition-all"/></div>
            <div className="grid grid-cols-2 gap-5">
              <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">MSA Contract ID</label><input type="text" placeholder="MSA-2024-..." value={newVendorData.msaId} onChange={(e) => setNewVendorData({...newVendorData, msaId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-50)]0/10 border-2 border-transparent focus:border-[color:var(--color-brand-50)]0 transition-all"/></div>
              <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Brand Color</label><select value={newVendorData.color} onChange={(e) => setNewVendorData({...newVendorData, color: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-50)]0/10 border-2 border-transparent focus:border-[color:var(--color-brand-50)]0 transition-all appearance-none cursor-pointer"><option value="indigo">Indigo</option><option value="teal">Teal</option><option value="orange">Orange</option><option value="purple">Purple</option><option value="rose">Rose</option><option value="blue">Blue</option></select></div>
            </div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label><textarea rows={3} placeholder="Brief summary of services..." value={newVendorData.description} onChange={(e) => setNewVendorData({...newVendorData, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-50)]0/10 border-2 border-transparent focus:border-[color:var(--color-brand-50)]0 transition-all resize-none"/></div>
            <div className="grid grid-cols-2 gap-5">
              <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Name</label><input type="text" placeholder="Full Name" value={newVendorData.contactName} onChange={(e) => setNewVendorData({...newVendorData, contactName: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-50)]0/10 border-2 border-transparent focus:border-[color:var(--color-brand-50)]0 transition-all"/></div>
              <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Email</label><input type="email" placeholder="email@vendor.com" value={newVendorData.contactEmail} onChange={(e) => setNewVendorData({...newVendorData, contactEmail: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-brand-50)]0/10 border-2 border-transparent focus:border-[color:var(--color-brand-50)]0 transition-all"/></div>
            </div>
            <button onClick={handleCreateVendor} className="w-full py-5 bg-[color:var(--color-brand-600)] text-white rounded-2xl font-black text-sm hover:bg-[color:var(--color-brand-700)] shadow-xl shadow-[color:var(--color-brand-200)] transition-all active:scale-95 mt-4 flex items-center justify-center gap-2"><CheckCircle2 size={18} />Create Vendor Profile</button>
          </div>
      </Modal>

      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4"><Link to="/" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-800 transition-colors"><div className="p-2 bg-white border border-slate-200 rounded-xl group-hover:border-[color:var(--color-brand-300)] transition-colors"><ArrowLeft size={16} /></div></Link><div className="relative group"><select value={vendor.id} onChange={(e) => navigate(`/vendor/${e.target.value}`)} className="appearance-none bg-white pl-4 pr-10 py-3 rounded-2xl font-black text-slate-800 text-lg border border-transparent hover:border-slate-200 focus:outline-none cursor-pointer min-w-[240px] shadow-sm">{vendorsList.map(v => (<option key={v.id} value={v.id}>{v.name}</option>))}</select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[color:var(--color-brand-600)] transition-colors" size={20} /></div></div>
        <div className="flex gap-3"><button onClick={() => setIsCreatingVendor(true)} className="px-5 py-3 bg-white border-2 border-slate-200 rounded-2xl text-xs font-black text-slate-700 hover:border-[color:var(--color-brand-200)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-700)] transition-all flex items-center gap-2"><Plus size={16} />Create Vendor</button><button className="p-3 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><MoreHorizontal size={20} /></button></div>
      </div>

      {/* Vendor Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${getVendorColorClass('bg', '500')}`}></div>
        <div className={`absolute -right-20 -top-20 w-96 h-96 ${getVendorColorClass('bg', '50')} rounded-full blur-3xl opacity-50`}></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-xl ${getVendorColorClass('bg', '600')} ring-4 ring-white`}>{vendor.name.charAt(0)}</div>
            <div>
              <div className="flex items-center gap-3 mb-2"><h1 className="text-4xl font-black text-slate-800 tracking-tight">{vendor.name}</h1><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${vendor.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>{vendor.status}</span></div>
              <p className="text-slate-500 font-medium max-w-xl text-sm leading-relaxed mb-4">{vendor.description}</p>
              <div className="flex flex-wrap gap-4"><span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Briefcase size={14} className="text-slate-400" />{vendor.msaId}</span><span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Calendar size={14} className="text-slate-400" />Renews: {vendor.renewalDate}</span><span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><User size={14} className="text-slate-400" />{vendor.contactName}</span></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="flex flex-col items-end mr-4 px-6 border-r border-slate-100 hidden xl:flex"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Health Score</span><span className={`text-3xl font-black ${slaAvg > 98 ? 'text-emerald-500' : 'text-amber-500'}`}>{Math.round(slaAvg)}/100</span></div>
             <div className="flex gap-3"><button className="px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:border-[color:var(--color-brand-200)] hover:bg-[color:var(--color-brand-50)] hover:text-[color:var(--color-brand-700)] transition-all flex items-center gap-2 group"><ExternalLink size={18} className="group-hover:scale-110 transition-transform" />Contract</button><button onClick={() => setIsQbrModalOpen(true)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"><Zap size={18} className="fill-yellow-400 text-yellow-400" />Run QBR</button></div>
          </div>
        </div>
      </div>

       {/* Tabs */}
       <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit">
        {[{ id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> }, { id: 'rates', label: 'MSA Rate Card', icon: <CreditCard size={16} /> }, { id: 'analytics', label: 'Spend Analytics', icon: <BarChart3 size={16} /> }].map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id as 'overview' | 'rates' | 'analytics')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-[color:var(--color-brand-600)] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>{tab.icon}{tab.label}</button>))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard icon={<DollarSign size={24} />} iconBgColor="bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)]" title="Total Spend (YTD)" value={`$${(totalSpend / 1000).toFixed(1)}k`} trend={{text: "+12%", color: "green"}} />
                <StatCard icon={<ShieldCheck size={24} />} iconBgColor="bg-teal-50 text-teal-600" title="Avg SLA Adherence" value={`${slaAvg.toFixed(1)}%`} trend={{text: slaAvg >= 99 ? "Stable" : "At Risk", color: slaAvg >= 99 ? "green" : "amber"}} />
                <StatCard icon={<Target size={24} />} iconBgColor="bg-rose-50 text-rose-600" title="Open Action Items" value={openActionItems.toString()} trend={{text: "Active", color: "blue"}} />
                <StatCard icon={<FileCheck size={24} />} iconBgColor="bg-blue-50 text-blue-600" title="Invoices Processed" value={vendorInvoices.length.toString()} trend={{text: "90 Days", color: "amber"}} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Velocity vs Quality Chart */}
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-[color:var(--color-brand-600)] rounded-full"></div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Performance Trends</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Velocity vs. Bugs</p>
                    </div>
                  </div>
                  <Bug className="text-slate-300" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReComposedChart data={combinedPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#f87171' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar yAxisId="left" dataKey="velocity" name="Velocity" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
                      <Line yAxisId="right" type="monotone" dataKey="bugs" name="Bugs" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} />
                    </ReComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

               {/* SLA Chart */}
               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-teal-600 rounded-full"></div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">SLA Consistency</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Availability %</p>
                    </div>
                  </div>
                  <Timer className="text-slate-300" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReAreaChart data={slaPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorSla" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <YAxis domain={[95, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={3} fill="url(#colorSla)" />
                      <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                    </ReAreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30"><h3 className="font-black text-slate-800 flex items-center gap-3"><Activity className="text-slate-400" size={20} /> Recent Governance Events</h3></div>
                <div className="divide-y divide-slate-100">
                    {vendorEvents.length > 0 ? vendorEvents.map((event) => (
                         <div key={event.id} className="p-6 flex items-start gap-6 hover:bg-slate-50 transition-colors">
                            <div className="shrink-0 w-16 text-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-2xl font-black text-slate-800 block leading-none mt-1">{new Date(event.date).getDate()}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{event.summary}</h4>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] font-black bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)] px-2 py-1 rounded-md uppercase tracking-wider">{event.type}</span>
                                    <span className="text-[10px] font-bold text-slate-400 px-2 py-1 flex items-center gap-1"><CheckCircle2 size={12} /> {event.actionItems.length} Actions</span>
                                </div>
                            </div>
                         </div>
                    )) : (
                        <div className="p-12 text-center text-slate-400 font-medium">No recent events recorded.</div>
                    )}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[color:var(--color-brand-50)] text-[color:var(--color-brand-600)] rounded-2xl"><CreditCard size={24} /></div>
                        <div>
                            <h3 className="font-black text-slate-800 text-lg">MSA Rate Card</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Effective {rateCard ? new Date(rateCard.effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </p>
                        </div>
                    </div>
                    {rateCard && <span className="text-sm font-bold bg-slate-100 text-slate-600 px-4 py-2 rounded-xl">{rateCard.currency}</span>}
                </div>
                {rateCard ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rateCard.roles.map((role, idx) => (
                            <div key={idx} className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/50 hover:bg-white hover:border-slate-200 transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    <Briefcase size={16} className="text-slate-400 group-hover:text-[color:var(--color-brand-50)]0 transition-colors" />
                                    <h4 className="font-bold text-slate-800">{role.role}</h4>
                                </div>
                                <div className="text-3xl font-black text-slate-900 flex items-baseline">
                                    ${role.rate}
                                    <span className="text-sm font-bold text-slate-400 ml-1">/hr</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-slate-500 font-medium">No rate card available for this vendor.</p>
                    </div>
                )}
            </div>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Spend */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-[color:var(--color-brand-600)] rounded-full"></div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Monthly Spend</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Last 6 Months</p>
                            </div>
                        </div>
                        <DollarSign className="text-slate-300" />
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReAreaChart data={monthlySpendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSpendDetail" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={(val) => `$${val/1000}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="amount" name="Spend" stroke="#D93A28" strokeWidth={3} fillOpacity={1} fill="url(#colorSpendDetail)" />
                            </ReAreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Spend by Role */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1._5 h-8 bg-purple-600 rounded-full"></div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Spend by Role</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">All Time Breakdown</p>
                            </div>
                        </div>
                        <Users className="text-slate-300" />
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={spendByRole} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" name="Spend" radius={[0, 6, 6, 0]} barSize={20} fill="#D93A28" />
                            </ReBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            {/* Recent Invoices */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="font-black text-slate-800 flex items-center gap-3"><FileText className="text-slate-400" size={20} /> Recent Invoices</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice #</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                <th className="text-left py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="text-left py-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendorInvoices.slice(0, 5).map(inv => (
                                <tr key={inv.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-8 text-sm font-bold text-slate-700">{inv.invoiceNumber}</td>
                                    <td className="py-4 px-6 text-sm text-slate-500">{inv.date}</td>
                                    <td className="py-4 px-6 text-sm font-black text-slate-800">${inv.amount.toLocaleString()}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getStatusClass(inv.status)}`}>
                                            {getStatusIcon(inv.status)}
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-8">
                                        <Link to={`/finance`} className="text-xs font-bold text-[color:var(--color-brand-600)] hover:underline">View Audit</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* QBR Generation Modal */}
      <Modal isOpen={isQbrModalOpen} onClose={() => { setIsQbrModalOpen(false); resetQBRState(); }} title={`QBR Generator: ${currentVendor.name}`} maxWidth="max-w-4xl">
        <div className="min-h-[60vh] flex flex-col justify-center">
            {!qbrResult && !isGenerating && (
              <div className="text-center p-8 animate-in fade-in zoom-in-95">
                <div className="w-24 h-24 bg-[color:var(--color-brand-50)] rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-[color:var(--color-brand-100)]/50"><FileOutput size={40} className="text-[color:var(--color-brand-600)]" /></div>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Ready to Run QBR Analysis</h3>
                <p className="text-slate-500 font-medium mt-3 max-w-2xl mx-auto">The Agentic Layer will analyze historical performance and governance data to generate a strategic QBR. Please confirm the data context below.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-10 text-left">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center gap-4"><BarChart size={24} className="text-slate-400" /><div className="flex-1"><p className="font-black text-slate-800 text-3xl">{vendorMetrics.length}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Metrics</p></div></div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center gap-4"><HardDrive size={24} className="text-slate-400" /><div className="flex-1"><p className="font-black text-slate-800 text-3xl">{vendorInvoices.length}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Financial Audits</p></div></div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center gap-4"><MessageSquare size={24} className="text-slate-400" /><div className="flex-1"><p className="font-black text-slate-800 text-3xl">{vendorEvents.length}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Governance Syncs</p></div></div>
                </div>
                <button onClick={handleGenerateQBR} className="mt-12 px-12 py-5 bg-[color:var(--color-brand-600)] text-white rounded-2xl font-black text-sm shadow-xl shadow-[color:var(--color-brand-200)] hover:bg-[color:var(--color-brand-700)] hover:scale-105 transition-all flex items-center gap-3 mx-auto"><Sparkles size={18} />Confirm & Generate</button>
              </div>
            )}

            {isGenerating && (
              <div className="text-center p-8 space-y-8 animate-in fade-in">
                <div className="relative w-32 h-32 mx-auto">
                    <div className="w-full h-full border-8 border-[color:var(--color-brand-100)] rounded-full"></div>
                    <div className="absolute inset-0 border-8 border-transparent border-t-[color:var(--color-brand-600)] rounded-full animate-spin"></div>
                    <Zap size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[color:var(--color-brand-50)]0 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Agent is Thinking...</h3>
                <div className="flex justify-center items-center gap-4 text-sm font-bold text-slate-500"><BarChart size={16} className="animate-pulse" />Analyzing Metrics... <HardDrive size={16} className="animate-pulse delay-200" />Auditing Financials... <MessageSquare size={16} className="animate-pulse delay-500" />Synthesizing Meetings...</div>
              </div>
            )}
            
            {qbrResult && !isExporting && !exportSuccess && (
                <div className="p-4 animate-in fade-in zoom-in-95 space-y-6">
                    <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-2xl relative overflow-hidden group"><div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FileText size={64} /></div><h4 className="text-[10px] font-black text-[color:var(--color-brand-400)] uppercase mb-4 tracking-widest flex items-center gap-2"><Target size={14} />Agentic Analysis</h4><p className="text-sm text-[color:var(--color-brand-50)] leading-relaxed font-bold italic">"{qbrResult.executiveSummary}"</p></div>
                    <div className="space-y-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Recommendations</h4><div className="space-y-3">{qbrResult.recommendations.map((r: string, i: number) => (<div key={i} className="flex gap-3 text-sm text-slate-700 font-bold p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="w-2 h-2 bg-[color:var(--color-brand-50)]0 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></span>{r}</div>))}</div></div>
                    <div className="pt-6 border-t border-slate-100 flex justify-end"><button onClick={handlePrepareSlides} className="px-8 py-4 bg-white border-2 border-[color:var(--color-brand-100)] text-[color:var(--color-brand-700)] rounded-2xl font-black text-sm hover:bg-[color:var(--color-brand-50)] transition-all flex items-center justify-center gap-2 group"><Presentation size={18} />Preview & Export to Slides</button></div>
                </div>
            )}

            {(isExporting && !showSlidePreview) && (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in w-full max-w-lg mx-auto my-auto">
                <div className="flex items-center justify-between"><span className="text-sm font-black text-[color:var(--color-brand-600)] uppercase tracking-widest flex items-center gap-2"><Loader2 size={16} className="animate-spin" />Workspace Integration Active</span><span className="text-xs font-bold text-slate-400">Step {exportStep + 1}/4</span></div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden"><div className="bg-[color:var(--color-brand-600)] h-full transition-all duration-500 ease-out" style={{ width: `${(exportStep + 1) * 25}%` }}></div></div>
                <p className="text-sm text-slate-500 font-medium text-center">{exportSteps[exportStep]}</p>
              </div>
            )}

            {exportSuccess && (
              <div className="text-center p-8 space-y-6 animate-in zoom-in-95">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-100"><CheckCircle2 size={48} className="text-green-600" /></div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">QBR Deck Exported!</h3>
                  <p className="text-slate-500 font-medium">The Agent has successfully created your Google Slides presentation.</p>
                  <a href={exportUrl!} target="_blank" rel="noreferrer" className="mt-8 px-10 py-4 bg-green-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-green-200 hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-3 mx-auto w-fit">Open in Slides <ExternalLink size={16} /></a>
              </div>
            )}
        </div>
      </Modal>

      {showSlidePreview && slidesData && (
        <Modal isOpen={showSlidePreview} onClose={() => setShowSlidePreview(false)} title="Slide Deck Preview" maxWidth="max-w-4xl">
          <div className="w-full max-w-3xl aspect-video bg-white shadow-xl rounded-xl border border-slate-200 relative overflow-hidden flex flex-col mx-auto">
            <div className="h-16 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center px-8 shrink-0"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-[color:var(--color-brand-600)] rounded-lg flex items-center justify-center text-white font-black text-xs">A</div><span className="text-white/80 font-bold text-sm uppercase tracking-wider">Agentic Governance</span></div></div>
            <div className="flex-1 p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-black text-slate-800 mb-8 leading-tight">{slidesData[currentSlideIndex].title}</h2>
                <div className="space-y-4">
                    {slidesData[currentSlideIndex].content.map((point: string, i: number) => (
                        <div key={i} className="flex gap-4"><span className="w-2 h-2 bg-[color:var(--color-brand-50)]0 rounded-full mt-2.5 shrink-0"></span><p className="text-lg text-slate-600 font-medium leading-relaxed">{point}</p></div>
                    ))}
                </div>
                {/* Dynamic Visual Injection */}
                {renderSlideVisual(slidesData[currentSlideIndex].visualType)}
            </div>
            <div className="h-12 border-t border-slate-100 px-8 flex items-center justify-between text-xs font-bold text-slate-400 bg-white shrink-0"><span>Q1 2024 Business Review</span><span>{currentSlideIndex + 1} / {slidesData.length}</span></div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4"><button onClick={prevSlide} disabled={currentSlideIndex === 0} className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"><ChevronLeft size={20} /></button><span className="text-sm font-black text-slate-600 w-16 text-center">{currentSlideIndex + 1} of {slidesData.length}</span><button onClick={nextSlide} disabled={currentSlideIndex === slidesData.length - 1} className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"><ChevronRight size={20} /></button></div>
            <div className="flex gap-3"><button onClick={() => setShowSlidePreview(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button><button onClick={handleFinalizeExport} className="px-8 py-3 bg-[color:var(--color-brand-600)] text-white rounded-xl font-black shadow-lg shadow-[color:var(--color-brand-200)] hover:bg-[color:var(--color-brand-700)] hover:scale-105 transition-all flex items-center gap-2"><LayoutTemplate size={18} />Export Deck (Slides / PPTX)</button></div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default VendorDetail;
