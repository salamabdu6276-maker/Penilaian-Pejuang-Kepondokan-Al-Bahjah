cat << 'INNER_EOF' > /tmp/admin_target_ui.tsx
          {/* Target Kinerja */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="border-b border-slate-100 pb-3 mb-6">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Pengaturan Target Kinerja
              </h3>
              <p className="text-xs text-slate-500 mt-1">Atur persentase target ketercapaian minimal (default 80%).</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Mingguan (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weeklyTarget}
                  onChange={(e) => setWeeklyTarget(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={handleSaveTarget}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-colors"
              >
                Simpan Target
              </button>
            </div>
          </div>
INNER_EOF
sed -i -e '/{\/\* Backup Data \*\//i\' -e "$(cat /tmp/admin_target_ui.tsx | sed 's/$/\\/')" src/components/AdminSettings.tsx
sed -i 's/\\$//g' src/components/AdminSettings.tsx
