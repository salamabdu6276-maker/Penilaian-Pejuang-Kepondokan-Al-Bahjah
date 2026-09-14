import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/main.tsx', 'utf-8');

const polyfill = `// Polyfill to prevent html-to-image from crashing on cross-origin CSS rules (like Google Translate)
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

`;

if (!content.includes('originalCssRules')) {
    content = polyfill + content;
    writeFileSync('src/main.tsx', content);
    console.log('Polyfill injected');
} else {
    console.log('Polyfill already exists');
}
