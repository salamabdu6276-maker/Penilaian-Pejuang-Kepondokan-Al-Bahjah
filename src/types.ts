export type Role = 'admin' | 'user' | 'guest';

export interface PejuangHistory {
  date: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface Pejuang {
  history?: PejuangHistory[];
  id: string;
  nama: string;
  subDivisi: string;
  amanah: string;
  fotoUrl?: string;
  whatsapp?: string;
  status: 'aktif' | 'nonaktif';
  quickNotes?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  nama: string;
  username: string;
  email?: string;
  password?: string;
  subDivisi?: string;
  role: 'superadmin' | 'admin';
  status: 'aktif' | 'nonaktif';
  quickNotes?: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface ChecklistTask {
  id: string;
  no: number;
  waktu: string;
  uraian: string;
  kategori: string; // e.g. A, B, C, D, E, F, G, H, I, J
  catatanDefault?: string;
}

export interface TaskRecord {
  taskId: string;
  no: number;
  waktu: string;
  uraian: string;
  kategori: string;
  catatan: string;
  rencanaChecks: Record<number, boolean>;
  realisasiChecks: Record<number, boolean>;
}

export interface DocumentUpload {
  id: string;
  pejuangId: string;
  pejuangNama: string;
  subDivisi: string;
  bulan: number;
  tahun: number;
  pekan: number;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  status: 'Sudah Setor' | 'Belum Menyerahkan';
  waktuSetor?: string;
}

export interface ChecklistFormSubmission {
  id: string;
  pejuangId: string;
  pejuangNama: string;
  subDivisi: string;
  amanah: string;
  bulan: number; // 1-12
  tahun: number; // e.g. 2026
  pekan: number; // 1, 2, 3, 4
  periodeStr: string; // e.g. "01 – 07 Juni 2026"
  dates: number[]; // e.g. [1,2,3,4,5,6,7]
  tasks: TaskRecord[];
  totalChecked: number;
  totalPossible: number;
  percentage: number;
  kategoriTertinggi: string;
  status: 'draft' | 'submitted' | 'verified';
  updatedAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'achievement' | 'alert' | 'coaching' | 'reminder';
  pejuangId?: string;
  isRead: boolean;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DatePerformanceSummary {
  dateStr: string; // YYYY-MM-DD
  dateNum: number;
  topPejuangNama: string;
  topPejuangFoto?: string;
  topPercentage: number;
  topKategori: string;
  totalChecklistsSubmitted: number;
}

export interface SholatAttendance {
  id: string; // e.g. "pejuangId_2026-04-01"
  pejuangId: string;
  pejuangNama: string;
  date: string; // YYYY-MM-DD
  dzuhur: string | null; // time e.g. "12:30"
  ashar: string | null;
  maghrib: string | null;
  isya: string | null;
  qiyamul_lail: string | null;
  subuh: string | null;
}
