
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Message, Post, ChatSession, Comment, Group, Notification } from '../types';
import { INITIAL_FRIENDS, MOCK_POSTS_INITIAL, CURRENT_USER, MOCK_MESSAGES, MOCK_GROUPS, TRANSLATIONS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

interface StoreContextType {
  currentUser: User;
  friends: User[];
  groups: Group[];
  messages: Message[];
  posts: Post[];
  notifications: Notification[];
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  addMessage: (msg: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  markAsRead: (id: string) => void;
  addFriend: (phone: string) => boolean;
  deleteFriend: (id: string) => void;
  updateFriendRemark: (id: string, remark: string) => void;
  addPost: (content: string, images: string[]) => void;
  refreshMoments: () => Promise<void>;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  getChatHistory: (id: string, isGroup?: boolean) => Message[];
  getChatSessions: () => ChatSession[];
  getUser: (id: string) => User | undefined;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('wx_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [language, setLanguage] = useState<'en' | 'zh'>(() => {
    return (localStorage.getItem('wx_language') as 'en' | 'zh') || 'zh';
  });

  const [friends, setFriends] = useState<User[]>(() => {
    const saved = localStorage.getItem('wx_friends');
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('wx_groups');
    return saved ? JSON.parse(saved) : MOCK_GROUPS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('wx_messages');
    return saved ? JSON.parse(saved) : MOCK_MESSAGES;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('wx_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS_INITIAL;
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Persist
  useEffect(() => localStorage.setItem('wx_current_user', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('wx_language', language), [language]);
  useEffect(() => localStorage.setItem('wx_friends', JSON.stringify(friends)), [friends]);
  useEffect(() => localStorage.setItem('wx_groups', JSON.stringify(groups)), [groups]);
  useEffect(() => localStorage.setItem('wx_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('wx_posts', JSON.stringify(posts)), [posts]);

  const updateCurrentUser = (updates: Partial<User>) => setCurrentUser(prev => ({ ...prev, ...updates }));
  const addMessage = (msg: Message) => setMessages(prev => [...prev, msg]);
  const updateMessage = (id: string, updates: Partial<Message>) => setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));

  const markAsRead = useCallback((targetId: string) => {
    setMessages(prev => prev.map(m => {
       const isGroupMsg = m.receiverId === targetId;
       const isDirectMsg = m.senderId === targetId && m.receiverId === currentUser.id;
       if ((isGroupMsg || isDirectMsg) && !m.read) return { ...m, read: true };
       return m;
    }));
  }, [currentUser.id]);

  const addFriend = useCallback((phone: string) => {
    const exists = friends.find(f => f.phone === phone);
    if (exists) return false;

    const newUser: User = {
      id: `new_${Date.now()}`,
      name: `用户 ${phone.slice(-4)}`,
      avatar: `https://picsum.photos/seed/${phone}/200/200`,
      phone: phone,
      wxid: `wx_${phone}`
    };
    
    setFriends(prev => [...prev, newUser]);
    return true;
  }, [friends]);

  const deleteFriend = useCallback((id: string) => {
    setFriends(prev => prev.filter(f => f.id !== id));
    setMessages(prev => prev.filter(m => m.senderId !== id && m.receiverId !== id));
  }, []);

  const updateFriendRemark = (id: string, remark: string) => setFriends(prev => prev.map(f => f.id === id ? { ...f, remark } : f));

  const addPost = useCallback((content: string, images: string[]) => {
    const newPost: Post = {
      id: `p_${Date.now()}`,
      authorId: currentUser.id,
      content,
      images,
      likes: [],
      comments: [],
      timestamp: Date.now()
    };
    setPosts(prev => [newPost, ...prev]);
  }, [currentUser.id]);

  // --- REFRESH MOMENTS VIA GEMINI AI + GOOGLE SEARCH ---
  const refreshMoments = useCallback(async () => {
    try {
      if (friends.length === 0) return;
      
      const author = friends[Math.floor(Math.random() * friends.length)];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        你现在是微信好友 "${author.name}"，你的微信号是 ${author.wxid}。
        你的个性签名是: "${author.signature}"。
        
        任务: 
        1. 使用 Google Search 搜索一个与你身份高度相关的今日热点、新闻、天气、或生活动态。
           - 如果你是生意人，搜索经济或行业新闻。
           - 如果你是学生/年轻人，搜索娱乐、游戏或校园话题。
           - 如果你是长辈，搜索健康或天气。
        2. 以你的语气写一条微信朋友圈动态 (中文)。
        3. 语气要极其真实，像真人发的。
        4. 提供 1-2 个描述图片的关键词 (英文)，用于生成相关配图。
        
        请仅返回 JSON 格式:
        {
          "content": "动态文字内容...",
          "imgKeywords": "comma,separated,keywords"
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              imgKeywords: { type: Type.STRING }
            },
            required: ["content", "imgKeywords"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      
      if (result.content) {
        const keywords = result.imgKeywords || "lifestyle";
        const newPost: Post = {
            id: `p_gen_${Date.now()}`,
            authorId: author.id,
            content: result.content,
            images: [`https://loremflickr.com/500/500/${keywords.split(',')[0].trim()}?lock=${Date.now()}`],
            likes: [],
            comments: [],
            timestamp: Date.now()
        };
        setPosts(prev => [newPost, ...prev]);
      }
    } catch (error) {
      console.error("AI Refresh Error:", error);
      // Fallback post
      const fallbackPost: Post = {
          id: `p_fail_${Date.now()}`,
          authorId: friends[0].id,
          content: "今天天气不错，出来散散步。🍃",
          images: [`https://loremflickr.com/500/500/nature?lock=${Date.now()}`],
          likes: [],
          comments: [],
          timestamp: Date.now()
      };
      setPosts(prev => [fallbackPost, ...prev]);
    }
  }, [friends]);

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isLiked = p.likes.includes(currentUser.id);
      return { ...p, likes: isLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id] };
    }));
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = { id: `c_${Date.now()}`, userId: currentUser.id, userName: currentUser.name, content, timestamp: Date.now() };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
  };

  const getChatHistory = useCallback((targetId: string, isGroup: boolean = false) => {
    if (isGroup) return messages.filter(m => m.receiverId === targetId).sort((a, b) => a.timestamp - b.timestamp);
    return messages.filter(m => (m.senderId === currentUser.id && m.receiverId === targetId) || (m.senderId === targetId && m.receiverId === currentUser.id)).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, currentUser.id]);

  const getChatSessions = useCallback(() => {
    const sessions: Record<string, ChatSession> = {};
    messages.forEach(msg => {
      let sessionId: string;
      let type: 'user' | 'group' = 'user';
      const group = groups.find(g => g.id === msg.receiverId);
      if (group) { sessionId = group.id; type = 'group'; }
      else { sessionId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId; }

      if (!sessions[sessionId]) {
          const g = groups.find(g => g.id === sessionId);
          const f = friends.find(f => f.id === sessionId);
          if (g || f) {
              sessions[sessionId] = {
                  id: sessionId,
                  type,
                  name: g ? g.name : (f?.remark || f?.name || 'Unknown'),
                  avatar: g ? g.avatar : (f?.avatar || ''),
                  lastMessage: null, unreadCount: 0
              };
          }
      }
      const session = sessions[sessionId];
      if (session) {
          if (!session.lastMessage || msg.timestamp > session.lastMessage.timestamp) session.lastMessage = msg;
          if (!msg.read) {
              if (type === 'user' && msg.receiverId === currentUser.id) session.unreadCount++;
              else if (type === 'group' && msg.receiverId === sessionId && msg.senderId !== currentUser.id) session.unreadCount++;
          }
      }
    });
    return Object.values(sessions).sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
  }, [messages, friends, groups, currentUser.id]);

  const getUser = useCallback((id: string) => {
      if (id === currentUser.id) return currentUser;
      const friend = friends.find(u => u.id === id);
      if (friend) return { ...friend, name: friend.remark || friend.name };
      return undefined;
  }, [friends, currentUser]);
  
  const t = useCallback((key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[language][key] || key, [language]);

  return (
    <StoreContext.Provider value={{
      currentUser, friends, groups, messages, posts, notifications, language, setLanguage,
      updateCurrentUser, addMessage, updateMessage, markAsRead, addFriend,
      deleteFriend, updateFriendRemark, addPost, refreshMoments, toggleLike, addComment,
      getChatHistory, getChatSessions, getUser, t
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
