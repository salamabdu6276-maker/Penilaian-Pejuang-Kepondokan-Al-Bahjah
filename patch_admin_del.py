import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

import_target = """import { Trash2, Plus, Edit2, Shield, User, Download, Upload, AlertCircle, Save, Database, Trash, Info } from 'lucide-react';"""
new_import = """import { Trash2, Plus, Edit2, Shield, User, Download, Upload, AlertCircle, Save, Database, Trash, Info } from 'lucide-react';
import { AnimatedDeleteButton } from './AnimatedDeleteButton';"""
content = content.replace(import_target, new_import)

del_btn_1 = """                      <button
                        onClick={() => {
                          if (confirm(`Hapus pejuang ${p.nama}?`)) {
                            onDeletePejuang(p.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Pejuang"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>"""
new_del_btn_1 = """                      <AnimatedDeleteButton 
                        label="" 
                        onDelete={() => onDeletePejuang(p.id)} 
                        className="!bg-transparent !text-slate-400 hover:!bg-rose-50 hover:!text-rose-600 shadow-none" 
                      />"""
content = content.replace(del_btn_1, new_del_btn_1)

del_btn_2 = """                      <button
                        onClick={() => {
                          if (confirm(`Hapus admin ${a.name}?`)) {
                            onDeleteAdmin(a.id);
                          }
                        }}
                        disabled={a.role === 'superadmin'}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Hapus Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>"""
new_del_btn_2 = """                      {a.role !== 'superadmin' ? (
                        <AnimatedDeleteButton 
                          label="" 
                          onDelete={() => onDeleteAdmin(a.id)} 
                          className="!bg-transparent !text-slate-400 hover:!bg-rose-50 hover:!text-rose-600 shadow-none" 
                        />
                      ) : (
                        <button disabled className="p-1.5 text-slate-400 opacity-30 cursor-not-allowed"><Trash2 className="w-4 h-4" /></button>
                      )}"""
content = content.replace(del_btn_2, new_del_btn_2)

del_btn_3 = """                      <button
                        onClick={() => {
                          if (confirm(`Hapus form ini?`)) {
                            onDeleteChecklist(sub.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>"""
new_del_btn_3 = """                      <AnimatedDeleteButton 
                        label="" 
                        onDelete={() => onDeleteChecklist(sub.id)} 
                        className="!bg-transparent !text-slate-400 hover:!bg-rose-50 hover:!text-rose-600 shadow-none" 
                      />"""
content = content.replace(del_btn_3, new_del_btn_3)

del_btn_4 = """                      <button
                        onClick={() => {
                          if (confirm(`Hapus data ${sub.periodeStr}?`)) {
                            onDeleteChecklist(sub.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>"""
new_del_btn_4 = """                      <AnimatedDeleteButton 
                        label="" 
                        onDelete={() => onDeleteChecklist(sub.id)} 
                        className="!bg-transparent !text-slate-400 hover:!bg-rose-50 hover:!text-rose-600 shadow-none" 
                      />"""
content = content.replace(del_btn_4, new_del_btn_4)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
print("Updated AdminSettings.tsx with AnimatedDeleteButton")
