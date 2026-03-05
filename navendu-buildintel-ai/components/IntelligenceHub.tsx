import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, PlayCircle, Plus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, ProjectData } from '../types';
import { generateConstructionInsights } from '../services/geminiService';

interface IntelligenceHubProps {
  projectData: ProjectData;
}

const IntelligenceHub: React.FC<IntelligenceHubProps> = ({ projectData }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `Hello. I am **BuildIntel**. I have full context of **${projectData.projectName}**.\n\nI can analyze schedule impacts, forecast budget variance, or draft RFI responses.`,
      timestamp: new Date(),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await generateConstructionInsights(input, projectData, messages);

    const aiMsg: Message = {
      role: 'model',
      content: response.text,
      timestamp: new Date(),
      isActionable: response.actions.length > 0,
      actions: response.actions
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    "Identify top schedule risks",
    "Analyze concrete budget variance",
    "List open high-priority RFIs",
    "Draft weekly status email"
  ];

  const handleActionClick = (action: string) => {
    setInput(action);
    // Auto-send after a brief delay to let state update
    setTimeout(() => {
      const userMsg: Message = { role: 'user', content: action, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);
      generateConstructionInsights(action, projectData, messages).then(response => {
        const aiMsg: Message = {
          role: 'model',
          content: response.text,
          timestamp: new Date(),
          isActionable: response.actions.length > 0,
          actions: response.actions
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
      });
      setInput('');
    }, 50);
  };

  return (
    <div className="flex flex-col h-full bg-endava-blue-90/50 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative backdrop-blur-sm">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-endava-orange/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-endava-blue-50/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-endava-blue-90/80 flex justify-between items-center backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-endava-orange to-[#ff7e6b] flex items-center justify-center shadow-lg shadow-endava-orange/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Gemini Intelligence Hub</h2>
            <p className="text-[10px] text-endava-blue-40">Connected to {projectData.projectId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] px-2 py-1 bg-endava-blue-80 text-endava-blue-30 border border-white/10 rounded-full shadow-sm">
            Gemini 3 Flash
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar z-0 relative">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-endava-blue-80 border border-white/5' : 'bg-gradient-to-br from-endava-orange to-[#ff7e6b]'
                }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-endava-blue-30" /> : <Bot className="w-4 h-4 text-white" />}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm border ${msg.role === 'user'
                  ? 'bg-endava-blue-80/80 text-white rounded-tr-none border-white/10'
                  : 'bg-endava-blue-90/80 text-endava-blue-10 border-white/5 rounded-tl-none'
                  }`}>
                  <div className="prose prose-invert max-w-none prose-sm">
                    <ReactMarkdown
                      components={{
                        strong: ({ node, ...props }) => <span className="font-bold text-endava-orange" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="min-w-full text-xs border-collapse border border-white/10" {...props} /></div>,
                        th: ({ node, ...props }) => <th className="border border-white/10 bg-white/5 p-2 text-left text-endava-blue-30" {...props} />,
                        td: ({ node, ...props }) => <td className="border border-white/10 p-2 text-white" {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Actions Panel */}
                {msg.isActionable && msg.actions && (
                  <div className="bg-gradient-to-r from-endava-blue-90 to-endava-blue-80 border border-white/10 rounded-xl p-3 w-full animate-fade-in-up shadow-xl">
                    <p className="text-[10px] font-bold text-endava-blue-40 mb-2 uppercase tracking-wider flex items-center">
                      <PlayCircle className="w-3 h-3 mr-1.5 text-endava-orange" /> Recommended Next Steps
                    </p>
                    <div className="grid gap-2">
                      {msg.actions.map((action, i) => (
                        <button key={i} onClick={() => handleActionClick(action)} className="w-full text-left px-3 py-2.5 bg-endava-blue-80/50 hover:bg-white/5 border border-white/5 hover:border-endava-orange/30 rounded-lg text-xs text-white transition-all flex items-center group cursor-pointer">
                          <div className="w-5 h-5 rounded-full bg-endava-blue-90 group-hover:bg-endava-orange/20 flex items-center justify-center mr-3 transition-colors border border-white/5 group-hover:border-endava-orange/50">
                            <Plus className="w-3 h-3 text-endava-blue-40 group-hover:text-endava-orange" />
                          </div>
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-endava-blue-40 px-1 font-medium">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-3 p-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-endava-orange to-[#ff7e6b] flex items-center justify-center mb-2 shadow-lg shadow-endava-orange/20">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="flex space-x-1 bg-endava-blue-90/80 p-4 rounded-2xl rounded-tl-none border border-white/5 backdrop-blur-sm shadow-sm">
                <div className="w-2 h-2 bg-endava-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-endava-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-endava-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-endava-blue-90 border-t border-white/10 backdrop-blur-md z-10">

        {/* Chips */}
        {messages.length < 3 && !isLoading && (
          <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar mb-1 px-1">
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleActionClick(prompt)}
                className="whitespace-nowrap px-4 py-1.5 bg-endava-blue-80 hover:bg-white/5 border border-white/5 hover:border-endava-orange/50 rounded-full text-xs text-white transition-all shadow-sm font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-center">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-endava-blue-80 rounded-md border border-white/5 shadow-inner">
            <Bot className="w-4 h-4 text-endava-orange" />
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask BuildIntel about your project..."
            className="w-full bg-endava-blue-90 text-white placeholder-endava-blue-40 rounded-xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-endava-orange/50 border border-white/10 resize-none h-14 shadow-inner"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-endava-orange hover:bg-endava-orange/90 disabled:bg-endava-blue-80 disabled:text-endava-blue-50 text-white rounded-lg transition-all shadow-lg shadow-endava-orange/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;