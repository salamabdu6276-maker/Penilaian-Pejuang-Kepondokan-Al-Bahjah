import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Add Print Summary button for the Rekap Semua Pejuang
target = '              <button\n                disabled={isExportDisabled}\n                onClick={() => {\n                  if (isExportDisabled) {'
replace = """              <button
                disabled={isExportDisabled}
                onClick={() => window.print()}
                data-html2canvas-ignore="true" 
                className={`flex items-center space-x-1.5 ${isExportDisabled ? 'bg-slate-400 cursor-not-allowed opacity-50' : 'bg-slate-800 hover:bg-slate-900'} text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors`}
              >
                <Printer className="w-4 h-4" />
                <span>Print Summary</span>
              </button>
              <button
                disabled={isExportDisabled}
                onClick={() => {
                  if (isExportDisabled) {"""

content = content.replace(target, replace, 1)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
