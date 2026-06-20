
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
        <div className="bg-gray-100 px-4 py-1 text-xs text-gray-500">好友列表</div>
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
    const { addRandomFriend, addCustomFriend } = useStore();
    const [mode, setMode] = React.useState<'random' | 'custom'>('random');
    const [loading, setLoading] = React.useState(false);
    const [newFriend, setNewFriend] = React.useState(null);
    const [statusText, setStatusText] = React.useState('');
    const [cName, setCName] = React.useState('');
    const [cGender, setCGender] = React.useState('male');
    const [cIdentity, setCIdentity] = React.useState('');
    const [cStyle, setCStyle] = React.useState('');

    const handleRandom = async () => {
      setLoading(true);
      setStatusText('\u751f\u6210\u4e2d...');
      try {
        const friend = await addRandomFriend();
        setNewFriend(friend);
        setStatusText('\u6210\u529f\uff01');
      } catch(e) { setStatusText('\u5931\u8d25'); }
      setLoading(false);
    };

    const handleCustom = async () => {
      if (!cName.trim()) return;
      setLoading(true);
      setStatusText('\u751f\u6210\u4eba\u8bbe...');
      try {
        const friend = await addCustomFriend({ name: cName, gender: cGender, identity: cIdentity || '\u666e\u901a\u4eba', speakingStyle: cStyle || '\u6b63\u5e38' });
        setNewFriend(friend);
        setStatusText('\u6210\u529f\uff01');
      } catch(e) { setStatusText('\u5931\u8d25'); }
      setLoading(false);
    };

    const TabBtn = ({ v, l }: any) => (
      <button onClick={() => { setMode(v); setNewFriend(null); setStatusText(''); }}
        className={`flex-1 py-2.5 text-center text-sm font-medium border-b-2 ${mode === v ? 'border-wechat-green text-wechat-green' : 'border-transparent text-gray-500'}`}>{l}</button>
    );

    return (
      <div className="flex flex-col h-full bg-wechat-bg">
        <div className="flex items-center px-4 h-14 bg-[#EDEDED] shrink-0 border-b border-gray-200">
          <button onClick={onBack} className="text-black text-base mr-4">\u2190</button>
          <span className="font-semibold text-lg">\u6dfb\u52a0\u597d\u53cb</span>
        </div>
        <div className="flex bg-white border-b border-gray-200">
          <TabBtn v="random" l="\u968f\u673a\u6dfb\u52a0" />
          <TabBtn v="custom" l="\u81ea\u5b9a\u4e49\u6dfb\u52a0" />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {mode === 'random' && (
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <p className="text-5xl mb-4">\ud83c\udfb2</p>
              <p className="text-sm text-gray-500 mb-4">\u70b9\u51fb\u6309\u94ae\u968f\u673a\u751f\u6210\u5168\u65b0\u597d\u53cb</p>
              {!newFriend && !loading && (
                <button onClick={handleRandom} className="bg-wechat-green text-white px-8 py-3 rounded-lg font-medium">\ud83c\udfb2 \u968f\u673a\u751f\u6210</button>
              )}
              {loading && <p className="text-gray-500">{statusText}</p>}
              {newFriend && (
                <div>
                  <img src={newFriend.avatar} className="w-16 h-16 rounded-full mx-auto mb-2" />
                  <h3 className="font-bold">{newFriend.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{newFriend.wxid}</p>
                  <button onClick={() => { if (newFriend) onBack(); }} className="bg-wechat-green text-white px-6 py-2 rounded-lg font-medium">\u786e\u5b9a\u6dfb\u52a0</button>
                </div>
              )}
            </div>
          )}
          {mode === 'custom' && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-3xl text-center mb-3">\ud83d\udcdd</p>
              <input value={cName} onChange={e => setCName(e.target.value)} placeholder="\u59d3\u540d *" className="w-full border rounded-lg px-3 py-2 mb-2 text-base" />
              <select value={cGender} onChange={e => setCGender(e.target.value)} className="w-full border rounded-lg px-3 py-2 mb-2 text-base bg-white">
                <option value="male">\u7537</option>
                <option value="female">\u5973</option>
                <option value="other">\u5176\u4ed6</option>
              </select>
              <input value={cIdentity} onChange={e => setCIdentity(e.target.value)} placeholder="\u8eab\u4efd/\u804c\u4e1a" className="w-full border rounded-lg px-3 py-2 mb-2 text-base" />
              <textarea value={cStyle} onChange={e => setCStyle(e.target.value)} placeholder="\u8bf4\u8bdd\u98ce\u683c" rows={2} className="w-full border rounded-lg px-3 py-2 mb-3 text-base resize-none" />
              {!newFriend && (
                <button onClick={handleCustom} disabled={loading || !cName.trim()} className="w-full py-2.5 bg-wechat-green text-white rounded-lg font-medium disabled:bg-gray-300">
                  {loading ? '\u751f\u6210\u4e2d...' : '\u751f\u6210\u5e76\u6dfb\u52a0'}
                </button>
              )}
              {loading && <p className="text-center text-gray-500 mt-2">{statusText}</p>}
              {newFriend && (
                <div className="text-center">
                  <p className="text-green-600 font-medium mb-2">\u6dfb\u52a0\u6210\u529f\uff01</p>
                  <button onClick={() => onBack()} className="bg-wechat-green text-white px-6 py-2 rounded-lg font-medium">\u5b8c\u6210</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
};

export const UserProfile = ({ userId, onBack, onNavigate }: { userId: string, onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { friends, deleteFriend, currentUser, getUser, t, language } = useStore();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const friend = friends.find(f => f.id === userId);
    const user = getUser(userId);
    const displayUser = friend || user;

    if (!displayUser) return <div className="p-10 text-center">User not found</div>;

    const isFriend = !!friend;
    const isMe = userId === currentUser.id;

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
                            {friend?.remark || displayUser.name}
                        </h2>
                        {friend?.remark && (
                             <p className="text-gray-500 text-sm mb-0.5">{t('name')}: {friend.name}</p>
                        )}
                        <p className="text-gray-500 text-sm mb-0.5">{t('wechat_id')}: {displayUser.wxid}</p>
                        <p className="text-gray-500 text-sm mb-0.5">Region: China</p>
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
                        <div className="flex items-center">
                             <div className="flex gap-1 mr-2">
                                 <div className="w-8 h-8 bg-gray-100"></div>
                                 <div className="w-8 h-8 bg-gray-100"></div>
                             </div>
                             <span className="text-gray-400">{'>'}</span>
                        </div>
                     </div>
                     <div className="p-4 border-b border-gray-100 flex justify-between active:bg-gray-50">
                        <span className="text-black text-base">{t('more')}</span>
                        <span className="text-gray-400">{'>'}</span>
                     </div>
                </div>

                <div className="px-4 py-2">
                    {(isFriend || isMe) && (
                         <button 
                             onClick={() => onNavigate({ type: 'CHAT_DETAIL', id: displayUser.id, chatType: 'user' })}
                             className="w-full bg-white text-[#576B95] font-bold py-3.5 rounded-lg mb-3 border border-gray-200 active:bg-gray-50"
                         >
                             发消息
                         </button>
                    )}
                    
                    {(isFriend || isMe) && (
                         <button className="w-full bg-white text-[#576B95] font-bold py-3.5 rounded-lg mb-3 border border-gray-200 active:bg-gray-50">
                            音视频通话
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
