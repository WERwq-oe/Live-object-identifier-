
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Status } from './types';
import { identifyImage } from './services/geminiService';
import CameraFeed from './components/CameraFeed';
import IdentificationDisplay from './components/IdentificationDisplay';
import ControlButton from './components/ControlButton';

const FRAME_CAPTURE_INTERVAL = 2000; // ms

export default function App() {
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [identifiedObject, setIdentifiedObject] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState<boolean>(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, []);

  const stopIdentification = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsIdentifying(false);
    if(streamRef.current) { // only change status if camera is active
        setStatus(Status.Ready);
    } else {
        setStatus(Status.Idle);
    }
  }, []);

  const captureAndIdentify = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setStatus(Status.Identifying);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64ImageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

    const result = await identifyImage(base64ImageData);
    
    if (result.startsWith("API Error:")) {
        setError(result);
        setStatus(Status.Error);
        stopIdentification();
    } else {
        setIdentifiedObject(result);
        setStatus(Status.Ready); // Ready for next identification
    }
  }, [stopIdentification]);


  const startIdentification = useCallback(async () => {
    setError(null);
    setIdentifiedObject('');
    setStatus(Status.Initializing);

    try {
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        setHasCameraPermission(true);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
        }
      }
      setIsIdentifying(true);
      setStatus(Status.Ready);
      intervalRef.current = window.setInterval(captureAndIdentify, FRAME_CAPTURE_INTERVAL);
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Could not access the camera. Please check permissions.");
      setStatus(Status.Error);
      setHasCameraPermission(false);
      setIsIdentifying(false);
    }
  }, [captureAndIdentify]);

  const handleToggleIdentification = () => {
    if (isIdentifying) {
      stopIdentification();
    } else {
      startIdentification();
    }
  };
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      stopIdentification();
      stopCamera();
    };
  }, [stopIdentification, stopCamera]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-6">
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Live Object Identifier
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            AI-powered object recognition with extreme accuracy.
          </p>
        </header>

        <CameraFeed videoRef={videoRef} isIdentifying={isIdentifying} hasCameraPermission={hasCameraPermission} />

        <IdentificationDisplay 
          status={isIdentifying && status === Status.Ready ? Status.Identifying : status} 
          result={identifiedObject} 
          error={error} 
        />
        
        <ControlButton 
          isIdentifying={isIdentifying}
          onClick={handleToggleIdentification}
          disabled={!hasCameraPermission && !isIdentifying}
        />

      </main>
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
