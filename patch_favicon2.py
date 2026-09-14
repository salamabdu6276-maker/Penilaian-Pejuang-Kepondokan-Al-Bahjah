import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

hook_target = """export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {"""

hook_new = """export default function App() {
  const appLogo = useAppLogo();
  
  useEffect(() => {
    if (appLogo) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = appLogo;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = appLogo;
        document.head.appendChild(newLink);
      }
    }
  }, [appLogo]);

  const [darkMode, setDarkMode] = useState<boolean>(() => {"""

content = content.replace(hook_target, hook_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
