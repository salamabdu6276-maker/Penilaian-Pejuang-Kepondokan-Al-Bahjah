const fs = require('fs');
let content = fs.readFileSync('src/utils/export.ts', 'utf-8');

content = content.replace(
  'submission.pekan === 0 ? submission.periodeStr : "Pekan " + submission.pekan + " Tgl " + submission.periodeStr',
  'submission.pekan === 99 || submission.pekan === 0 ? submission.periodeStr : "Pekan " + submission.pekan + " Tgl " + submission.periodeStr'
);

fs.writeFileSync('src/utils/export.ts', content);
