
import React, { useState, useCallback } from 'react';
import { EVENTS as INITIAL_EVENTS, VENDORS } from '../constants';
import { GovernanceEventType, GovernanceEvent } from '../types';
import { 
  Calendar, Plus, PlayCircle, CheckSquare, MessageSquare, 
  Mic, Square, Upload, Pause, Play, MicOff, X,
  Loader2, CheckCircle2, Sparkles
} from 'lucide-react';
import { useScribe } from '../hooks/useScribe';
import Modal from './common/Modal';

const MeetingHub: React.FC = () => {
  const [events, setEvents] = useState<GovernanceEvent[]>(INITIAL_EVENTS);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isScribing, setIsScribing] = useState(false);
  const [selectedScribeVendor, setSelectedScribeVendor] = useState(VENDORS[0].id);

  const [scheduleData, setScheduleData] = useState({
    vendorId: VENDORS[0].id,
    type: GovernanceEventType.MonthlySync,
    date: new Date().toISOString().split('T')[0],
    topic: ''
  });

  const onScribeComplete = useCallback((newEvent: GovernanceEvent) => {
    setEvents(prev => [newEvent, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    // Keep the scribe modal open on the "Done" screen for a bit
  }, []);

  const {
    isRecording, isPaused, recordingProgress, audioLevel, scribeStatus,
    startRecording, stopRecording, togglePause, processAudio, resetScribe
  } = useScribe(onScribeComplete, selectedScribeVendor);

  const handleScheduleEvent = () => {
    const newEvent: GovernanceEvent = {
      id: `e-${Date.now()}`,
      type: scheduleData.type,
      date: scheduleData.date,
      summary: `Scheduled: ${scheduleData.topic || 'Governance Sync'}`,
      vendorId: scheduleData.vendorId,
      actionItems: []
    };
    setEvents(prev => [newEvent, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setIsScheduling(false);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAudio(file);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Meeting & Cadence Hub</h2>
          <p className="text-slate-500 font-medium">Strategic alignment and automated governance reporting.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {
              setIsScribing(!isScribing);
              if (isScribing || scribeStatus === 'done' || scribeStatus === 'error') {
                 if (isRecording) stopRecording();
                 resetScribe();
              }
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-95 ${
              isScribing ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Mic size={18} />
            {isScribing ? 'Close Scribe' : 'Agentic Scribe'}
          </button>
          <button 
            onClick={() => setIsScheduling(true)}
            className="flex items-center gap-2 bg-[color:var(--color-brand-600)] text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-[color:var(--color-brand-700)] shadow-xl shadow-[color:var(--color-brand-100)] transition-all active:scale-95"
          >
            <Plus size={18} />
            Schedule Sync
          </button>
        </div>
      </div>

      <Modal isOpen={isScheduling} onClose={() => setIsScheduling(false)} title="Schedule Governance Sync">
          <div className="space-y-4">
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Vendor</label><select value={scheduleData.vendorId} onChange={(e) => setScheduleData({...scheduleData, vendorId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-500)]/20">{VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Event Type</label><select value={scheduleData.type} onChange={(e) => setScheduleData({...scheduleData, type: e.target.value as GovernanceEventType})} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-500)]/20">{Object.values(GovernanceEventType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Date</label><input type="date" value={scheduleData.date} onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-500)]/20"/></div>
            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Topic / Agenda</label><input type="text" placeholder="e.g. Q1 Performance Review" value={scheduleData.topic} onChange={(e) => setScheduleData({...scheduleData, topic: e.target.value})} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-500)]/20"/></div>
            <button onClick={handleScheduleEvent} className="w-full py-4 bg-[color:var(--color-brand-600)] text-white rounded-xl font-black text-sm hover:bg-[color:var(--color-brand-700)] shadow-xl shadow-[color:var(--color-brand-100)] transition-all active:scale-95 mt-4">Confirm Schedule</button>
          </div>
      </Modal>

      {isScribing && (
        <div className="bg-gradient-to-br from-[color:var(--color-brand-700)] to-[color:var(--color-brand-900)] rounded-[2.5rem] p-10 text-white shadow-2xl animate-in slide-in-from-top-12 duration-700 overflow-hidden relative border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-white/20 backdrop-blur-md shadow-lg'}`}>{isPaused ? <Pause size={28} /> : <Mic size={28} />}</div>
                <div><h3 className="text-3xl font-black tracking-tight leading-none">Agentic Scribe</h3><div className="flex items-center gap-2 mt-2"><span className={`w-2 h-2 rounded-full ${isRecording && !isPaused ? 'bg-red-400 animate-ping' : 'bg-[color:var(--color-brand-600)]'}`}></span><p className="text-[color:var(--color-brand-200)] text-sm font-bold uppercase tracking-widest">{isPaused ? 'Recording Paused' : isRecording ? 'Listening...' : 'Ready to Record'}</p></div></div>
              </div>
              <p className="text-[color:var(--color-brand-100)] text-lg leading-relaxed max-w-lg opacity-90 font-medium">Scribing governance for <span className="font-black underline text-white decoration-[color:var(--color-brand-400)] decoration-4">{VENDORS.find(v => v.id === selectedScribeVendor)?.name}</span>. The Auditor Agent will transcribe, summarize, and extract action items automatically.</p>
            </div>
            <div className="flex flex-col items-center gap-8 min-w-[320px] bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 shadow-2xl w-full md:w-auto">
              {scribeStatus === 'idle' && (<div className="flex flex-col gap-4 w-full"><button onClick={startRecording} className="flex items-center justify-center gap-3 bg-white text-[color:var(--color-brand-700)] px-10 py-5 rounded-2xl font-black text-lg hover:bg-[color:var(--color-brand-50)] transition-all shadow-xl active:scale-95 group"><Mic size={24} className="group-hover:scale-110 transition-transform" />Start Listening</button><label className="flex items-center justify-center gap-2 text-[color:var(--color-brand-200)] text-xs font-black uppercase tracking-widest hover:text-white transition-all cursor-pointer mt-2 bg-white/5 py-2 rounded-lg border border-white/10 hover:bg-white/10"><Upload size={14} />Upload audio file<input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} /></label></div>)}
              {scribeStatus === 'recording' && (<div className="flex flex-col items-center gap-6 w-full"><div className="w-full space-y-2"><div className="flex justify-between items-end"><span className={`font-mono text-4xl font-black tabular-nums drop-shadow-md ${isPaused ? 'text-[color:var(--color-brand-300)]' : 'text-white'}`}>{formatTime(recordingProgress)}</span><span className="text-[10px] font-bold text-[color:var(--color-brand-300)] uppercase tracking-widest">Max 60 min</span></div><div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden"><div className="bg-[color:var(--color-brand-400)] h-full" style={{ width: `${(recordingProgress / (60*60)) * 100}%` }} ></div></div></div><div className="h-12 flex items-center justify-center gap-1.5 w-full">{isPaused ? (<div className="flex items-center gap-2 text-[color:var(--color-brand-300)] bg-white/5 px-4 py-2 rounded-xl"><Pause size={16} /> <span className="text-xs font-bold uppercase tracking-wide">Paused</span></div>) : audioLevel < 10 ? (<div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20"><MicOff size={16} /> <span className="text-xs font-bold uppercase tracking-wide">Silence Detected</span></div>) : (Array.from({ length: 12 }).map((_, i) => (<div key={i} className="w-2 bg-white rounded-full transition-all duration-75" style={{ height: `${Math.max(4, Math.min(100, (audioLevel / 2) * (Math.random() + 0.5)))}%`, opacity: 0.6 + (Math.random() * 0.4) }}></div>)))}</div><div className="flex items-center gap-4 w-full"><button onClick={togglePause} className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all active:scale-95 border border-white/10">{isPaused ? <Play size={20} className="fill-current" /> : <Pause size={20} className="fill-current" />}{isPaused ? 'Resume' : 'Pause'}</button><button onClick={stopRecording} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-xl active:scale-95 border-2 border-red-400/50"><Square size={20} className="fill-white" /> Stop</button></div></div>)}
              {scribeStatus === 'processing' && (<div className="flex flex-col items-center gap-6 py-6 text-center"><div className="relative"><Loader2 className="animate-spin text-white" size={64} strokeWidth={3} /><Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" size={24} /></div><div><p className="font-black text-2xl text-white">Agent is Thinking...</p><p className="text-xs text-[color:var(--color-brand-200)] uppercase tracking-[0.2em] font-black mt-2">Transcribing Discussion</p></div></div>)}
              {scribeStatus === 'done' && (<div className="flex flex-col items-center gap-6 py-6 animate-in zoom-in-90 duration-500"><div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50"><CheckCircle2 size={44} className="text-white" /></div><div className="text-center"><span className="font-black text-2xl text-white">Analysis Complete</span><p className="text-[color:var(--color-brand-200)] text-xs font-bold uppercase tracking-widest mt-2">Timeline Updated</p></div></div>)}
            </div>
          </div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
           <div style={{ background: 'var(--color-brand-900)', color: 'white', padding: 16 }}>
              brand-900 test
           </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden transition-all duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-black text-slate-800 flex items-center gap-3 text-lg"><Calendar className="text-slate-400" size={20} /> Governance Timeline</h3>
          <div className="flex gap-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">Audit History</span></div>
        </div>
        <div className="divide-y divide-slate-100">
          {events.map((event) => (
            <div key={event.id} className="p-8 flex gap-8 hover:bg-slate-50/50 transition-all group animate-in slide-in-from-left-6 duration-500">
              <div className="shrink-0 flex flex-col items-center min-w-[56px]">
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-4xl font-black text-slate-800 leading-none mt-2">{new Date(event.date).getDate()}</span>
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${event.type === GovernanceEventType.QBR ? 'bg-[color:var(--color-brand-600)] text-white shadow-lg shadow-[color:var(--color-brand-100)]' : 'bg-slate-200 text-slate-700'}`}>{event.type}</span>
                    <h4 className="font-black text-slate-800 mt-3 text-xl tracking-tight">{VENDORS.find(v => v.id === event.vendorId)?.name} Strategic Sync</h4>
                  </div>
                  <button className="p-3 text-slate-400 hover:text-[color:var(--color-brand-600)] hover:bg-[color:var(--color-brand-50)] rounded-2xl transition-all group/play"><PlayCircle size={24} className="group-hover/play:scale-110 transition-transform" /></button>
                </div>
                <div className="p-5 bg-slate-100/50 rounded-2xl border border-slate-200/50 italic text-slate-600 text-sm leading-relaxed relative group-hover:bg-white group-hover:border-slate-300 transition-colors"><MessageSquare className="absolute -top-3 -left-3 text-slate-300 group-hover:text-[color:var(--color-brand-300)] transition-colors" size={20} />"{event.summary}"</div>
                <div className="flex flex-wrap gap-2.5 pt-2">{event.actionItems.map((ai, idx) => (<div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 shadow-sm font-bold hover:border-[color:var(--color-brand-400)] hover:shadow-md transition-all cursor-default"><CheckSquare size={16} className="text-[color:var(--color-brand-500)]" />{ai}</div>))}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingHub;
