
import React from 'react';
import { PlayIcon, StopIcon } from './icons';

interface ControlButtonProps {
  isIdentifying: boolean;
  onClick: () => void;
  disabled: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ isIdentifying, onClick, disabled }) => {
  const baseClasses = "relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";
  const activeClasses = isIdentifying
    ? "bg-red-600 hover:bg-red-700 focus:ring-red-400"
    : "bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-300";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${activeClasses}`}
      aria-label={isIdentifying ? 'Stop identification' : 'Start identification'}
    >
      <span className={`absolute inset-0 rounded-full ${isIdentifying ? 'animate-ping bg-red-500 opacity-75' : 'animate-ping bg-cyan-400 opacity-75'}`}></span>
      <span className="relative z-10">
        {isIdentifying ? <StopIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
      </span>
    </button>
  );
};

export default ControlButton;
