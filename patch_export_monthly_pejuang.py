import re

with open('src/utils/export.ts', 'r') as f:
    content = f.read()

# Add badges to parameters
content = content.replace(
    '''export async function exportMonthlyPejuangToPDF(
  pejuang: any,
  monthSubmissions: any[],
  periodStr: string,
  chartBase64?: string,
  dokumenUrls?: string[]
) {''',
    '''export async function exportMonthlyPejuangToPDF(
  pejuang: any,
  monthSubmissions: any[],
  periodStr: string,
  chartBase64?: string,
  dokumenUrls?: string[],
  badges?: any[]
) {'''
)

with open('src/utils/export.ts', 'w') as f:
    f.write(content)
print("done")
