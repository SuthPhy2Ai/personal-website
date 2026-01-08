import React, { useState } from 'react';
import VisualizationCore from './components/VisualizationCore';
import ControlPanel from './components/ControlPanel';
import ImageEditor from './components/ImageEditor';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);

  const handleLoginSuccess = () => {
    setAppState(AppState.DASHBOARD);
  };

  if (appState === AppState.DASHBOARD) {
    return <ImageEditor />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-cyber-black flex flex-col md:flex-row">
      {/* Left Panel: Visualization (60% width on Desktop) */}
      <div className="h-1/3 md:h-full md:w-[60%] relative border-b md:border-b-0 md:border-r border-cyber-cyan/20">
        <VisualizationCore />
        
        {/* Mobile overlay title */}
        <div className="absolute top-4 left-4 md:hidden pointer-events-none">
           <h1 className="font-display text-2xl font-bold tracking-wider text-white uppercase">
              Vector<span className="text-cyber-cyan">Lab</span>
            </h1>
        </div>
      </div>

      {/* Right Panel: Control (40% width on Desktop) */}
      <div className="h-2/3 md:h-full md:w-[40%] bg-gradient-to-br from-cyber-black to-cyber-dark relative">
        <ControlPanel onLogin={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default App;
