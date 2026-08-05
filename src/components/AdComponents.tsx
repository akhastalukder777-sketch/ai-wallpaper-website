'use client';

import React, { useEffect } from 'react';

interface AdUnitProps {
  className?: string;
}

// 1. Banner 728x90 Isolated Component (Header & Footer Leaderboard)
function Banner728x90() {
  return (
    <div className="w-full max-w-[728px] min-h-[90px] mx-auto flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 my-2">
      <iframe
        title="Header Banner 728x90"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : 'cb9df03cc5821be7ab9bee326d859dca',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://delvefencescrewdriver.com/cb9df03cc5821be7ab9bee326d859dca/invoke.js"></script>
            </body>
          </html>
        `}
        width={728}
        height={90}
        className="w-[728px] h-[90px] border-0 overflow-hidden scale-90 sm:scale-100 origin-center"
        scrolling="no"
      />
    </div>
  );
}

// 2. Banner 300x250 Isolated Component (Modal & Sidebar)
function Banner300x250() {
  return (
    <div className="w-[300px] h-[250px] mx-auto flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/80 my-2">
      <iframe
        title="Square Banner 300x250"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
            </head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '2c199a76af40dbf25174465f9843bf7c',
                  'format' : 'iframe',
                  'height' : 250,
                  'width' : 300,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://delvefencescrewdriver.com/2c199a76af40dbf25174465f9843bf7c/invoke.js"></script>
            </body>
          </html>
        `}
        width={300}
        height={250}
        className="w-[300px] h-[250px] border-0 overflow-hidden"
        scrolling="no"
      />
    </div>
  );
}

// 3. Native Banner Isolated Component (InFeed Cards)
function NativeBannerUnit() {
  return (
    <div className="w-full min-h-[160px] flex items-center justify-center my-2 overflow-hidden rounded-2xl bg-slate-900/30 border border-slate-800/60 p-2">
      <iframe
        title="Native InFeed Ad"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; color: #fff; font-family: sans-serif; }</style>
            </head>
            <body>
              <div id="container-e64a06e20e81891e6afb13d2f05e87f1"></div>
              <script async="async" data-cfasync="false" src="https://delvefencescrewdriver.com/e64a06e20e81891e6afb13d2f05e87f1/invoke.js"></script>
            </body>
          </html>
        `}
        className="w-full min-h-[160px] border-0 overflow-hidden"
        scrolling="no"
      />
    </div>
  );
}

// 4. Social Bar Floating Script Component
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

// 1. Header Ad Unit
export function HeaderAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <Banner728x90 />
    </div>
  );
}

// 2. Sidebar Ad Unit
export function SidebarAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`my-2 ${className}`}>
      <Banner300x250 />
    </div>
  );
}

// 3. InFeed Grid Ad Unit
export function InFeedAd({ className = '' }: AdUnitProps) {
  return (
    <div className={className}>
      <NativeBannerUnit />
    </div>
  );
}

// 4. Modal Ad Unit (Inside 4K Wallpaper Popup)
export function ModalAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`my-2 ${className}`}>
      <Banner300x250 />
    </div>
  );
}

// 5. Footer Ad Unit
export function FooterAd({ className = '' }: AdUnitProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 ${className}`}>
      <Banner728x90 />
      <SocialBarAd />
    </div>
  );
}