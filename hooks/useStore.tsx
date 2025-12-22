
import { useState, useEffect, useCallback, createContext, useContext, ReactNode, useRef } from 'react';
import { User, Message, Post, ChatSession, Comment, Group, Notification } from '../types';
import { INITIAL_FRIENDS, MOCK_POSTS_INITIAL, CURRENT_USER, MOCK_MESSAGES, MOCK_GROUPS, TRANSLATIONS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

const LOCAL_MOMENTS_POOL = [
  { text: "下班！明天又是元气满满（个鬼）的一天。", imgCount: 1 },
  { text: "。 。 。", imgCount: 0 },
  { text: "服了，真的服了。", imgCount: 0 },
  { text: "好想喝奶茶啊啊啊啊啊啊", imgCount: 0 },
  { text: "今日份的打工记录：心率平稳，只想辞职。", imgCount: 1 },
  { text: "终于周五了！！！！！", imgCount: 0 },
  { text: "想念老家的晚霞了。", imgCount: 2 },
  { text: "尊嘟假嘟？O.o", imgCount: 0 },
  { text: "早八，我恨。", imgCount: 1 },
  { text: "有些事，看淡了也就那样吧", imgCount: 1 },
  { text: "又是想去旅游的一天。", imgCount: 3 },
  { text: "没救了，这个世界。", imgCount: 0 },
  { text: "今天的云好漂亮！☁️", imgCount: 1 },
  { text: "拼个饭，有无？", imgCount: 0 },
  { text: "网速慢得想撞墙...", imgCount: 0 }
];

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
  markNotificationsAsRead: () => void;
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

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('wx_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const prefetchPool = useRef<{text: string, imgCount: number, authorId: string}[]>([]);
  const isPrefetching = useRef(false);

  useEffect(() => localStorage.setItem('wx_current_user', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('wx_language', language), [language]);
  useEffect(() => localStorage.setItem('wx_friends', JSON.stringify(friends)), [friends]);
  useEffect(() => localStorage.setItem('wx_groups', JSON.stringify(groups)), [groups]);
  useEffect(() => localStorage.setItem('wx_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('wx_posts', JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem('wx_notifications', JSON.stringify(notifications)), [notifications]);

  useEffect(() => {
    setTimeout(() => fillPrefetchPool(), 2000);
  }, []);

  const fillPrefetchPool = async () => {
    if (isPrefetching.current || friends.length === 0) return;
    isPrefetching.current = true;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `生成3条极其真实的中国版微信朋友圈动态。数组返回：[{"text":"...", "imgCount": 0-9}, ...]`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const results = JSON.parse(response.text || "[]");
      if (Array.isArray(results)) {
        results.forEach(res => {
          prefetchPool.current.push({ ...res, authorId: friends[Math.floor(Math.random() * friends.length)].id });
        });
      }
    } catch (e) {
      console.warn("Prefetch Failed", e);
    } finally {
      isPrefetching.current = false;
    }
  };

  const simulateFeedback = useCallback(async (postId: string, content: string) => {
    const interactionCount = 3 + Math.floor(Math.random() * 5);
    const availableFriends = [...friends].sort(() => Math.random() - 0.5);

    for (let i = 0; i < interactionCount; i++) {
      const friend = availableFriends[i];
      if (!friend) break;
      const delay = 2000 + Math.random() * 13000;
      
      setTimeout(async () => {
        const isLike = Math.random() > 0.4;
        if (isLike) {
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: [...new Set([...p.likes, friend.id])] } : p));
          setNotifications(prev => [{
            id: `notif_${Date.now()}`,
            type: 'like',
            userId: friend.id,
            userName: friend.remark || friend.name,
            userAvatar: friend.avatar,
            postId: postId,
            timestamp: Date.now(),
            read: false
          }, ...prev]);
        } else {
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `你是"${friend.name}"。你的朋友刚刚发了朋友圈："${content}"。请写一条极其真实且简短的微信评论。如果是长辈就发鼓励，如果是年轻人就发玩梗或吐槽。极短（10字以内）。`;
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            const commentText = response.text?.trim() || "赞！";
            const newComment: Comment = { id: `c_ai_${Date.now()}`, userId: friend.id, userName: friend.remark || friend.name, content: commentText, timestamp: Date.now() };
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
            setNotifications(prev => [{
              id: `notif_${Date.now()}`,
              type: 'comment',
              userId: friend.id,
              userName: friend.remark || friend.name,
              userAvatar: friend.avatar,
              postId: postId,
              content: commentText,
              timestamp: Date.now(),
              read: false
            }, ...prev]);
          } catch (e) {}
        }
      }, delay);
    }
  }, [friends]);

  const updateCurrentUser = (updates: Partial<User>) => setCurrentUser(prev => ({ ...prev, ...updates }));
  
  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

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
    const newUser: User = { id: `new_${Date.now()}`, name: `用户 ${phone.slice(-4)}`, avatar: `https://picsum.photos/seed/${phone}/200/200`, phone: phone, wxid: `wx_${phone}` };
    setFriends(prev => [...prev, newUser]);
    return true;
  }, [friends]);

  const deleteFriend = useCallback((id: string) => {
    setFriends(prev => prev.filter(f => f.id !== id));
    setMessages(prev => prev.filter(m => m.senderId !== id && m.receiverId !== id));
  }, []);

  const updateFriendRemark = (id: string, remark: string) => setFriends(prev => prev.map(f => f.id === id ? { ...f, remark } : f));

  const addPost = useCallback((content: string, images: string[]) => {
    const newPostId = `p_${Date.now()}`;
    const newPost: Post = { id: newPostId, authorId: currentUser.id, content, images, likes: [], comments: [], timestamp: Date.now() };
    setPosts(prev => [newPost, ...prev]);
    simulateFeedback(newPostId, content);
  }, [currentUser.id, simulateFeedback]);

  const refreshMoments = useCallback(async () => {
    const delay = 1200 + Math.random() * 800; 
    await new Promise(resolve => setTimeout(resolve, delay));
    let sourceData;
    if (prefetchPool.current.length > 0) {
      sourceData = prefetchPool.current.shift();
    } else {
      const local = LOCAL_MOMENTS_POOL[Math.floor(Math.random() * LOCAL_MOMENTS_POOL.length)];
      sourceData = { ...local, authorId: friends[Math.floor(Math.random() * friends.length)].id };
    }
    if (sourceData) {
      const baseSeed = Math.floor(Math.random() * 1000);
      const images = sourceData.imgCount > 0 
        ? Array.from({ length: Math.min(sourceData.imgCount, 9) }).map((_, i) => `https://picsum.photos/400/400?random=${baseSeed + i}`)
        : [];
      const newPost: Post = {
          id: `p_fast_${Date.now()}`,
          authorId: sourceData.authorId,
          content: sourceData.text,
          images: images,
          likes: [],
          comments: [],
          timestamp: Date.now()
      };
      setPosts(prev => [newPost, ...prev]);
    }
    if (prefetchPool.current.length < 2) fillPrefetchPool();
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

  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

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
                  id: sessionId, type,
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
      markNotificationsAsRead, getChatHistory, getChatSessions, getUser, t
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
