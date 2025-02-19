// Types pour TypeScript (optionnel mais recommandé)
export interface Message {
    id: string;
    text: string;
    timestamp: string;
    isSent: boolean;
  }
  
  export interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    avatar: string;
    unread: number;
  }