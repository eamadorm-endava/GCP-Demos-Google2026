
import React, { useState, useEffect, useRef } from 'react';
import { Opportunity, Store, ChatMessage } from '../types';
import { chatWithData } from '../services/geminiService';
import { BrainCircuit, Sparkles, Send, ChevronDown, ChevronUp } from './Icons';
import { theme } from '../theme';

interface AiCopilotProps {
    opportunity: Opportunity;
    targetStore: Store;
    lookalikeStore?: Store;
    initialInsight: string;
    isLoading: boolean;
}

export const AiCopilot: React.FC<AiCopilotProps> = ({ opportunity, targetStore, lookalikeStore, initialInsight, isLoading }) => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isChatting, setIsChatting] = useState(false);
    const [expandedRationale, setExpandedRationale] = useState<number | null>(0);
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (!isLoading && initialInsight) {
            setChatMessages([{
                id: 'init',
                role: 'assistant',
                text: initialInsight,
                timestamp: new Date()
            }]);
        }
    }, [isLoading, initialInsight]);
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: userInput,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, newUserMsg]);
        setUserInput('');
        setIsChatting(true);

        const responseText = await chatWithData(userInput, {
            opportunity,
            targetStoreName: targetStore.name,
            lookalikeStoreName: lookalikeStore?.name
        });

        const newAiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            text: responseText,
            timestamp: new Date()
        };
        setChatMessages(prev => [...prev, newAiMsg]);
        setIsChatting(false);
    };

    return (
        <div className={`${theme.components.card} flex flex-col md:flex-row relative overflow-hidden group shadow-xl min-h-[500px] lg:h-[400px]`}>
            {/* Left Context Pane */}
            <div className="md:w-1/3 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"></div>
                 <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/30">
                            <BrainCircuit className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-lg">Strategic AI Advisor</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">
                        I've analyzed the <span className="text-indigo-400 font-bold">{opportunity.type.replace('_', ' ')}</span> opportunity for {targetStore.name}. Here is my reasoning:
                    </p>
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">AI Rationale</div>
                        {opportunity.match_reasons.map((reason, index) => (
                            <div key={index} className="border-b border-slate-800 last:border-b-0">
                                <button
                                    onClick={() => setExpandedRationale(expandedRationale === index ? null : index)}
                                    className="w-full flex justify-between items-center text-left py-2.5 group"
                                >
                                    <span className="text-xs font-bold text-slate-300 group-hover:text-indigo-400 transition-colors">Signal #{index + 1}</span>
                                    {expandedRationale === index ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                </button>
                                {expandedRationale === index && (
                                    <div className="pb-3 text-xs text-slate-400 animate-in fade-in duration-300 leading-relaxed">
                                        {reason}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                 </div>
                 <div className="mt-auto pt-4 border-t border-slate-800">
                     <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Suggested Queries</p>
                     <div className="flex flex-wrap gap-2">
                         <button onClick={() => setUserInput("What is the financial risk?")} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-xs text-indigo-300 transition-colors">Risk Analysis</button>
                         <button onClick={() => setUserInput("How does this compare to competitors?")} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-xs text-indigo-300 transition-colors">Competitors</button>
                     </div>
                 </div>
            </div>

            {/* Right Chat Pane */}
            <div className="flex-1 bg-slate-950 flex flex-col relative">
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                            }`}>
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-2 mb-1 text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                        <Sparkles className="w-3 h-3" /> AI Advisor
                                    </div>
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isChatting && (
                        <div className="flex justify-start">
                             <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700 flex items-center gap-2">
                                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                             </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                
                <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask me anything about this data..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                        <button 
                            onClick={handleSendMessage}
                            disabled={!userInput.trim() || isChatting}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
