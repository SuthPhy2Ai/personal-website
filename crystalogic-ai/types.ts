export interface User {
  username: string;
  role: 'researcher' | 'admin';
}

export enum VisualizationMode {
  DASHBOARD = 'DASHBOARD',
  EDITOR = 'EDITOR'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  isError?: boolean;
}
