import fs from 'fs';

let content = fs.readFileSync('src/components/ReportsView.tsx', 'utf-8');

function addDisabledClass(htmlSnippet) {
  let modified = htmlSnippet.replace(/className="/, 'disabled={isExportDisabled} className={`${isExportDisabled ? "opacity-50 cursor-not-allowed" : ""} ');
  return modified;
}

// Pejuang buttons
content = content.replace(/<button[^>]*onClick=\{handleExportPDF\}[^>]*>/, match => addDisabledClass(match));
content = content.replace(/<button[^>]*onClick=\{handleExportExcel\}[^>]*>/, match => addDisabledClass(match));
content = content.replace(/<button[^>]*onClick=\{handleExportPNG\}[^>]*>/, match => addDisabledClass(match));

fs.writeFileSync('src/components/ReportsView.tsx', content);
