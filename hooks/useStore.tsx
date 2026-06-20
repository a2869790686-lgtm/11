
import { useState, useEffect, useCallback, createContext, useContext, ReactNode, useRef } from 'react';
import { User, Message, Post, ChatSession, Comment, Group, Notification, CustomFriendData } from '../types';
import { INITIAL_FRIENDS, MOCK_POSTS_INITIAL, CURRENT_USER, MOCK_GROUPS, TRANSLATIONS, GENERATE_INITIAL_MESSAGES } from '../constants';

const MALE_LEADS = ['charlie_su', 'sariel_qi', 'osborn_xiao', 'evan_lu', 'jesse_xia'];

interface StoreContextType {
  currentUser: User;
  friends: User[];
  groups: Group[];
  messages: Message[];
  posts: Post[];
  notifications: Notification[];
  stickyChatIds: string[];
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
  toggleStickyChat: (id: string) => void;
  markNotificationsAsRead: () => void;
  getChatHistory: (id: string, isGroup?: boolean) => Message[];
  getChatSessions: () => ChatSession[];
  getUser: (id: string) => User | undefined;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

const DEEPSEEK_PERSONAS: Record<string, string> = {
  charlie_su: "你是查理苏，顶级豪门医生，极其自恋。叫对方‘未婚妻’，语气华丽自信且宠溺。",
  sariel_qi: "你是齐司礼，高冷毒舌的设计师。叫对方‘笨鸟’，语气严厉但藏着关心。",
  osborn_xiao: "你是萧逸，赛车手。叫对方‘小朋友’，性格直球酷帅。",
  evan_lu: "你是陆沉，优雅腹黑的CEO。叫对方‘我的女孩’，温柔却有掌控感。",
  jesse_xia: "你是夏鸣星，阳光活泼的演员。叫对方‘大小姐’，元气撒娇。",
  npc_mom: "你是一位典型的中国老妈。爱操心，爱发🍎🌹表情。话题离不开吃饭穿衣相亲。",
  npc_boss: "你是张老板。说话干练，口头禅：‘尽快’、‘汇报’、‘明天开会’。",
  npc_qiqi: "你是闺蜜琪琪。性格活泼，爱用网络热词（绝绝子、尊嘟假嘟）。",
  npc_landlord: "你是房东李姐。说话很冲，只关心房租和水电费。"
};

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => JSON.parse(localStorage.getItem('wx_current_user') || JSON.stringify(CURRENT_USER)));
  const [language, setLanguage] = useState<'en' | 'zh'>(() => (localStorage.getItem('wx_language') as 'en' | 'zh') || 'zh');
  const [friendsList, setFriendsList] = useState<User[]>(() => JSON.parse(localStorage.getItem('wx_friends') || JSON.stringify(INITIAL_FRIENDS)));
  const [messages, setMessages] = useState<Message[]>(() => JSON.parse(localStorage.getItem('wx_messages') || JSON.stringify(GENERATE_INITIAL_MESSAGES())));
  const [posts, setPosts] = useState<Post[]>(() => JSON.parse(localStorage.getItem('wx_posts') || JSON.stringify(MOCK_POSTS_INITIAL)));
  const [notifications, setNotifications] = useState<Notification[]>(() => JSON.parse(localStorage.getItem('wx_notifications') || '[]'));
  const [stickyChatIds, setStickyChatIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('wx_sticky_chats');
    return saved ? JSON.parse(saved) : MALE_LEADS;
  });
  
  const [friendsPersonas, setFriendsPersonas] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('wx_friend_personas');
    return saved ? JSON.parse(saved) : {};
  });

  const refreshCount = useRef(0);

  useEffect(() => localStorage.setItem('wx_current_user', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('wx_friends', JSON.stringify(friendsList)), [friendsList]);
  useEffect(() => localStorage.setItem('wx_messages', JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem('wx_posts', JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem('wx_notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem('wx_sticky_chats', JSON.stringify(stickyChatIds)), [stickyChatIds]);
  useEffect(() => localStorage.setItem('wx_friend_personas', JSON.stringify(friendsPersonas)), [friendsPersonas]);

  // 原生 DeepSeek API 调用架构
  const callAi = async (persona: string, userInput: string, context: string) => {
    const apiKey = localStorage.getItem('wx_deepseek_api_key') || process.env.API_KEY; 
    if (!apiKey || apiKey === 'undefined' || apiKey === "") return "（对方正在忙...）";
    
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
            {
              role: "system",
              content: `你正在微信中扮演一个角色。\n设定：${persona}\n背景：${context}\n要求：极其口语化，像真人回复。不要包含AI助手痕迹。回复限25字内。符合中国社交习惯。`
            },
            {
              role: "user",
              content: userInput
            }
          ],
          temperature: 1.2
        })
      });

      const data = await response.json();
      return data.choices[0].message.content.trim() || "嗯？";
    } catch (e) { 
      console.error("DeepSeek API Error:", e);
      return "（网络信号弱...）"; 
    }
  };

  const getPersona = useCallback((id: string) => {
    return friendsPersonas[id] || DEEPSEEK_PERSONAS[id] || null;
  }, [friendsPersonas]);

  const addPost = useCallback((content: string, images: string[]) => {
    const newId = `p_me_${Date.now()}`;
    const newPost: Post = { id: newId, authorId: currentUser.id, content, images, likes: [], comments: [], timestamp: Date.now() };
    setPosts(prev => [newPost, ...prev]);
    
    const shuffledFriends = [...friendsList].sort(() => 0.5 - Math.random());
    const likeCount = Math.floor(Math.random() * 6) + 10;
    const likers = shuffledFriends.slice(0, likeCount);
    
    likers.forEach((f, idx) => {
      setTimeout(() => {
        setPosts(prev => prev.map(p => p.id === newId ? { ...p, likes: [...new Set([...p.likes, f.id])] } : p));
        setNotifications(prev => [{
          id: `notif_l_${f.id}_${Date.now()}`, type: 'like', userId: f.id, userName: f.name, userAvatar: f.avatar, postId: newId, timestamp: Date.now(), read: false
        }, ...prev]);
      }, (idx + 1) * (1000 + Math.random() * 2000));
    });

    const commentCount = Math.floor(Math.random() * 3) + 6;
    const commenters = shuffledFriends.slice(likeCount, likeCount + commentCount);
    
    commenters.forEach((f, idx) => {
      setTimeout(async () => {
        const persona = getPersona(f.id) || `你是${f.name}，一个真实的微信好友。`;
        const reply = await callAi(persona, content, "我的好友发了朋友圈动态，我要去评论。");
        const newComment: Comment = { id: `c_auto_${f.id}_${Date.now()}`, userId: f.id, userName: f.name, content: reply, timestamp: Date.now() };
        setPosts(prev => prev.map(p => p.id === newId ? { ...p, comments: [...p.comments, newComment] } : p));
        setNotifications(prev => [{
          id: `notif_c_${f.id}_${Date.now()}`, type: 'comment', userId: f.id, userName: f.name, userAvatar: f.avatar, postId: newId, content: reply, timestamp: Date.now(), read: false
        }, ...prev]);
      }, (idx + 1) * (5000 + Math.random() * 5000));
    });
  }, [currentUser, friendsList]);

  const refreshMoments = useCallback(async () => {
    refreshCount.current += 1;
    let luckyFriend: User;
    if (refreshCount.current >= (3 + Math.floor(Math.random() * 3))) {
      luckyFriend = friendsList.find(f => MALE_LEADS.includes(f.id)) || friendsList[0];
      refreshCount.current = 0;
    } else {
      luckyFriend = friendsList[Math.floor(Math.random() * friendsList.length)];
    }

    const persona = getPersona(luckyFriend.id) || `你是${luckyFriend.name}。`;
    const content = await callAi(persona, "发一条性格极其鲜明的朋友圈动态，不要描述图片，像真人发动态一样。", "朋友圈");
    
    const newPost: Post = {
      id: `p_ds_${Date.now()}`, authorId: luckyFriend.id, content,
      images: MALE_LEADS.includes(luckyFriend.id) ? [] : [`https://loremflickr.com/400/300/life?lock=${Date.now() % 1000}`],
      likes: [], comments: [], timestamp: Date.now()
    };
    setPosts(prev => [newPost, ...prev]);
  }, [friendsList]);

  const addComment = useCallback((postId: string, content: string) => {
    const newComment: Comment = { id: `c_me_${Date.now()}`, userId: currentUser.id, userName: currentUser.name, content, timestamp: Date.now() };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    
    const post = posts.find(p => p.id === postId);
    if (post) {
      const author = friendsList.find(f => f.id === post.authorId);
      if (author) {
        setTimeout(async () => {
          const reply = await callAi(getPersona(author.id) || `你是${author.name}`, content, `朋友圈回评：你的朋友圈是“${post.content}”，对方评论了“${content}”。`);
          const replyComment: Comment = { id: `cr_${Date.now()}`, userId: author.id, userName: author.name, content: reply, timestamp: Date.now() };
          setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, replyComment] } : p));
        }, 8000 + Math.random() * 10000);
      }
    }
  }, [currentUser, friendsList, posts]);

  const callAiDirect = async (prompt: string) => {
    const apiKey = localStorage.getItem('wx_deepseek_api_key') || process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === "") return null;
    try {
      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], temperature: 1.3 })
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (e) { return null; }
  };

  const addRandomFriend = useCallback(async (): Promise<User> => {
    const prompt = "\u968f\u673a\u751f\u6210\u4e00\u4e2a\u865a\u62df\u5fae\u4fe1\u597d\u53cb\u7684\u8eab\u4efd\uff0c\u8bf7\u4ee5JSON\u683c\u5f0f\u8f93\u51fa\uff1a\\n{\\n  \"name\": \"\u59d3\u540d\uff08\u4e2d\u6587\uff09\",\\n  \"gender\": \"male|female\",\\n  \"identity\": \"\u804c\u4e1a/\u8eab\u4efd\",\\n  \"personality\": \"\u6027\u683c\u63cf\u8ff0\uff0c50\u5b57\u4ee5\u5185\",\\n  \"speaking\": \"\u8bf4\u8bdd\u98ce\u683c\u63cf\u8ff0\uff0c30\u5b57\u4ee5\u5185\",\\n  \"wxid\": \"\u82f1\u6587\u5fae\u4fe1\u53f7\",\\n  \"signature\": \"\u4e2a\u6027\u7b7e\u540d\"," +
    "\\n  \"avatarSeed\": \"\u5934\u50cf\u79cd\u5b50\uff08\u82f1\u6587\u5355\u8bcd\uff09\"\\n}\\n\u4ec5\u8f93\u51faJSON\uff0c\u4e0d\u8981\u5176\u4ed6\u6587\u5b57\u3002";
    const jsonStr = await callAiDirect(prompt);
    let data: any = {};
    try { data = jsonStr ? JSON.parse(jsonStr) : {}; } catch(e) {
      const match = jsonStr?.match(/\\{[\\s\\S]*\\}/);
      if (match) try { data = JSON.parse(match[0]); } catch(e2) {}
    }
    const name = data.name || "\u65b0\u670b\u53cb";
    const friendId = "gen_" + Date.now();
    const newUser: User = {
      id: friendId, name: name, avatar: data.avatarSeed ? `https://picsum.photos/seed/${data.avatarSeed}/200/200` : `https://picsum.photos/seed/${Math.random()}/200/200`,
      phone: "1" + Math.floor(Math.random() * 10000000000).toString().padStart(10, "0"),
      wxid: data.wxid || ("wx_" + Math.random().toString(36).slice(2, 8)),
      signature: data.signature || "",
    };
    const personaText = (data.personality || "") + "\u3002" + (data.speaking || "");
    const fullPersona = `${name}，${data.identity || "\u666e\u901a\u4eba"}\u3002${personaText}\u3002\u5bf9\u5f85\u597d\u53cb\u7684\u6001\u5ea6\uff1a`;
    setFriendsPersonas(prev => ({ ...prev, [friendId]: fullPersona }));
    setFriendsList(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const addCustomFriend = useCallback(async (data: CustomFriendData): Promise<User> => {
    const friendId = "cus_" + Date.now();
    const prompt = `\u4e3a\u5fae\u4fe1\u597d\u53cb\u751f\u6210\u4e00\u6bb5\u4eba\u8bbe\u63cf\u8ff0\uff0c\u7528\u4e8eAI\u804a\u5929\u89d2\u8272\u626e\u6f14\u3002\\n\u59d3\u540d\uff1a${data.name}\\n\u6027\u522b\uff1a${data.gender}\\n\u8eab\u4efd\uff1a${data.identity}\\n\u8bf4\u8bdd\u98ce\u683c\uff1a${data.speakingStyle}\\n\u8bf7\u751f\u621040-80\u5b57\u7684\u4eba\u8bbe\u63cf\u8ff0\uff0c\u5305\u542b\u5177\u4f53\u7684\u8bed\u6c14\u3001\u4e60\u60ef\u7528\u8bed\u3001\u5bf9\u5f85\u597d\u53cb\u7684\u6001\u5ea6\u3002`;
    const personaText = await callAiDirect(prompt);
    const avatar = data.avatar || `https://picsum.photos/seed/${Date.now()}/200/200`;
    const newUser: User = {
      id: friendId, name: data.name, avatar: avatar,
      phone: "1" + Math.floor(Math.random() * 10000000000).toString().padStart(10, "0"),
      wxid: data.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + Math.random().toString(36).slice(2, 5),
      signature: "",
    };
    const fullPersona = personaText || `${data.name}，${data.identity}。${data.speakingStyle}。`;
    setFriendsPersonas(prev => ({ ...prev, [friendId]: fullPersona }));
    setFriendsList(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const toggleStickyChat = useCallback((id: string) => {
    setStickyChatIds(prev => {
      if (prev.includes(id)) return prev.filter(sid => sid !== id);
      return [id, ...prev];
    });
  }, []);

  const getChatSessions = useCallback(() => {
    const sessions: Record<string, ChatSession> = {};
    friendsList.forEach(f => { sessions[f.id] = { id: f.id, type: 'user', name: f.remark || f.name, avatar: f.avatar, lastMessage: null, unreadCount: 0 }; });
    
    messages.forEach(msg => {
      const sid = (msg.senderId === currentUser.id ? msg.receiverId : msg.senderId);
      const session = sessions[sid];
      if (session) {
        if (!session.lastMessage || msg.timestamp > session.lastMessage.timestamp) session.lastMessage = msg;
        if (!msg.read && msg.receiverId === currentUser.id) session.unreadCount++;
      }
    });

    return Object.values(sessions).sort((a, b) => {
      const aSticky = stickyChatIds.includes(a.id) ? 1 : 0;
      const bSticky = stickyChatIds.includes(b.id) ? 1 : 0;
      if (aSticky !== bSticky) return bSticky - aSticky;
      if (a.unreadCount !== b.unreadCount) return b.unreadCount > 0 ? -1 : 1;
      return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
    });
  }, [messages, friendsList, currentUser.id, stickyChatIds]);

  const markAsRead = (id: string) => setMessages(prev => prev.map(m => (m.senderId === id && m.receiverId === currentUser.id) ? { ...m, read: true } : m));
  const toggleLike = (postId: string) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes.includes(currentUser.id) ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id] } : p));
  const getChatHistory = (targetId: string) => messages.filter(m => (m.senderId === currentUser.id && m.receiverId === targetId) || (m.senderId === targetId && m.receiverId === currentUser.id)).sort((a, b) => a.timestamp - b.timestamp);
  const getUser = (id: string) => id === currentUser.id ? currentUser : friendsList.find(u => u.id === id);
  const t = (key: any) => TRANSLATIONS[language][key] || key;

  return (
    <StoreContext.Provider value={{
      currentUser, friends: friendsList, groups: MOCK_GROUPS, messages, posts, notifications, language, setLanguage,
      stickyChatIds, updateCurrentUser: (u) => setCurrentUser(prev => ({...prev, ...u})), addMessage: (m) => setMessages(prev => [m, ...prev]),
      updateMessage: (id, u) => setMessages(prev => prev.map(m => m.id === id ? {...m, ...u} : m)), markAsRead,
      addFriend: (p) => { const n: User = {id: `n_${Date.now()}`, name: `用户 ${p.slice(-4)}`, avatar: `https://picsum.photos/seed/${p}/200/200`, phone: p, wxid: `wx_${p}`}; setFriendsList(prev => [...prev, n]); return true; },
      deleteFriend: (id) => setFriendsList(prev => prev.filter(f => f.id !== id)), updateFriendRemark: (id, r) => setFriendsList(prev => prev.map(f => f.id === id ? {...f, remark: r} : f)),
      callAi, getPersona, addRandomFriend, addCustomFriend, addPost, refreshMoments, toggleLike, addComment, toggleStickyChat, markNotificationsAsRead: () => setNotifications(prev => prev.map(n => ({...n, read: true}))),
      getChatHistory, getChatSessions, getUser, t
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore error");
  return context;
};
