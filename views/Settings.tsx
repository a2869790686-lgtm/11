
import React from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { ViewState } from '../types';

const SettingsItem = ({ label, value, onClick, isLink = true, centered = false, className = '' }: any) => (
  <div 
    onClick={onClick} 
    className={`flex items-center px-4 py-3 bg-white border-b border-wechat-divider ${onClick ? 'active:bg-gray-50 cursor-pointer' : ''} ${className}`}
  >
    {centered ? (
        <span className="flex-1 text-base text-center font-medium">{label}</span>
    ) : (
        <>
            <span className="flex-1 text-base text-black">{label}</span>
            {value && <span className="text-gray-400 mr-2 text-sm">{value}</span>}
            {isLink && <span className="text-gray-400">{'>'}</span>}
        </>
    )}
  </div>
);

export const Settings = ({ onNavigate, onBack }: { onNavigate: (v: ViewState) => void, onBack: () => void }) => {
    
    const handleLogout = () => {
        if(window.confirm("Log out of WeChat?")) {
            // In a real app we would clear auth tokens.
            // Here we just reload to simulate a reset, or clear local storage if we wanted to fully reset.
            // keeping it simple to just reload for effect.
            localStorage.removeItem('wx_current_user');
            window.location.reload();
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title="Settings" onBack={onBack} />
            <ScrollArea className="bg-[#EDEDED]">
                <div className="mt-0">
                    <SettingsItem label="Account Security" />
                </div>

                <div className="mt-2">
                    <SettingsItem label="Message Notifications" />
                    <SettingsItem label="Friends' Permissions" />
                    <SettingsItem label="Personal Information Collection List" />
                    <SettingsItem label="Third-Party Lists" />
                </div>
                
                <div className="mt-2">
                    <SettingsItem 
                        label="General" 
                        onClick={() => onNavigate({ type: 'SETTINGS_GENERAL' })}
                    />
                    <SettingsItem label="Privacy" />
                </div>

                <div className="mt-2">
                    <SettingsItem label="Help & Feedback" />
                    <SettingsItem label="About WeChat" value="Version 8.0.42" />
                </div>

                 <div className="mt-2">
                    <SettingsItem label="Switch Account" />
                </div>

                <div className="mt-2 mb-8">
                    <SettingsItem label="Log Out" centered onClick={handleLogout} className="text-black" />
                </div>
            </ScrollArea>
        </div>
    );
}

export const SettingsGeneral = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title="General" onBack={onBack} />
            <ScrollArea className="bg-[#EDEDED]">
                <div className="mt-0">
                    <SettingsItem label="Appearance" value="System Default" />
                    <SettingsItem label="Dark Mode" value="Off" />
                </div>

                <div className="mt-2">
                    <SettingsItem label="Language" value="English" />
                    <SettingsItem label="Font Size" />
                </div>

                 <div className="mt-2">
                    <SettingsItem label="Photos, Videos, Files, and Calls" />
                    <SettingsItem label="Manage Storage" />
                    <SettingsItem label="Tools" />
                </div>

                <div className="mt-2">
                     <SettingsItem label="WeChat Pay" />
                </div>
            </ScrollArea>
        </div>
    );
}
