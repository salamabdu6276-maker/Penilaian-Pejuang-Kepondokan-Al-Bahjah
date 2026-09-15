import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Locate start of Hijri Widget
start_bento = content.find('{/* HIJRI WIDGET */}')
# Locate end of Metrics Cards
end_metrics = content.find('      {/* Empty Pejuang Notice */}')

if start_bento != -1 and end_metrics != -1:
    bento_section_target = content[start_bento:end_metrics]
    
    # We will replace the entire bento_section_target with our new Bento Grid code.
    # Note: I need to preserve the export buttons, filters, etc. from the old top banner.
    
    # Let's extract the exact controls div from the original content to make sure we don't lose logic.
    controls_start = content.find('{/* Controls */}')
    controls_end = content.find('</div>\n        </div>\n\n        {/* Total Checklist')
    if controls_end == -1: # fallback
        controls_end = content.find('</div>\n\n      </div>\n\n      {/* METRICS CARDS */}')
    
    # Wait, the structure in the old code for controls:
    # <div className="flex flex-wrap items-end gap-3 lg:justify-end">
    #   {/* Status Filter */} ...
    #   {/* Sub-Divisi Filter */} ...
    #   <div> Bulan ... </div>
    #   <div> Tahun ... </div>
    #   {/* Quick Export Actions */} ...
    # </div>
    # Let's just manually port those controls into the new python string to be safe.

    new_bento = """      {/* BENTO GRID TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        
        {/* TOP LEFT: Main Banner & Controls (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl p-6 lg:p-8 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
           
           <div className="relative z-10 mb-6 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                  Laporan & Executive Summary
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                  Yayasan Al-Bahjah Cirebon 1
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2 tracking-tight">
                Dashboard Performa Pejuang
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                Pantau tren produktivitas, pencapaian target mingguan, dan aktivitas terkini secara terintegrasi.
              </p>
           </div>
           
           <div className="relative z-10 flex flex-wrap items-end gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-3 pr-8 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl py-2 font-semibold focus:ring-2 focus:ring-emerald-500 appearance-none outline-none shadow-sm"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-aktif</option>
                </select>
              </div>
            </div>
            
            {/* Sub-Divisi Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Filter Divisi Global</label>
              <div className="relative">
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={subDivisiFilter}
                  onChange={(e) => setSubDivisiFilter(e.target.value)}
                  className="pl-9 pr-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl py-2 font-semibold focus:ring-2 focus:ring-emerald-500 min-w-[150px] max-w-[200px] truncate shadow-sm outline-none"
                >
                  <option value="Semua Divisi">Semua Divisi</option>
                  {Array.from(new Set(pejuangList.map(p => p.subDivisi))).map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Bulan</label>
              <select
                id="select-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-2 font-semibold focus:ring-2 focus:ring-emerald-500 shadow-sm outline-none"
              >
                {GREGORIAN_MONTHS_ID.map((m, idx) => (
                  <option key={idx} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tahun</label>
              <select
                id="select-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-4 py-2 font-semibold focus:ring-2 focus:ring-emerald-500 shadow-sm outline-none"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            {/* Quick Export Actions */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0 ml-auto">
              <button
                id="btn-export-excel"
                onClick={handleExportExcel}
                className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                id="btn-export-pdf"
                onClick={handleExportPDF}
                className="flex items-center space-x-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
           </div>
        </div>

        {/* TOP RIGHT: Hijri Calendar (4 Cols) */}
        <div className="lg:col-span-4 flex">
           <div className="w-full h-full min-h-[250px] [&>div]:h-full [&>div]:flex [&>div]:flex-col [&>div]:justify-center">
             <HijriCalendarWidget />
           </div>
        </div>

        {/* BOTTOM ROW OF BENTO */}
        {/* Bottom Left: Metrics (8 Cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
           {/* Card 1: Total Pejuang */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-emerald-50 dark:bg-emerald-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10 flex items-center justify-between mb-4">
                 <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-2xl">
                    <Users className="w-6 h-6" />
                 </div>
                 <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800 truncate max-w-[100px]">{subDivisiFilter}</p>
              </div>
              <div className="relative z-10">
                 <h3 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">{activePejuangList.filter(p => p.status === 'aktif').length}</h3>
                 <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Total Pejuang Aktif</p>
              </div>
           </div>

           {/* Card 2: Checklist Submit */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-indigo-50 dark:bg-indigo-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10 flex items-center justify-between mb-4">
                 <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-2xl">
                    <CheckCircle2 className="w-6 h-6" />
                 </div>
                 <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800 truncate max-w-[100px]">Pekan {selectedWeek}</p>
              </div>
              <div className="relative z-10">
                 <h3 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                    {submissions.filter(s => s.pekan === selectedWeek && s.bulan === selectedMonth && s.tahun === selectedYear && activePejuangList.some(p => p.id === s.pejuangId)).length}
                 </h3>
                 <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Submit Pekan Ini</p>
              </div>
           </div>

           {/* Card 3: Avg Performance */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-amber-50 dark:bg-amber-900/20 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10 flex items-center justify-between mb-4">
                 <div className="p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-2xl">
                    <TrendingUp className="w-6 h-6" />
                 </div>
              </div>
              <div className="relative z-10">
                 <h3 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">{avgPerformance}%</h3>
                 <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Rata-rata Performa</p>
              </div>
           </div>
        </div>

        {/* Bottom Right: Activity Timeline (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col max-h-[220px]">
           <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-700/50">
             <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
               <BellRing className="w-4 h-4 text-emerald-600" />
               Aktivitas Terbaru
             </h3>
             <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{recentEvents.length} Logs</span>
           </div>
           <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
             {recentEvents.length === 0 ? (
                <div className="text-center text-xs text-slate-500 py-4">Belum ada aktivitas.</div>
             ) : recentEvents.map((evt, idx) => (
                <div key={evt.id + idx} className="flex gap-3">
                   <div className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   <div>
                     <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight mb-0.5">{evt.title}</p>
                     <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{evt.message}</p>
                     <p className="text-[9px] text-slate-400 mt-1">{evt.date.toLocaleDateString('id-ID', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'})}</p>
                   </div>
                </div>
             ))}
           </div>
        </div>
      </div>\n\n"""

    content = content.replace(bento_section_target, new_bento)
    
    # We also need to remove the old Activity Timeline from the bottom
    old_timeline_start = content.find('{/* ACTIVITY TIMELINE */}')
    old_timeline_end = content.find('{/* DRILLDOWN MODAL */}')
    
    if old_timeline_start != -1 and old_timeline_end != -1:
        # Just to be safe, find the exact wrapper div
        old_timeline_block = content[old_timeline_start:old_timeline_end]
        content = content.replace(old_timeline_block, '')

    with open('src/components/Dashboard.tsx', 'w') as f:
        f.write(content)
