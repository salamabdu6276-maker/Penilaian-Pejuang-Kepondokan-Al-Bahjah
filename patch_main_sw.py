import re

with open('src/main.tsx', 'r') as f:
    content = f.read()

sw_registration = """
if ('serviceWorker' in navigator && 'Notification' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW registered!', reg);
      
      // Request permission for notifications if not already granted
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }).catch(err => console.log('SW registration failed: ', err));
  });
}

"""

if 'serviceWorker' not in content:
    content = content.replace("import './index.css';", "import './index.css';\n" + sw_registration)

with open('src/main.tsx', 'w') as f:
    f.write(content)
