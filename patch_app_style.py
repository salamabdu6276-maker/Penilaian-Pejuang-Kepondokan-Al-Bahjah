import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('<div className="relative">', '<!-- div removed -->')
content = content.replace('<ReportsView pejuangList={pejuangList} submissions={submissions} />\n            </div>\n          </motion.div>', '<ReportsView pejuangList={pejuangList} submissions={submissions} />\n          </motion.div>')

with open('src/App.tsx', 'w') as f:
    f.write(content)
