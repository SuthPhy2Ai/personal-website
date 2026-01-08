import React, { useState, useEffect } from 'react';
import { ScanFace, Fingerprint, Activity, Radio, Cpu, Github, Mail, ArrowRight } from 'lucide-react';

interface ControlPanelProps {
  onLogin: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Micro-interaction simulation
  const [sysStatus, setSysStatus] = useState({
    dim: 1024,
    lattice: 'Cubic',
    temp: 298
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSysStatus(prev => ({
        ...prev,
        temp: 298 + Math.floor(Math.random() * 5),
        dim: 1024 + (Math.random() > 0.9 ? 128 : 0) // Glitch effect
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" className="fill-current">
      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
    </svg>
  );

  return (
    <div className="h-full w-full flex items-center justify-center p-8 relative">
       {/* Background Grid Texture */}
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}>
       </div>

      <div className="w-full max-w-md relative z-10">
        {/* Glass Container */}
        <div className="backdrop-blur-xl bg-cyber-dark/60 border border-cyber-cyan/30 rounded-lg p-8 shadow-[0_0_30px_rgba(0,243,255,0.1)] relative overflow-hidden">
          
          {/* Decorative Corner lines */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan" />

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl font-bold tracking-wider text-white mb-2 uppercase">
              Vector<span className="text-cyber-cyan">Lab</span>
            </h1>
            <div className="flex justify-center gap-4 mt-4 font-mono text-xs tracking-widest">
              <button 
                onClick={() => setMode('LOGIN')}
                className={`pb-1 border-b-2 transition-colors ${mode === 'LOGIN' ? 'text-cyber-cyan border-cyber-cyan' : 'text-cyber-gray/50 border-transparent hover:text-white'}`}
              >
                ACCESS
              </button>
              <button 
                onClick={() => setMode('REGISTER')}
                className={`pb-1 border-b-2 transition-colors ${mode === 'REGISTER' ? 'text-cyber-cyan border-cyber-cyan' : 'text-cyber-gray/50 border-transparent hover:text-white'}`}
              >
                ENROLL
              </button>
            </div>
          </div>

          {/* Social Auth Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => setLoading(true)}
              className="group flex items-center justify-center gap-2 py-3 bg-cyber-black/40 border border-cyber-gray/30 hover:border-cyber-cyan hover:bg-cyber-cyan/5 text-cyber-gray hover:text-cyber-cyan transition-all duration-300"
            >
              <Github size={18} />
              <span className="font-mono text-xs tracking-wider">GITHUB</span>
            </button>
            <button 
              onClick={() => setLoading(true)}
              className="group flex items-center justify-center gap-2 py-3 bg-cyber-black/40 border border-cyber-gray/30 hover:border-cyber-cyan hover:bg-cyber-cyan/5 text-cyber-gray hover:text-cyber-cyan transition-all duration-300"
            >
              <GoogleIcon />
              <span className="font-mono text-xs tracking-wider">GOOGLE</span>
            </button>
          </div>

          <div className="relative mb-6 text-center">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-cyber-gray/10"></div>
             </div>
             <span className="relative bg-transparent px-2 text-[10px] font-mono text-cyber-gray/40 tracking-widest uppercase">
               // OR USE ENCRYPTED LINK
             </span>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1">
              <label className="font-mono text-[10px] text-cyber-gray uppercase tracking-widest block pl-1">
                Neural_Link (Email)
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 500);
                  }}
                  placeholder="> INPUT_EMAIL_ADDRESS"
                  className={`w-full bg-cyber-black/50 border ${isTyping ? 'border-cyber-cyan' : 'border-cyber-gray/30'} 
                    text-cyber-cyan font-mono px-4 py-3 rounded-none outline-none focus:border-cyber-cyan transition-all duration-300 placeholder-cyber-gray/30 text-sm`}
                />
                <div className="absolute right-3 top-3 text-cyber-cyan/50">
                   {isTyping ? <Activity size={16} className="animate-pulse" /> : <Mail size={16} />}
                </div>
              </div>
            </div>

            <div className="space-y-1">
               <label className="font-mono text-[10px] text-cyber-gray uppercase tracking-widest block pl-1">
                Security_Key
              </label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="> ************"
                  className="w-full bg-cyber-black/50 border border-cyber-gray/30 
                    text-cyber-cyan font-mono px-4 py-3 rounded-none outline-none focus:border-cyber-cyan transition-all duration-300 placeholder-cyber-gray/30 text-sm"
                />
                <div className="absolute right-3 top-3 text-cyber-cyan/50">
                  <Fingerprint size={16} />
                </div>
              </div>
            </div>

            {mode === 'REGISTER' && (
              <div className="space-y-1 animate-slide-down">
                <label className="font-mono text-[10px] text-cyber-gray uppercase tracking-widest block pl-1">
                  Confirm_Key
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    placeholder="> REPEAT_SEQUENCE"
                    className="w-full bg-cyber-black/50 border border-cyber-gray/30 
                      text-cyber-cyan font-mono px-4 py-3 rounded-none outline-none focus:border-cyber-cyan transition-all duration-300 placeholder-cyber-gray/30 text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full group relative overflow-hidden bg-cyber-dark border border-cyber-cyan/50 text-cyber-cyan font-display font-bold tracking-widest uppercase py-4 mt-2 transition-all hover:bg-cyber-cyan/10 hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]
                ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Cpu className="animate-spin" size={18} /> {mode === 'LOGIN' ? 'AUTHENTICATING...' : 'REGISTERING...'}
                  </>
                ) : (
                  <>
                    {mode === 'LOGIN' ? 'INITIALIZE SESSION' : 'CREATE IDENTIFIER'} <ArrowRight size={16} />
                  </>
                )}
              </span>
              {/* Button sweep effect */}
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent -translate-x-full group-hover:animate-scan" />
            </button>
          </form>

          {/* Footer / HUD Stats */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between font-mono text-[10px] text-cyber-gray/50">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1"><Radio size={10} /> SYS_ONLINE</span>
              <span>LAT: {sysStatus.lattice}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span>DIM: {sysStatus.dim}</span>
              <span className={sysStatus.temp > 300 ? 'text-cyber-red' : ''}>TEMP: {sysStatus.temp}K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;