import React, { useState } from "react";
import { Building2, Lock, User, LogIn, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminUser, Role } from "../types";
import { useAppLogo } from "../hooks/useAppLogo";

interface LoginProps {
  onLogin: (role: Role) => void;
  adminList: AdminUser[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, adminList }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageError, setImageError] = useState(false);
  const appLogo = useAppLogo();

  React.useEffect(() => {
    setImageError(false);
  }, [appLogo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsAuthenticating(true);

    setTimeout(() => {
        // Check for hardcoded Admin Utama
        if (username === "Abdu Salam" && password === "Abdu2605") {
          setIsAuthenticating(false);
          setIsSuccess(true);
          setTimeout(() => onLogin("admin"), 850);
          return;
        }

    // Check dynamic admins
    const matchedAdmin = adminList.find(a => a.username === username && a.password === password);
    if (matchedAdmin) {
      setIsAuthenticating(false);
      setIsSuccess(true);
      setTimeout(() => onLogin("admin"), 850);
      return;
    }
    
    // Default guest check for user/pejuang login? (Normally pejuang shouldn't need a password for now as per instructions, or maybe they just login as 'user' without password?)
    if (username === "user" && password === "user") {
        setIsAuthenticating(false);
        setIsSuccess(true);
        setTimeout(() => onLogin("user"), 850);
        return;
    }

    setIsAuthenticating(false);
    setError("Username atau password salah.");
    }, 800); // Fake network delay for animation effect
  };

  return (
    <div className="py-10 flex items-center justify-center px-4 overflow-hidden perspective-1000">
      <AnimatePresence>
        {!isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ 
              opacity: [1, 1, 0], 
              scale: [1, 0.96, 1.2], 
              filter: ["blur(0px)", "blur(0px)", "blur(12px)"],
              transition: { duration: 0.85, ease: [0.32, 0.72, 0, 1], times: [0, 0.2, 1] } 
            }}
            className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-8 sm:p-9 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-700/80 w-full max-w-md relative z-10 transition-colors duration-200"
          >
            {/* Logo Lembaga from Admin Data Management */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-700/80 p-2.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-600/70 flex items-center justify-center transition-transform hover:scale-105">
                {!imageError && appLogo ? (
                  <img
                    key={appLogo}
                    src={appLogo}
                    alt="Logo Pondok Pesantren Al-Bahjah"
                    className="w-full h-full object-contain drop-shadow-xs"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="bg-emerald-600 p-3.5 rounded-xl text-white">
                    <Building2 className="w-10 h-10" />
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100 mb-1.5 tracking-tight">
              Pondok Pesantren Al-Bahjah
            </h2>
            <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-7">
              Login Sistem Penilaian Pejuang Kepondokan
            </p>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 p-3 rounded-xl text-xs font-semibold mb-5 text-center border border-rose-200 dark:border-rose-800/60 flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 dark:text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 dark:text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-11 pr-11 py-2.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                    title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 text-sm cursor-pointer"
                >
                  {isAuthenticating ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login ke Sistem</span>
                    </motion.div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3.5 space-y-1">
              <p>
                Login sebagai Pejuang? (<span className="text-slate-600 dark:text-slate-300">username:</span>{" "}
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">user</span>,{" "}
                <span className="text-slate-600 dark:text-slate-300">password:</span>{" "}
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">user</span>)
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-400">
                Atau login pengurus/admin dengan kredensial yang terdaftar di Manajemen Data
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
