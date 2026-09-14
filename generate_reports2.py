content = """  // Trigger End of Period Notification
  const handleTriggerAutoNotification = () => {
    const periodName = `Pekan ${selectedWeek} ${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`;
    onTriggerPeriodNotification(
      `Pengingat Otomatis Akhir Periode: Laporan checklist periode ${periodName} telah ditutup. Silakan lakukan verifikasi & penganugerahan pejuang terbaik!`
    );
    alert(`Notifikasi akhir periode (${periodName}) telah dikirimkan ke seluruh tim!`);
  };

  return (
    <div id="reports-view" className="space-y-6 pb-12">
      
      {/* Top Header & Switcher */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Pusat Pelaporan & Dokumen
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Laporan Per Pejuang, Divisi & Laporan Bulanan
          </h2>
          <p className="text-xs text-slate-500">
            Cetak laporan resmi ber-Kop Al-Bahjah dalam format PDF, Excel, maupun Gambar (PNG)
          </p>
        </div>

        {/* Report Type Selector */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setReportType("pejuang")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              reportType === "pejuang"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Laporan Per Pejuang
          </button>
          <button
            onClick={() => setReportType("divisi")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              reportType === "divisi"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Laporan Per Divisi
          </button>
          <button
            onClick={() => setReportType("bulan")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              reportType === "bulan"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Laporan Per Bulan
          </button>
          <button
            onClick={() => setReportType("rentang")}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              reportType === "rentang"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rentang Tanggal
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Divisi Selector */}
          {reportType === "divisi" && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500">Pilih Divisi</label>
              <select
                value={selectedDivisi}
                onChange={(e) => setSelectedDivisi(e.target.value)}
                className="bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-2 text-slate-800"
              >
                {SUB_DIVISI_LIST.map((sub, idx) => (
                  <option key={idx} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {/* Pejuang Selector */}
          {(reportType === "pejuang" || reportType === "bulan" || reportType === "rentang") && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500">Pilih Pejuang</label>
              <select
                value={selectedPejuangId}
                onChange={(e) => setSelectedPejuangId(e.target.value)}
                className="bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-2 text-slate-800"
              >
                {pejuangList.map(p => (
                  <option key={p.id} value={p.id}>{p.nama} ({p.subDivisi})</option>
                ))}
              </select>
            </div>
          )}

          {/* Month & Year */}
          {reportType !== "rentang" && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500">Bulan & Tahun</label>
              <div className="flex space-x-1">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-2 text-slate-800"
                >
                  {GREGORIAN_MONTHS_ID.map((m, idx) => (
                    <option key={idx} value={idx + 1}>{m}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-2 text-slate-800"
                >
                  <option value={2026}>2026</option>
                </select>
              </div>
            </div>
          )}

          {/* Date Range Filters */}
          {reportType === "rentang" && (
            <div className="flex space-x-2">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500">Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-1.5 text-slate-800 h-[34px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500">Sampai</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-1.5 text-slate-800 h-[34px]"
                />
              </div>
            </div>
          )}

          {/* Week */}
          {reportType !== "bulan" && reportType !== "rentang" && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500">Pekan</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-2 text-slate-800"
              >
                <option value={1}>Pekan 1 (Tanggal 01 - 07)</option>
                <option value={2}>Pekan 2 (Tanggal 08 - 14)</option>
                <option value={3}>Pekan 3 (Tanggal 15 - 21)</option>
                <option value={4}>Pekan 4 (Tanggal 22 - 28)</option>
                <option value={5}>Pekan 5 (Tanggal 29 - 31)</option>
              </select>
            </div>
          )}

        </div>

        {/* Export & Auto Notif Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {reportType === "pejuang" && (
            <>
              <button
                disabled={isExportDisabled}
                onClick={handleExportPDF}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileText className="w-4 h-4" />
                <span>Format PDF</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={handleExportExcel}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-emerald-700 hover:bg-emerald-800'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={handleExportPNG}
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gambar PNG</span>
              </button>
            </>
          )}

          {(reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && (
            <>
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  const summaryData = pejuangList.map((p, idx) => {
                    let filteredSubs = [];
                    if (reportType === "bulan") {
                      filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
                    } else if (reportType === "pekan") {
                      filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);
                    } else if (reportType === "rentang") {
                      if (!startDate || !endDate) return null;
                      const start = new Date(startDate).getTime();
                      const end = new Date(endDate).getTime() + 86400000;
                      filteredSubs = submissions.filter(s => {
                        if (!s.updatedAt || s.pejuangId !== p.id) return false;
                        const subTime = new Date(s.updatedAt).getTime();
                        return subTime >= start && subTime < end;
                      });
                    }
                    if (!filteredSubs) return null;

                    let totalChecked = 0;
                    let totalPossible = 0;
                    
                    filteredSubs.forEach(sub => {
                      totalChecked += sub.totalChecked || 0;
                      totalPossible += sub.totalPossible || 0;
                    });
                    
                    const percentage = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";

                    return {
                      No: idx + 1,
                      Nama: p.nama,
                      "Sub Divisi": p.subDivisi,
                      Amanah: p.amanah,
                      "Total Target (Item)": totalPossible,
                      "Total Realisasi (Item)": totalChecked,
                      "Persentase (%)": percentage,
                      Predikat: percentage > 0 ? predikat : "-"
                    };
                  }).filter(Boolean);

                  let periodStr = "";
                  if (reportType === "bulan") periodStr = `${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_${selectedYear}`;
                  else if (reportType === "pekan") periodStr = `Pekan_${selectedWeek}_${GREGORIAN_MONTHS_ID[selectedMonth - 1]}_${selectedYear}`;
                  else if (reportType === "rentang") periodStr = `${startDate}_sd_${endDate}`;

                  setPreviewTitle("Preview Rekap Semua Pejuang (Excel)");
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportToExcel(summaryData, `Rekap_Semua_Pejuang_${periodStr}`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Rekap Semua Pejuang (Excel)</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  const summaryData = pejuangList.map((p, idx) => {
                    let filteredSubs = [];
                    if (reportType === "bulan") {
                      filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.bulan === selectedMonth && s.tahun === selectedYear);
                    } else if (reportType === "pekan") {
                      filteredSubs = submissions.filter(s => s.pejuangId === p.id && s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear);
                    } else if (reportType === "rentang") {
                      if (!startDate || !endDate) return null;
                      const start = new Date(startDate).getTime();
                      const end = new Date(endDate).getTime() + 86400000;
                      filteredSubs = submissions.filter(s => {
                        if (!s.updatedAt || s.pejuangId !== p.id) return false;
                        const subTime = new Date(s.updatedAt).getTime();
                        return subTime >= start && subTime < end;
                      });
                    }
                    if (!filteredSubs) return null;

                    let totalChecked = 0;
                    let totalPossible = 0;
                    
                    const w1 = filteredSubs.find(s => s.pekan === 1);
                    const w2 = filteredSubs.find(s => s.pekan === 2);
                    const w3 = filteredSubs.find(s => s.pekan === 3);
                    const w4 = filteredSubs.find(s => s.pekan === 4);
                    const w5 = filteredSubs.find(s => s.pekan === 5);
                    
                    filteredSubs.forEach(sub => {
                      totalChecked += sub.totalChecked || 0;
                      totalPossible += sub.totalPossible || 0;
                    });
                    
                    const percentage = totalPossible > 0 ? Math.round((totalChecked / totalPossible) * 100) : 0;
                    const predikat = percentage >= 91 ? "A" : percentage >= 76 ? "B" : percentage >= 40 ? "C" : "D";
                    const evaluasi = percentage >= 91 ? "Sangat Baik" : percentage >= 76 ? "Baik" : percentage >= 40 ? "Cukup" : "Kurang";

                    return {
                      No: idx + 1,
                      Nama: p.nama,
                      "Sub Divisi": p.subDivisi,
                      Amanah: p.amanah,
                      "W1": w1 ? w1.percentage : "-",
                      "W2": w2 ? w2.percentage : "-",
                      "W3": w3 ? w3.percentage : "-",
                      "W4": w4 ? w4.percentage : "-",
                      "W5": w5 ? w5.percentage : "-",
                      "Total Target (Item)": totalPossible,
                      "Total Realisasi (Item)": totalChecked,
                      "Persentase (%)": percentage,
                      Predikat: percentage > 0 ? predikat : "-",
                      Evaluasi: percentage > 0 ? evaluasi : "Belum Ada Data"
                    };
                  }).filter(Boolean);

                  let periodStr = "";
                  if (reportType === "bulan") periodStr = `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`;
                  else if (reportType === "pekan") periodStr = `Pekan ${selectedWeek} (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`;
                  else if (reportType === "rentang") periodStr = `${startDate} s/d ${endDate}`;

                  setPreviewTitle("Preview Rekap Semua Pejuang (PDF)");
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportSummaryToPDF(
                      summaryData,
                      periodStr,
                      "LAPORAN KINERJA PENGURUS KEPONDOKAN"
                    );
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileText className="w-4 h-4" />
                <span>Unduh Rekap Semua Pejuang (PDF)</span>
              </button>
            </>
          )}

          {role === 'admin' && (
            <button
              onClick={handleTriggerAutoNotification}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"
              title="Fitur Notifikasi Otomatis Setiap Akhir Periode Pelaporan"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Notif Akhir Periode</span>
            </button>
          )}
        </div>
      </div>
"""

with open('src/components/ReportsView.tsx', 'a') as f:
    f.write(content)
