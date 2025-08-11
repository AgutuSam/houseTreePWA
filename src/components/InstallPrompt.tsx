// src/components/InstallPrompt.tsx

import React, { useState, useEffect } from 'react';

declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
    prompt(): Promise<void>;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const InstallPrompt: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      setShow(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show browser install prompt

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setShow(false);
        setDeferredPrompt(null);
      });
    }
  };

  const handleCloseClick = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform overflow-hidden rounded-lg bg-emerald-600 px-4 py-3 text-white shadow-lg transition-all duration-300 ease-in-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className="shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Text */}
        <div className="ml-3 mr-8 flex-1">
          <p className="text-sm font-medium">Add House Tree to Home Screen</p>
          <p className="mt-1 text-sm opacity-90">
            Install the app for a better experience and quick access to properties.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleCloseClick}
          className="absolute right-2 top-2 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Action Button */}
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleInstallClick}
          className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-emerald-600 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
        >
          Install App
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
