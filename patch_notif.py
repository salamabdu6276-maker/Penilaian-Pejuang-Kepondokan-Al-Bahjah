import re

with open('src/components/NotificationModal.tsx', 'r') as f:
    content = f.read()

# Interface prop
target_interface = """  onMarkRead: (id: string) => void;
}"""
new_interface = """  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}"""
content = content.replace(target_interface, new_interface)

# Component destructuring
target_destruct = """  notifications,
  onMarkRead
}) => {"""
new_destruct = """  notifications,
  onMarkRead,
  onMarkAllRead
}) => {"""
content = content.replace(target_destruct, new_destruct)

# Header button
target_header = """          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>"""
new_header = """          <div className="flex items-center space-x-2">
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={onMarkAllRead}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors border border-slate-700"
              >
                Tandai Semua Dibaca
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>"""
content = content.replace(target_header, new_header)

with open('src/components/NotificationModal.tsx', 'w') as f:
    f.write(content)
print("Updated NotificationModal.tsx")
