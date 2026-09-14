import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# Add import
if 'import CertificateModal' not in content:
    content = content.replace("import { Download, Search, Filter, Printer } from 'lucide-react';", "import { Download, Search, Filter, Printer, Award } from 'lucide-react';\nimport CertificateModal from './CertificateModal';")

# Add state for modal
state_injection = """
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedCertData, setSelectedCertData] = useState<{name: string, divisi: string, performa: number} | null>(null);
"""
if 'const [certModalOpen' not in content:
    content = content.replace('const [searchQuery, setSearchQuery] = useState("");', 'const [searchQuery, setSearchQuery] = useState("");\n' + state_injection)

# Add column header
th_target = '<th className="border border-slate-300 dark:border-slate-600 p-2">Evaluasi</th>'
th_replace = '<th className="border border-slate-300 dark:border-slate-600 p-2">Evaluasi</th>\n                  {reportType === "bulan" && <th className="border border-slate-300 dark:border-slate-600 p-2">Aksi</th>}'
if 'Aksi</th>' not in content:
    content = content.replace(th_target, th_replace)

# Add column data
td_target = '<td className="border border-slate-200 dark:border-slate-700 p-2 font-bold">{d.evaluasi}</td>'
td_replace = """<td className="border border-slate-200 dark:border-slate-700 p-2 font-bold">{d.evaluasi}</td>
                    {reportType === "bulan" && (
                      <td className="border border-slate-200 dark:border-slate-700 p-2 text-center">
                        {d.performa >= 90 ? (
                          <button
                            onClick={() => {
                              setSelectedCertData({ name: d.pejuang.nama, divisi: d.pejuang.subDivisi, performa: d.performa });
                              setCertModalOpen(true);
                            }}
                            className="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors shadow-sm"
                            title="Cetak Piagam Penghargaan"
                          >
                            <Award className="w-4 h-4" />
                            <span>Piagam</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">-</span>
                        )}
                      </td>
                    )}"""
content = content.replace(td_target, td_replace)

# Add modal to render
modal_render = """
      {/* Certificate Modal */}
      {selectedCertData && (
        <CertificateModal
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
          pejuangName={selectedCertData.name}
          divisi={selectedCertData.divisi}
          bulan={selectedMonth}
          tahun={selectedYear}
          performa={selectedCertData.performa}
        />
      )}
    </div>
"""
content = content.replace('    </div>\n  );\n}', modal_render + '  );\n}')

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
