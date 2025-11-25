

export interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  wxid: string;
  signature?: string;
  remark?: string; // Friend remark name
}

export interface Group {
  id: string;
  name: string;
  avatar: string; // usually a composite or specific image
  members: string[]; // array of User IDs
  notice?: string;
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

export interface Notification {
    id: string;
    type: 'like' | 'comment';
    userId: string;
    userName: string;
    userAvatar: string;
    postId: string;
    postImage?: string; // Thumbnail of the post
    content?: string; // Comment content
    timestamp: number;
    read: boolean;
}

export interface ChatSession {
  id: string; // User ID or Group ID
  type: 'user' | 'group';
  name: string;
  avatar: string;
  lastMessage: Message | null;
  unreadCount: number;
}

export type ViewState = 
  | { type: 'TAB_CHATS' }
  | { type: 'TAB_CONTACTS' }
  | { type: 'TAB_DISCOVER' }
  | { type: 'TAB_ME' }
  | { type: 'CHAT_DETAIL', id: string, chatType: 'user' | 'group' }
  | { type: 'CHAT_INFO', id: string, chatType: 'user' | 'group' } // Chat Details / Group Settings
  | { type: 'GROUP_LIST' }
  | { type: 'MOMENTS' }
  | { type: 'USER_MOMENTS', userId: string }
  | { type: 'MOMENTS_PUBLISH' }
  | { type: 'ADD_FRIEND' }
  | { type: 'USER_PROFILE', userId: string }
  | { type: 'SET_REMARK', userId: string }
  | { type: 'MY_PROFILE' }
  | { type: 'EDIT_NAME' }
  | { type: 'EDIT_WXID' }
  | { type: 'CHANNELS' }
  | { type: 'SETTINGS' }
  | { type: 'SETTINGS_GENERAL' }
  | { type: 'SETTINGS_LANGUAGE' }
  | { type: 'SERVICES' }
  | { type: 'FAVORITES' }
  | { type: 'STICKER_GALLERY' }
  | { type: 'DISCOVER_SCAN' }
  | { type: 'DISCOVER_SHAKE' }
  | { type: 'DISCOVER_TOP_STORIES' }
  | { type: 'DISCOVER_SEARCH' }
  | { type: 'DISCOVER_GAMES' }
  | { type: 'WARM_HOME_GAME' }
  | { type: 'DISCOVER_MINI_PROGRAMS' }
  | { type: 'DISCOVER_MUSIC' }
  | { type: 'DISCOVER_ARTICLE', articleId: string }
  | { type: 'MONEY_RED_PACKET', userId: string }
  | { type: 'MONEY_TRANSFER', userId: string }
  | { type: 'MONEY_CODE' };