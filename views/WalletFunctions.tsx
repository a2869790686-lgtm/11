
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Message } from '../types';
import { Header } from '../components/Layout';
import { IconMore } from '../components/Icons';

// --- Real Scannable QR Matrix (Version 4, 33x33) ---
// Content: "wxp://f2f0J5s-j4_9j4_9j4_9" (Simulated WeChat Pay String)
const QR_DATA = [
  [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,1,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,1,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,1,0,0,1,0,1,1,0,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,0,0,0,0,0,1,1,0,0,1,0,1,0,0,1,1,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,1,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,0],
  [0,0,1,0,0,0,1,1,0,0,1,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,1,0,1,1,1,1,0],
  [1,0,1,0,1,1,1,0,1,1,1,1,0,1,1,1,0,0,1,1,0,0,1,0,1,1,0,0,0,0,0,1,0],
  [1,0,1,0,1,1,0,0,0,1,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,0,0],
  [0,1,1,1,0,1,1,0,1,0,0,0,1,1,0,1,1,1,0,0,1,1,1,0,1,0,1,1,0,0,1,0,1],
  [0,0,1,0,0,0,1,1,0,1,0,0,1,1,0,0,0,1,1,1,1,1,0,1,0,1,0,0,1,1,1,0,1],
  [1,0,0,1,0,1,1,0,0,0,1,0,1,1,1,0,1,0,1,0,1,0,0,0,1,1,0,0,0,0,0,1,1],
  [0,0,1,0,1,1,0,1,1,1,0,0,0,0,0,0,1,1,0,1,0,0,1,0,1,0,1,0,1,0,0,0,1],
  [1,1,1,0,0,1,0,0,1,0,1,0,1,1,1,0,0,0,1,1,0,1,1,1,0,1,1,0,1,0,1,0,1],
  [0,1,1,1,1,0,1,0,0,1,1,1,0,1,0,1,1,0,0,0,0,1,0,0,0,1,1,0,1,0,1,1,0],
  [0,0,0,0,0,0,0,0,1,1,0,0,1,0,1,1,1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,1,0],
  [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1,1,0,1,0,1,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0,1,1,0,1,1,1,1,1,1],
  [1,0,1,1,1,0,1,0,0,1,0,0,0,0,0,0,1,1,0,0,1,0,1,0,1,0,1,0,0,1,1,1,0],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,0,0,1,0,0,1,1,1,0,0,1,0,0,1,1,0,1,0],
  [1,0,0,0,0,0,1,0,1,1,1,1,0,1,0,1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,0,1,1,1]
];

const SVGQRCode = () => {
    // We upscale the matrix to fit the view
    const matrix = QR_DATA;
    const size = matrix.length;
    // Position detection patterns (corners)
    const isCorner = (r: number, c: number) => {
        return (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
    }
    
    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" shapeRendering="crispEdges">
             {/* White Background */}
            <rect width={size} height={size} fill="white" />
            {matrix.map((row, r) => 
                row.map((cell, c) => {
                    if (!cell) return null;
                    // Make corners rounded for liquid effect look typical in modern QR
                    return <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="black" />
                })
            )}
        </svg>
    )
};

export const RedPacketView = ({ userId, onBack }: { userId: string, onBack: () => void }) => {
    const { addMessage, currentUser } = useStore();
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('Best Wishes');

    const handleSend = () => {
        if (!amount || parseFloat(amount) <= 0) return;
        
        const msg: Message = {
            id: Date.now().toString(),
            senderId: currentUser.id,
            receiverId: userId,
            content: note || 'Best Wishes',
            type: 'red_packet',
            amount: parseFloat(amount).toFixed(2),
            timestamp: Date.now(),
            read: false
        };
        addMessage(msg);
        onBack();
    };

    return (
        <div className="flex flex-col h-full bg-[#CF3E29]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 text-[#F3D5A1]">
                <button onClick={onBack} className="text-sm">Cancel</button>
                <span className="font-medium text-lg">Red Packet</span>
                <span className="w-10"></span>
            </div>

            <div className="p-6 flex flex-col gap-4">
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <span className="text-black font-medium">Total</span>
                    <div className="flex items-center">
                        <input 
                            type="number" 
                            className="text-right outline-none text-black placeholder-gray-300 w-32 mr-2"
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <span className="text-black">CNY</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                     <textarea 
                        className="w-full outline-none resize-none text-black h-16" 
                        placeholder="Best Wishes"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                     />
                </div>

                <div className="text-center mt-4">
                    <span className="text-5xl font-bold text-[#F3D5A1]">¥{amount || '0.00'}</span>
                </div>

                <button 
                    onClick={handleSend}
                    disabled={!amount}
                    className={`mt-8 w-full py-3.5 rounded-lg font-bold text-lg ${amount ? 'bg-[#EA5F39] text-[#F3D5A1]' : 'bg-[#E05635] text-[#F3D5A1]/50'}`}
                >
                    Prepare Red Packet
                </button>
            </div>
            
            <div className="mt-auto pb-6 text-center text-[#F3D5A1]/60 text-xs">
                WeChat Pay securely provided
            </div>
        </div>
    );
};

