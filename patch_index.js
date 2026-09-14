const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const search = `    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
          }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
        });
      }
    </script>`;
html = html.replace(search, '');
fs.writeFileSync('index.html', html);
console.log('removed script');
