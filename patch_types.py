import re

with open('src/types.ts', 'r') as f:
    content = f.read()

target = """export interface DocumentUpload {
  id: string;
  pejuangId: string;
  pejuangNama: string;
  subDivisi: string;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  status: 'Sudah Setor' | 'Belum Menyerahkan';
  waktuSetor?: string;
}"""

replacement = """export interface DocumentUpload {
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
}"""

content = content.replace(target, replacement)

with open('src/types.ts', 'w') as f:
    f.write(content)
