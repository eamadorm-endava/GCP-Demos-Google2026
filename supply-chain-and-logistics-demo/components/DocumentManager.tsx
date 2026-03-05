import React, { useRef, useState } from 'react';
import type { Document } from '../types';
import { DocumentIcon, UploadIcon, SpinnerIcon, CheckCircleIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface DocumentManagerProps {
  shipmentId: string;
  documents: Document[];
  onAddDocument: (shipmentId: string, document: Document) => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ shipmentId, documents, onAddDocument }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  const { t } = useLanguage();

  const handleUploadClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadSuccessMessage('');

      // Simulate upload delay and show success message
      setTimeout(() => {
        setIsUploading(false);
        const newDocument: Document = {
            id: `doc-sim-${Date.now()}`,
            name: file.name,
            url: '#',
            uploadedAt: new Date().toISOString().split('T')[0],
        };
        onAddDocument(shipmentId, newDocument);
        setUploadSuccessMessage(t('uploadSuccess', { fileName: file.name }));
        
        // Clear success message after 3 seconds
        setTimeout(() => setUploadSuccessMessage(''), 3000);

      }, 1500);
    }
    // Reset file input to allow re-uploading the same file
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">{t('shipmentDocuments')}</h3>
            <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded-2xl shadow-lg hover:bg-endava-blue-70 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                {isUploading ? (
                    <>
                        <SpinnerIcon className="w-5 h-5 animate-spin"/>
                        {t('uploading')}
                    </>
                ) : (
                    <>
                        <UploadIcon className="w-5 h-5"/>
                        {t('uploadDocument')}
                    </>
                )}
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
            />
        </div>

        {uploadSuccessMessage && (
            <div className="mb-4 p-3 rounded-md bg-green-900/20 border border-green-800/50 text-sm text-green-400 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                <span>{uploadSuccessMessage}</span>
            </div>
        )}

      {documents.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl">
          <DocumentIcon className="mx-auto h-12 w-12 text-endava-blue-40" />
          <h3 className="mt-2 text-sm font-semibold text-white">{t('noDocuments')}</h3>
          <p className="mt-1 text-sm text-endava-blue-40">{t('getStartedUploading')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 border border-white/10 rounded-md">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between p-3">
              <div className="flex items-center">
                <DocumentIcon className="h-6 w-6 text-endava-blue-40 mr-3" />
                <div>
                  <p className="text-sm font-medium text-white">{doc.name}</p>
                  <p className="text-xs text-endava-blue-40">{t('uploadedOn', { date: doc.uploadedAt })}</p>
                </div>
              </div>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-endava-orange hover:text-endava-orange">
                {t('view')}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};