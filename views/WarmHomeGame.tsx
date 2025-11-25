
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Layout';

// Game Constants
const GRID_SIZE = 5; // 5x5 grid
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

interface GameItem {
    id: string;
    name: string;
    icon: string;
    price: number;
    type: 'furniture' | 'plant' | 'structure' | 'pet';
}

const SHOP_ITEMS: GameItem[] = [
    { id: 'flower', name: 'Sunflower', icon: '🌻', price: 20, type: 'plant' },
    { id: 'tree', name: 'Oak Tree', icon: '🌳', price: 50, type: 'plant' },
    { id: 'shrub', name: 'Bush', icon: '🌳', price: 30, type: 'plant' },
    { id: 'bench', name: 'Bench', icon: '🪑', price: 80, type: 'furniture' },
    { id: 'lamp', name: 'Street Lamp', icon: '🏮', price: 60, type: 'furniture' },
    { id: 'dog', name: 'Shiba Inu', icon: '🐕', price: 200, type: 'pet' },
    { id: 'cat', name: 'Kitty', icon: '🐈', price: 180, type: 'pet' },
    { id: 'house_s', name: 'Tiny Hut', icon: '🏠', price: 500, type: 'structure' },
    { id: 'house_l', name: 'Villa', icon: '🏡', price: 1000, type: 'structure' },
    { id: 'fountain', name: 'Fountain', icon: '⛲', price: 800, type: 'structure' },
];

interface PlacedItem {
    cellIndex: number;
    itemId: string;
}

interface GameState {
    coins: number;
    inventory: string[]; // array of itemIds
    placedItems: PlacedItem[];
}

const INITIAL_STATE: GameState = {
    coins: 100,
    inventory: [],
    placedItems: []
};

