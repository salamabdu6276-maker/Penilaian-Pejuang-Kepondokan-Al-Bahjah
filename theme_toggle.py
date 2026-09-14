import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = 'export default function App() {'
replace = """export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);"""

content = content.replace(target, replace, 1)

target2 = '<div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">'
replace2 = '<div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">'

content = content.replace(target2, replace2, 1)

target_header = 'onOpenNotifications={() => setIsNotifOpen(true)}\n      />'
replace_header = """onOpenNotifications={() => setIsNotifOpen(true)}
      />
      
      {/* Theme Toggle Button */}
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-slate-800 dark:bg-amber-400 text-white dark:text-slate-900 shadow-lg hover:scale-110 transition-transform"
        title="Toggle Dark Mode"
      >
        {darkMode ? (
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        ) : (
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>"""

content = content.replace(target_header, replace_header, 1)

with open('src/App.tsx', 'w') as f:
    f.write(content)
