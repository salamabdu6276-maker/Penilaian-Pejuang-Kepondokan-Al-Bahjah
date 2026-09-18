import { useState, useEffect } from 'react';
import { fetchAppLogo } from '../services/dbService';
import { updateAppFavicon } from '../utils/favicon';

export function useAppLogo() {
  const [logo, setLogo] = useState<string>(() => {
    return localStorage.getItem("APP_LOGO") || "/logo.png";
  });

  useEffect(() => {
    const loadLogo = async () => {
      const url = await fetchAppLogo();
      if (url) {
        setLogo(url);
        try {
          localStorage.setItem("APP_LOGO", url);
        } catch (e) {}
        updateAppFavicon(url);
      } else {
        updateAppFavicon("/logo.png");
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
