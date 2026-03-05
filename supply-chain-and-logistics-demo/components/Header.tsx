import React, { useState, useRef, useEffect } from 'react';
import { PlusCircleIcon, FlowerIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UserPlusIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import type { User } from '../types';

type ActiveView = 'dashboard' | 'shipments' | 'farms';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNewOrder: () => void;
  onNewFarm: () => void;
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${isActive ? 'bg-rose-900/20 text-endava-orange shadow-lg shadow-black/40' : 'text-endava-blue-30 hover:bg-endava-blue-70 hover:text-white'
      }`}
  >
    {label}
  </button>
);


export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNewOrder, onNewFarm, activeView, onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-endava-blue-90/50 backdrop-blur-sm border-b border-white/10 px-4 py-3 sm:px-6 flex items-center justify-between shadow-lg shadow-black/40 sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-3 text-left group">
          <img src="./endava-logo.svg" alt="Endava Logo" className="h-8 w-auto group-hover:opacity-90 transition-opacity" />
          <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">
            {t('supplyChain')}
          </h1>
        </button>
        <nav className="flex items-center gap-2">
          <NavButton label={t('dashboard')} isActive={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
          <NavButton label={t('shipments')} isActive={activeView === 'shipments'} onClick={() => onNavigate('shipments')} />
          <NavButton label={t('farms')} isActive={activeView === 'farms'} onClick={() => onNavigate('farms')} />
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onNewFarm}
          className="inline-flex items-center gap-2 px-4 py-2 bg-endava-blue-80 text-endava-blue-20 text-sm font-semibold rounded-2xl hover:bg-endava-blue-70 hover:shadow-lg shadow-black\/40 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{t('registerFarm')}</span>
        </button>
        <button
          onClick={onNewOrder}
          className="inline-flex items-center gap-2 px-4 py-2 bg-endava-orange text-white text-sm font-semibold rounded-2xl shadow-lg hover:bg-rose-700 hover:-translate-y-0.5 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-endava-orange focus:ring-offset-2"
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{t('newShipment')}</span>
        </button>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-3 text-sm font-semibold text-white bg-endava-blue-80/50 backdrop-blur-sm border border-white/10 rounded-full pl-1.5 pr-4 py-1.5 hover:bg-white/5 hover:border-white/20 transition-all shadow-lg shadow-black/40 focus:outline-none focus:ring-1 focus:ring-endava-orange">
            <div className="bg-endava-orange/20 p-1 rounded-full">
              <UserCircleIcon className="w-6 h-6 text-endava-orange" />
            </div>
            <span className="hidden md:inline">{user.name}</span>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-endava-blue-90/50 backdrop-blur-sm rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-endava-blue-40">{user.role}</p>
                </div>
                <div className="border-t border-white/10 my-1"></div>
                <div className="px-3 py-2 text-sm text-endava-blue-20">
                  <label htmlFor="language-select" className="text-xs text-endava-blue-40">{t('languageSelectorLabel')}</label>
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es-LA' | 'pt-BR')}
                    className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm bg-endava-blue-90/50 backdrop-blur-sm border border-white/10 focus:outline-none focus:ring-endava-orange focus:border-endava-orange rounded-md shadow-lg shadow-black/40"
                  >
                    <option value="en">English</option>
                    <option value="es-LA">Español (LatAm)</option>
                    <option value="pt-BR">Português (Brasil)</option>
                  </select>
                </div>
                <div className="border-t border-white/10 my-1"></div>
                <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-endava-blue-20 hover:bg-endava-blue-70 hover:text-white rounded-md transition-colors">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  {t('logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};