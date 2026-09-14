const fs = require('fs');
const content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const lines = content.split('\n');
const idx = lines.findIndex(l => l.includes('const top3Bulanan ='));
console.log(lines.slice(idx - 5, idx + 20).join('\n'));
