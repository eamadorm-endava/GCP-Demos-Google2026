import React, { useState } from 'react';
import type { Shipment, Message, Party, User } from '../types';
import { SendIcon, SparklesIcon, SpinnerIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { summarizeChat } from '../services/geminiService';

interface CollaborationChatProps {
  shipment: Shipment;
  currentUser: User;
  onAddMessage: (shipmentId: string, message: Message) => void;
}

export const CollaborationChat: React.FC<CollaborationChatProps> = ({ shipment, currentUser, onAddMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const { t, language } = useLanguage();
    const userParty: Party = { name: currentUser.name, role: 'Customer' }; // Assuming the user is the customer for chat purposes
    const isChatDisabled = shipment.status === 'Cancelled' || shipment.status === 'Delivered';

    const [summary, setSummary] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryError, setSummaryError] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || isChatDisabled) return;

        const message: Message = {
            id: `msg-${Date.now()}`,
            sender: userParty,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };

        onAddMessage(shipment.id, message);
        setNewMessage('');
    };

    const handleSummarize = async () => {
        setIsSummarizing(true);
        setSummaryError('');
        setSummary(null);
        try {
            const result = await summarizeChat(shipment.communication, language);
            setSummary(result);
        } catch (error) {
            console.error(error);
            setSummaryError(t('errorChatSummary'));
        } finally {
            setIsSummarizing(false);
        }
    }

  return (
    <div className="flex flex-col h-[70vh] bg-brand-sb-shade-80 rounded-lg border border-brand-sb-shade-70">
        <div className="p-3 border-b border-brand-sb-shade-80 bg-brand-sb-shade-90 rounded-t-lg flex justify-between items-center">
            <h3 className="text-lg font-bold text-brand-primary-300">{t('collaboration')}</h3>
            <button
                onClick={handleSummarize}
                disabled={isSummarizing || shipment.communication.length < 2}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                {isSummarizing ? (
                    <>
                        <SpinnerIcon className="w-4 h-4 animate-spin" />
                        {t('summarizing')}
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-4 h-4 text-yellow-500" />
                        {t('summarizeConversation')}
                    </>
                )}
            </button>
        </div>
        
        {summary && (
            <div className="p-4 bg-blue-50 border-b border-blue-200">
                <h4 className="text-sm font-bold text-blue-800 mb-2">{t('chatSummary')}</h4>
                <div className="text-sm text-blue-900 whitespace-pre-wrap prose prose-sm">{summary}</div>
            </div>
        )}
        {summaryError && (
             <div className="p-4 bg-red-50 border-b border-red-200 text-sm text-red-800">{summaryError}</div>
        )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {shipment.communication.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender.name === userParty.name ? 'justify-end' : ''}`}>
             {msg.sender.name !== userParty.name && (
                <div className="w-8 h-8 rounded-full bg-brand-sb-shade-30 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0" title={`${msg.sender.name} (${msg.sender.role})`}>
                    {msg.sender.name.charAt(0)}
                </div>
             )}
            <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender.name === userParty.name ? 'bg-rose-500 text-white rounded-br-none' : 'bg-brand-sb-shade-10 border border-slate-200 text-slate-700 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender.name === userParty.name ? 'text-rose-200' : 'text-brand-sb-shade-50'}`}>
                {msg.sender.name} - {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
            {msg.sender.name === userParty.name && (
                <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-sm font-bold text-white shrink-0" title={`${userParty.name} (${userParty.role})`}>
                    {t('youShort')}
                </div>
             )}
          </div>
        ))}
         {isChatDisabled && (
            <div className="text-center text-xs text-slate-400 pt-4">
                {t('messagingDisabled')}
            </div>
        )}
      </div>
      <div className="p-4 bg-brand-sb-shade-80 border-t border-brand-sb-shade-70 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isChatDisabled ? t('chatDisabled') : t('chatPlaceholder')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-slate-100"
            disabled={isChatDisabled}
          />
          <button
            type="submit"
            className="p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all disabled:bg-slate-400"
            disabled={!newMessage.trim() || isChatDisabled}
          >
            <SendIcon className="w-5 h-5"/>
          </button>
        </form>
      </div>
    </div>
  );
};
