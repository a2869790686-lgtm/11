
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';
import { ScrollArea, Header } from '../components/Layout';
import { IconCamera } from '../components/Icons';

// --- Components ---

const MenuItem = ({ icon, label, value, onClick, isLink = true }: any) => (
  <div onClick={onClick} className={`flex items-center px-4 py-3 bg-white border-b border-wechat-divider ${onClick ? 'active:bg-gray-50 cursor-pointer' : ''}`}>
    {icon && <div className="w-6 h-6 mr-4 flex items-center justify-center text-xl">{icon}</div>}
    <span className="flex-1 text-base text-black">{label}</span>
    {value && <span className="text-gray-400 mr-2 text-sm">{value}</span>}
    {isLink && <span className="text-gray-400">{'>'}</span>}
  </div>
);

// --- Views ---

export const Me = ({ onNavigate }: { onNavigate: (view: ViewState) => void }) => {
  const { currentUser, t } = useStore();

  return (
    <>
      <div className="bg-white h-14 flex items-center justify-end px-4 sticky top-0">
          <IconCamera />
      </div>
      <ScrollArea className="bg-[#EDEDED]">
        <div 
          className="bg-white p-6 flex items-center mb-2 mt-0 active:bg-gray-50 cursor-pointer"
          onClick={() => onNavigate({ type: 'MY_PROFILE' })}
        >
          <img src={currentUser.avatar} alt="me" className="w-16 h-16 rounded-lg mr-4 bg-gray-200" />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{currentUser.name}</h2>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{t('wechat_id')}: {currentUser.wxid}</span>
              <div className="text-gray-400 text-2xl mb-4 text-sm flex items-center">{t('my_qr_code')} &gt;</div>
            </div>
          </div>
        </div>

        <div className="mb-2">
            <MenuItem 
                icon="💰" 
                label={t('services')}
                onClick={() => onNavigate({ type: 'SERVICES' })}
            />
        </div>

        <div className="mb-2">
            <MenuItem 
                icon="❤️" 
                label={t('favorites')}
                onClick={() => onNavigate({ type: 'FAVORITES' })}
            />
            <MenuItem 
                icon="🖼️" 
                label={t('sticker_gallery')}
                onClick={() => onNavigate({ type: 'STICKER_GALLERY' })}
            />
            <MenuItem 
                icon="⚙️" 
                label={t('settings')}
                onClick={() => onNavigate({ type: 'SETTINGS' })}
            />
        </div>
      </ScrollArea>
    </>
  );
};

export const MyProfile = ({ onNavigate, onBack }: { onNavigate: (view: ViewState) => void, onBack: () => void }) => {
  const { currentUser, updateCurrentUser, t } = useStore();

  const handleRandomizeAvatar = () => {
    // Simulating changing avatar by picking a random seed
    const newAvatar = `https://picsum.photos/seed/${Date.now()}/200/200`;
    updateCurrentUser({ avatar: newAvatar });
  };

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      <Header title="" onBack={onBack} />
      <ScrollArea className="bg-[#EDEDED]">
        <div className="mt-0 border-t border-wechat-divider">
          <div onClick={handleRandomizeAvatar} className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider active:bg-gray-100 cursor-pointer">
             <span className="flex-1 text-base text-black">{t('profile_photo')}</span>
             <img src={currentUser.avatar} className="w-16 h-16 rounded-lg mr-2" />
             <span className="text-gray-400">{'>'}</span>
          </div>
          <MenuItem 
            label={t('name')} 
            value={currentUser.name} 
            onClick={() => onNavigate({ type: 'EDIT_NAME' })} 
          />
          <MenuItem 
            label={t('wechat_id')} 
            value={currentUser.wxid} 
            onClick={() => onNavigate({ type: 'EDIT_WXID' })} 
          />
          <MenuItem label={t('my_qr_code')} icon="🏁" />
          <MenuItem label={t('more')} />
        </div>
        
        <div className="mt-2">
           <MenuItem label={t('incoming_call_ringtone')} />
        </div>
      </ScrollArea>
    </div>
  );
};

export const EditName = ({ onBack }: { onBack: () => void }) => {
  const { currentUser, updateCurrentUser, t } = useStore();
  const [name, setName] = useState(currentUser.name);

  const handleSave = () => {
    if (name.trim()) {
      updateCurrentUser({ name: name.trim() });
      onBack();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#EDEDED]">
      <div className="flex items-center justify-between px-4 h-14 bg-[#EDEDED] shrink-0">
        <button onClick={onBack} className="text-black text-base">{t('cancel')}</button>
        <span className="font-semibold text-lg">{t('set_name')}</span>
        <button 
          onClick={handleSave}
          disabled={!name.trim() || name === currentUser.name}
          className={`px-3 py-1.5 rounded text-white text-sm font-medium ${(!name.trim() || name === currentUser.name) ? 'bg-gray-300' : 'bg-wechat-green'}`}
        >
          {t('save')}
        </button>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-none border-t border-b border-gray-200 -mx-4 px-4 py-2">
           <input 
             autoFocus
             className="w-full text-base outline-none py-1"
             value={name}
             onChange={e => setName(e.target.value)}
             placeholder={t('enter_name')}
           />
        </div>
        <p className="mt-2 text-gray-400 text-xs">Good names are easier to remember.</p>
      </div>
    </div>
  );
};

export const EditWxid = ({ onBack }: { onBack: () => void }) => {
    const { currentUser, updateCurrentUser, t } = useStore();
    const [wxid, setWxid] = useState(currentUser.wxid);
  
    const handleSave = () => {
      if (wxid.trim() && wxid !== currentUser.wxid) {
        updateCurrentUser({ wxid: wxid.trim() });
        onBack();
      }
    };
  
    return (
      <div className="flex flex-col h-full bg-[#EDEDED]">
        <div className="flex items-center justify-between px-4 h-14 bg-[#EDEDED] shrink-0">
          <button onClick={onBack} className="text-black text-base">{t('cancel')}</button>
          <span className="font-semibold text-lg">{t('set_wxid')}</span>
          <button 
            onClick={handleSave}
            disabled={!wxid.trim() || wxid === currentUser.wxid}
            className={`px-3 py-1.5 rounded text-white text-sm font-medium ${(!wxid.trim() || wxid === currentUser.wxid) ? 'bg-gray-300' : 'bg-wechat-green'}`}
          >
            {t('save')}
          </button>
        </div>
  
        <div className="p-4">
          <div className="bg-white rounded-none border-t border-b border-gray-200 -mx-4 px-4 py-2">
             <input 
               autoFocus
               className="w-full text-base outline-none py-1"
               value={wxid}
               onChange={e => setWxid(e.target.value)}
               placeholder={t('enter_wxid')}
             />
          </div>
          <p className="mt-2 text-gray-400 text-xs">{t('wxid_hint')}</p>
        </div>
      </div>
    );
  };
