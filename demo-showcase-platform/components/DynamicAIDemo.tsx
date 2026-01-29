
import React from 'react';
import { useStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Shield, Cpu, Terminal, ArrowUpRight } from 'lucide-react';
import { VerticalConfig } from '../types';

interface Props {
  config: VerticalConfig;
}

const DynamicAIDemo: React.FC<Props> = ({ config }) => {
  const data = config.dynamicData;
  if (!data) return null;

  return (
    <div className="p-4 md:p-8 h-full flex flex-col gap-6 md:gap-10 custom-scrollbar overflow-y-auto pb-40 animate-in fade-in duration-1000">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-5xl font-black uppercase italic tracking-tighter">
            {config.title.split(' ')[0]} <span className="text-[#DE411B]">{config.title.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-base md:text-xl text-gray-500 font-bold uppercase tracking-widest mt-1 opacity-60">AI Generated Insight System</p>
        </div>
        <div className="bg-[#DE411B]/10 text-[#DE411B] px-6 py-3 rounded-full font-black flex items-center gap-3 border border-[#DE411B]/20 text-sm md:text-base tracking-[0.2em] uppercase">
          <Zap className="w-5 h-5 animate-pulse" /> Live Analysis
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {data.stats.map((stat, i) => (
          <div key={i} className="bg-[#121417] p-6 md:p-8 rounded-[2rem] border border-white/5 hover:border-[#DE411B]/30 transition-all group">
            <p className="text-gray-600 text-[10px] md:text-xs font-black uppercase tracking-widest mb-3 group-hover:text-[#DE411B]">{stat.label}</p>
            <p className="text-2xl md:text-4xl font-black">{stat.value}</p>
            {stat.trend && (
              <div className={`text-[10px] font-bold mt-2 flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : null}
                {stat.trend.toUpperCase()} TREND
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#121417] rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Cpu className="w-48 h-48 text-[#DE411B]" />
          </div>
          <h3 className="text-xl md:text-2xl font-black mb-10 flex items-center gap-4">
             <Activity className="text-[#DE411B]" /> Performance Vector
          </h3>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121417', border: '1px solid #333', borderRadius: '16px' }}
                  itemStyle={{ color: '#DE411B', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#DE411B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-[#121417] rounded-[2.5rem] p-8 md:p-12 border border-white/5 flex flex-col shadow-2xl">
          <h3 className="text-xl md:text-2xl font-black mb-8 flex items-center gap-4">
            <Terminal className="text-[#DE411B]" /> System Logs
          </h3>
          <div className="space-y-4 flex-grow overflow-y-auto custom-scrollbar">
            {data.logs.map((log, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black text-[#DE411B] tracking-widest">{log.id}</span>
                  <span className="text-[10px] text-gray-600 font-bold">{log.timestamp}</span>
                </div>
                <p className="text-sm font-bold text-gray-300">{log.event}</p>
                <p className="text-[10px] text-gray-500 uppercase mt-1 font-black">Status: {log.status}</p>
              </div>
            ))}
          </div>
          <button className="mt-8 py-4 w-full bg-[#DE411B]/10 hover:bg-[#DE411B] text-[#DE411B] hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all border border-[#DE411B]/20">
            Export Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicAIDemo;
