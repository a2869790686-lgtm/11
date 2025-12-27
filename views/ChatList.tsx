
import React from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';
import { ScrollArea } from '../components/Layout';
import { IconPlus, IconSearchDiscover } from '../components/Icons';

const MALE_LEADS = ['charlie_su', 'sariel_qi', 'osborn_xiao', 'evan_lu', 'jesse_xia'];

const formatTime = (ts: number) => {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return '昨天';
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
};

export const ChatList = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const { getChatSessions, t } = useStore();
  const sessions = getChatSessions();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-wechat-header h-14 px-4 flex items-center justify-between shrink-0 border-b border-wechat-divider sticky top-0 z-10">
        <span className="font-semibold text-lg">{t('wechat')}</span>
        <div className="flex gap-4">
           <button onClick={() => onNavigate({ type: 'DISCOVER_SEARCH' })}><IconSearchDiscover /></button>
           <button onClick={() => onNavigate({ type: 'ADD_FRIEND' })}><IconPlus /></button>
        </div>
      </div>
      
      <ScrollArea className="bg-white">
        {sessions.map(session => {
          const isSticky = MALE_LEADS.includes(session.id);
          return (
            <div 
              key={session.id}
              onClick={() => onNavigate({ type: 'CHAT_DETAIL', id: session.id, chatType: session.type })}
              className={`flex items-center px-4 py-3 border-b border-wechat-divider cursor-pointer active:bg-gray-100 transition-colors ${isSticky ? 'bg-[#F7F7F7]' : 'bg-white'}`}
            >
              <div className="relative shrink-0">
                <img 
                    src={session.avatar} 
                    className="w-12 h-12 rounded-lg object-cover bg-gray-200 shadow-sm" 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        onNavigate({ type: 'USER_PROFILE', userId: session.id }); 
                    }}
                />
                {session.unreadCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-[#FA5151] text-white text-[11px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border border-white px-1">
                    {session.unreadCount > 99 ? '99+' : session.unreadCount}
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className="text-[16px] font-medium text-black truncate" onClick={(e) => {
                      e.stopPropagation();
                      onNavigate({ type: 'USER_PROFILE', userId: session.id });
                  }}>{session.name}</h3>
                  <span className="text-[11px] text-gray-400 ml-2 whitespace-nowrap">
                    {session.lastMessage ? formatTime(session.lastMessage.timestamp) : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate leading-tight">
                    {session.lastMessage?.content || (isSticky ? '对方已有新的朋友圈动态' : '你可以开始聊天了')}
                </p>
              </div>
            </div>
          );
        })}
        <div className="py-12 text-center text-gray-300 text-xs tracking-widest bg-white">
          已加载全部消息
        </div>
      </ScrollArea>
    </div>
  );
};
