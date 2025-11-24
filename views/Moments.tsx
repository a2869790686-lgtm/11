

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Header, ScrollArea } from '../components/Layout';
import { IconCamera, IconMore, IconMoments, IconRefresh } from '../components/Icons';

// Helper for time
const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const min = 60 * 1000;
    const hour = min * 60;
    if (diff < min) return 'Just now';
    if (diff < hour) return `${Math.floor(diff/min)} min ago`;
    return `${Math.floor(diff/hour)} hours ago`;
}

export const Moments = ({ onBack }: { onBack: () => void }) => {
    const { posts, currentUser, friends, toggleLike, addComment, addPost, refreshMoments } = useStore();
    const [isPublishing, setIsPublishing] = useState(false);
    
    // Popup state for the ".." menu on a post
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    
    // Comment input state
    const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Pull to Refresh State
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [pullY, setPullY] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef(0);
    const isDragging = useRef(false);

    // Get name mapping
    const getName = (id: string) => {
        if (id === currentUser.id) return currentUser.name;
        return friends.find(f => f.id === id)?.name || 'Unknown';
    };

    const handlePublish = (text: string, imgCount: number) => {
        const images = Array(imgCount).fill(0).map((_, i) => `https://loremflickr.com/400/400/nature?lock=${Date.now()+i}`);
        addPost(text, images);
        setIsPublishing(false);
    }
    
    useEffect(() => {
        if (commentingPostId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [commentingPostId]);

    const handleSendComment = () => {
        if (commentText.trim() && commentingPostId) {
            addComment(commentingPostId, commentText);
            setCommentText("");
            setCommentingPostId(null);
        }
    };

    // Manual Refresh Handler
    const handleRefresh = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        setPullY(60);
        await refreshMoments();
        setIsRefreshing(false);
        setPullY(0);
    };

    // Pull to refresh handlers (keep for mobile/touch)
    const handleTouchStart = (e: React.TouchEvent) => {
        if (scrollContainerRef.current && scrollContainerRef.current.scrollTop === 0) {
            startY.current = e.touches[0].clientY;
            isDragging.current = true;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;
        if (diff > 0) {
            // Add resistance
            setPullY(diff * 0.4); 
        }
    };

    const handleTouchEnd = async () => {
        isDragging.current = false;
        if (pullY > 80) {
            setIsRefreshing(true);
            setPullY(60); // Snap to loading position
            await refreshMoments();
            setIsRefreshing(false);
            setPullY(0);
        } else {
            setPullY(0);
        }
    };

    if (isPublishing) {
        return <PublishView onCancel={() => setIsPublishing(false)} onPublish={handlePublish} />
    }

    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
             {/* Transparent Header overlay */}
             <div className="absolute top-0 left-0 right-0 h-16 z-40 flex items-center px-4 justify-between bg-gradient-to-b from-black/40 to-transparent text-white pointer-events-none">
                <button onClick={onBack} className="flex items-center -ml-2 drop-shadow-md pointer-events-auto">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <span className="font-bold">Back</span>
                </button>
                <div className="flex gap-4 pointer-events-auto">
                    <button onClick={handleRefresh} className={`drop-shadow-md ${isRefreshing ? 'animate-spin' : ''}`}>
                         <IconRefresh />
                    </button>
                    <button onClick={() => setIsPublishing(true)} className="drop-shadow-md">
                        <IconCamera />
                    </button>
                </div>
             </div>

             {/* Loading Spinner Layer (Visual only, for pull effect) */}
             <div 
                className="absolute left-0 top-4 right-0 flex justify-center z-10 transition-all duration-300"
                style={{ 
                    transform: `translateY(${pullY > 0 ? pullY * 0.5 : (isRefreshing ? 20 : -40)}px) rotate(${pullY * 2}deg)`,
                    opacity: pullY > 0 || isRefreshing ? 1 : 0
                }}
             >
                 <div className={`w-8 h-8 ${isRefreshing ? 'animate-spin' : ''}`}>
                    <IconMoments />
                 </div>
             </div>

             {/* Main Scroll Content */}
             <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto bg-white no-scrollbar relative z-20 transition-transform duration-200"
                style={{ transform: `translateY(${pullY}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
             >
                 {/* Hero Section */}
                 <div className="relative mb-12">
                     <img src="https://loremflickr.com/800/600/scenery" className="w-full h-64 object-cover" />
                     <div className="absolute -bottom-10 right-4 flex items-end">
                         <span className="text-white font-bold text-lg mb-12 mr-4 drop-shadow-md z-30">{currentUser.name}</span>
                         <img src={currentUser.avatar} className="w-20 h-20 rounded-xl border-2 border-white bg-white z-30" />
                     </div>
                 </div>

                 {/* Posts */}
                 <div className="pb-10 mt-4">
                     {posts.map(post => {
                         const author = post.authorId === currentUser.id ? currentUser : friends.find(f => f.id === post.authorId);
                         if (!author) return null;

                         return (
                             <div key={post.id} className="flex px-4 py-4 border-b border-gray-100">
                                 <img src={author.avatar} className="w-10 h-10 rounded-md mr-3" />
                                 <div className="flex-1">
                                     <h4 className="text-[#576B95] font-bold text-base">{author.name}</h4>
                                     <p className="text-base text-black mb-2 leading-relaxed">{post.content}</p>
                                     
                                     {/* Images Grid */}
                                     {post.images.length > 0 && (
                                         <div className={`grid gap-1 mb-2 ${post.images.length === 1 ? 'grid-cols-1 max-w-[200px]' : 'grid-cols-3 max-w-[300px]'}`}>
                                             {post.images.map((img, idx) => (
                                                 <img key={idx} src={img} className={`object-cover bg-gray-200 ${post.images.length === 1 ? 'w-full h-auto max-h-[200px]' : 'aspect-square'}`} />
                                             ))}
                                         </div>
                                     )}

                                     <div className="flex justify-between items-center mt-2 relative">
                                         <span className="text-xs text-gray-400">{timeAgo(post.timestamp)}</span>
                                         <button 
                                            onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)}
                                            className="bg-[#F7F7F7] px-2 py-1 rounded text-[#576B95]"
                                         >
                                             <div className="flex space-x-[3px]">
                                                <div className="w-1 h-1 bg-[#576B95] rounded-full"></div>
                                                <div className="w-1 h-1 bg-[#576B95] rounded-full"></div>
                                             </div>
                                         </button>

                                         {/* Like/Comment Menu */}
                                         {activeMenuId === post.id && (
                                             <div className="absolute right-9 top-1/2 -translate-y-1/2 bg-[#333333] rounded flex overflow-hidden animate-fade-in-left z-10 shadow-lg">
                                                 <button 
                                                    onClick={() => { toggleLike(post.id); setActiveMenuId(null); }}
                                                    className="px-5 py-2.5 text-white text-sm flex items-center active:bg-gray-700 whitespace-nowrap"
                                                 >
                                                     <span className="mr-1.5">♡</span> {post.likes.includes(currentUser.id) ? 'Cancel' : 'Like'}
                                                 </button>
                                                 <div className="w-[1px] bg-black/20 my-2"></div>
                                                 <button 
                                                     onClick={() => {
                                                         setCommentingPostId(post.id);
                                                         setActiveMenuId(null);
                                                     }}
                                                     className="px-5 py-2.5 text-white text-sm flex items-center active:bg-gray-700 whitespace-nowrap"
                                                 >
                                                     <span className="mr-1.5">💬</span> Comment
                                                 </button>
                                             </div>
                                         )}
                                     </div>

                                     {/* Likes & Comments Area */}
                                     {(post.likes.length > 0 || post.comments.length > 0) && (
                                         <div className="bg-[#F7F7F7] mt-3 rounded p-3 text-sm relative">
                                             {/* Triangle Pointer */}
                                             <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#F7F7F7] rotate-45"></div>

                                             {post.likes.length > 0 && (
                                                 <div className="flex flex-wrap items-center text-[#576B95] mb-1.5 border-b border-gray-200/50 pb-1.5">
                                                     <span className="mr-1.5 text-gray-500 font-light">♡</span>
                                                     {post.likes.map((uid, i) => (
                                                         <span key={uid} className="font-medium">
                                                             {getName(uid)}
                                                             {i < post.likes.length - 1 && ', '}
                                                         </span>
                                                     ))}
                                                 </div>
                                             )}
                                             
                                             {post.comments.length > 0 && (
                                                 <div className="pt-0.5">
                                                     {post.comments.map(c => (
                                                         <div key={c.id} className="mb-0.5 leading-snug">
                                                             <span className="text-[#576B95] font-semibold">{c.userName}:</span>
                                                             <span className="text-black ml-1">{c.content}</span>
                                                         </div>
                                                     ))}
                                                 </div>
                                             )}
                                         </div>
                                     )}
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             </div>
             
             {/* Comment Input Overlay */}
             {commentingPostId && (
                <>
                    <div className="absolute inset-0 z-40 bg-black/5" onClick={() => setCommentingPostId(null)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7F7] p-3 border-t border-gray-200 z-50 flex items-center">
                        <input
                            ref={inputRef}
                            className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-base outline-none focus:border-green-500"
                            placeholder="Comment..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                        />
                        <button 
                            onClick={handleSendComment} 
                            className={`ml-3 px-4 py-2 rounded text-white font-medium ${commentText.trim() ? 'bg-wechat-green' : 'bg-gray-300'}`}
                            disabled={!commentText.trim()}
                        >
                            Send
                        </button>
                    </div>
                </>
             )}
        </div>
    )
}

const PublishView = ({ onCancel, onPublish }: { onCancel: () => void, onPublish: (text: string, count: number) => void }) => {
    const [text, setText] = useState('');
    
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100 bg-white">
                <button onClick={onCancel} className="text-black text-base">Cancel</button>
                <button 
                    onClick={() => onPublish(text, Math.floor(Math.random() * 3))} // Random 0-3 images
                    className={`px-3 py-1.5 rounded text-white text-sm font-semibold ${text ? 'bg-wechat-green' : 'bg-gray-300'}`}
                    disabled={!text}
                >
                    Post
                </button>
            </div>
            <div className="p-4">
                <textarea 
                    className="w-full h-32 outline-none resize-none text-base" 
                    placeholder="Say something..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-4xl mt-4">
                    +
                </div>
            </div>
        </div>
    );
}