sed -i '/const \[endDate/a\  const weeklyTarget = Number(localStorage.getItem("weeklyTarget")) || 80;' src/components/ReportsView.tsx
