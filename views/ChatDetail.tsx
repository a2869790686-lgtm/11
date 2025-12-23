
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
 * DeepSeek 对话驱动函数
 */
const callDeepSeekAI = async (targetUser: any, currentUser: any, history: Message[]) => {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
        return { text: "配置未生效：请在 Vercel 设置 API_KEY (sk-开头) 并重新部署" };
    }

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
                    {
                        role: "system",
                        content: `你现在是微信好友"${targetUser.name}"。你的签名是"${targetUser.signature || '生活很简单'}"。请用极其简短、口语化的中文回复我，就像在手机上发微信一样。适当使用表情符号，不要表现得像个AI机器人。`
                    },
                    ...history.slice(-6).map(m => ({
                        role: m.senderId === currentUser.id ? "user" : "assistant",
                        content: m.content
                    }))
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]) {
            return { text: data.choices[0].message.content };
        }
        return { text: "对方忙碌中..." };
    } catch (error) {
        console.error("DeepSeek Error:", error);
        return { text: "网络信号不太好..." };
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

  const handleMoneyClick = useCallback((msg: Message) => {
      if (msg.senderId === currentUser.id) return;
      if (msg.status === 'accepted' || msg.status === 'opened') return;

      if (msg.type === 'red_packet') {
          updateMessage(msg.id, { status: 'opened' });
          addMessage({
              id: `sys_rp_${Date.now()}`,
              senderId: 'system',
              receiverId: id,
              content: `你领取了${targetName}的红包`,
              type: 'system',
              timestamp: Date.now(),
              read: true
          });
      } else if (msg.type === 'transfer') {
          updateMessage(msg.id, { status: 'accepted' });
          addMessage({
              id: `sys_tr_${Date.now()}`,
              senderId: 'system',
              receiverId: id,
              content: `你已收款`,
              type: 'system',
              timestamp: Date.now(),
              read: true
          });
      }
  }, [currentUser.id, id, targetName, updateMessage, addMessage]);

  useEffect(() => {
      if (chatType === 'user' && history.length > 0) {
           const lastMsg = history[history.length - 1];
           if (lastMsg.senderId === currentUser.id) {
               if (lastProcessedMsgId.current === lastMsg.id) return;
               lastProcessedMsgId.current = lastMsg.id;

               const t1 = setTimeout(() => setIsTyping(true), 1000);
               activeTimers.current.push(t1);

               const triggerAI = async () => {
                    const { text } = await callDeepSeekAI(targetUser, currentUser, history);
                    const typingTime = Math.min(2500, Math.max(800, text.length * 100));
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
  }, [history, chatType, currentUser.id, id, targetUser, targetName, addMessage]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage({ id: Date.now().toString(), senderId: currentUser.id, receiverId: id, content: inputText, type: 'text', timestamp: Date.now(), read: false });
    setInputText('');
    setShowEmoji(false);
    setShowPlusMenu(false);
  };

  const renderMessageContent = (msg: Message, isMe: boolean) => {
      if (msg.type === 'system') return <div className="flex justify-center w-full my-2"><span className="bg-[#DADADA] text-white text-[11px] px-2 py-0.5 rounded-sm">{msg.content}</span></div>;
      
      const content = msg.type === 'text' ? (
          <div className={`px-3 py-2 text-[15px] rounded-md shadow-sm break-words relative max-w-full ${isMe ? 'bg-wechat-bubble text-black' : 'bg-white text-black'}`}>
            <div className="whitespace-pre-wrap">{msg.content}</div>
            <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ${isMe ? 'border-l-[6px] border-l-wechat-bubble -right-[4.5px]' : 'border-r-[6px] border-r-white -left-[4.5px]'}`} />
          </div>
      ) : msg.type === 'red_packet' ? (
          <div 
            onClick={() => handleMoneyClick(msg)}
            className={`w-60 rounded-lg overflow-hidden cursor-pointer transition-all ${msg.status === 'opened' ? 'opacity-70 grayscale-[0.3]' : 'active:brightness-95 bg-[#FA9D3B]'}`}
          >
             <div className={`flex items-center p-3 ${msg.status === 'opened' ? 'bg-[#fcdab2]' : 'bg-[#FA9D3B]'}`}>
                 <div className={`w-10 h-12 rounded flex items-center justify-center text-yellow-200 ${msg.status === 'opened' ? 'bg-[#f1c48e]' : 'bg-[#E75E58]'}`}>
                    <IconRedPacket />
                 </div>
                 <div className={`ml-3 ${msg.status === 'opened' ? 'text-[#8b5e2a]' : 'text-white'}`}>
                     <div className="text-base font-medium">{msg.status === 'opened' ? '红包已被领取' : (msg.content || '恭喜发财')}</div>
                     <div className="text-xs opacity-80">微信红包</div>
                 </div>
             </div>
             <div className="bg-white px-3 py-1 text-[10px] text-gray-400">微信红包</div>
          </div>
      ) : msg.type === 'transfer' ? (
          <div 
            onClick={() => handleMoneyClick(msg)}
            className={`w-60 rounded-lg overflow-hidden cursor-pointer transition-all ${msg.status === 'accepted' ? 'bg-[#F5F5F5] border border-gray-200' : 'bg-[#FA9D3B] active:brightness-95'}`}
          >
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
      ) : null;
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
            {isAudioMode ? (
                <button className="flex-1 bg-white border border-gray-300 rounded-md py-2 text-center font-medium active:bg-gray-200">按住 说话</button>
            ) : (
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-base outline-none focus:border-green-500" />
            )}
            <button onClick={() => { setShowEmoji(!showEmoji); setShowPlusMenu(false); }} className="p-1"><IconFace /></button>
            {inputText ? <button onClick={handleSend} className="bg-wechat-green text-white px-3 py-1.5 rounded-md text-sm">发送</button> : <button onClick={() => { setShowPlusMenu(!showPlusMenu); setShowEmoji(false); }} className="p-1"><IconPlus /></button>}
        </div>
        {showEmoji && <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] overflow-y-auto grid grid-cols-8 gap-2 p-4">{EMOJIS.map((e, i) => <button key={i} onClick={() => setInputText(p => p+e)} className="text-2xl hover:bg-white rounded transition-colors">{e}</button>)}</div>}
        {showPlusMenu && (
             <div className="h-[250px] bg-[#EDEDED] border-t border-[#DCDCDC] p-6 animate-slide-up">
                 <div className="grid grid-cols-4 gap-6">
                     <div onClick={() => onNavigate({ type: 'MONEY_RED_PACKET', userId: id })} className="flex flex-col items-center gap-2 cursor-pointer"><div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconRedPacket /></div><span className="text-xs text-gray-500">红包</span></div>
                     <div onClick={() => onNavigate({ type: 'MONEY_TRANSFER', userId: id })} className="flex flex-col items-center gap-2 cursor-pointer"><div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconTransfer /></div><span className="text-xs text-gray-500">转账</span></div>
                     <div className="flex flex-col items-center gap-2 cursor-pointer"><div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50"><IconCamera /></div><span className="text-xs text-gray-500">拍摄</span></div>
                     <div className="flex flex-col items-center gap-2 cursor-pointer"><div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50">📍</div><span className="text-xs text-gray-500">位置</span></div>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
};
