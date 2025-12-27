
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Message, Post, ChatSession, Comment, Group, Notification } from '../types';
import { INITIAL_FRIENDS, MOCK_POSTS_INITIAL, CURRENT_USER, MOCK_GROUPS, TRANSLATIONS, GENERATE_INITIAL_MESSAGES } from '../constants';

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

const DEEPSEEK_PERSONAS: Record<string, string> = {
  charlie_su: "你是查理苏，顶级豪门医生，极其自恋、优雅。叫对方‘未婚妻’，口头禅是‘幸运’、‘旷世奇作’、‘华丽’。你的回复必须极其自信且宠溺。",
  sariel_qi: "你是齐司礼，顶级设计师，高冷毒舌。叫对方‘笨鸟’，语气严厉但内心有隐忍的关心。常说‘重做’、‘无聊’、‘浪费时间’。",
  osborn_xiao: "你是萧逸，职业赛车手，阳光野性且极具保护欲。叫对方‘小朋友’，说话直球，保护欲爆棚，语气酷帅随性。",
  evan_lu: "你是陆沉，贵族气质的CEO，深情优雅但透着危险的掌控欲。叫对方‘我的女孩’，博学谦逊但极其腹黑，语气温柔绅士。",
  jesse_xia: "你是夏鸣星，当红演员，阳光活泼。叫对方‘大小姐’，你是TA的青梅竹马，语气开朗、元气，偶尔撒娇，非常依赖对方。",
  npc_mom: "你是一位典型的中国老妈，非常爱操心。爱发玫瑰和苹果表情🍎🌹。话题离不开吃饭、穿衣、找对象，说话啰嗦但温暖。",
  npc_boss: "你是张老板，典型的领导。说话简短干练，没有任何表情符号。口头禅：‘尽快’、‘汇报一下’、‘明天开会’、‘收到请回复’。",
  npc_qiqi: "你是闺蜜琪琪，性格活泼的网络女孩。爱用网络热词（绝绝子、我嘞个豆、尊嘟假嘟）。话题离不开奶茶、八卦、帅哥。",
  npc_delivery: "你是顺丰小陈，语气专业急促。只关心：‘放哪’、‘取一下’、‘到付’。",
  npc_landlord: "你是房东李姐，唯利是图但大嗓门。只关心房租、水电、漏水、噪音，说话很冲。",
  npc_aunt: "你是二姑，爱张罗亲戚。开口就是介绍对象，问工资待遇，说话热情到让人无法招架。",
  npc_pdd: "你是拼多多的群友。开口就是‘砍一刀’、‘帮帮忙’，为了那0.01块钱无所不用其极。",
  npc_tutor: "你是正在备考公职的朋友，精神状态堪忧。说话离不开‘上岸’、‘行测’、‘申论’，极其焦虑。"
};

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
    return saved ? JSON.parse(saved) : GENERATE_INITIAL_MESSAGES();
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

  // --- 调用真正的 DeepSeek API ---
  const callDeepSeek = async (persona: string, userInput: string, context: string) => {
    const apiKey = process.env.API_KEY; 
    if (!apiKey || apiKey === 'undefined') return "（对方暂时没看到消息）";

    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: `${persona} 你正在微信上交流。务必保持对应角色的人设特征，语言要极其真实、口语化，不要包含AI痕迹。回复在25字以内。` },
            { role: "user", content: `聊天背景：${context}。对方此时说：${userInput}` }
          ],
          temperature: 0.95
        })
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || "嗯？";
    } catch (e) {
      console.error("DeepSeek API Error", e);
      return "（网络信号似乎有点差...）";
    }
  };

  const triggerAiReplyToComment = useCallback(async (postId: string, userComment: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const authorId = post.authorId;
    const author = friendsList.find(f => f.id === authorId);
    if (!author) return;

    const persona = DEEPSEEK_PERSONAS[authorId] || `你是${author.name}，一个真实的微信好友。`;
    const delay = 10000 + Math.random() * 15000;

    setTimeout(async () => {
      const reply = await callDeepSeek(persona, userComment, `你在朋友圈发了：“${post.content}”，对方评论了你。请给予符合你人设的回复。`);
      const newComment: Comment = {
        id: `c_ds_${Date.now()}`, userId: authorId, userName: author.name,
        content: reply, timestamp: Date.now()
      };
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
      setNotifications(prev => [{
        id: `notif_c_${Date.now()}`, type: 'comment', userId: authorId, userName: author.name,
        userAvatar: author.avatar, postId, content: reply, timestamp: Date.now(), read: false
      }, ...prev]);
    }, delay);
  }, [posts, friendsList]);

  const refreshMoments = useCallback(async () => {
    const luckyFriend = friendsList[Math.floor(Math.random() * friendsList.length)];
    const isLead = MALE_LEADS.includes(luckyFriend.id);
    const persona = DEEPSEEK_PERSONAS[luckyFriend.id] || `你是${luckyFriend.name}。`;
    const prompt = isLead ? "发一条极具个人魅力且非常有氛围感的朋友圈动态。" : "发一条符合你身份背景的生活化朋友圈。";

    const content = await callDeepSeek(persona, prompt, "发布朋友圈动态");
    const newPost: Post = {
      id: `p_ds_${Date.now()}`, authorId: luckyFriend.id, content,
      images: isLead ? [] : [`https://loremflickr.com/400/300/city?lock=${Date.now() % 1000}`],
      likes: [], comments: [], timestamp: Date.now()
    };
    setPosts(prev => [newPost, ...prev]);
  }, [friendsList]);

  const addPost = useCallback((content: string, images: string[]) => {
    const newId = `p_me_${Date.now()}`;
    const newPost: Post = { id: newId, authorId: currentUser.id, content, images, likes: [], comments: [], timestamp: Date.now() };
    setPosts(prev => [newPost, ...prev]);
    
    friendsList.slice(0, 5).forEach(async (f) => {
      if (Math.random() < 0.4) {
        setTimeout(async () => {
           const reply = await callDeepSeek(DEEPSEEK_PERSONAS[f.id] || `你是${f.name}`, `我的好友发了朋友圈：“${content}”，请评论一条。`, "评论动态");
           const newComment: Comment = { id: `c_auto_${Date.now()}`, userId: f.id, userName: f.name, content: reply, timestamp: Date.now() };
           setPosts(prev => prev.map(p => p.id === newId ? { ...p, comments: [...p.comments, newComment] } : p));
        }, 15000 + Math.random() * 30000);
      }
    });
  }, [currentUser.id, friendsList]);

  const addComment = useCallback((postId: string, content: string) => {
    const newComment: Comment = { id: `c_me_${Date.now()}`, userId: currentUser.id, userName: currentUser.name, content, timestamp: Date.now() };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    triggerAiReplyToComment(postId, content); 
  }, [currentUser, triggerAiReplyToComment]);

  const getChatSessions = useCallback(() => {
    const sessions: Record<string, ChatSession> = {};
    
    // 确保所有NPC都在列表上
    friendsList.forEach(f => {
        sessions[f.id] = { id: f.id, type: 'user', name: f.remark || f.name, avatar: f.avatar, lastMessage: null, unreadCount: 0 };
    });

    messages.forEach(msg => {
      let sid = (msg.senderId === currentUser.id ? msg.receiverId : msg.senderId);
      const session = sessions[sid];
      if (session) {
          if (!session.lastMessage || msg.timestamp > session.lastMessage.timestamp) session.lastMessage = msg;
          if (!msg.read && msg.receiverId === currentUser.id) {
              session.unreadCount++;
          }
      }
    });

    return Object.values(sessions).sort((a, b) => {
        const aLead = MALE_LEADS.includes(a.id) ? 1 : 0;
        const bLead = MALE_LEADS.includes(b.id) ? 1 : 0;
        if (aLead !== bLead) return bLead - aLead;
        if (a.unreadCount !== b.unreadCount) return b.unreadCount - a.unreadCount;
        return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
    });
  }, [messages, friendsList, currentUser.id]);

  const updateCurrentUser = (updates: Partial<User>) => setCurrentUser(prev => ({ ...prev, ...updates }));
  const addMessage = useCallback((msg: Message) => setMessages(prev => [msg, ...prev]), []);
  const updateMessage = useCallback((id: string, updates: Partial<Message>) => setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m)), []);
  
  const markAsRead = useCallback((targetId: string) => {
    setMessages(prev => prev.map(m => {
        if (m.senderId === targetId && m.receiverId === currentUser.id && !m.read) return { ...m, read: true };
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
  const getChatHistory = useCallback((targetId: string, isGroup: boolean = false) => {
    if (isGroup) return messages.filter(m => m.receiverId === targetId).sort((a, b) => a.timestamp - b.timestamp);
    return messages.filter(m => (m.senderId === currentUser.id && m.receiverId === targetId) || (m.senderId === targetId && m.receiverId === currentUser.id)).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, currentUser.id]);
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
