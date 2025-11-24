
import React from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { IconMore } from '../components/Icons';

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

export const Services = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title="Services" onBack={onBack} rightAction={<IconMore />} />
            <ScrollArea className="bg-[#EDEDED]">
                <div className="p-2">
                    {/* Wallet Card */}
                    <div className="bg-[#07C160] rounded-xl p-6 text-white mb-2 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <span className="text-2xl mr-2">💰</span>
                                <span className="font-medium text-lg">Money</span>
                            </div>
                            <span className="text-sm opacity-80">Wallet ></span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold">¥888.88</span>
                                <span className="text-xs opacity-70 mt-1">Balance</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xl font-bold">2</span>
                                <span className="text-xs opacity-70 mt-1">Cards</span>
                            </div>
                        </div>
                    </div>

                    {/* Financial */}
                    <Section title="Financial Services">
                         <ServiceIcon color="bg-orange-400" icon="💳" label="Card Repay" />
                         <ServiceIcon color="bg-yellow-500" icon="📈" label="Wealth" />
                         <ServiceIcon color="bg-blue-500" icon="🛡️" label="Insurance" />
                         <ServiceIcon color="bg-green-600" icon="💹" label="Stocks" />
                    </Section>

                    {/* Daily Services */}
                    <Section title="Daily Services">
                         <ServiceIcon color="bg-green-500" icon="📱" label="Mobile Top Up" />
                         <ServiceIcon color="bg-blue-400" icon="💡" label="Utilities" />
                         <ServiceIcon color="bg-indigo-500" icon="🏥" label="Health" />
                         <ServiceIcon color="bg-orange-500" icon="🏙️" label="Public Services" />
                         <ServiceIcon color="bg-red-400" icon="❤️" label="Tencent Charity" />
                    </Section>

                    {/* Travel & Transport */}
                    <Section title="Travel & Transportation">
                         <ServiceIcon color="bg-gray-800" icon="🚗" label="Ride Hailing" />
                         <ServiceIcon color="bg-blue-600" icon="🚆" label="Rail & Flights" />
                         <ServiceIcon color="bg-orange-500" icon="🏨" label="Hotels" />
                         <ServiceIcon color="bg-green-500" icon="🚲" label="Bike Share" />
                    </Section>

                    {/* Shopping & Entertainment */}
                    <Section title="Shopping & Entertainment">
                         <ServiceIcon color="bg-red-500" icon="🛍️" label="Specials" />
                         <ServiceIcon color="bg-orange-600" icon="🎬" label="Movie Tickets" />
                         <ServiceIcon color="bg-pink-500" icon="📦" label="Delivery" />
                         <ServiceIcon color="bg-purple-500" icon="👗" label="Flash Sales" />
                    </Section>
                </div>
                
                <div className="text-center py-4 text-gray-400 text-xs">
                    Provided by Tencent & Third-party Operators
                </div>
            </ScrollArea>
        </div>
    );
};
