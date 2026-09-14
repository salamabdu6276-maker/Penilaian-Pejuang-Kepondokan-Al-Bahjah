sed -i '/<\/main>/a\
      {/* Footer */}\
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-sm">\
        <div className="container mx-auto px-4">\
          <p className="font-semibold">\
            Sistem Penilaian Pejuang Al-Bahjah &copy; {new Date().getFullYear()}\
          </p>\
          <p className="text-xs mt-1 text-slate-500">\
            Created by Abdu Salam\
          </p>\
        </div>\
      </footer>' src/App.tsx
