import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""export const ReportsView: React.FC<ReportsViewProps> = ({
  const appLogo = useAppLogo();""",
"""export const ReportsView: React.FC<ReportsViewProps> = ({"""
)

content = content.replace(
"""}) => {
  const [reportType, setReportType] = useState<"pejuang" | "divisi" | "bulan" | "rentang">("pejuang");""",
"""}) => {
  const appLogo = useAppLogo();
  const [reportType, setReportType] = useState<"pejuang" | "divisi" | "bulan" | "rentang">("pejuang");"""
)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
