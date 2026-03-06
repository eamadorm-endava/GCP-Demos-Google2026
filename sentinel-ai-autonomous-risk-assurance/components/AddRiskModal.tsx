import React, { useState } from 'react';
import { X, Shield, AlertTriangle } from 'lucide-react';
import { Risk, RiskSeverity } from '../types';

interface AddRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (risk: Risk) => void;
  existingCount: number;
}

const AddRiskModal: React.FC<AddRiskModalProps> = ({ isOpen, onClose, onAdd, existingCount }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState<RiskSeverity>(RiskSeverity.MEDIUM);
  const [controlName, setControlName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRisk: Risk = {
      id: `r-${existingCount + 1}`,
      title,
      description,
      category: category || 'General Operations',
      severity,
      scoring: Math.floor(Math.random() * 20) + 70, // Random score between 70-90
      controls: [
        {
          id: `c-${Date.now()}`,
          name: controlName || 'Standard Verification Control',
          description: 'Automated check for compliance.',
          type: 'Detective',
          agentCapability: 'GENERIC_AUDIT',
          frameworkMappings: ['Internal Policy'],
        }
      ]
    };

    onAdd(newRisk);
    onClose();

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setSeverity(RiskSeverity.MEDIUM);
    setControlName('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-endava-dark/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-endava-blue-90 border border-white/10 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-endava-dark/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-endava-orange/10 rounded-lg border border-endava-orange/20 text-endava-orange">
              <img src="/endava_symbol_RGB.svg" alt="Endava Logo" className="w-5 h-5 object-contain" />
            </div>
            <h2 className="text-xl font-bold text-white">Define New Risk</h2>
          </div>
          <button onClick={onClose} className="text-endava-blue-40 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-endava-blue-40 uppercase tracking-wider mb-2">Risk Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-endava-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-endava-orange transition-colors"
              placeholder="e.g. Unencrypted Data Transmission"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-endava-blue-40 uppercase tracking-wider mb-2">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-endava-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-endava-orange transition-colors"
              placeholder="Describe the potential impact and context..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-endava-blue-40 uppercase tracking-wider mb-2">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as RiskSeverity)}
                className="w-full bg-endava-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-endava-orange transition-colors appearance-none"
              >
                {Object.values(RiskSeverity).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-endava-blue-40 uppercase tracking-wider mb-2">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-endava-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-endava-orange transition-colors"
                placeholder="e.g. Compliance"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 mt-2">
            <h3 className="text-sm font-semibold text-endava-blue-40 mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-endava-orange" /> Initial Control Setup
            </h3>
            <div>
              <label className="block text-xs font-semibold text-endava-blue-40 uppercase tracking-wider mb-2">Control Name</label>
              <input
                type="text"
                value={controlName}
                onChange={(e) => setControlName(e.target.value)}
                className="w-full bg-endava-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-endava-orange transition-colors"
                placeholder="e.g. TLS Verification Agent"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-endava-blue-40 hover:text-white hover:bg-endava-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm endava-gradient text-white font-medium shadow-lg shadow-endava-orange/20"
            >
              Add Risk Scenario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRiskModal;