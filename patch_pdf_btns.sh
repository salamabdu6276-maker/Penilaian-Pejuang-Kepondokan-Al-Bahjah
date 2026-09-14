cat << 'INNER_EOF' > /tmp/rekap_btns.tsx
              <button
                onClick={() => {
                  let periodStr = "";
                  if (reportType === "bulan") periodStr = `${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_${selectedYear}`;
                  else if (reportType === "pekan") periodStr = `Pekan_${selectedWeek}_${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_${selectedYear}`;
                  else if (reportType === "rentang") periodStr = `${startDate}_sd_${endDate}`;
                  exportElementToPDF("laporan-rekap-container", `Visual_Rekap_${periodStr}`);
                }}
                className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors print:hidden"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Unduh Visual PDF</span>
              </button>
INNER_EOF

cat << 'INNER_EOF' > /tmp/divisi_btns.tsx
              <button
                onClick={() => {
                  exportElementToPDF("laporan-divisi-container", `Visual_Divisi_${selectedDivisi.replace(/ /g,"_")}`);
                }}
                className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors print:hidden"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Unduh Visual PDF</span>
              </button>
INNER_EOF
