import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState, Message } from '../types';
import { Header, ScrollArea } from '../components/Layout';
import { IconVoice, IconKeyboard, IconMore, IconPlus, IconFace } from '../components/Icons';

interface ChatDetailProps {
  userId: string;
  onBack: () => void;
}

const EMOJIS = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "🙏", "👍", "👎", "👊", "👌", "💪", "👏", "🙌", "👐", "👋", "💋", "💘", "❤️", "💓", "💔", "💕", "💖", "💗", "💙", "💚", "💛", "💜", "🖤", "💝", "💞", "💟"];

const getSmartReply = (text: string) => {
  const lower = text.toLowerCase();
  
  // Greetings
  if (lower.match(/\b(hello|hi|hey|morning|afternoon|evening)\b/)) 
    return ["Hey there!", "Hello!", "Good to see you!", "Hi! How's it going?"][Math.floor(Math.random() * 4)];
  
  // Food
  if (lower.match(/\b(eat|food|dinner|lunch|breakfast|hungry|starving)\b/)) 
    return ["I'm getting hungry too! 🤤", "Have you eaten yet?", "What are you having?", "Food sounds great right now."][Math.floor(Math.random() * 4)];
  
  // Emotion
  if (lower.match(/\b(funny|haha|lol|lmao|rofl)\b/)) 
    return ["😂 That is funny.", "Haha, good one!", "🤣"][Math.floor(Math.random() * 3)];
  
  if (lower.match(/\b(sad|cry|bad|depressed|unhappy)\b/)) 
    return ["Oh no, what happened? 😟", "Sending big hugs! 🤗", "Hope you feel better soon."][Math.floor(Math.random() * 3)];
  
  if (lower.match(/\b(happy|good|great|awesome|excited)\b/)) 
    return ["That's awesome! 🎉", "Glad to hear that!", "Keep the good vibes going!"][Math.floor(Math.random() * 3)];

  // Weather
  if (lower.match(/\b(weather|rain|sun|cloud|hot|cold)\b/)) 
    return ["The weather has been so crazy lately.", "I hope it clears up soon.", "Stay safe out there!"][Math.floor(Math.random() * 3)];
  
  // Work
  if (lower.match(/\b(busy|work|job|tired|exhausted)\b/)) 
    return ["Don't work too hard! 🍵", "Take a break, you deserve it.", "Hang in there!"][Math.floor(Math.random() * 3)];
  
  // Affection
  if (lower.match(/\b(love|like|miss)\b/)) 
    return ["Aww, that's sweet! ❤️", "Miss you too!", "🥰"][Math.floor(Math.random() * 3)];
  
  // Questions
  if (lower.match(/\?$/)) 
    return ["That's a good question. Let me think... 🤔", "I'm not sure, what do you think?", "Interesting point!"][Math.floor(Math.random() * 3)];
  
  // Default fallback
  return ["I see.", "Tell me more.", "Interesting.", "Really?", "👍", "OK", "Cool"][Math.floor(Math.random() * 7)];
}

