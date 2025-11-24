

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  wxid: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string; // text content, note for money, or text-to-read for audio
  type: 'text' | 'audio' | 'red_packet' | 'transfer' | 'system';
  timestamp: number;
  read: boolean;
  duration?: number; // for audio messages in seconds
  amount?: string; // for money messages
  status?: 'sent' | 'accepted' | 'opened'; // Track status for money messages
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  authorId: string;
  content: string;
  images: string[];
  likes: string[]; // array of user IDs
  comments: Comment[];
  timestamp: number;
}

export interface ChatSession {
  userId: string; // The other person
  lastMessage: Message | null;
  unreadCount: number;
}

export type ViewState = 
  | { type: 'TAB_CHATS' }
  | { type: 'TAB_CONTACTS' }
  | { type: 'TAB_DISCOVER' }
  | { type: 'TAB_ME' }
  | { type: 'CHAT_DETAIL', userId: string }
  | { type: 'MOMENTS' }
  | { type: 'MOMENTS_PUBLISH' }
  | { type: 'ADD_FRIEND' }
  | { type: 'USER_PROFILE', userId: string }
  | { type: 'MY_PROFILE' }
  | { type: 'EDIT_NAME' }
  | { type: 'CHANNELS' }
  | { type: 'SETTINGS' }
  | { type: 'SETTINGS_GENERAL' }
  | { type: 'SERVICES' }
  | { type: 'FAVORITES' }
  | { type: 'STICKER_GALLERY' }
  | { type: 'DISCOVER_SCAN' }
  | { type: 'DISCOVER_SHAKE' }
  | { type: 'DISCOVER_TOP_STORIES' }
  | { type: 'DISCOVER_SEARCH' }
  | { type: 'DISCOVER_GAMES' }
  | { type: 'DISCOVER_MINI_PROGRAMS' }
  | { type: 'MONEY_RED_PACKET', userId: string }
  | { type: 'MONEY_TRANSFER', userId: string };