export const WarmHomeGame = ({ onBack }: { onBack: () => void }) => {
    // Load state
    const [gameState, setGameState] = useState<GameState>(() => {
        const saved = localStorage.getItem('warm_home_save');
        return saved ? JSON.parse(saved) : INITIAL_STATE;
    });

    const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'bag'>('home');
    const [selectedItemToPlace, setSelectedItemToPlace] = useState<string | null>(null);

    // Save state on change
    useEffect(() => {
        localStorage.setItem('warm_home_save', JSON.stringify(gameState));
    }, [gameState]);

    const handleWork = () => {
        setGameState(prev => ({ ...prev, coins: prev.coins + 10 }));
    };

    const handleBuy = (item: GameItem) => {
        if (gameState.coins >= item.price) {
            setGameState(prev => ({
                ...prev,
                coins: prev.coins - item.price,
                inventory: [...prev.inventory, item.id]
            }));
            alert(`Bought ${item.name}! Check your Bag.`);
        } else {
            alert("Not enough coins! Go work!");
        }
    };

    const handlePlace = (cellIndex: number) => {
        if (!selectedItemToPlace) return;
        
        // Check if cell is occupied
        if (gameState.placedItems.find(p => p.cellIndex === cellIndex)) {
            // Remove existing? or prevent? Let's prevent for now
            alert("Space occupied!");
            return;
        }

        setGameState(prev => {
            // Remove one instance of the item from inventory
            const idx = prev.inventory.indexOf(selectedItemToPlace);
            if (idx === -1) return prev;
            
            const newInv = [...prev.inventory];
            newInv.splice(idx, 1);

            return {
                ...prev,
                inventory: newInv,
                placedItems: [...prev.placedItems, { cellIndex, itemId: selectedItemToPlace }]
            };
        });

        setSelectedItemToPlace(null);
        setActiveTab('home');
    };

    const handleRemove = (cellIndex: number) => {
        const placed = gameState.placedItems.find(p => p.cellIndex === cellIndex);
        if (!placed) return;

        if (window.confirm("Put this item back in bag?")) {
            setGameState(prev => ({
                ...prev,
                placedItems: prev.placedItems.filter(p => p.cellIndex !== cellIndex),
                inventory: [...prev.inventory, placed.itemId]
            }));
        }
    };

    const getItemDetails = (id: string) => SHOP_ITEMS.find(i => i.id === id);

    return (
        <div className="flex flex-col h-full bg-[#87CEEB] relative">
            <Header title="暖暖家园 (Warm Home)" onBack={onBack} />
            
            {/* HUD */}
            <div className="absolute top-16 left-4 z-10 bg-white/90 px-4 py-2 rounded-full shadow-md border-2 border-yellow-400 flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                <span className="font-bold text-yellow-600 text-lg">{gameState.coins}</span>
            </div>

            <div className="absolute top-16 right-4 z-10">
                 <button 
                    onClick={handleWork}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg font-bold active:scale-95 transition-transform border-2 border-blue-600"
                >
                    🔨 Work (+10)
                 </button>
            </div>

            {/* Main Game Area (Lawn) */}
            <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                {/* Background Elements */}
                <div className="absolute bottom-0 w-full h-1/2 bg-[#90EE90]"></div>
                <div className="absolute top-20 text-white/50 text-6xl">☁️</div>
                <div className="absolute top-32 right-10 text-white/50 text-4xl">☁️</div>

                {/* Grid */}
                <div 
                    className="relative z-0 grid grid-cols-5 gap-1 bg-[#7CFC00] p-2 rounded-xl shadow-2xl border-4 border-[#556B2F]"
                    style={{ width: '320px', height: '320px' }}
                >
                    {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
                        const placed = gameState.placedItems.find(p => p.cellIndex === i);
                        const item = placed ? getItemDetails(placed.itemId) : null;

                        return (
                            <div 
                                key={i}
                                onClick={() => selectedItemToPlace ? handlePlace(i) : (placed && handleRemove(i))}
                                className={`
                                    bg-[#98FB98] border border-green-600/30 rounded relative flex items-center justify-center text-4xl cursor-pointer
                                    ${selectedItemToPlace ? 'animate-pulse bg-yellow-100 ring-2 ring-yellow-400' : ''}
                                `}
                            >
                                {item ? (
                                    <span className="drop-shadow-md select-none transform hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                ) : (
                                    selectedItemToPlace && <span className="opacity-20 text-2xl">➕</span>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {selectedItemToPlace && (
                    <div className="absolute bottom-24 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                        Tap a slot to place {getItemDetails(selectedItemToPlace)?.icon}
                        <button onClick={() => setSelectedItemToPlace(null)} className="ml-4 text-red-300 font-bold">Cancel</button>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="bg-white h-20 shrink-0 border-t border-gray-200 flex justify-around items-center px-4 pb-safe">
                <button 
                    onClick={() => setActiveTab('shop')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'shop' ? 'text-orange-500 scale-110' : 'text-gray-500'}`}
                >
                    <div className="text-3xl">🏪</div>
                    <span className="text-xs font-bold">Shop</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center gap-1 -mt-8 ${activeTab === 'home' ? 'scale-110' : ''}`}
                >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white">
                        🏡
                    </div>
                </button>

                <button 
                    onClick={() => setActiveTab('bag')}
                    className={`flex flex-col items-center gap-1 ${activeTab === 'bag' ? 'text-blue-500 scale-110' : 'text-gray-500'}`}
                >
                    <div className="text-3xl">🎒</div>
                    <span className="text-xs font-bold">Bag ({gameState.inventory.length})</span>
                </button>
            </div>

            {/* Drawers */}
            {(activeTab === 'shop' || activeTab === 'bag') && (
                <div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/50" onClick={() => setActiveTab('home')}>
                    <div className="bg-white rounded-t-2xl p-4 max-h-[60%] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{activeTab === 'shop' ? 'Furniture Shop' : 'My Inventory'}</h3>
                            <button onClick={() => setActiveTab('home')} className="p-2 bg-gray-100 rounded-full">✕</button>
                        </div>

                        {activeTab === 'shop' ? (
                            <div className="grid grid-cols-4 gap-4">
                                {SHOP_ITEMS.map(item => (
                                    <div key={item.id} className="flex flex-col items-center p-2 border border-gray-100 rounded-lg active:bg-gray-50 cursor-pointer" onClick={() => handleBuy(item)}>
                                        <div className="text-4xl mb-2">{item.icon}</div>
                                        <span className="text-xs font-medium text-center truncate w-full">{item.name}</span>
                                        <span className="text-xs text-orange-500 font-bold">💰 {item.price}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-4">
                                {gameState.inventory.length === 0 ? (
                                    <div className="col-span-4 text-center text-gray-400 py-8">Bag is empty. Go shopping!</div>
                                ) : (
                                    // Group items? No, just list 'em for MVP
                                    gameState.inventory.map((itemId, idx) => {
                                        const item = getItemDetails(itemId);
                                        if(!item) return null;
                                        return (
                                            <div 
                                                key={`${itemId}_${idx}`} 
                                                className="flex flex-col items-center p-2 border border-gray-100 rounded-lg active:bg-blue-50 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedItemToPlace(itemId);
                                                    setActiveTab('home');
                                                }}
                                            >
                                                <div className="text-4xl mb-2">{item.icon}</div>
                                                <span className="text-xs font-medium text-center">{item.name}</span>
                                                <span className="text-[10px] text-blue-500 mt-1">Tap to Place</span>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
