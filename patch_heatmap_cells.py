import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """                  {[row.w1, row.w2, row.w3, row.w4, row.w5].map((val, idx) => {
                    let bgClass = "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700";
                    if (val !== undefined) {
                      if (val >= 90) bgClass = "bg-emerald-500 text-white";
                      else if (val >= 75) bgClass = "bg-emerald-400 text-emerald-950";
                      else if (val >= 50) bgClass = "bg-emerald-300 text-emerald-950";
                      else bgClass = "bg-emerald-200 text-emerald-950";
                    }
                    return (
                      <td key={idx} className={`p-2 text-[10px] font-bold text-center rounded-md ${bgClass} transition-colors`}>
                        {val !== undefined ? `${val}%` : '-'}
                      </td>
                    )
                  })}"""

new_code = """                  {[row.w1, row.w2, row.w3, row.w4, row.w5].map((val, idx) => {
                    let bgClass = "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700";
                    if (val !== undefined) {
                      if (val >= 90) bgClass = "bg-emerald-500 text-white";
                      else if (val >= 75) bgClass = "bg-emerald-400 text-emerald-950";
                      else if (val >= 50) bgClass = "bg-emerald-300 text-emerald-950";
                      else bgClass = "bg-emerald-200 text-emerald-950";
                    }
                    
                    const handleCellClick = () => {
                      if (val !== undefined) {
                        const sub = monthSubmissions.find(s => s.pejuangId === row.pejuang.id && s.pekan === idx + 1);
                        if (sub) {
                           setHeatmapModalSubmission(sub);
                        }
                      }
                    };
                    
                    return (
                      <td 
                        key={idx} 
                        onClick={handleCellClick}
                        className={`p-2 text-[10px] font-bold text-center rounded-md ${bgClass} transition-colors ${val !== undefined ? 'cursor-pointer hover:opacity-80' : ''}`}
                      >
                        {val !== undefined ? `${val}%` : '-'}
                      </td>
                    )
                  })}"""

content = content.replace(target, new_code)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
