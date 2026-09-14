import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { DashboardCard } from "./DashboardCard";', 'import { DashboardCard } from "./DashboardCard";\nimport { SholatAttendanceUploader } from "./SholatAttendanceUploader";')

insert_point = '{/* Quick Actions */}'
upload_comp = '<SholatAttendanceUploader pejuangList={pejuangList} />\n'

content = content.replace(insert_point, upload_comp + insert_point)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
