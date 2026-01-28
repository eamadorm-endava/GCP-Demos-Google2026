
import React from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: {
    text: string;
    color: 'green' | 'red' | 'blue' | 'amber';
  };
  linkTo?: string;
  iconBgColor: string;
}

const TrendBadge: React.FC<{ text: string; color: 'green' | 'red' | 'blue' | 'amber' }> = ({ text, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${colorClasses[color]}`}>
      {text}
    </span>
  );
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend, linkTo, iconBgColor }) => {
  const content = (
    <>
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className={`p-3 ${iconBgColor} rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        {trend && <TrendBadge text={trend.text} color={trend.color} />}
      </div>
      <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </>
  );

  const baseClasses = "bg-white p-6 lg:p-8 rounded-[2rem] shadow-sm border border-slate-200 relative overflow-hidden group hover:border-indigo-200 transition-all duration-300";

  if (linkTo) {
    return (
      <Link to={linkTo} className={`block ${baseClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
};

export default StatCard;
