import React, { useState } from 'react';

interface LoginCardProps {
  onLogin: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLogin }) => {
  const [isActive, setIsActive] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleContainerClick = (e: React.MouseEvent) => {
    // Only activate if clicking on background or logo wrapper, not inputs
    if (!isActive) {
        setIsActive(true);
    }
  };

  const isFormValid = username.length > 0 && password.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      
      {/* Interaction Layer - Click anywhere to activate if not active */}
      {!isActive && (
        <div 
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={() => setIsActive(true)}
        />
      )}

      {/* Main Logo - Clickable to activate */}
      <div 
        onClick={handleContainerClick}
        className={`relative z-20 transition-all duration-1000 ease-out flex flex-col items-center ${isActive ? '-translate-y-24 scale-90 cursor-default' : 'translate-y-0 scale-100 cursor-pointer'}`}
      >
        {/* Decorative Hex/Bio Icon */}
        <div className={`mb-8 w-20 h-20 border border-bio-cyan/30 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-700 ${isActive ? 'bg-bio-cyan/5 shadow-[0_0_50px_rgba(6,182,212,0.2)] border-bio-cyan/50' : 'hover:border-bio-cyan/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]'}`}>
            <svg className={`w-10 h-10 text-bio-cyan transition-transform duration-1000 ${isActive ? 'rotate-[360deg] scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        </div>
        
        {/* Text Logo */}
        <h1 className="text-6xl md:text-8xl font-bold font-mono text-white tracking-tighter select-none mix-blend-screen opacity-90">
          NEURO<span className="text-bio-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">CELL</span>
        </h1>
        <p className="mt-4 text-bio-purple/80 font-mono tracking-[0.2em] text-xs uppercase opacity-70">
          Bio-Digital Interface v2.4
        </p>

        {/* Prompt - Only visible when inactive */}
        <div className={`mt-12 transition-all duration-500 ${isActive ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 animate-pulse'}`}>
          <span className="font-mono text-[10px] text-bio-cyan tracking-[0.4em] uppercase border border-bio-cyan/20 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-bio-cyan/10 transition-colors">
            [ Click to Initialize ]
          </span>
        </div>
      </div>

      {/* Bottom Control Deck - Appears when Active */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-12 transition-all duration-1000 ease-out transform ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        
        <div className="w-full max-w-xl px-8">
            {/* Decorative Tech Lines */}
            <div className="flex items-center gap-4 mb-8 opacity-50">
                <div className="h-px bg-gradient-to-r from-transparent via-bio-cyan/50 to-transparent flex-1"></div>
                <div className="w-2 h-2 bg-bio-cyan rotate-45"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-bio-cyan/50 to-transparent flex-1"></div>
            </div>

            <div className="flex flex-col gap-6 backdrop-blur-sm bg-black/20 p-8 rounded-xl border border-white/5 shadow-2xl">
                {/* Status Indicators */}
                <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                    <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-bio-green rounded-full animate-pulse"></span>
                         Neural_Net: ONLINE
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                         SECURE_CHANNEL
                         <span className="w-1.5 h-1.5 bg-bio-purple rounded-full"></span>
                    </div>
                </div>

                {/* Input Area - Console Style */}
                <div className="space-y-6">
                    
                    {/* Username Input */}
                    <div className="group relative">
                        <label className="block text-[10px] text-bio-cyan/60 font-mono mb-2 uppercase tracking-wider group-focus-within:text-bio-cyan transition-colors">
                            AGENT_IDENTITY
                        </label>
                        <div className="relative flex items-center">
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="ENTER_ID..."
                                className="w-full bg-transparent border-b border-white/20 py-3 font-mono text-sm text-gray-100 focus:outline-none focus:border-bio-cyan/50 placeholder-gray-700 transition-colors uppercase"
                                spellCheck={false}
                                autoComplete="off"
                            />
                            {/* Scanning line under input */}
                            <div className="absolute bottom-0 left-0 h-[1px] bg-bio-cyan w-0 group-focus-within:w-full transition-all duration-700 ease-out shadow-[0_0_10px_#06b6d4]"></div>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="group relative">
                        <label className="block text-[10px] text-bio-purple/60 font-mono mb-2 uppercase tracking-wider group-focus-within:text-bio-purple transition-colors">
                            NEURAL_PASSPHRASE
                        </label>
                        <div className="relative flex items-center">
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-transparent border-b border-white/20 py-3 font-mono text-sm text-gray-100 focus:outline-none focus:border-bio-purple/50 placeholder-gray-700 transition-colors"
                            />
                            
                            {/* Validation Badge - Appears when both fields have content */}
                            <div className={`absolute right-0 flex items-center gap-2 text-[10px] text-bio-green border border-bio-green/20 px-2 py-0.5 rounded bg-bio-green/5 transition-all duration-500 ${isFormValid ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                                <span>VERIFIED</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </div>

                            {/* Scanning line under input - Purple for security field */}
                            <div className="absolute bottom-0 left-0 h-[1px] bg-bio-purple w-0 group-focus-within:w-full transition-all duration-700 ease-out shadow-[0_0_10px_#8b5cf6]"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onLogin}
                        disabled={!isFormValid}
                        className={`w-full group relative overflow-hidden px-8 py-4 border font-mono text-sm uppercase tracking-[0.2em] transition-all duration-500 mt-4 
                        ${isFormValid 
                            ? 'border-bio-cyan/30 text-bio-cyan hover:bg-bio-cyan/10 hover:border-bio-cyan/80 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] cursor-pointer' 
                            : 'border-white/5 text-gray-600 cursor-not-allowed opacity-70'}`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {isFormValid ? 'Initiate_Uplink' : 'Awaiting_Credentials...'}
                            <svg className={`w-4 h-4 transition-transform ${isFormValid ? 'group-hover:translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                        
                        {/* Button Scan Effect - Only when active */}
                        {isFormValid && (
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bio-cyan/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                        )}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;