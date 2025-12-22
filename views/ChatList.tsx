
import React from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';
import { ScrollArea } from '../components/Layout';
import { IconPlus, IconSearchDiscover } from '../components/Icons';

interface ChatListProps {
  onNavigate: (view: ViewState) => void;
}

const formatTime = (ts: number) => {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  }
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
};

export const ChatList = ({ onNavigate }: ChatListProps) => {
  const { getChatSessions, t } = useStore();
  const sessions = getChatSessions();

  // 模拟置顶：ID为 3, 8, g1 的设为置顶背景色
  const stickyIds = ['3', '8', 'g1'];

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
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-gray-400 mt-20">
            暂无消息
          </div>
        ) : (
          sessions.map(session => {
            const isSticky = stickyIds.includes(session.id);
            return (
              <div 
                key={session.id}
                onClick={() => onNavigate({ type: 'CHAT_DETAIL', id: session.id, chatType: session.type })}
                className={`flex items-center px-4 py-3 border-b border-wechat-divider cursor-pointer active:bg-gray-200 transition-colors ${isSticky ? 'bg-[#F7F7F7]' : 'bg-white'}`}
              >
                <div className="relative shrink-0">
                  <img src={session.avatar} alt={session.name} className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                  {session.unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border border-white">
                      {session.unreadCount > 99 ? '99+' : session.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-base font-medium text-black truncate">{session.name}</h3>
                    {session.lastMessage && (
                      <span className="text-[10px] text-gray-400 ml-2 whitespace-nowrap">
                        {formatTime(session.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {session.lastMessage 
                      ? (session.lastMessage.type === 'audio' ? '[语音消息]' : 
                         session.lastMessage.type === 'red_packet' ? '[微信红包]' : 
                         session.lastMessage.type === 'transfer' ? '[微信转账]' :
                         session.lastMessage.content) 
                      : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div className="py-10 text-center text-gray-300 text-xs">已加载全部消息</div>
      </ScrollArea>
    </div>
  );
};
