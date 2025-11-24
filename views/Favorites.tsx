
import React, { useState } from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { IconPlus } from '../components/Icons';

const MOCK_FAVS = [
    { id: 1, type: 'link', title: 'Top 10 Tourist Spots in Beijing', source: 'Travel Weekly', date: 'Yesterday' },
    { id: 2, type: 'image', title: 'Image', source: 'Mom', date: '10/24' },
    { id: 3, type: 'chat', title: 'Chat History with Boss', source: 'Boss', date: '10/20' },
    { id: 4, type: 'file', title: 'Project_Proposal_Final_v2.pdf', source: 'Jack', date: '09/15' },
    { id: 5, type: 'music', title: 'Song: Ordinary Road', source: 'Music App', date: '08/01' },
    { id: 6, type: 'link', title: 'How to make authentic Mapo Tofu', source: 'Cooking 101', date: '07/22' },
];

const FavItem: React.FC<{ item: any }> = ({ item }) => {
    const getIcon = (type: string) => {
        switch(type) {
            case 'link': return '🔗';
            case 'image': return '🖼️';
            case 'chat': return '💬';
            case 'file': return '📄';
            case 'music': return '🎵';
            default: return '❤️';
        }
    };

    return (
        <div className="bg-white p-4 flex items-start border-b border-gray-100 active:bg-gray-50">
             <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl mr-3 shrink-0">
                 {getIcon(item.type)}
             </div>
             <div className="flex-1 min-w-0">
                 <h4 className="text-base text-black font-normal mb-1 truncate">{item.title}</h4>
                 <p className="text-xs text-gray-400">{item.source} • {item.date}</p>
             </div>
        </div>
    );
};

export const Favorites = ({ onBack }: { onBack: () => void }) => {
    const [search, setSearch] = useState('');

    const filtered = MOCK_FAVS.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Favorites" onBack={onBack} rightAction={<IconPlus />} />
            
            <div className="px-2 py-2 border-b border-gray-100 bg-white">
                <div className="bg-gray-100 rounded-md flex items-center px-3 py-1.5">
                    <span className="text-gray-400 mr-2">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="bg-transparent outline-none flex-1 text-sm" 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ScrollArea className="bg-white">
                {filtered.map(item => (
                    <FavItem key={item.id} item={item} />
                ))}
                
                <div className="p-8 text-center text-gray-300 text-sm">
                    {filtered.length === 0 ? 'No results found' : 'End of list'}
                </div>
            </ScrollArea>

            {/* Bottom Filter Bar */}
            <div className="h-12 border-t border-gray-100 flex items-center px-4 overflow-x-auto no-scrollbar gap-6 shrink-0 text-sm text-gray-500">
                <span className="whitespace-nowrap">All</span>
                <span className="whitespace-nowrap">Images</span>
                <span className="whitespace-nowrap">Videos</span>
                <span className="whitespace-nowrap">Links</span>
                <span className="whitespace-nowrap">Files</span>
                <span className="whitespace-nowrap">Music</span>
                <span className="whitespace-nowrap">Chat</span>
                <span className="whitespace-nowrap">Audio</span>
            </div>
        </div>
    );
};
