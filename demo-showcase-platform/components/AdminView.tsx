
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useStore } from '../store/useStore';
import { X, Sparkles, Globe, Loader2, Save, Terminal, AlertCircle, UploadCloud, Image as ImageIcon, Trash2 } from 'lucide-react';
import { VerticalConfig } from '../types';

const AdminView: React.FC = () => {
  const setAdminOpen = useStore((state) => state.setAdminOpen);
  const addVertical = useStore((state) => state.addVertical);
  const availableVerticals = useStore((state) => state.availableVerticals);
  const setCustomLogo = useStore((state) => state.setCustomLogo);
  const customLogo = useStore((state) => state.customLogo);

  const [activeTab, setActiveTab] = useState<'ai' | 'external' | 'branding'>('ai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  // External Demo Form State
  const [externalForm, setExternalForm] = useState({
    title: '',
    id: '',
    url: '',
    problem: '',
    solution: '',
    talkingPoints: ['', '', '']
  });

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate ID from title for manual external form
  const handleTitleChange = (val: string) => {
    setExternalForm(prev => ({
      ...prev,
      title: val,
      id: `${slugify(val)}-${Math.random().toString(36).substring(2, 6)}`
    }));
  };

  const handleGenerateWithGemini = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Act as a senior solution architect for Endava and Google Cloud. Generate a comprehensive VerticalConfig JSON for a high-impact booth demo based on: "${prompt}".

        JSON STRUCTURE REQUIREMENTS:
        1. "id": A short, hyphenated lowercase slug (e.g. "smart-logistics").
        2. "title": Catchy title, max 3 words.
        3. "icon": Exactly one of: "shopping-cart", "stethoscope", "landmark", "factory", "globe".
        4. "color": Standard Tailwind bg color (e.g. "bg-violet-600").
        5. "pitch": (For the Overview screen)
           - "problem": 1 impactful sentence on the specific industry pain point.
           - "solution": 1 clear sentence on how Endava + Google Cloud solves it.
           - "talkingPoints": Exactly 3 bullet points, each with a specific realistic ROI/Metric.
        6. "dynamicData": (For the demo UI)
           - "stats": 4 items with "label", "value", and "trend" ("up"/"down"/"stable").
           - "logs": 5 detailed logs with unique "id", "event", "status" (OK/WARN), and "timestamp".
           - "chartData": 7 items with "name" (Days) and "value" (Numbers).

        Return ONLY the raw JSON.`,
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 8000 }
        }
      });

      const config = JSON.parse(response.text || '{}') as VerticalConfig;

      // Enforce unique ID
      let baseId = slugify(config.id || config.title || 'ai-demo');
      let finalId = `${baseId}-${Math.random().toString(36).substring(2, 7)}`;

      while (availableVerticals.some(v => v.id === finalId)) {
        finalId = `${baseId}-${Math.random().toString(36).substring(2, 7)}`;
      }

      const enhancedConfig: VerticalConfig = {
        ...config,
        id: finalId,
        isAiGenerated: true
      };

      addVertical(enhancedConfig);
      setAdminOpen(false);
    } catch (err) {
      console.error(err);
      setError("AI Engine encountered an error. Please refine your prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveExternal = () => {
    if (!externalForm.id || !externalForm.url) return;
    const config: VerticalConfig = {
      id: externalForm.id,
      title: externalForm.title || 'Untitled Demo',
      icon: 'globe',
      color: 'bg-indigo-600',
      externalUrl: externalForm.url,
      pitch: {
        problem: externalForm.problem,
        solution: externalForm.solution,
        talkingPoints: externalForm.talkingPoints.filter(p => p.trim())
      }
    };
    addVertical(config);
    setAdminOpen(false);
  };

  const handleFileDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let file: File | null = null;

    if ('dataTransfer' in e && e.dataTransfer.files.length > 0) {
      file = e.dataTransfer.files[0];
    } else if ('target' in e) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        file = target.files[0];
      }
    }

    if (file && (file.type.startsWith('image/svg') || file.type.startsWith('image/png') || file.type.startsWith('image/jpeg'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-4xl bg-endava-blue-90 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col h-full max-h-[85vh]">

        <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-endava-dark">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <Terminal className="w-8 h-8 text-endava-orange" />
            </div>
            <div>
              <h2 className="text-3xl font-medium uppercase tracking-tight">Showcase <span className="text-endava-orange">Control Center</span></h2>
              <p className="text-endava-blue-50 font-bold uppercase tracking-widest text-xs mt-1">Next '26 Deployment Console</p>
            </div>
          </div>
          <button onClick={() => setAdminOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-8 h-8 text-endava-blue-50" />
          </button>
        </div>

        <div className="flex border-b border-white/5 flex-shrink-0 bg-endava-dark">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-6 font-medium uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${activeTab === 'ai' ? 'text-endava-orange bg-white/5 border-b-2 border-endava-orange' : 'text-endava-blue-50 hover:text-white'}`}
          >
            <Sparkles className="w-5 h-5" /> AI Generator
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`flex-1 py-6 font-medium uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${activeTab === 'external' ? 'text-endava-orange bg-white/5 border-b-2 border-endava-orange' : 'text-endava-blue-50 hover:text-white'}`}
          >
            <Globe className="w-5 h-5" /> External Link
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex-1 py-6 font-medium uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${activeTab === 'branding' ? 'text-endava-orange bg-white/5 border-b-2 border-endava-orange' : 'text-endava-blue-50 hover:text-white'}`}
          >
            <ImageIcon className="w-5 h-5" /> Branding
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 md:p-12 custom-scrollbar bg-endava-blue-90">
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-4">
                <label className="text-xs font-black text-endava-blue-50 uppercase tracking-widest">Prototype Description</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A digital twin dashboard for an automated warehouse in Berlin..."
                  className="w-full h-48 bg-endava-dark border border-white/10 rounded-3xl p-6 text-xl font-light focus:border-endava-orange/50 focus:ring-1 focus:ring-endava-orange/20 transition-all outline-none resize-none text-white"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-bold text-sm">{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerateWithGemini}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-6 rounded-2xl bg-endava-orange hover:bg-[#d13f2d] text-white font-medium text-xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-endava-orange/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    ARCHITECTING SOLUTION...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-7 h-7" />
                    GENERATE PROTOTYPE
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'external' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-endava-blue-50 uppercase tracking-widest ml-2">Display Title</label>
                  <input
                    value={externalForm.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="e.g., Cloud Supply Chain"
                    className="w-full bg-endava-dark border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-endava-orange"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-endava-blue-50 uppercase tracking-widest ml-2">Unique Identifier</label>
                  <input
                    value={externalForm.id}
                    readOnly
                    placeholder="Auto-generated"
                    className="w-full bg-endava-dark border border-white/10 rounded-xl p-4 font-bold text-gray-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-endava-blue-50 uppercase tracking-widest ml-2">URL</label>
                <input
                  value={externalForm.url}
                  onChange={e => setExternalForm({ ...externalForm, url: e.target.value })}
                  placeholder="https://console.cloud.google.com/..."
                  className="w-full bg-endava-dark border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-endava-orange"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-xs font-black text-white uppercase tracking-widest">Overview Pitch</label>
                <input
                  value={externalForm.problem}
                  onChange={e => setExternalForm({ ...externalForm, problem: e.target.value })}
                  placeholder="The Problem..."
                  className="w-full bg-endava-dark border border-white/10 rounded-xl p-4 outline-none mb-3"
                />
                <input
                  value={externalForm.solution}
                  onChange={e => setExternalForm({ ...externalForm, solution: e.target.value })}
                  placeholder="The Solution..."
                  className="w-full bg-endava-dark border border-white/10 rounded-xl p-4 outline-none mb-3"
                />
              </div>

              <button
                onClick={handleSaveExternal}
                className="w-full py-5 rounded-2xl bg-white text-black font-medium text-lg flex items-center justify-center gap-4 transition-all active:scale-95 hover:bg-endava-orange hover:text-white"
              >
                <Save className="w-6 h-6" />
                DEPLOY TO SHOWCASE
              </button>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-white">Custom Logo Override</h3>
                <p className="text-endava-blue-40 text-sm">Upload a custom logo (SVG or PNG) to replace the default brand mark across the header and attract screen.</p>

                <div
                  className="border-2 border-dashed border-white/20 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:border-endava-orange hover:bg-endava-orange/5 transition-all cursor-pointer relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <input
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg"
                    onChange={handleFileDrop}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="bg-white/5 p-6 rounded-full mb-4">
                    <UploadCloud className="w-10 h-10 text-endava-blue-30" />
                  </div>
                  <p className="text-lg font-bold text-white">Drag & drop logo file here</p>
                  <p className="text-sm text-endava-blue-50 mt-2 font-bold uppercase tracking-widest">or click to browse</p>
                </div>
              </div>

              {customLogo && (
                <div className="bg-endava-dark p-8 rounded-3xl border border-white/10 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-endava-blue-50 uppercase tracking-widest">Current Override</p>
                    <img src={customLogo} alt="Custom Logo Preview" className="h-12 w-auto object-contain" />
                  </div>
                  <button
                    onClick={() => setCustomLogo(null)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-medium text-xs uppercase tracking-widest transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
