import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

const ratios: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: '1:1' },
  { value: '4:5', label: '4:5' },
  { value: '3:2', label: '3:2' },
  { value: '2:1', label: '2:1' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onChange }) => {
  return (
    <div>
      <div className="flex items-center mb-3">
        <div className="flex items-center justify-center w-6 h-6 mr-3 text-black bg-green-400 rounded-full text-sm font-bold">4</div>
        <label className="block text-md font-medium text-green-300 font-tech-mono">Select Aspect Ratio</label>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {ratios.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`px-2 py-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green-400 ${
              selected === value
                ? 'bg-green-500 text-black shadow-lg shadow-green-500/20'
                : 'bg-black/20 text-green-300 hover:bg-green-500/20'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;