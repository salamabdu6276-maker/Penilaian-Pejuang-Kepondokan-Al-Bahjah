import { useState, useEffect } from 'react';
import { fetchAppLogo } from '../services/dbService';

export function useAppLogo() {
  const [logo, setLogo] = useState<string>("/logo.png");

  useEffect(() => {
    const updateFavicon = (url: string) => {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = url;
    };

    const loadLogo = async () => {
      const url = await fetchAppLogo();
      if (url) {
        setLogo(url);
        updateFavicon(url);
      } else {
        updateFavicon("/logo.png");
      }
    };
    
    loadLogo();

    const handleUpdate = () => {
      loadLogo();
    };

    window.addEventListener("logo-updated", handleUpdate);
    return () => window.removeEventListener("logo-updated", handleUpdate);
  }, []);

  return logo;
}
