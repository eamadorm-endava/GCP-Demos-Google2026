
import React from 'react';
import { NOTIFICATIONS } from '../constants';
import { AlertCircle, CheckCircle2, Calendar, Zap, MessageSquareText } from 'lucide-react';

const AgentFeed: React.FC = () => {
  return (
    <div className="w-full xl:w-80 h-full bg-white xl:border-l border-slate-200 p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Zap className="text-indigo-600 fill-indigo-600" size={18} />
          <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Agent Intelligence</h3>
        </div>
        <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase font-black px-2.5 py-1 rounded-lg animate-pulse">Live Feed</span>
      </div>
      
      <div className="space-y-8">
        {NOTIFICATIONS.map((notif) => (
          <div key={notif.id} className="flex gap-4 group cursor-default">
            <div className={`mt-0.5 shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
              notif.type === 'alert' ? 'bg-red-50 text-red-600 shadow-sm' :
              notif.type === 'check' ? 'bg-green-50 text-green-600 shadow-sm' :
              'bg-blue-50 text-blue-600 shadow-sm'
            }`}>
              {notif.type === 'alert' && <AlertCircle size={18} />}
              {notif.type === 'check' && <CheckCircle2 size={18} />}
              {notif.type === 'calendar' && <Calendar size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-slate-600 leading-snug font-medium group-hover:text-slate-900 transition-colors">
                {notif.message}
              </p>
              <span className="text-[10px] font-black text-slate-400 mt-2 block uppercase tracking-widest">{notif.timestamp}</span>
            </div>
          </div>
        ))}
        
        <div className="pt-8 border-t border-slate-100">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-[1.5rem] p-5 border border-slate-200/50 relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <MessageSquareText size={16} className="text-indigo-600" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Strategic Insight</span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed font-semibold italic relative z-10">
              "Vendor velocity is trending 12% higher than Q4, but technical debt markers are increasing. Recommend quality focus in next QBR."
            </p>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/40 rounded-full blur-xl transition-transform group-hover:scale-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentFeed;
