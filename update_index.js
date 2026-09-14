import fs from 'fs';

let indexHtml = fs.readFileSync('index.html', 'utf-8');
indexHtml = indexHtml.replace('<title>My Google AI Studio App</title>', '<title>Sistem Penilaian Pejuang Kepondokan</title>');
fs.writeFileSync('index.html', indexHtml);

let header = fs.readFileSync('src/components/Header.tsx', 'utf-8');
header = header.replace('Lembaga Pengembangan Dakwah Al-Bahjah', 'Yayasan Al-Bahjah Cabang Cirebon 1');
header = header.replace('<Building2 className="w-8 h-8 text-amber-400" />', '<img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />');
fs.writeFileSync('src/components/Header.tsx', header);
