sed -i 's/<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">/{divisiData.length > 0 \&\& (\n            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">/g' src/components/ReportsView.tsx
