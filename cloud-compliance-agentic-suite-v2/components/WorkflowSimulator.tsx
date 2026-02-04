import React, { useState, useEffect } from 'react';
import { AgentRole } from '../types';
import { FINRA_3110_WORKFLOW } from '../constants';

const WorkflowSimulator: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStep = FINRA_3110_WORKFLOW[currentStepIndex];

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));
  };

  const executeStep = () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    addLog(`SYSTEM: Triggering Step ${currentStep.id} - ${currentStep.title}`);
    
    // Simulate agent "reasoning" delay
    setTimeout(() => {
      addLog(`${currentStep.primaryAgent.toUpperCase()}: ${currentStep.outputSummary}`);
      setCompletedSteps(prev => [...new Set([...prev, currentStep.id])]);
      setIsExecuting(false);
      
      if (currentStepIndex < FINRA_3110_WORKFLOW.length - 1) {
        // Automatically scroll logs could be here
      }
    }, 1500);
  };

  const goToNext = () => {
    if (currentStepIndex < FINRA_3110_WORKFLOW.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const resetWorkflow = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setLogs(["[SYSTEM] Workflow reset. Waiting for user initialization."]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Workflow Header */}
      <div className="bg-brand-gradient rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-3">Workflow: FINRA 3110 Rule Testing</h2>
          <p className="text-white/90 leading-relaxed">
            Demonstrating how the ADK framework executes end-to-end testing of daily trade blotter supervisory reviews.
          </p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 text-[12rem] -mr-12 -mt-12 text-white">
          <i className="fas fa-route"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Progress Stepper */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-brand-secondary p-6 rounded-2xl border border-brand-border shadow-lg">
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-widest mb-6">Execution Roadmap</h3>
            <div className="space-y-0">
              {FINRA_3110_WORKFLOW.map((step, idx) => (
                <div key={step.id} className="relative">
                  {idx !== FINRA_3110_WORKFLOW.length - 1 && (
                    <div className={`absolute left-4 top-8 w-0.5 h-12 ${completedSteps.includes(step.id) ? 'bg-brand-primary' : 'bg-brand-border'}`} />
                  )}
                  <button
                    onClick={() => !isExecuting && setCurrentStepIndex(idx)}
                    className={`flex items-start gap-4 p-3 rounded-xl w-full text-left transition-all cursor-pointer ${
                      currentStepIndex === idx ? 'bg-brand-primary/10 border border-brand-primary/50' : 'hover:bg-brand-dark border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors ${
                      completedSteps.includes(step.id) ? 'bg-brand-primary text-white' : 
                      currentStepIndex === idx ? 'bg-brand-secondary border-2 border-brand-primary text-brand-primary' : 'bg-brand-dark text-brand-muted border border-brand-border'
                    }`}>
                      {completedSteps.includes(step.id) ? <i className="fas fa-check"></i> : step.id}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${currentStepIndex === idx ? 'text-white' : 'text-brand-muted'}`}>{step.title}</p>
                      <p className="text-[11px] text-brand-muted/70 uppercase font-medium">{step.primaryAgent}</p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-dark rounded-2xl p-6 shadow-xl border border-brand-border">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest">Execution Stream</h3>
               <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
             </div>
             <div className="h-48 overflow-y-auto space-y-2 font-mono text-[10px] text-brand-muted">
               {logs.length === 0 && <p className="italic opacity-50">Awaiting workflow initialization...</p>}
               {logs.map((log, i) => (
                 <div key={i} className="border-l border-brand-border pl-3 py-0.5 animate-fadeIn">
                   {log}
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right: Stage Detail & Interaction */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-secondary p-8 rounded-2xl border border-brand-border shadow-lg relative overflow-hidden h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="px-3 py-1 bg-brand-dark text-brand-primary text-[10px] font-extrabold uppercase rounded-full border border-brand-border">
                  Step {currentStep.id} of 5
                </span>
                <h3 className="text-2xl font-bold text-white mt-4">{currentStep.title}</h3>
                <p className="text-brand-muted mt-2 text-lg leading-relaxed">{currentStep.description}</p>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg border border-white/10 ${
                  currentStep.primaryAgent.includes('Super') ? 'bg-brand-primary' :
                  currentStep.primaryAgent.includes('Doc') ? 'bg-data-blue' :
                  currentStep.primaryAgent.includes('Eff') ? 'bg-data-green' : 'bg-data-orange'
                }`}>
                  <i className={`fas ${
                    currentStep.primaryAgent.includes('Super') ? 'fa-user-tie' :
                    currentStep.primaryAgent.includes('Doc') ? 'fa-file-shield' :
                    currentStep.primaryAgent.includes('Eff') ? 'fa-bolt' : 'fa-compass-drafting'
                  }`}></i>
                </div>
                <span className="text-[10px] font-bold text-brand-muted mt-2 uppercase tracking-tighter">Active Agent</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="bg-brand-dark rounded-xl p-6 border border-brand-border">
                <h4 className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Technical Manifest</h4>
                <ul className="space-y-3">
                  {currentStep.technicalDetails.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-brand-muted">
                      <i className="fas fa-chevron-right text-[10px] text-brand-primary"></i>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-primary/5 rounded-xl p-6 border border-brand-primary/20 flex flex-col justify-center items-center text-center">
                {isExecuting ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-brand-primary font-bold animate-pulse">Agent Reasoning in Progress...</p>
                  </div>
                ) : completedSteps.includes(currentStep.id) ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-signal-green text-white rounded-full flex items-center justify-center mx-auto text-xl shadow-lg animate-bounce">
                      <i className="fas fa-check"></i>
                    </div>
                    <div>
                      <p className="text-signal-green font-bold">Step Complete</p>
                      <p className="text-xs text-brand-muted mt-1">{currentStep.outputSummary}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-brand-muted text-sm">Awaiting instruction from the Lead Auditor.</p>
                    <button
                      onClick={executeStep}
                      className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold shadow-lg hover:bg-brand-hover transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-brand-primary/30"
                    >
                      {currentStep.actionLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-border flex justify-between items-center">
              <button 
                onClick={resetWorkflow}
                className="text-xs font-bold text-brand-muted hover:text-signal-red transition-colors cursor-pointer"
              >
                <i className="fas fa-undo mr-1"></i> RESET WORKFLOW
              </button>
              <div className="flex gap-3">
                <button 
                  disabled={currentStepIndex === 0 || isExecuting}
                  onClick={() => setCurrentStepIndex(prev => prev - 1)}
                  className="px-4 py-2 text-sm font-bold text-brand-muted hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  Back
                </button>
                <button 
                  disabled={!completedSteps.includes(currentStep.id) || currentStepIndex === FINRA_3110_WORKFLOW.length - 1 || isExecuting}
                  onClick={goToNext}
                  className="px-6 py-2 bg-white text-brand-secondary text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  Proceed to Step {currentStep.id + 1}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Footnote */}
      <div className="bg-signal-amber/10 border border-signal-amber/30 p-4 rounded-xl flex items-start gap-4">
        <div className="w-10 h-10 bg-signal-amber/20 rounded-lg flex items-center justify-center text-signal-amber shrink-0">
          <i className="fas fa-lightbulb"></i>
        </div>
        <div>
          <h4 className="text-sm font-bold text-signal-amber">Framework Insight</h4>
          <p className="text-xs text-brand-muted mt-1 opacity-80">
            This workflow demonstrates **Model Context Protocol (MCP)** native tool use. By Step 5, the system-agnostic framework can update enterprise systems like **RSA Archer** or **ServiceNow GRC** directly via authenticated REST adapters, closing the loop on compliance remediation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSimulator;