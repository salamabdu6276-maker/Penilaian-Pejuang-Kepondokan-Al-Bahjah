import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">"""

replacement = """      {/* MY PROGRESS WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Progress Checklist Bulan Ini
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Pilih profil Anda untuk memantau progress pengisian checklist.</p>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs rounded-xl p-2 font-bold mb-4 focus:ring-2 focus:ring-emerald-500"
              value={myProfileId}
              onChange={(e) => {
                const val = e.target.value;
                setMyProfileId(val);
                localStorage.setItem("myPejuangId", val);
              }}
            >
              <option value="">-- Pilih Profil Anda --</option>
              {pejuangList.map(p => (
                <option key={p.id} value={p.id}>{p.nama} ({p.subDivisi})</option>
              ))}
            </select>
          </div>
          
          {(() => {
            if (!myProfileId) return null;
            const mySubs = monthSubmissions.filter(s => s.pejuangId === myProfileId);
            const weeksDone = mySubs.length;
            const targetWeeks = 4;
            const pct = Math.min(100, Math.round((weeksDone / targetWeeks) * 100));
            return (
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Progress: {weeksDone} dari {targetWeeks} Pekan</span>
                  <span className="text-emerald-600">{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })()}
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-700 lg:col-span-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Tren Konsistensi Pejuang (Bulan Ini)
          </h3>
          <div className="h-40 w-full">
            {myProfileId ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={myPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#475569" }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#475569" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="Performa" stroke="#047857" strokeWidth={3} dot={{ r: 4, fill: "#047857" }} activeDot={{ r: 6 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                Pilih profil Anda di sebelah kiri untuk melihat tren.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">"""

content = content.replace(target, replacement)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
