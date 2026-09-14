cat << 'INNER_EOF' > /tmp/rekapchart.tsx
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 text-sm text-center">Grafik Peringkat Kinerja Seluruh Pejuang</h4>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rekapData.map((d, i) => ({ name: d.pejuang.nama.split(" ")[0], Performa: d.performa, Peringkat: i + 1 }))} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#475569" }} angle={-45} textAnchor="end" interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#475569" }} domain={[0, 100]} />
                    <Tooltip 
                      cursor={{ fill: "#f1f5f9" }} 
                      contentStyle={{ backgroundColor: "#1e293b", borderRadius: "8px", color: "#fff", fontSize: "12px", border: "none" }} 
                      formatter={(value: number, name: string) => [name === 'Performa' ? `${value}%` : value, name]} 
                    />
                    <ReferenceLine y={weeklyTarget} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: `Target: ${weeklyTarget}%`, fill: '#ef4444', fontSize: 10 }} />
                    <Bar dataKey="Performa" radius={[4, 4, 0, 0]}>
                      {rekapData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.performa >= weeklyTarget ? "#10b981" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
INNER_EOF
sed -i -e '703,727c\' -e "$(cat /tmp/rekapchart.tsx | sed 's/$/\\/')" src/components/ReportsView.tsx
sed -i 's/\\$//g' src/components/ReportsView.tsx
