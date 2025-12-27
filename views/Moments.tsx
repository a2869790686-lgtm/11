
// views/Moments.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Header, ScrollArea } from '../components/Layout';
import { IconCamera, IconMore, IconMoments, IconRefresh, IconBell } from '../components/Icons';
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

export const Moments = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { posts, currentUser, friends, toggleLike, addComment, addPost, refreshMoments, notifications, markNotificationsAsRead } = useStore();
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

    const getName = (id: string) => {
        if (id === currentUser.id) return currentUser.name;
        return friends.find(f => f.id === id)?.name || '未知用户';
    };

    const handlePublish = (text: string, imgCount: number) => {
        addPost(text, []); 
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

    const handleOpenNotifications = () => {
        setShowNotifications(true);
        markNotificationsAsRead();
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
        if (diff > 0) {
            setPullY(Math.min(120, Math.pow(diff, 0.85))); 
        }
    };

    const handleTouchEnd = async () => {
        isDragging.current = false;
        if (pullY > 60) {
            setIsRefreshing(true);
            setPullY(80); 
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
             <div className="absolute top-0 left-0 right-0 h-16 z-50 flex items-center px-4 justify-between bg-transparent text-white pointer-events-none">
                <button onClick={onBack} className="flex items-center -ml-2 drop-shadow-md pointer-events-auto active:opacity-60">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <div className="flex gap-4 pointer-events-auto">
                    <button onClick={handleOpenNotifications} className="drop-shadow-md relative active:opacity-60">
                        <IconBell />
                        {unreadNotifications.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                                {unreadNotifications.length}
                            </div>
                        )}
                    </button>
                    <button onClick={() => setIsPublishing(true)} className="drop-shadow-md active:opacity-60">
                        <IconCamera />
                    </button>
                </div>
             </div>
             
             {showNotifications && (
                <div className="absolute inset-0 z-[60] bg-black/80 flex justify-end" onClick={() => setShowNotifications(false)}>
                    <div className="w-80 bg-[#EDEDED] h-full overflow-y-auto shadow-2xl animate-fade-in-left" onClick={e => e.stopPropagation()}>
                        <div className="p-5 bg-wechat-header text-black font-bold text-lg border-b border-gray-200">消息列表</div>
                        {notifications.length === 0 ? (
                            <div className="p-20 text-center text-gray-400">暂无互动消息</div>
                        ) : (
                            <div className="flex flex-col">
                                {notifications.map(notif => (
                                    <div key={notif.id} className="p-4 bg-white border-b border-gray-100 flex items-start active:bg-gray-50 transition-colors">
                                        <img src={notif.userAvatar} className="w-10 h-10 rounded-md mr-3 object-cover shadow-sm" />
                                        <div className="flex-1">
                                            <span className="text-[#576B95] font-bold text-sm block">{notif.userName}</span>
                                            {notif.type === 'like' ? (
                                                <p className="text-gray-600 text-sm mt-0.5">赞了你的动态 ❤️</p>
                                            ) : (
                                                <div className="mt-0.5 bg-gray-50 p-2 rounded border border-gray-100">
                                                    <p className="text-black text-sm leading-relaxed">{notif.content}</p>
                                                </div>
                                            )}
                                            <span className="text-gray-300 text-[10px] mt-2 block">{timeAgo(notif.timestamp)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
             )}

             <div className="absolute left-6 top-16 z-30 pointer-events-none" style={{ display: pullY > 0 || isRefreshing ? 'block' : 'none', transform: `translateY(${pullY * 0.4}px)` }}>
                 <div className="w-8 h-8" style={{ transform: isRefreshing ? 'none' : `rotate(${pullY * 5}deg)`, animation: isRefreshing ? 'spin 1.2s linear infinite' : 'none' }}>
                    <IconMoments />
                 </div>
             </div>

             <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-white no-scrollbar relative z-20"
                style={{ transform: `translateY(${pullY}px)`, transition: isDragging.current ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
             >
                 <div className="relative mb-12">
                     <img src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80" className="w-full h-72 object-cover" />
                     <div className="absolute -bottom-10 right-4 flex items-end">
                         <span className="text-white font-bold text-lg mb-12 mr-4 drop-shadow-md z-30">{currentUser.name}</span>
                         <img src={currentUser.avatar} className="w-20 h-20 rounded-xl border-2 border-white bg-white z-30 shadow-lg cursor-pointer" onClick={() => onNavigate({ type: 'MY_PROFILE' })} />
                     </div>
                 </div>

                 <div className="pb-10 mt-4">
                     {posts.sort((a,b) => b.timestamp - a.timestamp).map(post => {
                         const author = post.authorId === currentUser.id ? currentUser : friends.find(f => f.id === post.authorId);
                         if (!author) return null;
                         return (
                             <div key={post.id} className="flex px-4 py-4 border-b border-gray-100 animate-fade-in">
                                 <img src={author.avatar} className="w-10 h-10 rounded-md mr-3 cursor-pointer object-cover shadow-sm" onClick={() => onNavigate({ type: 'USER_PROFILE', userId: post.authorId })} />
                                 <div className="flex-1">
                                     <h4 className="text-[#576B95] font-bold text-base cursor-pointer hover:underline" onClick={() => onNavigate({ type: 'USER_PROFILE', userId: post.authorId })}>{author.remark || author.name}</h4>
                                     <p className="text-base text-black mb-2 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                     {post.images.length > 0 && (
                                         <div className={`grid gap-1 mb-2 ${post.images.length === 1 ? 'grid-cols-1 max-w-[220px]' : (post.images.length === 4 ? 'grid-cols-2 max-w-[240px]' : 'grid-cols-3 max-w-[300px]')}`}>
                                             {post.images.map((img, idx) => (
                                                 <img key={idx} src={img} className={`object-cover bg-gray-50 border border-gray-100 aspect-square rounded-sm`} loading="lazy" />
                                             ))}
                                         </div>
                                     )}
                                     <div className="flex justify-between items-center mt-2 relative">
                                         <span className="text-xs text-gray-400">{timeAgo(post.timestamp)}</span>
                                         <button onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)} className="bg-[#F7F7F7] px-2 py-1 rounded text-[#576B95] active:bg-gray-200">
                                             <div className="flex space-x-[3px]"><div className="w-1.5 h-1.5 bg-[#576B95] rounded-full opacity-60"></div><div className="w-1.5 h-1.5 bg-[#576B95] rounded-full opacity-60"></div></div>
                                         </button>
                                         {activeMenuId === post.id && (
                                             <div className="absolute right-9 top-1/2 -translate-y-1/2 bg-[#333333] rounded-md flex overflow-hidden animate-fade-in-left z-10 shadow-2xl">
                                                 <button onClick={() => { toggleLike(post.id); setActiveMenuId(null); }} className="px-5 py-2.5 text-white text-sm flex items-center active:bg-gray-700">
                                                     <span className="mr-1.5">{post.likes.includes(currentUser.id) ? '💔' : '❤️'}</span> {post.likes.includes(currentUser.id) ? '取消' : '赞'}
                                                 </button>
                                                 <div className="w-[1px] bg-black/30 my-2"></div>
                                                 <button onClick={() => { setCommentingPostId(post.id); setActiveMenuId(null); }} className="px-5 py-2.5 text-white text-sm flex items-center active:bg-gray-700">
                                                     <span className="mr-1.5">💬</span> 评论
                                                 </button>
                                             </div>
                                         )}
                                     </div>
                                     {(post.likes.length > 0 || post.comments.length > 0) && (
                                         <div className="bg-[#F7F7F7] mt-3 rounded p-2 text-sm relative">
                                             <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#F7F7F7] rotate-45"></div>
                                             {post.likes.length > 0 && (
                                                 <div className="flex flex-wrap items-center text-[#576B95] mb-1 pb-1 border-b border-gray-200/40 font-medium">
                                                     <span className="mr-1.5 text-gray-400 font-light">❤️</span>
                                                     {post.likes.map((uid, i) => <span key={uid}>{getName(uid)}{i < post.likes.length - 1 && '，'}</span>)}
                                                 </div>
                                             )}
                                             {post.comments.length > 0 && (
                                                 <div className="pt-0.5 space-y-0.5">
                                                     {post.comments.map(c => <div key={c.id} className="active:bg-gray-200 rounded px-1 -mx-1"><span className="text-[#576B95] font-semibold">{c.userName}:</span><span className="text-black ml-1">{c.content}</span></div>)}
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
             
             {commentingPostId && (
                <>
                    <div className="absolute inset-0 z-40 bg-black/5" onClick={() => setCommentingPostId(null)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-[#F7F7F7] p-3 border-t border-gray-200 z-50 flex items-center pb-safe animate-slide-up">
                        <input ref={inputRef} className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-base outline-none focus:border-wechat-green" placeholder="评论..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendComment()} />
                        <button onClick={handleSendComment} className={`ml-3 px-4 py-2 rounded-md text-white font-medium transition-all ${commentText.trim() ? 'bg-wechat-green' : 'bg-gray-300'}`} disabled={!commentText.trim()}>发送</button>
                    </div>
                </>
             )}
             <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-up { animation: slideUp 0.2s ease-out; }
             `}</style>
        </div>
    )
}

export const UserMoments = ({ userId, onBack }: { userId: string, onBack: () => void }) => {
    const { posts, getUser, currentUser } = useStore();
    const user = getUser(userId);
    
    // 关键修正：这里的逻辑应该能正确过滤出该用户的所有动态
    const userPosts = posts.filter(p => p.authorId === userId).sort((a,b) => b.timestamp - a.timestamp);

    if (!user) return null;

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="absolute top-0 left-0 right-0 h-16 z-50 flex items-center px-4 bg-transparent text-white pointer-events-none">
                <button onClick={onBack} className="p-2 -ml-2 drop-shadow-md pointer-events-auto active:opacity-60">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
            </div>
            
            <ScrollArea className="bg-white">
                <div className="relative mb-20">
                     <img src="https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&w=800&q=80" className="w-full h-64 object-cover" />
                     <div className="absolute -bottom-10 right-4 flex items-end">
                         <span className="text-white font-bold text-lg mb-12 mr-4 drop-shadow-md z-30">{user.name}</span>
                         <img src={user.avatar} className="w-20 h-20 rounded-xl border-2 border-white bg-white z-30 shadow-md" />
                     </div>
                </div>

                <div className="px-4 pb-10">
                    {userPosts.length === 0 ? (
                        <div className="py-20 text-center text-gray-400">暂无朋友圈动态</div>
                    ) : (
                        userPosts.map(post => {
                            const date = new Date(post.timestamp);
                            return (
                                <div key={post.id} className="flex mb-8">
                                    <div className="w-16 shrink-0 flex flex-col items-end pr-4 pt-1">
                                        <span className="text-2xl font-bold leading-none">{date.getDate()}</span>
                                        <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase">{date.getMonth() + 1}月</span>
                                    </div>
                                    <div className="flex-1">
                                        {post.images.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-1 mb-2">
                                                {post.images.slice(0, 3).map((img, i) => (
                                                    <img key={i} src={img} className="aspect-square object-cover rounded-sm bg-gray-50 border border-gray-100" />
                                                ))}
                                            </div>
                                        ) : null}
                                        <p className="text-sm text-black leading-relaxed line-clamp-3">{post.content}</p>
                                        <div className="mt-2 text-[10px] text-gray-300">
                                            {post.images.length > 0 && `共 ${post.images.length} 张照片`}
                                        </div>
                                    </div>
                                </div>
                            );
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
                <button onClick={onCancel} className="text-black text-base active:opacity-60">取消</button>
                <button onClick={() => onPublish(text, 0)} className={`px-4 py-1.5 rounded-md text-white text-sm font-semibold transition-colors ${text ? 'bg-wechat-green' : 'bg-gray-200 text-gray-400'}`} disabled={!text}>发表</button>
            </div>
            <div className="p-4">
                <textarea autoFocus className="w-full h-32 outline-none resize-none text-[17px] leading-normal" placeholder="这一刻的想法..." value={text} onChange={e => setText(e.target.value)} />
                <div className="w-24 h-24 bg-[#F7F7F7] rounded-md flex items-center justify-center text-gray-300 text-4xl mt-4 active:bg-gray-200 cursor-pointer border border-dashed border-gray-300">+</div>
            </div>
        </div>
    );
}
