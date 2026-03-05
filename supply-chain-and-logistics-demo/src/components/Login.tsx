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
    <div className="flex min-h-screen flex-col justify-center bg-endava-dark/80 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img src="./endava-logo.svg" alt="Endava Logo" className="mx-auto h-16 w-auto" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          {t('loginTitle')}
        </h2>
        <p className="mt-2 text-center text-sm text-endava-blue-40">
          {t('loginSubtitle')}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-endava-blue-90/50 backdrop-blur-sm px-6 py-12 shadow-2xl sm:rounded-2xl sm:px-12 border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
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
                  className="block w-full rounded-md border border-white/10 bg-[#30404B]/50 py-1.5 text-white shadow-lg shadow-black/40 placeholder:text-endava-blue-40 focus:outline-none focus:ring-1 focus:ring-endava-orange sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
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
                  className="block w-full rounded-md border-0 py-1.5 text-white shadow-lg shadow-black\/40 ring-1 ring-inset ring-slate-300 placeholder:text-endava-blue-40 focus:ring-2 focus:ring-inset focus:ring-rose-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-900/20 p-4">
                <p className="text-sm font-medium text-red-400">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-endava-orange px-3 py-2 text-sm font-semibold leading-6 text-white shadow-lg hover:bg-rose-900/200 hover:-translate-y-0.5 hover:shadow-lg transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                {t('loginButton')}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-endava-blue-90/50 backdrop-blur-sm px-6 text-endava-blue-40">Demo Credentials</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <p className="text-center text-sm text-endava-blue-40">
                <b>Manager:</b> manager / password123
              </p>
              <p className="text-center text-sm text-endava-blue-40">
                <b>Specialist:</b> specialist / password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
