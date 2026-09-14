import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make sure it's imported
if 'import { SholatAttendanceRecap }' not in content:
    content = content.replace('import { SholatAttendanceUploader } from "./SholatAttendanceUploader";', 'import { SholatAttendanceUploader } from "./SholatAttendanceUploader";\nimport { SholatAttendanceRecap } from "./SholatAttendanceRecap";')

# Place it after the uploader section
target_section = '        <div className="lg:col-span-1">\n          <SholatAttendanceUploader pejuangList={pejuangList} />\n        </div>\n      </div>'
new_section = '        <div className="lg:col-span-1">\n          <SholatAttendanceUploader pejuangList={pejuangList} />\n        </div>\n      </div>\n\n      <div className="mb-6">\n        <SholatAttendanceRecap pejuangList={pejuangList} selectedMonth={selectedMonth} selectedYear={selectedYear} />\n      </div>'

if target_section in content:
    content = content.replace(target_section, new_section)
else:
    print("Failed to find target section")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
