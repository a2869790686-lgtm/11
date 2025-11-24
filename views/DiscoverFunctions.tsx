
import React, { useState, useEffect } from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { IconMore, IconCamera } from '../components/Icons';

// --- Scan View ---
export const ScanView = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="flex flex-col h-full bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-16 text-white">
                <button onClick={onBack} className="p-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-lg font-medium">Scan QR Code</span>
                <button><IconMore /></button>
            </div>
            
            {/* Camera Preview Simulation */}
            <div className="flex-1 relative flex flex-col items-center justify-center">
                <img src="https://loremflickr.com/800/1200/city,street?lock=99" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                
                {/* Scan Frame */}
                <div className="relative w-64 h-64 border-2 border-white/50 z-10">
                     <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500"></div>
                     <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500"></div>
                     <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500"></div>
                     <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500"></div>
                     
                     {/* Scanning Line Animation */}
                     <div className="absolute w-full h-0.5 bg-green-500 shadow-[0_0_10px_#22c55e] animate-scan-y"></div>
                </div>
                <p className="relative z-10 text-white/80 mt-4 text-sm">Align QR code/Barcode within frame to scan</p>
            </div>

            {/* Bottom Tabs */}
            <div className="h-24 bg-black/80 flex items-center justify-around text-white/60 text-xs z-20 shrink-0">
                <div className="flex flex-col items-center gap-2 text-white"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">📷</div>Scan</div>
                <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">🖼️</div>Image</div>
                <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">🌐</div>Translate</div>
            </div>
            
            <style>{`
                @keyframes scan-y {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan-y {
                    animation: scan-y 2.5s linear infinite;
                }
            `}</style>
        </div>
    );
};

// --- Shake View ---
export const ShakeView = ({ onBack }: { onBack: () => void }) => {
    const [shaking, setShaking] = useState(false);

    const handleShake = () => {
        if (shaking) return;
        setShaking(true);
        // Simulate haptic/sound
        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setShaking(false), 1000);
    };

    return (
        <div className="flex flex-col h-full bg-[#2E3132] relative overflow-hidden" onClick={handleShake}>
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-16 text-white">
                <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="p-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-lg font-medium">Shake</span>
                <button onClick={(e) => { e.stopPropagation(); }}><div className="text-sm border border-white/30 rounded px-2 py-0.5">Settings</div></button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center pb-20">
                <div className={`transition-transform duration-100 ${shaking ? 'rotate-12 translate-x-2' : ''}`}>
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/WeChat_logo_2019.svg/100px-WeChat_logo_2019.svg.png" 
                        className="w-32 h-32 opacity-80 invert brightness-0" 
                        style={{ filter: 'invert(1) brightness(2)' }} 
                    />
                </div>
                <p className="text-white/50 mt-8 text-sm">Shake your phone to find people</p>
            </div>

            <div className="h-20 bg-[#2E3132] flex justify-around items-center border-t border-white/10 shrink-0">
                 <div className="flex flex-col items-center text-green-500">
                    <div className="text-xl">👥</div>
                    <span className="text-xs mt-1">People</span>
                 </div>
                 <div className="flex flex-col items-center text-gray-500">
                    <div className="text-xl">🎵</div>
                    <span className="text-xs mt-1">Music</span>
                 </div>
                 <div className="flex flex-col items-center text-gray-500">
                    <div className="text-xl">📺</div>
                    <span className="text-xs mt-1">TV</span>
                 </div>
            </div>
        </div>
    );
};

