import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { DashboardCard } from "./DashboardCard";', 'import { DashboardCard } from "./DashboardCard";\nimport { SholatAttendanceUploader } from "./SholatAttendanceUploader";')

insert_point = '<div className="lg:col-span-1">\n                  \n        </div>'
new_insert = '<div className="lg:col-span-1">\n          <SholatAttendanceUploader pejuangList={pejuangList} />\n        </div>'

content = content.replace(insert_point, new_insert)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
