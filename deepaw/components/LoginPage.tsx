import React, { useState } from 'react';
import Button from './Button';
import { validateInvitationCode } from '../config/invitationCodes';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegistering) {
      if (!validateInvitationCode(inviteCode)) {
        setError("Invalid Invitation Code. Please contact your administrator.");
        return;
      }
    }

    setLoading(true);
    // Simulate auth delay for effect
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  const handleSocialLogin = (provider: 'github' | 'google') => {
    setError(null);
    
    // Strict requirement: Invitation code needed for social auth too
    if (!inviteCode) {
      setError(`An invitation code is required to register with ${provider === 'google' ? 'Google' : 'GitHub'}.`);
      // Focus the invite code input
      const inviteInput = document.getElementById('invite-code-input');
      if (inviteInput) inviteInput.focus();
      return;
    }

    if (!validateInvitationCode(inviteCode)) {
      setError("Invalid Invitation Code. Social registration denied.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setEmail('');
    setInviteCode('');
    setError(null);
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col lg:flex-row overflow-hidden">
      
      {/* LEFT SIDE: Immersive Visual Area (60%) */}
      {/* The Orbit Background is behind everything, but this container holds the foreground text/branding */}
      <div className="w-full lg:w-[60%] p-8 lg:p-16 flex flex-col justify-start relative z-10 pointer-events-none">
         <div className="mt-12 lg:mt-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-science-500/30 bg-science-900/20 backdrop-blur-sm text-science-300 text-xs font-mono mb-6 animate-[fadeIn_1s_ease-out]">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               SYSTEM ONLINE: V1.0.0-preview
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tight mb-4 drop-shadow-[0_0_20px_rgba(14,165,233,0.3)]">
               DeePAW
            </h1>
         </div>
      </div>

      {/* RIGHT SIDE: Interaction Area (40%) */}
      {/* Full height glass panel */}
      <div className="w-full lg:w-[40%] bg-deep-900/60 backdrop-blur-2xl border-l border-white/10 flex flex-col justify-center p-8 lg:p-12 relative shadow-[-20px_0_50px_rgba(0,0,0,0.3)] z-20">
        
        {/* Dynamic Glow Line on the edge */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-science-500 to-transparent opacity-50"></div>

        <div className="w-full max-w-md mx-auto">
            <div className="mb-10">
               <h2 className="text-2xl font-bold text-white mb-2">
                  {isRegistering ? 'Researcher Access' : 'Welcome Back'}
               </h2>
               <p className="text-slate-400 text-sm">
                  {isRegistering ? 'Initialize your secure research environment.' : 'Enter your credentials to access the simulation node.'}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium uppercase tracking-wider ml-1">
                    {isRegistering ? 'Academic Email' : 'ID / Email'}
                  </label>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/20 border border-slate-700 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-science-500 focus:bg-black/40 transition-all font-mono text-sm placeholder-slate-600"
                    placeholder={isRegistering ? "researcher@university.edu" : "RESEARCHER_ID"}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium uppercase tracking-wider ml-1">
                    {isRegistering ? 'Create Token' : 'Secure Token'}
                  </label>
                  <input 
                    type="password" 
                    className="w-full bg-black/20 border border-slate-700 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-science-500 focus:bg-black/40 transition-all font-mono text-sm placeholder-slate-600"
                    placeholder="••••••••••••"
                    required
                  />
                </div>

                {isRegistering && (
                   <div className="animate-[fadeIn_0.3s_ease-out] space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 font-medium uppercase tracking-wider ml-1">Confirm Token</label>
                        <input 
                          type="password" 
                          className="w-full bg-black/20 border border-slate-700 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-science-500 focus:bg-black/40 transition-all font-mono text-sm placeholder-slate-600"
                          placeholder="••••••••••••"
                          required
                        />
                      </div>
                      
                      <div className="space-y-1.5 p-4 rounded-xl border border-science-500/20 bg-science-900/10 backdrop-blur-md">
                        <label className="text-xs text-science-400 font-bold uppercase tracking-wider ml-1 flex items-center gap-1 mb-2">
                           Invitation Code
                           <span className="w-1.5 h-1.5 rounded-full bg-science-500 animate-pulse ml-auto"></span>
                        </label>
                        <input 
                          id="invite-code-input"
                          type="text" 
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          className="w-full bg-black/40 border border-science-500/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-science-500 focus:ring-1 focus:ring-science-500 transition-all font-mono text-sm placeholder-slate-500 tracking-[0.2em] text-center"
                          placeholder="CODE-XXXX-XXXX"
                          autoComplete="off"
                        />
                        <p className="text-[10px] text-science-300/60 text-center mt-2">REQUIRED FOR ACCOUNT CREATION</p>
                      </div>
                   </div>
                )}
              </div>

              {error && (
                <div className="text-xs text-red-300 bg-red-900/30 p-3 rounded-lg border border-red-500/30 text-center animate-pulse flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <Button type="submit" isLoading={loading} className="w-full h-12 text-base shadow-lg">
                {isRegistering ? 'Register Account' : 'Initialize Session'}
              </Button>
            </form>
            
            {/* Social Login (Registration Only) */}
            {isRegistering && (
              <div className="mt-8 animate-[fadeIn_0.5s_ease-out]">
                <div className="relative flex py-2 items-center mb-4">
                  <div className="flex-grow border-t border-slate-700"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] uppercase font-mono tracking-wider">Secure Auth Providers</span>
                  <div className="flex-grow border-t border-slate-700"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => handleSocialLogin('github')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-700 text-white border border-slate-600/50 rounded-lg py-3 transition-all duration-300 hover:shadow-lg hover:border-slate-500 group"
                  >
                    <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                       <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="text-xs font-medium tracking-wide">GITHUB</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-slate-900 border border-transparent rounded-lg py-3 transition-all duration-300 hover:shadow-lg group"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-xs font-medium tracking-wide">GOOGLE</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <Button 
                type="button" 
                variant="outline" 
                className="mx-auto text-xs px-4 py-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500"
                onClick={toggleMode}
              >
                {isRegistering ? 'Already have credentials? Login' : 'New Researcher? Apply for Access'}
              </Button>
            </div>
        </div>
        
        {/* Footer in the sidebar */}
        <div className="absolute bottom-6 left-0 w-full text-center">
           <p className="text-[10px] text-slate-600 font-mono">
              SECURE CONNECTION // ENCRYPTED
           </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;