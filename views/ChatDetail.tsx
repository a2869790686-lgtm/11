
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

const EMOJIS = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "🙏", "👍", "👎", "👊", "👌", "💪", "👏", "🙌", "👐", "👋", "💋", "💘", "❤️", "💓", "💔", "💕", "💖", "💗", "💙", "💚", "💛", "💜", "🖤", "💝", "💞", "💟"];

// --- ADVANCED AI ENGINE (SIMULATED) ---

type Intent = 'GREETING' | 'QUESTION' | 'AFFECTION' | 'COMPLAINT' | 'MONEY' | 'FOOD' | 'WORK' | 'ACG' | 'WEATHER' | 'STOCK' | 'NEWS' | 'JOKE' | 'UNKNOWN';

// 1. Simulated Network Knowledge Base
const MOCK_NETWORK_DATA = {
    WEATHER: ["今天晴转多云，25°C，适合出门走走。", "外面下雨了，出门记得带伞哦 ☔️", "今天气温骤降，注意保暖！❄️", "风和日丽，是个好天气。☀️"],
    STOCK: ["大盘今天跌惨了... 📉", "茅台又涨了！🚀", "科技股全线飘红，牛市来了？", "别提了，我的基金已经亏了20%了... 😭"],
    NEWS: ["震惊！某知名科技公司发布了颠覆性AI产品！", "最新消息：下周一开始油价下调。", "本地新闻：地铁10号线即将开通。", "娱乐圈大瓜：某顶流塌房了！🍉"],
    JOKE: ["有一天，0对8说：胖就胖呗，还系什么腰带。", "程序员最讨厌的地方是哪里？酒吧，因为里面有太多Foo和Bar。", "为什么企鹅只有肚子是白的？因为手短洗不到后背。"],
    FACT: ["你知道吗？章鱼有三颗心脏。", "冷知识：猪无法抬头看天空。", "人体最强壮的肌肉是舌头。"]
};

const analyzeIntent = (text: string): Intent => {
    const t = text.toLowerCase();
    // Network / Knowledge Queries
    if (t.includes('天气') || t.includes('weather') || t.includes('下雨') || t.includes('温度')) return 'WEATHER';
    if (t.includes('股票') || t.includes('基金') || t.includes('stock') || t.includes('大盘') || t.includes('涨') || t.includes('跌')) return 'STOCK';
    if (t.includes('新闻') || t.includes('news') || t.includes('发生什么') || t.includes('瓜')) return 'NEWS';
    if (t.includes('笑话') || t.includes('joke') || t.includes('讲个') || t.includes('funny')) return 'JOKE';
    
    // Emotional / Context Queries
    if (t.includes('你好') || t.includes('hello') || t.includes('hi') || t.includes('zao') || t.includes('早') || t.includes('hey')) return 'GREETING';
    if (t.includes('?') || t.includes('？') || t.includes('什么') || t.includes('what') || t.includes('吗') || t.includes('how')) return 'QUESTION';
    if (t.includes('爱') || t.includes('love') || t.includes('喜欢') || t.includes('miss') || t.includes('想你') || t.includes('like')) return 'AFFECTION';
    if (t.includes('钱') || t.includes('money') || t.includes('转账') || t.includes('pay') || t.includes('贵') || t.includes('buy')) return 'MONEY';
    if (t.includes('累') || t.includes('烦') || t.includes('难过') || t.includes('tired') || t.includes('sad') || t.includes('emo') || t.includes('cry')) return 'COMPLAINT';
    if (t.includes('吃') || t.includes('饭') || t.includes('food') || t.includes('饿') || t.includes('drink') || t.includes('tea')) return 'FOOD';
    if (t.includes('加班') || t.includes('工作') || t.includes('work') || t.includes('job') || t.includes('meeting') || t.includes('busy')) return 'WORK';
    if (t.includes('二次元') || t.includes('动漫') || t.includes('anime') || t.includes('game') || t.includes('cosplay')) return 'ACG';
    
    return 'UNKNOWN';
};

// 2. Persona Definition
interface PersonaResponse extends Record<Intent, string[]> {}

