
import React from 'react';
import { NOTIFICATIONS } from '../constants';
import { AlertCircle, CheckCircle2, Calendar, Zap, MessageSquareText } from 'lucide-react';

const AgentFeed: React.FC = () => {
  return (
    <div className="w-full xl:w-80 h-full bg-endava-blue-90 xl:border-l border-white/10 p-6 lg:p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Zap className="text-endava-orange fill-endava-orange" size={18} />
          <h3 className="font-semibold text-white uppercase tracking-tight text-sm">Agent Intelligence</h3>
        </div>
        <span className="bg-endava-orange/20 text-endava-orange text-[10px] uppercase font-semibold px-2.5 py-1 rounded-lg animate-pulse">Live Feed</span>
      </div>

      <div className="space-y-8">
        {NOTIFICATIONS.map((notif) => (
          <div key={notif.id} className="flex gap-4 group cursor-default">
            <div className={`mt-0.5 shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${notif.type === 'alert' ? 'bg-red-50 text-red-600 shadow-sm' :
                notif.type === 'check' ? 'bg-green-50 text-green-600 shadow-sm' :
                  'bg-endava-blue-80 border border-white/10 text-endava-blue-30 shadow-sm'
              }`}>
              {notif.type === 'alert' && <AlertCircle size={18} />}
              {notif.type === 'check' && <CheckCircle2 size={18} />}
              {notif.type === 'calendar' && <Calendar size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-endava-blue-30 leading-snug font-medium group-hover:text-white transition-colors">
                {notif.message}
              </p>
              <span className="text-[10px] font-semibold text-endava-blue-40 mt-2 block uppercase tracking-widest">{notif.timestamp}</span>
            </div>
          </div>
        ))}

        <div className="pt-8 border-t border-white/10">
          <div className="bg-gradient-to-br from-endava-blue-80 to-endava-blue-90 rounded-[1.5rem] p-5 border border-white/10 relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <MessageSquareText size={16} className="text-endava-orange" />
              <span className="text-[10px] font-semibold text-white uppercase tracking-widest">Strategic Insight</span>
            </div>
            <p className="text-[12px] text-endava-blue-30 leading-relaxed font-semibold italic relative z-10">
              "Vendor velocity is trending 12% higher than Q4, but technical debt markers are increasing. Recommend quality focus in next QBR."
            </p>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-endava-blue-90/10 rounded-full blur-xl transition-transform group-hover:scale-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentFeed;
