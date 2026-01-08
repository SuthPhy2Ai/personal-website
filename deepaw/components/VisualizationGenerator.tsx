import React, { useState, useEffect } from 'react';
import { generateScientificImage, checkApiKeySelection, promptForKeySelection } from '../services/geminiService';
import { ImageSize } from '../types';
import Button from './Button';

const VisualizationGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<ImageSize>(ImageSize.Resolution1K);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Initial check for key
    checkApiKeySelection().then(setHasKey);
  }, []);

  const handleGenerate = async () => {
    if (!hasKey) {
      await promptForKeySelection();
      const selected = await checkApiKeySelection();
      setHasKey(selected);
      if (!selected) return;
    }

    if (!prompt.trim()) {
      setError("Please describe the charge density or structure you wish to visualize.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateScientificImage(prompt, resolution);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      // If error suggests missing key (race condition or expiration), force re-select
      if (err.message?.includes('Requested entity was not found') || err.message?.includes('404')) {
         setHasKey(false);
         setError("API Key session expired or invalid. Please select a key again.");
      } else {
        setError("Failed to generate visualization. " + (err.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-deep-glass backdrop-blur-xl rounded-2xl border border-science-500/20 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-science-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </span>
            DeepVis<span className="text-science-500">.Pro</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Powered by Gemini 3 Pro (Nano Banana Pro)
          </p>
        </div>

        {!hasKey && (
          <Button variant="outline" onClick={async () => {
             await promptForKeySelection();
             setHasKey(await checkApiKeySelection());
          }}>
            Connect Billing API Key
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {/* Controls */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-science-500 uppercase tracking-widest">Resolution</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-deep-900 rounded-lg border border-slate-800">
              {Object.values(ImageSize).map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`py-1.5 px-2 text-xs font-mono rounded transition-colors ${
                    resolution === res 
                      ? 'bg-science-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-xs font-mono text-science-500 uppercase tracking-widest">Description</label>
             <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Visualize the electron charge density of a Silicon crystal lattice with high localization around atomic cores..."
                className="w-full h-32 bg-deep-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:border-science-500 focus:ring-1 focus:ring-science-500 outline-none resize-none placeholder-slate-600 transition-all"
             />
          </div>

          <Button 
            onClick={handleGenerate} 
            isLoading={loading}
            className="w-full"
          >
            Generate Simulation
          </Button>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-deep-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden min-h-[400px]">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          {loading ? (
             <div className="text-center z-10">
               <div className="relative w-16 h-16 mx-auto mb-4">
                 <div className="absolute inset-0 border-t-2 border-science-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin-slow"></div>
               </div>
               <p className="text-science-400 font-mono text-xs animate-pulse">SOLVING SCHRÖDINGER EQUATION...</p>
             </div>
          ) : generatedImage ? (
            <div className="relative w-full h-full group">
              <img 
                src={generatedImage} 
                alt="Generated Visualization" 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div>
                   <h3 className="text-white font-medium mb-1">Charge Density Map</h3>
                   <p className="text-slate-300 text-xs font-mono max-w-md truncate">{prompt}</p>
                   <div className="mt-2 flex gap-2">
                     <span className="text-[10px] bg-science-900/80 text-science-300 px-2 py-0.5 rounded border border-science-700/50">{resolution}</span>
                     <span className="text-[10px] bg-purple-900/80 text-purple-300 px-2 py-0.5 rounded border border-purple-700/50">PAW Method</span>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center z-10 opacity-40 max-w-xs">
              <svg className="w-12 h-12 mx-auto mb-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p className="text-slate-400 font-mono text-sm">Waiting for input parameters...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualizationGenerator;