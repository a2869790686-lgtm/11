import React from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';
import { ScrollArea } from '../components/Layout';
import { IconPlus } from '../components/Icons';

interface ChatListProps {
  onNavigate: (view: ViewState) => void;
}

const formatTime = (ts: number) => {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
};

export const ChatList = ({ onNavigate }: ChatListProps) => {
  const { getChatSessions, friends } = useStore();
  const sessions = getChatSessions();

  return (
    <>
      <div className="bg-wechat-header h-14 px-4 flex items-center justify-between shrink-0 border-b border-wechat-divider sticky top-0 z-10">
        <span className="font-semibold text-lg">WeChat</span>
        <div className="flex gap-4">
          <button onClick={() => onNavigate({ type: 'ADD_FRIEND' })}>
            <IconPlus />
          </button>
        </div>
      </div>
      
      <ScrollArea className="bg-white">
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-gray-400 mt-20">
            No messages yet
          </div>
        ) : (
          sessions.map(session => {
            const friend = friends.find(f => f.id === session.userId);
            if (!friend) return null;
            return (
              <div 
                key={session.userId}
                onClick={() => onNavigate({ type: 'CHAT_DETAIL', userId: session.userId })}
                className="flex items-center px-4 py-3 bg-white hover:bg-gray-50 border-b border-wechat-divider cursor-pointer"
              >
                <div className="relative">
                  <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-lg object-cover" />
                  {session.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {session.unreadCount}
                    </div>
                  )}
                </div>
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-normal text-black truncate">{friend.name}</h3>
                    {session.lastMessage && (
                      <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                        {formatTime(session.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-0.5">
                    {session.lastMessage 
                      ? (session.lastMessage.type === 'audio' ? '[Voice Message]' : session.lastMessage.content) 
                      : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </ScrollArea>
    </>
  );
};
