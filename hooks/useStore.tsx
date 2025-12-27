
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

  // --- 真实互动算法：有间隔的点赞和评论 ---
  const simulateOrganicFeedback = useCallback(async (postId: string, postContent: string) => {
    const apiKey = process.env.API_KEY;
    
    // 1. 男主们有间隔地互动
    MALE_LEADS.forEach((leadId, index) => {
        const lead = friendsList.find(f => f.id === leadId);
        if (!lead) return;

        // 随机延迟：5s 到 45s 之间，且每个人有间隔
        const likeDelay = 2000 + (index * 5000) + Math.random() * 5000;
        const commentDelay = likeDelay + 8000 + Math.random() * 10000;

        // 执行点赞
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
        }, likeDelay);

        // 执行评论 (如果有API KEY)
        if (apiKey && apiKey !== 'undefined') {
            setTimeout(async () => {
                const leadPrompts: Record<string, string> = {
                    charlie_su: "你是查理苏。自恋自信，称呼玩家为未婚妻。",
                    sariel_qi: "你是齐司礼。高冷毒舌，称呼玩家为笨鸟。",
                    osborn_xiao: "你是萧逸。酷帅不羁，称呼玩家为小朋友。",
                    evan_lu: "你是陆沉。优雅深情，称呼玩家为我的女孩。",
                    jesse_xia: "你是夏鸣星。元气阳光，称呼玩家为大小姐。"
                };

                try {
                    const response = await fetch("https://api.deepseek.com/chat/completions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                        body: JSON.stringify({
                            model: "deepseek-chat",
                            messages: [
                                { role: "system", content: leadPrompts[leadId] + "请对朋友圈发一条15字以内的评论，语气要符合人设。" },
                                { role: "user", content: `朋友圈内容: ${postContent}` }
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
                } catch (e) { console.error(e); }
            }, commentDelay);
        }
    });

    // 2. 普通好友随机凑热闹 (20%概率)
    const normalFriends = friendsList.filter(f => !MALE_LEADS.includes(f.id));
    normalFriends.forEach(f => {
        if (Math.random() < 0.15) {
            setTimeout(() => {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: [...new Set([...p.likes, f.id])] } : p));
            }, 15000 + Math.random() * 60000);
        }
    });
  }, [friendsList]);

  // --- 刷新朋友圈：自动生成好友动态 ---
  const refreshMoments = useCallback(async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined') {
        await new Promise(r => setTimeout(r, 1000));
        return;
    }

    // 随机选一个男主发朋友圈
    const luckyLeadId = MALE_LEADS[Math.floor(Math.random() * MALE_LEADS.length)];
    const lead = friendsList.find(f => f.id === luckyLeadId);
    if (!lead) return;

    try {
        const leadThemes: Record<string, string> = {
            charlie_su: "医学研究、奢华生活、对完美事物的赞美",
            sariel_qi: "大自然景观、设计草图、冷淡的职场观察",
            osborn_xiao: "赛车轰鸣、深夜的城市街头、一份路边摊小吃",
            evan_lu: "古籍阅读、深夜的办公室灯光、一杯红茶",
            jesse_xia: "排练厅的汗水、童年的回忆、给粉丝的感谢"
        };

        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: `你是微信好友"${lead.name}"。请发一条朋友圈动态文案。主题关于：${leadThemes[luckyLeadId]}。字数20字左右，不要带表情。` }
                ]
            })
        });
        const data = await response.json();
        const content = data.choices[0].message.content.trim().replace(/^"|"$/g, '');

        const newPost: Post = {
            id: `p_refresh_${Date.now()}`,
            authorId: luckyLeadId,
            content: content,
            images: [`https://loremflickr.com/400/300/luxury,city?lock=${Date.now() % 100}`],
            likes: [],
            comments: [],
            timestamp: Date.now()
        };

        setPosts(prev => [newPost, ...prev]);
        // 男主互赞动态 (体现他们也互相认识)
        setTimeout(() => {
            const otherLead = MALE_LEADS.find(id => id !== luckyLeadId);
            if(otherLead) setPosts(prev => prev.map(p => p.id === newPost.id ? { ...p, likes: [otherLead] } : p));
        }, 5000);

    } catch (e) {
        console.error("Refresh Moments Error:", e);
    }
  }, [friendsList]);

  const addPost = useCallback((content: string, images: string[]) => {
    const newPostId = `p_me_${Date.now()}`;
    const newPost: Post = { id: newPostId, authorId: currentUser.id, content, images, likes: [], comments: [], timestamp: Date.now() };
    setPosts(prev => [newPost, ...prev]);
    simulateOrganicFeedback(newPostId, content);
  }, [currentUser.id, simulateOrganicFeedback]);

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
    friendsList.forEach(f => { sessions[f.id] = { id: f.id, type: 'user', name: f.remark || f.name, avatar: f.avatar, lastMessage: null, unreadCount: 0 }; });
    groups.forEach(g => { sessions[g.id] = { id: g.id, type: 'group', name: g.name, avatar: g.avatar, lastMessage: null, unreadCount: 0 }; });

    messages.forEach(msg => {
      let sessionId = groups.find(g => g.id === msg.receiverId)?.id || (msg.senderId === currentUser.id ? msg.receiverId : msg.senderId);
      const session = sessions[sessionId];
      if (session) {
          if (!session.lastMessage || msg.timestamp > session.lastMessage.timestamp) session.lastMessage = msg;
          if (!msg.read && ((session.type === 'user' && msg.receiverId === currentUser.id) || (session.type === 'group' && msg.senderId !== currentUser.id))) session.unreadCount++;
      }
    });

    return Object.values(sessions).sort((a, b) => {
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
