
import React from 'react';
import { Status } from '../types';

interface IdentificationDisplayProps {
  status: Status;
  result: string;
  error: string | null;
}

const StatusIndicator: React.FC<{ status: Status }> = ({ status }) => {
    if (status !== Status.Identifying) {
        return <p className="text-lg text-gray-400">{status}</p>;
    }
    return (
        <div className="flex items-center space-x-2">
            <p className="text-lg text-cyan-400">{status}</p>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
        </div>
    );
}

const IdentificationDisplay: React.FC<IdentificationDisplayProps> = ({ status, result, error }) => {
  return (
    <div className="w-full text-center p-6 bg-gray-800/50 rounded-2xl min-h-[140px] flex flex-col justify-center items-center backdrop-blur-sm">
      <StatusIndicator status={status} />
      {status === Status.Error && error && (
        <p className="text-xl text-red-400 font-semibold mt-2">{error}</p>
      )}
      {result && (
        <h2 className="text-5xl font-bold tracking-tight text-white mt-2 capitalize animate-fade-in">{result}</h2>
      )}
    </div>
  );
};

export default IdentificationDisplay;

