import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

import_target = """import { MonthlyHeatmap } from "./MonthlyHeatmap";"""
new_import = """import { MonthlyHeatmap } from "./MonthlyHeatmap";
import { AnimatedDownloadButton } from './AnimatedDownloadButton';"""
content = content.replace(import_target, new_import)

btn_csv = """              <button 
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>"""
new_csv = """              <AnimatedDownloadButton 
                onClick={handleExportCSV}
                label="CSV"
              />"""
content = content.replace(btn_csv, new_csv)

btn_pdf = """              <button 
                onClick={handleExportPDF}
                className="flex items-center space-x-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>"""
new_pdf = """              <AnimatedDownloadButton 
                onClick={handleExportPDF}
                label="PDF"
                className="!bg-rose-100 !text-rose-700 hover:!bg-rose-200"
              />"""
content = content.replace(btn_pdf, new_pdf)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Updated Dashboard download buttons")
