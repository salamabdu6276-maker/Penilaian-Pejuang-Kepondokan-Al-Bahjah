import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = """  // Weekly Trend Chart Data
  const weeklyTrendData = React.useMemo(() => {"""

replacement = """  const [myProfileId, setMyProfileId] = useState<string>(localStorage.getItem("myPejuangId") || "");
  
  // My Performance Trend Data
  const myPerformanceData = React.useMemo(() => {
    if (!myProfileId) return [];
    const weeks = [1, 2, 3, 4, 5];
    return weeks.map(w => {
      const sub = monthSubmissions.find(s => s.pekan === w && s.pejuangId === myProfileId);
      return {
        name: `Pekan ${w}`,
        Performa: sub ? sub.percentage : null
      };
    });
  }, [monthSubmissions, myProfileId]);

  // Weekly Trend Chart Data
  const weeklyTrendData = React.useMemo(() => {"""

content = content.replace(target, replacement)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
