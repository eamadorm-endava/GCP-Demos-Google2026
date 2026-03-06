
import React from 'react';
import { useStore } from '../../store/useStore';
import { CHART_THEME, ENDAVA_COLORS } from '../shared/theme';
import KioskCard from '../shared/KioskCard';
import KioskButton from '../shared/KioskButton';
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
          <h2 className="text-2xl md:text-4xl font-medium">Inventory <span className="text-endava-orange">Flow</span></h2>
          <p className="text-base md:text-xl text-endava-blue-40 font-light">Adaptive Supply Chain Management</p>
        </div>
        <div className="bg-endava-orange/10 text-endava-orange px-4 py-2 rounded-full font-black flex items-center gap-2 border border-endava-orange/20 text-xs md:text-base">
          <TrendingUp className="w-4 h-4 md:w-6 md:h-6" /> REAL-TIME MONITORING
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <KioskCard className="lg:col-span-2 p-6 md:p-8 shadow-xl">
          <h3 className="text-xl md:text-2xl font-medium mb-6 flex items-center gap-3">
            <Package className="text-endava-orange" /> Stock Intelligence
          </h3>

          <div className="overflow-x-auto custom-scrollbar -mx-6 px-6">
            <div className="min-w-[600px]">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-endava-blue-40 text-xs uppercase tracking-[0.2em] font-black">
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
                        <span className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest ${item.status === 'Healthy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          item.status === 'Low Stock' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <KioskButton
                          variant="ghost"
                          onClick={() => simulateSale(item.id)}
                          className="px-5 py-2 text-xs md:text-sm"
                        >
                          Simulate Sale
                        </KioskButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </KioskCard>

        <div className="space-y-6 md:space-y-8">
          <KioskCard className="p-6 md:p-8 shadow-xl">
            <h3 className="text-xl md:text-2xl font-medium mb-6 flex items-center gap-3">
              <RefreshCw className="text-endava-orange w-5 h-5" /> Demand Trends
            </h3>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demoData.salesChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
                  <XAxis dataKey="name" stroke={CHART_THEME.text} fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke={CHART_THEME.text} fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: CHART_THEME.tooltip.background, border: `1px solid ${CHART_THEME.tooltip.border}`, borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: ENDAVA_COLORS.orange }}
                  />
                  <Bar dataKey="sales" fill={ENDAVA_COLORS.orange} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </KioskCard>

          <KioskCard glass={false} className="bg-endava-orange/5 border border-endava-orange/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-endava-orange/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-endava-orange p-2 md:p-3 rounded-2xl flex-shrink-0 shadow-lg shadow-endava-orange/20">
                <AlertTriangle className="w-5 h-5 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-medium text-white uppercase tracking-tight">System Alert</h4>
                <p className="text-sm md:text-base text-endava-blue-40 mt-1 font-light leading-relaxed">
                  Predictive analysis shows a stock-out risk for premium SKUs.
                </p>
                <button className="mt-5 w-full bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl">
                  AUTHORIZE RE-STOCK
                </button>
              </div>
            </div>
          </KioskCard>
        </div>
      </div>
    </div>
  );
};

export default RetailDemo;