const DEFAULT_RESPONSES: PersonaResponse = {
    WEATHER: MOCK_NETWORK_DATA.WEATHER,
    STOCK: MOCK_NETWORK_DATA.STOCK,
    NEWS: MOCK_NETWORK_DATA.NEWS,
    JOKE: MOCK_NETWORK_DATA.JOKE,
    GREETING: ["你好呀！👋", "在呢，咋啦？", "嗨~ 😄", "好久不见！"],
    QUESTION: ["这个问题我也在想... 🤔", "你猜？😜", "我也不是很清楚哎。", "这个嘛..."],
    AFFECTION: ["谢谢你！❤️", "比心 💕", "我也很开心。", "嘿嘿 😊"],
    COMPLAINT: ["摸摸头，都会过去的。🫂", "抱抱~", "别太往心里去。", "心疼你 🥺"],
    MONEY: ["谈钱伤感情嘛~ 😂", "收到收到！💰", "哈哈，老板大气！👍"],
    FOOD: ["听起来很好吃！🤤", "我也饿了...", "下次一起去吃！🥘", "深夜放毒？"],
    WORK: ["加油打工人！💪", "注意休息哦。", "别太拼了。", "摸鱼快乐 🐟"],
    ACG: ["这个我不太懂哎。", "好像很有趣的样子。", "哈哈。", "确实。"],
    UNKNOWN: ["嗯嗯。", "确实。", "哈哈，是吗？", "然后呢？", "[表情包]", "了解。"]
};

// Character Specific Overrides
const PERSONA_DB: Record<string, Partial<PersonaResponse>> = {
    '2': { // Mom
        WEATHER: ["不管天气咋样，多穿点总没错！🧣", "天气预报说要下雨，别乱跑。", "记得带伞！"],
        STOCK: ["别炒股了，踏踏实实存钱！🏦", "隔壁王阿姨也亏了，你赶紧退出来吧。", "我不懂这些，你小心被骗。"],
        GREETING: ["儿砸，吃饭了吗？🥣", "在忙吗？", "妈妈想你了。❤️"],
        QUESTION: ["问你爸去。👴", "妈也不懂这些，你这孩子。", "什么时候带女朋友回来？💑"],
        AFFECTION: ["妈也爱你，多穿点衣服。", "傻孩子。", "家里永远是你的港湾。🏠"],
        COMPLAINT: ["哎哟，别太累着自己。", "多喝热水。☕", "实在不行就回家，妈养你。"],
        MONEY: ["钱够不够花？妈给你转。💸", "省着点花，别老点外卖。"],
        FOOD: ["别老吃垃圾食品！🚫", "记得吃早饭！", "妈给你包了饺子。🥟"]
    },
    '3': { // Boss
        WEATHER: ["不管刮风下雨，别迟到就行。", "天气不错，适合跑业务。"],
        STOCK: ["心思放在工作上，别老看盘。", "大环境不好，更要努力工作。📉"],
        WORK: ["这个PPT还要改。", "周一例会汇报一下。📅", "客户那边怎么说？", "进度如何？"],
        COMPLAINT: ["克服一下困难。", "年轻人要多吃苦。", "不要带情绪工作。🚫"],
        UNKNOWN: ["抓紧落实。", "以结果为导向。", "收到。"]
    },
    '8': { // Wife
        WEATHER: ["下雨了，你来接我好不好？🥺", "今天天气真好，周末去野餐吧！🥪"],
        STOCK: ["赚了钱记得给我买包包！👜", "亏了？今晚别想上床睡觉！😡"],
        GREETING: ["老公~ ❤️", "亲爱的在干嘛？", "想你了嘛~ 😘"],
        AFFECTION: ["爱你爱你！么么哒！💋", "老公最好了！", "比心心 ❤️"],
        COMPLAINT: ["抱抱老公~ 🫂", "谁欺负你了？我帮你骂他！😡", "回来给你做好吃的。🍲"],
        MONEY: ["老公大气！买包包！👜", "谢谢老公~", "发工资啦？🤑"],
        FOOD: ["我想吃火锅！🍲", "晚上吃什么呀？", "我要喝奶茶！🧋"]
    },
    '10': { // Jack (Programmer)
        WEATHER: ["I don't go outside. 🏠", "Is it raining? My cloud server is fine."],
        STOCK: ["Crypto is the future. 🚀", "HODL!", "Tech stocks are dipping."],
        WORK: ["Still debugging... 🐛", "Merging PR now.", "Deploying to prod. 🚀", "Coffee first. ☕"],
        UNKNOWN: ["LGTM.", "Cool.", "Code looks good.", "Talk later, busy coding."]
    },
    '30': { // Madoka (Anime)
        WEATHER: ["即使下雨，心也要是晴天哦！☀️", "这种天气最适合喝茶吃蛋糕了！🍰"],
        GREETING: ["早安！今天也要加油哦！✨", "你好呀！(≧∇≦)/", "充满希望的一天！"],
        COMPLAINT: ["不要难过... 我会一直陪着你的。", "把悲伤都变成希望吧！", "抱抱~ (｡･ω･｡)ﾉ♡"],
        UNKNOWN: ["为了守护大家！🏹", "奇迹与魔法都是存在的！", "嗯！一起加油！"]
    }
};

