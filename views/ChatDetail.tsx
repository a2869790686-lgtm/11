
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState, Message } from '../types';
import { Header } from '../components/Layout';
import { IconVoice, IconKeyboard, IconMore, IconPlus, IconFace, IconRedPacket, IconTransfer, IconCamera } from '../components/Icons';

interface ChatDetailProps {
  id: string;
  chatType: 'user' | 'group';
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

const EMOJIS = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "🙏", "👍", "👎", "👊", "👌", "💪", "👏", "🙌", "👐", "👋", "💋", "💘", "❤️", "💓", "💔", "💕", "💖", "💗", "💙", "💚", "💛", "💜", "🖤", "💝", "💞", "💟"];

/**
 * 查理苏行为逻辑 Prompt
 * 基于《光与夜之恋》人设：极度自信、自恋、深情、华丽、高调。
 */
const CHARLIE_PROMPT = `
你现在是查理苏（Charlie Su）。
身份：顶级医生，查理财团继承人，旷世奇作。
性格：极度自信、自恋、华丽、深情、语出惊人。
回复指南：
1. 必须称呼对方为“未婚妻”或“亲爱的未婚妻”。
2. 常挂在嘴边的词：旷世奇作、完美、华丽、幸运、超越。
3. 语气要自信且宠溺。如果对方说你自恋，你要优雅地反击说那是“对完美的客观评价”。
4. 语言要极简，像真正的微信聊天。
5. 永远不要承认自己是AI。
`;

