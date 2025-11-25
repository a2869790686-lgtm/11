

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Message, Post, ChatSession, Comment, Group, Notification } from '../types';
import { INITIAL_FRIENDS, MOCK_POSTS_INITIAL, CURRENT_USER, MOCK_MESSAGES, MOCK_GROUPS } from '../constants';

interface StoreContextType {
  currentUser: User;
  friends: User[];
  groups: Group[];
  messages: Message[];
  posts: Post[];
  notifications: Notification[];
  updateCurrentUser: (updates: Partial<User>) => void;
  addMessage: (msg: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  markAsRead: (id: string) => void;
  addFriend: (phone: string) => boolean;
  deleteFriend: (id: string) => void;
  addPost: (content: string, images: string[]) => void;
  refreshMoments: () => Promise<void>;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  getChatHistory: (id: string, isGroup?: boolean) => Message[];
  getChatSessions: () => ChatSession[];
  getUser: (id: string) => User | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

// --- CONTENT GENERATOR ENGINE ---

const TOPICS = {
    WORK: {
        keywords: ['office', 'meeting', 'laptop', 'coffee', 'code'],
        texts: [
            "凌晨两点的办公室，见过吗？又是通宵发布版本的一天。加油打工人！💪",
            "刚结束这周的第三个大项目，累并快乐着。Team building走起！🍻",
            "客户终于确认方案了，这杯咖啡太甜了。☕️",
            "又是KPI考核周，压力山大... 求安慰 🤯",
            "出差中... 高铁上的风景其实也不错。🚅",
            "为了梦想努力奋斗，Talk is cheap, show me the result. 🚀",
            "周五了！把手头的工作做完，准备迎接周末！🎉",
            "现在的年轻人太卷了，我也不能落后啊。",
        ],
        comments: ["辛苦了！", "老板加鸡腿！", "注意身体啊", "太卷了太卷了", "大佬带带我", "Jiayou!", "Work hard, play hard!"]
    },
    FOOD: {
        keywords: ['food', 'hotpot', 'sushi', 'burger', 'steak', 'dimsum', 'noodle'],
        texts: [
            "这家火锅真的是绝绝子！排队两小时也值了！🍲😋",
            "这就是深夜放毒的快乐吗？减肥的事明天再说吧。🍕🍔",
            "自己动手的丰衣足食，今天的晚餐是红烧肉。👨‍🍳",
            "没有什么是一顿烧烤解决不了的，如果有，那就两顿。🍢🍺",
            "打卡网红甜品店，味道也就那样吧，拍照倒是挺好看的。🍰",
            "周末的早午餐，慵懒的时光。🍳☕️",
            "这也太好吃了吧！！强烈推荐给大家！",
            "家乡的味道，想家了。🍜",
        ],
        comments: ["求地址！", "看着就好吃", "分我一口", "大晚上的过分了啊", "看饿了...", "约起约起！", "Looks delicious!"]
    },
    TRAVEL: {
        keywords: ['beach', 'mountain', 'city', 'paris', 'tokyo', 'sunset', 'road'],
        texts: [
            "终于来到了心心念念的地方，这里的空气都是甜的。🌊🌴",
            "说走就走的旅行，下一站是哪里呢？✈️",
            "山顶的风景果然不一样，一览众山小。⛰️",
            "逃离城市计划，拥抱大自然。🏕️",
            "在这个陌生的城市街头漫步，感受不一样的烟火气。🌆",
            "日落跌进昭昭星野，人间忽晚，山河已秋。🌅",
            "旅行的意义大概就是在一个陌生的地方发现久违的感动。",
        ],
        comments: ["好美啊！", "羡慕了", "带我一起去！", "玩的开心！", "这是哪里呀？", "拍得真好！", "Amazing view!"]
    },
    OLDER_GEN: {
        keywords: ['flower', 'garden', 'tea', 'park', 'nature'],
        texts: [
            "早安！新的一天，愿你被世界温柔以待。🌺🌻🌹 [玫瑰][玫瑰]",
            "今天天气真好，去公园散散步，心情舒畅。☀️",
            "自己种的菜长出来了，纯天然无公害。🥬",
            "转发：一定要看！这几种食物千万不能一起吃！😱",
            "知足常乐，平平淡淡才是真。🍵",
            "今天是二十四节气，记得多穿衣服，保重身体。",
            "岁月静好。🙏",
        ],
        comments: ["早安！", "生活惬意", "向您学习", "身体健康最重要", "景色真不错", "👍👍👍"]
    },
    SALES: {
        keywords: ['house', 'apartment', 'product', 'sale', 'shopping'],
        texts: [
            "【急售】业主出国急售！低于市场价50万！这种好房哪里找？手慢无！🏠",
            "新品上市！现货秒发，数量有限，先到先得！💄💋",
            "不要等到涨价了再后悔，现在就是最好的上车机会！📈",
            "今日特价！全场五折起！错过再等一年！🛍️",
            "专业诚信，服务至上，有需要的随时联系我。",
            "恭喜王总喜提新房！感谢信任！🤝",
        ],
        comments: ["多少钱？", "私聊", "位置在哪里？", "恭喜恭喜", "还有货吗？", "看着不错"]
    },
    YOUTH: {
        keywords: ['concert', 'party', 'cat', 'dog', 'game', 'movie'],
        texts: [
            "emo了... 为什么周末过得这么快？☁️",
            "今天的穿搭，OOTD。👗",
            "我家主子太可爱了，忍不住想吸。🐱🐶",
            "看完这部电影，哭得稀里哗啦的。🎬😭",
            "今晚不醉不归！🍻🥂",
            "无语子，遇到个下头男/女... 🙄",
            "哈哈哈哈哈哈 xswl 😂",
            "Flag屹立不倒：明天开始减肥！",
        ],
        comments: ["抱抱", "好看！", "怎么了？", "求链接", "太真实了", "哈哈哈哈", "Cute!"]
    }
};

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // Load initial state from local storage or fallbacks
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('wx_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
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

  // Persist changes
  useEffect(() => {
    localStorage.setItem('wx_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wx_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('wx_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('wx_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('wx_posts', JSON.stringify(posts));
  }, [posts]);

  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  }, []);

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
       
       if ((isGroupMsg || isDirectMsg) && !m.read) {
           return { ...m, read: true };
       }
       return m;
    }));
  }, [currentUser.id]);

  const addFriend = useCallback((phone: string) => {
    const exists = friends.find(f => f.phone === phone);
    if (exists) return false;

    const newUser: User = {
      id: `new_${Date.now()}`,
      name: `User ${phone.slice(-4)}`,
      avatar: `https://picsum.photos/seed/${phone}/200/200`,
      phone: phone,
      wxid: `wx_${phone}`
    };
    
    const greetingMsg: Message = {
      id: `sys_${Date.now()}`,
      senderId: newUser.id,
      receiverId: currentUser.id,
      content: 'I have accepted your friend request. Let\'s chat!',
      type: 'text',
      timestamp: Date.now(),
      read: false
    };

    setFriends(prev => [...prev, newUser].sort((a, b) => a.name.localeCompare(b.name)));
    setMessages(prev => [...prev, greetingMsg]);
    
    return true;
  }, [friends, currentUser.id]);

  const deleteFriend = useCallback((id: string) => {
    setFriends(prev => prev.filter(f => f.id !== id));
  }, []);

  // --- AUTO INTERACTION LOGIC ---
  const simulateInteractions = useCallback((postId: string, content: string) => {
      if (friends.length === 0) return;
      
      // Determine context
      const lowerContent = content.toLowerCase();
      let possibleComments = ["👍", "Nice!", "Great!"];
      
      if (lowerContent.includes('food') || lowerContent.includes('eat') || lowerContent.includes('delicious')) {
          possibleComments = TOPICS.FOOD.comments;
      } else if (lowerContent.includes('work') || lowerContent.includes('busy') || lowerContent.includes('tired')) {
          possibleComments = TOPICS.WORK.comments;
      } else if (lowerContent.includes('travel') || lowerContent.includes('trip') || lowerContent.includes('beautiful')) {
          possibleComments = TOPICS.TRAVEL.comments;
      } else if (lowerContent.includes('sad') || lowerContent.includes('cry')) {
          possibleComments = ["Hug hug", "Don't be sad", "Call me if you need"];
      }

      const interactorsCount = Math.floor(Math.random() * 3) + 1; // 1-3 friends interact
      const shuffledFriends = [...friends].sort(() => 0.5 - Math.random());
      const selectedFriends = shuffledFriends.slice(0, interactorsCount);

      selectedFriends.forEach((friend, index) => {
           const delay = (index + 1) * 3000 + Math.random() * 2000; // Staggered delay
           
           setTimeout(() => {
               // Like
               setPosts(prev => prev.map(p => {
                   if (p.id !== postId) return p;
                   if (!p.likes.includes(friend.id)) {
                        // Add Notification
                        const notif: Notification = {
                            id: `notif_l_${Date.now()}`,
                            type: 'like',
                            userId: friend.id,
                            userName: friend.name,
                            userAvatar: friend.avatar,
                            postId: postId,
                            timestamp: Date.now(),
                            read: false
                        };
                        setNotifications(n => [notif, ...n]);
                        return { ...p, likes: [...p.likes, friend.id] };
                   }
                   return p;
               }));

               // Comment (50% chance)
               if (Math.random() > 0.5) {
                   const commentText = getRandomItem(possibleComments);
                   setTimeout(() => {
                        setPosts(prev => prev.map(p => {
                            if (p.id !== postId) return p;
                            const newComment: Comment = {
                                id: `c_ai_${Date.now()}`,
                                userId: friend.id,
                                userName: friend.name,
                                content: commentText,
                                timestamp: Date.now()
                            };
                            
                            const notif: Notification = {
                                id: `notif_c_${Date.now()}`,
                                type: 'comment',
                                userId: friend.id,
                                userName: friend.name,
                                userAvatar: friend.avatar,
                                postId: postId,
                                content: commentText,
                                timestamp: Date.now(),
                                read: false
                            };
                            setNotifications(n => [notif, ...n]);
                            
                            return { ...p, comments: [...p.comments, newComment] };
                        }));
                   }, 1000);
               }
           }, delay);
      });
  }, [friends]);

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
    
    // Trigger Auto Interaction
    simulateInteractions(newPost.id, content);
  }, [currentUser.id, simulateInteractions]);

  // --- REFINED REFRESH LOGIC ---
  const refreshMoments = useCallback(() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (friends.length === 0) {
            resolve();
            return;
        }
        
        const count = Math.floor(Math.random() * 3) + 2; // Generate 2-4 posts
        const newPosts: Post[] = [];
        
        for(let i=0; i<count; i++) {
            // 1. Pick a random author
            const author = friends[Math.floor(Math.random() * friends.length)];
            
            // 2. Determine Topic based on User Persona (Name/ID heuristic)
            let categoryKey: keyof typeof TOPICS = 'YOUTH'; // Default
            
            if (author.name.includes('Boss') || author.name.includes('HR') || author.name.includes('Jack') || author.name.includes('Tony')) categoryKey = 'WORK';
            else if (author.name.includes('妈') || author.name.includes('姨') || author.name.includes('叔') || author.name.includes('伯')) categoryKey = 'OLDER_GEN';
            else if (author.name.includes('置业') || author.name.includes('代购') || author.name.includes('批发') || author.name.includes('保险')) categoryKey = 'SALES';
            else if (author.name.includes('momo') || author.name.includes('同学') || author.name.includes('L')) categoryKey = 'YOUTH';
            else {
                // Randomly assign other topics for generic users
                const keys: (keyof typeof TOPICS)[] = ['FOOD', 'TRAVEL', 'YOUTH', 'WORK'];
                categoryKey = getRandomItem(keys);
            }

            const category = TOPICS[categoryKey];

            // 3. Generate Content
            const content = getRandomItem(category.texts);
            
            // 4. Generate Images (0, 1, 3, 6, 9)
            const hasImage = Math.random() > 0.1; // 90% chance of image
            const images: string[] = [];
            if (hasImage) {
                 const imgCount = getRandomItem([1, 1, 3, 4, 6, 9]);
                 const keyword = getRandomItem(category.keywords);
                 // Add random lock to prevent cache collision
                 const baseSeed = Date.now() + i * 100;
                 for(let j=0; j<imgCount; j++) {
                     images.push(`https://loremflickr.com/400/400/${keyword}?lock=${baseSeed + j}`);
                 }
            }

            // 5. Generate Likes (Random friends)
            const likeCount = Math.floor(Math.random() * 8);
            const postLikes: string[] = [];
            const shuffledFriends = [...friends].sort(() => 0.5 - Math.random());
            shuffledFriends.slice(0, likeCount).forEach(f => postLikes.push(f.id));

            // 6. Generate Comments
            const commentCount = Math.floor(Math.random() * 4);
            const postComments: Comment[] = [];
            
            // We reuse the shuffled friends for commenters to avoid self-commenting instantly or duplicate commenters easily
            const commenters = shuffledFriends.slice(likeCount, likeCount + commentCount); 
            
            commenters.forEach((commenter, idx) => {
                postComments.push({
                    id: `c_gen_${Date.now()}_${i}_${idx}`,
                    userId: commenter.id,
                    userName: commenter.name,
                    content: getRandomItem(category.comments),
                    timestamp: Date.now() - Math.floor(Math.random() * 60000)
                });
            });

            newPosts.push({
                id: `p_gen_${Date.now()}_${i}`,
                authorId: author.id,
                content,
                images,
                likes: postLikes,
                comments: postComments,
                timestamp: Date.now()
            });
        }

        setPosts(prev => [...newPosts, ...prev]);
        resolve();
      }, 1500); // Simulate network delay
    });
  }, [friends]);

  const toggleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isLiked = p.likes.includes(currentUser.id);
      return {
        ...p,
        likes: isLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id]
      };
    }));
  }, [currentUser.id]);

  const addComment = useCallback((postId: string, content: string) => {
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      content,
      timestamp: Date.now()
    };
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return { ...p, comments: [...p.comments, newComment] };
    }));
  }, [currentUser.id, currentUser.name]);

  const getChatHistory = useCallback((targetId: string, isGroup: boolean = false) => {
    if (isGroup) {
        return messages.filter(m => m.receiverId === targetId).sort((a, b) => a.timestamp - b.timestamp);
    } else {
        return messages.filter(m => 
            (m.senderId === currentUser.id && m.receiverId === targetId) ||
            (m.senderId === targetId && m.receiverId === currentUser.id)
        ).sort((a, b) => a.timestamp - b.timestamp);
    }
  }, [messages, currentUser.id]);

  const getChatSessions = useCallback(() => {
    const sessions: Record<string, ChatSession> = {};
    
    messages.forEach(msg => {
      let sessionId: string;
      let type: 'user' | 'group' = 'user';
      
      const group = groups.find(g => g.id === msg.receiverId);
      
      if (group) {
          sessionId = group.id;
          type = 'group';
      } else {
          sessionId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
      }

      if (!sessions[sessionId]) {
          let name = 'Unknown';
          let avatar = '';

          if (type === 'group') {
              const g = groups.find(g => g.id === sessionId);
              if (g) {
                  name = g.name;
                  avatar = g.avatar;
              }
          } else {
              const f = friends.find(f => f.id === sessionId);
              if (f) {
                  name = f.name;
                  avatar = f.avatar;
              }
          }

          if (name !== 'Unknown') {
              sessions[sessionId] = {
                  id: sessionId,
                  type,
                  name,
                  avatar,
                  lastMessage: null,
                  unreadCount: 0
              };
          }
      }

      const session = sessions[sessionId];
      if (session) {
          if (!session.lastMessage || msg.timestamp > session.lastMessage.timestamp) {
              session.lastMessage = msg;
          }
          if (!msg.read) {
              if (type === 'user' && msg.receiverId === currentUser.id) {
                  session.unreadCount++;
              } else if (type === 'group' && msg.receiverId === sessionId && msg.senderId !== currentUser.id) {
                  session.unreadCount++;
              }
          }
      }
    });

    return Object.values(sessions).sort((a, b) => {
      const ta = a.lastMessage?.timestamp || 0;
      const tb = b.lastMessage?.timestamp || 0;
      return tb - ta;
    });
  }, [messages, friends, groups, currentUser.id]);

  const getUser = useCallback((id: string) => {
      if (id === currentUser.id) return currentUser;
      const friend = friends.find(f => f.id === id);
      if (friend) return friend;

      return {
          id,
          name: `User ${id}`,
          avatar: `https://picsum.photos/seed/u_${id}/200/200`,
          phone: '',
          wxid: `wxid_${id}`
      };
  }, [friends, currentUser]);

  return (
    <StoreContext.Provider value={{
      currentUser,
      friends,
      groups,
      messages,
      posts,
      notifications,
      updateCurrentUser,
      addMessage,
      updateMessage,
      markAsRead,
      addFriend,
      deleteFriend,
      addPost,
      refreshMoments,
      toggleLike,
      addComment,
      getChatHistory,
      getChatSessions,
      getUser
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