import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add imports
import_insert = "import { triggerHaptic } from './utils/haptics';\nimport { InstallBanner } from './components/InstallBanner';\n"
content = content.replace('import { Dashboard } from "./components/Dashboard";', 'import { Dashboard } from "./components/Dashboard";\n' + import_insert)

# Add haptics to swipe
swipe_left_target = """  const handleSwipeLeft = () => {
    if (window.innerWidth >= 768) return; // Only on mobile
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex > -1 && currentIndex < availableTabs.length - 1) {
      setActiveTab(availableTabs[currentIndex + 1]);
    }
  };"""
swipe_left_new = """  const handleSwipeLeft = () => {
    if (window.innerWidth >= 768) return; // Only on mobile
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex > -1 && currentIndex < availableTabs.length - 1) {
      triggerHaptic('medium');
      setActiveTab(availableTabs[currentIndex + 1]);
    }
  };"""

swipe_right_target = """  const handleSwipeRight = () => {
    if (window.innerWidth >= 768) return; // Only on mobile
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(availableTabs[currentIndex - 1]);
    }
  };"""
swipe_right_new = """  const handleSwipeRight = () => {
    if (window.innerWidth >= 768) return; // Only on mobile
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex > 0) {
      triggerHaptic('medium');
      setActiveTab(availableTabs[currentIndex - 1]);
    }
  };"""

content = content.replace(swipe_left_target, swipe_left_new)
content = content.replace(swipe_right_target, swipe_right_new)

# Add InstallBanner component to the render root
main_app_start = """<div className={`min-h-screen ${darkMode ? "dark bg-slate-950" : "bg-slate-50"} transition-colors duration-300 font-sans flex flex-col`}>"""
main_app_new = """<div className={`min-h-screen ${darkMode ? "dark bg-slate-950" : "bg-slate-50"} transition-colors duration-300 font-sans flex flex-col`}>
      <InstallBanner />"""

content = content.replace(main_app_start, main_app_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
