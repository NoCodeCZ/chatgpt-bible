'use client';

import { useEffect } from 'react';

export default function BackgroundAnimation() {
  useEffect(() => {
    // Load UnicornStudio script
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js';
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized && window.UnicornStudio.init) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(script);
    }
  }, []);

  return (
    <div 
      className="aura-background-component fixed top-0 w-full h-screen z-0" 
      data-alpha-mask="80"
      style={{ 
        maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 70%, transparent 85%)', 
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 70%, transparent 85%)',
        pointerEvents: 'none'
      }}
    >
      <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
        <div 
          data-us-project="HzcaAbRLaALMhHJp8gLY" 
          className="absolute w-full h-full left-0 top-0 -z-10"
        />
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init?: () => void;
    };
  }
}

