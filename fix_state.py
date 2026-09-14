import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

state_code = """  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [overviewViewType, setOverviewViewType] = useState<"weekly" | "monthly" | "quarterly">("weekly");"""

content = content.replace("  const [selectedYear, setSelectedYear] = useState<number>(2026);", state_code)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
print("Done")
