import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FlowerIcon } from './icons';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  error: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-brand-primary-200 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <FlowerIcon className="mx-auto h-12 w-auto text-brand-primary-50" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-brand-primary-300">
          {t('loginTitle')}
        </h2>
        <p className="mt-2 text-center text-sm text-brand-sb-shade-30">
            {t('loginSubtitle')}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-brand-sb-shade-90 px-6 py-12 shadow-lg sm:rounded-lg sm:px-12 border border-brand-sb-shade-80">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-brand-sb-shade-20">
                {t('username')}
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium leading-6 text-brand-sb-shade-20">
                {t('password')}
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-brand-primary-50 px-3 py-1.5 text-sm font-semibold leading-6 text-brand-primary-300 shadow-sm hover:bg-brand-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                {t('loginButton')}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-brand-sb-shade-80 px-6 text-brand-sb-shade-50">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
                <p className="text-center text-sm text-brand-primary-300">
                    <b>Manager:</b> manager / password123
                </p>
                 <p className="text-center text-sm text-brand-primary-300">
                    <b>Specialist:</b> specialist / password123
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
