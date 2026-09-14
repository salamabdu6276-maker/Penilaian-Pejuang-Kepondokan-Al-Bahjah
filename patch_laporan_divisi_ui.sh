cat << 'INNER_EOF' > /tmp/laporandivisi_ui.tsx
      {/* LAPORAN DIVISI */}
      {reportType === "divisi" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Laporan Divisi: {selectedDivisi}</h3>
              <p className="text-sm text-slate-500">{GREGORIAN_MONTHS_ID[selectedMonth - 1]} {selectedYear}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama,
                    "Sub Divisi": d.pejuang.subDivisi,
                    W1: d.w1, W2: d.w2, W3: d.w3, W4: d.w4, W5: d.w5,
                    "Persentase (%)": d.performa,
                    Evaluasi: d.evaluasi
                  }));
                  exportSummaryToPDF(summaryData, `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}`, `Laporan Divisi ${selectedDivisi}`);
                }}
                className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Unduh PDF</span>
              </button>
              <button
                onClick={() => {
                  const summaryData = divisiData.map((d, i) => ({
                    Peringkat: i + 1,
                    Nama: d.pejuang.nama,
                    SubDivisi: d.pejuang.subDivisi,
                    Pekan1: d.w1, Pekan2: d.w2, Pekan3: d.w3, Pekan4: d.w4, Pekan5: d.w5,
                    Performa: d.performa, Evaluasi: d.evaluasi
                  }));
                  exportToExcel(summaryData, `Laporan_Divisi_${selectedDivisi.replace(/ /g,"_")}`);
                }}
                className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Excel</span>
              </button>
            </div>
          </div>
          
          {divisiData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-4 text-sm text-center">Grafik Peringkat Performa Anggota Divisi</h4>
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
                      <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                        {divisiData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.performa >= 90 ? "#10b981" : entry.performa >= 75 ? "#f59e0b" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
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
INNER_EOF

sed -i -e '606,691c\' -e "$(cat /tmp/laporandivisi_ui.tsx | sed 's/$/\\/')" src/components/ReportsView.tsx
sed -i 's/\\$//g' src/components/ReportsView.tsx
