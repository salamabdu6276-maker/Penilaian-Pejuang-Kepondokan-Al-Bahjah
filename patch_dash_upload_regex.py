import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Make sure the import is there. It was added previously if the string existed, but let's be sure.
if 'import { SholatAttendanceUploader }' not in content:
    content = content.replace('import { DashboardCard } from "./DashboardCard";', 'import { DashboardCard } from "./DashboardCard";\nimport { SholatAttendanceUploader } from "./SholatAttendanceUploader";')

# Replace the empty lg:col-span-1 block with the component
content = re.sub(r'<div className="lg:col-span-1">\s*</div>', '<div className="lg:col-span-1">\n          <SholatAttendanceUploader pejuangList={pejuangList} />\n        </div>', content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
