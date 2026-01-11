import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { editCrystalImage } from '../services/geminiService';

interface CrystalEditorProps {
  onBack: () => void;
}

export const CrystalEditor: React.FC<CrystalEditorProps> = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setSelectedImage(result); 
          setResultImage(null);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) return;

    setIsProcessing(true);
    setError(null);

    try {
      const base64Data = selectedImage.split(',')[1];
      const modifiedImageBase64 = await editCrystalImage(base64Data, prompt);
      setResultImage(`data:image/png;base64,${modifiedImageBase64}`);
    } catch (err) {
      setError("Failed to process image. Please try again. Ensure your API key is valid.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const presetPrompts = [
    "Visualize the unit cell boundaries in red lines",
    "Change the background to a dark futuristic laboratory",
    "Highlight the Wyckoff positions with glowing spheres",
    "Convert this structure to a wireframe schematic",
    "Make the crystal look like it's made of pure diamond"
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 p-6 overflow-y-auto bg-orange-50">
      {/* Left Panel: Inputs */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="glass-panel rounded-2xl p-6 shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900">
            <Sparkles className="w-5 h-5 text-orange-600" />
            AI Crystal Refiner
          </h2>
          
          {/* Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-500 mb-2">Input Structure (Image)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-orange-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group"
            >
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-orange-500 mb-2" />
              <span className="text-sm text-slate-500 group-hover:text-slate-700">Click to upload SEM/TEM or Structure Image</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          {/* Prompt Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-500 mb-2">Refinement Instruction</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Add a retro filter' or 'Highlight defects in red'..."
              className="w-full bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none h-32 placeholder-slate-400"
            />
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2 mb-6">
            {presetPrompts.map((p, i) => (
              <button 
                key={i}
                onClick={() => setPrompt(p)}
                className="text-xs bg-white hover:bg-orange-50 border border-orange-200 text-slate-600 px-3 py-1 rounded-full transition-colors shadow-sm"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedImage || !prompt || isProcessing}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              !selectedImage || !prompt || isProcessing
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing Structure...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Variation
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Visualization */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        {/* Preview Area */}
        <div className="flex-1 rounded-2xl p-1 relative overflow-hidden flex items-center justify-center bg-white border border-orange-200 shadow-sm min-h-[400px]">
           {!selectedImage ? (
             <div className="text-center text-slate-400">
               <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
               <p className="text-lg font-light">Select a crystal structure image to begin refinement</p>
             </div>
           ) : (
             <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
               {/* Before */}
               <div className="relative rounded-xl overflow-hidden group border border-slate-100">
                 <img src={selectedImage} alt="Original" className="w-full h-full object-contain bg-slate-50" />
                 <div className="absolute top-2 left-2 bg-white/80 text-slate-800 text-xs px-2 py-1 rounded backdrop-blur-sm shadow-sm font-semibold">Original</div>
               </div>
               
               {/* After */}
               <div className="relative rounded-xl overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-100">
                 {resultImage ? (
                   <>
                    <img src={resultImage} alt="Refined" className="w-full h-full object-contain animate-in fade-in duration-700" />
                    <div className="absolute top-2 left-2 bg-slate-900 text-white text-xs px-2 py-1 rounded backdrop-blur-sm shadow-lg font-semibold">Refined</div>
                    <a 
                      href={resultImage} 
                      download="crystal-refined.png"
                      className="absolute bottom-4 right-4 bg-white hover:bg-slate-50 p-2 rounded-full backdrop-blur-md transition-all text-slate-900 shadow-md border border-slate-200"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                   </>
                 ) : (
                   <div className="flex flex-col items-center justify-center text-slate-500">
                     {isProcessing ? (
                       <div className="w-full flex flex-col items-center gap-4">
                         <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-t-4 border-orange-500 rounded-full animate-spin"></div>
                         </div>
                         <p className="text-sm animate-pulse text-orange-600 font-medium">Passing through Neural Layers...</p>
                         <p className="text-xs text-slate-400">Applying: "{prompt}"</p>
                       </div>
                     ) : (
                       <>
                         <ArrowRight className="w-8 h-8 opacity-20 mb-2" />
                         <p className="text-sm">Output will appear here</p>
                       </>
                     )}
                   </div>
                 )}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};