export const ChatDetail = ({ userId, onBack }: ChatDetailProps) => {
  const { friends, currentUser, getChatHistory, addMessage, markAsRead } = useStore();
  const [inputText, setInputText] = useState('');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const friend = friends.find(f => f.id === userId);
  const history = getChatHistory(userId);

  useEffect(() => {
    markAsRead(userId);
  }, [userId, history.length, markAsRead]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showEmoji]); // Scroll when history updates or emoji panel opens

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: userId,
      content: inputText,
      type: 'text',
      timestamp: Date.now(),
      read: false
    };
    addMessage(msg);
    setInputText('');
    setShowEmoji(false);

    // Smart reply
    setTimeout(() => {
      const replyContent = getSmartReply(msg.content);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: userId,
        receiverId: currentUser.id,
        content: replyContent,
        type: 'text',
        timestamp: Date.now(),
        read: false
      };
      addMessage(reply);
    }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5s
  };

  const handleSendAudio = (text: string) => {
     const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: userId,
      content: text,
      type: 'audio',
      timestamp: Date.now(),
      read: false,
      duration: Math.max(1, Math.min(10, Math.ceil(text.length / 5))) // Mock duration
    };
    addMessage(msg);
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang.includes('zh'));
      if (zhVoice) utterance.voice = zhVoice;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser");
    }
  };

  const toggleEmoji = () => {
    if (isAudioMode) setIsAudioMode(false);
    setShowEmoji(!showEmoji);
    // If we are showing emoji, blur input to hide keyboard
    if (!showEmoji && inputRef.current) {
      // We want to verify logic here. Usually toggle means open panel.
    }
  };

  const focusInput = () => {
    setShowEmoji(false);
    setIsAudioMode(false);
  };

  const insertEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  if (!friend) return <div>User not found</div>;

  return (
    <div className="flex flex-col h-full bg-wechat-bg">
      <Header title={friend.name} onBack={onBack} rightAction={<IconMore />} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" ref={scrollRef}>
        {history.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start mb-4`}>
              {!isMe && (
                <img src={friend.avatar} alt="avatar" className="w-10 h-10 rounded-md mr-2" />
              )}
              
              <div className={`max-w-[70%] relative group`}>
                {msg.type === 'text' ? (
                  <div className={`px-3 py-2 text-[15px] rounded-md shadow-sm break-words relative 
                    ${isMe ? 'bg-wechat-bubble text-black rounded-tr-none' : 'bg-white text-black rounded-tl-none'}`}>
                    {msg.content}
                    {/* Triangle pointer mock */}
                    <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent 
                      ${isMe 
                        ? 'border-l-[6px] border-l-wechat-bubble -right-[5px]' 
                        : 'border-r-[6px] border-r-white -left-[5px]'}`} 
                    />
                  </div>
                ) : (
                  <div 
                    onClick={() => playAudio(msg.content)}
                    className={`px-3 py-2 rounded-md shadow-sm cursor-pointer flex items-center min-w-[80px] select-none
                     ${isMe ? 'bg-wechat-bubble justify-end rounded-tr-none' : 'bg-white justify-start rounded-tl-none'}`}
                    style={{ width: `${60 + (msg.duration || 1) * 10}px` }}
                  >
                    {isMe ? (
                       <>
                        <span className="mr-2 text-sm">{msg.duration}"</span>
                        <svg className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                       </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                        <span className="ml-2 text-sm">{msg.duration}"</span>
                      </>
                    )}
                     <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent 
                      ${isMe 
                        ? 'border-l-[6px] border-l-wechat-bubble -right-[5px]' 
                        : 'border-r-[6px] border-r-white -left-[5px]'}`} 
                    />
                  </div>
                )}
                
                {isMe && msg.read && (
                  <span className="text-[10px] text-gray-400 absolute -left-8 bottom-0">Read</span>
                )}
              </div>

              {isMe && (
                <img src={currentUser.avatar} alt="avatar" className="w-10 h-10 rounded-md ml-2" />
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#F7F7F7] border-t border-[#E5E5E5] shrink-0">
        <div className="p-2 flex items-center gap-2">
            <button onClick={() => { setIsAudioMode(!isAudioMode); setShowEmoji(false); }} className="text-gray-600 p-1">
            {isAudioMode ? <IconKeyboard /> : <IconVoice />}
            </button>
            
            {isAudioMode ? (
            <button 
                className="flex-1 bg-white border border-gray-300 rounded-md py-2 text-center font-medium active:bg-gray-200 select-none touch-none"
                onMouseDown={(e) => {
                e.preventDefault();
                handleSendAudio("This is a simulated audio message.");
                }}
            >
                Hold to Talk
            </button>
            ) : (
            <input 
                ref={inputRef}
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={focusInput}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-base focus:outline-none focus:border-green-500"
                placeholder=""
            />
            )}
            
            <button onClick={toggleEmoji} className={`p-1 ${showEmoji ? 'text-wechat-green' : 'text-gray-600'}`}>
                <IconFace />
            </button>

            <button 
            onClick={() => !isAudioMode && handleSend()} 
            className="p-1 px-2"
            >
            {inputText && !isAudioMode ? (
                <span className="bg-wechat-green text-white px-3 py-1.5 rounded-md text-sm">Send</span>
            ) : (
                <IconPlus />
            )}
            </button>
        </div>

        {/* Emoji Panel */}
        {showEmoji && (
            <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] overflow-y-auto grid grid-cols-8 gap-2 p-4">
                {EMOJIS.map((emoji, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => insertEmoji(emoji)}
                        className="text-2xl hover:bg-white rounded p-1 transition-colors"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};