
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-secondary border border-brand-accent/30 rounded-xl shadow-lg p-4 sm:p-6 transition-colors hover:border-brand-accent/50 ${className}`}>
      {children}
    </div>
  );
};