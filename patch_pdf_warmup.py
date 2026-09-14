import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

warmup_form = """export async function exportFormToPDF(
  submission: ChecklistFormSubmission, 
  pejuang?: Pejuang,
  allSubmissions?: ChecklistFormSubmission[],
  chartBase64?: string,
  dokumenUrls?: string[],
  sholatData?: any[]
) {
  // Pass 1: Warm up dynamic translations
  translateText(submission.pejuangNama);
  translateText(submission.amanah);
  translateText(submission.subDivisi);
  translateText(submission.periodeStr);
  translateText(submission.status.toUpperCase());
  submission.tasks.forEach(task => {
    translateText(task.waktu);
    translateText(task.uraian);
    translateText(task.kategori);
    translateText(task.catatan || "");
  });
  await new Promise(res => setTimeout(res, 800));
"""
content = content.replace('export async function exportFormToPDF(\n  submission: ChecklistFormSubmission, \n  pejuang?: Pejuang,\n  allSubmissions?: ChecklistFormSubmission[],\n  chartBase64?: string,\n  dokumenUrls?: string[],\n  sholatData?: any[]\n) {', warmup_form)

warmup_monthly = """export async function exportMonthlyPejuangToPDF(
  pejuang: Pejuang, 
  monthSubmissions: ChecklistFormSubmission[], 
  periodStr: string,
  badges?: any[],
  peringkatKeseluruhan?: number | null,
  peringkatDivisi?: number | null,
  allSubmissions?: ChecklistFormSubmission[],
  chartBase64?: string,
  dokumenUrls?: string[]
) {
  // Pass 1: Warm up dynamic translations
  translateText(pejuang.nama);
  translateText(pejuang.amanah);
  translateText(pejuang.subDivisi);
  translateText(periodStr);
  badges?.forEach(b => translateText(b.label));
  monthSubmissions.forEach(sub => {
    translateText(sub.periodeStr);
    sub.tasks.forEach(task => {
      translateText(task.waktu);
      translateText(task.uraian);
      translateText(task.kategori);
      translateText(task.catatan || "");
    });
  });
  await new Promise(res => setTimeout(res, 800));
"""
content = content.replace('export async function exportMonthlyPejuangToPDF(\n  pejuang: Pejuang, \n  monthSubmissions: ChecklistFormSubmission[], \n  periodStr: string,\n  badges?: any[],\n  peringkatKeseluruhan?: number | null,\n  peringkatDivisi?: number | null,\n  allSubmissions?: ChecklistFormSubmission[],\n  chartBase64?: string,\n  dokumenUrls?: string[]\n) {', warmup_monthly)

warmup_summary = """export async function exportSummaryToPDF(
  data: any[],
  periodStr: string
) {
  // Pass 1: Warm up dynamic translations
  translateText(periodStr);
  data.forEach(row => {
    translateText(row.nama);
    translateText(row.divisi);
    translateText(row.predikat);
  });
  await new Promise(res => setTimeout(res, 800));
"""
content = content.replace('export async function exportSummaryToPDF(\n  data: any[],\n  periodStr: string\n) {', warmup_summary)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
