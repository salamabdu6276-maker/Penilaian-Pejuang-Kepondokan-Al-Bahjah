import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Add translation warm-up wrapper to exportToCSV
content = content.replace(
    'export async function exportToCSV(data: Record<string, any>[], filename: string) {',
    '''export async function exportToCSV(data: Record<string, any>[], filename: string) {
  // Pass 1: Warm up translations
  if (data && data.length > 0) {
    data.forEach(row => {
      for (const key in row) {
        translateText(key);
        if (typeof row[key] === "string") translateText(row[key]);
      }
    });
    await new Promise(res => setTimeout(res, 800));
  }'''
)

# For PDF exports, we don't have a generic data array, but they all use `translateText` directly during generation.
# To warm them up, we can temporarily execute the generation in a dummy mode, or we can just extract the strings.
# But it's easier to just rely on `TranslationDictionary` for PDFs because most strings are static.
# However, the user specifically requested the "mencetak kerangka laporan tersebut di dalam elemen yang tersembunyi" solution.
# Wait, jsPDF doesn't render HTML to PDF (except html2canvas). jsPDF `doc.text()` draws strings on a canvas.
# The `translateText` function retrieves strings from the DOM.
# If we want the PDF to be translated, we must make sure all strings it uses are in the DOM and translated before calling doc.text().
