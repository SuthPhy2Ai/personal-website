import React, { useState } from 'react';
import Background from './components/Background';
import LoginCard from './components/LoginCard';
import ChatInterface from './components/ChatInterface';
import ImageGenerator from './components/ImageGenerator';
import { AppView, FeatureMode } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [mode, setMode] = useState<FeatureMode>(FeatureMode.HOME);

  const handleLogin = () => {
    setView(AppView.DASHBOARD);
  };

  const renderContent = () => {
    if (mode === FeatureMode.HOME) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-glass-bg backdrop-blur-sm rounded-2xl border border-glass-border">
          <h2 className="text-4xl font-bold font-mono text-white mb-6">WELCOME, RESEARCHER</h2>
          <p className="max-w-xl text-gray-400 font-mono mb-12 leading-relaxed">
            The NeuroCell system is online. Select a module to begin your work. 
            <br/><br/>
            <span className="text-bio-cyan">Neural Chat</span> facilitates deep query analysis.
            <br/>
            <span className="text-bio-purple">Visual Synthesis</span> generates high-resolution biological imagery.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button 
              onClick={() => setMode(FeatureMode.CHAT)}
              className="group p-6 bg-black/20 border border-white/10 hover:border-bio-cyan/50 rounded-xl transition-all hover:bg-bio-cyan/5 text-left"
            >
              <div className="flex items-center gap-3 mb-2 text-bio-cyan group-hover:translate-x-1 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <span className="font-mono font-bold">INIT_CHAT_MODULE</span>
              </div>
              <p className="text-xs text-gray-500">Interact with Gemini 3 Pro reasoning engine.</p>
            </button>

            <button 
              onClick={() => setMode(FeatureMode.IMAGE_GEN)}
              className="group p-6 bg-black/20 border border-white/10 hover:border-bio-purple/50 rounded-xl transition-all hover:bg-bio-purple/5 text-left"
            >
              <div className="flex items-center gap-3 mb-2 text-bio-purple group-hover:translate-x-1 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-mono font-bold">INIT_VISUAL_CORE</span>
              </div>
              <p className="text-xs text-gray-500">Generate synthetic imagery up to 4K resolution.</p>
            </button>
          </div>
        </div>
      );
    }

    return mode === FeatureMode.CHAT ? <ChatInterface /> : <ImageGenerator />;
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden font-sans">
      <Background />

      {view === AppView.LOGIN ? (
        <LoginCard onLogin={handleLogin} />
      ) : (
        <div className="relative z-10 flex h-screen max-w-7xl mx-auto p-4 md:p-8 gap-6 flex-col md:flex-row">
          {/* Navigation Sidebar */}
          <nav className="w-full md:w-20 md:h-full bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl flex md:flex-col items-center justify-center md:justify-start md:pt-8 gap-6 p-4 md:p-0 shrink-0">
             <button 
               onClick={() => setMode(FeatureMode.HOME)}
               className={`p-3 rounded-xl transition-all ${mode === FeatureMode.HOME ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               title="Home"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
             </button>
             <button 
               onClick={() => setMode(FeatureMode.CHAT)}
               className={`p-3 rounded-xl transition-all ${mode === FeatureMode.CHAT ? 'bg-bio-cyan/20 text-bio-cyan shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-bio-cyan hover:bg-bio-cyan/10'}`}
               title="Chat"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
             </button>
             <button 
               onClick={() => setMode(FeatureMode.IMAGE_GEN)}
               className={`p-3 rounded-xl transition-all ${mode === FeatureMode.IMAGE_GEN ? 'bg-bio-purple/20 text-bio-purple shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-gray-500 hover:text-bio-purple hover:bg-bio-purple/10'}`}
               title="Generate Images"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </button>
             
             <div className="hidden md:block mt-auto mb-8 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 w-full h-full min-h-0">
             {renderContent()}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
