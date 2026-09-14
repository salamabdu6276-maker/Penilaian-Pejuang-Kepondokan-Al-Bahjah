import re

with open('src/utils/file.ts', 'r') as f:
    content = f.read()

target = """      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      
      setFoto(canvas.toDataURL("image/jpeg", 0.5));"""

replacement = """      const ctx = canvas.getContext("2d");
      if (ctx) {
        // If it's a PNG, we want to preserve transparency for logos.
        // Otherwise, draw a white background for JPEGs to prevent black backgrounds on transparent images.
        if (file.type === "image/png" || file.type === "image/webp") {
          setFoto(canvas.toDataURL("image/png"));
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          setFoto(canvas.toDataURL("image/jpeg", 0.5));
        }
      }"""

# Actually, if it's a PNG we still need to draw the image!
replacement2 = """      const ctx = canvas.getContext("2d");
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
      }"""

content = content.replace(target, replacement2)

with open('src/utils/file.ts', 'w') as f:
    f.write(content)

