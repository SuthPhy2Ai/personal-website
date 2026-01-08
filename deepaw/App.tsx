import React, { useState } from 'react';
import OrbitalBackground from './components/OrbitalBackground';
import LoginPage from './components/LoginPage';
import VisualizationGenerator from './components/VisualizationGenerator';
import Button from './components/Button';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="relative min-h-screen font-sans text-slate-200">
      {/* Dynamic Background */}
      <OrbitalBackground />

      <main className="relative z-10 w-full min-h-screen flex flex-col">
        {!isAuthenticated ? (
          <LoginPage onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/5 bg-deep-glass backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-science-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    DP
                  </div>
                  <span className="font-bold text-lg tracking-tight text-white">DeePAW <span className="text-science-500 font-normal text-sm opacity-70">Workspace</span></span>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    Gemini 3 Pro Active
                  </div>
                  <Button variant="outline" onClick={() => setIsAuthenticated(false)} className="!py-1.5 !px-3 !text-xs">
                    Term. Session
                  </Button>
               </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 md:p-12 flex flex-col items-center">
              <div className="text-center mb-10 max-w-2xl">
                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                   Structure Visualization
                 </h2>
                 <p className="text-slate-400 text-lg">
                   Generate high-fidelity representations of charge densities and crystalline structures using the PAW method powered by Nano Banana Pro.
                 </p>
              </div>

              {/* The requested feature */}
              <VisualizationGenerator />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl opacity-60">
                 <div className="p-4 rounded border border-white/5 bg-white/5">
                    <h4 className="text-science-400 font-mono text-xs mb-2">METHODOLOGY</h4>
                    <p className="text-xs text-slate-400">Projector Augmented Wave (PAW) method integrated with E(3)-equivariant networks.</p>
                 </div>
                 <div className="p-4 rounded border border-white/5 bg-white/5">
                    <h4 className="text-science-400 font-mono text-xs mb-2">PRECISION</h4>
                    <p className="text-xs text-slate-400">Sub-angstrom resolution with rotational invariance guaranteed by network architecture.</p>
                 </div>
                 <div className="p-4 rounded border border-white/5 bg-white/5">
                    <h4 className="text-science-400 font-mono text-xs mb-2">MODEL</h4>
                    <p className="text-xs text-slate-400">Gemini 3 Pro (Nano Banana Pro) backend for rapid texture synthesis and volumetric rendering.</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;