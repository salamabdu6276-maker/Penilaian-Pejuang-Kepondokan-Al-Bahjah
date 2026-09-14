const fs = require('fs');
let content = fs.readFileSync('src/utils/export.ts', 'utf-8');

const oldCode = `  doc.text(\`PERFORMA: \${submission.percentage}%\`, 150, 52);
  doc.text(\`STATUS: \${submission.status.toUpperCase()}\`, 150, 57);
  doc.text(\`RANGKING: \${rankingText}\`, 150, 62);

  let predikat = "D";
  if (submission.percentage >= 91) predikat = "A";
  else if (submission.percentage >= 76) predikat = "B";
  else if (submission.percentage >= 40) predikat = "C";
  doc.text(\`PREDIKAT: \${predikat}\`, 150, 67);`;

const newCode = `  doc.text(\`PERFORMA: \${submission.percentage}%\`, 150, 52);

  let predikat = "D";
  if (submission.percentage >= 91) predikat = "A";
  else if (submission.percentage >= 76) predikat = "B";
  else if (submission.percentage >= 40) predikat = "C";
  doc.text(\`PREDIKAT: \${predikat}\`, 150, 57);

  doc.text(\`STATUS: \${submission.status.toUpperCase()}\`, 150, 62);
  doc.text(\`RANGKING: \${rankingText}\`, 150, 67);`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/utils/export.ts', content);
