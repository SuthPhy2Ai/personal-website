import React, { useState, useRef } from 'react';
import { Upload, Wand2, Download, XCircle, RefreshCw, AlertTriangle, FileImage } from 'lucide-react';
import { cleanBase64, editImageWithGemini } from '../services/geminiService';
import { ImageEditState } from '../types';

const ImageEditor: React.FC = () => {
  const [state, setState] = useState<ImageEditState>({
    originalImage: null,
    generatedImage: null,
    prompt: '',
    isLoading: false,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setState(prev => ({ ...prev, error: "File too large. Max 5MB." }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setState({
          originalImage: reader.result as string,
          generatedImage: null,
          prompt: '',
          isLoading: false,
          error: null
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!state.originalImage || !state.prompt) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, mimeType } = cleanBase64(state.originalImage);
      const resultBase64 = await editImageWithGemini(data, mimeType, state.prompt);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        generatedImage: `data:image/png;base64,${resultBase64}`
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to generate image. Please try again."
      }));
    }
  };

  const downloadImage = () => {
    if (state.generatedImage) {
      const link = document.createElement('a');
      link.href = state.generatedImage;
      link.download = 'vector-lab-edit.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-gray font-sans relative overflow-x-hidden">
      {/* HUD Header */}
      <header className="fixed top-0 w-full z-50 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-cyan/20 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-cyber-cyan rounded-full animate-pulse shadow-[0_0_10px_#00F3FF]"></div>
           <span className="font-display font-bold text-xl tracking-widest text-white">VECTOR<span className="text-cyber-cyan">LAB</span> // EDIT</span>
        </div>
        <div className="font-mono text-xs text-cyber-cyan/60 hidden md:block">
          MODEL: GEMINI-2.5-FLASH-IMAGE
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Error Display */}
        {state.error && (
          <div className="mb-6 bg-cyber-red/10 border border-cyber-red text-cyber-red p-4 rounded flex items-center gap-3 font-mono">
            <AlertTriangle size={20} />
            <span>ERROR: {state.error}</span>
            <button onClick={() => setState(prev => ({...prev, error: null}))} className="ml-auto hover:text-white"><XCircle size={18}/></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[80vh]">
          
          {/* LEFT: Input Zone */}
          <div className="flex flex-col gap-4 h-full">
            <div className="relative flex-1 bg-cyber-dark/40 border border-cyber-gray/20 rounded-lg overflow-hidden group hover:border-cyber-cyan/50 transition-colors flex items-center justify-center">
              {state.originalImage ? (
                <img src={state.originalImage} alt="Original" className="max-h-full max-w-full object-contain p-4" />
              ) : (
                <div className="text-center p-8">
                  <FileImage className="mx-auto mb-4 text-cyber-gray/50 group-hover:text-cyber-cyan transition-colors" size={48} />
                  <p className="font-mono text-sm mb-4">DRAG & DROP OR UPLOAD SOURCE MATERIAL</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-cyber-dark border border-cyber-cyan text-cyber-cyan px-6 py-2 font-display tracking-widest hover:bg-cyber-cyan hover:text-cyber-black transition-all"
                  >
                    SELECT FILE
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
              />
              {state.originalImage && (
                 <button 
                   onClick={() => setState(prev => ({...prev, originalImage: null, generatedImage: null}))}
                   className="absolute top-4 right-4 bg-cyber-black/70 p-2 rounded-full text-cyber-red hover:bg-cyber-red hover:text-white transition-colors"
                 >
                   <XCircle size={20} />
                 </button>
              )}
            </div>

            {/* Prompt Area */}
            <div className="bg-cyber-dark/60 border border-cyber-gray/20 p-4 rounded-lg">
              <label className="font-mono text-xs text-cyber-cyan mb-2 block tracking-widest">COMMAND PROMPT</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={state.prompt}
                  onChange={(e) => setState(prev => ({...prev, prompt: e.target.value}))}
                  placeholder="e.g., Add a retro filter, remove the person in background..."
                  className="flex-1 bg-cyber-black border border-cyber-gray/30 rounded px-4 py-3 font-mono text-sm text-white focus:border-cyber-cyan outline-none transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                />
                <button
                  onClick={handleEdit}
                  disabled={!state.originalImage || !state.prompt || state.isLoading}
                  className={`px-6 bg-cyber-cyan text-cyber-black font-bold font-display tracking-widest rounded hover:shadow-[0_0_15px_#00F3FF] transition-all flex items-center gap-2
                    ${(!state.originalImage || !state.prompt || state.isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {state.isLoading ? <RefreshCw className="animate-spin" /> : <Wand2 size={18} />}
                  EXECUTE
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Output Zone */}
          <div className="relative flex-1 bg-cyber-dark/40 border border-cyber-cyan/30 rounded-lg overflow-hidden flex flex-col">
             <div className="absolute top-0 left-0 bg-cyber-cyan/20 px-4 py-1 font-mono text-xs text-cyber-cyan rounded-br-lg border-b border-r border-cyber-cyan/30">
               OUTPUT_STREAM
             </div>
             
             <div className="flex-1 flex items-center justify-center relative p-4">
                {state.isLoading ? (
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-mono text-cyber-cyan animate-pulse">PROCESSING VECTOR SPACE...</p>
                  </div>
                ) : state.generatedImage ? (
                  <img src={state.generatedImage} alt="Generated" className="max-h-full max-w-full object-contain shadow-[0_0_30px_rgba(0,243,255,0.1)]" />
                ) : (
                  <div className="text-cyber-gray/30 font-mono text-sm">
                    [AWAITING DATA PROCESSING]
                  </div>
                )}
             </div>

             {state.generatedImage && (
               <div className="p-4 border-t border-cyber-gray/20 bg-cyber-black/30 flex justify-end">
                 <button 
                   onClick={downloadImage}
                   className="flex items-center gap-2 text-cyber-cyan hover:text-white font-mono text-sm transition-colors"
                 >
                   <Download size={16} /> SAVE_ASSET
                 </button>
               </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default ImageEditor;
