const fs = require('fs');
let code = fs.readFileSync('src/components/ReportsView.tsx', 'utf8');
code = code.replace(
`        if (pejuangDocs.length > 0) {
          const latest = pejuangDocs.sort((a, b) => new Date(b.waktuSetor || 0).getTime() - new Date(a.waktuSetor || 0).getTime())[0];
          const urls = [];
          if (latest.foto1) urls.push(latest.foto1);
          if (latest.foto2) urls.push(latest.foto2);
          if (latest.foto3) urls.push(latest.foto3);
          setDokumenUrls(urls);
        } else {
          setDokumenUrls([]);
        }`,
`        if (pejuangDocs.length > 0) {
          const urls = [];
          pejuangDocs.forEach(doc => {
            if (doc.foto1) urls.push(doc.foto1);
            if (doc.foto2) urls.push(doc.foto2);
            if (doc.foto3) urls.push(doc.foto3);
          });
          setDokumenUrls(urls);
        } else {
          setDokumenUrls([]);
        }`
);
fs.writeFileSync('src/components/ReportsView.tsx', code);
console.log('done');
