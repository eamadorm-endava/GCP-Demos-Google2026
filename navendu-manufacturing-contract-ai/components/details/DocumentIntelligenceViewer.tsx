
import React, { useState, useCallback, useRef } from 'react';
import { Contract } from '../../types.ts';
import { analyzeDocumentImage, generateDocumentPreview, DocumentAnalysisResult, DocumentPageAnalysis } from '../../services/ai.ts';

interface DocumentViewerProps {
  contract: Contract;
  onClose: () => void;
}

const MODEL_LABEL = 'gemini-3.1-flash-image-preview';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const riskColor = (level: string) => {
  const map: Record<string, string> = {
    Low: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    High: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    Critical: 'text-[#FF5640] bg-[#FF5640]/10 border-[#FF5640]/30',
  };
  return map[level] ?? map.Medium;
};

const pageIcon: Record<string, string> = {
  cover: '📄', terms: '📋', schedule: '📅',
  signature: '✍️', exhibit: '📎', amendment: '🔄',
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const RiskPill: React.FC<{ level: string }> = ({ level }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border ${riskColor(level)}`}>
    {level}
  </span>
);

const LoadingState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center gap-6">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 rounded-full border-[3px] border-[#FF5640]/20" />
      <div className="absolute inset-0 rounded-full border-[3px] border-t-[#FF5640] animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-8 h-8 text-[#FF5640]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    </div>
    <div className="text-center">
      <p className="text-white font-semibold text-lg">Analyzing Document…</p>
      <p className="text-white/40 text-sm mt-1">
        Powered by <span className="text-[#FF5640] font-mono">{MODEL_LABEL}</span>
      </p>
    </div>
    <div className="flex gap-1.5 mt-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full bg-[#FF5640]/60 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </div>
  </div>
);

const EmptyState: React.FC<{ contractTitle: string; onDemo: () => void }> = ({ contractTitle, onDemo }) => (
  <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 text-center">
    <div className="w-24 h-24 rounded-2xl bg-[#FF5640]/10 border border-[#FF5640]/20 flex items-center justify-center">
      <svg className="w-12 h-12 text-[#FF5640]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <div>
      <h3 className="text-white text-2xl font-bold">Document Intelligence</h3>
      <p className="text-white/50 text-sm mt-3 leading-relaxed max-w-sm mx-auto">
        Drop a contract image to the left for AI analysis, or run a demo simulation on{' '}
        <span className="text-white/80 font-medium italic">{contractTitle}</span>.
      </p>
    </div>
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF5640]/25 bg-[#FF5640]/5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5640] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5640]" />
      </span>
      <span className="text-xs font-semibold text-[#FF5640] uppercase tracking-widest">{MODEL_LABEL}</span>
    </div>
    <button
      onClick={onDemo}
      className="px-8 py-3.5 rounded-xl bg-[#FF5640] text-white font-bold text-sm hover:bg-[#FF5640]/90 transition-all shadow-lg shadow-[#FF5640]/25 hover:shadow-[#FF5640]/40 hover:-translate-y-0.5 active:translate-y-0"
    >
      ⚡ Run Demo Analysis
    </button>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ contract, onClose }) => {
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const [selectedPage, setSelectedPage] = useState<DocumentPageAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = useCallback(async (base64?: string, mime?: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setSelectedPage(null);
    try {
      const result = base64 && mime
        ? await analyzeDocumentImage(base64, mime)
        : await generateDocumentPreview(contract);
      setAnalysis(result);
      if (result.pages?.length) setSelectedPage(result.pages[0]);
    } catch (e: any) {
      setError(e.message ?? 'Analysis failed. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload a PNG, JPG or WEBP image.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
      runAnalysis(dataUrl.split(',')[1], file.type);
    };
    reader.readAsDataURL(file);
  }, [runAnalysis]);

  const reset = () => { setAnalysis(null); setUploadedImage(null); setSelectedPage(null); setError(null); };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#192B37' }}>
      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-white/10 flex-shrink-0" style={{ background: '#1f3340' }}>
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,86,64,0.15)', border: '1px solid rgba(255,86,64,0.3)' }}>
            <svg className="w-4 h-4 text-[#FF5640]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Document Intelligence</p>
            <p className="text-white/40 text-xs mt-0.5 leading-none truncate max-w-xs">{contract.contractTitle}</p>
          </div>
          <div className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#FF5640]/25 bg-[#FF5640]/8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5640] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF5640]" />
            </span>
            <span className="text-[#FF5640] text-[10px] font-mono font-semibold">{MODEL_LABEL}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <button onClick={reset} className="px-3 py-1.5 rounded-lg text-white/50 text-xs hover:text-white/80 hover:bg-white/5 transition-all">
              ↺ Reset
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ─── Body ─── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─── Left Sidebar ─── */}
        <div className="w-64 flex-shrink-0 flex flex-col border-r border-white/10 overflow-y-auto" style={{ background: '#1a2f3c' }}>
          {/* Upload zone */}
          <div className="p-4">
            <div
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden
                ${isDragging ? 'border-[#FF5640] bg-[#FF5640]/5 scale-[1.02]' : 'border-white/15 hover:border-[#FF5640]/50 hover:bg-white/3'}`}
            >
              {uploadedImage ? (
                <img src={uploadedImage} alt="Uploaded doc" className="w-full h-32 object-cover" />
              ) : (
                <div className="p-5 text-center">
                  <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,86,64,0.12)', border: '1px solid rgba(255,86,64,0.2)' }}>
                    <svg className="w-5 h-5 text-[#FF5640]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-xs font-medium">Drop document image</p>
                  <p className="text-white/25 text-[11px] mt-0.5">PNG · JPG · WEBP</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            {!analysis && !isLoading && (
              <button
                onClick={() => runAnalysis()}
                className="w-full mt-3 py-2.5 rounded-xl text-sm font-bold text-[#FF5640] transition-all hover:bg-[#FF5640]/15 border border-[#FF5640]/25 hover:border-[#FF5640]/50"
              >
                ⚡ Demo Mode
              </button>
            )}
          </div>

          {/* Page list */}
          {analysis?.pages && analysis.pages.length > 0 && (
            <div className="px-3 pb-4">
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold px-2 mb-2">
                {analysis.pages.length} Pages
              </p>
              <div className="space-y-1">
                {analysis.pages.map((page) => {
                  const active = selectedPage?.pageNumber === page.pageNumber;
                  return (
                    <button
                      key={page.pageNumber}
                      onClick={() => setSelectedPage(page)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150
                        ${active ? 'bg-[#FF5640]/15 border border-[#FF5640]/30' : 'hover:bg-white/5 border border-transparent'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base leading-none">{pageIcon[page.pageType] ?? '📄'}</span>
                          <span className={`text-sm font-medium capitalize ${active ? 'text-white' : 'text-white/70'}`}>{page.pageType}</span>
                        </div>
                        <span className="text-white/30 text-xs">p{page.pageNumber}</span>
                      </div>
                      {page.riskFlags.length > 0 && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-[#FF5640] text-[10px]">⚠</span>
                          <span className="text-[#FF5640]/70 text-[10px]">{page.riskFlags.length} flag{page.riskFlags.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {/* Confidence bar */}
                      <div className="mt-1.5 h-0.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#FF5640]/60 rounded-full" style={{ width: `${Math.round(page.confidence * 100)}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── Main Content ─── */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
              <div className="text-4xl">⚠️</div>
              <p className="text-white font-semibold">{error}</p>
              <button onClick={() => runAnalysis()} className="px-5 py-2.5 rounded-xl bg-[#FF5640]/15 border border-[#FF5640]/30 text-[#FF5640] text-sm font-semibold hover:bg-[#FF5640]/25 transition-all">
                Try Demo Mode
              </button>
            </div>
          ) : !analysis ? (
            <EmptyState contractTitle={contract.contractTitle} onDemo={() => runAnalysis()} />
          ) : (
            <div className="p-8 space-y-6 max-w-4xl mx-auto">
              {/* ── Doc Header ── */}
              <div className="rounded-2xl p-6 border border-white/10" style={{ background: '#1f3340' }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white/40 text-xs font-mono uppercase tracking-widest">{analysis.documentType}</span>
                      <RiskPill level={analysis.overallRisk} />
                    </div>
                    <h2 className="text-white text-xl font-bold leading-snug">{analysis.documentTitle}</h2>
                    <p className="text-white/55 text-sm mt-2 leading-relaxed max-w-2xl">{analysis.executiveSummary}</p>
                  </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/10">
                  {[
                    { label: 'Parties', value: analysis.parties.join(' · ') },
                    { label: 'Effective Date', value: analysis.effectiveDate },
                    { label: 'Total Value', value: analysis.totalValue },
                    { label: 'Governing Law', value: analysis.governingLaw },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold">{label}</p>
                      <p className="text-white text-sm font-medium mt-0.5 leading-snug">{value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Selected Page ── */}
              {selectedPage && (
                <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: '#1f3340' }}>
                  {/* Page header */}
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                    <span className="text-2xl">{pageIcon[selectedPage.pageType] ?? '📄'}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold capitalize">{selectedPage.pageType} Page</h3>
                        <span className="text-white/30 text-sm">· Page {selectedPage.pageNumber}</span>
                      </div>
                      <p className="text-white/50 text-sm mt-0.5">{selectedPage.summary}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider">Confidence</p>
                      <p className="text-white font-bold">{Math.round(selectedPage.confidence * 100)}%</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {/* Key Points */}
                    <div className="p-6">
                      <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">Key Points</p>
                      <ul className="space-y-3">
                        {selectedPage.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[#FF5640] text-[10px] font-bold">{i + 1}</span>
                            </span>
                            <span className="text-white/70 text-sm leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risk Flags */}
                    <div className="p-6">
                      <p className="text-[#FF5640]/70 text-xs uppercase tracking-widest font-semibold mb-4">
                        Risk Flags {selectedPage.riskFlags.length > 0 && `(${selectedPage.riskFlags.length})`}
                      </p>
                      {selectedPage.riskFlags.length === 0 ? (
                        <div className="flex items-center gap-2 text-emerald-400/70 text-sm">
                          <span>✓</span> No flags on this page
                        </div>
                      ) : (
                        <ul className="space-y-3">
                          {selectedPage.riskFlags.map((flag, i) => (
                            <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#FF5640]/8 border border-[#FF5640]/15">
                              <span className="text-[#FF5640] flex-shrink-0 mt-0.5">⚑</span>
                              <span className="text-white/70 text-sm leading-relaxed">{flag}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Red Flags + Recommendations ── */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Red Flags */}
                <div className="rounded-2xl border border-[#FF5640]/20 overflow-hidden" style={{ background: '#1f3340' }}>
                  <div className="px-5 py-4 border-b border-[#FF5640]/15" style={{ background: 'rgba(255,86,64,0.06)' }}>
                    <h4 className="text-[#FF5640] font-bold text-sm flex items-center gap-2">
                      <span>⚠</span> Red Flags
                      <span className="ml-auto text-[#FF5640]/50 font-mono text-xs">{analysis.redFlags.length}</span>
                    </h4>
                  </div>
                  <ul className="p-4 space-y-2">
                    {analysis.redFlags.length === 0 ? (
                      <li className="text-white/40 text-sm">None identified.</li>
                    ) : analysis.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/65 py-1.5">
                        <span className="text-[#FF5640] flex-shrink-0 mt-0.5">→</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="rounded-2xl border border-emerald-500/20 overflow-hidden" style={{ background: '#1f3340' }}>
                  <div className="px-5 py-4 border-b border-emerald-500/15" style={{ background: 'rgba(52,211,153,0.05)' }}>
                    <h4 className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                      <span>✓</span> Recommendations
                      <span className="ml-auto text-emerald-400/50 font-mono text-xs">{analysis.recommendations.length}</span>
                    </h4>
                  </div>
                  <ul className="p-4 space-y-2">
                    {analysis.recommendations.length === 0 ? (
                      <li className="text-white/40 text-sm">None provided.</li>
                    ) : analysis.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/65 py-1.5">
                        <span className="text-emerald-400 flex-shrink-0 mt-0.5">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
