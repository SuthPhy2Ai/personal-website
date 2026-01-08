import React, { useEffect, useRef } from 'react';

const OrbitalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    interface Nucleus {
      baseX: number;
      baseY: number;
      x: number; // Current dynamic position
      y: number; // Current dynamic position
      baseRadius: number;
      currentRadius: number; // Current dynamic radius (breathing)
      color: string;
      phase: number; // For animation cycle
      speed: number; // Speed of breathing/movement
    }

    // Define multiple nuclei positions relative to screen size
    let nuclei: Nucleus[] = [];
    const updateNucleiPositions = () => {
      // Adjusted for 6:4 Split Screen Layout
      // We store base positions to oscillate around them
      const items = [
        { x: width * 0.3, y: height * 0.5, r: 130, color: '#0ea5e9', speed: 0.02 }, 
        { x: width * 0.85, y: height * 0.2, r: 70, color: '#6366f1', speed: 0.03 }, 
        { x: width * 0.1, y: height * 0.9, r: 90, color: '#ec4899', speed: 0.025 }  
      ];

      nuclei = items.map((item, index) => ({
        baseX: item.x,
        baseY: item.y,
        x: item.x,
        y: item.y,
        baseRadius: item.r,
        currentRadius: item.r,
        color: item.color,
        phase: Math.random() * Math.PI * 2,
        speed: item.speed
      }));
    };
    updateNucleiPositions();

    type ElectronMode = 'orbiting' | 'forcing_out' | 'forcing_in';

    interface Electron {
      originalNucleusIndex: number; // The home base to respawn at
      nucleusIndex: number; // Which nucleus it currently orbits/interacts with
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      
      // Logic for "10 laps in / 20 laps out"
      prevAngle: number;       // To calculate delta rotation
      cumulativeAngle: number; // Total radians rotated in current zone
      wasInside: boolean;      // To detect zone transitions
      mode: ElectronMode;      // State machine
    }

    const electrons: Electron[] = [];
    const particlesPerNucleus = [70, 25, 35]; // Count for Center, Top-Right, Bottom-Left
    const colors = ['#38bdf8', '#818cf8', '#22d3ee']; // Science cyan/blue/indigo

    // Initialize particles
    nuclei.forEach((_, nIndex) => {
      for (let i = 0; i < particlesPerNucleus[nIndex]; i++) {
        // Feature 1: Force the first particle of each nucleus to start INSIDE the halo
        // This ensures immediate visual activity (jitter) without waiting for chance
        spawnElectron(nIndex, undefined, i === 0);
      }
    });

    function spawnElectron(nIndex: number, existing?: Electron, forceInside: boolean = false) {
       const nucleus = nuclei[nIndex];
       if (!nucleus) return;

       // Spawn at a random angle
       const angle = Math.random() * Math.PI * 2;
       
       // Adjust scale based on nucleus size
       const scale = nucleus.baseRadius / 120; 
       
       let minRadius = 250 * scale; 
       let maxRadius = (Math.max(width, height) * 0.5) * scale + minRadius;
       
       // If forcing inside (for initial load or rare random spawns), clamp radius to glow area
       if (forceInside) {
          minRadius = 15;
          maxRadius = nucleus.baseRadius * 0.6; // Keep it deep in the field
       }
       
       const radius = minRadius + Math.random() * (maxRadius - minRadius);
       
       const x = nucleus.baseX + Math.cos(angle) * radius;
       const y = nucleus.baseY + Math.sin(angle) * radius;

       // Initial velocity tangent to the circle
       const velocityMag = forceInside ? (4 + Math.random() * 2) : (3 + Math.random() * 2); 
       const vx = -Math.sin(angle) * velocityMag;
       const vy = Math.cos(angle) * velocityMag;

       const p: Electron = existing || {
         originalNucleusIndex: nIndex,
         nucleusIndex: nIndex,
         x, y, vx, vy,
         color: colors[Math.floor(Math.random() * colors.length)],
         size: Math.random() * 2 + 1,
         prevAngle: angle,
         cumulativeAngle: 0,
         wasInside: forceInside,
         mode: 'orbiting'
       };

       if (existing) {
         p.originalNucleusIndex = nIndex;
         p.nucleusIndex = nIndex; // Reset allegiance on respawn
         p.x = x; p.y = y; p.vx = vx; p.vy = vy;
         p.prevAngle = angle;
         p.cumulativeAngle = 0;
         p.wasInside = forceInside;
         p.mode = 'orbiting';
       } else {
         electrons.push(p);
       }
    }

    const animate = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(2, 6, 23, 0.25)'; 
      ctx.fillRect(0, 0, width, height);
      
      // Update and Draw Nuclei
      nuclei.forEach((nucleus) => {
        // Update Phase
        nucleus.phase += nucleus.speed;
        
        // --- Feature: Breathing and Slight Movement (Depth Simulation) ---
        const depthFactor = Math.sin(nucleus.phase); // -1 to 1
        
        // Scale: "Closer" (depth=1) is bigger
        const scaleVariation = 1 + (depthFactor * 0.1); 
        nucleus.currentRadius = nucleus.baseRadius * scaleVariation;

        // Position Drift
        nucleus.x = nucleus.baseX + Math.cos(nucleus.phase * 0.5) * 10;
        nucleus.y = nucleus.baseY + Math.sin(nucleus.phase * 0.7) * 8;

        // Brightness/Opacity
        const brightness = 0.6 + ((depthFactor + 1) / 2) * 0.4;

        // Draw Glow (Halo)
        const gradient = ctx.createRadialGradient(nucleus.x, nucleus.y, 5, nucleus.x, nucleus.y, nucleus.currentRadius);
        
        ctx.save();
        ctx.globalAlpha = brightness;
        
        gradient.addColorStop(0, `${nucleus.color}E6`); 
        gradient.addColorStop(0.4, `${nucleus.color}4D`); 
        gradient.addColorStop(1, `${nucleus.color}00`); 
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nucleus.x, nucleus.y, nucleus.currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw Solid Core
        ctx.fillStyle = '#f0f9ff';
        ctx.shadowBlur = 30 * scaleVariation;
        ctx.shadowColor = nucleus.color;
        ctx.beginPath();
        ctx.arc(nucleus.x, nucleus.y, nucleus.currentRadius * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore(); 
      });

      electrons.forEach((p) => {
        // --- Feature 2: Dynamic Exchange ---
        // Find closest nucleus logic
        let closestIndex = p.nucleusIndex;
        let minDistSq = Infinity;

        nuclei.forEach((n, idx) => {
            const dx = n.x - p.x;
            const dy = n.y - p.y;
            const dSq = dx*dx + dy*dy;
            if (dSq < minDistSq) {
                minDistSq = dSq;
                closestIndex = idx;
            }
        });

        p.nucleusIndex = closestIndex;
        const nucleus = nuclei[closestIndex];

        const dx = nucleus.x - p.x;
        const dy = nucleus.y - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        const inGlowRadius = dist < nucleus.currentRadius;

        // --- Logic: Track Laps and Mode Switching ---
        
        // Calculate Angle Delta
        const currentAngle = Math.atan2(dy, dx); // Note: dy is (nucleus.y - p.y), pointing TO nucleus
        // Actually, let's use angle from nucleus TO electron for easier rotation tracking
        // atan2(p.y - n.y, p.x - n.x)
        const angleFromCenter = Math.atan2(p.y - nucleus.y, p.x - nucleus.x);
        
        let dAngle = angleFromCenter - p.prevAngle;
        // Normalize dAngle to -PI...PI range to handle 360->0 wrap around
        if (dAngle > Math.PI) dAngle -= 2 * Math.PI;
        if (dAngle < -Math.PI) dAngle += 2 * Math.PI;
        
        // Reset counter if zone changed
        if (inGlowRadius !== p.wasInside) {
           p.cumulativeAngle = 0;
           p.wasInside = inGlowRadius;
           
           // If we just entered the glow, and we were forcing in, we are done
           if (inGlowRadius && p.mode === 'forcing_in') {
               p.mode = 'orbiting';
           }
        } else {
           p.cumulativeAngle += Math.abs(dAngle);
        }
        p.prevAngle = angleFromCenter;

        // Thresholds (2PI = 1 lap)
        const LAPS_INSIDE_LIMIT = 10;
        const LAPS_OUTSIDE_LIMIT = 20;
        const RAD_PER_LAP = Math.PI * 2;

        if (p.mode === 'orbiting') {
            if (inGlowRadius && p.cumulativeAngle > LAPS_INSIDE_LIMIT * RAD_PER_LAP) {
                p.mode = 'forcing_out';
                p.cumulativeAngle = 0;
            } else if (!inGlowRadius && p.cumulativeAngle > LAPS_OUTSIDE_LIMIT * RAD_PER_LAP) {
                p.mode = 'forcing_in';
                p.cumulativeAngle = 0;
            }
        } 
        // Stop forcing out if sufficiently far away (e.g., 1.5x radius)
        else if (p.mode === 'forcing_out' && dist > nucleus.currentRadius * 1.5) {
            p.mode = 'orbiting';
        }

        // --- Physics Calculation ---

        // Base attraction force
        let forceConstant = p.nucleusIndex === 0 ? 9000 : 5000;
        let forceMag = forceConstant / (distSq + 800); 

        // Apply Mode Modifiers
        if (p.mode === 'forcing_out') {
            // REPEL instead of attract, and make it strong enough to overcome inertia
            forceMag = -15000 / (distSq + 100); 
        } else if (p.mode === 'forcing_in') {
            // Super strong attraction
            forceMag = 30000 / (distSq + 100);
            // Also dampen velocity slightly to ensure it falls in
            p.vx *= 0.98;
            p.vy *= 0.98;
        }

        const ax = (dx / dist) * forceMag;
        const ay = (dy / dist) * forceMag;

        p.vx += ax;
        p.vy += ay;
        
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounds Check: If lost, respawn
        const globalOrbitLimit = Math.max(width, height) * 1.2;
        if (dist > globalOrbitLimit || dist < 5) {
           spawnElectron(p.originalNucleusIndex, p);
           return;
        }

        // --- Visual Rendering ---
        let drawX = p.x;
        let drawY = p.y;
        
        // --- Conditional Jitter (Enhanced) ---
        // Constraint: Electron is shaking ("M") ONLY if in glow AND NOT currently accelerating out
        // If it is 'forcing_out', it should be a smooth, fast exit.
        const shouldJitter = inGlowRadius && p.mode !== 'forcing_out';
        
        if (shouldJitter) {
          const intensity = 1 - (dist / nucleus.currentRadius);
          
          // Exponential shake amount - Strong Field Effect
          const shakeAmount = Math.pow(intensity * 14, 2); 
          
          drawX += (Math.random() - 0.5) * shakeAmount;
          drawY += (Math.random() - 0.5) * shakeAmount;
          
          // Color glitch
          ctx.fillStyle = (intensity > 0.4 && Math.random() > 0.6) ? '#ffffff' : p.color;
          
          // Glitch Lines
          if (shakeAmount > 8 && Math.random() > 0.6) {
             ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + Math.random() * 0.5})`;
             const length = Math.random() * shakeAmount * 3; 
             const thickness = Math.random() * 2 + 0.5; 
             
             if (Math.random() > 0.5) {
                ctx.fillRect(drawX - length/2, drawY, length, thickness);
             } else {
                ctx.fillRect(drawX, drawY - length/2, thickness, length);
             }
             
             if (Math.random() > 0.7) {
                 ctx.fillRect(drawX, drawY - length/4, thickness, length/2);
             }

             ctx.fillStyle = '#ffffff';
          }
        } else {
          // Normal color
          // If forcing out/in, maybe make it slightly brighter to show energy state?
          if (p.mode !== 'orbiting') {
              ctx.fillStyle = '#ffffff'; // High energy white during transition
          } else {
              ctx.fillStyle = p.color;
          }
        }

        // Draw Electron
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connections (Quantum Entanglement)
        // Only connect if inside glow AND jittering
        if (shouldJitter && Math.random() > 0.75) {
           ctx.beginPath();
           ctx.strokeStyle = `${nucleus.color}60`; 
           ctx.lineWidth = 0.5 + Math.random(); 
           ctx.moveTo(nucleus.x + (Math.random()-0.5)*10, nucleus.y + (Math.random()-0.5)*10);
           ctx.lineTo(drawX, drawY);
           ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateNucleiPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default OrbitalBackground;