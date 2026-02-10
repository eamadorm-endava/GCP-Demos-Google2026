import React, { useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { analyzeContractFile } from '../services/geminiService';
import { AnalyzedContract } from '../types';

interface ContractAnalysisProps {
  onAnalysisComplete: (contract: AnalyzedContract) => void;
}

export const ContractAnalysis: React.FC<ContractAnalysisProps> = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeContractFile(file);
      onAnalysisComplete(result);
    } catch (err) {
      setError("Failed to analyze contract. Please try again or check the API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-brand-primary-300)]">Analyze New Contract</h2>
        <p className="text-[var(--color-brand-sb-shade-30)] mt-1">
          Upload a contract (PDF or text) to extract metadata, identify missing clauses, and assess risk.
        </p>
      </div>

      <div className="bg-[var(--color-brand-sb-shade-90)] rounded-xl border border-[var(--color-brand-sb-shade-80)] shadow-sm p-8">
        <div className="bg-[var(--color-brand-sb-shade-80)]  border-2 border-dashed border-[var(--color-brand-sb-shade-60)] rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-[var(--color-brand-sb-shade-70)] transition-colors">
          <div className="w-16 h-16 bg-blue-50 text-[var(--color-brand-dv-blue)] rounded-full flex items-center justify-center mb-4">
            <Upload size={32} />
          </div>
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-lg font-medium text-[var(--color-brand-primary-300)]">Click to upload contract</span>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept=".pdf,.txt,.md"
              onChange={handleFileChange}
              disabled={isAnalyzing}
            />
          </label>
          <p className="text-sm text-[var(--color-brand-sb-shade-30)] mt-2">Supported formats: PDF, TXT</p>
          
          {file && (
            <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-700">
              <FileText size={18} />
              <span className="font-medium text-sm">{file.name}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
              !file || isAnalyzing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-[var(--color-brand-primary-50)] text-white hover:bg-[var(--color-brand-dv-orange-hover)] shadow-md hover:shadow-lg'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Analyzing with Gemini...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Run Risk Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Methodology Explanation Section (Matches User Request) */}
      <div className="bg-[var(--color-brand-sb-shade-60)] border border-[var(--color-brand-sb-shade-50)] rounded-xl p-6">
        <h3 className="font-semibold text-[var(--color-brand-primary-300)] mb-3">How Risk Metrics are Developed</h3>
        <ul className="space-y-2 text-sm text-[var(--color-brand-sb-shade-10)]">
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span><strong>Missing Clauses:</strong> The AI scans for mandatory compliance clauses (e.g., GDPR, AML/KYC). Absence increases risk score.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span><strong>Non-Standard Liability:</strong> Detection of uncapped liability or ambiguous indemnification terms triggers high-risk alerts.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span><strong>Auto-Renewal Check:</strong> Contracts without clear opt-out mechanisms for auto-renewal are flagged as potential silent costs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">•</span>
            <span><strong>Jurisdictional Analysis:</strong> Governing law is extracted to visualize concentration risk in specific regions (e.g., post-Brexit UK law).</span>
          </li>
        </ul>
      </div>
    </div>
  );
};