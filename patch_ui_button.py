import re

with open('src/components/ChecklistFormInput.tsx', 'r') as f:
    content = f.read()

target_ui = """            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors border border-emerald-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset 10 Tugas</span>
            </button>"""

replacement_ui = """            <button
              type="button"
              onClick={handleDuplicatePreviousWeek}
              className="text-xs bg-emerald-700 hover:bg-emerald-600 text-emerald-100 font-bold px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors border border-emerald-500"
              title="Salin rencana & format dari pekan sebelumnya"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Duplikat Pekan Sblm</span>
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-100 font-bold px-3 py-1 rounded-lg flex items-center space-x-1 transition-colors border border-emerald-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset 10 Tugas</span>
            </button>"""

content = content.replace(target_ui, replacement_ui)

with open('src/components/ChecklistFormInput.tsx', 'w') as f:
    f.write(content)
