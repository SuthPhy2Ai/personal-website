export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export interface XRDDataPoint {
  angle: number;
  intensity: number;
}

export enum AppState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
}

export interface ImageEditState {
  originalImage: string | null; // Base64
  generatedImage: string | null; // Base64
  prompt: string;
  isLoading: boolean;
  error: string | null;
}
