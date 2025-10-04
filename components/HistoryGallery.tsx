import React from 'react';
import type { GeneratedImage } from '../types';
import { DownloadIcon, EyeIcon } from './icons';

interface HistoryGalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ images, onSelect }) => {
  const handleDownload = (e: React.MouseEvent, src: string, id: string) => {
    e.stopPropagation(); // Prevent onSelect from firing
    const link = document.createElement('a');
    link.href = src;
    link.download = `generated-image-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-24">
      <h2 className="text-3xl font-bold text-green-300 mb-8 text-center font-orbitron">Image History</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 border-green-900/50"
          >
            <img src={image.src} alt={`Generated ${image.id}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center space-x-4">
              <button
                onClick={() => onSelect(image)}
                className="opacity-0 group-hover:opacity-100 p-3 bg-black/50 text-green-400 rounded-full hover:bg-green-500 hover:text-black transition-all duration-300 transform group-hover:scale-100 scale-90"
                aria-label="View image"
              >
                <EyeIcon className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => handleDownload(e, image.src, image.id)}
                className="opacity-0 group-hover:opacity-100 p-3 bg-black/50 text-green-400 rounded-full hover:bg-green-500 hover:text-black transition-all duration-300 transform group-hover:scale-100 scale-90"
                aria-label="Download image"
              >
                <DownloadIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;