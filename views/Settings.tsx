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

                <div className="mt-2">
                    <SettingsItem
                        label="AI 接口设置"
                        value="DeepSeek API"
                        onClick={() => onNavigate({ type: 'SETTINGS_API_KEY' })}
                    />
                </div>
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



export const ApiKeySettings = ({ onBack }: { onBack: () => void }) => {
    const [key, setKey] = React.useState(() => localStorage.getItem('wx_deepseek_api_key') || '');
    const [show, setShow] = React.useState(false);
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        if (key.trim()) {
            localStorage.setItem('wx_deepseek_api_key', key.trim());
        } else {
            localStorage.removeItem('wx_deepseek_api_key');
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleClear = () => {
        if (window.confirm('确定清除 API Key 吗？')) {
            setKey('');
            localStorage.removeItem('wx_deepseek_api_key');
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#EDEDED]">
            <div className="flex items-center justify-between px-4 h-14 bg-[#EDEDED] shrink-0 border-b border-gray-200">
                <button onClick={onBack} className="text-black text-base text-lg pl-1">{'←'}</button>
                <span className="font-semibold text-lg">AI 接口设置</span>
                <div className="w-8" />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        DeepSeek API Key
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <input
                            type={show ? "text" : "password"}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="请输入您的 DeepSeek API Key"
                            className="flex-1 px-3 py-2.5 text-base outline-none border-none"
                        />
                        <button
                            onClick={() => setShow(!show)}
                            className="px-3 py-2.5 text-gray-500 hover:text-gray-700 text-lg"
                        >
                            {show ? '\u25cf' : '\u25cb'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        登录 platform.deepseek.com 获取您的 API Key。密钥仅存储在您的手机本地。
                    </p>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleSave}
                            className="flex-1 py-2.5 bg-wechat-green text-white rounded-lg font-medium active:bg-green-600"
                        >
                            {saved ? '\u2713 保存成功' : '保存密钥'}
                        </button>
                        {key && (
                            <button
                                onClick={handleClear}
                                className="py-2.5 px-4 bg-gray-100 text-gray-600 rounded-lg font-medium active:bg-gray-200"
                            >
                                清除
                            </button>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm mt-3">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">常见问题</h3>
                    <ul className="text-xs text-gray-500 space-y-1.5 list-disc pl-4">
                        <li>确保 API Key 有足够的调用额度</li>
                        <li>如果改变了密钥请重新保存</li>
                        <li>每个聊天角色都会调用 API 回复</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

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