
import React, { useState, useRef } from 'react';
import { IconCamera } from '../components/Icons';

interface VideoPost {
  id: string;
  author: string;
  avatar: string;
  desc: string;
  likes: string;
  comments: string;
  shares: string;
  cover: string;
}

// Initial Data
const INITIAL_VIDEOS: VideoPost[] = [
  {
    id: 'v1',
    author: '萌宠集中营',
    avatar: 'https://picsum.photos/seed/cat_lover/100/100',
    desc: '今天的小猫咪太可爱了！🐱 治愈系 #cute #cat',
    likes: '12.5w',
    comments: '3241',
    shares: '8892',
    cover: 'https://loremflickr.com/400/800/cat?lock=100'
  },
  {
    id: 'v2',
    author: '美食作家王刚',
    avatar: 'https://picsum.photos/seed/chef/100/100',
    desc: '教大家做一道家常菜，非常下饭！🔥 宽油劝退 👨‍🍳',
    likes: '8.2w',
    comments: '1022',
    shares: '500',
    cover: 'https://loremflickr.com/400/800/food?lock=101'
  },
  {
    id: 'v3',
    author: '旅行日记',
    avatar: 'https://picsum.photos/seed/travel/100/100',
    desc: '西藏的蓝天白云，净化心灵。🏔️ #Travel #Tibet',
    likes: '22.1w',
    comments: '5003',
    shares: '1.2w',
    cover: 'https://loremflickr.com/400/800/mountain?lock=102'
  },
  {
    id: 'v4',
    author: '搞笑幽默',
    avatar: 'https://picsum.photos/seed/funny/100/100',
    desc: '这操作也太秀了吧 😂 笑了三分钟',
    likes: '1.5w',
    comments: '332',
    shares: '102',
    cover: 'https://loremflickr.com/400/800/people?lock=103'
  },
   {
    id: 'v5',
    author: '科技前沿',
    avatar: 'https://picsum.photos/seed/tech/100/100',
    desc: '最新的AI技术演示，太震撼了！🤖 #Technology',
    likes: '4.5w',
    comments: '882',
    shares: '2021',
    cover: 'https://loremflickr.com/400/800/computer?lock=104'
  }
];

// Content Generator for Infinite Scroll
const TOPICS = ['cat', 'food', 'nature', 'city', 'tech', 'people', 'dance', 'art', 'cars', 'sports'];
const DESCRIPTIONS = [
    "Wait for the end... 😱",
    "Daily routine check! ✨",
    "Can't believe this happened.",
    "This view is everything 🌅",
    "Anyone else relate? 😂",
    "Tutorial: How to do this efficiently.",
    "Unboxing the new gadget! 📦",
    "POV: You are here.",
    "Tag a friend who needs to see this!",
    "Weekend vibes only 🎵"
];

const AUTHORS = [
    "LifeHacker", "TravelBug", "TechReviewer", "DailyDose", "FunnyClips", "ChefSpecial", "ArtStation", "CarManiac"
];

const generateVideos = (startIdx: number, count: number): VideoPost[] => {
    return Array.from({ length: count }).map((_, i) => {
        const seed = startIdx + i;
        const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
        return {
            id: `v_gen_${seed}_${Date.now()}`,
            author: AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
            avatar: `https://picsum.photos/seed/u_${seed}/100/100`,
            desc: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)] + ` #${topic}`,
            likes: (Math.random() * 50 + 1).toFixed(1) + 'w',
            comments: Math.floor(Math.random() * 5000).toString(),
            shares: Math.floor(Math.random() * 2000).toString(),
            cover: `https://loremflickr.com/400/800/${topic}?lock=${1000 + seed}`
        };
    });
};

export const Channels = ({ onBack }: { onBack: () => void }) => {
    const [videos, setVideos] = useState<VideoPost[]>(INITIAL_VIDEOS);
    const containerRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        
        // Trigger load when within 2 screens of bottom
        if (scrollHeight - scrollTop - clientHeight < clientHeight * 2) {
            loadMore();
        }
    };

    const loadMore = () => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        
        // Generate new videos
        const newBatch = generateVideos(videos.length, 5);
        setVideos(prev => [...prev, ...newBatch]);

        // Simple debounce
        setTimeout(() => {
            loadingRef.current = false;
        }, 500);
    };

    return (
        <div className="flex flex-col h-full bg-black relative">
            {/* Top Bar Overlay */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-gradient-to-b from-black/50 to-transparent text-white">
                <button onClick={onBack} className="drop-shadow-md">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div className="flex gap-6 text-base font-medium opacity-90">
                    <span className="opacity-60">Following</span>
                    <span className="font-bold border-b-2 border-white pb-1">For You</span>
                    <span className="opacity-60">Friends</span>
                </div>
                <button className="drop-shadow-md">
                    <IconCamera />
                </button>
            </div>

            {/* Scrollable Feed Container */}
            <div 
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar bg-black"
            >
                {videos.map((video) => (
                    <div key={video.id} className="w-full h-full snap-start relative bg-gray-900 border-b border-gray-800">
                        {/* Video Background */}
                        <img 
                            src={video.cover} 
                            className="w-full h-full object-cover" 
                            alt="video thumbnail"
                            loading="lazy"
                        />
                        {/* Dark Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none"></div>

                        {/* Right Sidebar Actions */}
                        <div className="absolute right-2 bottom-20 flex flex-col items-center gap-6 z-20">
                            {/* Avatar & Follow */}
                            <div className="relative mb-2">
                                <img src={video.avatar} className="w-12 h-12 rounded-full border-2 border-white" />
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    +
                                </div>
                            </div>

                            {/* Like */}
                            <div className="flex flex-col items-center gap-1">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="text-white text-xs font-medium drop-shadow-md">{video.likes}</span>
                            </div>

                            {/* Comment */}
                            <div className="flex flex-col items-center gap-1">
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
                                     <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                                </svg>
                                <span className="text-white text-xs font-medium drop-shadow-md">{video.comments}</span>
                            </div>

                            {/* Share */}
                            <div className="flex flex-col items-center gap-1">
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg">
                                    <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                                <span className="text-white text-xs font-medium drop-shadow-md">{video.shares}</span>
                            </div>
                        </div>

                        {/* Bottom Info Area */}
                        <div className="absolute left-4 bottom-6 right-16 z-20 text-white">
                            <h3 className="text-lg font-bold drop-shadow-md mb-2">@{video.author}</h3>
                            <p className="text-sm leading-snug drop-shadow-md opacity-90 line-clamp-2">
                                {video.desc}
                            </p>
                            <div className="flex items-center mt-3 opacity-80 text-xs">
                                <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm mr-2">♫ Original Sound - {video.author}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
