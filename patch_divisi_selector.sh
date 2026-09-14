sed -i -e '/<label className="block text-\[11px\] font-bold uppercase text-slate-500">Pilih Pejuang<\/label>/i\
          {reportType === "divisi" && (\
            <div>\
              <label className="block text-[11px] font-bold uppercase text-slate-500">Pilih Divisi</label>\
              <select\
                value={selectedDivisi}\
                onChange={(e) => setSelectedDivisi(e.target.value)}\
                className="bg-slate-50 border border-slate-300 font-bold text-xs rounded-xl p-2 text-slate-800"\
              >\
                {SUB_DIVISI_LIST.map((sub, idx) => (\
                  <option key={idx} value={sub}>{sub}</option>\
                ))}\
              </select>\
            </div>\
          )}\
' src/components/ReportsView.tsx
