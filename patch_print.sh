sed -i '/<button\n *onClick={handleExportPDF}/i\
              <button\
                onClick={() => window.print()}\
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition-colors"\
              >\
                <Printer className="w-4 h-4" />\
                <span>Cetak Print</span>\
              </button>' src/components/ReportsView.tsx
