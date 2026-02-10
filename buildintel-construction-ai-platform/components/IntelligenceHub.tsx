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

  return (
    <div className="flex flex-col h-full bg-slate-950/50 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-accent-orange/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex justify-between items-center backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Gemini Intelligence Hub</h2>
            <p className="text-[10px] text-slate-400">Connected to {projectData.projectId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-[10px] px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full">
            Gemini 2.0 Flash
            </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar z-0">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                msg.role === 'user' ? 'bg-slate-700' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} w-full`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm border ${
                  msg.role === 'user' 
                    ? 'bg-slate-800/80 text-white rounded-tr-none border-slate-700' 
                    : 'bg-slate-900/60 text-slate-200 border-slate-800 rounded-tl-none'
                }`}>
                  <ReactMarkdown 
                    className="prose prose-invert max-w-none prose-sm"
                    components={{
                      strong: ({node, ...props}) => <span className="font-bold text-indigo-400" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      table: ({node, ...props}) => <div className="overflow-x-auto my-2"><table className="min-w-full text-xs border-collapse border border-slate-700" {...props} /></div>,
                      th: ({node, ...props}) => <th className="border border-slate-700 bg-slate-800 p-2 text-left" {...props} />,
                      td: ({node, ...props}) => <td className="border border-slate-700 p-2" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Actions Panel */}
                {msg.isActionable && msg.actions && (
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/50 rounded-xl p-3 w-full animate-fade-in-up shadow-xl">
                    <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center">
                      <PlayCircle className="w-3 h-3 mr-1.5 text-indigo-400" /> Recommended Next Steps
                    </p>
                    <div className="grid gap-2">
                      {msg.actions.map((action, i) => (
                        <button key={i} className="w-full text-left px-3 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-indigo-500/30 rounded-lg text-xs text-slate-300 transition-all flex items-center group">
                          <div className="w-5 h-5 rounded-full bg-slate-700 group-hover:bg-indigo-500/20 flex items-center justify-center mr-3 transition-colors border border-slate-600 group-hover:border-indigo-500/50">
                             <Plus className="w-3 h-3 text-slate-400 group-hover:text-indigo-400" />
                          </div>
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <span className="text-[10px] text-slate-600 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2">
                   <Loader2 className="w-4 h-4 text-white animate-spin" />
                 </div>
                 <div className="flex space-x-1 bg-slate-900/50 p-4 rounded-2xl rounded-tl-none border border-slate-800">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                 </div>
              </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 backdrop-blur-md z-10">
        
        {/* Chips */}
        {messages.length < 3 && !isLoading && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-1">
                {suggestedPrompts.map((prompt, i) => (
                    <button 
                        key={i}
                        onClick={() => setInput(prompt)}
                        className="whitespace-nowrap px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-full text-xs text-slate-300 transition-colors shadow-sm"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        )}

        <div className="relative flex items-center">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 rounded-md border border-slate-700">
             <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask BuildIntel about your project..."
            className="w-full bg-slate-900 text-white placeholder-slate-500 rounded-xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-slate-800 resize-none h-14 shadow-inner"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;