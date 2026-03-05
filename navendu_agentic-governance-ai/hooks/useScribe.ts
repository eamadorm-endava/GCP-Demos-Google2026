
import { useState, useRef, useEffect, useCallback } from 'react';
import { transcribeAndSummarizeMeeting } from '../geminiService';
import { GovernanceEvent, GovernanceEventType } from '../types';

const MAX_RECORDING_DURATION = 60 * 60; // 1 hour

export const useScribe = (onScribeComplete: (event: GovernanceEvent) => void, selectedVendorId: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [scribeStatus, setScribeStatus] = useState<'idle' | 'recording' | 'processing' | 'done' | 'error'>('idle');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopAudioVisualization = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const processAudio = useCallback(async (blob: Blob) => {
    setScribeStatus('processing');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const result = await transcribeAndSummarizeMeeting(base64Audio, blob.type);
        
        const newEvent: GovernanceEvent = {
          id: `e-${Date.now()}`,
          type: GovernanceEventType.MonthlySync, // Default type
          date: new Date().toISOString().split('T')[0],
          summary: result.summary,
          vendorId: selectedVendorId,
          actionItems: result.actionItems
        };
        
        onScribeComplete(newEvent);
        setScribeStatus('done');
      };
    } catch (err) {
      console.error("Scribe processing failed", err);
      setScribeStatus('error');
    }
  }, [onScribeComplete, selectedVendorId]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        if (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.stop();
        }
    }
    setIsRecording(false);
    setIsPaused(false);
    if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
    }
    stopAudioVisualization();
  }, [stopAudioVisualization]);

  const startRecording = async () => {
    try {
      setRecordingProgress(0);
      setIsPaused(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      audioContextRef.current = audioContext;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        setAudioLevel(average);
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      const mimeType = ['audio/webm', 'audio/mp4', 'audio/wav'].find(t => MediaRecorder.isTypeSupported(t)) || 'audio/wav';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = () => processAudio(new Blob(audioChunksRef.current, { type: mimeType }));

      mediaRecorder.start(1000);
      setIsRecording(true);
      setScribeStatus('recording');
      
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingProgress(prev => {
          if (prev >= MAX_RECORDING_DURATION) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error("Failed to start recording", err);
      setScribeStatus('error');
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      recordingTimerRef.current = window.setInterval(() => setRecordingProgress(p => p + 1), 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    setIsPaused(!isPaused);
  };
  
  useEffect(() => {
    return () => { // Cleanup on unmount
        if (isRecording) stopRecording();
    }
  }, [isRecording, stopRecording]);

  const resetScribe = () => setScribeStatus('idle');

  return {
    isRecording, isPaused, recordingProgress, audioLevel, scribeStatus,
    startRecording, stopRecording, togglePause, processAudio, resetScribe
  };
};
