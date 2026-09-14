import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Add translation wait helper to exports
if 'export async function prepareTranslations()' not in content:
    content = content.replace(
        'export function exportToCSV(',
        '''export async function prepareTranslations() {
  // Trigger a dummy change or just wait a bit for Google Translate to finish DOM replacement
  return new Promise(resolve => setTimeout(resolve, 800));
}

export async function exportToCSV('''
    )

    content = content.replace('export function exportFormToPDF', 'export async function exportFormToPDF')
    content = content.replace('export function exportMonthlyPejuangToPDF', 'export async function exportMonthlyPejuangToPDF')
    content = content.replace('export function exportSummaryToPDF', 'export async function exportSummaryToPDF')

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