// --- Games View ---
export const GamesView = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title="Games" onBack={onBack} rightAction={<div className="text-sm text-blue-600">My Games</div>} />
            <ScrollArea className="bg-[#EDEDED]">
                {/* Banner */}
                <div className="bg-white p-4 mb-2">
                    <div className="w-full h-40 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex flex-col items-center justify-center text-white shadow-md">
                        <h2 className="text-2xl font-bold">WeChat Games</h2>
                        <p className="opacity-80">Play with friends</p>
                    </div>
                </div>

                {/* Friends Playing */}
                <div className="bg-white p-4 mb-2">
                    <h3 className="text-sm font-bold text-gray-500 mb-3">FRIENDS ARE PLAYING</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="flex flex-col items-center min-w-[60px]">
                                <img src={`https://picsum.photos/seed/game${i}/100/100`} className="w-12 h-12 rounded-lg bg-gray-200" />
                                <span className="text-xs mt-1 text-gray-600 truncate w-full text-center">Hero {i}</span>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Popular */}
                <div className="bg-white p-4 mb-2">
                    <h3 className="text-sm font-bold text-gray-500 mb-3">POPULAR</h3>
                    {[1,2,3].map(i => (
                        <div key={i} className="flex items-center mb-4 last:mb-0">
                             <div className="w-16 h-16 rounded-xl bg-gray-200 mr-3 overflow-hidden">
                                <img src={`https://picsum.photos/seed/pgame${i}/200/200`} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-medium text-black">Super Game {i}</h4>
                                 <p className="text-xs text-gray-400">Action • 5M Players</p>
                             </div>
                             <button className="px-4 py-1.5 bg-gray-100 text-green-600 text-sm font-medium rounded-full">Play</button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

// --- Mini Programs View ---
export const MiniProgramsView = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title="Mini Programs" onBack={onBack} rightAction={<IconMore />} />
            <ScrollArea className="bg-[#EDEDED]">
                <div className="p-2">
                    {/* Search */}
                    <div className="bg-white rounded p-2 text-center text-gray-400 text-sm mb-4 flex items-center justify-center">
                        🔍 Search Mini Programs
                    </div>

                    {/* Recently Used */}
                    <h3 className="text-xs text-gray-500 mb-2 px-2">RECENTLY USED</h3>
                    <div className="bg-white rounded-lg p-4 mb-4">
                         <div className="grid grid-cols-4 gap-4">
                             {[1,2,3,4,5,6,7,8].map(i => (
                                 <div key={i} className="flex flex-col items-center">
                                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-lg">
                                         {['🛒', '🍔', '🎫', '🎬', '🚲', '📊', '🎮', '📱'][i-1]}
                                     </div>
                                     <span className="text-[10px] text-gray-600 text-center leading-tight">App {i}</span>
                                 </div>
                             ))}
                         </div>
                    </div>

                    {/* Categories */}
                    <h3 className="text-xs text-gray-500 mb-2 px-2">RECOMMENDED</h3>
                    <div className="bg-white rounded-lg p-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                                <img src={`https://picsum.photos/seed/mini${i}/100/100`} className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium">Daily Service {i}</h4>
                                    <p className="text-xs text-gray-400">Tools</p>
                                </div>
                                <span className="text-gray-300 text-xl">+</span>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

// --- Search / Top Stories View (Combined Mock) ---
export const SearchAndNewsView = ({ onBack, title }: { onBack: () => void, title: string }) => {
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center px-2 py-2 border-b border-gray-100">
                <button onClick={onBack} className="p-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                <div className="flex-1 bg-gray-100 rounded-md flex items-center px-3 py-1.5 mx-2">
                    <span className="text-gray-400 mr-2">🔍</span>
                    <input type="text" placeholder="Search" className="bg-transparent outline-none flex-1 text-sm" />
                </div>
            </div>
            <ScrollArea className="bg-white">
                <div className="p-4">
                    <h3 className="text-xs font-bold text-gray-400 mb-3">WECHAT HOT</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['Typhoon News', 'New Tech Release', 'Holiday Travel', 'Healthy Diet', 'Stock Market'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">{tag}</span>
                        ))}
                    </div>

                    <h3 className="text-xs font-bold text-gray-400 mb-3">TOP STORIES</h3>
                    {[1,2,3,4].map(i => (
                         <div key={i} className="flex py-3 border-b border-gray-100">
                             <div className="flex-1 pr-2">
                                 <h4 className="text-base font-medium text-black leading-snug mb-1">Big news happened today in the technology world. Read more about it.</h4>
                                 <div className="text-xs text-gray-400">TechDaily • 35k reads</div>
                             </div>
                             <img src={`https://picsum.photos/seed/news${i}/200/200`} className="w-24 h-16 rounded object-cover bg-gray-200" />
                         </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};
