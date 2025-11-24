
import React from 'react';
import { ViewState } from '../types';
import { ScrollArea } from '../components/Layout';
import { 
  IconMoments, 
  IconChannels, 
  IconScan, 
  IconShake, 
  IconTopStories, 
  IconSearchDiscover, 
  IconGames, 
  IconMiniProgram 
} from '../components/Icons';

interface DiscoverProps {
  onNavigate: (view: ViewState) => void;
}

const MenuItem = ({ icon, label, onClick, badge, subtext }: any) => (
  <div onClick={onClick} className="flex items-center px-4 py-3 bg-white border-b border-wechat-divider active:bg-gray-100 cursor-pointer">
    <div className="w-6 h-6 mr-4 flex items-center justify-center">{icon}</div>
    <span className="flex-1 text-base text-black">{label}</span>
    {subtext && <span className="text-gray-400 text-sm mr-2">{subtext}</span>}
    {badge && <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>}
    <span className="text-gray-400">{'>'}</span>
  </div>
);

export const Discover = ({ onNavigate }: DiscoverProps) => {
  return (
    <>
      <div className="bg-wechat-header h-14 px-4 flex items-center justify-between shrink-0 border-b border-wechat-divider sticky top-0 z-10">
        <span className="font-semibold text-lg">Discover</span>
      </div>
      <ScrollArea className="bg-[#EDEDED]">
        {/* Group 1: Moments */}
        <div className="mt-0">
          <MenuItem 
            icon={<div className="text-blue-500"><IconMoments /></div>} 
            label="Moments" 
            onClick={() => onNavigate({ type: 'MOMENTS' })} 
            badge={true}
          />
        </div>
        
        {/* Group 2: Channels */}
        <div className="mt-2">
          <MenuItem 
            icon={<IconChannels />} 
            label="Channels" 
            onClick={() => onNavigate({ type: 'CHANNELS' })} 
            subtext="Hot"
          />
        </div>

        {/* Group 3: Scan & Shake */}
        <div className="mt-2">
          <MenuItem 
            icon={<IconScan />} 
            label="Scan" 
            onClick={() => onNavigate({ type: 'DISCOVER_SCAN' })} 
          />
          <MenuItem 
            icon={<IconShake />} 
            label="Shake" 
            onClick={() => onNavigate({ type: 'DISCOVER_SHAKE' })} 
          />
        </div>

        {/* Group 4: Top Stories & Search */}
        <div className="mt-2">
          <MenuItem 
            icon={<IconTopStories />} 
            label="Top Stories" 
            onClick={() => onNavigate({ type: 'DISCOVER_TOP_STORIES' })} 
          />
          <MenuItem 
            icon={<IconSearchDiscover />} 
            label="Search" 
            onClick={() => onNavigate({ type: 'DISCOVER_SEARCH' })} 
          />
        </div>

        {/* Group 5: Games */}
        <div className="mt-2">
          <MenuItem 
            icon={<IconGames />} 
            label="Games" 
            onClick={() => onNavigate({ type: 'DISCOVER_GAMES' })} 
            subtext="New"
          />
        </div>
        
        {/* Group 6: Mini Programs */}
        <div className="mt-2 mb-4">
          <MenuItem 
            icon={<IconMiniProgram />} 
            label="Mini Programs" 
            onClick={() => onNavigate({ type: 'DISCOVER_MINI_PROGRAMS' })} 
          />
        </div>
      </ScrollArea>
    </>
  );
};
