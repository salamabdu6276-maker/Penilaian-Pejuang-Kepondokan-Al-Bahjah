cat << 'INNER_EOF' > /tmp/top3.tsx
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
INNER_EOF
sed -i -e '/<div className="grid grid-cols-1 lg:grid-cols-1 gap-6">/i\' -e "$(cat /tmp/top3.tsx | sed 's/$/\\/')" src/components/ReportsView.tsx
sed -i 's/\\$//g' src/components/ReportsView.tsx
