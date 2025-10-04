import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import AspectRatioSelector from './components/AspectRatioSelector';
import ResultDisplay from './components/ResultDisplay';
import EditDialog from './components/EditDialog';
import HistoryGallery from './components/HistoryGallery';
import Spinner from './components/Spinner';
import Login from './components/Login';
import type { UploadedFile, AspectRatio, GeneratedImage } from './types';
import { generateImage, editImage } from './services/geminiService';
import { LogoIcon, SparklesIcon } from './components/icons';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [designFile, setDesignFile] = useState<UploadedFile | null>(null);
  const [productFile, setProductFile] = useState<UploadedFile | null>(null);
  const [logoFile, setLogoFile] = useState<UploadedFile | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    // Open dialog only for new generations, not for selections from history
    if (currentResult && history[0]?.id === currentResult.id && !isLoading) {
      setIsEditDialogOpen(true);
    }
  }, [currentResult, history, isLoading]);

  const canGenerate = designFile && productFile && logoFile;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsLoading(true);
    setError(null);
    setCurrentResult(null);
    try {
      const resultSrc = await generateImage(designFile, productFile, logoFile, aspectRatio);
      const newImage: GeneratedImage = {
        id: new Date().toISOString(),
        src: resultSrc,
        prompt: "Initial generation",
        aspectRatio: aspectRatio,
      };
      setHistory(prev => [newImage, ...prev]);
      setCurrentResult(newImage);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditSubmit = async (prompt: string) => {
    if (!currentResult) return;
    setIsEditing(true);
    setError(null);
    try {
        const editedSrc = await editImage(currentResult.src, prompt);
        const editedImage: GeneratedImage = {
            ...currentResult,
            id: new Date().toISOString(),
            src: editedSrc,
            prompt: prompt,
        };
        setHistory(prev => [editedImage, ...prev.filter(img => img.id !== currentResult.id)]);
        setCurrentResult(editedImage);
        setIsEditDialogOpen(false);
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred during editing.');
    } finally {
        setIsEditing(false);
    }
  };

  const handleSelectFromHistory = (image: GeneratedImage) => {
    setCurrentResult(image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <LogoIcon className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl sm:text-5xl font-bold text-green-400 font-orbitron tracking-wider">
              AI Product Stylizer
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-400 font-tech-mono">Generate professional product photos in seconds.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6 glass-pane rounded-xl p-6 sm:p-8">
            <ImageUploader step={1} id="design-upload" label="التصميم (Design)" onFileChange={setDesignFile} />
            <ImageUploader step={2} id="product-upload" label="صورتك (Product)" onFileChange={setProductFile} />
            <ImageUploader step={3} id="logo-upload" label="لوجو (Logo)" onFileChange={setLogoFile} />
            <div className="pt-2">
                <AspectRatioSelector selected={aspectRatio} onChange={setAspectRatio} />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || isLoading}
              className="w-full mt-4 py-4 px-6 bg-green-500 text-black text-lg font-bold rounded-lg hover:bg-green-400 transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_30px_rgba(74,222,128,0.7)]"
            >
              <SparklesIcon className="w-6 h-6 mr-3" />
              {isLoading ? 'Generating...' : 'إنشاء الصورة'}
            </button>
          </div>
          
          <div className="lg:col-span-3 w-full flex items-center justify-center">
            {isLoading && <Spinner message="Generating image..." />}
            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700">{error}</div>}
            {!isLoading && <ResultDisplay image={currentResult} onEdit={() => setIsEditDialogOpen(true)} />}
          </div>
        </main>
        
        <HistoryGallery images={history} onSelect={handleSelectFromHistory} />
      </div>

      <EditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditSubmit}
        isEditing={isEditing}
      />
    </div>
  );
};

export default App;