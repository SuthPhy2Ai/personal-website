import React, { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { XRDDataPoint } from '../types';

// --- 3D Math & Shape Definitions ---

interface Point3D { x: number; y: number; z: number; }
interface Edge { start: number; end: number; }

interface CrystalShape {
  vertices: Point3D[];
  edges: Edge[];
  internalAtoms: Point3D[]; // Added internal atoms for structural realism
}

interface CrystalParticle {
  x: number; // 2D Center X
  y: number; // 2D Center Y
  vx: number;
  vy: number;
  size: number; // Scale factor
  rotation: { x: number; y: number; z: number };
  rotSpeed: { x: number; y: number; z: number };
  type: 'CUBIC' | 'OCTAHEDRON' | 'TETRAGONAL';
}

const Shapes: Record<string, CrystalShape> = {
  CUBIC: {
    vertices: [
      {x:-1, y:-1, z:-1}, {x:1, y:-1, z:-1}, {x:1, y:1, z:-1}, {x:-1, y:1, z:-1}, // Front face
      {x:-1, y:-1, z:1},  {x:1, y:-1, z:1},  {x:1, y:1, z:1},  {x:-1, y:1, z:1}   // Back face
    ],
    edges: [
      {start:0, end:1}, {start:1, end:2}, {start:2, end:3}, {start:3, end:0}, // Front
      {start:4, end:5}, {start:5, end:6}, {start:6, end:7}, {start:7, end:4}, // Back
      {start:0, end:4}, {start:1, end:5}, {start:2, end:6}, {start:3, end:7}  // Connections
    ],
    internalAtoms: [
      {x: 0, y: 0, z: 0}, // Body Center
      {x: 0.5, y: 0.5, z: 0.5}, {x: -0.5, y: -0.5, z: -0.5}, // Tetrahedral voids
      {x: 0.5, y: -0.5, z: 0.5}, {x: -0.5, y: 0.5, z: -0.5}
    ]
  },
  OCTAHEDRON: {
    vertices: [
      {x:0, y:1, z:0},  // Top
      {x:1, y:0, z:0},  {x:0, y:0, z:1}, {x:-1, y:0, z:0}, {x:0, y:0, z:-1}, // Middle ring
      {x:0, y:-1, z:0}  // Bottom
    ],
    edges: [
      {start:0, end:1}, {start:0, end:2}, {start:0, end:3}, {start:0, end:4}, // Top pyramid
      {start:5, end:1}, {start:5, end:2}, {start:5, end:3}, {start:5, end:4}, // Bottom pyramid
      {start:1, end:2}, {start:2, end:3}, {start:3, end:4}, {start:4, end:1}  // Middle ring
    ],
    internalAtoms: [
      {x: 0, y: 0, z: 0}, // Center
      {x: 0, y: 0.5, z: 0}, {x: 0, y: -0.5, z: 0} // Axis points
    ]
  },
  TETRAGONAL: {
    // Like cubic but elongated in Y
    vertices: [
      {x:-0.7, y:-1.4, z:-0.7}, {x:0.7, y:-1.4, z:-0.7}, {x:0.7, y:1.4, z:-0.7}, {x:-0.7, y:1.4, z:-0.7},
      {x:-0.7, y:-1.4, z:0.7},  {x:0.7, y:-1.4, z:0.7},  {x:0.7, y:1.4, z:0.7},  {x:-0.7, y:1.4, z:0.7}
    ],
    edges: [
      {start:0, end:1}, {start:1, end:2}, {start:2, end:3}, {start:3, end:0},
      {start:4, end:5}, {start:5, end:6}, {start:6, end:7}, {start:7, end:4},
      {start:0, end:4}, {start:1, end:5}, {start:2, end:6}, {start:3, end:7}
    ],
    internalAtoms: [
      {x: 0, y: 0, z: 0}, // Center
      {x: 0, y: 0.7, z: 0}, {x: 0, y: -0.7, z: 0}, // Elongated axis points
      {x: 0, y: 0, z: 0.35}, {x: 0, y: 0, z: -0.35}
    ]
  }
};

const rotatePoint = (p: Point3D, rot: {x:number, y:number, z:number}): Point3D => {
  // Rotate X
  let y = p.y * Math.cos(rot.x) - p.z * Math.sin(rot.x);
  let z = p.y * Math.sin(rot.x) + p.z * Math.cos(rot.x);
  let x = p.x;

  // Rotate Y
  let z2 = z * Math.cos(rot.y) - x * Math.sin(rot.y);
  let x2 = z * Math.sin(rot.y) + x * Math.cos(rot.y);
  let y2 = y;

  // Rotate Z
  let x3 = x2 * Math.cos(rot.z) - y2 * Math.sin(rot.z);
  let y3 = x2 * Math.sin(rot.z) + y2 * Math.cos(rot.z);
  let z3 = z2;

  return { x: x3, y: y3, z: z3 };
};

const VisualizationCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xrdData, setXrdData] = useState<XRDDataPoint[]>([]);

  // 1. Generate Realistic XRD Data
  useEffect(() => {
    const generateXRD = () => {
      const data: XRDDataPoint[] = [];
      const startAngle = 10;
      const endAngle = 90;
      // High resolution step to render sharp peaks correctly
      const step = 0.02; 

      // Silicon-like pattern (sharp crystalline peaks)
      const peaks = [
        { pos: 28.44,  int: 1200, width: 0.3 }, 
        { pos: 47.30,  int: 750,  width: 0.35 },
        { pos: 56.12,  int: 500,  width: 0.35 },
        { pos: 69.13,  int: 200,  width: 0.4 },
        { pos: 76.38,  int: 350,  width: 0.4 },
        { pos: 88.03,  int: 250,  width: 0.45 },
      ];

      const lorentzian = (x: number, x0: number, h: number, w: number) => {
        return h / (1 + Math.pow((x - x0) / (w / 2), 2));
      };

      for (let angle = startAngle; angle <= endAngle; angle += step) {
        let intensity = 15; // Base noise
        
        peaks.forEach(peak => {
          intensity += lorentzian(angle, peak.pos, peak.int, peak.width);
        });

        // Perlin-ish noise for reality
        intensity += Math.random() * 10;
        
        // Low angle scattering (air scatter/glass)
        if (angle < 20) {
            intensity += 60 * Math.exp(-(angle - 10) / 5);
        }

        data.push({ angle, intensity });
      }
      return data;
    };

    setXrdData(generateXRD());
  }, []);

  // 2. Crystal Animation System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let crystals: CrystalParticle[] = [];
    const crystalCount = 25; // Fewer particles, but more complex
    const connectionDistance = 200;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initCrystals();
    };

    const initCrystals = () => {
      crystals = [];
      const types: ('CUBIC' | 'OCTAHEDRON' | 'TETRAGONAL')[] = ['CUBIC', 'OCTAHEDRON', 'TETRAGONAL'];
      
      for (let i = 0; i < crystalCount; i++) {
        crystals.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Slower movement for majesty
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 10 + 10, // Base size
          rotation: { 
            x: Math.random() * Math.PI, 
            y: Math.random() * Math.PI, 
            z: Math.random() * Math.PI 
          },
          rotSpeed: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
          },
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw crystals
      crystals.forEach((crystal, index) => {
        // Physics
        crystal.x += crystal.vx;
        crystal.y += crystal.vy;
        crystal.rotation.x += crystal.rotSpeed.x;
        crystal.rotation.y += crystal.rotSpeed.y;
        crystal.rotation.z += crystal.rotSpeed.z;

        // Boundaries
        if (crystal.x < -50) crystal.x = canvas.width + 50;
        if (crystal.x > canvas.width + 50) crystal.x = -50;
        if (crystal.y < -50) crystal.y = canvas.height + 50;
        if (crystal.y > canvas.height + 50) crystal.y = -50;

        // Draw Connections first (behind crystals)
        for (let j = index + 1; j < crystals.length; j++) {
          const other = crystals[j];
          const dx = crystal.x - other.x;
          const dy = crystal.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.15 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(crystal.x, crystal.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        const shape = Shapes[crystal.type];

        // 1. Calculate and Draw Internal Atoms (Inner glow/structure)
        const projectedInternal = shape.internalAtoms.map(v => {
           const rotated = rotatePoint(v, crystal.rotation);
           const scaled = { x: rotated.x * crystal.size, y: rotated.y * crystal.size, z: rotated.z * crystal.size };
           return { x: crystal.x + scaled.x, y: crystal.y + scaled.y };
        });

        ctx.fillStyle = 'rgba(0, 243, 255, 0.7)';
        projectedInternal.forEach(v => {
            ctx.beginPath();
            ctx.arc(v.x, v.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. Calculate Outer Vertices
        const projectedVertices: {x: number, y: number}[] = shape.vertices.map(v => {
          const rotated = rotatePoint(v, crystal.rotation);
          const scaled = { x: rotated.x * crystal.size, y: rotated.y * crystal.size, z: rotated.z * crystal.size };
          return { x: crystal.x + scaled.x, y: crystal.y + scaled.y };
        });

        // 3. Draw Edges (Wireframe)
        ctx.strokeStyle = '#00F3FF';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        shape.edges.forEach(edge => {
          const start = projectedVertices[edge.start];
          const end = projectedVertices[edge.end];
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
        });
        ctx.stroke();

        // 4. Draw Outer Vertices (Atoms)
        ctx.fillStyle = '#00F3FF'; 
        projectedVertices.forEach(v => {
          ctx.beginPath();
          ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-cyber-black flex flex-col justify-end">
      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full z-0 opacity-80"
      />
      
      {/* Decorative Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyber-black/90 via-transparent to-cyber-cyan/5 pointer-events-none z-10" />

      {/* XRD Spectrum Overlay */}
      <div className="relative z-20 w-full h-1/3 pointer-events-none opacity-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={xrdData}>
            <defs>
              <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F3FF" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#00F3FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 'auto']} />
            <Area 
              type="monotone" 
              dataKey="intensity" 
              stroke="#00F3FF" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorIntensity)" 
              isAnimationActive={true}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute bottom-4 left-4 font-mono text-xs text-cyber-cyan tracking-widest flex items-center gap-2">
           <span className="w-2 h-2 bg-cyber-red rounded-full animate-pulse"></span>
           XRD_SPECTRAL_FEED // PHASE_ID: Si_POLY
        </div>
      </div>
    </div>
  );
};

export default VisualizationCore;