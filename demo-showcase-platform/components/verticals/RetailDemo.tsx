
import React from 'react';
import { useStore } from '../../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Package, TrendingUp, RefreshCw } from 'lucide-react';

const RetailDemo: React.FC = () => {
  const demoData = useStore((state) => state.demoData.retail);
  const updateDemoData = useStore((state) => state.updateDemoData);

  const simulateSale = (itemId: string) => {
    const updatedInventory = demoData.inventory.map(item => 
      item.id === itemId ? { ...item, stock: Math.max(0, item.stock - 1) } : item
    );
    updateDemoData('retail', { ...demoData, inventory: updatedInventory });
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col gap-6 md:gap-8 custom-scrollbar overflow-y-auto pb-40">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black">Inventory <span className="text-[#DE411B]">Flow</span></h2>
          <p className="text-base md:text-xl text-gray-500 font-light">Adaptive Supply Chain Management</p>
        </div>
        <div className="bg-[#DE411B]/10 text-[#DE411B] px-4 py-2 rounded-full font-black flex items-center gap-2 border border-[#DE411B]/20 text-xs md:text-base">
          <TrendingUp className="w-4 h-4 md:w-6 md:h-6" /> REAL-TIME MONITORING
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-[#121417] rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl overflow-hidden">
          <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
            <Package className="text-[#DE411B]" /> Stock Intelligence
          </h3>
          
          <div className="overflow-x-auto custom-scrollbar -mx-6 px-6">
            <div className="min-w-[600px]">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-500 text-xs uppercase tracking-[0.2em] font-black">
                  <tr>
                    <th className="p-5">SKU / Item</th>
                    <th className="p-5">Units</th>
                    <th className="p-5">Health</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {demoData.inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-5 font-bold text-lg">{item.item}</td>
                      <td className="p-5 text-xl font-black">{item.stock}</td>
                      <td className="p-5">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest ${
                          item.status === 'Healthy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          item.status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => simulateSale(item.id)}
                          className="bg-[#DE411B]/10 hover:bg-[#DE411B] hover:text-white text-[#DE411B] border border-[#DE411B]/20 active:scale-95 px-5 py-2 rounded-xl transition-all text-xs md:text-sm font-black uppercase tracking-wider"
                        >
                          Simulate Sale
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-[#121417] rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
            <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
              <RefreshCw className="text-[#DE411B] w-5 h-5" /> Demand Trends
            </h3>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demoData.salesChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#121417', border: '1px solid #333', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#DE411B' }}
                  />
                  <Bar dataKey="sales" fill="#DE411B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#DE411B]/5 border border-[#DE411B]/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DE411B]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-[#DE411B] p-2 md:p-3 rounded-2xl flex-shrink-0 shadow-lg shadow-[#DE411B]/20">
                <AlertTriangle className="w-5 h-5 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">System Alert</h4>
                <p className="text-sm md:text-base text-gray-500 mt-1 font-light leading-relaxed">
                  Predictive analysis shows a stock-out risk for premium SKUs.
                </p>
                <button className="mt-5 w-full bg-white text-black px-6 py-3 rounded-xl font-black hover:bg-gray-200 active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl">
                  AUTHORIZE RE-STOCK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailDemo;
