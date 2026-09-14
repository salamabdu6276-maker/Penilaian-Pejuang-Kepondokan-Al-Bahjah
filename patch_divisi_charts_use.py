import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''<BarChart data={divisiData.slice(0, 3).map((d, i) => ({ name: d.pejuang.nama.split(" ")[0], Performa: d.performa, Peringkat: i + 1 }))} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>''',
    '''<BarChart data={top3DivisiData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>'''
)

content = content.replace(
    '''<LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>''',
    '''<LineChart data={trend3BulanDivisiData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>'''
)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
print("done")
