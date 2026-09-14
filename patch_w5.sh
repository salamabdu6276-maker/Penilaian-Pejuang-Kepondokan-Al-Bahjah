sed -i '/const w4 = filteredSubs.find(s => s.pekan === 4);/a\                    const w5 = filteredSubs.find(s => s.pekan === 5);' src/components/ReportsView.tsx
sed -i '/"W4": w4 ? w4.percentage : "-",/a\                      "W5": w5 ? w5.percentage : "-",' src/components/ReportsView.tsx
