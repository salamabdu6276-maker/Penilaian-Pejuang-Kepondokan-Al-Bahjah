cat << 'INNER_EOF' > /tmp/selectors.tsx
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
INNER_EOF

# Replace lines 318-338 with the fixed ones
sed -i -e '318,338c\' -e "$(cat /tmp/selectors.tsx | sed 's/$/\\/')" src/components/ReportsView.tsx
# Clean up trailing backslash
sed -i 's/\\$//g' src/components/ReportsView.tsx
