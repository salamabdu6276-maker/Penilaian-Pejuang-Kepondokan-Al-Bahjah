sed -i -e '/{reportType === "pejuang" && activePejuang && (/i\
      {/* LAPORAN DIVISI */}\
      {reportType === "divisi" && (\
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">\
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4">\
            <div>\
              <h3 className="text-xl font-bold text-slate-900">Laporan Divisi: {selectedDivisi}</h3>\
              <p className="text-sm text-slate-500">Pekan {selectedWeek} ({GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear})</p>\
            </div>\
            <div className="flex gap-2">\
              <button\
                onClick={() => {\
                  const summaryData = divisiData.map((d, i) => ({\
                    No: i + 1,\
                    Nama: d.pejuang.nama,\
                    "Sub Divisi": d.pejuang.subDivisi,\
                    "Persentase (%)": d.performa,\
                    Predikat: d.performa >= 91 ? "A" : d.performa >= 76 ? "B" : d.performa >= 40 ? "C" : "D"\
                  }));\
                  exportSummaryToPDF(summaryData, `Pekan ${selectedWeek} (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`, `Laporan Divisi ${selectedDivisi}`);\
                }}\
                className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"\
              >\
                <FileText className="w-4 h-4" />\
                <span>Unduh PDF</span>\
              </button>\
              <button\
                onClick={() => {\
                  const summaryData = divisiData.map((d, i) => ({\
                    No: i + 1,\
                    Nama: d.pejuang.nama,\
                    SubDivisi: d.pejuang.subDivisi,\
                    Performa: d.performa\
                  }));\
                  exportToExcel(summaryData, `Laporan_Divisi_${selectedDivisi.replace(/ /g,"_")}`);\
                }}\
                className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"\
              >\
                <FileSpreadsheet className="w-4 h-4" />\
                <span>Unduh Excel</span>\
              </button>\
            </div>\
          </div>\
          \
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">\
            <div>\
              <h4 className="font-bold text-slate-800 mb-4 text-sm">Performa Anggota Divisi</h4>\
              <div className="h-64 w-full">\
                <ResponsiveContainer width="100%" height="100%">\
                  <BarChart data={divisiData.map(d => ({ name: d.pejuang.nama.split(" ")[0], Performa: d.performa }))} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>\
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />\
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b" }} angle={-45} textAnchor="end" interval={0} />\
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />\
                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} formatter={(value: number) => [`${value}%`, "Performa"]} />\
                    <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>\
                      {divisiData.map((entry, index) => (\
                        <Cell key={`cell-${index}`} fill={entry.performa >= 90 ? "#10b981" : entry.performa >= 75 ? "#f59e0b" : "#ef4444"} />\
                      ))}\
                    </Bar>\
                  </BarChart>\
                </ResponsiveContainer>\
              </div>\
            </div>\
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-h-80 overflow-y-auto">\
              <h4 className="font-bold text-slate-800 mb-4 text-sm border-b border-slate-200 pb-2">Daftar Anggota</h4>\
              <div className="space-y-2">\
                {divisiData.map((d, i) => (\
                  <div key={i} className="flex items-center justify-between bg-white p-3 border border-slate-200 rounded-lg">\
                    <div className="flex items-center gap-3">\
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs">\
                        {d.pejuang.nama.charAt(0)}\
                      </div>\
                      <div>\
                        <p className="text-sm font-bold text-slate-800">{d.pejuang.nama}</p>\
                        <p className="text-[10px] text-slate-500">{d.pejuang.amanah}</p>\
                      </div>\
                    </div>\
                    <div className="text-right">\
                      <p className="font-black text-emerald-700">{d.performa}%</p>\
                      <p className="text-[9px] text-slate-500">{d.submissionsCount > 0 ? "Telah Disubmit" : "Belum Submit"}</p>\
                    </div>\
                  </div>\
                ))}\
              </div>\
            </div>\
          </div>\
        </div>\
      )}\
' src/components/ReportsView.tsx
