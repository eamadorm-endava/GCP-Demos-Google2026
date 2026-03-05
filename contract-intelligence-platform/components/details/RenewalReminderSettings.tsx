
import React, { useState } from 'react';
import { Contract, RenewalReminderConfig } from '../../types';
import { Card } from '../ui/Card';

interface RenewalReminderSettingsProps {
  contract: Contract;
  onUpdate: (updatedConfig: RenewalReminderConfig) => void;
}

export const RenewalReminderSettings: React.FC<RenewalReminderSettingsProps> = ({ contract, onUpdate }) => {
  // Use default values if renewalReminder is undefined
  const initialConfig = contract.renewalReminder || {
    isEnabled: false,
    leadTimeDays: 90,
    recipients: []
  };

  const [isEnabled, setIsEnabled] = useState(initialConfig.isEnabled);
  const [leadTime, setLeadTime] = useState<30 | 60 | 90>(initialConfig.leadTimeDays);
  const [recipients, setRecipients] = useState<string[]>(initialConfig.recipients);
  const [newRecipient, setNewRecipient] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const calculateReminderDate = (expirationDate: string, days: number): string => {
    const exp = new Date(expirationDate);
    const reminder = new Date(exp);
    reminder.setDate(exp.getDate() - days);
    return reminder.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRecipient.trim() && !recipients.includes(newRecipient.trim())) {
      const updatedList = [...recipients, newRecipient.trim()];
      setRecipients(updatedList);
      setNewRecipient('');
      handleSave(isEnabled, leadTime, updatedList);
    }
  };

  const handleRemoveRecipient = (email: string) => {
    const updatedList = recipients.filter(r => r !== email);
    setRecipients(updatedList);
    handleSave(isEnabled, leadTime, updatedList);
  };

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    handleSave(newState, leadTime, recipients);
  };

  const handleLeadTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value) as 30 | 60 | 90;
    setLeadTime(val);
    handleSave(isEnabled, val, recipients);
  };

  const handleSave = (enabled: boolean, days: 30 | 60 | 90, emails: string[]) => {
    onUpdate({
      isEnabled: enabled,
      leadTimeDays: days,
      recipients: emails
    });
    
    // Briefly show saved state
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <Card className="border border-brand-accent/20 bg-gradient-to-br from-brand-secondary to-brand-secondary/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-text flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-highlight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Renewal Automation
          </h3>
          <p className="text-xs text-brand-light">Automated expiration alerts</p>
        </div>
        <div className="flex items-center gap-2">
            {isSaved && <span className="text-xs text-green-400 animate-fade-in font-bold">Saved</span>}
            <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-highlight focus:ring-offset-2 focus:ring-offset-brand-primary ${
                isEnabled ? 'bg-brand-highlight' : 'bg-brand-accent'
            }`}
            >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
            </button>
        </div>
      </div>

      {isEnabled ? (
        <div className="space-y-4 animate-slide-up">
          <div>
            <label className="block text-xs font-bold text-brand-light uppercase tracking-wider mb-1">
              Trigger Alert
            </label>
            <div className="flex items-center gap-2">
                <select
                value={leadTime}
                onChange={handleLeadTimeChange}
                className="bg-brand-primary border border-brand-accent/30 rounded text-sm text-brand-text px-3 py-2 w-full focus:outline-none focus:border-brand-highlight"
                >
                <option value={30}>30 Days Before Expiration</option>
                <option value={60}>60 Days Before Expiration</option>
                <option value={90}>90 Days Before Expiration</option>
                </select>
            </div>
            <p className="mt-2 text-[11px] text-brand-highlight bg-brand-highlight/10 border border-brand-highlight/20 p-2 rounded">
                Next scheduled email: <span className="font-bold">{calculateReminderDate(contract.expirationDate, leadTime)}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-light uppercase tracking-wider mb-1">
              Recipients
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {recipients.map((email) => (
                <span key={email} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-brand-accent/30 text-xs text-brand-text border border-brand-accent/40">
                  {email}
                  <button onClick={() => handleRemoveRecipient(email)} className="text-brand-light hover:text-red-400">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddRecipient} className="flex gap-2">
              <input
                type="email"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                placeholder="colleague@company.com"
                className="flex-grow bg-brand-primary border border-brand-accent/30 rounded px-3 py-1.5 text-sm text-brand-text focus:outline-none focus:border-brand-highlight"
              />
              <button
                type="submit"
                disabled={!newRecipient.trim()}
                className="px-3 py-1 bg-brand-accent hover:bg-brand-highlight/80 hover:text-brand-primary text-brand-text text-xs font-bold rounded transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-brand-light/60 text-sm italic bg-brand-primary/20 rounded-lg border border-dashed border-brand-accent/20">
          Reminders are disabled for this contract.
        </div>
      )}
    </Card>
  );
};
