/**
 * Utility to dynamically update browser favicon and apple-touch-icon
 * Ensures full cross-browser cache-busting and immediate rendering
 */
export function updateAppFavicon(url: string | null | undefined): void {
  if (!url) return;

  try {
    // 1. Remove all previous icon link tags to force browser to recognize change
    const oldLinks = document.querySelectorAll(
      "link[rel*='icon'], link[rel*='apple-touch-icon']"
    );
    oldLinks.forEach((link) => link.remove());

    const isSvg = url.startsWith("data:image/svg") || url.endsWith(".svg");
    const mimeType = isSvg ? "image/svg+xml" : "image/png";

    // 2. Standard rel="icon"
    const linkIcon = document.createElement("link");
    linkIcon.id = "app-favicon";
    linkIcon.rel = "icon";
    linkIcon.type = mimeType;
    linkIcon.href = url;
    document.head.appendChild(linkIcon);

    // 3. rel="shortcut icon" (Chrome/Edge legacy fallback)
    const linkShortcut = document.createElement("link");
    linkShortcut.rel = "shortcut icon";
    linkShortcut.type = mimeType;
    linkShortcut.href = url;
    document.head.appendChild(linkShortcut);

    // 4. rel="apple-touch-icon" (iOS Safari & PWA Home Screen)
    const linkApple = document.createElement("link");
    linkApple.rel = "apple-touch-icon";
    linkApple.href = url;
    document.head.appendChild(linkApple);
  } catch (err) {
    console.warn("Gagal memperbarui favicon:", err);
  }
}
