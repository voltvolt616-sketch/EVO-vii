import React, { useState } from 'react';
import { CloseIcon } from './icons';
import Spinner from './Spinner';

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
  isEditing: boolean;
}

const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, onSubmit, isEditing }) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-900 border border-green-700 rounded-xl shadow-2xl w-full max-w-lg relative p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-green-400 transition-colors">
          <CloseIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-green-300 mb-4 font-mono">Additional Edits</h2>
        <p className="text-gray-400 mb-6">Describe the changes you want in natural language. For example: "make the lighting softer" or "add a reflection on the floor".</p>

        {isEditing ? (
            <div className="py-12">
                <Spinner message="Applying edits..." />
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., resize the logo, add 'Summer Sale' text..."
                className="w-full h-28 p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                disabled={isEditing}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isEditing}
                className="w-full mt-6 py-3 px-6 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Apply Changes
              </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default EditDialog;
