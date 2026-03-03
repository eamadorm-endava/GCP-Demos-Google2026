
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
    green: 'bg-green-900/40 text-green-400',
    red: 'bg-red-900/40 text-red-400',
    blue: 'bg-endava-blue-70/40 text-endava-blue-30',
    amber: 'bg-amber-900/40 text-amber-400',
  };
  return (
    <span className={`text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest ${colorClasses[color]}`}>
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
      <h4 className="text-endava-blue-40 text-xs font-semibold uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-3xl font-semibold text-white">{value}</p>
    </>
  );

  const baseClasses = "bg-endava-blue-90 p-6 lg:p-8 rounded-[2rem] shadow-sm border border-white/10 relative overflow-hidden group hover:border-endava-orange/50 transition-all duration-300";

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
