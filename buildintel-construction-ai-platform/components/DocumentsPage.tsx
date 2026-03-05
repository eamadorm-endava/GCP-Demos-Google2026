import React, { useState } from 'react';
import { ProjectData } from '../types';
import { FileText, Download, Search, FileSpreadsheet, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface DocumentsPageProps {
  data: ProjectData;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredDocs = data.documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return FileText;
      case 'XLSX': return FileSpreadsheet;
      case 'DWG': return ImageIcon;
      default: return FileText;
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-transparent p-6 lg:p-8 space-y-6 custom-scrollbar relative">
      <div className="absolute inset-0 bg-endava-dark -z-10" />
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Project Documents</h2>
          <p className="text-endava-blue-40 text-sm">Centralized repository with AI-powered search.</p>
        </div>
        <button
          onClick={() => showToast('Upload dialog would open here — demo mode')}
          className="bg-endava-orange hover:bg-endava-orange/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-endava-orange/20"
        >
          Upload New
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-endava-blue-50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents by name, category, or type..."
          className="w-full bg-endava-blue-90/80 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-endava-orange/50 focus:border-endava-orange/50 placeholder-endava-blue-40 backdrop-blur-sm shadow-inner transition-all"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDocs.length === 0 && searchQuery ? (
          <div className="col-span-full text-center py-12">
            <Search className="w-10 h-10 text-endava-blue-50 mx-auto mb-3" />
            <p className="text-endava-blue-40 text-sm">No documents match "{searchQuery}"</p>
          </div>
        ) : (
          filteredDocs.map(doc => {
            const Icon = getIcon(doc.type);
            return (
              <div key={doc.id} className="bg-endava-blue-90/50 border border-white/10 rounded-xl p-4 hover:border-endava-orange/50 hover:bg-white/5 transition-all group cursor-pointer backdrop-blur-sm shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-endava-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="p-3 bg-endava-blue-80 rounded-lg group-hover:bg-endava-blue-90 border border-white/5 transition-colors shadow-inner">
                    <Icon className="w-6 h-6 text-endava-orange group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-[10px] font-bold text-endava-blue-30 bg-endava-blue-90 px-2 py-1 rounded border border-white/5 shadow-sm uppercase tracking-wider">
                    {doc.type}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 truncate group-hover:text-endava-orange transition-colors relative z-10" title={doc.name}>{doc.name}</h3>
                <p className="text-xs text-endava-blue-40 mb-4 relative z-10">{doc.category} • {doc.date}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/10 relative z-10">
                  <span className="text-xs text-endava-blue-50 font-medium">{doc.size}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); showToast(`Downloading ${doc.name}...`); }}
                    className="text-endava-blue-40 hover:text-endava-orange transition-colors bg-white/5 p-1.5 rounded-md hover:bg-white/10"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Upload Placeholder */}
        <div
          onClick={() => showToast('Upload dialog would open here — demo mode')}
          className="border-2 border-dashed border-white/10 bg-endava-blue-90/30 rounded-xl p-4 flex flex-col items-center justify-center text-endava-blue-50 hover:border-endava-orange/50 hover:text-endava-orange hover:bg-endava-orange/5 transition-all cursor-pointer min-h-[160px] backdrop-blur-sm group"
        >
          <PlusIcon className="w-8 h-8 mb-2 opacity-70 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Drop files here</span>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-endava-blue-90 border border-white/10 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in-up z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white">{toast}</span>
        </div>
      )}
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

export default DocumentsPage;