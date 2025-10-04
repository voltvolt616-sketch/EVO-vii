import React from 'react';
import type { GeneratedImage } from '../types';
import { DownloadIcon, EditIcon, LogoIcon } from './icons';

interface ResultDisplayProps {
  image: GeneratedImage | null;
  onEdit: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, onEdit }) => {
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image.src;
    link.download = `generated-image-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!image) {
    return (
        <div className="w-full h-full min-h-[30rem] flex flex-col items-center justify-center text-center glass-pane rounded-xl p-8">
            <LogoIcon className="w-24 h-24 text-green-500/30 animate-pulse" />
            <h3 className="mt-6 text-xl font-orbitron text-green-300/80">Your Creation Will Appear Here</h3>
            <p className="mt-2 text-gray-400">Upload your images and click generate.</p>
        </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="relative group w-full max-w-2xl rounded-xl shadow-2xl shadow-green-500/30">
        <img src={image.src} alt="Generated result" className="rounded-xl w-full" />
      </div>
      <div className="flex space-x-4 mt-8">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center px-5 py-2.5 bg-black/30 text-green-400 border border-green-700 rounded-lg hover:bg-green-900 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green-500"
        >
          <DownloadIcon className="h-5 w-5 mr-2" />
          Download
        </button>
        <button
          onClick={onEdit}
          className="flex items-center justify-center px-5 py-2.5 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green-500 font-semibold"
        >
          <EditIcon className="h-5 w-5 mr-2" />
          Make Edits
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;