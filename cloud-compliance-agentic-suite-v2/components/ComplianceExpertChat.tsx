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
    <div className="flex flex-col h-[calc(100vh-160px)] bg-brand-secondary rounded-xl border border-brand-border shadow-lg overflow-hidden">
      <div className="p-4 bg-brand-secondary border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h3 className="font-bold text-white">Compliance Expert AI</h3>
            <p className="text-xs text-signal-green flex items-center">
              <span className="w-2 h-2 bg-signal-green rounded-full mr-2 animate-pulse"></span>
              Orchestrating 4 Agents
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-brand-muted hover:text-white transition-colors"><i className="fas fa-ellipsis-v"></i></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-brand-dark">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              m.role === 'user' 
                ? 'bg-brand-primary text-white rounded-br-none' 
                : 'bg-brand-secondary text-brand-muted border border-brand-border rounded-bl-none'
            }`}>
              {m.agent && (
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70 ${m.role === 'user' ? 'text-white' : 'text-brand-primary'}`}>
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
            <div className="bg-brand-secondary border border-brand-border rounded-2xl p-4 shadow-sm rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-brand-secondary border-t border-brand-border">
        <div className="flex gap-2 bg-brand-dark p-2 rounded-xl border border-brand-border focus-within:border-brand-primary transition-colors">
          <input
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-sm text-white placeholder-brand-muted/50 focus:outline-none"
            placeholder="Ask about TILA, SEC trade surveillance, or CCPA compliance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-brand-primary text-white w-10 h-10 rounded flex items-center justify-center hover:bg-brand-hover transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-brand-primary/20"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-brand-muted mt-2 text-center opacity-60">
          Supervisory Audit Trail recorded automatically for all queries. System-agnostic API calls logged.
        </p>
      </div>
    </div>
  );
};

export default ComplianceExpertChat;