
import React from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';
import { IconPlus } from '../components/Icons';

interface ChatInfoProps {
  id: string; // Group ID or User ID
  chatType: 'user' | 'group';
  onBack: () => void;
  onNavigate: (view: ViewState) => void;
}

export const ChatInfo = ({ id, chatType, onBack, onNavigate }: ChatInfoProps) => {
  const { groups, friends, getUser, currentUser, stickyChatIds, toggleStickyChat } = useStore();

  let members: string[] = [];
  let name = '';

  if (chatType === 'group') {
      const group = groups.find(g => g.id === id);
      if (group) {
          members = group.members;
          name = group.name;
      }
  } else {
      // 1-on-1
      members = [currentUser.id, id];
      const friend = friends.find(f => f.id === id);
      name = friend?.name || 'Chat Info';
  }

  const isSticky = stickyChatIds.includes(id);

  return (
      <div className="flex flex-col h-full bg-[#EDEDED]">
          <Header title={`Chat Info (${members.length})`} onBack={onBack} />
          <ScrollArea className="bg-[#EDEDED]">
              <div className="bg-white p-4 mb-2 flex flex-wrap gap-4">
                  {members.map(memberId => {
                      const user = getUser(memberId);
                      return (
                          <div key={memberId} className="flex flex-col items-center w-16">
                              <img 
                                  src={user?.avatar} 
                                  className="w-12 h-12 rounded-lg mb-1 object-cover bg-gray-200 cursor-pointer" 
                                  onClick={() => onNavigate({ type: 'USER_PROFILE', userId: memberId })}
                              />
                              <span className="text-xs text-gray-500 truncate w-full text-center">{user?.name}</span>
                          </div>
                      );
                  })}
                  <div className="flex flex-col items-center w-16">
                      <div className="w-12 h-12 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400 cursor-pointer">
                          <IconPlus />
                      </div>
                  </div>
              </div>

              <div className="bg-white mb-2">
                   <div className="px-4 py-3 border-b border-gray-100 flex justify-between">
                       <span className="text-base text-black">Chat Name</span>
                       <span className="text-gray-400 text-sm truncate max-w-[150px]">{name} &gt;</span>
                   </div>
                   <div className="px-4 py-3 border-b border-gray-100 flex justify-between">
                       <span className="text-base text-black">QR Code</span>
                       <span className="text-gray-400 text-sm"> &gt;</span>
                   </div>
              </div>

              <div className="bg-white mb-2">
                   <div className="px-4 py-3 flex justify-between items-center">
                       <span className="text-base text-black">Mute Notifications</span>
                       <div className="w-10 h-6 bg-gray-300 rounded-full relative"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow"></div></div>
                   </div>
                   <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                       <span className="text-base text-black">Sticky on Top (置顶聊天)</span>
                       <div 
                        onClick={() => toggleStickyChat(id)}
                        className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${isSticky ? 'bg-wechat-green' : 'bg-gray-300'}`}
                       >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${isSticky ? 'left-[18px]' : 'left-0.5'}`}></div>
                       </div>
                   </div>
              </div>

              <div className="px-4 py-3 bg-white text-center text-red-500 text-base font-medium mb-8 cursor-pointer active:bg-gray-50">
                  {chatType === 'group' ? 'Delete and Leave' : 'Clear Chat History'}
              </div>
          </ScrollArea>
      </div>
  );
};
