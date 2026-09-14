import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf-8');

if (!css.includes('@custom-variant dark')) {
    css = '@custom-variant dark (&:where(.dark, .dark *));\n' + css;
    fs.writeFileSync('src/index.css', css);
}

