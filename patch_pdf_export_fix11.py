with open('src/utils/export.ts', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "let currentY = (doc as any).lastAutoTable.finalY + 10;" in line:
        print(f"Line {i+1}: {line.strip()}")
