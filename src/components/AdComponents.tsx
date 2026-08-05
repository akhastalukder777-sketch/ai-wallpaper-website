'use client';

import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  className?: string;
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
    <div className="w-[300px] h-[250px] mx-auto flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 my-2">
      <div ref={adRef} className="w-[300px] h-[250px]"></div>
    </div>
  );
}

// Native Banner Live Adsterra Script Component
function NativeBannerUnit() {
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
    <div className="w-full min-h-[180px] flex items-center justify-center my-2 overflow-hidden rounded-2xl bg-slate-900/30 border border-slate-800/60 p-2">
      <div id="container-e64a06e20e81891e6afb13d2f05e87f1" ref={containerRef} className="w-full flex justify-center"></div>
    </div>
  );
}

// 1. Header Ad Unit (Live Adsterra Native Banner)
export function HeaderAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <NativeBannerUnit />
    </div>
  );
}

// 2. Sidebar Ad Unit (Live 300x250 Adsterra Banner)
export function SidebarAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`my-2 ${className}`}>
      <Banner300x250 />
    </div>
  );
}

// 3. InFeed Grid Ad Unit (Live Adsterra Native Banner)
export function InFeedAd({ className = '' }: AdUnitProps) {
  return (
    <div className={className}>
      <NativeBannerUnit />
    </div>
  );
}

// 4. Modal Ad Unit (Live 300x250 Adsterra Banner inside 4K Wallpaper Popup)
export function ModalAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`my-2 ${className}`}>
      <Banner300x250 />
    </div>
  );
}

// 5. Footer Ad Unit (Live Adsterra Native Banner)
export function FooterAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <NativeBannerUnit />
    </div>
  );
}