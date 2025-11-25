import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState, Message } from '../types';
import { Header } from '../components/Layout';
import { IconVoice, IconKeyboard, IconMore, IconPlus, IconFace, IconRedPacket, IconTransfer, IconCamera } from '../components/Icons';

interface ChatDetailProps {
  id: string; // userId or groupId
  chatType: 'user' | 'group';
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

const EMOJIS = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "🙏", "👍", "👎", "👊", "👌", "💪", "👏", "🙌", "👐", "👋", "💋", "💘", "❤️", "💓", "💔", "💕", "💖", "💗", "💙", "💚", "💛", "💜", "🖤", "💝", "💞", "💟"];

// List of IDs that should speak English
const FOREIGN_IDS = ['10', '16', '18', '19'];

// --- PERSONA INTELLIGENCE LOGIC ---
const getPersonaReply = (userId: string, userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    const isForeign = FOREIGN_IDS.includes(userId);

    // 1. Mom (id: 2)
    if (userId === '2') {
        if (msg.includes('吃') || msg.includes('饭') || msg.includes('饿')) return "记得多吃点青菜！别老吃外卖。🥦";
        if (msg.includes('冷') || msg.includes('天') || msg.includes('雨')) return "穿秋裤了吗？别冻着！🧣";
        if (msg.includes('晚') || msg.includes('睡') || msg.includes('累')) return "早点睡！熬夜伤肝。😴";
        if (msg.includes('钱')) return "钱够不够花？不够妈给你转。";
        if (msg.includes('爱')) return "妈妈也爱你，照顾好自己。❤️";
        return "什么时候回家？妈给你包饺子。";
    }

    // 2. Boss (id: 3)
    if (userId === '3') {
        if (msg.includes('好') || msg.includes('完') || msg.includes('报告')) return "发我邮箱，我开会前要看。";
        if (msg.includes('假') || msg.includes('病') || msg.includes('休')) return "这周项目关键期，能不能克服一下？";
        if (msg.includes('方案') || msg.includes('建议')) return "周一例会细聊。";
        if (msg.includes('抱歉') || msg.includes('错')) return "下不为例，注意细节。";
        return "收到，抓紧落实KPI。";
    }

    // 3. Wife (id: 8)
    if (userId === '8') {
        if (msg.includes('爱') || msg.includes('想')) return "我也爱你老公！么么哒！❤️😘";
        if (msg.includes('吃') || msg.includes('饭')) return "我想吃火锅！或者日料？🍣";
        if (msg.includes('家') || msg.includes('回')) return "回来路上带杯奶茶！🧋";
        if (msg.includes('买')) return "那个包包打折了，能不能买嘛！🥺";
        return "几点回来？想你了。";
    }

    // 4. Momo (id: 5)
    if (userId === '5') {
        if (msg.includes('哈哈') || msg.includes('笑')) return "xswl (笑死我了) 😂😂😂";
        if (msg.includes('难过') || msg.includes('哭')) return "emo了... 🌧️";
        if (msg.includes('?')) return "尊嘟假嘟 O.o";
        return "yyds! 🙌";
    }

    // 5. Real Estate Agent (id: 4)
    if (userId === '4') {
        return "Leo哥，市场回暖了！现在不买又要涨了！这套房型绝佳，带您看看？🏠";
    }

    // 6. Colleague Jack (id: 10) - English Speaker (Programmer)
    if (userId === '10') {
        if (msg.includes('bug') || msg.includes('error')) return "Have you checked the logs? It works on my machine.";
        if (msg.includes('coffee')) return "Let's go! I need caffeine.";
        if (msg.includes('merge')) return "LGTM. Merging now.";
        return "Still coding... this deadline is killing me. 💻";
    }

    // 7. HR Sara (id: 19) - English Speaker
    if (userId === '19') {
        if (msg.includes('job') || msg.includes('offer')) return "We have a great position opening up. Are you interested?";
        return "Let's touch base next week.";
    }
    
    // General Logic based on Language
    if (isForeign) {
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) return "Hey! Long time no see. 👋";
        if (msg.includes('how are you') || msg.includes('doing')) return "I'm good, just busy with stuff. You?";
        if (msg.includes('?')) return "That's a good question... 🤔";
        if (msg.includes('payment') || msg.includes('money')) return "Payment received, thanks!";
        if (msg.includes('ok') || msg.includes('good')) return "👍";
        return "Got it.";
    } else {
        if (msg.includes('你好') || msg.includes('在吗')) return "在的，好久不见！👋";
        if (msg.includes('怎么样') || msg.includes('最近')) return "挺好的，瞎忙呗。你呢？";
        if (msg.includes('?')) return "这个问题... 🤔";
        if (msg.includes('钱') || msg.includes('转账')) return "收到啦，谢谢老板！";
        if (msg.includes('好') || msg.includes('恩')) return "👍";
        
        const randomChineseReplies = [
            "真的吗？",
            "哈哈，有意思。",
            "这周末有空出来聚聚？",
            "我现在有点忙，回聊。",
            "确实。",
            "[表情包]"
        ];
        return randomChineseReplies[Math.floor(Math.random() * randomChineseReplies.length)];
    }
};


