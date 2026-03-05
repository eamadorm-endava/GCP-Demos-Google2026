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
    <div className="flex flex-col h-[70vh] bg-endava-dark/80 rounded-2xl border border-white/10">
      <div className="p-3 border-b border-white/10 bg-endava-blue-90/50 backdrop-blur-sm rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">{t('collaboration')}</h3>
        <button
          onClick={handleSummarize}
          disabled={isSummarizing || shipment.communication.length < 2}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-endava-blue-80 text-endava-blue-20 text-xs font-semibold rounded-md hover:bg-endava-blue-70 focus:outline-none focus:ring-2 focus:ring-endava-orange transition-all disabled:bg-endava-dark/80 disabled:text-endava-blue-40 disabled:cursor-not-allowed"
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
        <div className="p-4 bg-blue-900/20 border-b border-blue-800/50">
          <h4 className="text-sm font-bold text-blue-400 mb-2">{t('chatSummary')}</h4>
          <div className="text-sm text-blue-900 whitespace-pre-wrap prose prose-sm">{summary}</div>
        </div>
      )}
      {summaryError && (
        <div className="p-4 bg-red-900/20 border-b border-red-800/50 text-sm text-red-400">{summaryError}</div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {shipment.communication.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender.name === userParty.name ? 'justify-end' : ''}`}>
            {msg.sender.name !== userParty.name && (
              <div className="w-8 h-8 rounded-full bg-endava-blue-70 flex items-center justify-center text-sm font-bold text-endava-blue-30 shrink-0" title={`${msg.sender.name} (${msg.sender.role})`}>
                {msg.sender.name.charAt(0)}
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender.name === userParty.name ? 'bg-rose-900/200 text-white rounded-br-none' : 'bg-endava-blue-90/50 backdrop-blur-sm border border-white/10 text-endava-blue-20 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender.name === userParty.name ? 'text-rose-200' : 'text-endava-blue-40'}`}>
                {msg.sender.name} - {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
            {msg.sender.name === userParty.name && (
              <div className="w-8 h-8 rounded-full bg-rose-900/200 flex items-center justify-center text-sm font-bold text-white shrink-0" title={`${userParty.name} (${userParty.role})`}>
                {t('youShort')}
              </div>
            )}
          </div>
        ))}
        {isChatDisabled && (
          <div className="text-center text-xs text-endava-blue-40 pt-4">
            {t('messagingDisabled')}
          </div>
        )}
      </div>
      <div className="p-4 bg-endava-blue-90/50 backdrop-blur-sm border-t border-white/10 rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isChatDisabled ? t('chatDisabled') : t('chatPlaceholder')}
            className="w-full px-4 py-2 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-endava-orange disabled:bg-endava-blue-80"
            disabled={isChatDisabled}
          />
          <button
            type="submit"
            className="p-2 bg-endava-orange text-white rounded-full hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-endava-orange focus:ring-offset-2 transition-all disabled:bg-slate-400"
            disabled={!newMessage.trim() || isChatDisabled}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
