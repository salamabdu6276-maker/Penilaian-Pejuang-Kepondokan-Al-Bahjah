import { ChecklistTask } from "../types";

export const DEFAULT_CHECKLIST_TASKS: ChecklistTask[] = [
  {
    id: "task-1",
    no: 1,
    waktu: "04.00-05.30",
    uraian: "Sholat shubuh berjama’ah & memastikan tugas DKM dan kepala pondok dan musyrif",
    kategori: "A",
    catatanDefault: ""
  },
  {
    id: "task-2",
    no: 2,
    waktu: "05.30-07.30",
    uraian: "Mengontrol program bahasa berjalan",
    kategori: "B",
    catatanDefault: ""
  },
  {
    id: "task-3",
    no: 3,
    waktu: "05.30-07.30",
    uraian: "Mengontrol adanya brefing pagi di sd, smp, sma",
    kategori: "C",
    catatanDefault: ""
  },
  {
    id: "task-4",
    no: 4,
    waktu: "05.30-07.30",
    uraian: "Keliling Pondok dan mengecek fasilitas pondok",
    kategori: "D",
    catatanDefault: ""
  },
  {
    id: "task-5",
    no: 5,
    waktu: "05.30-07.30",
    uraian: "Memastikan berjalannya serah terima santri",
    kategori: "E",
    catatanDefault: ""
  },
  {
    id: "task-6",
    no: 6,
    waktu: "07.30-12.00",
    uraian: "Mengikuti musyawarah dan rapat sesuai undangan",
    kategori: "F",
    catatanDefault: ""
  },
  {
    id: "task-7",
    no: 7,
    waktu: "13.00-16.00",
    uraian: "Verifikasi Laporan & Koordinasi dengan Sekretaris Kepondokan",
    kategori: "G",
    catatanDefault: ""
  },
  {
    id: "task-8",
    no: 8,
    waktu: "18.45-19.45",
    uraian: "Membersamai shalat dan mengontrol berjalanya kegiatan diniyah",
    kategori: "H",
    catatanDefault: ""
  },
  {
    id: "task-9",
    no: 9,
    waktu: "21.00-22.30",
    uraian: "Mengontrol pondok dan memastikan istirahat santri",
    kategori: "I",
    catatanDefault: ""
  },
  {
    id: "task-10",
    no: 10,
    waktu: "08.00",
    uraian: "Memeriksa Laporan Form Checklist Kepala Pondok Unit",
    kategori: "J",
    catatanDefault: ""
  }
];

export const SUB_DIVISI_LIST = [
  "Manajemen Kepondokan",
  "Pondok Unit SDIQu",
  "Pondok Unit SMPIQu",
  "Pondok Unit SMAIQu",
  "Sub Divisi Tahkim",
  "Sub Divisi Tahfidz",
  "Sub Divisi Diniyah"
];
