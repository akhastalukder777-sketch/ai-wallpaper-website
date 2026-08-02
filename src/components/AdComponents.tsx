'use client';

import React, { useEffect } from 'react';

interface AdUnitProps {
  className?: string;
}

// Environment Variable Configuration for Ad Network Switching
const AD_NETWORK = process.env.NEXT_PUBLIC_AD_NETWORK || 'AdSense';

function AdScriptContainer({ children, placeholderText, heightClass = 'h-24' }: { children?: React.ReactNode; placeholderText: string; heightClass?: string }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('Ad script initialization', e);
    }
  }, []);

  return (
    <div className={`w-full ${heightClass} rounded-2xl bg-slate-900/40 border border-dashed border-slate-800/80 flex flex-col items-center justify-center p-3 my-4 overflow-hidden relative group transition-all hover:border-indigo-500/30`}>
      {/* Network Badge */}
      <div className="absolute top-2 right-3 text-[10px] uppercase font-semibold text-slate-600 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
        {AD_NETWORK}
      </div>

      {children ? (
        children
      ) : (
        <div className="text-center space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            {placeholderText}
          </div>
          <div className="text-[10px] text-slate-600">
            Automated Monetization Area
          </div>
        </div>
      )}
    </div>
  );
}

// 1. Header Ad Unit
export function HeaderAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <AdScriptContainer placeholderText="Header Advertisement Banner (728x90 / Responsive)" heightClass="h-24 sm:h-28" />
    </div>
  );
}

// 2. Sidebar Ad Unit
export function SidebarAd({ className = '' }: AdUnitProps) {
  return (
    <div className={className}>
      <AdScriptContainer placeholderText="Sidebar Ad (300x250)" heightClass="h-64" />
    </div>
  );
}

// 3. InFeed Grid Ad Unit (Between Wallpaper Cards)
export function InFeedAd({ className = '' }: AdUnitProps) {
  return (
    <div className={className}>
      <AdScriptContainer placeholderText="Native In-Feed Sponsored Card" heightClass="h-64 sm:h-72" />
    </div>
  );
}

// 4. Modal Ad Unit (Inside Fullscreen 4K Wallpaper Popup)
export function ModalAd({ className = '' }: AdUnitProps) {
  return (
    <div className={className}>
      <AdScriptContainer placeholderText="4K Download Popup Ad (Responsive)" heightClass="h-20" />
    </div>
  );
}

// 5. Footer Ad Unit
export function FooterAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <AdScriptContainer placeholderText="Footer Sponsored Banner (728x90)" heightClass="h-24" />
    </div>
  );
}