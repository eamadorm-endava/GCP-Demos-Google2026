import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface GoverningLawChartProps {
  data: ChartData[];
}

// CORRECTED: Endava Data Visualisation Palette (from image_7a8745.png)
const COLORS = [
    '#5899C4', // Data Blue
    '#FF5641', // Data Orange
    '#CF820E', // Data Yellow
    '#30A661', // Data Green
    '#8684BF', // Data Violet
    '#7B9922'  // Data Grass Green
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = payload[0].payload.fill ||HZORS[0];
    return (
      <div className="bg-brand-secondary/95 backdrop-blur-md border border-brand-accent p-2.5 rounded-lg shadow-xl text-sm animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
          <span className="font-bold text-brand-text text-xs uppercase tracking-tight">{data.name}</span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="text-brand-light text-[10px] uppercase">Jurisdiction</span>
          <span className="text-brand-highlight font-mono font-bold">{data.value} {data.value === 1 ? 'Contract' : 'Contracts'}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const GoverningLawChart: React.FC<GoverningLawChartProps> = ({ data }) => {
  const hasData = data.some(item => item.value > 0);
  return (
    <Card className="col-span-1 border border-brand-accent/30 hover:border-brand-highlight/30 transition-colors">
      <h3 className="text-sm font-bold uppercase tracking-widest text-brand-light mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-brand-highlight rounded-full"></span>
        Legal Jurisdiction
      </h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {hasData ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius={85}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                animationBegin={400}
                animationDuration={1500}
                animationEasing="ease-in-out"
                stroke="var(--color-brand-primary)" 
                strokeWidth={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                formatter={(value) => <span className="text-[10px] text-brand-light uppercase tracking-tighter font-medium">{value}</span>}
              />
            </PieChart>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-brand-light/40 italic">
               <span className="text-xs">No jurisdiction data</span>
             </div>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};