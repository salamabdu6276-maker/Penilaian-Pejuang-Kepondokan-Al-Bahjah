import re

with open('src/components/ReportsView.tsx', 'r') as f:
    content = f.read()

# 1. Icons import
target_icons = """  Download,
  Search"""
replacement_icons = """  Download,
  Search,
  Sparkles,
  BrainCircuit"""
content = content.replace(target_icons, replacement_icons)

# 2. Add React Markdown import
if 'import ReactMarkdown from' not in content:
    target_imports = """import { calculateBadges } from "../utils/badges";"""
    replacement_imports = """import { calculateBadges } from "../utils/badges";\nimport ReactMarkdown from 'react-markdown';"""
    content = content.replace(target_imports, replacement_imports)

# 3. Add States for AI Insight
target_states = """  const [dokumenUrls, setDokumenUrls] = React.useState<string[]>([]);"""
replacement_states = """  const [dokumenUrls, setDokumenUrls] = React.useState<string[]>([]);
  const [aiInsight, setAiInsight] = React.useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = React.useState(false);"""
content = content.replace(target_states, replacement_states)

# 4. Add generate insight handler
target_handler = """  // Setup periodic data processing based on reportType"""
replacement_handler = """  const handleGenerateInsight = async () => {
    setIsGeneratingInsight(true);
    setAiInsight(null);
    try {
      const underperforming = submissions.filter(s => s.percentage < 80);
      const res = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissions: underperforming,
          period: `${selectedMonth}/${selectedYear}`
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.text);
      } else {
        setAiInsight("Gagal mendapatkan insight AI.");
      }
    } catch (err) {
      setAiInsight("Terjadi kesalahan saat menghubungi server AI.");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  // Setup periodic data processing based on reportType"""
content = content.replace(target_handler, replacement_handler)

# 5. Add UI for AI Insight
target_ui = """      {/* Export Error */}"""
replacement_ui = """      {/* AI Insight Module */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800 shadow-sm mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="w-24 h-24 text-indigo-500" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-bold text-indigo-900 dark:text-indigo-100 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                AI Coaching Insight
              </h3>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 mt-1">Analisis pintar dari performa di bawah target (&#60;80%) untuk membantu Lead Divisi.</p>
            </div>
            <button 
              onClick={handleGenerateInsight} 
              disabled={isGeneratingInsight}
              className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-md transition-all whitespace-nowrap"
            >
              {isGeneratingInsight ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
              {isGeneratingInsight ? "Menganalisis..." : "Generate Insight"}
            </button>
          </div>
          
          {aiInsight && (
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 text-sm text-slate-800 dark:text-slate-200 prose prose-sm dark:prose-invert max-w-none border border-indigo-100 dark:border-indigo-800/50">
              <ReactMarkdown>{aiInsight}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {/* Export Error */}"""
content = content.replace(target_ui, replacement_ui)

with open('src/components/ReportsView.tsx', 'w') as f:
    f.write(content)
