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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