export const ChatDetail = ({ id, chatType, onBack, onNavigate }: ChatDetailProps) => {
  const { friends, groups, currentUser, getChatHistory, addMessage, updateMessage, markAsRead, getUser, t } = useStore();
  const [inputText, setInputText] = useState('');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Identify the target entity
  const targetName = chatType === 'group' 
      ? groups.find(g => g.id === id)?.name 
      : friends.find(f => f.id === id)?.name || 'Unknown';

  const history = getChatHistory(id, chatType === 'group');

  // Mark as read
  useEffect(() => {
    markAsRead(id);
  }, [id, history.length, markAsRead]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showEmoji, showPlusMenu]);

  // --- SMART AUTO-REPLY LOGIC ---
  useEffect(() => {
      // Only process auto-replies for 1-on-1 chats to avoid noise in groups
      if (chatType === 'user' && history.length > 0) {
           const lastMsg = history[history.length - 1];
           
           // If the last message is sent by ME (Current User)
           if (lastMsg.senderId === currentUser.id) {
               
               // 1. Handle MONEY TRANSFER Logic
               if (lastMsg.type === 'transfer' && lastMsg.status !== 'accepted') {
                    const msgId = lastMsg.id;
                    const randomDelay = Math.random() * 3000 + 2000; // 2-5s delay
                    const isForeign = FOREIGN_IDS.includes(id);

                    const timeout = setTimeout(() => {
                        updateMessage(msgId, { status: 'accepted' });
                        // Add system message
                        addMessage({
                            id: `sys_tf_${Date.now()}`,
                            senderId: id,
                            receiverId: currentUser.id,
                            content: isForeign ? `Friend accepted transfer.` : `对方已收款`,
                            type: 'system',
                            timestamp: Date.now(),
                            read: true
                        });
                        // Add gratitude text
                        addMessage({
                            id: `rep_tf_${Date.now()}`,
                            senderId: id,
                            receiverId: currentUser.id,
                            content: isForeign ? "Received! You are the best! 💸❤️" : "收到啦！老板大气！💸❤️",
                            type: 'text',
                            timestamp: Date.now() + 100,
                            read: false
                        });
                    }, randomDelay);
                    return () => clearTimeout(timeout);
               }

               // 2. Handle RED PACKET Logic
               if (lastMsg.type === 'red_packet') {
                   const randomDelay = Math.random() * 3000 + 2000;
                   const isForeign = FOREIGN_IDS.includes(id);
                   const timeout = setTimeout(() => {
                       addMessage({
                           id: `rep_rp_${Date.now()}`,
                           senderId: id,
                           receiverId: currentUser.id,
                           content: isForeign ? "Wow! Boss is so generous! Best wishes! 🧧✨" : "哇！老板大气！恭喜发财！🧧✨",
                           type: 'text',
                           timestamp: Date.now(),
                           read: false
                       });
                   }, randomDelay);
                   return () => clearTimeout(timeout);
               }

               // 3. Handle NORMAL TEXT CHAT Logic (Persona AI)
               if (lastMsg.type === 'text') {
                   // Simulate "typing" delay
                   const randomDelay = Math.random() * 2000 + 1000; // 1-3s delay
                   
                   const timeout = setTimeout(() => {
                       const replyContent = getPersonaReply(id, lastMsg.content);
                       addMessage({
                           id: `rep_txt_${Date.now()}`,
                           senderId: id,
                           receiverId: currentUser.id,
                           content: replyContent,
                           type: 'text',
                           timestamp: Date.now(),
                           read: false
                       });
                   }, randomDelay);
                   return () => clearTimeout(timeout);
               }
           }
      }
  }, [history, chatType, currentUser.id, id, addMessage, updateMessage]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: id, // Target User or Group ID
      content: inputText,
      type: 'text',
      timestamp: Date.now(),
      read: false
    };
    addMessage(msg);
    setInputText('');
    setShowEmoji(false);
    setShowPlusMenu(false);
  };

  const handleSendAudio = (text: string) => {
     const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: id,
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
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleEmoji = () => { setShowEmoji(!showEmoji); setShowPlusMenu(false); };
  const togglePlusMenu = () => { setShowPlusMenu(!showPlusMenu); setShowEmoji(false); };

  const renderMessageContent = (msg: Message, isMe: boolean) => {
      if (msg.type === 'system') return <div className="flex justify-center w-full my-2"><span className="bg-[#DADADA] text-white text-xs px-2 py-1 rounded-md">{msg.content}</span></div>;
      
      const content = msg.type === 'text' ? (
          <div className={`px-3 py-2 text-[15px] rounded-md shadow-sm break-words relative max-w-full ${isMe ? 'bg-wechat-bubble text-black rounded-tr-none' : 'bg-white text-black rounded-tl-none'}`}>
            {msg.content}
            <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ${isMe ? 'border-l-[6px] border-l-wechat-bubble -right-[5px]' : 'border-r-[6px] border-r-white -left-[5px]'}`} />
          </div>
      ) : msg.type === 'audio' ? (
        <div onClick={() => playAudio(msg.content)} className={`px-3 py-2 rounded-md shadow-sm cursor-pointer flex items-center min-w-[80px] select-none ${isMe ? 'bg-wechat-bubble justify-end rounded-tr-none' : 'bg-white justify-start rounded-tl-none'}`} style={{ width: `${60 + (msg.duration || 1) * 10}px` }}>
            {isMe ? <span className="mr-2 text-sm">{msg.duration}"</span> : <span className="ml-2 text-sm">{msg.duration}"</span>}
             <svg className={`w-4 h-4 ${isMe ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
             <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ${isMe ? 'border-l-[6px] border-l-wechat-bubble -right-[5px]' : 'border-r-[6px] border-r-white -left-[5px]'}`} />
        </div>
      ) : msg.type === 'red_packet' ? (
          <div className="bg-[#FA9D3B] w-60 rounded-lg overflow-hidden cursor-pointer active:brightness-95">
             <div className="flex items-center p-3">
                 <div className="w-10 h-12 bg-[#E75E58] rounded flex items-center justify-center text-yellow-200">
                    <IconRedPacket />
                 </div>
                 <div className="ml-3 text-white">
                     <div className="text-base font-medium">{msg.content || 'Best Wishes'}</div>
                     <div className="text-xs opacity-80">WeChat Red Packet</div>
                 </div>
             </div>
             <div className="bg-white px-3 py-1 text-[10px] text-gray-400">WeChat Red Packet</div>
          </div>
      ) : msg.type === 'transfer' ? (
          <div className={`w-60 rounded-lg overflow-hidden cursor-pointer active:brightness-95 ${msg.status === 'accepted' ? 'bg-[#F5F5F5] border border-gray-200' : 'bg-[#FA9D3B]'}`}>
             <div className="flex items-center p-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl ${msg.status === 'accepted' ? 'bg-[#E5E5E5]' : 'bg-white/20'}`}>
                    {msg.status === 'accepted' ? '✔' : <IconTransfer />}
                 </div>
                 <div className={`ml-3 ${msg.status === 'accepted' ? 'text-gray-800' : 'text-white'}`}>
                     <div className="text-base font-medium">¥{msg.amount}</div>
                     <div className="text-xs opacity-80">{msg.status === 'accepted' ? 'Received' : 'Transfer'}</div>
                 </div>
             </div>
             <div className="bg-white px-3 py-1 text-[10px] text-gray-400 border-t border-gray-100">WeChat Transfer</div>
          </div>
      ) : (
          <div className="bg-gray-100 p-2 rounded text-black">[Unknown Message]</div>
      );
      
      return content;
  };

  if (!targetName) return <div>Chat not found</div>;

  return (
    <div className="flex flex-col h-full bg-wechat-bg">
      <Header 
        title={targetName} 
        onBack={onBack} 
        rightAction={<div onClick={() => onNavigate({ type: 'CHAT_INFO', id, chatType })} className="cursor-pointer p-2"><IconMore /></div>} 
      />
      
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar pb-[env(safe-area-inset-bottom)]" ref={scrollRef}>
        {history.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          const sender = getUser(msg.senderId); // Get sender info even if they are strangers
          
          if (msg.type === 'system') return <div key={msg.id}>{renderMessageContent(msg, false)}</div>;

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start mb-4`}>
              {!isMe && (
                <img 
                    src={sender?.avatar} 
                    className="w-10 h-10 rounded-md mr-2 cursor-pointer bg-gray-300"
                    onClick={() => onNavigate({ type: 'USER_PROFILE', userId: msg.senderId })}
                />
              )}
              
              <div className={`max-w-[75%] relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Show Sender Name in Group Chat if not Me */}
                {chatType === 'group' && !isMe && (
                    <span className="text-xs text-gray-400 mb-1 ml-1">{sender?.name}</span>
                )}
                {renderMessageContent(msg, isMe)}
              </div>

              {isMe && (
                <img 
                    src={currentUser.avatar} 
                    className="w-10 h-10 rounded-md ml-2 cursor-pointer bg-gray-300" 
                    onClick={() => onNavigate({ type: 'MY_PROFILE' })}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#F7F7F7] border-t border-[#E5E5E5] shrink-0 pb-[env(safe-area-inset-bottom)]">
        <div className="p-2 flex items-center gap-2">
            <button onClick={() => { setIsAudioMode(!isAudioMode); setShowEmoji(false); setShowPlusMenu(false); }} className="text-gray-600 p-1">
                {isAudioMode ? <IconKeyboard /> : <IconVoice />}
            </button>
            
            {isAudioMode ? (
            <button className="flex-1 bg-white border border-gray-300 rounded-md py-2 text-center font-medium active:bg-gray-200" onMouseDown={(e) => { e.preventDefault(); handleSendAudio(t('voice_message')); }}>{t('hold_to_talk')}</button>
            ) : (
            <input 
                ref={inputRef}
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-base outline-none"
            />
            )}
            
            <button onClick={toggleEmoji} className="p-1"><IconFace /></button>
            {inputText && !isAudioMode ? (
                 <button onClick={handleSend} className="bg-wechat-green text-white px-3 py-1.5 rounded-md text-sm">{t('send')}</button>
            ) : (
                <button onClick={togglePlusMenu} className="p-1"><IconPlus /></button>
            )}
        </div>

        {/* Emoji Panel */}
        {showEmoji && (
            <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] overflow-y-auto grid grid-cols-8 gap-2 p-4">
                {EMOJIS.map((e, i) => <button key={i} onClick={() => setInputText(p => p+e)} className="text-2xl hover:bg-white rounded">{e}</button>)}
            </div>
        )}

        {/* Plus Menu Panel */}
        {showPlusMenu && (
             <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] p-6">
                 <div className="grid grid-cols-4 gap-6">
                     <div onClick={() => onNavigate({ type: 'MONEY_RED_PACKET', userId: id })} className="flex flex-col items-center gap-2 cursor-pointer">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconRedPacket /></div>
                         <span className="text-xs text-gray-500">Red Packet</span>
                     </div>
                     <div onClick={() => onNavigate({ type: 'MONEY_TRANSFER', userId: id })} className="flex flex-col items-center gap-2 cursor-pointer">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconTransfer /></div>
                         <span className="text-xs text-gray-500">Transfer</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 cursor-pointer">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconCamera /></div>
                         <span className="text-xs text-gray-500">Camera</span>
                     </div>
                      <div className="flex flex-col items-center gap-2 cursor-pointer">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50">📍</div>
                         <span className="text-xs text-gray-500">Location</span>
                     </div>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};