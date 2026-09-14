import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

target = """        await exportRekapToPDF(rekapData, periodStr, "LAPORAN REKAPITULASI KINERJA PEJUANG KEPONDOKAN");"""

replacement = """        let chartBase64;
        const chartEl = document.getElementById("rekap-chart-container");
        if (chartEl) {
          try {
            chartBase64 = await htmlToImage.toPng(chartEl, { pixelRatio: 2, backgroundColor: "#ffffff" });
          } catch(e) {
            console.error("Failed to capture chart", e);
          }
        }
        
        await exportRekapToPDF(rekapData, periodStr, "LAPORAN REKAPITULASI KINERJA PEJUANG KEPONDOKAN", chartBase64, dokumenUrls);"""

content = content.replace(target, replacement)

# Add ID to chart container
ui_target = """                <BarChart
                  data={rekapData}"""
ui_replacement = """                <BarChart
                  data={rekapData}"""
                  
content = content.replace('<div className="h-72 mt-4">', '<div className="h-72 mt-4 bg-white" id="rekap-chart-container">')

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
