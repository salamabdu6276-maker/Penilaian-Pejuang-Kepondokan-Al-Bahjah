import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Imports
import_target = 'import { fetchSholatAttendances } from \'../services/dbService\';'
import_replacement = 'import { fetchSholatAttendances, fetchNotifications } from \'../services/dbService\';\nimport { SystemNotification } from \'../types\';'
if 'fetchNotifications' not in content:
    content = content.replace(import_target, import_replacement)
    
if 'import { SystemNotification } from \'../types\';' not in content:
    content = content.replace('import { \n  Pejuang, \n  ChecklistFormSubmission, \n  Role \n} from "../types";', 'import { \n  Pejuang, \n  ChecklistFormSubmission, \n  Role,\n  SystemNotification \n} from "../types";')

# State
hook_target = '  const [previewData, setPreviewData] = useState<any[]>([]);'
hook_replacement = '''  const [previewData, setPreviewData] = useState<any[]>([]);
  const [coachingHistory, setCoachingHistory] = useState<SystemNotification[]>([]);

  React.useEffect(() => {
    fetchNotifications().then(notifs => {
      setCoachingHistory(notifs.filter(n => n.type === 'coaching'));
    });
  }, []);'''
if 'setCoachingHistory' not in content:
    content = content.replace(hook_target, hook_replacement)

# UI addition
target_ui = '''        </div>
      )}

      {/* OFFICIAL LETTERHEAD PRINTABLE PAPER SHEET */}'''
replacement_ui = '''        </div>
      )}

      {/* COACHING HISTORY SECTION */}
      {reportType === "pejuang" && activePejuang && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs mb-6">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-emerald-600" />
            Histori Coaching & Evaluasi ({activePejuang.nama})
          </h3>
          {coachingHistory.filter(n => n.pejuangId === activePejuang.id).length === 0 ? (
            <div className="text-center p-6 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <p className="text-sm">Belum ada riwayat coaching untuk pejuang ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coachingHistory.filter(n => n.pejuangId === activePejuang.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(notif => (
                <div key={notif.id} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{notif.title}</h4>
                    <span className="text-[10px] text-slate-500 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded font-medium">
                      {new Date(notif.date).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    <ReactMarkdown>{notif.message}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OFFICIAL LETTERHEAD PRINTABLE PAPER SHEET */}'''
if 'COACHING HISTORY SECTION' not in content:
    content = content.replace(target_ui, replacement_ui)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
