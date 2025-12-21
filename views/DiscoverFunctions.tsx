
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { IconMore, IconCamera } from '../components/Icons';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';

// --- Scan View ---
export const ScanView = ({ onBack }: { onBack: () => void }) => {
    const { t } = useStore();
    return (
        <div className="flex flex-col h-full bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-16 text-white">
                <button onClick={onBack} className="p-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-lg font-medium">{t('scan')}</span>
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
                <div className="flex flex-col items-center gap-2 text-white"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">📷</div>{t('scan')}</div>
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
    const { t } = useStore();
    const [shaking, setShaking] = useState(false);
    const [count, setCount] = useState(0);

    // Watch count changes for the Easter egg
    useEffect(() => {
        if (count >= 3) {
            // Use a slight timeout to ensure UI updates first
            setTimeout(() => {
                alert("想要通过摇一摇在末日里找到幸存者嘛...");
                setCount(0); // Reset
            }, 100);
        }
    }, [count]);

    const handleShake = () => {
        if (shaking) return;
        setShaking(true);
        // Simulate haptic/sound
        if (navigator.vibrate) navigator.vibrate(200);
        
        setTimeout(() => {
            setShaking(false);
            setCount(prev => prev + 1);
        }, 800);
    };

    return (
        <div className="flex flex-col h-full bg-[#2E3132] relative overflow-hidden" onClick={handleShake}>
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-16 text-white">
                <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="p-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-lg font-medium">{t('shake')}</span>
                <button onClick={(e) => { e.stopPropagation(); }}><div className="text-sm border border-white/30 rounded px-2 py-0.5">{t('settings')}</div></button>
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
                <p className="text-white/30 text-xs mt-2">(Shake Count: {count})</p>
            </div>

            <div className="h-20 bg-[#2E3132] flex justify-around items-center border-t border-white/10 shrink-0">
                 <div className="flex flex-col items-center text-green-500">
                    <div className="text-xl">👥</div>
                    <span className="text-xs mt-1">People</span>
                 </div>
                 <div className="flex flex-col items-center text-gray-500">
                    <div className="text-xl">🎵</div>
                    <span className="text-xs mt-1">{t('music')}</span>
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
export const GamesView = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { t } = useStore();
    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title={t('games')} onBack={onBack} rightAction={<div className="text-sm text-blue-600">My Games</div>} />
            <ScrollArea className="bg-[#EDEDED]">
                {/* Banner */}
                <div className="bg-white p-4 mb-2">
                    <div className="w-full h-40 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex flex-col items-center justify-center text-white shadow-md">
                        <h2 className="text-2xl font-bold">WeChat Games</h2>
                        <p className="opacity-80">Play with friends</p>
                    </div>
                </div>

                {/* --- NEW GAME: WARM HOME --- */}
                <div className="bg-white p-4 mb-2">
                    <h3 className="text-sm font-bold text-gray-500 mb-3">{t('recommended')}</h3>
                    <div 
                        className="w-full bg-gradient-to-br from-[#87CEEB] to-[#98FB98] rounded-xl p-4 flex items-center cursor-pointer shadow-lg transform active:scale-95 transition-all"
                        onClick={() => onNavigate({ type: 'WARM_HOME_GAME' })}
                    >
                        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center text-4xl mr-4 border-2 border-white">
                            🏡
                        </div>
                        <div className="flex-1 text-white">
                            <h3 className="text-xl font-bold drop-shadow-md">{t('warm_home')} (Warm Home)</h3>
                            <p className="text-sm opacity-90 drop-shadow">Build your dream garden! 🌻🐕</p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-white/20 text-xs px-2 py-0.5 rounded">Relaxing</span>
                                <span className="bg-white/20 text-xs px-2 py-0.5 rounded">Simulation</span>
                            </div>
                        </div>
                        <div className="bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full shadow-md text-sm">
                            {t('play')}
                        </div>
                    </div>
                </div>

                {/* Friends Playing */}
                <div className="bg-white p-4 mb-2">
                    <h3 className="text-sm font-bold text-gray-500 mb-3">{t('friends_playing')}</h3>
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
                    <h3 className="text-sm font-bold text-gray-500 mb-3">{t('popular')}</h3>
                    {[1,2,3].map(i => (
                        <div key={i} className="flex items-center mb-4 last:mb-0">
                             <div className="w-16 h-16 rounded-xl bg-gray-200 mr-3 overflow-hidden">
                                <img src={`https://picsum.photos/seed/pgame${i}/200/200`} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-medium text-black">Super Game {i}</h4>
                                 <p className="text-xs text-gray-400">Action • 5M Players</p>
                             </div>
                             <button className="px-4 py-1.5 bg-gray-100 text-green-600 text-sm font-medium rounded-full">{t('play')}</button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

// --- Mini Programs View ---
export const MiniProgramsView = ({ onBack }: { onBack: () => void }) => {
    const { t } = useStore();
    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title={t('mini_programs')} onBack={onBack} rightAction={<IconMore />} />
            <ScrollArea className="bg-[#EDEDED]">
                <div className="p-2">
                    {/* Search */}
                    <div className="bg-white rounded p-2 text-center text-gray-400 text-sm mb-4 flex items-center justify-center">
                        🔍 {t('search')} {t('mini_programs')}
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
                    <h3 className="text-xs text-gray-500 mb-2 px-2">{t('recommended')}</h3>
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

// --- Search / Top Stories View (Combined Dynamic Feed) ---

interface NewsItem {
    id: string;
    title: string;
    source: string;
    reads: string;
    image: string;
    category: string;
    date: string;
    content: string[]; // Array of paragraphs
}

// PERSISTENCE CACHE to prevent refreshes on back navigation
const NEWS_CACHE: Record<string, NewsItem> = {};
const PERSISTED_FEEDS: Record<string, NewsItem[]> = {};
const PERSISTED_TAGS: Record<string, string[]> = {};
const PERSISTED_SCROLL_POS: Record<string, number> = {};

const NEWS_TOPICS = [
    'Technology', 'Finance', 'Health', 'Sports', 'Entertainment', 'Science', 
    'Travel', 'Food', 'Fashion', 'Education', 'Automobile', 'Politics', 
    'RealEstate', 'Gaming', 'Art', 'Lifestyle', 'Nature', 'Business'
];

const NEWS_SOURCES = [
    'TechCrunch', 'Bloomberg', 'Reuters', 'WeChat Daily', 'People\'s Daily', 
    'The Verge', 'Vogue', 'ESPN', 'National Geographic', 'BBC News', 
    'BizInsider', 'HealthLine', 'ScienceNow', 'GameSpot', 'Elle'
];

const DYNAMIC_TITLES = [
    "Breaking: Major breakthrough in {topic} announced today!",
    "Why everyone is talking about this {topic} trend.",
    "The future of {topic}: What you need to know in 2024.",
    "New study reveals surprising facts about {topic}.",
    "Exclusive: Inside the world of {topic} with leading experts.",
    "Top 10 reasons why {topic} is changing the world forever.",
    "Market Alert: {topic} stocks soar to new historical highs.",
    "Is {topic} the next big thing? We investigate.",
    "How {topic} is impacting the lives of millions worldwide.",
    "Hidden secrets of {topic} that will blow your mind.",
    "A deep dive into the evolution of {topic} over the last decade.",
    "Unexpected consequences of the latest {topic} policy.",
    "Celebrities react to the viral {topic} challenge.",
    "Mastering {topic}: A comprehensive guide for beginners.",
    "The dark side of {topic} you never hear about."
];

const PARAGRAPH_TEMPLATES = [
    "In a stunning development that has captured the attention of the {topic} world, experts are calling this the most significant shift in decades. The implications for the industry are profound, with major players scrambling to adapt to the new reality.",
    "\"We have never seen anything like this before,\" said an analyst from {source}. \"The data is clear: this is a game-changer for anyone involved in {topic}.\" The announcement came early this morning, sending shockwaves through global markets.",
    "While skeptics remain cautious, early indicators suggest that this {topic} trend is here to stay. Consumer adoption has been rapid, exceeding all initial forecasts. Companies that fail to innovate risk being left behind in this fast-moving landscape.",
    "Looking ahead, the focus will shift to implementation and regulation. Policy makers are already discussing potential frameworks to ensure safety and fairness in {topic}. As the situation evolves, we will continue to provide updates.",
    "For now, the world watches and waits. One thing is certain: the future of {topic} will never be the same again. Many are looking at {source} for more detailed reports on the upcoming phase."
];

const generateNews = (count: number): NewsItem[] => {
    return Array.from({ length: count }).map((_, i) => {
        const seed = Date.now() + i + Math.random();
        const topic = NEWS_TOPICS[Math.floor(Math.random() * NEWS_TOPICS.length)];
        const source = NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)];
        
        // Dynamic Title construction
        let title = DYNAMIC_TITLES[Math.floor(Math.random() * DYNAMIC_TITLES.length)];
        title = title.replace(/{topic}/g, topic);

        // Generate dynamic paragraphs
        const paragraphs = PARAGRAPH_TEMPLATES.map(p => 
            p.replace(/{topic}/g, topic).replace(/{source}/g, source)
        ).sort(() => Math.random() - 0.5).slice(0, 4); // Random 4 paras

        // Diverse read counts
        const readVal = Math.floor(Math.random() * 900 + 10);
        const readStr = readVal > 100 ? `${(readVal/10).toFixed(1)}w+` : `${readVal}k+`;

        // Diverse dates
        const daysAgo = Math.floor(Math.random() * 5);
        const dateStr = daysAgo === 0 ? "Today" : `${daysAgo} days ago`;

        const item: NewsItem = {
            id: `news_${seed}_${i}`,
            title: title,
            source: source,
            reads: readStr,
            image: `https://loremflickr.com/400/300/${topic.toLowerCase()}?lock=${Math.floor(seed % 1000)}`,
            category: topic,
            date: dateStr,
            content: paragraphs
        };
        
        // Add to cache
        NEWS_CACHE[item.id] = item;
        
        return item;
    });
};

const HOT_TAGS_POOL = [
    'Typhoon News', 'New Tech Release', 'Holiday Travel', 'Healthy Diet', 
    'Stock Market', 'AI Revolution', 'Olympic Games', 'Lunar New Year',
    'Black Myth: Wukong', 'New iPhone Leaks', 'Global Warming', 'Space X Launch',
    'Crypto Crash', 'New Viral Song', 'World Cup 2026', 'Cybersecurity Tips'
];

export const SearchAndNewsView = ({ onBack, onNavigate, title }: { onBack: () => void, onNavigate: (v: ViewState) => void, title: string }) => {
    const { t } = useStore();
    
    // Refs
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);

    // Initialize from persisted cache if available, else generate new
    const [news, setNews] = useState<NewsItem[]>(() => PERSISTED_FEEDS[title] || []);
    const [hotTags, setHotTags] = useState<string[]>(() => PERSISTED_TAGS[title] || []);
    
    // Initial load only if cache is empty
    useEffect(() => {
        if (news.length === 0) {
            const initialNews = generateNews(10);
            setNews(initialNews);
            PERSISTED_FEEDS[title] = initialNews;
        }
        if (hotTags.length === 0) {
            const initialTags = HOT_TAGS_POOL.sort(() => Math.random() - 0.5).slice(0, 6);
            setHotTags(initialTags);
            PERSISTED_TAGS[title] = initialTags;
        }
    }, [title]);

    // Restore scroll position after mount and initial news load
    useLayoutEffect(() => {
        if (scrollContainerRef.current && PERSISTED_SCROLL_POS[title]) {
            scrollContainerRef.current.scrollTop = PERSISTED_SCROLL_POS[title];
        }
    }, [title]); // Should only trigger on initial mount/title change

    const handleRefreshTags = () => {
        const newTags = HOT_TAGS_POOL.sort(() => Math.random() - 0.5).slice(0, 6);
        setHotTags(newTags);
        PERSISTED_TAGS[title] = newTags;
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        
        // PERSIST the scroll position
        PERSISTED_SCROLL_POS[title] = scrollTop;

        // Infinite Scroll Logic
        if (scrollHeight - scrollTop - clientHeight < 100) {
            if (!loadingRef.current) {
                loadingRef.current = true;
                setTimeout(() => {
                    const moreNews = generateNews(5);
                    setNews(prev => {
                        const updated = [...prev, ...moreNews];
                        PERSISTED_FEEDS[title] = updated;
                        return updated;
                    });
                    loadingRef.current = false;
                }, 500);
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center px-2 py-2 border-b border-gray-100">
                <button onClick={onBack} className="p-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
                <div className="flex-1 bg-gray-100 rounded-md flex items-center px-3 py-1.5 mx-2">
                    <span className="text-gray-400 mr-2">🔍</span>
                    <input type="text" placeholder={t('search')} className="bg-transparent outline-none flex-1 text-sm" />
                </div>
            </div>
            
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto" 
                onScroll={handleScroll}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-gray-400">WECHAT HOT</h3>
                        <button 
                            onClick={handleRefreshTags} 
                            className="text-xs text-blue-500 active:opacity-60"
                        >
                            Refresh
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {hotTags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200">{tag}</span>
                        ))}
                    </div>

                    <h3 className="text-xs font-bold text-gray-400 mb-3">{title.toUpperCase()}</h3>
                    
                    {news.map((item) => (
                         <div 
                            key={item.id} 
                            className="flex py-3 border-b border-gray-100 cursor-pointer active:bg-gray-50"
                            onClick={() => onNavigate({ type: 'DISCOVER_ARTICLE', articleId: item.id })}
                         >
                             <div className="flex-1 pr-2 flex flex-col justify-between">
                                 <h4 className="text-base font-medium text-black leading-snug mb-1 line-clamp-2">{item.title}</h4>
                                 <div className="text-xs text-gray-400">{item.source} • {item.reads} reads • {item.date}</div>
                             </div>
                             <img src={item.image} className="w-24 h-16 rounded object-cover bg-gray-200 shrink-0" />
                         </div>
                    ))}
                    
                    {news.length > 0 && (
                        <div className="py-4 text-center text-gray-400 text-xs">
                            Loading more stories...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ArticleView = ({ articleId, onBack }: { articleId: string, onBack: () => void }) => {
    const article = NEWS_CACHE[articleId];

    if (!article) return <div className="flex items-center justify-center h-full">Article not found</div>;

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between px-4 h-12 border-b border-gray-100 shrink-0">
                <button onClick={onBack} className="p-2 -ml-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div className="font-medium text-sm text-gray-700 truncate max-w-[200px]">{article.source}</div>
                <button className="p-2"><IconMore /></button>
            </div>

            <ScrollArea className="bg-white">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-black mb-4 leading-tight">{article.title}</h1>
                    
                    <div className="flex items-center text-xs text-gray-400 mb-6">
                        <span className="text-blue-600 font-medium mr-2">{article.source}</span>
                        <span>{article.date}</span>
                    </div>

                    <img src={article.image} className="w-full h-auto rounded-lg mb-6" />

                    <div className="text-[17px] leading-relaxed text-gray-800 space-y-4 font-light">
                        {article.content.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                        <span>Reads {article.reads}</span>
                        <span>Wow 1.2k</span>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};
