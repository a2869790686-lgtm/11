
import React from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { IconMore } from '../components/Icons';
import { useStore } from '../hooks/useStore';
import { ViewState } from '../types';

const ServiceIcon = ({ color, icon, label }: { color: string, icon: string, label: string }) => (
    <div className="flex flex-col items-center justify-center p-4 active:bg-gray-50 cursor-pointer">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl mb-2 ${color}`}>
            {icon}
        </div>
        <span className="text-xs text-center text-gray-600 leading-tight">{label}</span>
    </div>
);

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="bg-white mb-2 p-4">
        <h3 className="text-xs text-gray-400 font-medium mb-2">{title}</h3>
        <div className="grid grid-cols-4 gap-y-4">
            {children}
        </div>
    </div>
);

export const Services = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { t } = useStore();

    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title={t('services')} onBack={onBack} rightAction={<IconMore />} />
            <ScrollArea className="bg-[#EDEDED]">
                <div className="p-2">
                    {/* Wallet Card */}
                    <div className="bg-[#07C160] rounded-xl p-6 text-white mb-2 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-12">
                                    <div 
                                        className="flex flex-col items-center cursor-pointer active:opacity-80 group"
                                        onClick={() => onNavigate({ type: 'MONEY_CODE' })}
                                    >
                                        <div className="w-12 h-12 flex items-center justify-center text-3xl mb-1 text-white">
                                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="M7 15h0" />
                                                <path d="M2 10h20" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-[15px] tracking-wide">收付款</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center cursor-pointer active:opacity-80">
                                        <div className="w-12 h-12 flex items-center justify-center text-3xl mb-1 text-white">
                                            💰
                                        </div>
                                        <span className="font-medium text-[15px] tracking-wide">{t('wallet')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-end border-t border-white/20 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold">¥888.88</span>
                                    <span className="text-xs opacity-70 mt-1">Balance</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial */}
                    <Section title={t('financial_services')}>
                         <ServiceIcon color="bg-orange-400" icon="💳" label={t('card_repay')} />
                         <ServiceIcon color="bg-yellow-500" icon="📈" label={t('wealth')} />
                         <ServiceIcon color="bg-blue-500" icon="🛡️" label={t('insurance')} />
                         <ServiceIcon color="bg-green-600" icon="💹" label={t('stocks')} />
                    </Section>

                    {/* Daily Services */}
                    <Section title={t('daily_services')}>
                         <ServiceIcon color="bg-green-500" icon="📱" label={t('mobile_top_up')} />
                         <ServiceIcon color="bg-blue-400" icon="💡" label={t('utilities')} />
                         <ServiceIcon color="bg-indigo-500" icon="🏥" label={t('health')} />
                         <ServiceIcon color="bg-orange-500" icon="🏙️" label={t('public_services')} />
                         <ServiceIcon color="bg-red-400" icon="❤️" label={t('tencent_charity')} />
                    </Section>

                    {/* Travel & Transport */}
                    <Section title={t('travel_transport')}>
                         <ServiceIcon color="bg-gray-800" icon="🚗" label={t('ride_hailing')} />
                         <ServiceIcon color="bg-blue-600" icon="🚆" label={t('rail_flights')} />
                         <ServiceIcon color="bg-orange-500" icon="🏨" label={t('hotels')} />
                         <ServiceIcon color="bg-green-500" icon="🚲" label={t('bike_share')} />
                    </Section>

                    {/* Shopping & Entertainment */}
                    <Section title={t('shopping_entertainment')}>
                         <ServiceIcon color="bg-red-500" icon="🛍️" label={t('specials')} />
                         <ServiceIcon color="bg-orange-600" icon="🎬" label={t('movie_tickets')} />
                         <ServiceIcon color="bg-pink-500" icon="📦" label={t('delivery')} />
                         <ServiceIcon color="bg-purple-500" icon="👗" label={t('flash_sales')} />
                    </Section>
                </div>
                
                <div className="text-center py-4 text-gray-400 text-xs">
                    Provided by Tencent & Third-party Operators
                </div>
            </ScrollArea>
        </div>
    );
};