const getSmartReply = (userId: string, userMessage: string): string => {
    const intent = analyzeIntent(userMessage);
    const persona = PERSONA_DB[userId];
    
    // 1. Check Persona specific intent
    if (persona && persona[intent] && persona[intent]!.length > 0) {
        const options = persona[intent]!;
        return options[Math.floor(Math.random() * options.length)];
    }

    // 2. Fallback to Default Knowledge Base / Intent
    const defaultOptions = DEFAULT_RESPONSES[intent] || DEFAULT_RESPONSES['UNKNOWN'];
    return defaultOptions[Math.floor(Math.random() * defaultOptions.length)];
};


export const ChatDetail = ({ id, chatType, onBack, onNavigate }: ChatDetailProps) => {
  const { friends, groups, currentUser, getChatHistory, addMessage, updateMessage, markAsRead, getUser, t } = useStore();
  const [inputText, setInputText] = useState('');
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  
  // Typing Indicator State
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Track the last message ID we initiated a reply for to prevent double-processing
  const lastProcessedMsgId = useRef<string | null>(null);
  
  // Track timers so we can clear them ONLY when switching chats or unmounting
  // NOT when the history updates (like read receipt updates)
  const activeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  
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
  }, [history, showEmoji, showPlusMenu, isTyping]); 

  // --- CLEANUP EFFECT ---
  // Only runs when 'id' changes (switching chats) or component unmounts
  useEffect(() => {
    return () => {
        activeTimers.current.forEach(clearTimeout);
        activeTimers.current = [];
        lastProcessedMsgId.current = null;
        setIsTyping(false);
    };
  }, [id]);

  // --- SMART AUTO-REPLY LOGIC ---
  useEffect(() => {
      // Only process auto-replies for 1-on-1 chats to avoid noise in groups
      if (chatType === 'user' && history.length > 0) {
           const lastMsg = history[history.length - 1];
           
           // If the last message is sent by ME (Current User)
           if (lastMsg.senderId === currentUser.id) {
               
               // 1. Prevent duplicate processing of the exact same message ID
               if (lastProcessedMsgId.current === lastMsg.id) return;
               
               // 2. Prevent replying to old messages (e.g. when revisiting a chat)
               // Only reply if message was sent in the last 60 seconds
               const timeDiff = Date.now() - lastMsg.timestamp;
               if (timeDiff > 60000) return;

               // Logic for Money/RedPacket remains same...
               if (lastMsg.type === 'transfer' && lastMsg.status !== 'accepted') {
                   lastProcessedMsgId.current = lastMsg.id;
                   const t = setTimeout(() => {
                       updateMessage(lastMsg.id, { status: 'accepted' });
                       addMessage({ id: `sys_${Date.now()}`, senderId: id, receiverId: currentUser.id, content: `对方已收款`, type: 'system', timestamp: Date.now(), read: true });
                   }, 2000);
                   activeTimers.current.push(t);
                   return;
               }

               // 3. Handle NORMAL TEXT CHAT Logic (Smart Engine)
               if (lastMsg.type === 'text' || lastMsg.type === 'audio') {
                   // Mark as processed immediately
                   lastProcessedMsgId.current = lastMsg.id;

                   // 1. Determine "Think Time" (Network simulation)
                   const thinkTime = Math.random() * 1000 + 500; // 0.5 - 1.5s
                   
                   const t1 = setTimeout(() => {
                       setIsTyping(true); // START TYPING
                       
                       // 2. Determine Reply Content
                       const replyContent = getSmartReply(id, lastMsg.content);
                       
                       // 3. Determine "Typing Time" based on length of reply
                       const typingTime = Math.min(3000, Math.max(1000, replyContent.length * 200));

                       const t2 = setTimeout(() => {
                           setIsTyping(false); // STOP TYPING
                           addMessage({
                               id: `rep_txt_${Date.now()}`,
                               senderId: id,
                               receiverId: currentUser.id,
                               content: replyContent,
                               type: 'text',
                               timestamp: Date.now(),
                               read: false
                           });
                       }, typingTime);
                       activeTimers.current.push(t2);

                   }, thinkTime);
                   activeTimers.current.push(t1);
               }
           } else {
             // If last message is NOT from me (i.e., it's a reply), ensure typing indicator is off
             setIsTyping(false);
           }
      }
      // Note: We deliberately do NOT include a cleanup function here that clears timers
      // because 'history' updates (like read receipt) shouldn't cancel the ongoing reply logic.
      // Cleanup is handled by the [id] effect above.
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
        title={targetName + (isTyping ? ' (Typing...)' : '')} 
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

        {/* Typing Bubble */}
        {isTyping && (
             <div className="flex justify-start items-start mb-4 animate-pulse">
                <img 
                    src={getUser(id)?.avatar} 
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
                         <span className="text-xs text-gray-500">{t('red_packet') || 'Red Packet'}</span>
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
