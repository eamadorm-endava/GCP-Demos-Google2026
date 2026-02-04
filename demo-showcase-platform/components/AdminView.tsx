
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useStore } from '../store/useStore';
import { X, Sparkles, Globe, Loader2, Save, Terminal, AlertCircle } from 'lucide-react';
import { VerticalConfig } from '../types';

const AdminView: React.FC = () => {
  const setAdminOpen = useStore((state) => state.setAdminOpen);
  const addVertical = useStore((state) => state.addVertical);
  const availableVerticals = useStore((state) => state.availableVerticals);
  
  const [activeTab, setActiveTab] = useState<'ai' | 'external'>('ai');
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
        model: 'gemini-3-pro-preview',
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

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-4xl bg-[#121417] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col h-full max-h-[85vh]">
        
        <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-white/5">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
              <Terminal className="w-8 h-8 text-[#DE411B]" />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Showcase <span className="text-[#DE411B]">Control Center</span></h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Demo Deployment Console</p>
            </div>
          </div>
          <button onClick={() => setAdminOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-8 h-8 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b border-white/5 flex-shrink-0">
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-6 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${activeTab === 'ai' ? 'text-[#DE411B] bg-white/5 border-b-2 border-[#DE411B]' : 'text-gray-500 hover:text-white'}`}
          >
            <Sparkles className="w-5 h-5" /> AI Generator
          </button>
          <button 
            onClick={() => setActiveTab('external')}
            className={`flex-1 py-6 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${activeTab === 'external' ? 'text-[#DE411B] bg-white/5 border-b-2 border-[#DE411B]' : 'text-gray-500 hover:text-white'}`}
          >
            <Globe className="w-5 h-5" /> External Link
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 md:p-12 custom-scrollbar">
          {activeTab === 'ai' ? (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Prototype Description</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A digital twin dashboard for an automated warehouse in Berlin..."
                  className="w-full h-48 bg-black/40 border border-white/10 rounded-3xl p-6 text-xl font-light focus:border-[#DE411B]/50 focus:ring-1 focus:ring-[#DE411B]/20 transition-all outline-none resize-none"
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
                className="w-full py-6 rounded-2xl bg-[#DE411B] hover:bg-[#c43616] text-white font-black text-xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#DE411B]/20"
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
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Display Title</label>
                  <input 
                    value={externalForm.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="e.g., Cloud Supply Chain"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-[#DE411B]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Unique Identifier</label>
                  <input 
                    value={externalForm.id}
                    readOnly
                    placeholder="Auto-generated"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-gray-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">URL</label>
                <input 
                  value={externalForm.url}
                  onChange={e => setExternalForm({...externalForm, url: e.target.value})}
                  placeholder="https://console.cloud.google.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold outline-none focus:border-[#DE411B]"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-xs font-black text-white uppercase tracking-widest">Overview Pitch</label>
                <input 
                  value={externalForm.problem}
                  onChange={e => setExternalForm({...externalForm, problem: e.target.value})}
                  placeholder="The Problem..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none mb-3"
                />
                <input 
                  value={externalForm.solution}
                  onChange={e => setExternalForm({...externalForm, solution: e.target.value})}
                  placeholder="The Solution..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none mb-3"
                />
              </div>

              <button 
                onClick={handleSaveExternal}
                className="w-full py-5 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center gap-4 transition-all active:scale-95 hover:bg-[#DE411B] hover:text-white"
              >
                <Save className="w-6 h-6" />
                DEPLOY TO SHOWCASE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
