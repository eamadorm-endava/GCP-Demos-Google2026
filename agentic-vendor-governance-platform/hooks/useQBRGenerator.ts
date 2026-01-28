import { useState, useMemo, useEffect } from 'react';
import { generateQBRContent, generateSlidesJSON } from '../geminiService';
// FIX: Import GovernanceEvent from types.ts instead of constants.ts to resolve export error.
import { VENDORS, METRIC_LOGS } from '../constants';
import type { GovernanceEvent } from '../types';

export const useQBRGenerator = (initialVendorId: string, allEvents: GovernanceEvent[]) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qbrResult, setQbrResult] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(0);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<string>(initialVendorId);
  const [slidesData, setSlidesData] = useState<any[] | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSlidePreview, setShowSlidePreview] = useState(false);

  useEffect(() => {
    setSelectedVendorId(initialVendorId);
    resetQBRState();
  }, [initialVendorId]);

  const currentVendor = useMemo(() => VENDORS.find(v => v.id === selectedVendorId) || VENDORS[0], [selectedVendorId]);
  const vendorMetrics = useMemo(() => METRIC_LOGS.filter(m => m.vendorId === selectedVendorId), [selectedVendorId]);
  const vendorEvents = useMemo(() => allEvents.filter(e => e.vendorId === selectedVendorId), [selectedVendorId, allEvents]);

  const handleGenerateQBR = async () => {
    setIsGenerating(true);
    setExportSuccess(false);
    setExportUrl(null);
    setQbrResult(null);
    setSlidesData(null);
    
    try {
      // Simulate a slightly longer thinking process for better UX
      await new Promise(r => setTimeout(r, 2000));
      const content = await generateQBRContent(currentVendor, vendorMetrics, vendorEvents);
      setQbrResult({ ...content, vendorName: currentVendor.name });
    } catch (error) {
      console.error("QBR Generation failed", error);
      // In a real app, you'd set an error state here to show in the UI
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrepareSlides = async () => {
    if (!qbrResult) return;
    setIsExporting(true);
    setExportStep(0);
    setExportSuccess(false);

    try {
      await new Promise(r => setTimeout(r, 1500));
      setExportStep(1);

      const slides = await generateSlidesJSON(qbrResult);
      setSlidesData(slides);
      
      setIsExporting(false);
      setShowSlidePreview(true);
      setCurrentSlideIndex(0);
      
    } catch (error) {
      console.error("Slide preparation failed", error);
      setIsExporting(false);
    }
  };

  const handleFinalizeExport = async () => {
    setShowSlidePreview(false);
    setIsExporting(true);
    setExportStep(2);

    try {
      await new Promise(r => setTimeout(r, 1500));
      setExportStep(3);
      await new Promise(r => setTimeout(r, 1000));
      const mockSlideId = "1AbC_dEfGhIjKlMnOpQrStUvWxYz_mock_" + Math.random().toString(36).substr(2, 9);
      setExportUrl(`https://docs.google.com/presentation/d/${mockSlideId}/edit`);
      setExportSuccess(true);
    } catch (error) {
      console.error("Export finalization failed", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const resetQBRState = () => {
    setQbrResult(null);
    setExportSuccess(false);
    setSlidesData(null);
    setIsGenerating(false);
    setIsExporting(false);
    setShowSlidePreview(false);
  }

  const nextSlide = () => slidesData && setCurrentSlideIndex(prev => Math.min(prev + 1, slidesData.length - 1));
  const prevSlide = () => setCurrentSlideIndex(prev => Math.max(prev - 1, 0));

  return {
    isGenerating, qbrResult, isExporting, exportStep, exportSuccess, exportUrl,
    slidesData, currentSlideIndex, showSlidePreview, currentVendor, vendorMetrics, vendorEvents,
    handleGenerateQBR, handlePrepareSlides, handleFinalizeExport, 
    setShowSlidePreview, nextSlide, prevSlide, resetQBRState
  };
};
