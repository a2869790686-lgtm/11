
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState, Message } from '../types';
import { Header } from '../components/Layout';
import { IconVoice, IconKeyboard, IconMore, IconPlus, IconFace, IconRedPacket, IconTransfer, IconCamera } from '../components/Icons';
import { GoogleGenAI } from "@google/genai";

interface ChatDetailProps {
  id: string; // userId or groupId
  chatType: 'user' | 'group';
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

const EMOJIS = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "🙏", "👍", "👎", "👊", "👌", "💪", "👏", "🙌", "👐", "👋", "💋", "💘", "❤️", "💓", "💔", "💕", "💖", "💗", "💙", "💚", "💛", "💜", "🖤", "💝", "💞", "💟"];

// --- GEMINI AI ENGINE ---

const callGeminiAI = async (targetUser: any, currentUser: any, history: Message[]) => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Build persona-based system instruction
        const systemInstruction = `
            You are ${targetUser.name} (WeChat ID: ${targetUser.wxid}) on a mobile messaging app called WeChat.
            Your relationship to the user is: ${targetUser.remark || 'Friend/Contact'}.
            Your personality/signature: "${targetUser.signature || 'Friendly and helpful'}".
            
            RULES:
            1. Respond in the language used by the user (usually Chinese or English).
            2. Keep responses CONCISE and MOBILE-FRIENDLY (1-3 sentences max). Use emojis naturally.
            3. Be human-like and stay in character. If you are "Mom", be caring. If you are "Boss", be professional.
            4. Use the provided Google Search tool for REAL-TIME information like weather, stocks, news, or factual questions.
            5. You are chatting with ${currentUser.name}.
        `;

        // Format history for context (last 5 messages)
        const chatContext = history.slice(-5).map(m => {
            const role = m.senderId === currentUser.id ? 'user' : 'model';
            return `${role === 'user' ? currentUser.name : targetUser.name}: ${m.content}`;
        }).join('\n');

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Context history:\n${chatContext}\n\nLast message from ${currentUser.name}: "${history[history.length-1].content}"`,
            config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
                temperature: 0.8,
            },
        });

        const text = response.text || "我还在想该怎么回你...";
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        return { text, sources };
    } catch (error) {
        console.error("AI Error:", error);
        return { text: "网络好像有点断断续续的...", sources: [] };
    }
};

export const ChatDetail = ({ id, chatType, onBack, onNavigate }: ChatDetailProps) => {
  const { friends, groups, currentUser, getChatHistory, addMessage, updateMessage, markAsRead, getUser, t } = useStore();
  const [inputText, setInputText] = useState('');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastProcessedMsgId = useRef<string | null>(null);
  const activeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  const targetUser = getUser(id);
  const targetName = chatType === 'group' 
      ? groups.find(g => g.id === id)?.name 
      : targetUser?.name || 'Unknown';

  const history = getChatHistory(id, chatType === 'group');

  useEffect(() => {
    markAsRead(id);
  }, [id, history.length, markAsRead]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, showEmoji, showPlusMenu, isTyping]); 

  useEffect(() => {
    return () => {
        activeTimers.current.forEach(clearTimeout);
        activeTimers.current = [];
        lastProcessedMsgId.current = null;
        setIsTyping(false);
    };
  }, [id]);

  // --- REFINED AI AUTO-REPLY EFFECT ---
  useEffect(() => {
      if (chatType === 'user' && history.length > 0) {
           const lastMsg = history[history.length - 1];
           
           if (lastMsg.senderId === currentUser.id) {
               if (lastProcessedMsgId.current === lastMsg.id) return;
               
               const timeDiff = Date.now() - lastMsg.timestamp;
               if (timeDiff > 60000) return;

               lastProcessedMsgId.current = lastMsg.id;

               // Special handle for Money/Transfers (Auto acceptance logic)
               if (lastMsg.type === 'transfer' && lastMsg.status !== 'accepted') {
                   const t = setTimeout(() => {
                       updateMessage(lastMsg.id, { status: 'accepted' });
                       addMessage({ id: `sys_${Date.now()}`, senderId: id, receiverId: currentUser.id, content: `对方已收款`, type: 'system', timestamp: Date.now(), read: true });
                   }, 2000);
                   activeTimers.current.push(t);
                   return;
               }

               // Handle Generic Messages with Gemini
               if (lastMsg.type === 'text' || lastMsg.type === 'audio') {
                   const triggerAI = async () => {
                        // Wait a bit to show "Typing..."
                        const t1 = setTimeout(() => setIsTyping(true), 800);
                        activeTimers.current.push(t1);

                        const { text, sources } = await callGeminiAI(targetUser, currentUser, history);

                        // Simulate more realistic typing time based on response length
                        const typingTime = Math.min(4000, Math.max(1500, text.length * 150));
                        
                        const t2 = setTimeout(() => {
                            setIsTyping(false);
                            
                            // Construct content with optional source links if grounding was used
                            let finalContent = text;
                            if (sources && sources.length > 0) {
                                const links = sources
                                    .filter((s: any) => s.web?.uri)
                                    .map((s: any) => `\n\n资料来源: ${s.web.title || '网页'} (${s.web.uri})`)
                                    .join('');
                                // Only add unique links or first few
                                if (links) finalContent += links;
                            }

                            addMessage({
                                id: `rep_ai_${Date.now()}`,
                                senderId: id,
                                receiverId: currentUser.id,
                                content: finalContent,
                                type: 'text',
                                timestamp: Date.now(),
                                read: false
                            });
                        }, typingTime);
                        activeTimers.current.push(t2);
                   };
                   triggerAI();
               }
           } else {
             setIsTyping(false);
           }
      }
  }, [history, chatType, currentUser.id, id]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: id,
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
            <div className="whitespace-pre-wrap">{msg.content}</div>
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
                     <div className="text-base font-medium">{msg.content || '恭喜发财'}</div>
                     <div className="text-xs opacity-80">微信红包</div>
                 </div>
             </div>
             <div className="bg-white px-3 py-1 text-[10px] text-gray-400">微信红包</div>
          </div>
      ) : msg.type === 'transfer' ? (
          <div className={`w-60 rounded-lg overflow-hidden cursor-pointer active:brightness-95 ${msg.status === 'accepted' ? 'bg-[#F5F5F5] border border-gray-200' : 'bg-[#FA9D3B]'}`}>
             <div className="flex items-center p-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl ${msg.status === 'accepted' ? 'bg-[#E5E5E5]' : 'bg-white/20'}`}>
                    {msg.status === 'accepted' ? '✔' : <IconTransfer />}
                 </div>
                 <div className={`ml-3 ${msg.status === 'accepted' ? 'text-gray-800' : 'text-white'}`}>
                     <div className="text-base font-medium">¥{msg.amount}</div>
                     <div className="text-xs opacity-80">{msg.status === 'accepted' ? '已收款' : '转账给你'}</div>
                 </div>
             </div>
             <div className="bg-white px-3 py-1 text-[10px] text-gray-400 border-t border-gray-100">微信转账</div>
          </div>
      ) : (
          <div className="bg-gray-100 p-2 rounded text-black">[未知消息]</div>
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
          const sender = getUser(msg.senderId);
          
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

        {isTyping && (
             <div className="flex justify-start items-start mb-4 animate-pulse">
                <img 
                    src={targetUser?.avatar} 
                    className="w-10 h-10 rounded-md mr-2 bg-gray-300"
                />
                <div className="bg-white text-gray-400 px-3 py-2 rounded-md rounded-tl-none shadow-sm flex items-center space-x-1 h-10">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
             </div>
        )}
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

        {showEmoji && (
            <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] overflow-y-auto grid grid-cols-8 gap-2 p-4">
                {EMOJIS.map((e, i) => <button key={i} onClick={() => setInputText(p => p+e)} className="text-2xl hover:bg-white rounded">{e}</button>)}
            </div>
        )}

        {showPlusMenu && (
             <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] p-6">
                 <div className="grid grid-cols-4 gap-6">
                     <div onClick={() => onNavigate({ type: 'MONEY_RED_PACKET', userId: id })} className="flex flex-col items-center gap-2 cursor-pointer">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconRedPacket /></div>
                         <span className="text-xs text-gray-500">红包</span>
                     </div>
                     <div onClick={() => onNavigate({ type: 'MONEY_TRANSFER', userId: id })} className="flex flex-col items-center gap-2 cursor-pointer">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconTransfer /></div>
                         <span className="text-xs text-gray-500">转账</span>
                     </div>
                     <div className="flex flex-col items-center gap-2 cursor-pointer">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconCamera /></div>
                         <span className="text-xs text-gray-500">拍摄</span>
                     </div>
                      <div className="flex flex-col items-center gap-2 cursor-pointer">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50">📍</div>
                         <span className="text-xs text-gray-500">位置</span>
                     </div>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};
