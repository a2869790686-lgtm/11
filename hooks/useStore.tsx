
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

  // --- 拟人化互动算法 ---
  const simulateOrganicFeedback = useCallback(async (postId: string, postContent: string) => {
    const apiKey = process.env.API_KEY;
    
    friendsList.forEach((f, index) => {
        const isLead = MALE_LEADS.includes(f.id);
        const prob = isLead ? 0.95 : 0.15; // 男主几乎必点赞，普通人偶发

        if (Math.random() > prob) return;

        // 延迟时间分布在 10s 到 120s 之间
        const delay = 10000 + (Math.random() * 110000);

        setTimeout(() => {
            setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: [...new Set([...p.likes, f.id])] } : p));
            setNotifications(prev => [{
                id: `notif_l_${Date.now()}_${f.id}`,
                type: 'like',
                userId: f.id,
                userName: f.name,
                userAvatar: f.avatar,
                postId,
                timestamp: Date.now(),
                read: false
            }, ...prev]);
        }, delay);

        // 如果有API KEY且是男主，尝试写一段更有趣的评论
        if (apiKey && apiKey !== 'undefined' && isLead) {
            const commentDelay = delay + 15000 + Math.random() * 30000;
            setTimeout(async () => {
                const leadPrompts: Record<string, string> = {
                    charlie_su: "你是查理苏。自恋自信，称呼玩家为未婚妻。经常谈论旷世奇作。",
                    sariel_qi: "你是齐司礼。高冷毒舌，称呼玩家为笨鸟。内心其实很关切。",
                    osborn_xiao: "你是萧逸。酷帅不羁，称呼玩家为小朋友。喜欢说带她去飙车。",
                    evan_lu: "你是陆沉。优雅腹黑，称呼玩家为我的女孩。",
                    jesse_xia: "你是夏鸣星。元气阳光，称呼玩家为大小姐。常怀念童年。"
                };

                try {
                    const response = await fetch("https://api.deepseek.com/chat/completions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                        body: JSON.stringify({
                            model: "deepseek-chat",
                            messages: [
                                { role: "system", content: leadPrompts[f.id] + "请回复该朋友圈一条15字以内的评论，语气要极其符合人设。" },
                                { role: "user", content: `朋友圈内容: ${postContent}` }
                            ]
                        })
                    });
                    const data = await response.json();
                    const text = data.choices[0].message.content.trim().replace(/^"|"$/g, '');
                    
                    const newComment: Comment = { id: `c_ai_${Date.now()}_${f.id}`, userId: f.id, userName: f.name, content: text, timestamp: Date.now() };
                    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
                    setNotifications(prev => [{
                        id: `notif_c_${Date.now()}_${f.id}`,
                        type: 'comment',
                        userId: f.id,
                        userName: f.name,
                        userAvatar: f.avatar,
                        postId,
                        content: text,
                        timestamp: Date.now(),
                        read: false
                    }, ...prev]);
                } catch (e) { console.error(e); }
            }, commentDelay);
        }
    });
  }, [friendsList]);

  // --- 朋友圈内容刷新系统 ---
  const refreshMoments = useCallback(async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined') {
        await new Promise(r => setTimeout(r, 1000));
        return;
    }

    // 随机挑选一个好友
    const luckyFriend = friendsList[Math.floor(Math.random() * friendsList.length)];
    const isLead = MALE_LEADS.includes(luckyFriend.id);

    try {
        const leadThemes: Record<string, string> = {
            charlie_su: "医学、奢侈生活、完美设计",
            sariel_qi: "设计灵感、严苛要求、静谧景观",
            osborn_xiao: "赛道激情、街头、信任与默契",
            evan_lu: "咖啡、书籍、夜间的写字楼、权利与掌控",
            jesse_xia: "舞台排练、青梅竹马、夕阳下的奔跑"
        };

        const systemInstruction = isLead 
            ? `你是微信好友"${luckyFriend.name}"。请发一条朋友圈动态。关于：${leadThemes[luckyFriend.id]}。字数20字左右，符合人设。`
            : `你是普通微信好友"${luckyFriend.name}"。请发一条接地气的、口语化的、生活气息浓厚的朋友圈动态。如果是微商就发广告，如果是长辈就发养生或正能量。`;

        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "system", content: systemInstruction }]
            })
        });
        const data = await response.json();
        const content = data.choices[0].message.content.trim().replace(/^"|"$/g, '');

        const newPost: Post = {
            id: `p_refresh_${Date.now()}`,
            authorId: luckyFriend.id,
            content: content,
            images: [`https://loremflickr.com/400/300/lifestyle?lock=${Date.now() % 500}`],
            likes: [],
            comments: [],
            timestamp: Date.now()
        };

        setPosts(prev => [newPost, ...prev]);

        // 随机增加一些点赞
        setTimeout(() => {
            const voter = friendsList[Math.floor(Math.random() * friendsList.length)];
            if (voter.id !== luckyFriend.id) {
                setPosts(prev => prev.map(p => p.id === newPost.id ? { ...p, likes: [...new Set([...p.likes, voter.id])] } : p));
            }
        }, 15000);

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
    setMessages(prev => prev.map(m => {
        // 私聊
        if (m.senderId === targetId && m.receiverId === currentUser.id && !m.read) return { ...m, read: true };
        // 群聊：作为接收者时进入即视为已读
        if (m.receiverId === targetId && m.senderId !== currentUser.id && !m.read) return { ...m, read: true };
        return m;
    }));
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
          // 未读数逻辑：我不是发送者且未读
          if (!msg.read && ((session.type === 'user' && msg.receiverId === currentUser.id) || (session.type === 'group' && msg.senderId !== currentUser.id))) {
              session.unreadCount++;
          }
      }
    });

    return Object.values(sessions).sort((a, b) => {
        // 男主置顶排序，然后再按时间
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
