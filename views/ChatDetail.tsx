

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState, Message } from '../types';
import { Header, ScrollArea } from '../components/Layout';
import { IconVoice, IconKeyboard, IconMore, IconPlus, IconFace, IconRedPacket, IconTransfer, IconCamera } from '../components/Icons';

interface ChatDetailProps {
  userId: string;
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

const EMOJIS = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "🙏", "👍", "👎", "👊", "👌", "💪", "👏", "🙌", "👐", "👋", "💋", "💘", "❤️", "💓", "💔", "💕", "💖", "💗", "💙", "💚", "💛", "💜", "🖤", "💝", "💞", "💟"];

const getSmartReply = (text: string) => {
  const lower = text.toLowerCase();
  
  if (lower.match(/\b(hello|hi|hey|morning|afternoon|evening)\b/)) 
    return ["Hey there!", "Hello!", "Good to see you!", "Hi! How's it going?"][Math.floor(Math.random() * 4)];
  
  if (lower.match(/\b(eat|food|dinner|lunch|breakfast|hungry|starving)\b/)) 
    return ["I'm getting hungry too! 🤤", "Have you eaten yet?", "What are you having?", "Food sounds great right now."][Math.floor(Math.random() * 4)];
  
  if (lower.match(/\b(funny|haha|lol|lmao|rofl)\b/)) 
    return ["😂 That is funny.", "Haha, good one!", "🤣"][Math.floor(Math.random() * 3)];
  
  if (lower.match(/\b(sad|cry|bad|depressed|unhappy)\b/)) 
    return ["Oh no, what happened? 😟", "Sending big hugs! 🤗", "Hope you feel better soon."][Math.floor(Math.random() * 3)];
  
  if (lower.match(/\b(happy|good|great|awesome|excited)\b/)) 
    return ["That's awesome! 🎉", "Glad to hear that!", "Keep the good vibes going!"][Math.floor(Math.random() * 3)];

  if (lower.match(/\b(weather|rain|sun|cloud|hot|cold)\b/)) 
    return ["The weather has been so crazy lately.", "I hope it clears up soon.", "Stay safe out there!"][Math.floor(Math.random() * 3)];
  
  if (lower.match(/\b(busy|work|job|tired|exhausted)\b/)) 
    return ["Don't work too hard! 🍵", "Take a break, you deserve it.", "Hang in there!"][Math.floor(Math.random() * 3)];
  
  if (lower.match(/\b(love|like|miss)\b/)) 
    return ["Aww, that's sweet! ❤️", "Miss you too!", "🥰"][Math.floor(Math.random() * 3)];
  
  if (lower.match(/\?$/)) 
    return ["That's a good question. Let me think... 🤔", "I'm not sure, what do you think?", "Interesting point!"][Math.floor(Math.random() * 3)];
  
  return ["I see.", "Tell me more.", "Interesting.", "Really?", "👍", "OK", "Cool"][Math.floor(Math.random() * 7)];
}

const RED_PACKET_PRAISES = [
  "Wow! Boss is so generous! 🧧❤️",
  "Thank you so much! Best wishes! ✨",
  "Received! You are the best! 👍",
  "Boss! Have a prosperous year! 💰",
  "Thanks for the Red Packet! 🧧"
];

const TRANSFER_PRAISES = [
  "Money received! You are amazing! 💸",
  "Thank you for the transfer! ❤️",
  "Received safely. Boss is so generous! 👍",
  "Wow, thanks! Dinner is on me next time! 🍜",
  "Got it! Thanks boss! 💰"
];

