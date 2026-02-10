import React from 'react';
import { ProjectData } from '../types';
import { FileText, Download, Search, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';

interface DocumentsPageProps {
  data: ProjectData;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ data }) => {
  const getIcon = (type: string) => {
    switch(type) {
        case 'PDF': return FileText;
        case 'XLSX': return FileSpreadsheet;
        case 'DWG': return ImageIcon;
        default: return FileText;
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-6 custom-scrollbar">
      <header className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-white mb-1">Project Documents</h2>
            <p className="text-slate-400 text-sm">Centralized repository with AI-powered search.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Upload New
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Ask Gemini to find a clause in contracts or specs..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent placeholder-slate-600"
          />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.documents.map(doc => {
              const Icon = getIcon(doc.type);
              return (
                <div key={doc.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-primary-500/30 transition-all group cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                            <Icon className="w-6 h-6 text-[color:var(--color-brand-600)]" />
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded">
                            {doc.type}
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1 truncate" title={doc.name}>{doc.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">{doc.category} • {doc.date}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <span className="text-xs text-slate-500">{doc.size}</span>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
              );
          })}
          
          {/* Upload Placeholder */}
          <div className="border-2 border-dashed border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-slate-600 hover:border-slate-600 hover:text-slate-400 transition-colors cursor-pointer min-h-[160px]">
              <PlusIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-sm font-medium">Drop files here</span>
          </div>
      </div>
    </div>
  );
};

const PlusIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default DocumentsPage;