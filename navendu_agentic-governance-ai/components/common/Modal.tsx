
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-endava-dark/50 backdrop-blur-sm animate-in fade-in duration-200"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`bg-endava-blue-90 w-full ${maxWidth} rounded-[2.5rem] p-8 lg:p-10 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8 shrink-0">
          <h3 id="modal-title" className="text-2xl font-semibold text-white tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-endava-blue-70 rounded-full text-endava-blue-40 transition-colors" aria-label="Close modal">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto pr-2 -mr-2">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
