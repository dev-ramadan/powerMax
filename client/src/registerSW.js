/**
 * registerSW.js
 * Registers the Service Worker for POWER MAX PWA.
 * Call this from main.jsx after the React app mounts.
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60 * 1000);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New version available — you can show a toast here
              console.log('[PWA] New version available! Refresh to update.');
            }
          });
        });
      } catch (error) {
        console.warn('[PWA] Service Worker registration failed:', error);
      }
    });
  }
}
