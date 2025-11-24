
import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Message } from '../types';

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
