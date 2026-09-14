sed -i 's/.*Legend key/                        <Cell key/g' src/components/ReportsView.tsx
sed -i '/ReferenceLine/d' src/components/ReportsView.tsx
sed -i '/LineChart/d' src/components/ReportsView.tsx
sed -i '/Line,/d' src/components/ReportsView.tsx
