
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
            targetStore,
            lookalikeStore
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

    const suggestedQueries = [
        { label: 'Risk Analysis', query: 'What is the financial risk?' },
        { label: 'Competitors', query: 'How does this compare to competitors?' },
        { label: 'Timeline', query: 'What is the recommended rollout timeline?' },
    ];

    return (
        <div className={`${theme.components.card} flex flex-col md:flex-row relative overflow-hidden shadow-2xl min-h-[520px] lg:h-[460px]`}>

            {/* ── Left Context Pane ── */}
            <div className="md:w-[300px] flex-shrink-0 flex flex-col relative overflow-hidden border-r border-[#47555F]">
                {/* Gradient header */}
                <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-[#FF5640] to-[#c43d2d]">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-[#FF5640]/30 shadow-lg">
                            <BrainCircuit className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm leading-tight">ShelfLogic AI Advisor</h3>
                            <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">Strategic Intelligence</p>
                        </div>
                    </div>
                    <p className="relative z-10 text-white/80 text-xs mt-3 leading-relaxed">
                        Analyzing <span className="text-white font-semibold">{opportunity.type.replace(/_/g, ' ')}</span> for {targetStore.name.split(' (')[0]}.
                    </p>
                </div>

                {/* Rationale section */}
                <div className="flex-1 overflow-y-auto px-5 py-4 bg-[#30404B] custom-scrollbar">
                    <p className="text-[9px] font-bold text-[#758087] uppercase tracking-widest mb-3">AI Signal Rationale</p>
                    <div className="space-y-1">
                        {opportunity.match_reasons.map((reason, index) => (
                            <div key={index} className="border-b border-[#47555F] last:border-b-0">
                                <button
                                    onClick={() => setExpandedRationale(expandedRationale === index ? null : index)}
                                    className="w-full flex justify-between items-center text-left py-2.5 group"
                                >
                                    <span className="text-[11px] font-semibold text-[#D1D5D7] group-hover:text-[#FF5640] transition-colors flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full bg-[#FF5640]/15 border border-[#FF5640]/30 text-[#FF5640] text-[9px] flex items-center justify-center font-bold flex-shrink-0">{index + 1}</span>
                                        Signal #{index + 1}
                                    </span>
                                    {expandedRationale === index
                                        ? <ChevronUp className="w-3.5 h-3.5 text-[#FF5640]" />
                                        : <ChevronDown className="w-3.5 h-3.5 text-[#758087]" />}
                                </button>
                                {expandedRationale === index && (
                                    <div className="pb-3 text-[11px] text-[#A3AAAF] animate-in leading-relaxed pl-6">
                                        {reason}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Suggested queries */}
                <div className="px-5 py-4 border-t border-[#47555F] bg-[#192B37]/50">
                    <p className="text-[9px] text-[#758087] uppercase font-bold mb-2 tracking-widest">Quick Questions</p>
                    <div className="flex flex-wrap gap-1.5">
                        {suggestedQueries.map((q) => (
                            <button
                                key={q.label}
                                onClick={() => setUserInput(q.query)}
                                className="px-2.5 py-1 bg-[#47555F] hover:bg-[#FF5640] rounded-full border border-[#5E6A73] hover:border-[#FF5640] text-[10px] text-[#BABFC3] hover:text-white transition-all font-medium"
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Chat Pane ── */}
            <div className="flex-1 flex flex-col bg-[#192B37] min-w-0">
                {/* Chat header */}
                <div className="px-6 py-3.5 bg-[#30404B]/60 border-b border-[#47555F] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#FF5640] rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-[#D1D5D7] uppercase tracking-widest">Live Chat</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#758087] font-mono">
                        <span className="px-2 py-0.5 bg-[#FF5640]/10 border border-[#FF5640]/20 rounded text-[#FF5640] font-semibold">Gemini AI</span>
                        <span>·</span>
                        <span>{(opportunity.match_score * 100).toFixed(0)}% confidence</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar">
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#30404B] rounded-2xl rounded-bl-none px-5 py-4 border border-[#5E6A73] max-w-[85%]">
                                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-[#FF5640] uppercase tracking-wider">
                                    <Sparkles className="w-3 h-3" /> AI Advisor
                                </div>
                                <div className="flex gap-1.5 items-center py-1">
                                    <div className="w-2 h-2 bg-[#FF5640] rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-[#FF5640] rounded-full animate-bounce delay-100" />
                                    <div className="w-2 h-2 bg-[#FF5640] rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        </div>
                    )}

                    {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'assistant' && (
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF5640] to-[#c43d2d] flex items-center justify-center flex-shrink-0 mr-3 mt-1 shadow-lg shadow-[#FF5640]/20">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                            )}
                            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
                                ? 'bg-[#FF5640] text-white rounded-br-sm'
                                : 'bg-[#30404B] text-[#E8EAEB] border border-[#5E6A73] rounded-bl-sm'
                                }`}>
                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-[#FF5640] uppercase tracking-wider">
                                        ShelfLogic AI Advisor
                                    </div>
                                )}
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <p className="text-[9px] mt-1.5 opacity-50 text-right">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isChatting && (
                        <div className="flex justify-start">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF5640] to-[#c43d2d] flex items-center justify-center flex-shrink-0 mr-3 shadow-lg shadow-[#FF5640]/20">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="bg-[#30404B] rounded-2xl rounded-bl-sm px-4 py-3 border border-[#5E6A73] flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-[#FF5640] rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-[#FF5640] rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-[#FF5640] rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input bar */}
                <div className="px-5 py-4 bg-[#30404B]/40 border-t border-[#47555F]">
                    <div className="relative flex items-center gap-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask me anything about this opportunity..."
                            className="flex-1 bg-[#192B37] border border-[#5E6A73] rounded-xl px-4 py-3 text-sm text-white placeholder-[#758087] focus:outline-none focus:border-[#FF5640] focus:ring-2 focus:ring-[#FF5640]/20 transition-all"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!userInput.trim() || isChatting}
                            className="p-3 bg-[#FF5640] hover:bg-[#E64D39] text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#FF5640]/30 hover:shadow-[#FF5640]/50 hover:scale-105 active:scale-95 flex-shrink-0"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
