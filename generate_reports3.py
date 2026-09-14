content = """
      {/* Explicit UI Message */}
      {isExportDisabled && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-4 rounded-2xl flex items-center gap-2 print:hidden shadow-sm">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          No data found for the selected period. Silakan ubah filter periode atau pastikan ada pejuang yang mengisi laporan.
        </div>
      )}
      {exportError && !isExportDisabled && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold p-4 rounded-2xl flex items-center gap-2 print:hidden shadow-sm">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          {exportError}
        </div>
      )}

      {/* GRAPH SUMMARY FOR SELECTED PEJUANG */}
      {/* LAPORAN REKAP SEMUA PEJUANG */}
      {(reportType === "bulan" || reportType === "pekan" || reportType === "rentang") && rekapData.length > 0 && (
        <div id="laporan-rekap-container" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Rekapitulasi Kinerja Seluruh Pejuang</h3>
              <p className="text-sm text-slate-500">
                {reportType === "bulan" && `Bulan: ${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`}
                {reportType === "pekan" && `Pekan: ${selectedWeek} (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`}
                {reportType === "rentang" && `Rentang: ${startDate} s/d ${endDate}`}
              </p>
            </div>
          </div>
          
          {/* TOP 3 PEJUANG */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {rekapData.slice(0, 3).map((d, i) => (
              <div key={i} className={`rounded-2xl p-6 border shadow-sm relative overflow-hidden flex flex-col items-center text-center
                ${i === 0 ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" : 
                  i === 1 ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" : 
                  "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"}`}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#d97706' }}></div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md text-white font-extrabold text-2xl" 
                     style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#d97706' }}>
                  #{i + 1}
                </div>
                <h4 className="font-bold text-slate-800 text-lg">{d.pejuang.nama}</h4>
                <p className="text-xs font-semibold text-slate-500 mb-2">{d.pejuang.subDivisi}</p>
                <div className="mt-auto pt-4 border-t border-slate-200/50 w-full">
                  <span className="text-3xl font-extrabold" style={{ color: i === 0 ? '#b45309' : i === 1 ? '#475569' : '#92400e' }}>
                    {d.performa}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 text-sm text-center">Grafik Peringkat Kinerja Seluruh Pejuang</h4>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rekapData.map((d, i) => ({ name: d.pejuang.nama.split(" ")[0], Performa: d.performa, Peringkat: i + 1 }))} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#475569" }} angle={-45} textAnchor="end" interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                    <Tooltip 
                      cursor={{ fill: "#f1f5f9" }} 
                      contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} 
                      formatter={(value: number, name: string) => [name === 'Performa' ? `${value}%` : value, name]} 
                    />
                    <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${weeklyTarget}%`, fill: '#ef4444', fontSize: 10 }} />
                    <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                      {rekapData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.performa >= weeklyTarget ? "#10b981" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold text-center">
                  <th className="border border-slate-300 p-2">Peringkat</th>
                  <th className="border border-slate-300 p-2 text-left">Nama</th>
                  <th className="border border-slate-300 p-2 text-left">Sub Divisi</th>
                  {reportType === "bulan" && (
                    <>
                      <th className="border border-slate-300 p-2">Pekan 1</th>
                      <th className="border border-slate-300 p-2">Pekan 2</th>
                      <th className="border border-slate-300 p-2">Pekan 3</th>
                      <th className="border border-slate-300 p-2">Pekan 4</th>
                      <th className="border border-slate-300 p-2">Pekan 5</th>
                    </>
                  )}
                  <th className="border border-slate-300 p-2">Rata-Rata</th>
                  <th className="border border-slate-300 p-2">Evaluasi</th>
                </tr>
              </thead>
              <tbody>
                {rekapData.map((d, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white text-center" : "bg-slate-50 text-center"}>
                    <td className="border border-slate-200 p-2 font-bold text-slate-700">#{idx + 1}</td>
                    <td className="border border-slate-200 p-2 font-medium text-slate-800 text-left">{d.pejuang.nama}</td>
                    <td className="border border-slate-200 p-2 text-slate-600 text-left">{d.pejuang.subDivisi}</td>
                    {reportType === "bulan" && (
                      <>
                        <td className="border border-slate-200 p-2">{d.w1 !== "-" ? `${d.w1}%` : "-"}</td>
                        <td className="border border-slate-200 p-2">{d.w2 !== "-" ? `${d.w2}%` : "-"}</td>
                        <td className="border border-slate-200 p-2">{d.w3 !== "-" ? `${d.w3}%` : "-"}</td>
                        <td className="border border-slate-200 p-2">{d.w4 !== "-" ? `${d.w4}%` : "-"}</td>
                        <td className="border border-slate-200 p-2">{d.w5 !== "-" ? `${d.w5}%` : "-"}</td>
                      </>
                    )}
                    <td className="border border-slate-200 p-2 font-bold text-emerald-700">{d.performa}%</td>
                    <td className="border border-slate-200 p-2 font-bold">{d.evaluasi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* LAPORAN DIVISI */}
      {reportType === "divisi" && (
        <div id="laporan-divisi-container" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Laporan Divisi: {selectedDivisi}</h3>
              <p className="text-sm text-slate-500">{GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear}</p>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden" data-html2canvas-ignore="true">
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama,
                    "Sub Divisi": d.pejuang.subDivisi,
                    W1: d.w1, W2: d.w2, W3: d.w3, W4: d.w4, W5: d.w5,
                    "Persentase (%)": d.performa,
                    Evaluasi: d.evaluasi
                  }));
                  setPreviewTitle(`Preview Laporan Divisi ${selectedDivisi} (PDF)`);
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportSummaryToPDF(summaryData, `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`, `Laporan Divisi ${selectedDivisi}`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-rose-600 hover:bg-rose-700'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileText className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {
                    setExportError("No data found for the selected period");
                    return;
                  }
                  setExportError("");
                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama,
                    SubDivisi: d.pejuang.subDivisi,
                    Pekan1: d.w1, Pekan2: d.w2, Pekan3: d.w3, Pekan4: d.w4, Pekan5: d.w5,
                    Performa: d.performa, Evaluasi: d.evaluasi
                  }));
                  setPreviewTitle(`Preview Laporan Divisi ${selectedDivisi} (Excel)`);
                  setPreviewData(summaryData);
                  setPreviewAction(() => () => {
                    exportToExcel(summaryData, `Laporan_Divisi_${selectedDivisi.replace(/ /g,"_")}`);
                    setShowPreviewModal(false);
                  });
                  setShowPreviewModal(true);
                }}
                data-html2canvas-ignore="true" className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-emerald-700 hover:bg-emerald-800'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Excel</span>
              </button>
            </div>
          </div>
          
          
          
          {/* TOP 3 PEJUANG DIVISI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {divisiData.slice(0, 3).map((d, i) => (
              <div key={i} className={`rounded-2xl p-6 border shadow-sm relative overflow-hidden flex flex-col items-center text-center
                ${i === 0 ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200" : 
                  i === 1 ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200" : 
                  "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"}`}
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#d97706' }}></div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md text-white font-extrabold text-2xl" 
                     style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#d97706' }}>
                  #{i + 1}
                </div>
                <h4 className="font-bold text-slate-800 text-lg">{d.pejuang.nama}</h4>
                <p className="text-xs font-semibold text-slate-500 mb-2">{d.pejuang.subDivisi}</p>
                <div className="mt-auto pt-4 border-t border-slate-200/50 w-full">
                  <span className="text-3xl font-extrabold" style={{ color: i === 0 ? '#b45309' : i === 1 ? '#475569' : '#92400e' }}>
                    {d.performa}%
                  </span>
                </div>
              </div>
            ))}
          </div>
            {divisiData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 text-sm text-center">Grafik Peringkat Performa</h4>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={divisiData.map((d, i) => ({ name: d.pejuang.nama.split(" ")[0], Performa: d.performa, Peringkat: i + 1 }))} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} angle={-45} textAnchor="end" interval={0} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                      <Tooltip 
                        cursor={{ fill: "#f1f5f9" }} 
                        contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} 
                        formatter={(value: number, name: string) => [name === 'Performa' ? `${value}%` : value, name]} 
                      />
                      <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${weeklyTarget}%`, fill: '#ef4444', fontSize: 10 }} />
                      <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                        {divisiData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.performa >= weeklyTarget ? "#10b981" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 text-sm text-center">Tren Performa 3 Bulan Terakhir</h4>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} 
                        formatter={(value: number) => [`${value}%`, 'Rata-Rata Divisi']} 
                      />
                      <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${weeklyTarget}%`, fill: '#ef4444', fontSize: 10 }} />
                      <Line type="monotone" dataKey="RataRata" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: "#0ea5e9", r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold text-center">
                  <th className="border border-slate-300 p-2">Peringkat</th>
                  <th className="border border-slate-300 p-2 text-left">Nama</th>
                  <th className="border border-slate-300 p-2">Pekan 1</th>
                  <th className="border border-slate-300 p-2">Pekan 2</th>
                  <th className="border border-slate-300 p-2">Pekan 3</th>
                  <th className="border border-slate-300 p-2">Pekan 4</th>
                  <th className="border border-slate-300 p-2">Pekan 5</th>
                  <th className="border border-slate-300 p-2">Rata-Rata</th>
                  <th className="border border-slate-300 p-2">Evaluasi</th>
                </tr>
              </thead>
              <tbody>
                {divisiData.map((d, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white text-center" : "bg-slate-50 text-center"}>
                    <td className="border border-slate-200 p-2 font-bold text-slate-700">#{idx + 1}</td>
                    <td className="border border-slate-200 p-2 font-medium text-slate-800 text-left">{d.pejuang.nama}</td>
                    <td className="border border-slate-200 p-2">{d.w1 !== "-" ? `${d.w1}%` : "-"}</td>
                    <td className="border border-slate-200 p-2">{d.w2 !== "-" ? `${d.w2}%` : "-"}</td>
                    <td className="border border-slate-200 p-2">{d.w3 !== "-" ? `${d.w3}%` : "-"}</td>
                    <td className="border border-slate-200 p-2">{d.w4 !== "-" ? `${d.w4}%` : "-"}</td>
                    <td className="border border-slate-200 p-2">{d.w5 !== "-" ? `${d.w5}%` : "-"}</td>
                    <td className="border border-slate-200 p-2 font-bold text-emerald-700">{d.performa}%</td>
                    <td className="border border-slate-200 p-2 font-bold">{d.evaluasi}</td>
                  </tr>
                ))}
                {divisiData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="border border-slate-200 p-4 text-center text-slate-500">
                      Belum ada data anggota aktif di divisi ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
"""

with open('src/components/ReportsView.tsx', 'a') as f:
    f.write(content)
