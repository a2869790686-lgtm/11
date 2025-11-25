

import React from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';
import { IconGroup, IconPlus } from '../components/Icons';

export const GroupList = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { groups } = useStore();

    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Group Chats" onBack={onBack} rightAction={<IconPlus />} />
            <div className="px-4 py-2 bg-gray-100 text-gray-400 text-sm flex items-center border-b border-gray-200">
                🔍 Search
            </div>
            <ScrollArea className="bg-white">
                {groups.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">No group chats</div>
                ) : (
                    groups.map(group => (
                        <div 
                            key={group.id} 
                            className="flex items-center px-4 py-3 border-b border-gray-100 active:bg-gray-50 cursor-pointer"
                            onClick={() => onNavigate({ type: 'CHAT_DETAIL', id: group.id, chatType: 'group' })}
                        >
                            <img src={group.avatar} className="w-10 h-10 rounded-md mr-3 bg-gray-200" />
                            <div className="flex-1">
                                <h3 className="text-base text-black font-normal">{group.name}</h3>
                            </div>
                        </div>
                    ))
                )}
            </ScrollArea>
        </div>
    );
};