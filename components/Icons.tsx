import React from 'react';

export const IconChat = ({ active }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? "#07C160" : "none"} stroke={active ? "#07C160" : "currentColor"} strokeWidth={active ? "0" : "1.5"} className={active ? "" : "text-black"}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const IconContacts = ({ active }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? "#07C160" : "none"} stroke={active ? "#07C160" : "currentColor"} strokeWidth={active ? "0" : "1.5"} className={active ? "" : "text-black"}>
     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export const IconDiscover = ({ active }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? "#07C160" : "none"} stroke={active ? "#07C160" : "currentColor"} strokeWidth={active ? "0" : "1.5"} className={active ? "" : "text-black"}>
    <circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

export const IconMe = ({ active }: { active?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={active ? "#07C160" : "none"} stroke={active ? "#07C160" : "currentColor"} strokeWidth={active ? "0" : "1.5"} className={active ? "" : "text-black"}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const IconChevronLeft = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);

export const IconPlus = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const IconMore = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
);

export const IconVoice = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
);

export const IconKeyboard = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6" y2="8"></line><line x1="10" y1="8" x2="10" y2="8"></line><line x1="14" y1="8" x2="14" y2="8"></line><line x1="18" y1="8" x2="18" y2="8"></line><line x1="6" y1="12" x2="6" y2="12"></line><line x1="10" y1="12" x2="10" y2="12"></line><line x1="14" y1="12" x2="14" y2="12"></line><line x1="18" y1="12" x2="18" y2="12"></line><line x1="6" y1="16" x2="6" y2="16"></line><line x1="10" y1="16" x2="15" y2="16"></line></svg>
);

export const IconCamera = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
);

export const IconMoments = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l2 2 4-4" />
  </svg>
);

export const IconFace = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

// New Icons for Discover
export const IconChannels = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8" fill="orange" stroke="none"></polygon>
  </svg>
);

export const IconScan = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#576B95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

export const IconShake = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#576B95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="18.01"></line>
  </svg>
);

export const IconTopStories = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F6C343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

export const IconSearchDiscover = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FA5151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export const IconGames = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F6C343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M6 12h4m-2-2v4"></path><path d="M15 11h.01"></path><path d="M18 13h.01"></path>
  </svg>
);

export const IconMiniProgram = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7D90A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><path d="M8 12l2-2 2 2-2 2z" fill="#7D90A9" stroke="none"></path><path d="M14 10h-2v4h2"></path>
  </svg>
);
