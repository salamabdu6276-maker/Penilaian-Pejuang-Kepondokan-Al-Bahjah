import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target_handler = """  // Handler to mark notification read
  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };"""

new_handler = """  // Handler to mark notification read
  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotificationsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      await markNotificationRead(n.id);
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };"""

content = content.replace(target_handler, new_handler)

target_modal = """      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
      />"""
new_modal = """      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />"""
content = content.replace(target_modal, new_modal)

with open('src/App.tsx', 'w') as f:
    f.write(content)
print("Updated App.tsx with markAllRead")
