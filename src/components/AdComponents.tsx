'use client';

import React, { useEffect, useRef } from 'react';

interface AdUnitProps {
  className?: string;
}

// 1. Banner 728x90 Live Adsterra Script Component (Header & Footer Leaderboard)
function Banner728x90() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.hasChildNodes()) {
      try {
        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.innerHTML = `
          atOptions = {
            'key' : 'cb9df03cc5821be7ab9bee326d859dca',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `;
        const adScript = document.createElement('script');
        adScript.type = 'text/javascript';
        adScript.src = 'https://delvefencescrewdriver.com/cb9df03cc5821be7ab9bee326d859dca/invoke.js';

        adRef.current.appendChild(confScript);
        adRef.current.appendChild(adScript);
      } catch (e) {
        console.warn('728x90 Adsterra error', e);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-[728px] h-[90px] mx-auto flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 my-2">
      <div ref={adRef} className="w-[728px] h-[90px]"></div>
    </div>
  );
}

// 2. Banner 300x250 Live Adsterra Script Component (Modal & Sidebar)
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

// 3. Native Banner Live Adsterra Script Component (InFeed Cards)
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

// 4. Social Bar Floating Live Adsterra Script
function SocialBarAd() {
  useEffect(() => {
    try {
      const existingScript = document.getElementById('adsterra-social-bar');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'adsterra-social-bar';
        script.src = 'https://delvefencescrewdriver.com/4c/93/23/4c9323abd01b9aafb49b65a4bfc4c546.js';
        script.async = true;
        document.body.appendChild(script);
      }
    } catch (e) {
      console.warn('Social Bar Adsterra error', e);
    }
  }, []);

  return null;
}

// 1. Header Ad Unit (728x90 Leaderboard Banner)
export function HeaderAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <Banner728x90 />
    </div>
  );
}

// 2. Sidebar Ad Unit (300x250 Square Banner)
export function SidebarAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`my-2 ${className}`}>
      <Banner300x250 />
    </div>
  );
}

// 3. InFeed Grid Ad Unit (Native Sponsored Banner Card)
export function InFeedAd({ className = '' }: AdUnitProps) {
  return (
    <div className={className}>
      <NativeBannerUnit />
    </div>
  );
}

// 4. Modal Ad Unit (300x250 Square Banner inside 4K Wallpaper Popup)
export function ModalAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`my-2 ${className}`}>
      <Banner300x250 />
    </div>
  );
}

// 5. Footer Ad Unit (728x90 Leaderboard Banner + Floating Social Bar)
export function FooterAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <Banner728x90 />
      <SocialBarAd />
    </div>
  );
}