
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Header, ScrollArea } from '../components/Layout';
import { IconCamera, IconMoments, IconRefresh, IconBell } from '../components/Icons';
import { ViewState } from '../types';

const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const min = 60 * 1000;
    const hour = min * 60;
    if (diff < min) return '刚刚';
    if (diff < hour) return `${Math.floor(diff/min)} 分钟前`;
    if (diff < hour * 24) return `${Math.floor(diff/hour)} 小时前`;
    return '1天前';
}

const PublishView = ({ onCancel, onPublish }: { onCancel: () => void, onPublish: (text: string) => void }) => {
    const [text, setText] = useState("");
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between px-4 h-14 bg-white shrink-0 border-b border-gray-100">
                <button onClick={onCancel} className="text-black text-base">取消</button>
                <button 
                  onClick={() => onPublish(text)}
                  disabled={!text.trim()}
                  className={`px-3 py-1.5 rounded text-white text-sm font-medium ${!text.trim() ? 'bg-gray-200' : 'bg-wechat-green'}`}
                >
                  发表
                </button>
            </div>
            <div className="p-4 flex-1">
                <textarea 
                    className="w-full h-40 outline-none text-base resize-none" 
                    placeholder="这一刻的想法..."
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
        </div>
    )
}

export const Moments = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { posts, currentUser, toggleLike, addComment, addPost, refreshMoments, notifications, markNotificationsAsRead, getUser } = useStore();
    const [isPublishing, setIsPublishing] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [pullY, setPullY] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef(0);
    const isDragging = useRef(false);

    const [showNotifications, setShowNotifications] = useState(false);
    const unreadNotifications = notifications.filter(n => !n.read);

    const triggerRefresh = async () => {
        setIsRefreshing(true);
        await refreshMoments();
        setIsRefreshing(false);
    };

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
        if (diff > 0) setPullY(Math.min(100, Math.pow(diff, 0.8)));
    };

    const handleTouchEnd = async () => {
        isDragging.current = false;
        if (pullY > 50) {
            setPullY(60); 
            await triggerRefresh();
            setPullY(0);
        } else {
            setPullY(0);
        }
    };

    if (isPublishing) {
        return <PublishView onCancel={() => setIsPublishing(false)} onPublish={(t) => { addPost(t, []); setIsPublishing(false); }} />
    }

    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-16 z-50 flex items-center px-4 justify-between bg-transparent text-white pointer-events-none">
                <button onClick={onBack} className="p-2 pointer-events-auto active:opacity-60 drop-shadow-md">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div className="flex items-center gap-4 pointer-events-auto">
                    <button onClick={triggerRefresh} className={`drop-shadow-md active:opacity-60 ${isRefreshing ? 'animate-spin' : ''}`}>
                        <IconRefresh />
                    </button>
                    <button onClick={() => { setShowNotifications(true); markNotificationsAsRead(); }} className="relative drop-shadow-md">
                        <IconBell />
                        {unreadNotifications.length > 0 && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white">{unreadNotifications.length}</div>}
                    </button>
                    <button onClick={() => setIsPublishing(true)} className="drop-shadow-md active:opacity-60">
                        <IconCamera />
                    </button>
                </div>
             </div>

             {showNotifications && (
                <div className="absolute inset-0 z-[100] bg-black/50" onClick={() => setShowNotifications(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#EDEDED] shadow-xl flex flex-col animate-slide-left" onClick={e => e.stopPropagation()}>
                        <div className="p-4 bg-white border-b font-bold flex justify-between items-center">互动消息 <button onClick={() => setShowNotifications(false)}>✕</button></div>
                        <ScrollArea className="flex-1">
                            {notifications.length === 0 ? <div className="p-10 text-center text-gray-400">暂无互动</div> : notifications.map(n => (
                                <div key={n.id} className="p-4 bg-white border-b flex gap-3">
                                    <img 
                                        src={n.userAvatar} 
                                        className="w-10 h-10 rounded cursor-pointer" 
                                        onClick={() => onNavigate({ type: 'USER_PROFILE', userId: n.userId })} 
                                    />
                                    <div>
                                        <p className="text-[#576B95] font-bold text-sm cursor-pointer" onClick={() => onNavigate({ type: 'USER_PROFILE', userId: n.userId })}>{n.userName}</p>
                                        <p className="text-gray-600 text-sm mt-1">{n.type === 'like' ? '赞了你的动态 ❤️' : n.content}</p>
                                        <p className="text-gray-300 text-[10px] mt-1">{timeAgo(n.timestamp)}</p>
                                    </div>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </div>
             )}

             <div className="absolute left-6 top-16 z-30 pointer-events-none" style={{ display: pullY > 0 || isRefreshing ? 'block' : 'none', transform: `translateY(${pullY * 0.4}px)` }}>
                 <div className={`w-8 h-8 ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: isRefreshing ? 'none' : `rotate(${pullY * 5}deg)` }}><IconMoments /></div>
             </div>

             <ScrollArea 
                className="flex-1 bg-white"
                onScroll={() => { if(activeMenuId) setActiveMenuId(null); }}
                ref={scrollContainerRef}
                style={{ transform: `translateY(${pullY}px)`, transition: isDragging.current ? 'none' : 'transform 0.4s ease' }}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
             >
                 <div className="relative mb-12">
                     <img src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80" className="w-full h-72 object-cover" />
                     <div className="absolute -bottom-10 right-4 flex items-end">
                         <span className="text-white font-bold text-lg mb-12 mr-4 drop-shadow-md">{currentUser.name}</span>
                         <img 
                            src={currentUser.avatar} 
                            className="w-20 h-20 rounded-xl border-2 border-white shadow-lg cursor-pointer object-cover" 
                            onClick={() => onNavigate({ type: 'MY_PROFILE' })} 
                         />
                     </div>
                 </div>

                 <div className="pb-20">
                     {posts.sort((a,b) => b.timestamp - a.timestamp).map(post => {
                         const author = getUser(post.authorId);
                         if (!author) return null;
                         const isMaleLead = ['charlie_su', 'sariel_qi', 'osborn_xiao', 'evan_lu', 'jesse_xia'].includes(post.authorId);
                         return (
                             <div key={post.id} className="flex px-4 py-4 border-b border-gray-50">
                                 <img 
                                    src={author.avatar} 
                                    className="w-11 h-11 rounded-md mr-3 cursor-pointer object-cover" 
                                    onClick={() => onNavigate({ type: 'USER_PROFILE', userId: post.authorId })} 
                                 />
                                 <div className="flex-1 min-w-0">
                                     <h4 
                                        className="text-[#576B95] font-bold text-base mb-1 cursor-pointer" 
                                        onClick={() => onNavigate({ type: 'USER_PROFILE', userId: post.authorId })}
                                     >
                                        {author.remark || author.name}
                                     </h4>
                                     <p className={`text-base text-black mb-2 leading-relaxed whitespace-pre-wrap ${isMaleLead ? 'font-light italic text-gray-700 bg-gray-50 p-2 rounded' : ''}`}>{post.content}</p>
                                     {post.images.length > 0 && (
                                         <div className={`grid gap-1 mb-2 ${post.images.length === 1 ? 'grid-cols-1 max-w-[220px]' : 'grid-cols-3 max-w-[300px]'}`}>
                                             {post.images.map((img, i) => <img key={i} src={img} className="w-full h-full object-cover rounded shadow-sm" />)}
                                         </div>
                                     )}
                                     <div className="flex justify-between items-center mt-2 relative">
                                         <span className="text-xs text-gray-400">{timeAgo(post.timestamp)}</span>
                                         <button 
                                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === post.id ? null : post.id); }}
                                            className="bg-gray-100 rounded px-2 py-0.5 text-[#576B95] active:bg-gray-200 transition-colors"
                                         >
                                             <div className="flex gap-1 items-center font-bold">●●</div>
                                         </button>
                                         {activeMenuId === post.id && (
                                             <div className="absolute right-10 top-[-8px] bg-[#4C4C4C] rounded-md h-9 flex items-center px-4 gap-6 animate-slide-right z-20">
                                                 <button onClick={() => { toggleLike(post.id); setActiveMenuId(null); }} className="text-white text-xs flex items-center gap-1 font-medium active:opacity-60">
                                                     {post.likes.includes(currentUser.id) ? '💔 取消' : '❤️ 赞'}
                                                 </button>
                                                 <div className="w-[1px] h-4 bg-gray-600"></div>
                                                 <button onClick={() => { setCommentingPostId(post.id); setActiveMenuId(null); }} className="text-white text-xs flex items-center gap-1 font-medium active:opacity-60">
                                                     💬 评论
                                                 </button>
                                             </div>
                                         )}
                                     </div>

                                     {(post.likes.length > 0 || post.comments.length > 0) && (
                                         <div className="bg-[#F7F7F7] mt-3 rounded-sm p-2 relative">
                                             <div className="absolute top-[-6px] left-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#F7F7F7]"></div>
                                             {post.likes.length > 0 && (
                                                 <div className={`flex items-start gap-1 ${post.comments.length > 0 ? 'border-b border-gray-200 pb-1 mb-1' : ''}`}>
                                                     <span className="text-[#576B95] text-xs pt-0.5">❤️</span>
                                                     <span className="text-[#576B95] text-sm font-bold flex-1">
                                                         {post.likes.map(id => getUser(id)?.name).join(', ')}
                                                     </span>
                                                 </div>
                                             )}
                                             {post.comments.map((comment) => (
                                                 <div key={comment.id} className="text-sm leading-snug mb-0.5">
                                                     <span 
                                                        className="text-[#576B95] font-bold cursor-pointer" 
                                                        onClick={() => onNavigate({ type: 'USER_PROFILE', userId: comment.userId })}
                                                     >
                                                        {comment.userName}: 
                                                     </span>
                                                     <span className="text-black">{comment.content}</span>
                                                 </div>
                                             ))}
                                         </div>
                                     )}
                                 </div>
                             </div>
                         )
                     })}
                 </div>
             </ScrollArea>

             {commentingPostId && (
                 <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7F7] p-2 flex items-center gap-2 z-[60] border-t border-gray-200 shadow-xl">
                     <input 
                        ref={inputRef}
                        type="text" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                        placeholder="评论" 
                        className="flex-1 bg-white rounded border border-gray-300 px-3 py-1.5 outline-none text-sm" 
                     />
                     <button 
                        onClick={handleSendComment}
                        className={`px-4 py-1.5 rounded font-medium text-sm ${commentText.trim() ? 'bg-wechat-green text-white' : 'bg-gray-200 text-gray-400'}`}
                     >
                        发送
                     </button>
                     <button onClick={() => setCommentingPostId(null)} className="text-gray-400 p-1">✕</button>
                 </div>
             )}
        </div>
    )
}

export const UserMoments = ({ userId, onBack }: { userId: string, onBack: () => void }) => {
    const { posts, getUser } = useStore();
    const user = getUser(userId);
    const userPosts = posts.filter(p => p.authorId === userId).sort((a,b) => b.timestamp - a.timestamp);

    return (
        <div className="flex flex-col h-full bg-white">
            <Header title="相册" onBack={onBack} />
            <ScrollArea className="p-4">
                <div className="flex items-center gap-4 mb-8">
                    <img src={user?.avatar} className="w-16 h-16 rounded-lg object-cover bg-gray-100 shadow-sm" />
                    <div>
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-gray-400 text-sm italic line-clamp-2">{user?.signature}</p>
                    </div>
                </div>
                {userPosts.length === 0 ? <div className="text-center py-10 text-gray-400">暂无动态</div> : userPosts.map(post => (
                    <div key={post.id} className="flex gap-4 mb-6">
                        <div className="w-16 shrink-0">
                            <p className="text-2xl font-bold">{new Date(post.timestamp).getDate()}</p>
                            <p className="text-xs text-gray-400">{new Date(post.timestamp).getMonth() + 1}月</p>
                        </div>
                        <div className="flex-1 min-w-0">
                            {post.images.length > 0 && <img src={post.images[0]} className="w-20 h-20 object-cover rounded mb-2 shadow-sm" />}
                            <p className="text-sm line-clamp-3 leading-relaxed text-gray-800">{post.content}</p>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}
