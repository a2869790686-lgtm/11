import React from 'react';
import { Header, ScrollArea } from '../components/Layout';
import { useStore } from '../hooks/useStore';
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
    const { t } = useStore();

    const handleLogout = () => {
        if(window.confirm(t('log_out') + "?")) {
            localStorage.removeItem('wx_current_user');
            window.location.reload();
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title={t('settings')} onBack={onBack} />
            <ScrollArea className="bg-[#EDEDED]">
                <div className="mt-0">
                    <SettingsItem label={t('account_security')} />
                </div>

                <div className="mt-2">
                    <SettingsItem label={t('message_notifications')} />
                    <SettingsItem label={t('friends_permissions')} />
                    <SettingsItem label={t('personal_info_collection')} />
                    <SettingsItem label={t('third_party_lists')} />
                </div>
                
                <div className="mt-2">
                    <SettingsItem 
                        label={t('general')} 
                        onClick={() => onNavigate({ type: 'SETTINGS_GENERAL' })}
                    />
                    <SettingsItem label={t('privacy')} />
                </div>

                <div className="mt-2">
                    <SettingsItem label={t('help_feedback')} />
                    <SettingsItem label={t('about')} value="Version 8.0.42" />
                </div>

                 <div className="mt-2">
                    <SettingsItem label={t('switch_account')} />
                </div>

                <div className="mt-2 mb-8">
                    <SettingsItem label={t('log_out')} centered onClick={handleLogout} className="text-black" />
                </div>
            </ScrollArea>
        </div>
    );
}

export const SettingsGeneral = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (v: ViewState) => void }) => {
    const { language, t } = useStore();
    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <Header title={t('general')} onBack={onBack} />
            <ScrollArea className="bg-[#EDEDED]">
                <div className="mt-0">
                    <SettingsItem label={t('appearance')} value={t('system_default')} />
                    <SettingsItem label={t('dark_mode')} value={t('off')} />
                </div>

                <div className="mt-2">
                    <SettingsItem 
                        label={t('language')} 
                        value={language === 'en' ? 'English' : '简体中文'} 
                        onClick={() => onNavigate({ type: 'SETTINGS_LANGUAGE' })}
                    />
                    <SettingsItem label={t('font_size')} />
                </div>

                 <div className="mt-2">
                    <SettingsItem label={t('manage_storage')} />
                    <SettingsItem label={t('tools')} />
                </div>

                <div className="mt-2">
                     <SettingsItem label={t('wechat_pay')} />
                </div>
            </ScrollArea>
        </div>
    );
}

export const LanguageSettings = ({ onBack }: { onBack: () => void }) => {
    const { language, setLanguage, t } = useStore();
    const [selected, setSelected] = React.useState<'en' | 'zh'>(language);

    const handleSave = () => {
        setLanguage(selected);
        onBack();
    };

    const LanguageOption = ({ val, label }: { val: 'en' | 'zh', label: string }) => (
        <div 
            onClick={() => setSelected(val)}
            className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider cursor-pointer"
        >
            <span className="flex-1 text-base text-black">{label}</span>
            {selected === val && <span className="text-wechat-green text-lg">✔</span>}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
             <div className="flex items-center justify-between px-4 h-14 bg-[#EDEDED] shrink-0 border-b border-gray-200">
                <button onClick={onBack} className="text-black text-base">{t('cancel')}</button>
                <span className="font-semibold text-lg">{t('language')}</span>
                <button 
                  onClick={handleSave}
                  className="px-3 py-1.5 rounded text-white text-sm font-medium bg-wechat-green"
                >
                  {t('done')}
                </button>
            </div>
            <ScrollArea className="bg-[#EDEDED]">
                <div className="mt-0">
                    <LanguageOption val="zh" label="简体中文" />
                    <LanguageOption val="en" label="English" />
                </div>
            </ScrollArea>
        </div>
    );
};