import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageResolution, GeneratedImage } from '../types';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<ImageResolution>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateImage(prompt, resolution);
      setResult({ url: imageUrl, prompt });
    } catch (err) {
      setError("Failed to synthesize image. Parameters may be invalid.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Controls Panel */}
      <div className="bg-glass-bg backdrop-blur-md rounded-2xl border border-glass-border p-6">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-bio-purple font-mono font-bold flex items-center gap-2">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             VISUAL_SYNTHESIS
           </h2>
           <span className="text-[10px] text-bio-purple/60 border border-bio-purple/30 px-2 py-1 rounded font-mono">GEMINI-3-PRO-IMAGE-PREVIEW</span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2">PROMPT PARAMETERS</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe organic structure or texture to generate..."
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm font-mono text-white focus:outline-none focus:border-bio-purple/50 focus:ring-1 focus:ring-bio-purple/20 transition-all placeholder-gray-600 h-24 resize-none"
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-mono text-gray-400 mb-2">OUTPUT_RESOLUTION</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`py-2 text-xs font-mono border rounded transition-all ${
                      resolution === res 
                        ? 'bg-bio-purple/20 border-bio-purple text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]' 
                        : 'bg-black/20 border-white/10 text-gray-500 hover:border-white/30'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isGenerating || !prompt.trim()}
              className="flex-none px-8 py-2.5 h-[38px] bg-gradient-to-r from-bio-cyan/20 to-bio-purple/20 border border-white/20 hover:border-white/50 text-white font-mono text-sm uppercase tracking-wider rounded hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isGenerating ? (
                <span className="animate-pulse">PROCESSING...</span>
              ) : (
                'GENERATE'
              )}
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-xs font-mono text-red-400 bg-red-900/10 p-2 border border-red-500/20 rounded">{error}</p>}
      </div>

      {/* Result Display */}
      <div className="flex-1 bg-glass-bg backdrop-blur-md rounded-2xl border border-glass-border p-1 overflow-hidden relative group min-h-[300px] flex items-center justify-center">
        {result ? (
          <div className="relative w-full h-full">
             <img 
               src={result.url} 
               alt={result.prompt} 
               className="w-full h-full object-contain rounded-xl"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="font-mono text-xs text-white/80 border-l-2 border-bio-purple pl-3">
                  {result.prompt}
                </p>
             </div>
          </div>
        ) : (
          <div className="text-center opacity-30">
            <div className="w-16 h-16 border-2 border-dashed border-white/30 rounded-full mx-auto mb-4 animate-[spin_10s_linear_infinite]"></div>
            <p className="font-mono text-sm">AWAITING VISUAL DATA</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
