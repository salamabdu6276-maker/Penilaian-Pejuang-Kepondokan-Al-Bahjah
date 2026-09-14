import React, { useState } from "react";
import { Building2, Lock, User, LogIn } from "lucide-react";
import { AdminUser, Role } from "../types";

interface LoginProps {
  onLogin: (role: Role) => void;
  adminList: AdminUser[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, adminList }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for hardcoded Admin Utama
    if (username === "Abdu Salam" && password === "Abdu2605") {
      onLogin("admin");
      return;
    }

    // Check dynamic admins
    const matchedAdmin = adminList.find(a => a.username === username && a.password === password);
    if (matchedAdmin) {
      onLogin("admin");
      return;
    }
    
    // Default guest check for user/pejuang login? (Normally pejuang shouldn't need a password for now as per instructions, or maybe they just login as 'user' without password?)
    if (username === "user" && password === "user") {
        onLogin("user");
        return;
    }

    setError("Username atau password salah.");
  };

  return (
    <div className="py-12 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-600 p-4 rounded-xl shadow-inner border border-emerald-400/30">
            <Building2 className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Pondok Pesantren Al-Bahjah</h2>
        <p className="text-center text-sm text-slate-500 mb-8">Login Sistem Penilaian Pejuang Kepondokan</p>
        
        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-semibold mb-4 text-center border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Login sebagai Pejuang? (username: user, password: user)</p>
        </div>
      </div>
    </div>
  );
};
