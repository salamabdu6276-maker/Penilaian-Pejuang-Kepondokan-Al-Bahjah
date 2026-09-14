export function translateText(str: string): string {
  if (!str) return str;
  try {
    const b64 = btoa(unescape(encodeURIComponent(str)));
    let el = document.querySelector(`span[data-key="${b64}"]`);
    
    // If element doesn't exist, create it in a hidden container so Google Translate can process it
    if (!el) {
      let container = document.getElementById('dynamic-translation-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'dynamic-translation-container';
        container.style.position = 'absolute';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        container.style.width = '1px';
        container.style.height = '1px';
        container.style.overflow = 'hidden';
        container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(container);
      }
      el = document.createElement('span');
      el.setAttribute('data-key', b64);
      el.textContent = str;
      container.appendChild(el);
    }
    
    return el ? (el.textContent || str) : str;
  } catch (e) {
    return str;
  }
}
