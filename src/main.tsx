// Polyfill to prevent html-to-image from crashing on cross-origin CSS rules (like Google Translate)
const originalCssRules = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'cssRules');
if (originalCssRules) {
  Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
    get() {
      try {
        return originalCssRules.get.call(this);
      } catch (e) {
        return [];
      }
    }
  });
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if ('serviceWorker' in navigator && 'Notification' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW registered!', reg);
      reg.update();
      
      // Request permission for notifications if not already granted
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }).catch(err => console.log('SW registration failed: ', err));
  });
}



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
