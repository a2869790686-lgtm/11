
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

  // --- ENHANCED REFRESH MOMENTS (Varied Length & Fast Images) ---
  const refreshMoments = useCallback(async () => {
    try {
      if (friends.length === 0) return;
      
      const author = friends[Math.floor(Math.random() * friends.length)];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const moodTemplates = [
        "闲来无事发牢骚", "简短有力的状态", "深度长篇感悟", "结合新闻热点点赞/吐槽", "日常生活打卡", "深夜网抑云情绪"
      ];
      const selectedMood = moodTemplates[Math.floor(Math.random() * moodTemplates.length)];

      const prompt = `
        你现在是微信好友 "${author.name}"，签名是: "${author.signature}"。
        
        任务: 
        1. 使用 Google Search 获取一个今日热点。
        2. 根据心情模板 "${selectedMood}" 写一条朋友圈动态。
        3. 字数要求：有的动态极短（3-10字），有的中等（20-50字），有的较长（100字以上）。请随机分配。
        4. 必须包含符合 "${author.name}" 身份的口头禅或语气。
        5. 图片数量建议：随机返回 0, 1, 3, 6 或 9。
        
        请仅返回 JSON:
        {
          "content": "文字内容...",
          "imgKeywords": "单个英文关键词(用于搜索图片)",
          "imgCount": 数字
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
              imgKeywords: { type: Type.STRING },
              imgCount: { type: Type.INTEGER }
            },
            required: ["content", "imgKeywords", "imgCount"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      
      if (result.content) {
        const keyword = (result.imgKeywords || "lifestyle").split(',')[0].trim();
        const count = Math.min(9, Math.max(0, result.imgCount || 0));
        
        // Use a faster source: source.unsplash.com or simply more optimized lorempicsum keywords
        const images = count > 0 
          ? Array.from({ length: count }).map((_, i) => `https://loremflickr.com/400/400/${keyword}?lock=${Date.now() + i}`)
          : [];

        const newPost: Post = {
            id: `p_gen_${Date.now()}`,
            authorId: author.id,
            content: result.content,
            images: images,
            likes: [],
            comments: [],
            timestamp: Date.now()
        };
        setPosts(prev => [newPost, ...prev]);
      }
    } catch (error) {
      console.error("AI Refresh Error:", error);
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
