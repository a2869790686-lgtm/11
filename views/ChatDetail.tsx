
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState, Message } from '../types';
import { Header } from '../components/Layout';
import { IconVoice, IconKeyboard, IconMore, IconPlus, IconFace, IconRedPacket, IconTransfer } from '../components/Icons';
import { GoogleGenAI } from "@google/genai";

interface ChatDetailProps {
  id: string;
  chatType: 'user' | 'group';
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

const DEEPSEEK_PERSONAS: Record<string, string> = {
  charlie_su: "你是查理苏，极其华丽且自恋的天才医生。你爱叫对方‘未婚妻’。",
  sariel_qi: "你是齐司礼，高冷的设计师。你叫对方‘笨鸟’。",
  osborn_xiao: "你是萧逸，赛车手。你叫对方‘小朋友’。",
  evan_lu: "你是陆沉，CEO。你叫对方‘我的女孩’。",
  jesse_xia: "你是夏鸣星，偶像演员。你叫对方‘大小姐’。"
};

const getBubbleColor = (id: string, isMe: boolean) => {
  if (isMe) return 'bg-wechat-bubble border-transparent';
  switch (id) {
    case 'charlie_su': return 'bg-[#FFF9E6] border-[#F3D5A1]';
    case 'sariel_qi': return 'bg-[#F0F9F4] border-[#D1EBDC]';
    case 'osborn_xiao': return 'bg-[#F0F5FF] border-[#D0DFFF]';
    case 'evan_lu': return 'bg-[#F7F2FA] border-[#EBDFF3]';
    case 'jesse_xia': return 'bg-[#FFF7F0] border-[#FFEBD9]';
    default: return 'bg-white border-transparent';
  }
};

export const ChatDetail = ({ id, chatType, onBack, onNavigate }: ChatDetailProps) => {
  const { currentUser, getChatHistory, addMessage, markAsRead, getUser } = useStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const targetUser = getUser(id);
  const history = getChatHistory(id, chatType === 'group');

  useEffect(() => { markAsRead(id); }, [id, history.length, markAsRead]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history, isTyping]);

  // --- Use Gemini API for smart conversation reply ---
  const triggerAiReply = async (userMsg: string) => {
    if (chatType !== 'user') return;
    setIsTyping(true);
    
    const apiKey = process.env.API_KEY;
    const persona = DEEPSEEK_PERSONAS[id] || `你是好友${targetUser?.name}。`;
    
    try {
        const ai = new GoogleGenAI({ apiKey: apiKey || '' });
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `设定：${persona}
场景：正在微信聊天。
对方说：“${userMsg}”
回复要求：极其口语化，像真人回复，不要包含任何AI助手的迹象。字数限制在20字以内。`,
            config: {
                temperature: 0.9,
                topK: 64,
                topP: 0.95
            }
        });
        const text = response.text?.trim() || "收到，回头聊。";
        
        setTimeout(() => {
            setIsTyping(false);
            addMessage({ id: Date.now().toString(), senderId: id, receiverId: currentUser.id, content: text, type: 'text', timestamp: Date.now(), read: false });
        }, 1200 + Math.random() * 2000);
    } catch (e) {
        console.error("Gemini API Error:", e);
        setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const msg = inputText;
    addMessage({ id: Date.now().toString(), senderId: currentUser.id, receiverId: id, content: msg, type: 'text', timestamp: Date.now(), read: false });
    setInputText('');
    triggerAiReply(msg);
  };

  return (
    <div className="flex flex-col h-full bg-wechat-bg relative">
      <Header title={isTyping ? "对方正在输入..." : (targetUser?.name || "对话")} onBack={onBack} rightAction={<button onClick={() => onNavigate({ type: 'CHAT_INFO', id, chatType })}><IconMore /></button>} />
      
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar" ref={scrollRef}>
        {history.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          const sender = getUser(msg.senderId);
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start mb-4`}>
              {!isMe && (
                <img 
                    src={sender?.avatar} 
                    className="w-10 h-10 rounded-md mr-2 object-cover bg-gray-200 cursor-pointer" 
                    onClick={() => onNavigate({ type: 'USER_PROFILE', userId: msg.senderId })} 
                />
              )}
              <div className={`max-w-[75%] px-3 py-2 text-[15px] rounded-md shadow-sm border relative ${getBubbleColor(msg.senderId, isMe)}`}>
                  {msg.content}
                  <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent 
                      ${isMe ? 'border-l-[6px] border-l-wechat-bubble -right-[5px]' : `border-r-[6px] border-r-inherit -left-[5px]`}`} />
              </div>
              {isMe && (
                <img 
                    src={currentUser.avatar} 
                    className="w-10 h-10 rounded-md ml-2 object-cover bg-gray-200 cursor-pointer" 
                    onClick={() => onNavigate({ type: 'MY_PROFILE' })} 
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#F7F7F7] border-t px-2 py-2 flex items-center gap-2 pb-[env(safe-area-inset-bottom)] shrink-0">
            <button className="p-1"><IconVoice /></button>
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 outline-none text-[15px]" />
            <button className="p-1"><IconFace /></button>
            {inputText.trim() ? (
                <button onClick={handleSend} className="bg-wechat-green text-white px-4 py-1.5 rounded-md text-sm font-medium">发送</button>
            ) : (
                <button onClick={() => setShowPlusMenu(!showPlusMenu)} className="p-1"><IconPlus /></button>
            )}
      </div>

      {showPlusMenu && (
        <div className="bg-[#EDEDED] h-64 p-6 grid grid-cols-4 gap-6 animate-slide-up border-t border-gray-200">
          <div onClick={() => onNavigate({ type: 'MONEY_RED_PACKET', userId: id })} className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#F89D3C] shadow-sm"><IconRedPacket /></div>
            <span className="text-[11px] text-gray-500">红包</span>
          </div>
          <div onClick={() => onNavigate({ type: 'MONEY_TRANSFER', userId: id })} className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#10AEFF] shadow-sm"><IconTransfer /></div>
            <span className="text-[11px] text-gray-500">转账</span>
          </div>
        </div>
      )}
    </div>
  );
};
