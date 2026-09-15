import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target_handler = """  // Handler for Personal Coaching notification send
  const handleSendCoachingNotification = async (pejuangId: string, message: string) => {
    const pejuang = pejuangList.find(p => p.id === pejuangId);
    const newNotif: SystemNotification = {
      id: `coaching_${Date.now()}`,
      title: `💬 Personal Coaching: ${pejuang?.nama || 'Pejuang'}`,
      message,
      date: new Date().toLocaleDateString("id-ID"),
      type: "coaching",
      pejuangId,
      isRead: false
    };
    
    await saveNotification(newNotif);
    setNotifications(prev => [newNotif, ...prev]);
  };"""

new_handler = """  // Handler for Personal Coaching notification send
  const handleSendCoachingNotification = async (pejuangId: string, message: string) => {
    const pejuang = pejuangList.find(p => p.id === pejuangId);
    const newNotif: SystemNotification = {
      id: `coaching_${Date.now()}`,
      title: `💬 Personal Coaching: ${pejuang?.nama || 'Pejuang'}`,
      message,
      date: new Date().toLocaleDateString("id-ID"),
      type: "coaching",
      pejuangId,
      isRead: false
    };
    
    await saveNotification(newNotif);
    setNotifications(prev => [newNotif, ...prev]);

    // Send push notification via Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'SHOW_NOTIFICATION',
          title: newNotif.title,
          body: newNotif.message
        });
      });
    }
  };"""

content = content.replace(target_handler, new_handler)

with open('src/App.tsx', 'w') as f:
    f.write(content)
