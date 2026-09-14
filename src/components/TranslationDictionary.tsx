import React, { useMemo } from 'react';
import { ChecklistFormSubmission, Pejuang } from '../types';

const staticKeys = [
  "FORM CHECKLIST PENGURUS KEPONDOKAN AL BAHJAH CABANG 1",
  "NAMA",
  "AMANAH",
  "PERIODE",
  "PERFORMA",
  "PREDIKAT",
  "STATUS",
  "RANGKING",
  "dari",
  "Pejuang",
  "Grafik Kegiatan per Kategori:",
  "Dokumentasi Fisik (Bukti Checklist):",
  "Kat",
  "Uraian Tugas/Kegiatan",
  "Target",
  "Realisasi",
  "Persentase",
  "Ustadz Muhammad Hamdani",
  "s/d",
  "sd",
  "Rekap Semua Pejuang",
  "Laporan Divisi",
  "Laporan_Divisi",
  "Laporan_Checklist",
  "Laporan Bulanan",
  "LAPORAN BULANAN KINERJA PEJUANG",
  "Nama",
  "Sub Divisi",
  "Amanah",
  "Periode",
  "Performa Rata-Rata",
  "Total Form Pekan",
  "No",
  "Uraian Kegiatan",
  "Kategori",
  "Total Ceklis Bulan Ini",
  "Grafik Kinerja",
  "Dokumentasi Checklist (Fisik)",
  "Mengetahui,",
  "Kepala Pondok Pesantren",
  "LAPORAN KONSOLIDASI KINERJA",
  "PEJUANG KEPONDOKAN",
  "Ringkasan Pejuang",
  "Total",
  "Peringkat",
  "Nama Pejuang",
  "Divisi",
  "Form Disubmit",
  "Rata-Rata",
  "Predikat",
  "Grafik Peringkat Performa",
  "Laporan_Konsolidasi",
  "Laporan_Bulanan",
  "Rekapitulasi_Kinerja",
  "Bulanan",
  "Mingguan",
  "Rentang",
  "Rekap_Performa_Bulan",
  "Rekap_Performa_Pekan",
  "Checklist",
  "Pekan",
  "Rekap_Bulan",
  "Laporan Bulanan Pejuang",
  "Ceklis Tuntas",
  "Performa",
  "Status",
  "Pekan 1", "Pekan 2", "Pekan 3", "Pekan 4", "Pekan 5",
  "Total Ceklis",
  "YAYASAN AL-BAHJAH CABANG CIREBON 1",
  "PONDOK PESANTREN AL-BAHJAH CABANG CIREBON 1",
  "NOMOR STATISTIK PESANTREN (NSP): 510032090039",
  "Jl. Pangeran Cakrabuana No. 179, Blok Gudang Air, Sendang, Sumber, Kab. Cirebon 45611",
  "Email: pondok.albahjahcirebon1@albahjah.or.id | Website: www.albahjah.or.id",
  "Sertifikat",
  "Laporan",
  "Aktif",
  "Cuti",
  "Nonaktif",
  "Waktu",
  "Catatan",
  "Evaluasi",
  "Bulan",
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

interface Props {
  submissions: ChecklistFormSubmission[];
  pejuangList: Pejuang[];
}

export const TranslationDictionary: React.FC<Props> = ({ submissions, pejuangList }) => {
  const keysToTranslate = useMemo(() => {
    const set = new Set<string>(staticKeys);
    
    // Add dynamic values that might need translation
    submissions.forEach(sub => {
      sub.tasks.forEach(t => {
        if (t.uraian) set.add(t.uraian);
        if (t.kategori) set.add(t.kategori);
      });
      if (sub.periodeStr) set.add(sub.periodeStr);
    });

    pejuangList.forEach(p => {
      if (p.nama) set.add(p.nama);
      if (p.subDivisi) set.add(p.subDivisi);
      if (p.amanah) set.add(p.amanah);
    });

    return Array.from(set);
  }, [submissions, pejuangList]);

  return (
    <div id="google-translate-dictionary" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
      {keysToTranslate.map(key => {
        try {
          const b64 = btoa(unescape(encodeURIComponent(key)));
          return <span key={b64} data-key={b64}>{key}</span>;
        } catch (e) {
          return null;
        }
      })}
    </div>
  );
};
