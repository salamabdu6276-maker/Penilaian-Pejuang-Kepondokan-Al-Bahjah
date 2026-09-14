import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { Upload, FileText, Loader2, Calendar } from 'lucide-react';
import { saveSholatAttendance } from '../services/dbService';
import { Pejuang } from '../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface Props {
  pejuangList: Pejuang[];
  onUploadSuccess?: () => void;
}

export const SholatAttendanceUploader: React.FC<Props> = ({ pejuangList, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const parseTime = (timeStr: string) => {
    if (!timeStr) return null;
    return timeStr;
  };

  const getSholatName = (timeStr: string) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    const totalMinutes = h * 60 + m;

    if (totalMinutes >= 12 * 60 && totalMinutes <= 13 * 60) return 'dzuhur';
    if (totalMinutes >= 15 * 60 && totalMinutes <= 16 * 60) return 'ashar';
    if (totalMinutes >= 18 * 60 && totalMinutes <= 19 * 60) return 'maghrib';
    if (totalMinutes >= 19 * 60 + 30 && totalMinutes <= 20 * 60 + 30) return 'isya';
    if (totalMinutes >= 3 * 60 && totalMinutes <= 4 * 60) return 'qiyamul_lail';
    if (totalMinutes >= 4 * 60 && totalMinutes <= 5 * 60 + 40) return 'subuh';
    
    return null;
  };

  const processPDF = async (file: File) => {
    if (!startDate || !endDate) {
      setMessage('Silakan isi rentang tanggal terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setMessage('');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        text += strings.join(' ') + '\n';
      }

      console.log('PDF Text Extract:', text.substring(0, 500)); // Debug

      const regex = /([a-zA-Z\s]+)\s+([a-zA-Z\s_]+)\s+(\d{4}-\d{2}-\d{2})\s*([\d:]+)?\s*([\d:]+)?\s*([\d:]+)?\s*([\d:]+)?/g;
      
      let match;
      const attendanceData: any = {};

      while ((match = regex.exec(text)) !== null) {
        let name = match[1].trim();
        name = name.replace(/Kepondokan/g, '').replace(/Musyrif/g, '').trim();
        
        const date = match[3];
        
        // Filter by date range
        if (date < startDate || date > endDate) continue;

        const times = [match[4], match[5], match[6], match[7]].filter(Boolean);
        
        // Find matching pejuang
        const pejuang = pejuangList.find(p => p.nama.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.nama.toLowerCase()));
        
        if (pejuang) {
          const id = `${pejuang.id}_${date}`;
          if (!attendanceData[id]) {
            attendanceData[id] = {
              id,
              pejuangId: pejuang.id,
              pejuangNama: pejuang.nama,
              date,
              dzuhur: null, ashar: null, maghrib: null, isya: null, qiyamul_lail: null, subuh: null
            };
          }
          
          times.forEach(t => {
            const sholat = getSholatName(t);
            if (sholat) {
              attendanceData[id][sholat] = t;
            }
          });
        }
      }

      const count = Object.keys(attendanceData).length;
      
      for (const key in attendanceData) {
        await saveSholatAttendance(attendanceData[key]);
      }

      setMessage(`Berhasil memproses ${count} data absensi.`);
      if (onUploadSuccess) onUploadSuccess();

    } catch (err) {
      console.error(err);
      setMessage('Gagal memproses file PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-emerald-600" />
        Upload Absensi Sholat (PDF Mesin)
      </h3>
      
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Dari Tanggal</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-lg border-slate-300 text-sm" />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Sampai Tanggal</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full rounded-lg border-slate-300 text-sm" />
        </div>
      </div>

      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors relative">
        <input 
          type="file" 
          accept=".pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processPDF(file);
          }}
          disabled={isUploading}
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Memproses PDF...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Klik atau drop file PDF laporan mesin
            </p>
          </div>
        )}
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('Berhasil') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
};
