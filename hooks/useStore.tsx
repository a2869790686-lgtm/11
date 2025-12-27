
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Message, Post, ChatSession, Comment, Group, Notification } from '../types';
import { INITIAL_FRIENDS, MOCK_POSTS_INITIAL, CURRENT_USER, MOCK_MESSAGES, MOCK_GROUPS, TRANSLATIONS } from '../constants';

const MALE_LEADS = ['charlie_su', 'sariel_qi', 'osborn_xiao', 'evan_lu', 'jesse_xia'];

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

  useEffect(() => localStorage.setItem('wx_current_user', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('wx_friends', JSON.stringify(friendsList)), [friendsList]);
  useEffect(() => localStorage.setItem('wx_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('wx_posts', JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem('wx_notifications', JSON.stringify(notifications)), [notifications]);

  // --- 朋友圈反馈引擎：男主全员必定互动 ---
  const simulateMaleLeadFeedback = useCallback(async (postId: string, postContent: string) => {
    const apiKey = process.env.API_KEY;
    
    for (const leadId of MALE_LEADS) {
        const lead = friendsList.find(f => f.id === leadId);
        if (!lead) continue;

        // 1. 延迟点赞 (模拟浏览时间)
        setTimeout(() => {
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: [...new Set([...p.likes, leadId])] } : p));
            setNotifications(prev => [{
                id: `notif_l_${Date.now()}_${leadId}`,
                type: 'like',
                userId: leadId,
                userName: lead.name,
                userAvatar: lead.avatar,
                postId,
                timestamp: Date.now(),
                read: false
            }, ...prev]);
        }, 1000 + Math.random() * 2000);

        // 2. 延迟评论 (模拟打字时间)
        if (apiKey && apiKey !== 'undefined') {
            setTimeout(async () => {
                const leadPrompts: Record<string, string> = {
                    charlie_su: "你是查理苏，自恋华丽的医生，称玩家为未婚妻。",
                    sariel_qi: "你是齐司礼，高冷毒舌的设计师，称玩家为笨鸟。",
                    osborn_xiao: "你是萧逸，不羁帅气的赛车手，称玩家为小朋友。",
                    evan_lu: "你是陆沉，优雅腹黑的CEO，称玩家为我的女孩。",
                    jesse_xia: "你是夏鸣星，阳光活力的爱豆，称玩家为大小姐。"
                };

                try {
                    const response = await fetch("https://api.deepseek.com/chat/completions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                        body: JSON.stringify({
                            model: "deepseek-chat",
                            messages: [
                                { role: "system", content: leadPrompts[leadId] + " 请根据玩家的朋友圈内容，回一条15字以内的极简评论，一定要带上专属称呼。" },
                                { role: "user", content: postContent }
                            ]
                        })
                    });
                    const data = await response.json();
                    const text = data.choices[0].message.content.trim().replace(/^"|"$/g, '');
                    
                    const newComment: Comment = { id: `c_ai_${Date.now()}_${leadId}`, userId: leadId, userName: lead.name, content: text, timestamp: Date.now() };
                    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
                    setNotifications(prev => [{
                        id: `notif_c_${Date.now()}_${leadId}`,
                        type: 'comment',
                        userId: leadId,
                        userName: lead.name,
                        userAvatar: lead.avatar,
                        postId,
                        content: text,
                        timestamp: Date.now(),
                        read: false
                    }, ...prev]);
                } catch (e) {
                    console.error("Male Lead Reply Error:", e);
                }
            }, 4000 + Math.random() * 5000);
        }
    }
  }, [friendsList]);

  const addPost = useCallback((content: string, images: string[]) => {
    const newPostId = `p_${Date.now()}`;
    const newPost: Post = { id: newPostId, authorId: currentUser.id, content, images, likes: [], comments: [], timestamp: Date.now() };
    setPosts(prev => [newPost, ...prev]);
    simulateMaleLeadFeedback(newPostId, content);
  }, [currentUser.id, simulateMaleLeadFeedback]);

  const updateCurrentUser = (updates: Partial<User>) => setCurrentUser(prev => ({ ...prev, ...updates }));
  const addMessage = useCallback((msg: Message) => setMessages(prev => [msg, ...prev]), []);
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

  const refreshMoments = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, []);

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
    
    // 强制确保所有 INITIAL_FRIENDS 出现在列表里
    friendsList.forEach(f => {
        sessions[f.id] = { id: f.id, type: 'user', name: f.remark || f.name, avatar: f.avatar, lastMessage: null, unreadCount: 0 };
    });
    
    // 强制确保群聊在列表里
    groups.forEach(g => {
        sessions[g.id] = { id: g.id, type: 'group', name: g.name, avatar: g.avatar, lastMessage: null, unreadCount: 0 };
    });

    messages.forEach(msg => {
      let sessionId = groups.find(g => g.id === msg.receiverId)?.id || (msg.senderId === currentUser.id ? msg.receiverId : msg.senderId);
      const session = sessions[sessionId];
      if (session) {
          if (!session.lastMessage || msg.timestamp > session.lastMessage.timestamp) session.lastMessage = msg;
          if (!msg.read && ((session.type === 'user' && msg.receiverId === currentUser.id) || (session.type === 'group' && msg.senderId !== currentUser.id))) session.unreadCount++;
      }
    });

    return Object.values(sessions).sort((a, b) => {
        // 置顶逻辑：MALE_LEADS 始终排在最前
        const aLead = MALE_LEADS.includes(a.id) ? 1 : 0;
        const bLead = MALE_LEADS.includes(b.id) ? 1 : 0;
        if (aLead !== bLead) return bLead - aLead;
        
        return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
    });
  }, [messages, friendsList, groups, currentUser.id]);

  const getUser = useCallback((id: string) => id === currentUser.id ? currentUser : friendsList.find(u => u.id === id), [friendsList, currentUser]);
  const t = useCallback((key: keyof typeof TRANSLATIONS['en']) => TRANSLATIONS[language][key] || key, [language]);

  return (
    <StoreContext.Provider value={{
      currentUser, friends: friendsList, groups, messages, posts, notifications, language, setLanguage,
      updateCurrentUser, addMessage, updateMessage, markAsRead, addFriend,
      deleteFriend, updateFriendRemark, addPost, refreshMoments, toggleLike, addComment,
      markNotificationsAsRead: () => setNotifications(prev => prev.map(n => ({...n, read: true}))), 
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