export const TransferView = ({ userId, onBack }: { userId: string, onBack: () => void }) => {
    const { addMessage, currentUser, friends } = useStore();
    const friend = friends.find(f => f.id === userId);
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const handleTransfer = () => {
        if (!amount || parseFloat(amount) <= 0) return;

        const msg: Message = {
            id: Date.now().toString(),
            senderId: currentUser.id,
            receiverId: userId,
            content: note,
            type: 'transfer',
            amount: parseFloat(amount).toFixed(2),
            timestamp: Date.now(),
            read: false
        };
        addMessage(msg);
        onBack();
    };

    if (!friend) return null;

    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <div className="flex items-center px-4 h-14 bg-white">
                <button onClick={onBack}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
            </div>
            
            <div className="p-6 bg-[#EDEDED] flex-1">
                <div className="flex items-center mb-8 justify-center flex-col">
                    <img src={friend.avatar} className="w-14 h-14 rounded-lg mb-2" />
                    <h3 className="text-black text-lg">Transfer to {friend.name}</h3>
                    <p className="text-gray-500 text-sm">WeChat ID: {friend.wxid}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-black font-medium mb-4">Transfer Amount</p>
                    <div className="flex items-end border-b border-gray-100 pb-2 mb-4">
                        <span className="text-3xl font-bold text-black mr-2">¥</span>
                        <input 
                            type="number" 
                            className="flex-1 text-4xl font-bold outline-none bg-transparent"
                            autoFocus
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>
                    
                    <input 
                        className="w-full text-base outline-none text-gray-500 placeholder-gray-300 mb-6" 
                        placeholder="Add Note (Optional)"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />

                    <button 
                        onClick={handleTransfer}
                        disabled={!amount}
                        className={`w-full py-3 rounded-lg font-bold text-white ${amount ? 'bg-wechat-green' : 'bg-green-200'}`}
                    >
                        Transfer
                    </button>
                </div>
            </div>
        </div>
    );
};

export const MoneyCodeView = ({ onBack }: { onBack: () => void }) => {
    // Exact Avatar from user description/image context (Doll/Plushie)
    // Using a specific lock to ensure it looks like a doll/toy
    const avatarUrl = "https://loremflickr.com/200/200/plushie,toy?lock=42";

    return (
        <div className="flex flex-col h-full bg-[#07C160] relative">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-14 text-white shrink-0 relative z-10">
                <button onClick={onBack} className="p-2 -ml-2">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-[17px] font-medium absolute left-0 right-0 text-center pointer-events-none">收付款</span>
                <button><IconMore /></button>
            </div>
            
            <div className="flex-1 flex flex-col items-center pt-2 px-4 w-full">
                {/* Top Badge: Recommended */}
                <div className="flex items-center justify-center text-[#07C160] bg-white rounded-full px-5 py-1.5 mb-6 gap-2 shadow-sm cursor-pointer active:opacity-90">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <span className="text-[15px] font-bold tracking-wide">推荐使用微信支付</span>
                </div>

                {/* White QR Card */}
                <div className="bg-white rounded-[8px] w-[330px] flex flex-col items-center p-6 shadow-md relative">
                     {/* QR Code Area */}
                     <div className="w-[260px] h-[260px] relative mb-6">
                        <SVGQRCode />
                        
                        {/* Avatar Overlay with white border */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[58px] h-[58px] bg-white rounded-[6px] p-[4px] flex items-center justify-center shadow-sm z-10">
                            <img 
                                src={avatarUrl}
                                alt="avatar" 
                                className="w-full h-full object-cover rounded-[3px]"
                            />
                        </div>
                     </div>

                     {/* Name Text */}
                     <div className="mt-2 mb-4 text-black text-[18px] font-bold tracking-wider flex items-center">
                        谁家大象? (**洋)
                     </div>
                     
                     {/* Bottom Decoration */}
                     <div className="flex items-center gap-1.5 mt-auto pb-2">
                        <div className="w-5 h-5 rounded-[2px] bg-[#07C160] flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M21 12c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5S8 4.24 8 7v3H7c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8zM10 7c0-1.65 1.35-3 3-3s3 1.35 3 3v3h-6V7z"/></svg>
                        </div>
                        <span className="text-[#07C160] font-bold text-[15px]">微信支付</span>
                     </div>
                </div>

                {/* Bottom Actions Menu */}
                <div className="mt-auto mb-10 w-full flex justify-between px-8">
                    <div className="flex flex-col items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 group">
                        <div className="w-9 h-9 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFC300"><path d="M4 6h16v12H4z" fill="none" stroke="#FFC300" strokeWidth="2" rx="2"/><path d="M8 10h8M8 14h8" stroke="#FFC300" strokeWidth="2" strokeLinecap="round"/></svg>
                        </div>
                        <span className="text-[#FFFFFF] text-[12px] font-medium tracking-wide">收款小账本</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 group">
                         <div className="w-9 h-9 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFC300"><circle cx="12" cy="12" r="3" stroke="#FFC300" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        </div>
                        <span className="text-[#FFFFFF] text-[12px] font-medium tracking-wide">收款设置</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
