
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { INVOICES as INITIAL_INVOICES, VENDORS, RATE_CARDS } from '../constants';
import { AuditStatus, Invoice } from '../types';
import { 
  FileText, 
  Search, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ChevronLeft,
  ChevronRight, 
  HardDrive, 
  Upload, 
  Loader2, 
  ShieldCheck,
  Plus,
  CheckSquare,
  X,
  FileSearch,
  Database,
  Zap,
  CreditCard,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Filter,
  ArrowRightLeft
} from 'lucide-react';
import { parseInvoiceAndAudit } from '../geminiService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

type Tab = 'invoices' | 'rates' | 'analytics';

const ITEMS_PER_PAGE = 8;

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-20 px-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileSearch size={24} className="text-slate-400" />
        </div>
        <h3 className="font-black text-slate-700">No Invoices Found</h3>
        <p className="text-slate-500 mt-2 text-sm">{message}</p>
    </div>
);

const FinanceHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [processingFile, setProcessingFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [auditResult, setAuditResult] = useState<Invoice | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const initialStatusFilter = searchParams.get('status');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | 'all' | 'critical'>(
    initialStatusFilter === 'critical' ? 'critical' : 'all'
  );
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const auditSteps = [
    "Ingesting PDF & Extracting Text...",
    "Cross-referencing MSA Rate Cards...",
    "Detecting Compliance Flags...",
    "Finalizing Auditor Report..."
  ];

  // Analytics Data Preparation
  const spendData = useMemo(() => {
    // Mocking monthly trend data
    return [
      { month: 'Oct', budget: 400000, spend: 380000 },
      { month: 'Nov', budget: 400000, spend: 395000 },
      { month: 'Dec', budget: 420000, spend: 410000 },
      { month: 'Jan', budget: 420000, spend: 405000 },
      { month: 'Feb', budget: 450000, spend: 435000 },
      { month: 'Mar', budget: 450000, spend: 458000 }, // Over budget
    ];
  }, []);

  const vendorSpend = useMemo(() => {
    return VENDORS.map(v => {
      let colorHex = '#4f46e5';
      if (v.color === 'teal') colorHex = '#0d9488';
      else if (v.color === 'orange') colorHex = '#f97316';
      else if (v.color === 'purple') colorHex = '#8b5cf6';
      else if (v.color === 'rose') colorHex = '#e11d48';
      else if (v.color === 'blue') colorHex = '#2563eb';

      return {
        name: v.name,
        value: invoices.filter(i => i.vendorId === v.id).reduce((acc, curr) => acc + curr.amount, 0),
        color: colorHex
      };
    });
  }, [invoices]);
  
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
        const vendor = VENDORS.find(v => v.id === invoice.vendorId);
        const searchTermLower = searchTerm.toLowerCase();

        // Vendor Filter
        if (vendorFilter !== 'all' && invoice.vendorId !== vendorFilter) {
          return false;
        }

        const matchesSearch = 
            invoice.invoiceNumber.toLowerCase().includes(searchTermLower) ||
            vendor?.name.toLowerCase().includes(searchTermLower) ||
            invoice.amount.toString().includes(searchTermLower);

        if (!matchesSearch) return false;

        if (statusFilter === 'all') return true;
        if (statusFilter === 'critical') {
            return invoice.status === AuditStatus.Flagged || invoice.status === AuditStatus.Rejected;
        }
        return invoice.status === statusFilter;
    });
  }, [invoices, searchTerm, statusFilter, vendorFilter]);

  // Aggregate Unique Roles for Comparison Table
  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    Object.values(RATE_CARDS).forEach(card => {
        card.roles.forEach(r => roles.add(r.role));
    });
    return Array.from(roles).sort();
  }, []);

  const paginatedInvoices = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInvoices, currentPage]);
  
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, vendorFilter]);

  useEffect(() => {
    let interval: number;
    if (isAuditing) {
      setAuditStep(0);
      interval = window.setInterval(() => {
        setAuditStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAuditing]);

  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.Passed: return <CheckCircle className="text-green-500" size={18} />;
      case AuditStatus.Flagged: return <AlertCircle className="text-amber-500" size={18} />;
      case AuditStatus.Rejected: return <AlertCircle className="text-red-500" size={18} />;
      default: return <Clock className="text-slate-400" size={18} />;
    }
  };

  const getStatusClass = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.Passed: return 'bg-green-50 text-green-700 border-green-200';
      case AuditStatus.Flagged: return 'bg-amber-50 text-amber-700 border-amber-200';
      case AuditStatus.Rejected: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    setProcessingFile(file.name);
    setIsAuditing(true);
    setAuditResult(null);
    
    // Default to the first vendor for rate card validation if unknown, or try to detect from filename?
    // For demo purposes, let's pick a random rate card or default to V1 if not detectable.
    // In a real app, the Agent would detect the vendor first.
    const rateCardToUse = RATE_CARDS['v1']; 

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const result = await parseInvoiceAndAudit(base64Data, file.type, rateCardToUse);
        
        const newInvoice: Invoice = {
          id: `inv-${Date.now()}`,
          vendorId: VENDORS.find(v => result.vendorName.includes(v.name))?.id || 'v1',
          invoiceNumber: result.invoiceNumber,
          date: result.date || new Date().toISOString().split('T')[0],
          amount: result.amount,
          status: result.status as AuditStatus,
          agentNotes: result.agentNotes,
          lineItems: result.lineItems
        };

        setInvoices(prev => [newInvoice, ...prev]);
        setSelectedInvoice(newInvoice);
        setActiveTab('invoices');
        
        setIsAuditing(false);
        setProcessingFile(null);
        setDragActive(false);
        setAuditResult(newInvoice);
      };
    } catch (error) {
      console.error("Audit failed", error);
      alert("Failed to audit invoice. The Auditor Agent encountered an error.");
      setIsAuditing(false);
      setProcessingFile(null);
      setDragActive(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredInvoices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInvoices.map(inv => inv.id)));
    }
  };

  const toggleSelectOne = (e: React.MouseEvent | React.ChangeEvent, id: string) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkAction = (newStatus: AuditStatus) => {
    setInvoices(prev => prev.map(inv => 
      selectedIds.has(inv.id) ? { ...inv, status: newStatus } : inv
    ));
    setSelectedIds(new Set());
  };
  
  const handlePostAuditAction = (invoiceId: string, newStatus: AuditStatus) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv)
    );
    
    if (selectedInvoice?.id === invoiceId) {
      setSelectedInvoice(prev => prev ? { ...prev, status: newStatus } : null);
    }
  
    setAuditResult(null);
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'critical', label: 'Critical' },
    { value: AuditStatus.Passed, label: 'Passed' },
    { value: AuditStatus.Flagged, label: 'Flagged' },
    { value: AuditStatus.Rejected, label: 'Rejected' },
    { value: AuditStatus.Pending, label: 'Pending' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" size={32} />
            Financial Hub
          </h2>
          <p className="text-slate-400 text-sm mt-1">Agentic auditing for multi-vendor invoice reconciliation.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by invoice, vendor, rate..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all w-72"
            />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-900 shadow-xl transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            Add Invoice
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
              className="hidden" 
              accept="application/pdf,image/*" 
            />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'invoices', label: 'Invoices', icon: <FileText size={16} /> },
          { id: 'rates', label: 'Rate Comparison', icon: <ArrowRightLeft size={16} /> },
          { id: 'analytics', label: 'Portfolio Analytics', icon: <BarChart3 size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.size > 0 && activeTab === 'invoices' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-slate-900 text-white p-4 px-6 rounded-3xl flex items-center gap-8 shadow-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-black">
                {selectedIds.size} SELECTED
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkAction(AuditStatus.Passed)}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl text-xs font-black hover:bg-green-600 transition-all"
              >
                <CheckSquare size={16} />
                APPROVE ALL
              </button>
              <button 
                onClick={() => handleBulkAction(AuditStatus.Flagged)}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-black hover:bg-amber-600 transition-all"
              >
                <AlertCircle size={16} />
                DISPUTE ALL
              </button>
              <button 
                onClick={() => setSelectedIds(new Set())}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Upload & Drag Zone - Only on Invoices Tab */}
      {activeTab === 'invoices' && (
        <div 
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
          className={`relative border-4 border-dashed rounded-[2.5rem] p-12 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden group ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50 scale-[1.02] shadow-2xl shadow-indigo-100' 
              : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50'
          }`}
        >
          {isAuditing ? (
            <div className="flex flex-col items-center gap-8 py-4 w-full max-w-lg animate-in fade-in zoom-in-95">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-pulse" size={32} />
              </div>
              <div className="space-y-4 w-full">
                <div className="flex flex-col gap-2">
                  <p className="font-black text-2xl text-slate-800">Agentic Audit in Progress</p>
                  <p className="text-slate-400 font-medium text-sm">Processing: <span className="text-indigo-600 font-bold">{processingFile}</span></p>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(79,70,229,0.5)]" 
                      style={{ width: `${(auditStep + 1) * 25}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" />
                      {auditSteps[auditStep]}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Step {auditStep + 1} of 4</span>
                  </div>
                </div>
              </div>
            </div>
          ) : auditResult ? (
            <div className="flex flex-col items-center gap-6 py-4 w-full max-w-lg animate-in fade-in zoom-in-95">
              <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
                <ShieldCheck size={48} />
              </div>
              <div className="text-center">
                <h3 className="font-black text-3xl text-slate-800 tracking-tight">Audit Complete</h3>
                <p className="text-slate-500 font-medium mt-2">
                  Invoice <span className="font-bold text-slate-700">{auditResult.invoiceNumber}</span> has been processed.
                </p>
                <p className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black border uppercase tracking-wider ${getStatusClass(auditResult.status)}`}>
                  {getStatusIcon(auditResult.status)}
                  Agent Suggests: {auditResult.status}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <button
                  onClick={() => handlePostAuditAction(auditResult.id, AuditStatus.Passed)}
                  className="px-8 py-4 bg-green-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-green-200 hover:bg-green-700 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Approve Invoice
                </button>
                <button
                  onClick={() => handlePostAuditAction(auditResult.id, AuditStatus.Flagged)}
                  className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-amber-200 hover:bg-amber-600 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                >
                  <AlertCircle size={18} />
                  Dispute Invoice
                </button>
              </div>
              <button 
                onClick={() => setAuditResult(null)}
                className="text-xs font-bold text-slate-400 mt-4 hover:text-slate-600 transition-colors"
              >
                Decide Later
              </button>
            </div>
          ) : (
            <>
              <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Upload className="text-indigo-600 group-hover:animate-bounce" size={48} />
              </div>
              <h3 className="font-black text-3xl text-slate-800 tracking-tight">Drop Invoice to Start Audit</h3>
              <p className="text-slate-400 text-lg mt-3 max-w-md font-medium">
                Drag your vendor PDF here for real-time <span className="text-indigo-600 font-black">MSA Rate Card</span> validation.
              </p>
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95"
                >
                  Select File
                </button>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold px-4">
                  <ShieldCheck size={14} />
                  SOC2 Compliant Audit
                </div>
              </div>
            </>
          )}
          
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Invoice List */}
          <div className={`${selectedInvoice ? 'xl:col-span-8' : 'xl:col-span-12'} bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-500`}>
            <div className="p-8 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/30">
              <h3 className="font-black text-slate-800 flex items-center gap-2 text-lg">
                <Database className="text-slate-400" size={20} />
                Invoice History
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative group">
                  <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <select
                    value={vendorFilter}
                    onChange={(e) => setVendorFilter(e.target.value)}
                    className="pl-8 pr-8 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="all">All Vendors</option>
                    {VENDORS.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                {filterOptions.map(opt => (
                    <button 
                        key={opt.value} 
                        onClick={() => setStatusFilter(opt.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${statusFilter === opt.value ? 'bg-indigo-600 text-white shadow' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
                    >
                        {opt.label}
                    </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              {paginatedInvoices.length > 0 ? (
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="py-5 px-8 text-left w-12">
                        <button 
                          onClick={toggleSelectAll}
                          className="w-5 h-5 rounded-lg border-2 border-slate-300 flex items-center justify-center hover:border-indigo-500 transition-all"
                        >
                          {selectedIds.size === filteredInvoices.length && filteredInvoices.length > 0 ? (
                            <CheckSquare className="text-indigo-600" size={16} />
                          ) : selectedIds.size > 0 ? (
                            <div className="w-2.5 h-0.5 bg-indigo-600 rounded-full"></div>
                          ) : null}
                        </button>
                      </th>
                      <th className="text-left py-5 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                      <th className="text-left py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor</th>
                      <th className="text-left py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="text-left py-5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent Status</th>
                      <th className="text-left py-5 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedInvoices.map((inv) => (
                      <tr 
                        key={inv.id} 
                        className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${selectedInvoice?.id === inv.id ? 'bg-indigo-50/50' : ''} ${selectedIds.has(inv.id) ? 'bg-indigo-50/30' : ''}`}
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <td className="py-5 px-8">
                          <button 
                            onClick={(e) => toggleSelectOne(e, inv.id)}
                            className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${selectedIds.has(inv.id) ? 'border-indigo-600 bg-white' : 'border-slate-300 hover:border-indigo-500'}`}
                          >
                            {selectedIds.has(inv.id) && <CheckSquare className="text-indigo-600" size={16} />}
                          </button>
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl transition-colors ${selectedInvoice?.id === inv.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                              <FileText size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{inv.invoiceNumber}</span>
                              <span className="text-[10px] font-medium text-slate-400">{inv.date}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <Link 
                            to={`/vendor/${inv.vendorId}`} 
                            onClick={(e) => e.stopPropagation()} 
                            className="text-sm font-semibold text-indigo-600 hover:underline hover:text-indigo-700 flex items-center gap-1"
                          >
                            {VENDORS.find(v => v.id === inv.vendorId)?.name || 'Generic'}
                            <ArrowUpRight size={12} className="opacity-50" />
                          </Link>
                        </td>
                        <td className="py-5 px-6">
                          <span className="text-sm font-black text-slate-800">${inv.amount.toLocaleString()}</span>
                        </td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getStatusClass(inv.status)}`}>
                            {getStatusIcon(inv.status)}
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-5 px-8 text-right">
                          <ChevronRight size={18} className="text-slate-300 ml-auto group-hover:text-indigo-600 transition-all transform group-hover:translate-x-1" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState message="Try adjusting your search or filter criteria." />
              )}
            </div>
            {totalPages > 0 && (
              <div className="p-6 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">
                      Showing {paginatedInvoices.length} of {filteredInvoices.length} invoices
                  </span>
                  <div className="flex items-center gap-2">
                      <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage <= 1}
                          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-xs font-black text-slate-600 w-16 text-center">
                          Page {currentPage} of {totalPages}
                      </span>
                      <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage >= totalPages}
                          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight size={16} />
                      </button>
                  </div>
              </div>
            )}
          </div>

          {/* Auditor Detail Panel */}
          {selectedInvoice && (
            <div className="xl:col-span-4 space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-slate-800 text-lg">Auditor Report</h3>
                      <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md tracking-widest">VERIFIED</span>
                    </div>
                    <button onClick={() => setSelectedInvoice(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={48} className="text-indigo-600" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                        <FileSearch size={14} className="text-indigo-500" />
                        Agent Reasoning
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                        "{selectedInvoice.agentNotes}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extracted Item Analysis</p>
                      <div className="space-y-3">
                        {selectedInvoice.lineItems.map((item, idx) => {
                          const msaRate = RATE_CARDS[selectedInvoice.vendorId]?.roles.find((r: any) => r.role === item.role)?.rate;
                          const isRateDiscrepancy = item.discrepancy && msaRate && item.rate > msaRate;
                          const isRoleDiscrepancy = item.discrepancy && !msaRate;
                          const isHoursDiscrepancy = item.discrepancy && !isRateDiscrepancy && !isRoleDiscrepancy;
                          
                          return (
                          <div key={idx} className={`p-5 rounded-2xl border-2 transition-all relative group ${item.discrepancy ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className={`text-sm font-black ${isRoleDiscrepancy ? 'text-red-600' : 'text-slate-800'}`}>
                                  {item.role}
                                  {isRoleDiscrepancy && (
                                    <AlertCircle size={14} className="inline-block ml-1.5 mb-0.5 text-red-500" />
                                  )}
                                </p>
                                <div className="text-xs text-slate-500 font-medium mt-1">
                                  <span className={isHoursDiscrepancy ? 'text-red-600 font-bold' : ''}>
                                    {item.hours} hrs
                                    {isHoursDiscrepancy && (
                                      <AlertCircle size={12} className="inline-block ml-1 mb-0.5 text-red-500" />
                                    )}
                                  </span>
                                  {' × '}
                                  <span className={isRateDiscrepancy ? 'text-red-600 font-bold' : ''}>
                                    ${item.rate}/hr
                                    {isRateDiscrepancy && (
                                      <AlertCircle size={12} className="inline-block ml-1 mb-0.5 text-red-500" />
                                    )}
                                  </span>
                                  
                                  {isRateDiscrepancy && msaRate && (
                                      <span className="block text-red-600 font-bold mt-1">MSA Cap: ${msaRate}/hr</span>
                                  )}
                                  {isRoleDiscrepancy && (
                                    <span className="block text-red-600 font-bold mt-1">Role not found in MSA</span>
                                  )}
                                  {isHoursDiscrepancy && (
                                    <span className="block text-red-600 font-bold mt-1">Hours exceed weekly cap (see notes)</span>
                                  )}
                                </div>
                              </div>
                              <span className={`text-sm font-black ${item.discrepancy ? 'text-red-600' : 'text-slate-800'}`}>
                                ${item.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )})}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      <button 
                        onClick={() => {
                          setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: AuditStatus.Passed } : inv));
                          setSelectedInvoice({ ...selectedInvoice, status: AuditStatus.Passed });
                        }}
                        className="flex-1 px-6 py-4 bg-indigo-600 text-white text-xs font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest"
                      >
                        Approve Invoice
                      </button>
                      <button 
                        onClick={() => {
                          setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? { ...inv, status: AuditStatus.Flagged } : inv));
                          setSelectedInvoice({ ...selectedInvoice, status: AuditStatus.Flagged });
                        }}
                        className="px-6 py-4 bg-white border-2 border-slate-200 text-slate-600 text-xs font-black rounded-2xl hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest"
                      >
                        Dispute
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 relative group overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/50">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm uppercase tracking-widest leading-none">Smart Forecaster</h4>
                      <p className="text-indigo-400 text-[10px] font-bold mt-1">AI-POWERED INSIGHT</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed mb-6 font-medium">
                    "Globant's current burn rate is trending 14% above projected budget. AI recommends shift to junior offshore resources to maintain annual compliance."
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                      <span className="text-slate-400">Budget Consumed</span>
                      <span className="text-indigo-400">82%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[82%] shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rates' && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
             <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <ArrowRightLeft size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800">Rate Comparison Matrix</h3>
                    <p className="text-sm font-medium text-slate-500">Side-by-side Role & Rate Analysis across Vendors</p>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest sticky left-0 bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                Role / Title
                            </th>
                            {VENDORS.map(v => (
                                <th key={v.id} className="px-6 py-5 text-center min-w-[180px]">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs ${
                                          v.color === 'indigo' ? 'bg-indigo-600' : 
                                          v.color === 'teal' ? 'bg-teal-600' : 
                                          v.color === 'orange' ? 'bg-orange-500' : 
                                          v.color === 'rose' ? 'bg-rose-600' : 
                                          v.color === 'blue' ? 'bg-blue-600' : 'bg-purple-600'
                                        }`}>
                                            {v.name.charAt(0)}
                                        </div>
                                        <span className="text-xs font-black text-slate-700">{v.name}</span>
                                        <span className="text-[9px] font-bold text-slate-400">{v.msaId}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {uniqueRoles.map((role) => (
                            <tr key={role} className="hover:bg-indigo-50/20 transition-colors">
                                <td className="px-8 py-5 text-sm font-black text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-100">
                                    {role}
                                </td>
                                {VENDORS.map(v => {
                                    const rateInfo = RATE_CARDS[v.id]?.roles.find(r => r.role === role);
                                    return (
                                        <td key={v.id} className="px-6 py-5 text-center">
                                            {rateInfo ? (
                                                <div className="inline-block bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                                                    <span className="text-sm font-black text-slate-800">${rateInfo.rate}</span>
                                                    <span className="text-[10px] text-slate-400 ml-1">/hr</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 font-medium italic">-</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Showing rates from {VENDORS.length} active Vendor MSA Agreements
                </p>
            </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Main Trend Chart */}
           <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-800">Total Spend Velocity</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">6-Month Trend vs Budget</p>
                </div>
                <div className="flex items-center gap-2">
                   <span className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Actual
                   </span>
                   <span className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                      <div className="w-3 h-3 bg-slate-300 rounded-full"></div> Budget
                   </span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', color: '#64748b' }}
                    />
                    <Area type="monotone" dataKey="spend" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
                    <Area type="monotone" dataKey="budget" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Side Stats */}
           <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
                <h3 className="text-lg font-black text-slate-800 mb-6">Spend by Vendor</h3>
                <div className="space-y-4">
                  {vendorSpend
                    .filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((v, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                        <span>{v.name}</span>
                        <span>${(v.value / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(v.value / 400000) * 100}%`, backgroundColor: v.color }}></div>
                      </div>
                    </div>
                  ))}
                  {vendorSpend.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="text-center text-slate-400 text-xs py-4 font-medium">
                      No vendors found
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
                 <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-indigo-500 rounded-lg"><DollarSign size={20} /></div>
                     <h4 className="font-black text-sm uppercase tracking-widest">Savings Forecast</h4>
                   </div>
                   <p className="text-3xl font-black mb-2">$84,500</p>
                   <p className="text-indigo-200 text-xs font-medium">Projected Q2 savings via automated rate card enforcement.</p>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceHub;
