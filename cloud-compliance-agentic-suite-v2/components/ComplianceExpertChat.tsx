
import React, { useState, useRef, useEffect } from 'react';
import { Message, AgentRole } from '../types';
import { complianceExpertChat } from '../geminiService';

const ComplianceExpertChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello, I am the Supervisory Agent. I coordinate our Retrieval, TOE, and TOD specialists. How can I assist with your compliance audit today?', agent: AgentRole.SUPERVISOR }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await complianceExpertChat(messages, input);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I encountered an error processing that.", agent: AgentRole.SUPERVISOR }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "System communication failure. Please check your ERM connectivity.", agent: AgentRole.SUPERVISOR }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Compliance Expert AI</h3>
            <p className="text-xs text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Orchestrating 4 Agents
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-600"><i className="fas fa-ellipsis-v"></i></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}>
              {m.agent && (
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">
                  {m.agent}
                </div>
              )}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-indigo-400 transition-colors">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-sm text-gray-700"
            placeholder="Ask about TILA, SEC trade surveillance, or CCPA compliance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Supervisory Audit Trail recorded automatically for all queries. System-agnostic API calls logged.
        </p>
      </div>
    </div>
  );
};

export default ComplianceExpertChat;
