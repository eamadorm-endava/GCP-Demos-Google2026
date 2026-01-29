import React, { useState, useRef, useEffect } from 'react';
// FIX: Add UserPlusIcon for the "Register Farm" button.
import { PlusCircleIcon, FlowerIcon, UserCircleIcon, ArrowRightOnRectangleIcon, UserPlusIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import type { User } from '../types';

// FIX: Add 'farms' to ActiveView to enable navigation to the farm management screen.
type ActiveView = 'dashboard' | 'shipments' | 'farms';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNewOrder: () => void;
  // FIX: Add onNewFarm prop to handle opening the new farm registration form.
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
        className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-rose-100 text-rose-700' : 'text-slate-600 hover:bg-slate-100'
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
    <header className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 flex items-center justify-between shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-3 text-left">
          <FlowerIcon className="w-8 h-8 text-rose-500" />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
            {t('supplyChain')}
          </h1>
        </button>
        <nav className="flex items-center gap-2">
            <NavButton label={t('dashboard')} isActive={activeView === 'dashboard'} onClick={() => onNavigate('dashboard')} />
            <NavButton label={t('shipments')} isActive={activeView === 'shipments'} onClick={() => onNavigate('shipments')} />
            {/* FIX: Add navigation button for the 'Farms' view. */}
            <NavButton label={t('farms')} isActive={activeView === 'farms'} onClick={() => onNavigate('farms')} />
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* FIX: Add "Register Farm" button to trigger the onNewFarm handler. */}
        <button
          onClick={onNewFarm}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{t('registerFarm')}</span>
        </button>
        <button
          onClick={onNewOrder}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all"
        >
          <PlusCircleIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{t('newShipment')}</span>
        </button>
        <div className="relative" ref={menuRef}>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-full p-1.5 transition-colors">
            <UserCircleIcon className="w-7 h-7 text-slate-500" />
            <span className="hidden md:inline">{user.name}</span>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                <div className="border-t border-slate-200 my-1"></div>
                <div className="px-3 py-2 text-sm text-slate-700">
                  <label htmlFor="language-select" className="text-xs text-slate-500">{t('languageSelectorLabel')}</label>
                  <select 
                    id="language-select"
                    value={language} 
                    // FIX: Update language options to match the LanguageContext and translations.
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es-LA' | 'pt-BR')}
                    className="mt-1 block w-full pl-3 pr-8 py-1.5 text-sm border-slate-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 rounded-md shadow-sm"
                  >
                        <option value="en">English</option>
                        <option value="es-LA">Español (LatAm)</option>
                        <option value="pt-BR">Português (Brasil)</option>
                  </select>
                </div>
                <div className="border-t border-slate-200 my-1"></div>
                <button onClick={onLogout} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-md transition-colors">
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
