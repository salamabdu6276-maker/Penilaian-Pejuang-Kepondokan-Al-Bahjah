import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add logic for top3Bulanan
target_logic = "  }, [activePejuangList, weekSubmissions, getTargetForDivisi]);"

replace_logic = """  }, [activePejuangList, weekSubmissions, getTargetForDivisi]);

  const top3Bulanan = React.useMemo(() => {
    const map: Record<string, { pejuang: Pejuang; totalPct: number; count: number }> = {};
    monthSubmissions.forEach(s => {
      const p = activePejuangList.find(x => x.id === s.pejuangId);
      if (p) {
        if (!map[p.id]) map[p.id] = { pejuang: p, totalPct: 0, count: 0 };
        map[p.id].totalPct += s.percentage;
        map[p.id].count += 1;
      }
    });

    const result = Object.values(map).map(item => ({
      pejuang: item.pejuang,
      score: item.count > 0 ? Math.round(item.totalPct / item.count) : 0
    }));

    return result.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [activePejuangList, monthSubmissions]);"""

if 'const top3Bulanan =' not in content:
    content = content.replace(target_logic, replace_logic)

# Add UI
target_ui = "{/* QUICK STATS SUMMARY ROW */}"

replace_ui = """{/* TOP 3 PERFORMERS (BULANAN) */}
      {top3Bulanan.length > 0 && (
        <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 dark:text-white">Top 3 Bintang Pejuang (Performa Bulanan)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3Bulanan.map((item, idx) => (
              <div key={item.pejuang.id} className="flex items-center p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mr-3 shadow-sm ${idx === 0 ? 'bg-amber-100 text-amber-600 border-2 border-amber-300' : idx === 1 ? 'bg-slate-200 text-slate-500 border-2 border-slate-300' : 'bg-orange-100 text-orange-600 border-2 border-orange-300'}`}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white truncate">{item.pejuang.nama}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.pejuang.subDivisi}</p>
                </div>
                <div className="ml-2 font-black text-emerald-600 dark:text-emerald-400 text-lg">
                  {item.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK STATS SUMMARY ROW */}"""

if 'TOP 3 PERFORMERS (BULANAN)' not in content:
    content = content.replace(target_ui, replace_ui)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
