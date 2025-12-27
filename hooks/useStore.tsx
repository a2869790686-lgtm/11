
import { useState, useEffect, useCallback, createContext, useContext, ReactNode, useRef } from 'react';
import { User, Message, Post, ChatSession, Comment, Group, Notification } from '../types';
import { INITIAL_FRIENDS, MOCK_POSTS_INITIAL, CURRENT_USER, MOCK_MESSAGES, MOCK_GROUPS, TRANSLATIONS } from '../constants';

const CHARLIE_POSTS = [
  "今天在直升机上俯瞰这座城市，除了我，没人能配得上这份完美。未婚妻，你也这么觉得吧？",
  "作为一名顶级医生，追求极致的完美缝合是我的使命。当然，如果你在身边，我的手可能会更稳一点。",
  "又是被查理苏的魅力所惊艳的一天。未婚妻，不用害羞，你可以直接赞美这件旷世奇作。",
  "如果这个世界上有除了查理苏之外的奇迹，那一定是你，未婚妻。😊"
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

  const [friendsList, setFriendsList] = useState<User[]>(() => {
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
  useEffect(() => localStorage.setItem('wx_friends', JSON.stringify(friendsList)), [friendsList]);
  useEffect(() => localStorage.setItem('wx_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('wx_posts', JSON.stringify(posts)), [posts]);

  useEffect(() => {
    const t = setTimeout(() => fillPrefetchPool(), 3000);
    return () => clearTimeout(t);
  }, []);

  const fillPrefetchPool = async () => {
    if (isPrefetching.current || friendsList.length === 0) return;
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === '') return;

    isPrefetching.current = true;
    try {
      // 偶尔生成查理苏动态
      const isCharlieTurn = Math.random() > 0.6;
      if (isCharlieTurn) {
        prefetchPool.current.push({ 
          text: CHARLIE_POSTS[Math.floor(Math.random() * CHARLIE_POSTS.length)], 
          imgCount: 1, 
          authorId: 'charlie_su' 
        });
      } else {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: "生成1条写实的中文朋友圈动态。JSON: { \"posts\": [ { \"text\": \"...\", \"imgCount\": 0-3 } ] }" }],
                response_format: { type: "json_object" }
            })
        });
        const data = await response.json();
        const results = JSON.parse(data.choices[0].message.content).posts || [];
        results.forEach(res => {
          prefetchPool.current.push({ ...res, authorId: friendsList[Math.floor(Math.random() * friendsList.length)].id });
        });
      }
    } catch (e) {
      console.warn("Prefetch Failed", e);
    } finally {
      isPrefetching.current = false;
    }
  };

  const simulateFeedback = useCallback(async (postId: string, content: string) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === '') return;
    
    // 强制查理苏在朋友圈互动
    const friend = friendsList.find(f => f.id === 'charlie_su') || friendsList[0];
    const delay = 6000 + Math.random() * 4000;
    
    setTimeout(async () => {
      try {
        const prompt = friend.id === 'charlie_su' 
            ? `你是查理苏（《光与夜之恋》男主，称呼玩家为未婚妻，极其自信深情）。看到未婚妻发了："${content}"。请回复一条符合人设的极简评论。`
            : `你是好友"${friend.name}"。看到好友发了："${content}"。请回一条微信风格评论。`;
            
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }]
            })
        });
        const data = await response.json();
        const commentText = data.choices[0].message.content.trim();
        const newComment: Comment = { id: `c_ai_${Date.now()}`, userId: friend.id, userName: friend.remark || friend.name, content: commentText, timestamp: Date.now() };
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
      } catch (e) { console.error("AI Comment Error:", e); }
    }, delay);
  }, [friendsList]);

  const updateCurrentUser = (updates: Partial<User>) => setCurrentUser(prev => ({ ...prev, ...updates }));
  const addMessage = useCallback((msg: Message) => setMessages(prev => [...prev, msg]), []);
  const updateMessage = useCallback((id: string, updates: Partial<Message>) => setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m)), []);
  const markAsRead = useCallback((targetId: string) => {
    setMessages(prev => prev.map(m => (m.senderId === targetId && m.receiverId === currentUser.id && !m.read) ? { ...m, read: true } : m));
  }, [currentUser.id]);

  const addFriend = (phone: string) => {
    if (friendsList.find(f => f.phone === phone)) return false;
    const newUser: User = { id: `new_${Date.now()}`, name: `用户 ${phone.slice(-4)}`, avatar: `https://picsum.photos/seed/${phone}/200/200`, phone, wxid: `wx_${phone}` };
    setFriendsList(prev => [...prev, newUser]);
    return true;
  };

  const deleteFriend = (id: string) => setFriendsList(prev => prev.filter(f => f.id !== id));
  const updateFriendRemark = (id: string, remark: string) => setFriendsList(prev => prev.map(f => f.id === id ? { ...f, remark } : f));

  const addPost = useCallback((content: string, images: string[]) => {
    const newPostId = `p_${Date.now()}`;
    const newPost: Post = { id: newPostId, authorId: currentUser.id, content, images, likes: [], comments: [], timestamp: Date.now() };
    setPosts(prev => [newPost, ...prev]);
    simulateFeedback(newPostId, content);
  }, [currentUser.id, simulateFeedback]);

  const refreshMoments = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (prefetchPool.current.length > 0) {
      const sourceData = prefetchPool.current.shift()!;
      const newPost: Post = {
          id: `p_fast_${Date.now()}`,
          authorId: sourceData.authorId,
          content: sourceData.text,
          images: sourceData.imgCount > 0 ? [`https://loremflickr.com/400/400?random=${Date.now()}`] : [],
          likes: [],
          comments: [],
          timestamp: Date.now()
      };
      setPosts(prev => [newPost, ...prev]);
    }
    fillPrefetchPool();
  }, [friendsList]);

  const toggleLike = (postId: string) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes.includes(currentUser.id) ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id] } : p));
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
      let sessionId = groups.find(g => g.id === msg.receiverId)?.id || (msg.senderId === currentUser.id ? msg.receiverId : msg.senderId);
      const type = groups.find(g => g.id === sessionId) ? 'group' : 'user';
      if (!sessions[sessionId]) {
          const g = groups.find(g => g.id === sessionId);
          const f = friendsList.find(f => f.id === sessionId);
          if (g || f) sessions[sessionId] = { id: sessionId, type: type as any, name: g ? g.name : (f?.remark || f?.name || ''), avatar: g ? g.avatar : (f?.avatar || ''), lastMessage: null, unreadCount: 0 };
      }
      const session = sessions[sessionId];
      if (session) {
          if (!session.lastMessage || msg.timestamp > session.lastMessage.timestamp) session.lastMessage = msg;
          if (!msg.read && ((session.type === 'user' && msg.receiverId === currentUser.id) || (session.type === 'group' && msg.senderId !== currentUser.id))) session.unreadCount++;
      }
    });
    return Object.values(sessions).sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
  }, [messages, friendsList, groups, currentUser.id]);

  const getUser = useCallback((id: string) => id === currentUser.id ? currentUser : friendsList.find(u => u.id === id), [friendsList, currentUser]);
  const t = useCallback((key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[language][key] || key, [language]);

  return (
    <StoreContext.Provider value={{
      currentUser, friends: friendsList, groups, messages, posts, notifications, language, setLanguage,
      updateCurrentUser, addMessage, updateMessage, markAsRead, addFriend,
      deleteFriend, updateFriendRemark, addPost, refreshMoments, toggleLike, addComment,
      markNotificationsAsRead: () => {}, getChatHistory, getChatSessions, getUser, t
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
