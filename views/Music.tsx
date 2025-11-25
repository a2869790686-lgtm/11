

import React, { useState, useRef, useEffect } from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { IconPlay, IconPause } from '../components/Icons';

export const MusicView = ({ onBack }: { onBack: () => void }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Using a reliable MP3 source (Royalty Free) to simulate a Chinese Pop Song
    const SONG_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"; 

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            setCurrentTime(audio.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (audio) {
            setDuration(audio.duration);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black text-white relative">
            {/* Audio Element */}
            <audio 
                ref={audioRef}
                src={SONG_URL}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 shrink-0 z-20">
                <button onClick={() => { audioRef.current?.pause(); onBack(); }} className="p-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-medium">稻香 (Dao Xiang)</span>
                    <span className="text-xs text-gray-400">周杰伦 (Jay Chou)</span>
                </div>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                {/* Album Art (Rotating) */}
                <div className={`w-64 h-64 rounded-full border-4 border-gray-800 shadow-2xl overflow-hidden mb-12 relative ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
                    <img 
                        src="https://picsum.photos/seed/jaychou/300/300" 
                        alt="Album Art" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 rounded-full border-[10px] border-black/80"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                </div>

                {/* Lyrics / Visualizer Placeholder */}
                <div className="h-12 flex items-center justify-center mb-8">
                    <p className="text-yellow-400 text-center text-lg italic opacity-90 transition-opacity duration-500">
                        {isPlaying ? "还记得你说家是唯一的城堡..." : "Lyrics will appear here"}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-8">
                    <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const width = rect.width;
                        const newTime = (x / width) * duration;
                        if(audioRef.current) {
                            audioRef.current.currentTime = newTime;
                            setCurrentTime(newTime);
                        }
                    }}>
                        <div className="h-full bg-green-500 transition-all duration-200" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration || 180)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-around w-full max-w-xs">
                    <button className="text-gray-400 hover:text-white">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                    </button>

                    <button 
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                        {isPlaying ? <IconPause /> : <IconPlay />}
                    </button>

                    <button className="text-gray-400 hover:text-white">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                    </button>
                </div>
            </div>

             {/* Footer Actions */}
             <div className="h-20 flex justify-around items-center border-t border-white/10 shrink-0 text-white/60 text-2xl">
                 <button>❤️</button>
                 <button>⬇️</button>
                 <button>💬</button>
                 <button>⋮</button>
             </div>
        </div>
    );
};