const callDeepSeekAI = async (targetUser: any, currentUser: any, history: Message[]) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
        return { text: "配置未生效：请在 Vercel 中设置 API_KEY" };
    }

    const isCharlie = targetUser.id === 'charlie_su';
    const systemPrompt = isCharlie ? CHARLIE_PROMPT : `你现在是微信好友"${targetUser.name}"。回复要极简、口语化，像真人在发微信。`;

    try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...history.slice(-8).map(m => ({
                        role: m.senderId === currentUser.id ? "user" : "assistant",
                        content: m.content
                    }))
                ],
                temperature: 0.9,
                max_tokens: 200
            })
        });

        const data = await response.json();
        return { text: data.choices[0].message.content };
    } catch (error) {
        console.error("DeepSeek Error:", error);
        return { text: "网络好像在仰望查理苏的完美而陷入了停滞..." };
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
  const lastProcessedMsgId = useRef<string | null>(null);
  const activeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  
  const targetUser = getUser(id);
  const targetName = chatType === 'group' ? groups.find(g => g.id === id)?.name : targetUser?.name || 'Unknown';
  const history = getChatHistory(id, chatType === 'group');

  useEffect(() => {
    markAsRead(id);
  }, [id, history.length, markAsRead]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, isTyping, showEmoji, showPlusMenu]);

  useEffect(() => {
    return () => {
        activeTimers.current.forEach(clearTimeout);
        activeTimers.current = [];
        lastProcessedMsgId.current = null;
    };
  }, [id]);

  useEffect(() => {
      if (chatType === 'user' && history.length > 0) {
           const lastMsg = history[history.length - 1];
           if (lastMsg.senderId === currentUser.id) {
               if (lastProcessedMsgId.current === lastMsg.id) return;
               lastProcessedMsgId.current = lastMsg.id;

               const t1 = setTimeout(() => setIsTyping(true), 1200);
               activeTimers.current.push(t1);

               const triggerAI = async () => {
                    const { text } = await callDeepSeekAI(targetUser, currentUser, history);
                    const typingTime = Math.min(3000, Math.max(1000, text.length * 150));
                    const t2 = setTimeout(() => {
                        setIsTyping(false);
                        addMessage({ 
                            id: `rep_ai_${Date.now()}`, 
                            senderId: id, 
                            receiverId: currentUser.id, 
                            content: text, 
                            type: 'text', 
                            timestamp: Date.now(), 
                            read: false 
                        });
                    }, typingTime);
                    activeTimers.current.push(t2);
               };
               triggerAI();
           } else {
             setIsTyping(false);
           }
      }
  }, [history, chatType, currentUser.id, id, targetUser, addMessage]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage({ id: Date.now().toString(), senderId: currentUser.id, receiverId: id, content: inputText, type: 'text', timestamp: Date.now(), read: false });
    setInputText('');
    setShowEmoji(false);
    setShowPlusMenu(false);
  };

  const renderMessageContent = (msg: Message, isMe: boolean) => {
      if (msg.type === 'system') return <div className="flex justify-center w-full my-2"><span className="bg-[#DADADA] text-white text-[11px] px-2 py-0.5 rounded-sm">{msg.content}</span></div>;
      
      const isCharlie = msg.senderId === 'charlie_su';
      
      const content = (
          <div className={`px-3 py-2 text-[15px] rounded-md shadow-sm break-words relative max-w-full 
              ${isMe ? 'bg-wechat-bubble text-black' : (isCharlie ? 'bg-[#FFF9E6] border border-[#F3D5A1] text-black' : 'bg-white text-black')}`}>
            <div className="whitespace-pre-wrap">{msg.content}</div>
            {/* 气泡尖角 */}
            <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent 
                ${isMe ? 'border-l-[6px] border-l-wechat-bubble -right-[4.5px]' : `border-r-[6px] ${isCharlie ? 'border-r-[#FFF9E6]' : 'border-r-white'} -left-[4.5px]`}`} 
            />
          </div>
      );
      return content;
  };

  return (
    <div className="flex flex-col h-full bg-wechat-bg">
      <Header 
        title={isTyping ? "对方正在输入..." : targetName} 
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
              {!isMe && <img src={sender?.avatar} className="w-10 h-10 rounded-md mr-2 cursor-pointer bg-gray-200 shadow-sm" onClick={() => onNavigate({ type: 'USER_PROFILE', userId: msg.senderId })} />}
              <div className={`max-w-[75%] relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {chatType === 'group' && !isMe && <span className="text-xs text-gray-400 mb-1 ml-1">{sender?.name}</span>}
                {renderMessageContent(msg, isMe)}
              </div>
              {isMe && <img src={currentUser.avatar} className="w-10 h-10 rounded-md ml-2 cursor-pointer bg-gray-200 shadow-sm" onClick={() => onNavigate({ type: 'MY_PROFILE' })} />}
            </div>
          );
        })}
        {isTyping && (
             <div className="flex justify-start items-start mb-4">
                <img src={targetUser?.avatar} className="w-10 h-10 rounded-md mr-2 bg-gray-200 shadow-sm" />
                <div className="bg-white px-3 py-2 rounded-md shadow-sm flex items-center space-x-1 h-9 relative">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    <div className="absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-white -left-[4.5px]" />
                </div>
             </div>
        )}
      </div>

      <div className="bg-[#F7F7F7] border-t border-[#E5E5E5] shrink-0 pb-[env(safe-area-inset-bottom)]">
        <div className="p-2 flex items-center gap-2">
            <button onClick={() => setIsAudioMode(!isAudioMode)} className="text-gray-600 p-1">{isAudioMode ? <IconKeyboard /> : <IconVoice />}</button>
            <input 
                type="text" 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-base outline-none focus:border-green-500" 
            />
            <button onClick={() => { setShowEmoji(!showEmoji); setShowPlusMenu(false); }} className="p-1"><IconFace /></button>
            {inputText ? <button onClick={handleSend} className="bg-wechat-green text-white px-3 py-1.5 rounded-md text-sm">发送</button> : <button onClick={() => { setShowPlusMenu(!showPlusMenu); setShowEmoji(false); }} className="p-1"><IconPlus /></button>}
        </div>
        {showEmoji && <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] overflow-y-auto grid grid-cols-8 gap-2 p-4">{EMOJIS.map((e, i) => <button key={i} onClick={() => setInputText(p => p+e)} className="text-2xl hover:bg-white rounded transition-colors">{e}</button>)}</div>}
      </div>
    </div>
  );
};
