'use client';

import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  className?: string;
}

const AD_NETWORK = process.env.NEXT_PUBLIC_AD_NETWORK || 'Adsterra';

// Reusable Ad Unit Container Helper
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

// Banner 300x250 Live Adsterra Script Component
function Banner300x250() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.hasChildNodes()) {
      try {
        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.innerHTML = `
          atOptions = {
            'key' : '2c199a76af40dbf25174465f9843bf7c',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `;
        const adScript = document.createElement('script');
        adScript.type = 'text/javascript';
        adScript.src = 'https://delvefencescrewdriver.com/2c199a76af40dbf25174465f9843bf7c/invoke.js';

        adRef.current.appendChild(confScript);
        adRef.current.appendChild(adScript);
      } catch (e) {
        console.warn('300x250 Adsterra error', e);
      }
    }
  }, []);

  return (
    <div className="w-[300px] h-[250px] mx-auto flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80">
      <div ref={adRef} className="w-[300px] h-[250px]"></div>
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

// 2. Sidebar Ad Unit (Live 300x250 Adsterra Banner)
export function SidebarAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`my-4 ${className}`}>
      <Banner300x250 />
    </div>
  );
}

// 3. InFeed Grid Ad Unit (Live Adsterra Native Banner Container)
export function InFeedAd({ className = '' }: AdUnitProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.hasChildNodes()) {
      try {
        const script = document.createElement('script');
        script.src = 'https://delvefencescrewdriver.com/e64a06e20e81891e6afb13d2f05e87f1/invoke.js';
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        containerRef.current.appendChild(script);
      } catch (e) {
        console.warn('Native Adsterra error', e);
      }
    }
  }, []);

  return (
    <div className={`w-full min-h-[220px] flex items-center justify-center my-4 overflow-hidden rounded-2xl bg-slate-900/30 border border-slate-800/60 p-2 ${className}`}>
      <div id="container-e64a06e20e81891e6afb13d2f05e87f1" ref={containerRef} className="w-full flex justify-center"></div>
    </div>
  );
}

// 4. Modal Ad Unit (Live 300x250 Adsterra Banner inside 4K Wallpaper Popup)
export function ModalAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`my-3 ${className}`}>
      <Banner300x250 />
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