export const ChatDetail = ({ userId, onBack, onNavigate }: ChatDetailProps) => {
  const { friends, currentUser, getChatHistory, addMessage, updateMessage, markAsRead } = useStore();
  const [inputText, setInputText] = useState('');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const friend = friends.find(f => f.id === userId);
  const history = getChatHistory(userId);

  // Monitor for financial transactions sent by ME to trigger auto-responses
  useEffect(() => {
     if (history.length > 0) {
         const lastMsg = history[history.length - 1];
         
         // Logic 1: Red Packet Response (Auto Reply)
         if (lastMsg.senderId === currentUser.id && lastMsg.type === 'red_packet' && !lastMsg.read) {
             setTimeout(() => {
                const praise = RED_PACKET_PRAISES[Math.floor(Math.random() * RED_PACKET_PRAISES.length)];
                const reply: Message = {
                    id: `rp_reply_${Date.now()}`,
                    senderId: userId,
                    receiverId: currentUser.id,
                    content: praise,
                    type: 'text',
                    timestamp: Date.now(),
                    read: false
                };
                addMessage(reply);
             }, 2500);
         }

         // Logic 2: Transfer Acceptance & Response
         // When ME sends a transfer, friend accepts it after delay.
         if (lastMsg.senderId === currentUser.id && lastMsg.type === 'transfer' && lastMsg.status !== 'accepted') {
             const msgId = lastMsg.id;
             
             // Trigger acceptance simulation
             const timer = setTimeout(() => {
                 // 1. Update Transfer Message Status to 'Accepted'
                 updateMessage(msgId, { status: 'accepted' });

                 // 2. Send System Message "Received"
                 const sysMsg: Message = {
                    id: `tf_sys_${Date.now()}`,
                    senderId: userId, // From them, but system type
                    receiverId: currentUser.id,
                    content: `${friend?.name || 'Friend'} accepted transfer.`,
                    type: 'system',
                    timestamp: Date.now(),
                    read: true
                 };
                 addMessage(sysMsg);

                 // 3. Send Praise
                 setTimeout(() => {
                    const praise = TRANSFER_PRAISES[Math.floor(Math.random() * TRANSFER_PRAISES.length)];
                    const reply: Message = {
                        id: `tf_reply_${Date.now()}`,
                        senderId: userId,
                        receiverId: currentUser.id,
                        content: praise,
                        type: 'text',
                        timestamp: Date.now(),
                        read: false
                    };
                    addMessage(reply);
                 }, 800); // Small delay after system message
             }, 3000); // 3 seconds delay for acceptance

             return () => clearTimeout(timer);
         }
     }
  }, [history, currentUser.id, userId, addMessage, updateMessage, friend?.name]);

  useEffect(() => {
    markAsRead(userId);
  }, [userId, history.length, markAsRead]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showEmoji, showPlusMenu]);

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
    setShowPlusMenu(false);

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
    }, 1500 + Math.random() * 1000);
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
      duration: Math.max(1, Math.min(10, Math.ceil(text.length / 5)))
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
    setShowEmoji(!showEmoji);
    setShowPlusMenu(false);
    if (isAudioMode) setIsAudioMode(false);
  };

  const togglePlusMenu = () => {
    setShowPlusMenu(!showPlusMenu);
    setShowEmoji(false);
    if (isAudioMode) setIsAudioMode(false);
  };

  const focusInput = () => {
    setShowEmoji(false);
    setShowPlusMenu(false);
    setIsAudioMode(false);
  };

  const insertEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  // --- Render Message Content based on Type ---
  const renderMessageContent = (msg: Message, isMe: boolean) => {
      if (msg.type === 'system') {
          return (
              <div className="flex justify-center w-full my-2">
                  <span className="bg-[#DADADA] text-white text-xs px-2 py-1 rounded-md">
                      {msg.content}
                  </span>
              </div>
          );
      }

      if (msg.type === 'red_packet') {
          return (
              <div className="w-60 bg-[#FA9D3B] rounded-lg overflow-hidden flex flex-col cursor-pointer select-none">
                  <div className="flex items-center p-3">
                      <div className="w-10 h-10 flex items-center justify-center mr-3">
                         <svg width="32" height="32" viewBox="0 0 24 24" fill="#E66550" stroke="#FDE599" strokeWidth="1.5">
                             <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                             <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
                             <rect x="9" y="10" width="6" height="4" rx="1" fill="#FDE599" />
                         </svg>
                      </div>
                      <div className="flex flex-col text-white">
                          <span className="text-base font-medium leading-tight line-clamp-1">{msg.content || 'Best Wishes'}</span>
                          {/* <span className="text-xs opacity-80">Check Red Packet</span> */}
                      </div>
                  </div>
                  <div className="bg-white px-3 py-1">
                      <span className="text-xs text-gray-400">WeChat Red Packet</span>
                  </div>
              </div>
          );
      }
      
      if (msg.type === 'transfer') {
          const isAccepted = msg.status === 'accepted';
          const bubbleColor = isAccepted ? 'bg-[#F5F5F5]' : 'bg-[#FA9D3B]'; // Grey if accepted, Orange if active
          const iconColor = isAccepted ? 'white' : 'white';
          const iconStroke = isAccepted ? '#CCCCCC' : 'white';

          return (
              <div className={`w-60 ${bubbleColor} rounded-lg overflow-hidden flex flex-col cursor-pointer select-none transition-colors duration-500`}>
                  <div className="flex items-center p-3">
                      <div className={`w-10 h-10 border-2 ${isAccepted ? 'border-[#CCCCCC]' : 'border-white'} rounded-full flex items-center justify-center mr-3`}>
                         {isAccepted ? (
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="3">
                                 <polyline points="20 6 9 17 4 12"></polyline>
                             </svg>
                         ) : (
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                 <path d="M7 11l5-5 5 5M7 13l5 5 5-5" />
                             </svg>
                         )}
                      </div>
                      <div className={`flex flex-col ${isAccepted ? 'text-black' : 'text-white'}`}>
                          <span className="text-base font-medium">¥{msg.amount}</span>
                          <span className={`text-xs ${isAccepted ? 'text-gray-400' : 'opacity-90'}`}>
                              {isAccepted ? 'Accepted' : (msg.content || 'Transfer')}
                          </span>
                      </div>
                  </div>
                  <div className="bg-white px-3 py-1">
                      <span className="text-xs text-gray-400">WeChat Transfer</span>
                  </div>
              </div>
          );
      }

      if (msg.type === 'audio') {
          return (
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
                    ${isMe ? 'border-l-[6px] border-l-wechat-bubble -right-[5px]' : 'border-r-[6px] border-r-white -left-[5px]'}`} 
                />
            </div>
          );
      }

      // Text Message
      return (
          <div className={`px-3 py-2 text-[15px] rounded-md shadow-sm break-words relative 
            ${isMe ? 'bg-wechat-bubble text-black rounded-tr-none' : 'bg-white text-black rounded-tl-none'}`}>
            {msg.content}
            <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent 
              ${isMe ? 'border-l-[6px] border-l-wechat-bubble -right-[5px]' : 'border-r-[6px] border-r-white -left-[5px]'}`} 
            />
          </div>
      );
  };

  if (!friend) return <div>User not found</div>;

  return (
    <div className="flex flex-col h-full bg-wechat-bg">
      <Header title={friend.name} onBack={onBack} rightAction={<IconMore />} />
      
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar" ref={scrollRef}>
        {history.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          
          if (msg.type === 'system') {
              return (
                  <div key={msg.id} className="w-full mb-4">
                      {renderMessageContent(msg, false)}
                  </div>
              );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start mb-4`}>
              {!isMe && (
                <img src={friend.avatar} alt="avatar" className="w-10 h-10 rounded-md mr-2" />
              )}
              
              <div className={`max-w-[75%] relative group`}>
                {renderMessageContent(msg, isMe)}
                
                {isMe && msg.read && msg.type === 'text' && (
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
            <button onClick={() => { setIsAudioMode(!isAudioMode); setShowEmoji(false); setShowPlusMenu(false); }} className="text-gray-600 p-1">
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

            {inputText && !isAudioMode ? (
                 <button onClick={handleSend} className="p-1 px-2">
                    <span className="bg-wechat-green text-white px-3 py-1.5 rounded-md text-sm">Send</span>
                 </button>
            ) : (
                <button onClick={togglePlusMenu} className={`p-1 ${showPlusMenu ? 'text-gray-600' : 'text-gray-600'}`}>
                    <IconPlus />
                </button>
            )}
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

        {/* Plus Menu Panel */}
        {showPlusMenu && (
             <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] p-6">
                 <div className="grid grid-cols-4 gap-6">
                     <div className="flex flex-col items-center gap-2">
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                             <span className="text-2xl opacity-60">🖼️</span>
                         </div>
                         <span className="text-xs text-gray-500">Photos</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                             <IconCamera />
                         </div>
                         <span className="text-xs text-gray-500">Camera</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                             <span className="text-2xl opacity-60">📞</span>
                         </div>
                         <span className="text-xs text-gray-500">Video Call</span>
                     </div>
                     <div className="flex flex-col items-center gap-2">
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                             <span className="text-2xl opacity-60">📍</span>
                         </div>
                         <span className="text-xs text-gray-500">Location</span>
                     </div>
                     
                     {/* Red Packet Button */}
                     <div 
                        className="flex flex-col items-center gap-2 cursor-pointer"
                        onClick={() => onNavigate({ type: 'MONEY_RED_PACKET', userId })}
                     >
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                             <IconRedPacket />
                         </div>
                         <span className="text-xs text-gray-500">Red Packet</span>
                     </div>

                     {/* Transfer Button */}
                     <div 
                        className="flex flex-col items-center gap-2 cursor-pointer"
                        onClick={() => onNavigate({ type: 'MONEY_TRANSFER', userId })}
                     >
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                             <IconTransfer />
                         </div>
                         <span className="text-xs text-gray-500">Transfer</span>
                     </div>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};