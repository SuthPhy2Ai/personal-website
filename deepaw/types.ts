export enum ImageSize {
  Resolution1K = "1K",
  Resolution2K = "2K",
  Resolution4K = "4K"
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  resolution: ImageSize;
  timestamp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  username?: string;
}
