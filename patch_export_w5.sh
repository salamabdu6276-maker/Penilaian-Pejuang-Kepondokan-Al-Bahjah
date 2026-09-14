sed -i 's/"Pekan 4", "Rata-Rata",/"Pekan 4", "Pekan 5", "Rata-Rata",/g' src/utils/export.ts
sed -i '/row.W4 !== "-" ? `${row.W4}%` : "-",/a\      row.W5 !== "-" ? `${row.W5}%` : "-",' src/utils/export.ts
sed -i 's/      3: { cellWidth: 15, halign: "center" },/      3: { cellWidth: 12, halign: "center" },/g' src/utils/export.ts
sed -i 's/      4: { cellWidth: 15, halign: "center" },/      4: { cellWidth: 12, halign: "center" },/g' src/utils/export.ts
sed -i 's/      5: { cellWidth: 15, halign: "center" },/      5: { cellWidth: 12, halign: "center" },/g' src/utils/export.ts
sed -i 's/      6: { cellWidth: 15, halign: "center" },/      6: { cellWidth: 12, halign: "center" },\n      7: { cellWidth: 12, halign: "center" },/g' src/utils/export.ts
sed -i 's/      7: { cellWidth: 18, halign: "center", fontStyle: '"'bold'"' },/      8: { cellWidth: 15, halign: "center", fontStyle: '"'bold'"' },/g' src/utils/export.ts
sed -i 's/      8: { cellWidth: 24, halign: "center", fontStyle: '"'bold'"' }/      9: { cellWidth: 20, halign: "center", fontStyle: '"'bold'"' }/g' src/utils/export.ts
