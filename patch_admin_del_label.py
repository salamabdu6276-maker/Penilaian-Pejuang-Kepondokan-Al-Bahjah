import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

# Update pejuang delete
content = content.replace(
    'label="" \n                        onDelete={() => onDeletePejuang(p.id)} \n                        className="!bg-transparent !text-slate-400 hover:!bg-rose-50 hover:!text-rose-600 shadow-none"',
    'label="Hapus" \n                        onDelete={() => onDeletePejuang(p.id)} \n                        className=""'
)

# Update admin delete
content = content.replace(
    'label="" \n                          onDelete={() => onDeleteAdmin(a.id)} \n                          className="!bg-transparent !text-slate-400 hover:!bg-rose-50 hover:!text-rose-600 shadow-none"',
    'label="Hapus" \n                          onDelete={() => onDeleteAdmin(a.id)} \n                          className=""'
)

# Update checklist delete
content = content.replace(
    'label="" \n                        onDelete={() => onDeleteChecklist(sub.id)} \n                        className="!bg-transparent !text-slate-400 hover:!bg-rose-50 hover:!text-rose-600 shadow-none"',
    'label="Hapus" \n                        onDelete={() => onDeleteChecklist(sub.id)} \n                        className=""'
)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
