import re

with open('index.html', 'r') as f:
    content = f.read()

if '<link rel="icon"' not in content:
    content = content.replace('<title>Sistem Penilaian Pejuang Kepondokan</title>', '<title>Sistem Penilaian Pejuang Kepondokan</title>\n    <link rel="icon" href="/logo.png" />')

with open('index.html', 'w') as f:
    f.write(content)
