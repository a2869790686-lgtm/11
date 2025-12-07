
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';
import { Header, ScrollArea } from '../components/Layout';
import { IconPlus, IconMore, IconGroup } from '../components/Icons';

interface ContactListProps {
  onNavigate: (view: ViewState) => void;
}

export const ContactList = ({ onNavigate }: ContactListProps) => {
  const { friends, t } = useStore();
  
  // Sort using remark if available, otherwise name
  const sortedFriends = [...friends].sort((a, b) => {
    const nameA = a.remark || a.name;
    const nameB = b.remark || b.name;
    return nameA.localeCompare(nameB);
  });

  return (
    <>
      <div className="bg-wechat-header h-14 px-4 flex items-center justify-between shrink-0 border-b border-wechat-divider sticky top-0 z-10">
        <span className="font-semibold text-lg">{t('contacts')}</span>
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
          <span className="ml-3 font-normal">{t('new_friends')}</span>
        </div>
        <div 
            className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider cursor-pointer active:bg-gray-100"
            onClick={() => onNavigate({ type: 'GROUP_LIST' })}
        >
          <div className="w-10 h-10 rounded-md bg-green-500 flex items-center justify-center text-white">
            <IconGroup />
          </div>
          <span className="ml-3 font-normal">{t('group_chats')}</span>
        </div>
        <div className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider cursor-pointer active:bg-gray-100">
          <div className="w-10 h-10 rounded-md bg-blue-500 flex items-center justify-center text-white">
            <span className="text-lg">🏷️</span>
          </div>
          <span className="ml-3 font-normal">{t('tags')}</span>
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
                  <span className="ml-3 font-medium text-base">{friend.remark || friend.name}</span>
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
    const { friends, deleteFriend, currentUser, getUser, addFriend, t, language } = useStore();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Do NOT use getUser here for display because getUser returns remark as name.
    // We want access to the raw friend object to show nickname properly.
    const rawFriend = friends.find(f => f.id === userId);
    const user = getUser(userId); // Fallback for strangers
    
    // Use rawFriend if available (is a friend), otherwise user (stranger)
    const displayUser = rawFriend || user;

    if (!displayUser) return <div>User not found</div>;

    const isFriend = !!rawFriend;
    const isMe = userId === currentUser.id;

    const handleAdd = () => {
        // Mock add friend logic by ID/Phone (assuming user object has phone or we just direct add)
        addFriend(displayUser.phone || displayUser.id); // Simple mock
        // Force refresh or just navigate back
        alert("Friend Request Sent!");
        onBack();
    }

    const handleDelete = () => {
        deleteFriend(displayUser.id);
        setShowDeleteConfirm(false);
        onBack();
    };

    const confirmText = language === 'zh' ? '删除联系人将清空聊天记录' : 'Delete contact and chat history?';

    return (
        <div className="flex flex-col h-full bg-wechat-bg relative">
            <Header title="" onBack={onBack} rightAction={<IconMore />} />
            <ScrollArea>
                <div className="bg-white p-5 flex items-start mb-2">
                    <img src={displayUser.avatar} className="w-16 h-16 rounded-lg mr-4 bg-gray-200" />
                    <div>
                        <h2 className="text-xl font-bold mb-1 flex items-center">
                            {rawFriend?.remark || displayUser.name}
                            {!isFriend && !isMe && <span className="ml-2 text-xs bg-gray-200 px-1 rounded text-gray-500">Stranger</span>}
                        </h2>
                        {rawFriend?.remark && (
                             <p className="text-gray-500 text-sm mb-0.5">{t('name')}: {rawFriend.name}</p>
                        )}
                        <p className="text-gray-500 text-sm mb-0.5">{t('wechat_id')}: {displayUser.wxid}</p>
                        <p className="text-gray-500 text-sm mb-0.5">Region: China</p>
                        {/* Signature Display */}
                        {displayUser.signature && (
                            <p className="text-gray-400 text-sm mt-1 italic">"{displayUser.signature}"</p>
                        )}
                    </div>
                </div>

                {isFriend && (
                    <div className="bg-white mb-2">
                         <div 
                            className="p-4 border-b border-gray-100 flex justify-between active:bg-gray-50 cursor-pointer"
                            onClick={() => onNavigate({ type: 'SET_REMARK', userId: displayUser.id })}
                         >
                            <span className="text-black text-base">{t('set_remark')}</span>
                            <span className="text-gray-400">{'>'}</span>
                         </div>
                    </div>
                )}
                
                 <div className="bg-white mb-2">
                     <div className="p-4 border-b border-gray-100 flex justify-between active:bg-gray-50 cursor-pointer" onClick={() => onNavigate({ type: 'USER_MOMENTS', userId: displayUser.id })}>
                        <span className="text-black text-base">{t('moments')}</span>
                        <span className="text-gray-400">{'>'}</span>
                     </div>
                     <div className="p-4 border-b border-gray-100 flex justify-between active:bg-gray-50">
                        <span className="text-black text-base">{t('more')}</span>
                        <span className="text-gray-400">{'>'}</span>
                     </div>
                </div>

                <div className="px-4 py-2">
                    {isFriend || isMe ? (
                         <button 
                             onClick={() => onNavigate({ type: 'CHAT_DETAIL', id: displayUser.id, chatType: 'user' })}
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
                             onClick={() => setShowDeleteConfirm(true)}
                             className="w-full bg-white text-red-500 font-bold py-3.5 rounded-lg border border-gray-200 active:bg-gray-50"
                        >
                            {t('delete')}
                        </button>
                    )}
                </div>
            </ScrollArea>

            {/* Delete Confirmation Action Sheet */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-50 bg-black/50 flex flex-col justify-end" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-[#EDEDED] rounded-t-xl overflow-hidden pb-safe" onClick={e => e.stopPropagation()}>
                        <div className="py-4 text-center text-xs text-gray-500 border-b border-gray-200 px-8">
                            {confirmText}
                        </div>
                        <button 
                            onClick={handleDelete}
                            className="w-full bg-white py-3.5 text-red-500 text-lg font-medium active:bg-gray-50 border-b border-gray-200"
                        >
                            {t('delete')}
                        </button>
                        <div className="h-2 bg-[#EDEDED]"></div>
                        <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="w-full bg-white py-3.5 text-black text-lg font-medium active:bg-gray-50"
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export const SetRemark = ({ userId, onBack }: { userId: string, onBack: () => void }) => {
    const { friends, updateFriendRemark, t } = useStore();
    const friend = friends.find(f => f.id === userId);
    const [remark, setRemark] = useState(friend?.remark || '');

    if (!friend) return null;

    const handleSave = () => {
        updateFriendRemark(userId, remark.trim());
        onBack();
    };

    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <div className="flex items-center justify-between px-4 h-14 bg-[#EDEDED] shrink-0">
                <button onClick={onBack} className="text-black text-base">{t('cancel')}</button>
                <span className="font-semibold text-lg">{t('set_remark')}</span>
                <button 
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded text-white text-sm font-medium bg-wechat-green"
                >
                  {t('done')}
                </button>
            </div>

            <div className="p-4">
                <p className="text-gray-500 text-xs mb-2">{t('remark')}</p>
                <div className="bg-white rounded-md border border-gray-200 px-4 py-2">
                   <input 
                     autoFocus
                     className="w-full text-base outline-none py-1"
                     value={remark}
                     onChange={e => setRemark(e.target.value)}
                     placeholder={friend.name}
                   />
                </div>
            </div>
        </div>
    );
};
