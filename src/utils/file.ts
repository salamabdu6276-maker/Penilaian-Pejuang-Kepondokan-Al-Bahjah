import React from 'react';

export const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFoto: (url: string) => void) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 1000;
      const MAX_HEIGHT = 1000;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (file.type === "image/png" || file.type === "image/webp") {
          ctx.drawImage(img, 0, 0, width, height);
          setFoto(canvas.toDataURL("image/png"));
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          setFoto(canvas.toDataURL("image/jpeg", 0.6));
        }
      }
    };
    img.src = ev.target?.result as string;
  };
  reader.readAsDataURL(file);
};
