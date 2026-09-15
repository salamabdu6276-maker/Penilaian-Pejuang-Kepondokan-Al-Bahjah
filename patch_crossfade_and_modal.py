import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

# Add framer-motion to App.tsx
if "import { motion" not in app_content:
    app_content = app_content.replace(
        "import React,", 
        "import { motion, AnimatePresence } from 'motion/react';\nimport React,"
    )

# Instead of unmounting the whole app with `key`, we animate the background using motion.div
# But since we want a cross-fade of the *whole* app when theme changes without losing state,
# we can render a fixed overlay that fades out, but that's complex.
# The simplest approach is animating the background color and text color with motion.
app_target = """  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">"""
    
app_new = """  return (
    <motion.div 
      initial={false}
      animate={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc', color: darkMode ? '#f1f5f9' : '#0f172a' }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="min-h-screen font-sans flex flex-col transition-colors"
    >"""

if app_target in app_content:
    app_content = app_content.replace(app_target, app_new)
    app_content = app_content.replace("    </div>\n  );\n}", "    </motion.div>\n  );\n}")

with open('src/App.tsx', 'w') as f:
    f.write(app_content)


with open('src/components/Dashboard.tsx', 'r') as f:
    dash_content = f.read()

dash_modal_target = """                      <Bar dataKey="Persentase" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.Persentase >= 80 ? '#10b981' : entry.Persentase >= 60 ? '#f59e0b' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  )
                })()}
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-700/50">"""

dash_modal_new = """                      <Bar dataKey="Persentase" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.Persentase >= 80 ? '#10b981' : entry.Persentase >= 60 ? '#f59e0b' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  )
                })()}
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 max-h-40 overflow-y-auto custom-scrollbar">
              <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Uraian Kegiatan per Kategori</h4>
              <div className="space-y-4">
                {(() => {
                   const tasksByCategory: Record<string, any[]> = {};
                   heatmapModalSubmission.tasks.forEach(t => {
                     const cat = t.kategori || "A";
                     if (!tasksByCategory[cat]) tasksByCategory[cat] = [];
                     tasksByCategory[cat].push(t);
                   });
                   return Object.entries(tasksByCategory).sort((a,b) => a[0].localeCompare(b[0])).map(([cat, tasks]) => (
                     <div key={cat} className="space-y-1">
                       <h5 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded inline-block mb-1">
                         Kategori {cat}
                       </h5>
                       <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5 ml-1">
                         {tasks.map((t, idx) => (
                           <li key={idx} className="leading-tight"><span className="font-semibold mr-1">{t.waktu}</span> {t.uraian}</li>
                         ))}
                       </ul>
                     </div>
                   ));
                })()}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-700/50 mt-2">"""

if dash_modal_target in dash_content:
    dash_content = dash_content.replace(dash_modal_target, dash_modal_new)
    
with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(dash_content)
