content = """
      {reportType === "pejuang" && activePejuang && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Pejuang Profile Card (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="text-center space-y-2">
              <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-3xl flex items-center justify-center mx-auto overflow-hidden border-4 border-emerald-300 shadow-md">
                {activePejuang.fotoUrl ? (
                  <img src={activePejuang.fotoUrl} alt={activePejuang.nama} className="w-full h-full object-cover" />
                ) : (
                  activePejuang.nama.charAt(0)
                )}
              </div>

              <h3 className="font-extrabold text-slate-900 text-base">{activePejuang.nama}</h3>
              <p className="text-xs text-emerald-700 font-bold bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200 inline-block">
                {activePejuang.subDivisi}
              </p>
              <p className="text-xs text-slate-500 font-medium">{activePejuang.amanah}</p>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{reportType === "bulan" ? "Performa Bulanan:" : `Performa Pekan ${selectedWeek}:`}</span>
                <span className="font-bold text-emerald-700">{targetSubmission ? `${targetSubmission.percentage}%` : 'Belum Terisi'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Predikat:</span>
                <span className="font-bold text-amber-700">{targetSubmission ? `Predikat ${targetSubmission.percentage >= 91 ? "A" : targetSubmission.percentage >= 76 ? "B" : targetSubmission.percentage >= 40 ? "C" : "D"}` : '-'}</span>
              </div>
            </div>

            {(() => {
              const badges = calculateBadges(submissions, activePejuang.id);
              if (badges.length === 0) return null;
              
              const getIcon = (iconName: string) => {
                switch(iconName) {
                  case 'Award': return <Award className="w-3.5 h-3.5 mr-1" />;
                  case 'Medal': return <Medal className="w-3.5 h-3.5 mr-1" />;
                  case 'Star': return <Star className="w-3.5 h-3.5 mr-1" />;
                  case 'Zap': return <Zap className="w-3.5 h-3.5 mr-1" />;
                  default: return <Award className="w-3.5 h-3.5 mr-1" />;
                }
              };

              return (
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 text-center">Penghargaan (Badges)</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {badges.map((badge, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}
                        title={badge.description}
                      >
                        {getIcon(badge.icon)}
                        {badge.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Activity Category Graph (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              Grafik Kegiatan per Kategori ({activePejuang.nama})
            </h3>

            {categoryData.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                Belum ada data kegiatan terisi untuk pekan ini.
              </div>
            ) : (
              <div id="category-chart-container" className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="Ceklis" fill="#047857" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      )}

      {/* OFFICIAL LETTERHEAD PRINTABLE PAPER SHEET */}
      <div className="bg-slate-200 p-4 sm:p-8 rounded-2xl border border-slate-300 shadow-inner flex justify-center overflow-x-auto">
        
        <div
          id="official-print-paper"
          ref={printAreaRef}
          className="bg-white w-[210mm] min-h-[297mm] p-8 shadow-xl border border-slate-300 text-slate-900 font-sans relative text-xs"
        >
          {/* Header Al-Bahjah */}
          <div className="text-center space-y-1 border-b-2 border-emerald-800 pb-3 mb-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img src="/logo.png" alt="Logo Al-Bahjah" className="w-20 h-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
              <div>
                <h1 className="text-lg font-black text-emerald-800 tracking-wide uppercase">
                  YAYASAN AL-BAHJAH CABANG CIREBON 1
                </h1>
                <h2 className="text-sm font-bold text-slate-900 uppercase">
                  PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1
                </h2>
              </div>
            </div>
            <p className="text-[10px] text-slate-600">
              NOMOR STATISTIK PESANTREN (NSP): 510032090039
            </p>
            <p className="text-[9px] text-slate-500">
              Jl. Pangeran Cakrabuana No. 179, Blok Gudang Air, Sendang, Sumber, Kab. Cirebon 45611
            </p>
            <p className="text-[9px] text-slate-500">
              Email: pondok.albahjahcirebon1@albahjah.or.id | Website: www.albahjah.or.id
            </p>
          </div>

          {/* Document Title */}
          <div className="text-center my-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
              FORM CHECKLIST PENGURUS KEPONDOKAN AL BAHJAH CABANG 1
            </h3>
          </div>

          {/* Metadata Block */}
          <div className="grid grid-cols-2 gap-4 my-4 font-semibold text-xs border-y border-slate-200 py-3">
            <div className="space-y-1">
              <p><span className="w-20 inline-block font-bold">NAMA</span>: {activePejuang?.nama || 'Muhammad Rosyad, S.Pd'}</p>
              <p><span className="w-20 inline-block font-bold">AMANAH</span>: {activePejuang?.amanah || 'Kepala Pondok Cabang Cirebon 1'}</p>
              <p><span className="w-20 inline-block font-bold">SUB DIVISI</span>: {activePejuang?.subDivisi || 'Kepondokan'}</p>
            </div>
            <div className="space-y-1 text-right">
              <p><span className="font-bold">PERIODE:</span> {reportType === "bulan" ? `Sebulan Penuh (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})` : `Pekan ${selectedWeek} (${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear})`}</p>
              <p><span className="font-bold">PERFORMA:</span> <span className="text-emerald-800 font-extrabold">{targetSubmission ? `${targetSubmission.percentage}%` : '0%'}</span></p>
              <p><span className="font-bold">STATUS:</span> <span className="uppercase text-emerald-700 font-bold">TERVALIDASI</span></p>
            </div>
          </div>

          {/* Checklist Table */}
          <div className="my-6">
            <table className="w-full text-left text-[10px] border-collapse border border-slate-400">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold text-center">
                  <th className="border border-slate-400 p-1 w-6">No</th>
                  <th className="border border-slate-400 p-1 w-20">Waktu</th>
                  <th className="border border-slate-400 p-1">Uraian Tugas/Kegiatan</th>
                  <th className="border border-slate-400 p-1 w-24">Ceklis √</th>
                  <th className="border border-slate-400 p-1 w-10">Kat</th>
                  <th className="border border-slate-400 p-1 w-32">Catatan/Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {targetSubmission ? (
                  targetSubmission.tasks.map((task, idx) => {
                    const checksCount = targetSubmission.dates.filter(d => task.realisasiChecks?.[d]).length;
                    return (
                      <tr key={idx} className="border-b border-slate-300">
                        <td className="border border-slate-300 p-1 text-center font-bold">{task.no}</td>
                        <td className="border border-slate-300 p-1 text-center">{task.waktu}</td>
                        <td className="border border-slate-300 p-1 font-medium">{task.uraian}</td>
                        <td className="border border-slate-300 p-1 text-center font-bold text-emerald-800">
                          <div className="flex items-center justify-center gap-0.5 flex-wrap">
                            {targetSubmission.dates.map(d => {
                              const isRencana = task.rencanaChecks?.[d];
                              const isRealisasi = task.realisasiChecks?.[d];
                              if (!isRencana) return <span key={d} className="w-3 h-3 text-[8px] text-slate-300 flex items-center justify-center">-</span>;
                              return isRealisasi 
                                ? <CheckCircle2 key={d} className="w-3 h-3 text-emerald-600" />
                                : <XCircle key={d} className="w-3 h-3 text-rose-500" />;
                            })}
                          </div>
                        </td>
                        <td className="border border-slate-300 p-1 text-center font-bold">{task.kategori}</td>
                        <td className="border border-slate-300 p-1">{task.catatan || "-"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      Belum ada data checklist terisi pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Signatures at Bottom */}
          <div className="mt-16 pt-8 flex justify-between items-end font-semibold text-xs text-slate-800">
            <div className="text-center space-y-12">
              <p>Ketua Al-Bahjah<br />Cabang Cirebon 1</p>
              <p className="font-extrabold underline">Gunawan, M.Pd</p>
            </div>

            <div className="text-center space-y-12">
              <p>Kepala Pondok / Pejuang</p>
              <p className="font-extrabold underline">{activePejuang?.nama || 'Muhammad Rosyad, S.Pd'}</p>
            </div>
          </div>

        </div>

      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">{previewTitle}</h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-500 hover:text-slate-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    {previewData.length > 0 && Object.keys(previewData[0]).map((k, idx) => (
                      <th key={idx} className="border border-slate-300 p-2 font-bold whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      {Object.values(row).map((val: any, jdx) => (
                        <td key={jdx} className="border border-slate-200 p-2">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length === 0 && (
                <div className="text-center p-4 text-slate-500">Tidak ada data untuk ditampilkan.</div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs">Tutup</button>
              <button onClick={previewAction} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-2">
                <Download className="w-4 h-4" /> Konfirmasi Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
"""

with open('src/components/ReportsView.tsx', 'a') as f:
    f.write(content)
