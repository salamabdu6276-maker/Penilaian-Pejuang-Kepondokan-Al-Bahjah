import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Restore import if we modified it
content = content.replace('import { useSwipeable } from "react-swipeable";\n', '')

target_hook_place = """export default function App() {"""

hook_code = """function useSwipeGesture(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontal && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) onSwipeLeft();
      else onSwipeRight();
    }
  };

  return { onTouchStart, onTouchMove, onTouchEnd: onTouchEndEvent };
}

export default function App() {"""

content = content.replace(target_hook_place, hook_code)

target_state = """  const [activeTab, setActiveTab] = useState<TabType>("dashboard");"""

state_new = """  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const availableTabs: TabType[] = [
    "dashboard",
    ...(role === "admin" ? ["checklist" as TabType] : []),
    "settings",
    "reports",
    "documents"
  ];

  const handleSwipeLeft = () => {
    if (window.innerWidth >= 768) return; // Only on mobile
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex > -1 && currentIndex < availableTabs.length - 1) {
      setActiveTab(availableTabs[currentIndex + 1]);
    }
  };

  const handleSwipeRight = () => {
    if (window.innerWidth >= 768) return; // Only on mobile
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(availableTabs[currentIndex - 1]);
    }
  };

  const swipeHandlers = useSwipeGesture(handleSwipeLeft, handleSwipeRight);"""

content = content.replace(target_state, state_new)

target_main = """<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36 md:pb-6">"""
main_new = """<main 
        {...swipeHandlers}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-36 md:pb-6 overflow-x-hidden"
      >"""

content = content.replace(target_main, main_new)

with open('src/App.tsx', 'w') as f:
    f.write(content)
