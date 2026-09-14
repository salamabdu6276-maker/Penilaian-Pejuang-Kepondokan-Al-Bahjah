import re

with open('src/components/SholatAttendanceRecap.tsx', 'r') as f:
    content = f.read()

# Add imports
import_target = "import { GREGORIAN_MONTHS_ID } from '../utils/hijri';"
import_replacement = """import { GREGORIAN_MONTHS_ID } from '../utils/hijri';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { BarChart2 } from 'lucide-react';"""
if "from 'recharts'" not in content:
    content = content.replace(import_target, import_replacement)

# Add chartData useMemo
hook_target = "}, [attendances, localMonth, localYear, pejuangList]);"
hook_replacement = """}, [attendances, localMonth, localYear, pejuangList]);

  const chartData = useMemo(() => {
    let subuh = 0, dzuhur = 0, ashar = 0, maghrib = 0, isya = 0, qiyamul_lail = 0;
    
    aggregatedData.forEach(row => {
      subuh += row.subuh;
      dzuhur += row.dzuhur;
      ashar += row.ashar;
      maghrib += row.maghrib;
      isya += row.isya;
      qiyamul_lail += row.qiyamul_lail;
    });

    return [
      { name: 'Subuh', total: subuh, fill: '#8b5cf6' },
      { name: 'Dzuhur', total: dzuhur, fill: '#f59e0b' },
      { name: 'Ashar', total: ashar, fill: '#f97316' },
      { name: 'Maghrib', total: maghrib, fill: '#ef4444' },
      { name: 'Isya', total: isya, fill: '#3b82f6' },
      { name: 'Qiyamul Lail', total: qiyamul_lail, fill: '#10b981' }
    ];
  }, [aggregatedData]);"""
if "const chartData = useMemo" not in content:
    content = content.replace(hook_target, hook_replacement)

# Add chart render
render_target = """{aggregatedData.length > 0 && aggregatedData.some(d => d.totalDays > 0) ? (
        <div className="overflow-x-auto">"""
render_replacement = """{aggregatedData.length > 0 && aggregatedData.some(d => d.totalDays > 0) ? (
        <div className="space-y-6">
          <div className="h-[280px] bg-slate-50 dark:bg-slate-700/30 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 flex flex-col">
            <div className="mb-4 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-slate-500" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Kehadiran Keseluruhan Bulan Ini</h4>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }}
                  />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-x-auto">"""
content = content.replace(render_target, render_replacement)

# End the div properly
end_target = """</table>
        </div>
      ) : ("""
end_replacement = """</table>
          </div>
        </div>
      ) : ("""
content = content.replace(end_target, end_replacement)

with open('src/components/SholatAttendanceRecap.tsx', 'w') as f:
    f.write(content)
