
import React from 'react';
import { Card } from '../ui/Card';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  note?: string;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ title, value, icon, note }) => {
  return (
    <Card className="flex items-center gap-4 border-l-2 border-l-brand-highlight group hover:coral-glow transition-all duration-300">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-highlight/10 border border-brand-highlight/20 flex items-center justify-center group-hover:bg-brand-highlight/15 transition-colors">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-brand-light uppercase tracking-widest truncate">{title}</p>
        <p className="text-3xl font-bold text-brand-text leading-none mt-1">{value}</p>
        {note && <p className="text-xs text-brand-light/60 mt-0.5">{note}</p>}
      </div>
    </Card>
  );
};