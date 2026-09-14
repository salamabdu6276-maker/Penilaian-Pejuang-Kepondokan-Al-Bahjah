export function translateText(str: string): string {
  if (!str) return str;
  try {
    const b64 = btoa(unescape(encodeURIComponent(str)));
    const el = document.querySelector(`span[data-key="${b64}"]`);
    return el ? (el.textContent || str) : str;
  } catch (e) {
    return str;
  }
}
