
import React, { useState } from 'react';
import { SearchIcon } from '../ui/Icons';

interface NLQSearchProps {
    query: string;
    setQuery: (query: string) => void;
    onAskAI: (query: string) => void;
    isAiLoading: boolean;
}

export const NLQ_Search: React.FC<NLQSearchProps> = ({ query, setQuery, onAskAI, isAiLoading }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            onAskAI(query);
        }
    };

    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className={`h-5 w-5 transition-colors duration-200 ${isAiLoading ? 'text-brand-highlight animate-pulse' : 'text-brand-light group-focus-within:text-brand-highlight'}`} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isAiLoading}
                placeholder='Search or ask AI... (e.g. "Which suppliers have single-source risk?")'
                className={`block w-full bg-brand-secondary border border-brand-accent/40 text-brand-text rounded-xl py-3.5 pl-12 pr-28 shadow-inner placeholder:text-brand-light/40 focus:outline-none focus:ring-2 focus:ring-brand-highlight/50 focus:border-brand-highlight/50 transition-all duration-200 ${isAiLoading ? 'opacity-70 cursor-wait' : 'hover:border-brand-accent/70'}`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                    onClick={() => onAskAI(query)}
                    disabled={isAiLoading || !query.trim()}
                    className="bg-brand-highlight hover:bg-brand-highlight-dark text-white px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-brand-highlight/20"
                >
                    {isAiLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Thinking...
                        </span>
                    ) : 'Ask AI'}
                </button>
            </div>
            {query && !isAiLoading && (
                <div className="absolute -bottom-6 left-0 text-[10px] text-brand-light/50 animate-fade-in">
                    Press <span className="font-bold text-brand-light/80">Enter</span> to run AI query
                </div>
            )}
        </div>
    );
};
