import React, { useEffect, useState, useRef } from 'react';

// --- UTILS ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- GAN Visualization: Trapezoidal Generator & Discriminator ---
export const GANVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projectiles, setProjectiles] = useState<Array<{id: number, x: number, y: number, hue: number, exploded: boolean}>>([]);
  const [lasers, setLasers] = useState<Array<{id: number, y: number, targetX: number, active: boolean}>>([]);
  const frameRef = useRef(0);
  const idCounter = useRef(0);
  
  // Ref to track current projectiles for collision logic
  const projectilesRef = useRef(projectiles);
  projectilesRef.current = projectiles;

  useEffect(() => {
    let lastTime = 0;
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      setProjectiles(prev => {
        const next = [];
        for (const p of prev) {
          if (p.exploded) continue; 
          if (p.x > 84) continue; // Absorbed by D

          // Move
          const speed = 0.4;
          let newX = p.x + speed;
          let exploded = false;
          
          if (p.exploded) exploded = true;
          next.push({ ...p, x: newX, exploded });
        }
        return next;
      });
      
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    const spawnProjectile = setInterval(() => {
      setProjectiles(prev => [...prev, {
        id: idCounter.current++,
        x: 18, // Start at G exit (approx 20%)
        y: randomRange(25, 75), // Constrained to nozzle
        hue: randomRange(160, 200),
        exploded: false
      }]);
    }, 900);

    const spawnLaser = setInterval(() => {
        // Targets between the two trapezoids
        const targets = projectilesRef.current.filter(p => !p.exploded && p.x > 30 && p.x < 80);
        
        if (targets.length > 0 && Math.random() > 0.4) {
            const target = targets[Math.floor(Math.random() * targets.length)];
            const id = idCounter.current++;
            
            // Fire laser
            setLasers(prev => [...prev, { id, y: target.y, targetX: target.x, active: true }]);
            
            setTimeout(() => {
                setProjectiles(prev => prev.map(p => p.id === target.id ? { ...p, exploded: true } : p));
            }, 100);

            setTimeout(() => {
                setLasers(prev => prev.filter(l => l.id !== id));
            }, 300);
        }
    }, 500);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearInterval(spawnProjectile);
      clearInterval(spawnLaser);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-white overflow-hidden flex items-center justify-between px-8">
       
       {/* Background Grid - Light */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

       {/* Generator (Left) - Isosceles Trapezoid facing Right (Narrow back, Wide mouth) */}
       <div className="relative z-10 w-32 h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-cyan-50 border-2 border-cyan-500 shadow-lg shadow-cyan-500/10"
               style={{ 
                   clipPath: 'polygon(0% 20%, 100% 0%, 100% 100%, 0% 80%)',
               }}>
          </div>
          <span className="relative z-20 text-xs font-bold text-cyan-700 -rotate-90">GENERATOR</span>
       </div>

       {/* Projectiles & Lasers Area */}
       <div className="flex-1 h-full relative mx-0">
          {projectiles.map(p => (
            p.exploded ? (
                <div key={p.id} className="absolute w-12 h-12 rounded-full bg-red-400 blur-md animate-ping opacity-50" 
                     style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }} />
            ) : (
                <div key={p.id} 
                     className="absolute w-5 h-5 border border-slate-400 bg-white shadow-sm flex items-center justify-center rotate-45"
                     style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%) rotate(45deg)' }}>
                   <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                </div>
            )
          ))}

          {lasers.map(l => (
             <React.Fragment key={l.id}>
                {/* Laser Beam: From Discriminator Mouth (Right) to Target */}
                <div 
                  className="absolute bg-red-500 opacity-60"
                  style={{ 
                      top: `${l.y}%`, 
                      height: '2px', 
                      right: '0%', // Originates from the left face of Disc container
                      left: `${l.targetX}%`, 
                      transform: 'translateY(-50%)',
                      zIndex: 5
                  }} 
                />
                <div 
                  className="absolute w-4 h-4 bg-red-500 rounded-full blur-sm animate-ping opacity-50"
                  style={{ left: `${l.targetX}%`, top: `${l.y}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
                />
             </React.Fragment>
          ))}
       </div>

       {/* Discriminator (Right) - Isosceles Trapezoid facing Left (Wide mouth, Narrow back) */}
       <div className="relative z-10 w-32 h-64 flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-50 border-2 border-purple-500 shadow-lg shadow-purple-500/10"
               style={{ 
                   clipPath: 'polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%)',
               }}>
          </div>
          <span className="relative z-20 text-xs font-bold text-purple-700 rotate-90">DISCRIMINATOR</span>
       </div>
       
       <div className="absolute top-3 left-6 text-[10px] text-slate-400 font-mono font-semibold tracking-wider">GAN // ADVERSARIAL_NET</div>
    </div>
  );
};

// --- Diffusion Visualization: Light Theme ---
export const DiffusionVisual: React.FC = () => {
  const [packets, setPackets] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(prev => [...prev, Date.now()]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-white flex flex-col items-center justify-center relative overflow-hidden p-4">
       <div className="absolute top-3 left-6 text-[10px] text-slate-400 font-mono font-semibold tracking-wider">DIFFUSION // DEEP_RECONSTRUCTION</div>

       <div className="flex items-center justify-between w-full h-40 max-w-4xl px-8">
          
          {/* Layer 1: Input Noise */}
          <div className="relative w-10 h-32 bg-slate-50 border border-slate-300 rounded flex flex-col items-center justify-center gap-1 z-10 shadow-sm">
             <div className="w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
             <span className="absolute -bottom-6 text-[9px] text-slate-500 font-mono font-bold">NOISE</span>
          </div>

          {/* Connection */}
          <div className="flex-1 h-[1px] bg-slate-200 relative mx-1">
             {packets.map(t => (
               <div key={t} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-400 rounded-full animate-[flowSimple_1.5s_linear]" 
                    onAnimationEnd={(e) => { e.currentTarget.remove() }} />
             ))}
          </div>

          {/* Layer 2: Encoder */}
          <div className="relative w-8 h-24 bg-indigo-50 border border-indigo-200 rounded flex flex-col items-center justify-center gap-1 z-10 shadow-sm">
             <div className="w-4 h-full bg-indigo-500/10" />
             <span className="absolute -bottom-6 text-[9px] text-indigo-600 font-mono font-bold">ENC</span>
          </div>

          {/* Connection */}
          <div className="flex-1 h-[1px] bg-slate-200 relative mx-1">
             {packets.map(t => (
               <div key={t} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-400 rounded-sm animate-[flowSimple_1.5s_linear_0.5s]" 
                    style={{ animationDelay: '0.5s' }} />
             ))}
          </div>

          {/* Layer 3: Deep Layers */}
          <div className="flex gap-2 items-center justify-center px-4">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Connection */}
          <div className="flex-1 h-[1px] bg-slate-200 relative mx-1">
             {packets.map(t => (
               <div key={t} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-400 border border-white rounded-full animate-[flowSimple_1.5s_linear]" 
                    style={{ animationDelay: '1.0s' }} />
             ))}
          </div>

          {/* Layer 4: Decoder */}
          <div className="relative w-8 h-24 bg-purple-50 border border-purple-200 rounded flex flex-col items-center justify-center z-10 shadow-sm">
              <div className="w-full h-full bg-[linear-gradient(transparent_2px,rgba(168,85,247,0.1)_2px)] bg-[size:100%_4px]" />
              <span className="absolute -bottom-6 text-[9px] text-purple-600 font-mono font-bold">DEC</span>
          </div>

          {/* Connection */}
          <div className="flex-1 h-[1px] bg-slate-200 relative mx-1">
             {packets.map(t => (
               <div key={t} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full animate-[flowSimple_1.5s_linear]" 
                    style={{ animationDelay: '1.5s' }} />
             ))}
          </div>

          {/* Layer 5: Output */}
          <div className="relative w-20 h-20 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-center z-10 shadow-sm">
             <div className="w-12 h-12 border border-emerald-500 rotate-45 flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
             </div>
             <span className="absolute -bottom-6 text-[9px] text-emerald-600 font-mono font-bold">STRUCT</span>
          </div>

       </div>

       <style>{`
         @keyframes flowSimple {
           0% { left: 0; opacity: 0; }
           10% { opacity: 1; }
           90% { opacity: 1; }
           100% { left: 100%; opacity: 0; }
         }
       `}</style>
    </div>
  );
};

// --- Wyckoff Visualization: Physics & Collisions ---
export const CrystalVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Particles with Shape Types: 0=Triangle, 1=Circle, 2=Star
  const particlesRef = useRef([
    { x: 50, y: 10, vx: 0.8, vy: 0.6, color: '#d97706', type: 0 }, 
    { x: 80, y: 40, vx: -0.6, vy: 0.8, color: '#0891b2', type: 1 }, 
    { x: 120, y: 20, vx: 0.5, vy: -0.9, color: '#db2777', type: 2 } 
  ]);

  const PARTICLE_RADIUS = 14;

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- PHYSICS ENGINE ---
    const updatePhysics = (R: number) => {
        const particles = particlesRef.current;
        
        // 1. Move & Wall Constraints (Center of particle can reach boundary)
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            // Wall 1: Top Edge (y=0 in local coords). Constraint: y >= 0
            if (p.y < 0) {
                p.y = 0;
                p.vy *= -1;
            }

            // Wall 2: Right Edge (x=R). Constraint: x <= R
            if (p.x > R) {
                p.x = R;
                p.vx *= -1;
            }

            // Wall 3: Diagonal (y=x). Constraint: y <= x
            // If p.y > p.x, reflect across y=x (swap x,y and vx,vy)
            if (p.y > p.x) {
                const tempPos = p.x; p.x = p.y; p.y = tempPos;
                const tempVel = p.vx; p.vx = p.vy; p.vy = tempVel;
            }
        }

        // 2. Particle-Particle Collisions (Elastic)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distSq = dx*dx + dy*dy;
                const minDist = PARTICLE_RADIUS * 2;
                
                if (distSq < minDist * minDist) {
                    const dist = Math.sqrt(distSq);
                    const overlap = minDist - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Separate
                    p1.x -= nx * overlap * 0.5;
                    p1.y -= ny * overlap * 0.5;
                    p2.x += nx * overlap * 0.5;
                    p2.y += ny * overlap * 0.5;

                    // Bounce (Exchange velocity along normal for equal mass)
                    const dvx = p2.vx - p1.vx;
                    const dvy = p2.vy - p1.vy;
                    const dot = dvx * nx + dvy * ny;

                    if (dot < 0) { // Only if moving towards each other
                        p1.vx += dot * nx;
                        p1.vy += dot * ny;
                        p2.vx -= dot * nx;
                        p2.vy -= dot * ny;
                    }
                }
            }
        }
    };

    const drawShape = (ctx: CanvasRenderingContext2D, x: number, y: number, type: number, size: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        if (type === 0) { // Triangle
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size, y + size);
            ctx.lineTo(x - size, y + size);
        } else if (type === 1) { // Circle
            ctx.arc(x, y, size * 0.85, 0, Math.PI * 2);
        } else if (type === 2) { // Star
            const spikes = 5;
            const outer = size;
            const inner = size / 2;
            let rot = Math.PI / 2 * 3;
            let cx = x;
            let cy = y;
            let step = Math.PI / spikes;
            ctx.moveTo(cx, cy - outer);
            for (let i = 0; i < spikes; i++) {
                cx = x + Math.cos(rot) * outer;
                cy = y + Math.sin(rot) * outer;
                ctx.lineTo(cx, cy);
                rot += step;
                cx = x + Math.cos(rot) * inner;
                cy = y + Math.sin(rot) * inner;
                ctx.lineTo(cx, cy);
                rot += step;
            }
            ctx.lineTo(x, y - outer);
        }
        ctx.closePath();
        ctx.fill();
        
        // Black Border
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    };

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = 250; 

      // Physics Step
      updatePhysics(R);

      // Clear
      ctx.fillStyle = '#fff7ed'; // orange-50
      ctx.fillRect(0, 0, w, h);

      // --- CLIPPING REGION ---
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - R, cy - R, R * 2, R * 2);
      ctx.clip();

      // --- Draw Background Grid ---
      ctx.strokeStyle = '#fed7aa'; 
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=-2; i<=2; i++) {
        const offset = i * (R/2);
        ctx.moveTo(cx + offset, cy - R); ctx.lineTo(cx + offset, cy + R);
        ctx.moveTo(cx - R, cy + offset); ctx.lineTo(cx + R, cy + offset);
      }
      ctx.stroke();

      // --- Draw Symmetry Lines ---
      ctx.strokeStyle = '#94a3b8'; 
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(cx - R, cy - R); ctx.lineTo(cx + R, cy + R);
      ctx.moveTo(cx + R, cy - R); ctx.lineTo(cx - R, cy + R);
      ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
      ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // --- Draw ASU Source Region (Deepened Color) ---
      // Darker Amber to stand out
      ctx.fillStyle = 'rgba(245, 158, 11, 0.4)'; 
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R, cy);
      ctx.lineTo(cx + R, cy + R);
      ctx.closePath();
      ctx.fill();

      // --- Draw Particles & Symmetries ---
      particlesRef.current.forEach(p => {
        const symmetryPoints = [
          { x: p.x, y: p.y },     
          { x: p.y, y: p.x },     
          { x: -p.x, y: p.y },    
          { x: -p.y, y: p.x },
          { x: -p.x, y: -p.y },
          { x: -p.y, y: -p.x },
          { x: p.x, y: -p.y },
          { x: p.y, y: -p.x }
        ];

        symmetryPoints.forEach(sp => {
           drawShape(ctx, cx + sp.x, cy + sp.y, p.type, PARTICLE_RADIUS - 2, p.color);
        });
      });

      ctx.restore();
      
      // Draw Border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - R, cy - R, R * 2, R * 2);

      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full h-full relative bg-orange-50 flex flex-col">
       <canvas ref={canvasRef} width={800} height={800} className="w-full h-full object-contain" />
    </div>
  );
};