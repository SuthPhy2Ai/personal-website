export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export enum FeatureMode {
  HOME = 'HOME',
  IMAGE_GEN = 'IMAGE_GEN',
  CHAT = 'CHAT'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export type ImageResolution = "1K" | "2K" | "4K";

export interface GeneratedImage {
  url: string;
  prompt: string;
}
