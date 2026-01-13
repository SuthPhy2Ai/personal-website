import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Configuration
    const particleCount = 45; // Slightly reduced for better spacing with larger cells
    const connectionDistance = 200;
    
    interface Organelle {
      x: number;
      y: number;
      r: number;
    }

    class Cell {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      nucleusR: number;
      nucleusX: number;
      nucleusY: number;
      organelles: Organelle[];
      rotation: number;
      rotationSpeed: number;
      type: 'A' | 'B'; 
      
      constructor(initX?: number, initY?: number) {
        this.x = initX ?? Math.random() * width;
        this.y = initY ?? Math.random() * height;
        
        // Strict positive velocity (Left -> Right)
        // Range: 0.2 to 0.5 pixels/frame
        this.vx = Math.random() * 0.3 + 0.2; 
        this.vy = (Math.random() - 0.5) * 0.2; // Minimal vertical drift
        
        this.radius = Math.random() * 20 + 15; 
        
        this.nucleusR = this.radius * (0.25 + Math.random() * 0.15);
        const maxNucleusOffset = (this.radius - this.nucleusR) * 0.5;
        this.nucleusX = (Math.random() - 0.5) * maxNucleusOffset;
        this.nucleusY = (Math.random() - 0.5) * maxNucleusOffset;

        this.organelles = [];
        const numOrganelles = Math.floor(Math.random() * 4) + 2;
        for(let i=0; i<numOrganelles; i++) {
             const angle = Math.random() * Math.PI * 2;
             const dist = this.nucleusR + (Math.random() * (this.radius - this.nucleusR - 2));
             this.organelles.push({
                 x: Math.cos(angle) * dist,
                 y: Math.sin(angle) * dist,
                 r: Math.random() * 2 + 1 
             });
        }
        
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.type = Math.random() > 0.5 ? 'A' : 'B';
      }

      update() {
        this.x += this.vx; 
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Ensure velocity never reverses or stops
        if (this.vx < 0.1) this.vx = 0.1;

        // Wrap around logic
        // Reset to left side with a random Y to maintain flow variability
        if (this.x > width + this.radius) {
            this.x = -this.radius;
            this.y = Math.random() * height;
            // Reset velocity on respawn to maintain organic feel
            this.vx = Math.random() * 0.3 + 0.2;
        }
        
        // Vertical bounds: bounce softly
        if (this.y > height + this.radius) this.vy *= -1;
        if (this.y < -this.radius) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const relativeX = this.x / width;
        const time = Date.now() / 1000;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // --- RENDER LOGIC BASED ON ZONE ---

        if (relativeX < 0.33) {
          // ZONE 1: RAW ORGANIC (Microscope View)
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(200, 220, 230, 0.08)'; 
          ctx.fill();
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(this.nucleusX, this.nucleusY, this.nucleusR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          this.organelles.forEach(o => {
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.fill();
          });

        } else if (relativeX < 0.66) {
          // ZONE 2: NEURAL PROCESSING (Deep Analysis)
          
          // Outer Tech Membrane
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.05)'; 
          ctx.fill();
          
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]); 
          ctx.stroke();
          ctx.setLineDash([]);

          // --- VISUALIZATION: SCANNING BEAM ---
          // Clip to cell interior
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.clip();
          
          // Beam oscillates up and down
          const scanY = Math.sin(time * 3 + this.x * 0.1) * this.radius;
          ctx.beginPath();
          ctx.moveTo(-this.radius, scanY);
          ctx.lineTo(this.radius, scanY);
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
          ctx.lineWidth = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#06b6d4';
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.restore();

          // Nucleus with Targeting Reticle
          ctx.beginPath();
          ctx.arc(this.nucleusX, this.nucleusY, this.nucleusR, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
          
          // Crosshair
          const chSize = 4;
          ctx.beginPath();
          ctx.moveTo(this.nucleusX - chSize, this.nucleusY);
          ctx.lineTo(this.nucleusX + chSize, this.nucleusY);
          ctx.moveTo(this.nucleusX, this.nucleusY - chSize);
          ctx.lineTo(this.nucleusX, this.nucleusY + chSize);
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // --- VISUALIZATION: FEATURE VECTORS ---
          // Connecting organelles to nucleus
          ctx.fillStyle = '#06b6d4';
          this.organelles.forEach(o => {
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw vector line
            ctx.beginPath();
            ctx.moveTo(o.x, o.y);
            ctx.lineTo(this.nucleusX, this.nucleusY);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            // Little node on organelle
            ctx.beginPath();
            ctx.rect(o.x - 1, o.y - 1, 2, 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
          });

        } else {
          // ZONE 3: SEGMENTATION RESULT (Classified)
          const color = this.type === 'A' ? '#8b5cf6' : '#10b981'; 
          const bgOpacity = this.type === 'A' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)';

          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = bgOpacity;
          ctx.fill();
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(this.nucleusX, this.nucleusY, this.nucleusR, 0, Math.PI * 2);
          ctx.fillStyle = color; 
          ctx.fill();

          ctx.fillStyle = color;
          ctx.globalAlpha = 0.5;
          this.organelles.forEach(o => {
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.globalAlpha = 1.0;
        }

        ctx.restore();

        // Overlay Bounding Box (Zone 3)
        if (relativeX > 0.66) {
             const color = this.type === 'A' ? '#8b5cf6' : '#10b981';
             ctx.save();
             ctx.strokeStyle = color;
             ctx.lineWidth = 1;
             ctx.shadowBlur = 5;
             ctx.shadowColor = color;
             
             const boxSize = this.radius * 2.4;
             const x = this.x - boxSize/2;
             const y = this.y - boxSize/2;
             const len = boxSize * 0.2;
             
             ctx.beginPath();
             ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
             ctx.moveTo(x + boxSize - len, y); ctx.lineTo(x + boxSize, y); ctx.lineTo(x + boxSize, y + len);
             ctx.moveTo(x + boxSize, y + boxSize - len); ctx.lineTo(x + boxSize, y + boxSize); ctx.lineTo(x + boxSize - len, y + boxSize);
             ctx.moveTo(x + len, y + boxSize); ctx.lineTo(x, y + boxSize); ctx.lineTo(x, y + boxSize - len);
             ctx.stroke();
             
             ctx.font = '9px monospace';
             ctx.fillStyle = color;
             ctx.fillText(this.type === 'A' ? "LYMPHOCYTE 98%" : "MONOCYTE 94%", x, y - 5);
             ctx.restore();
        }
      }
    }

    // --- INITIALIZATION ---
    const cells: Cell[] = [];
    
    // Create stratified distribution on Y-axis to ensure screen coverage
    // and random distribution on X-axis to "tile" the screen.
    const spacingY = height / particleCount;
    
    for(let i=0; i<particleCount; i++) {
        // Stratified Y position with randomness within the band
        const initY = i * spacingY + (Math.random() * spacingY * 0.8) + spacingY * 0.1;
        
        // Random X position across the screen width
        const initX = Math.random() * width;
        
        cells.push(new Cell(initX, initY));
    }

    const drawGrid = () => {
       const midStart = width * 0.33;
       const midEnd = width * 0.66;
       const zoneWidth = midEnd - midStart;
       
       ctx.lineWidth = 1;
       const step = 50;

       for(let i = midStart; i < midEnd; i += step) {
           const progress = (i - midStart) / zoneWidth;
           
           // Gradient from Cyan to Purple
           const r = Math.floor(6 + (139 - 6) * progress);
           const g = Math.floor(182 + (92 - 182) * progress);
           const b = Math.floor(212 + (246 - 212) * progress);
           
           ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
           
           ctx.beginPath();
           ctx.moveTo(i, 0);
           ctx.lineTo(i, height);
           ctx.stroke();
       }
    };

    const drawConnections = () => {
      cells.forEach((p1, i) => {
        cells.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const avgX = (p1.x + p2.x) / 2;
            const relativeX = avgX / width;

            if (relativeX > 0.33) {
                const opacity = 1 - distance / connectionDistance;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                
                if (relativeX < 0.66) {
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.8})`; 
                    ctx.lineWidth = 2.5; 
                    
                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;
                    
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = '#06b6d4';
                    ctx.stroke(); 
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#fff';
                    ctx.fillRect(midX - 1.5, midY - 1.5, 3, 3);

                } else {
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
          }
        });
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(2, 6, 23, 0.2)'); 
      gradient.addColorStop(0.5, 'rgba(2, 6, 23, 0.5)'); 
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0.2)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      drawGrid();

      // --- REPULSION LOGIC (ZONE 3 - > 1/3 into zone) ---
      // Start Repulsion approx at width * 0.77 (0.66 + 1/3 of 0.33)
      const repulsionStart = width * 0.77; 
      
      for(let i=0; i<cells.length; i++) {
          const c1 = cells[i];
          // Only process if in deep Zone 3
          if (c1.x <= repulsionStart) continue;

          for(let j=i+1; j<cells.length; j++) {
              const c2 = cells[j];
              if (c2.x <= repulsionStart) continue;

              const dx = c1.x - c2.x;
              const dy = c1.y - c2.y;
              const distSq = dx*dx + dy*dy;
              
              // Target distance: sum of radii + visual buffer for clean separation
              const targetDist = c1.radius + c2.radius + 40; 
              
              if (distSq < targetDist * targetDist) {
                  const dist = Math.sqrt(distSq);
                  if (dist === 0) continue; 
                  
                  // Force vector calculation
                  const force = (targetDist - dist) / targetDist; // 0 to 1 strength
                  
                  // Modify force distribution: 
                  // Minimal X-push (prevent backward flow)
                  // Strong Y-push (separate into lanes)
                  const fx = (dx / dist) * force * 0.2; 
                  const fy = (dy / dist) * force * 2.0;

                  // Apply displacement
                  c1.x += fx;
                  c1.y += fy;
                  c2.x -= fx;
                  c2.y -= fy;
                  
                  // Velocity influence (very subtle, mainly to drift them apart)
                  // Don't reduce X velocity too much to prevent stalling/reversing
                  c1.vy += fy * 0.05;
                  c2.vy -= fy * 0.05;
              }
          }
      }

      cells.forEach(c => {
        c.update();
        c.draw(ctx);
      });

      drawConnections();

      // --- ZONE DIVIDERS ---
      ctx.lineWidth = 2; 
      ctx.setLineDash([5, 5]); 

      // Divider 1
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)'; 
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(width * 0.33, 0);
      ctx.lineTo(width * 0.33, height);
      ctx.stroke();
      ctx.restore();

      // Divider 2
      ctx.save();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)'; 
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#8b5cf6';
      ctx.beginPath();
      ctx.moveTo(width * 0.66, 0);
      ctx.lineTo(width * 0.66, height);
      ctx.stroke();
      ctx.restore();

      ctx.setLineDash([]); 

      // --- LABELS ---
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillText("INPUT_SOURCE: ORGANIC_SAMPLE_04", 20, height - 20);
      ctx.fillStyle = '#06b6d4';
      ctx.fillText("PROCESS: FEATURE_EXTRACTION_V3", width * 0.33 + 20, height - 20);
      ctx.fillStyle = '#10b981';
      ctx.fillText("OUTPUT: CELL_CLASSIFICATION_MAP", width * 0.66 + 20, height - 20);

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

export default Background;