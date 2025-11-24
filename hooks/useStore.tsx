

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Message, Post, ChatSession, Comment } from '../types';
import { INITIAL_FRIENDS, MOCK_POSTS_INITIAL, CURRENT_USER, MOCK_MESSAGES } from '../constants';

interface StoreContextType {
  currentUser: User;
  friends: User[];
  messages: Message[];
  posts: Post[];
  updateCurrentUser: (updates: Partial<User>) => void;
  addMessage: (msg: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  markAsRead: (senderId: string) => void;
  addFriend: (phone: string) => boolean;
  deleteFriend: (id: string) => void;
  addPost: (content: string, images: string[]) => void;
  refreshMoments: () => Promise<void>;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  getChatHistory: (friendId: string) => Message[];
  getChatSessions: () => ChatSession[];
}

const StoreContext = createContext<StoreContextType | null>(null);

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

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('wx_messages');
    // Load MOCK_MESSAGES if no local storage exists to populate chats
    return saved ? JSON.parse(saved) : MOCK_MESSAGES;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('wx_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS_INITIAL;
  });

  // Persist changes
  useEffect(() => {
    localStorage.setItem('wx_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wx_friends', JSON.stringify(friends));
  }, [friends]);

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

  const markAsRead = useCallback((senderId: string) => {
    setMessages(prev => prev.map(m => 
      (m.senderId === senderId && m.receiverId === currentUser.id && !m.read) 
        ? { ...m, read: true } 
        : m
    ));
  }, [currentUser.id]);

  const addFriend = useCallback((phone: string) => {
    // Mock user lookup
    const exists = friends.find(f => f.phone === phone);
    if (exists) return false;

    // Simulate finding a new user
    const newUser: User = {
      id: `new_${Date.now()}`,
      name: `User ${phone.slice(-4)}`,
      avatar: `https://picsum.photos/seed/${phone}/200/200`,
      phone: phone,
      wxid: `wx_${phone}`
    };
    
    // Add friend and add an initial system greeting message so they show in chats
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
    // Also remove associated messages? Optional. Keeping them for now.
  }, []);

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

  const refreshMoments = useCallback(() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (friends.length === 0) {
            resolve();
            return;
        }
        // Generate 1-2 new posts from random friends
        const count = Math.floor(Math.random() * 2) + 1;
        const newPosts: Post[] = [];
        
        const contentTemplates = [
          "Just had an amazing coffee! ☕️",
          "Working hard on the new project. 💻",
          "The weather is absolutely beautiful today. ☀️",
          "Can't believe it's already Friday! 🎉",
          "Check out this view! 🏙",
          "Life is good. ✨",
          "Does anyone know a good place for dinner?",
          "Missing the old days..."
        ];

        for(let i=0; i<count; i++) {
            const friend = friends[Math.floor(Math.random() * friends.length)];
            const hasImage = Math.random() > 0.3;
            
            newPosts.push({
                id: `p_fresh_${Date.now()}_${i}`,
                authorId: friend.id,
                content: contentTemplates[Math.floor(Math.random() * contentTemplates.length)],
                images: hasImage ? [`https://loremflickr.com/400/400/lifestyle,city?lock=${Date.now() + i}`] : [],
                likes: [],
                comments: [],
                timestamp: Date.now()
            });
        }

        setPosts(prev => [...newPosts, ...prev]);
        resolve();
      }, 1500);
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

  const getChatHistory = useCallback((friendId: string) => {
    return messages.filter(m => 
      (m.senderId === currentUser.id && m.receiverId === friendId) ||
      (m.senderId === friendId && m.receiverId === currentUser.id)
    ).sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, currentUser.id]);

  const getChatSessions = useCallback(() => {
    const sessions: Record<string, ChatSession> = {};
    
    // Iterate all messages to build sessions
    messages.forEach(msg => {
      const otherId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
      
      const friend = friends.find(f => f.id === otherId);
      if (!friend) return;

      if (!sessions[otherId]) {
        sessions[otherId] = {
          userId: otherId,
          lastMessage: null,
          unreadCount: 0
        };
      }
      
      const session = sessions[otherId];
      if (!session.lastMessage || msg.timestamp > session.lastMessage.timestamp) {
        session.lastMessage = msg;
      }
      if (msg.receiverId === currentUser.id && !msg.read) {
        session.unreadCount++;
      }
    });

    return Object.values(sessions).sort((a, b) => {
      const ta = a.lastMessage?.timestamp || 0;
      const tb = b.lastMessage?.timestamp || 0;
      return tb - ta;
    });
  }, [messages, friends, currentUser.id]);

  return (
    <StoreContext.Provider value={{
      currentUser,
      friends,
      messages,
      posts,
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
      getChatSessions
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