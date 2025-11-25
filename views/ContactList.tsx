

import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';
import { Header, ScrollArea } from '../components/Layout';
import { IconPlus, IconMore, IconGroup } from '../components/Icons';

interface ContactListProps {
  onNavigate: (view: ViewState) => void;
}

export const ContactList = ({ onNavigate }: ContactListProps) => {
  const { friends } = useStore();
  
  const sortedFriends = [...friends].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div className="bg-wechat-header h-14 px-4 flex items-center justify-between shrink-0 border-b border-wechat-divider sticky top-0 z-10">
        <span className="font-semibold text-lg">Contacts</span>
        <button onClick={() => onNavigate({ type: 'ADD_FRIEND' })}>
          <IconPlus />
        </button>
      </div>

      <ScrollArea className="bg-white">
        {/* Static Items */}
        <div className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider cursor-pointer active:bg-gray-100">
          <div className="w-10 h-10 rounded-md bg-orange-400 flex items-center justify-center text-white">
            <IconPlus />
          </div>
          <span className="ml-3 font-normal">New Friends</span>
        </div>
        <div 
            className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider cursor-pointer active:bg-gray-100"
            onClick={() => onNavigate({ type: 'GROUP_LIST' })}
        >
          <div className="w-10 h-10 rounded-md bg-green-500 flex items-center justify-center text-white">
            <IconGroup />
          </div>
          <span className="ml-3 font-normal">Group Chats</span>
        </div>
        <div className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider cursor-pointer active:bg-gray-100">
          <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center text-white">
            <span className="text-lg">🏷️</span>
          </div>
          <span className="ml-3 font-normal">Tags</span>
        </div>

        {/* Contact List */}
        <div className="bg-gray-100 px-4 py-1 text-xs text-gray-500">A</div>
        {sortedFriends.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No friends yet</div>
        ) : (
            sortedFriends.map(friend => (
                <div 
                  key={friend.id}
                  onClick={() => onNavigate({ type: 'USER_PROFILE', userId: friend.id })}
                  className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider active:bg-gray-100 cursor-pointer"
                >
                  <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-md object-cover bg-gray-200" />
                  <span className="ml-3 font-medium text-base">{friend.name}</span>
                </div>
            ))
        )}
      </ScrollArea>
    </>
  );
};

export const AddFriend = ({ onBack }: { onBack: () => void }) => {
    const { addFriend } = useStore();
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');

    const handleAdd = () => {
        if (phone.length < 3) return;
        const success = addFriend(phone);
        setStatus(success ? 'success' : 'fail');
        if (success) setTimeout(onBack, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-wechat-bg">
            <Header title="Add Contacts" onBack={onBack} />
            <div className="p-4">
               <div className="bg-white rounded-md flex items-center px-3 py-2">
                   <span className="text-gray-900 mr-2 w-6 text-center text-lg">🔍</span>
                   <input autoFocus type="tel" className="flex-1 outline-none text-base" placeholder="Account/Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
               </div>
               {phone.length > 0 && (
                 <div onClick={handleAdd} className="mt-4 bg-white p-4 flex items-center border-b border-gray-100 active:bg-gray-50 cursor-pointer">
                    <div className="w-10 h-10 bg-wechat-green rounded-md flex items-center justify-center text-white mr-3"><IconPlus /></div>
                    <div><p className="text-base text-black">Search: <span className="text-wechat-green">{phone}</span></p></div>
                 </div>
               )}
               {status === 'success' && <div className="mt-4 text-center text-wechat-green bg-green-100 p-2 rounded">Friend Added!</div>}
               {status === 'fail' && <div className="mt-4 text-center text-red-500">User already in contacts</div>}
            </div>
        </div>
    );
}

export const UserProfile = ({ userId, onBack, onNavigate }: { userId: string, onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { friends, deleteFriend, currentUser, getUser, addFriend } = useStore();
    // Use getUser to support strangers (e.g. from group chat)
    const user = getUser(userId);
    const isFriend = friends.some(f => f.id === userId);
    const isMe = userId === currentUser.id;

    if (!user) return <div>User not found</div>;

    const handleAdd = () => {
        // Mock add friend logic by ID/Phone (assuming user object has phone or we just direct add)
        addFriend(user.phone || user.id); // Simple mock
        // Force refresh or just navigate back
        alert("Friend Request Sent!");
        onBack();
    }

    return (
        <div className="flex flex-col h-full bg-wechat-bg">
            <Header title="" onBack={onBack} rightAction={<IconMore />} />
            <ScrollArea>
                <div className="bg-white p-5 flex items-start mb-2">
                    <img src={user.avatar} className="w-16 h-16 rounded-lg mr-4 bg-gray-200" />
                    <div>
                        <h2 className="text-xl font-bold mb-1 flex items-center">
                            {user.name}
                            {!isFriend && !isMe && <span className="ml-2 text-xs bg-gray-200 px-1 rounded text-gray-500">Stranger</span>}
                        </h2>
                        <p className="text-gray-500 text-sm mb-0.5">WeChat ID: {user.wxid}</p>
                        <p className="text-gray-500 text-sm mb-0.5">Region: China</p>
                        {/* Signature Display */}
                        {user.signature && (
                            <p className="text-gray-400 text-sm mt-1 italic">"{user.signature}"</p>
                        )}
                    </div>
                </div>

                <div className="bg-white mb-2">
                     <div className="p-4 border-b border-gray-100 flex justify-between active:bg-gray-50">
                        <span className="text-black text-base">Set Remark and Tag</span>
                        <span className="text-gray-400">{'>'}</span>
                     </div>
                </div>
                 <div className="bg-white mb-2">
                     <div className="p-4 border-b border-gray-100 flex justify-between active:bg-gray-50 cursor-pointer" onClick={() => onNavigate({ type: 'USER_MOMENTS', userId: user.id })}>
                        <span className="text-black text-base">Moments</span>
                        <span className="text-gray-400">{'>'}</span>
                     </div>
                     <div className="p-4 border-b border-gray-100 flex justify-between active:bg-gray-50">
                        <span className="text-black text-base">More Info</span>
                        <span className="text-gray-400">{'>'}</span>
                     </div>
                </div>

                <div className="px-4 py-2">
                    {isFriend || isMe ? (
                         <button 
                             onClick={() => onNavigate({ type: 'CHAT_DETAIL', id: user.id, chatType: 'user' })}
                             className="w-full bg-white text-[#576B95] font-bold py-3.5 rounded-lg mb-3 border border-gray-200 active:bg-gray-50"
                         >
                             Messages
                         </button>
                    ) : (
                         <button 
                             onClick={handleAdd}
                             className="w-full bg-wechat-green text-white font-bold py-3.5 rounded-lg mb-3 active:opacity-90"
                         >
                             Add to Contacts
                         </button>
                    )}
                    
                    {(isFriend || isMe) && (
                         <button className="w-full bg-white text-[#576B95] font-bold py-3.5 rounded-lg mb-3 border border-gray-200 active:bg-gray-50">
                            Voice or Video Call
                        </button>
                    )}
                    
                    {isFriend && !isMe && (
                         <button 
                             onClick={() => { if(confirm("Delete this friend?")) { deleteFriend(user.id); onBack(); } }}
                             className="w-full bg-white text-red-500 font-bold py-3.5 rounded-lg border border-gray-200 active:bg-gray-50"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
