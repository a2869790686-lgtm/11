
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState, Message } from '../types';
import { Header } from '../components/Layout';
import { IconVoice, IconKeyboard, IconMore, IconPlus, IconFace } from '../components/Icons';

interface ChatDetailProps {
  id: string;
  chatType: 'user' | 'group';
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

const EMOJIS = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "🙏", "👍", "👎", "👊", "👌", "💪", "👏", "🙌", "👐", "👋", "💋", "💘", "❤️", "💓", "💔", "💕", "💖", "💗", "💙", "💚", "💛", "💜", "🖤", "💝", "💞", "💟"];

const LEAD_PROMPTS: Record<string, string> = {
  charlie_su: `你现在是查理苏。身份：顶级医生，财团继承人。性格：极度自信、自恋、华丽。称呼：未婚妻。关键词：旷世奇作、完美、幸运。`,
  sariel_qi: `你现在是齐司礼。身份：顶级设计师。性格：高冷、毒舌、严谨、内心温柔。称呼：笨鸟。语气：嫌弃但关心，不要多废话。`,
  osborn_xiao: `你现在是萧逸。身份：赛车手、赏金猎人。性格：酷帅、叛逆、保护欲强。称呼：小朋友。关键词：兜风、速度、信任。`,
  evan_lu: `你现在是陆沉。身份：CEO。性格：优雅、博学、腹黑、深情。称呼：我的女孩。语气：温柔但有掌控欲，常带“您”或礼貌用语。`,
  jesse_xia: `你现在是夏鸣星。身份：知名演员、歌手。性格：元气、阳光、忠犬感、青梅竹马。称呼：大小姐。语气：撒娇、怀念童年、热情。`
};

const getBubbleColor = (id: string, isMe: boolean) => {
  if (isMe) return 'bg-wechat-bubble border-transparent';
  switch (id) {
    case 'charlie_su': return 'bg-[#FFF9E6] border-[#F3D5A1]'; // 金色
    case 'sariel_qi': return 'bg-[#F0F9F4] border-[#D1EBDC]'; // 淡绿/青
    case 'osborn_xiao': return 'bg-[#F0F5FF] border-[#D0DFFF]'; // 淡蓝
    case 'evan_lu': return 'bg-[#F7F2FA] border-[#EBDFF3]'; // 淡紫
    case 'jesse_xia': return 'bg-[#FFF7F0] border-[#FFEBD9]'; // 淡橙
    default: return 'bg-white border-transparent';
  }
};

const callDeepSeekAI = async (targetUser: any, currentUser: any, history: Message[]) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
        return { text: "配置未生效：请在 Vercel 中设置 API_KEY" };
    }

    const leadPrompt = LEAD_PROMPTS[targetUser.id];
    const systemPrompt = leadPrompt || `你现在是微信好友"${targetUser.name}"。回复要极简、口语化。`;

    try {
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt + " 回复字数必须在30字以内，符合微信聊天习惯。" },
                    ...history.slice(-6).map(m => ({ role: m.senderId === currentUser.id ? "user" : "assistant", content: m.content }))
                ],
                temperature: 0.8
            })
        });
        const data = await response.json();
        return { text: data.choices[0].message.content };
    } catch (error) {
        return { text: "网络信号暂时被我的魅力干扰了..." };
    }
};

export const ChatDetail = ({ id, chatType, onBack, onNavigate }: ChatDetailProps) => {
  const { currentUser, getChatHistory, addMessage, markAsRead, getUser } = useStore();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const targetUser = getUser(id);
  const targetName = targetUser?.name || 'Unknown';
  const history = getChatHistory(id, chatType === 'group');

  useEffect(() => { markAsRead(id); }, [id, history.length, markAsRead]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history, isTyping]);

  useEffect(() => {
      if (chatType === 'user' && history.length > 0) {
           const lastMsg = history[history.length - 1];
           if (lastMsg.senderId === currentUser.id) {
               setTimeout(() => setIsTyping(true), 1000);
               callDeepSeekAI(targetUser, currentUser, history).then(({ text }) => {
                    setTimeout(() => {
                        setIsTyping(false);
                        addMessage({ id: Date.now().toString(), senderId: id, receiverId: currentUser.id, content: text, type: 'text', timestamp: Date.now(), read: false });
                    }, 2000);
               });
           }
      }
  }, [history.length, id]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage({ id: Date.now().toString(), senderId: currentUser.id, receiverId: id, content: inputText, type: 'text', timestamp: Date.now(), read: false });
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-wechat-bg">
      <Header title={isTyping ? "对方正在输入..." : targetName} onBack={onBack} rightAction={<IconMore />} />
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar" ref={scrollRef}>
        {history.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          const sender = getUser(msg.senderId);
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-start mb-4`}>
              {!isMe && <img src={sender?.avatar} className="w-10 h-10 rounded-md mr-2 bg-gray-200" />}
              <div className={`max-w-[75%] px-3 py-2 text-[15px] rounded-md shadow-sm border relative ${getBubbleColor(msg.senderId, isMe)}`}>
                  {msg.content}
                  <div className={`absolute top-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent 
                      ${isMe ? 'border-l-[6px] border-l-wechat-bubble -right-[5px]' : `border-r-[6px] border-r-inherit -left-[5px]`}`} />
              </div>
              {isMe && <img src={currentUser.avatar} className="w-10 h-10 rounded-md ml-2 bg-gray-200" />}
            </div>
          );
        })}
      </div>
      <div className="bg-[#F7F7F7] border-t p-2 flex items-center gap-2 pb-[env(safe-area-inset-bottom)]">
            <IconVoice />
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 bg-white border rounded-md px-3 py-2 outline-none" />
            <IconFace />
            <button onClick={handleSend} className="bg-wechat-green text-white px-4 py-1.5 rounded-md text-sm">发送</button>
      </div>
    </div>
  );
};
