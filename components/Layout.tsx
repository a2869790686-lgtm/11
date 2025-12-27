import React from 'react';

export const Screen = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => {
  return (
    <div className={`flex flex-col h-full w-full max-w-md mx-auto bg-wechat-bg relative shadow-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const Header = ({ 
  title, 
  onBack, 
  rightAction,
  dark = false
}: { 
  title: string, 
  onBack?: () => void, 
  rightAction?: React.ReactNode,
  dark?: boolean
}) => {
  return (
    <div className={`flex items-center justify-between px-4 h-14 shrink-0 z-20 ${dark ? 'bg-wechat-header text-black' : 'bg-wechat-header text-black'} border-b border-wechat-divider`}>
      <div className="flex items-center w-16">
        {onBack && (
          <button onClick={onBack} className="flex items-center -ml-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <span className="text-base font-normal">Back</span>
          </button>
        )}
      </div>
      <h1 className="text-lg font-semibold truncate">{title}</h1>
      <div className="flex items-center justify-end w-16">
        {rightAction}
      </div>
    </div>
  );
};

// Fix: Use React.forwardRef and React.HTMLAttributes<HTMLDivElement> to support 
// additional props like ref, onScroll, onTouchStart, etc.
export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, className = '', ...props }, ref) => {
  return (
    <div ref={ref} className={`flex-1 overflow-y-auto no-scrollbar ${className}`} {...props}>
      {children}
    </div>
  );
});