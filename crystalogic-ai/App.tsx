import React, { useState } from 'react';
import { CrystalVisual, DiffusionVisual, GANVisual } from './components/Visuals';
import { CrystalEditor } from './components/CrystalEditor';
import { Atom, Zap, Layers, LogIn, Menu, LayoutGrid, Image as ImageIcon } from 'lucide-react';
import { VisualizationMode } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('thsu0407@gmail.com');
  const [currentView, setCurrentView] = useState<VisualizationMode>(VisualizationMode.DASHBOARD);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --- Login Screen (Split Layout 6:4) ---
  if (!isLoggedIn) {
    return (
      <div className="flex w-full h-screen overflow-hidden bg-orange-50">
        {/* Left Side: ASU Visual (Dominant 6 parts) */}
        <div className="relative flex-[6] h-full overflow-hidden border-r border-orange-200/30">
           {/* Background noise/pattern for texture */}
           <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-orange-50 to-orange-100"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply"></div>
           
           {/* The ASU Visualization */}
           <div className="relative z-10 w-full h-full">
             <CrystalVisual />
           </div>

           {/* Overlay Branding */}
           <div className="absolute bottom-12 left-12 z-20 pointer-events-none max-w-3xl">
             <h1 className="text-6xl font-['Crimson_Pro'] italic font-semibold text-slate-900 mb-2 tracking-tight opacity-90 mix-blend-multiply leading-tight">
               Crystal structure generation via ASU
             </h1>
             <p className="text-lg font-['Crimson_Pro'] text-slate-600 mt-2">
               An advanced framework for deep-learning assisted crystallography.
             </p>
           </div>
        </div>

        {/* Right Side: Login Form (4 parts, Glassmorphism) */}
        <div className="relative flex-[4] min-w-[380px] h-full bg-white/40 backdrop-blur-xl border-l border-white/50 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] flex flex-col justify-center p-10 z-30">
            <div className="w-full max-w-sm mx-auto">
              <div className="mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-lg shadow-orange-500/20">
                  <Atom className="w-6 h-6 text-white animate-spin-slow" />
                </div>
                <h2 className="text-3xl font-['Crimson_Pro'] font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500 text-sm font-['Crimson_Pro'] italic">Please enter your credentials to access the simulation engine.</p>
              </div>

              <form 
                onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs uppercase tracking-wider text-slate-500 font-bold font-['JetBrains_Mono']">
                      Principal Investigator / User ID
                    </label>
                    {/* ORCID Icon */}
                    <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-help" title="ORCID iD Supported">
                      <svg viewBox="0 0 256 256" className="w-4 h-4 text-[#A6CE39]" fill="currentColor">
                        <path d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z" fill="#A6CE39"/>
                        <path d="M86.3 186.2H70.9V79.1h15.4v107.1zM78.6 61.6c-5.8 0-10.5-4.2-10.5-10.5s4.7-10.5 10.5-10.5 10.5 4.7 10.5 10.5-4.7 10.5-10.5 10.5zM127 186.2h-15.2V79.1h15.2v8.3c2.5-4.4 7.6-9.6 17.6-9.6 14.3 0 26.1 9.4 26.1 35.5v34.8c0 23.3-10.3 38.1-26.6 38.1-9.4 0-15.5-4.8-18.4-9.3v9.3h1.3zM127 141.5c0 14.1 3.5 22.8 11.4 22.8 8.1 0 11.4-9.6 11.4-22.8 0-12.7-3.5-22.3-11.4-22.3-7.8 0-11.4 9.3-11.4 22.3z" fill="#fff"/>
                      </svg>
                      <span className="text-[10px] text-slate-400 font-['JetBrains_Mono']">ORCID</span>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full bg-white/60 border border-orange-200/80 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm backdrop-blur-sm font-['JetBrains_Mono'] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1.5 font-bold font-['JetBrains_Mono']">Passkey</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/60 border border-orange-200/80 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm backdrop-blur-sm font-['JetBrains_Mono'] text-sm"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group font-['JetBrains_Mono']"
                >
                  <span>Initialize Session</span>
                  <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-10 pt-6 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400 font-['JetBrains_Mono'] uppercase tracking-widest">
                 <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> System Operational</span>
                 <span>v2.5.0</span>
              </div>
            </div>
        </div>
      </div>
    );
  }

  // --- Main Layout (Pale Orange Theme) ---
  return (
    <div className="flex h-screen bg-orange-50 text-slate-900 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-orange-100 transition-all duration-300 flex flex-col z-30 shadow-sm`}>
        <div className="p-6 border-b border-orange-50 flex items-center justify-between">
          {sidebarOpen && <h2 className="font-bold text-lg tracking-tight text-slate-900 font-['Space_Grotesk']">CrystaLogic</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-orange-50 rounded text-slate-500">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-6 flex flex-col gap-2 px-3">
           <NavItem 
             active={currentView === VisualizationMode.DASHBOARD} 
             onClick={() => setCurrentView(VisualizationMode.DASHBOARD)} 
             icon={<LayoutGrid />} 
             label="Mission Control" 
             open={sidebarOpen} 
             description="Live Synthesis Monitor"
           />
           <NavItem 
             active={currentView === VisualizationMode.EDITOR} 
             onClick={() => setCurrentView(VisualizationMode.EDITOR)} 
             icon={<ImageIcon />} 
             label="Image Refiner" 
             open={sidebarOpen} 
             description="Gemini 2.5 Flash"
           />
        </div>

        <div className="p-4 border-t border-orange-50">
           <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-xs text-white">
               {username.charAt(0).toUpperCase() || 'U'}
             </div>
             {sidebarOpen && (
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium truncate text-slate-900">{username || 'Researcher'}</p>
                 <p className="text-xs text-slate-500 truncate">Pro License</p>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-orange-50">
        {currentView === VisualizationMode.EDITOR ? (
          <CrystalEditor onBack={() => setCurrentView(VisualizationMode.DASHBOARD)} />
        ) : (
          <div className="w-full h-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Panel: Wyckoff (Full Height) */}
            <div className="h-full border border-orange-100 rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
              <CrystalVisual />
            </div>

            {/* Right Panel: Split (Top GAN, Bottom Diffusion) */}
            <div className="h-full flex flex-col gap-6">
              {/* Top: GAN */}
              <div className="flex-1 border border-orange-100 rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                <GANVisual />
              </div>
              
              {/* Bottom: Diffusion */}
              <div className="flex-1 border border-orange-100 rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                <DiffusionVisual />
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

// NavItem Helper
const NavItem = ({ active, onClick, icon, label, open, description }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
      active 
        ? 'bg-orange-50 text-orange-600 font-medium' 
        : 'text-slate-500 hover:bg-orange-50 hover:text-slate-900'
    } ${!open && 'justify-center'}`}
  >
    <div className={`${active ? 'text-orange-600' : 'text-current'}`}>{icon}</div>
    {open && (
      <div className="text-left">
        <div className="text-sm">{label}</div>
        {description && <div className="text-[10px] opacity-70 font-mono text-slate-400">{description}</div>}
      </div>
    )}
  </button>
);

export default App;