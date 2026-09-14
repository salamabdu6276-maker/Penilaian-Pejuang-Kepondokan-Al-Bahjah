const fs = require('fs');
const content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const lines = content.split('\n');

const componentStart = lines.findIndex(l => l.includes('const Dashboard: React.FC'));
const top3 = lines.findIndex(l => l.includes('const top3Bulanan ='));
console.log("Dashboard starts at:", componentStart);
console.log("top3Bulanan starts at:", top3);
