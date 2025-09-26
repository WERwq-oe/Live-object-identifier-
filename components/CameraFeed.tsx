
import React, { RefObject } from 'react';
import { CameraOffIcon } from './icons';

interface CameraFeedProps {
  videoRef: RefObject<HTMLVideoElement>;
  isIdentifying: boolean;
  hasCameraPermission: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ videoRef, isIdentifying, hasCameraPermission }) => {
  const borderColor = isIdentifying ? 'border-cyan-400' : 'border-gray-700';
  const shadow = isIdentifying ? 'shadow-[0_0_25px_5px] shadow-cyan-500/50' : 'shadow-lg';

  return (
    <div className={`relative w-full aspect-video bg-black rounded-2xl transition-all duration-500 ${borderColor} border-4 ${shadow} overflow-hidden`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      {!hasCameraPermission && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-4">
          <CameraOffIcon className="w-20 h-20 text-red-500 mb-4" />
          <h3 className="text-2xl font-bold text-red-400">Camera Access Denied</h3>
          <p className="text-gray-300 mt-2">Please allow camera permissions in your browser to use this app.</p>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
