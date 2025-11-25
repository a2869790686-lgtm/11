

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Header, ScrollArea } from '../components/Layout';
import { IconCamera, IconMore, IconMoments, IconRefresh, IconBell } from '../components/Icons';
import { ViewState } from '../types';

// Helper for time
const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const min = 60 * 1000;
    const hour = min * 60;
    if (diff < min) return 'Just now';
    if (diff < hour) return `${Math.floor(diff/min)} min ago`;
    return `${Math.floor(diff/hour)} hours ago`;
}

// --- Global Moments Feed ---
export const Moments = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { posts, currentUser, friends, toggleLike, addComment, addPost, refreshMoments, notifications } = useStore();
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

    // Notification Drawer
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadNotifications = notifications.filter(n => !n.read);

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
        // Animate the pull
        setPullY(80);
        await refreshMoments();
        setIsRefreshing(false);
        setPullY(0);
    };

    // Pull to refresh handlers
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
            // Add stronger resistance for realistic feel
            setPullY(Math.pow(diff, 0.8)); 
        }
    };

    const handleTouchEnd = async () => {
        isDragging.current = false;
        if (pullY > 80) {
            setIsRefreshing(true);
            setPullY(80); // Snap to loading position
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
             <div className="absolute top-0 left-0 right-0 h-16 z-50 flex items-center px-4 justify-between bg-gradient-to-b from-black/40 to-transparent text-white pointer-events-none">
                <button onClick={onBack} className="flex items-center -ml-2 drop-shadow-md pointer-events-auto">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    <span className="font-bold">Back</span>
                </button>
                <div className="flex gap-4 pointer-events-auto">
                    {/* Notification Bell */}
                    <button onClick={() => setShowNotifications(true)} className="drop-shadow-md relative">
                        <IconBell />
                        {unreadNotifications.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                        )}
                    </button>

                    {/* Only show manual refresh if not pulling */}
                    {pullY === 0 && !isRefreshing && (
                        <button onClick={handleRefresh} className="drop-shadow-md">
                            <IconRefresh />
                        </button>
                    )}
                    <button onClick={() => setIsPublishing(true)} className="drop-shadow-md">
                        <IconCamera />
                    </button>
                </div>
             </div>
             
             {/* Notification Drawer Overlay */}
             {showNotifications && (
                <div className="absolute inset-0 z-[60] bg-black/80 flex justify-end" onClick={() => setShowNotifications(false)}>
                    <div className="w-80 bg-[#2E3132] h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-4 text-white font-bold text-lg border-b border-white/10">Notifications</div>
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-white/30">No interactions yet</div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="p-4 border-b border-white/10 flex items-start">
                                    <img src={notif.userAvatar} className="w-10 h-10 rounded bg-gray-500 mr-3" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[#576B95] font-bold text-sm">{notif.userName}</span>
                                            <span className="text-white/30 text-xs">{timeAgo(notif.timestamp)}</span>
                                        </div>
                                        {notif.type === 'like' ? (
                                            <p className="text-white/80 text-sm mt-1">Liked your post ❤️</p>
                                        ) : (
                                            <p className="text-white/80 text-sm mt-1">Commented: {notif.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
             )}

             {/* WeChat Style Loading Spinner (Aperture) */}
             {/* Positioned relatively behind/over the cover image area but fixed to the view container */}
             <div 
                className="absolute left-6 top-16 z-30 pointer-events-none"
                style={{ 
                    // Hide when not active
                    display: pullY > 0 || isRefreshing ? 'block' : 'none',
                    // Slide down slightly with the pull but lag behind
                    transform: `translateY(${pullY * 0.3}px)`,
                }}
             >
                 <div 
                    className="w-8 h-8"
                    style={{
                        // Rotate based on pull distance OR infinite spin if refreshing
                        transform: isRefreshing ? 'none' : `rotate(${pullY * 3}deg)`,
                        animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
                    }}
                 >
                    <IconMoments />
                 </div>
             </div>

             {/* Main Scroll Content */}
             <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto bg-white no-scrollbar relative z-20"
                style={{ 
                    transform: `translateY(${pullY}px)`,
                    transition: isDragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)' 
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
             >
                 {/* Hero Section */}
                 <div className="relative mb-12">
                     <img src="https://loremflickr.com/800/600/scenery" className="w-full h-72 object-cover" />
                     <div className="absolute -bottom-10 right-4 flex items-end">
                         <span className="text-white font-bold text-lg mb-12 mr-4 drop-shadow-md z-30">{currentUser.name}</span>
                         <img 
                            src={currentUser.avatar} 
                            className="w-20 h-20 rounded-xl border-2 border-white bg-white z-30 cursor-pointer" 
                            onClick={() => onNavigate({ type: 'MY_PROFILE' })}
                         />
                     </div>
                 </div>

                 {/* Posts */}
                 <div className="pb-10 mt-4">
                     {posts.map(post => {
                         const author = post.authorId === currentUser.id ? currentUser : friends.find(f => f.id === post.authorId);
                         if (!author) return null;

                         return (
                             <div key={post.id} className="flex px-4 py-4 border-b border-gray-100">
                                 <img 
                                    src={author.avatar} 
                                    className="w-10 h-10 rounded-md mr-3 cursor-pointer" 
                                    onClick={() => onNavigate({ type: 'USER_PROFILE', userId: post.authorId })}
                                 />
                                 <div className="flex-1">
                                     <h4 
                                        className="text-[#576B95] font-bold text-base cursor-pointer"
                                        onClick={() => onNavigate({ type: 'USER_PROFILE', userId: post.authorId })}
                                     >
                                        {author.name}
                                     </h4>
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

// --- Specific User Moments (Album) ---
export const UserMoments = ({ userId, onBack }: { userId: string, onBack: () => void }) => {
    const { posts, friends, currentUser } = useStore();
    const user = userId === currentUser.id ? currentUser : friends.find(f => f.id === userId);
    
    // Filter posts for this user
    const userPosts = posts.filter(p => p.authorId === userId);

    if (!user) return <div>User not found</div>;

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <Header title="" onBack={onBack} rightAction={<IconMore />} dark={false} />
            <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />

            <ScrollArea className="bg-white">
                {/* Hero / Cover */}
                <div className="relative mb-8">
                     <div className="w-full h-64 bg-gray-300 overflow-hidden">
                         <img src={`https://loremflickr.com/800/600/abstract,nature?lock=${user.id}`} className="w-full h-full object-cover" />
                     </div>
                     <div className="absolute -bottom-8 right-4 flex items-end">
                         <div className="flex flex-col items-end mr-4 mb-8">
                             <span className="text-white font-bold text-lg drop-shadow-md">{user.name}</span>
                         </div>
                         <img src={user.avatar} className="w-20 h-20 rounded-xl border-2 border-white bg-white" />
                     </div>
                 </div>

                 {/* Signature (Updated) */}
                 <div className="px-4 text-right mb-6">
                     <p className="text-gray-500 text-sm italic">{user.signature || 'No signature.'}</p>
                 </div>

                 {/* Posts List (Simplified Album View) */}
                 <div className="px-4 pb-8">
                     {userPosts.length === 0 ? (
                         <div className="text-center text-gray-400 mt-10">No posts yet</div>
                     ) : (
                         userPosts.map((post, idx) => {
                             const date = new Date(post.timestamp);
                             const day = date.getDate();
                             const month = date.toLocaleString('default', { month: 'short' });
                             
                             // Check if previous post was same year/month (simplified to just show date for all for now)
                             return (
                                 <div key={post.id} className="flex mb-6">
                                     <div className="w-16 flex flex-col items-start pt-1 mr-2 shrink-0">
                                         <span className="text-2xl font-bold leading-none">{day}</span>
                                         <span className="text-sm font-medium text-gray-500">{month}</span>
                                     </div>
                                     <div className="flex-1">
                                         {/* If images, show thumbnails */}
                                         {post.images.length > 0 ? (
                                             <div className="flex flex-wrap gap-1 mb-2">
                                                 {post.images.map((img, i) => (
                                                     <img key={i} src={img} className="w-20 h-20 object-cover bg-gray-100" />
                                                 ))}
                                             </div>
                                         ) : null}
                                         
                                         {/* Content snippet */}
                                         <div className="bg-[#F7F7F7] p-2 text-sm text-gray-800 line-clamp-2">
                                             {post.content}
                                         </div>
                                         
                                         {/* Simple meta */}
                                         <div className="mt-1 text-xs text-gray-400 flex items-center">
                                             {/* {post.images.length > 0 && <span className="mr-2">📷 {post.images.length}</span>} */}
                                             <span>{timeAgo(post.timestamp)}</span>
                                         </div>
                                     </div>
                                 </div>
                             )
                         })
                     )}
                 </div>
            </ScrollArea>
        </div>
    );
};

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