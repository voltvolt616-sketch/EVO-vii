import React, { useState, useCallback, useRef } from 'react';
import type { UploadedFile } from '../types';
import { UploadIcon, ClearIcon } from './icons';

interface ImageUploaderProps {
  label: string;
  step: number;
  onFileChange: (file: UploadedFile | null) => void;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, step, onFileChange, id }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onFileChange({ file, base64: base64String });
      };
      reader.readAsDataURL(file);
    }
  }, [onFileChange]);
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    onFileChange(null);
  }

  const handleClick = () => {
    if (!preview) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <div className="flex items-center justify-center w-6 h-6 mr-3 text-black bg-green-400 rounded-full text-sm font-bold">{step}</div>
        <label htmlFor={id} className="block text-md font-medium text-green-300 font-tech-mono">{label}</label>
      </div>
      <div
        onClick={handleClick}
        className={`relative flex justify-center items-center w-full h-32 rounded-lg cursor-pointer bg-black/20 border-2 border-dashed  hover:border-green-400 transition-all duration-300 group ${preview ? 'border-green-500' : 'border-green-500/30'}`}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
        />
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg p-1" />
            <button 
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/80 transition-all"
              aria-label="Remove image"
            >
                <ClearIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="text-center text-gray-400 group-hover:text-green-300">
            <UploadIcon className="mx-auto h-8 w-8" />
            <p className="mt-1 text-xs">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;