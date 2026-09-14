import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = """      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-sm">
        <div className="container mx-auto px-4">
          <p className="font-semibold">
            Sistem Penilaian Pejuang Al-Bahjah &copy; {new Date().getFullYear()}
          </p>
          <p className="text-xs mt-1 text-slate-500">
            Created by Abdu Salam
          </p>
        </div>
      </footer>"""

target2 = """      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="font-semibold text-slate-300">
            YAYASAN AL-BAHJAH • PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1
          </p>
          <p className="text-slate-500">
            Digitalisasi Form Checklist Konsorsium Kepondokan & Real-Time Performance Analytics System
          </p>
        </div>
      </footer>"""

combined_footer = """      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="font-semibold text-slate-300">
            Sistem Penilaian Pejuang Al-Bahjah &copy; {new Date().getFullYear()} &bull; Created by Abdu Salam
          </p>
          <p className="font-bold text-slate-400 mt-2">
            YAYASAN AL-BAHJAH &bull; PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1
          </p>
          <p className="text-slate-500">
            Digitalisasi Form Checklist Konsorsium Kepondokan & Real-Time Performance Analytics System
          </p>
        </div>
      </footer>"""

content = content.replace(target1, "")
content = content.replace(target2, combined_footer)

with open('src/App.tsx', 'w') as f:
    f.write(content)
