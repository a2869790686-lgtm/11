
import React from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { IconSearchDiscover } from '../components/Icons';

const MOCK_STICKERS = [
    { id: 1, name: 'Happy Rabbit', author: 'Rabbit Design', desc: 'Cute rabbit daily life', cover: '🐰' },
    { id: 2, name: 'Office Life', author: 'Work Studio', desc: 'Overtime again?', cover: '💼' },
    { id: 3, name: 'Cheeky Cat', author: 'Meow Inc.', desc: 'Sassy cat reactions', cover: '😼' },
    { id: 4, name: 'Little Dog', author: 'Puppy Love', desc: 'Good boy vibes', cover: '🐶' },
    { id: 5, name: 'Panda Hero', author: 'Bamboo Arts', desc: 'Kung Fu Panda style', cover: '🐼' },
    { id: 6, name: 'Meme King', author: 'Internet Trends', desc: 'Classic memes', cover: '🐸' },
    { id: 7, name: 'Space Journey', author: 'Galaxy Co.', desc: 'Astronauts and aliens', cover: '👽' },
    { id: 8, name: 'Foodie Bear', author: 'Yummy Bear', desc: 'Always hungry', cover: '🐻' },
];

export const StickerGallery = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="Sticker Gallery" onBack={onBack} rightAction={<div className="text-gray-900 text-xl">⚙️</div>} />
            
            {/* Search Bar */}
            <div className="px-4 py-2 bg-white">
                 <div className="bg-[#F7F7F7] rounded-md flex items-center px-3 py-1.5 justify-center">
                    <span className="text-gray-400 mr-2"><IconSearchDiscover /></span>
                    <span className="text-gray-400 text-sm">Search stickers</span>
                </div>
            </div>

            <ScrollArea className="bg-white">
                {/* Banner */}
                <div className="h-40 bg-gradient-to-r from-pink-200 to-yellow-200 mx-4 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-4 left-4 text-pink-600 font-bold text-xl">New Arrivals</div>
                    <div className="text-6xl animate-bounce">🦄</div>
                </div>

                {/* Tabs */}
                <div className="flex px-4 border-b border-gray-100 mb-4">
                    <div className="mr-6 pb-2 border-b-2 border-wechat-green font-bold text-black">Recommended</div>
                    <div className="mr-6 pb-2 text-gray-500">New</div>
                    <div className="mr-6 pb-2 text-gray-500">Top Charts</div>
                </div>

                {/* Sticker List */}
                <div className="px-4 pb-8">
                    {MOCK_STICKERS.map(sticker => (
                        <div key={sticker.id} className="flex items-center py-4 border-b border-gray-50">
                            {/* Sticker Preview (Emoji as placeholder) */}
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-4xl mr-4">
                                {sticker.cover}
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-medium text-black">{sticker.name}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{sticker.desc}</p>
                                <p className="text-[10px] text-gray-300 mt-1">{sticker.author}</p>
                            </div>

                            <button className="px-4 py-1.5 bg-[#F2F2F2] text-wechat-green font-medium text-sm rounded">
                                Add
                            </button>
                        </div>
                    ))}
                    
                    <div className="py-6 text-center text-gray-400 text-xs">
                        See More Stickers
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};
