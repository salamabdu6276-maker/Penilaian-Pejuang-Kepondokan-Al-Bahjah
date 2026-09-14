import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

import_target = """import { exportFormToPDF, exportMonthlyPejuangToPDF, exportToExcel, exportToCSV, exportElementToImage, exportSummaryToPDF, exportElementToPDF } from "../utils/export";"""
new_import = """import { exportFormToPDF, exportMonthlyPejuangToPDF, exportToExcel, exportToCSV, exportElementToImage, exportSummaryToPDF, exportElementToPDF } from "../utils/export";
import { AnimatedDownloadButton } from './AnimatedDownloadButton';"""
content = content.replace(import_target, new_import)

btn1 = """                  <button onClick={() => {
                      const summaryData = rekapData.slice(0, 5).map((d, i) => ({
                        Peringkat: i + 1,
                        Nama: d.pejuang.nama,
                        "Sub Divisi": d.pejuang.subDivisi,
                        "Persentase (%)": d.performa,
                        Evaluasi: d.evaluasi
                      }));
                      exportSummaryToPDF(summaryData, reportType === 'bulan' ? `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` : 'Periode', 'Top 5 Pejuang Terbaik');
                  }} className="text-[10px] bg-rose-100 text-rose-700 px-2 py-1 rounded font-bold hover:bg-rose-200">PDF</button>"""
new_btn1 = """                  <AnimatedDownloadButton 
                    label="PDF" 
                    className="!text-[10px] !bg-rose-100 !text-rose-700 hover:!bg-rose-200" 
                    onClick={() => {
                      const summaryData = rekapData.slice(0, 5).map((d, i) => ({
                        Peringkat: i + 1,
                        Nama: d.pejuang.nama,
                        "Sub Divisi": d.pejuang.subDivisi,
                        "Persentase (%)": d.performa,
                        Evaluasi: d.evaluasi
                      }));
                      exportSummaryToPDF(summaryData, reportType === 'bulan' ? `${GREGORIAN_MONTHS_ID[selectedMonth - 1]} ${selectedYear}` : 'Periode', 'Top 5 Pejuang Terbaik');
                  }} />"""
content = content.replace(btn1, new_btn1)

btn2 = """                  <button onClick={() => {
                      const summaryData = rekapData.slice(0, 5).map((d, i) => ({
                        Peringkat: i + 1,
                        Nama: d.pejuang.nama,
                        "Sub Divisi": d.pejuang.subDivisi,
                        "Persentase (%)": d.performa,
                        Evaluasi: d.evaluasi
                      }));
                      exportToExcel(summaryData, 'Top_5_Pejuang');
                  }} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold hover:bg-emerald-200">Excel</button>"""
new_btn2 = """                  <AnimatedDownloadButton 
                    label="Excel" 
                    className="!text-[10px] !bg-emerald-100 !text-emerald-700 hover:!bg-emerald-200" 
                    onClick={() => {
                      const summaryData = rekapData.slice(0, 5).map((d, i) => ({
                        Peringkat: i + 1,
                        Nama: d.pejuang.nama,
                        "Sub Divisi": d.pejuang.subDivisi,
                        "Persentase (%)": d.performa,
                        Evaluasi: d.evaluasi
                      }));
                      exportToExcel(summaryData, 'Top_5_Pejuang');
                  }} />"""
content = content.replace(btn2, new_btn2)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("Updated ReportsView download buttons")
