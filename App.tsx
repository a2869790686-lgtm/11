

import React, { useState } from 'react';
import { StoreProvider } from './hooks/useStore';
import { Screen } from './components/Layout';
import { ChatList } from './views/ChatList';
import { ContactList, AddFriend, UserProfile } from './views/ContactList';
import { Discover } from './views/Discover';
import { ScanView, ShakeView, GamesView, MiniProgramsView, SearchAndNewsView } from './views/DiscoverFunctions';
import { Me, MyProfile, EditName } from './views/Me';
import { ChatDetail } from './views/ChatDetail';
import { Moments } from './views/Moments';
import { Channels } from './views/Channels';
import { Settings, SettingsGeneral } from './views/Settings';
import { Services } from './views/Services';
import { Favorites } from './views/Favorites';
import { StickerGallery } from './views/StickerGallery';
import { RedPacketView, TransferView } from './views/WalletFunctions';
import { IconChat, IconContacts, IconDiscover, IconMe } from './components/Icons';
import { ViewState } from './types';

const TabBar = ({ current, onSelect }: { current: string, onSelect: (view: ViewState) => void }) => {
  return (
    <div className="h-14 bg-[#F7F7F7] border-t border-[#E5E5E5] flex justify-around items-center shrink-0 pb-1">
      <button onClick={() => onSelect({ type: 'TAB_CHATS' })} className="flex flex-col items-center justify-center w-full h-full">
        <IconChat active={current === 'TAB_CHATS'} />
        <span className={`text-[10px] mt-0.5 ${current === 'TAB_CHATS' ? 'text-wechat-green' : 'text-black'}`}>Chats</span>
      </button>
      <button onClick={() => onSelect({ type: 'TAB_CONTACTS' })} className="flex flex-col items-center justify-center w-full h-full">
        <IconContacts active={current === 'TAB_CONTACTS'} />
        <span className={`text-[10px] mt-0.5 ${current === 'TAB_CONTACTS' ? 'text-wechat-green' : 'text-black'}`}>Contacts</span>
      </button>
      <button onClick={() => onSelect({ type: 'TAB_DISCOVER' })} className="flex flex-col items-center justify-center w-full h-full">
        <IconDiscover active={current === 'TAB_DISCOVER'} />
        <span className={`text-[10px] mt-0.5 ${current === 'TAB_DISCOVER' ? 'text-wechat-green' : 'text-black'}`}>Discover</span>
      </button>
      <button onClick={() => onSelect({ type: 'TAB_ME' })} className="flex flex-col items-center justify-center w-full h-full">
        <IconMe active={current === 'TAB_ME'} />
        <span className={`text-[10px] mt-0.5 ${current === 'TAB_ME' ? 'text-wechat-green' : 'text-black'}`}>Me</span>
      </button>
    </div>
  );
};

const AppContent = () => {
  const [viewState, setViewState] = useState<ViewState>({ type: 'TAB_CHATS' });
  const [lastTab, setLastTab] = useState<ViewState>({ type: 'TAB_CHATS' });

  const handleNavigate = (newView: ViewState) => {
    if (newView.type.startsWith('TAB_')) {
      setLastTab(newView);
    }
    setViewState(newView);
  };

  const renderView = () => {
    switch (viewState.type) {
      case 'TAB_CHATS':
        return <ChatList onNavigate={handleNavigate} />;
      case 'TAB_CONTACTS':
        return <ContactList onNavigate={handleNavigate} />;
      case 'TAB_DISCOVER':
        return <Discover onNavigate={handleNavigate} />;
      case 'TAB_ME':
        return <Me onNavigate={handleNavigate} />;
      case 'CHAT_DETAIL':
        return <ChatDetail userId={viewState.userId} onBack={() => handleNavigate({ type: 'TAB_CHATS' })} onNavigate={handleNavigate} />;
      case 'MOMENTS':
        return <Moments onBack={() => handleNavigate({ type: 'TAB_DISCOVER' })} />;
      case 'CHANNELS':
        return <Channels onBack={() => handleNavigate({ type: 'TAB_DISCOVER' })} />;
      case 'ADD_FRIEND':
        return <AddFriend onBack={() => handleNavigate({ type: 'TAB_CONTACTS' })} />;
      case 'USER_PROFILE':
        return <UserProfile userId={viewState.userId} onBack={() => handleNavigate({ type: 'TAB_CONTACTS' })} onNavigate={handleNavigate} />;
      case 'MY_PROFILE':
        return <MyProfile onNavigate={handleNavigate} onBack={() => handleNavigate({ type: 'TAB_ME' })} />;
      case 'EDIT_NAME':
        return <EditName onBack={() => handleNavigate({ type: 'MY_PROFILE' })} />;
      case 'SETTINGS':
        return <Settings onNavigate={handleNavigate} onBack={() => handleNavigate({ type: 'TAB_ME' })} />;
      case 'SETTINGS_GENERAL':
        return <SettingsGeneral onBack={() => handleNavigate({ type: 'SETTINGS' })} />;
      case 'SERVICES':
        return <Services onBack={() => handleNavigate({ type: 'TAB_ME' })} />;
      case 'FAVORITES':
        return <Favorites onBack={() => handleNavigate({ type: 'TAB_ME' })} />;
      case 'STICKER_GALLERY':
        return <StickerGallery onBack={() => handleNavigate({ type: 'TAB_ME' })} />;
      // New Discover Views
      case 'DISCOVER_SCAN':
        return <ScanView onBack={() => handleNavigate({ type: 'TAB_DISCOVER' })} />;
      case 'DISCOVER_SHAKE':
        return <ShakeView onBack={() => handleNavigate({ type: 'TAB_DISCOVER' })} />;
      case 'DISCOVER_TOP_STORIES':
        return <SearchAndNewsView title="Top Stories" onBack={() => handleNavigate({ type: 'TAB_DISCOVER' })} />;
      case 'DISCOVER_SEARCH':
        return <SearchAndNewsView title="Search" onBack={() => handleNavigate({ type: 'TAB_DISCOVER' })} />;
      case 'DISCOVER_GAMES':
        return <GamesView onBack={() => handleNavigate({ type: 'TAB_DISCOVER' })} />;
      case 'DISCOVER_MINI_PROGRAMS':
        return <MiniProgramsView onBack={() => handleNavigate({ type: 'TAB_DISCOVER' })} />;
      // Wallet Views
      case 'MONEY_RED_PACKET':
        return <RedPacketView userId={viewState.userId} onBack={() => handleNavigate({ type: 'CHAT_DETAIL', userId: viewState.userId })} />;
      case 'MONEY_TRANSFER':
        return <TransferView userId={viewState.userId} onBack={() => handleNavigate({ type: 'CHAT_DETAIL', userId: viewState.userId })} />;
      default:
        return <ChatList onNavigate={handleNavigate} />;
    }
  };

  const isTab = viewState.type.startsWith('TAB_');

  return (
    <Screen>
      <div className="flex-1 flex flex-col overflow-hidden relative bg-wechat-bg">
        {renderView()}
      </div>
      {isTab && <TabBar current={viewState.type} onSelect={handleNavigate} />}
    </Screen>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}