import re

with open('src/components/Login.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import { Building2, Lock, User, LogIn } from "lucide-react";',
    'import { Building2, Lock, User, LogIn, Loader2 } from "lucide-react";\nimport { motion, AnimatePresence } from "motion/react";'
)

state_target = """export const Login: React.FC<LoginProps> = ({ onLogin, adminList }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");"""

state_new = """export const Login: React.FC<LoginProps> = ({ onLogin, adminList }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);"""

content = content.replace(state_target, state_new)

submit_target = """  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for hardcoded Admin Utama
    if (username === "Abdu Salam" && password === "Abdu2605") {
      onLogin("admin");
      return;
    }"""

submit_new = """  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsAuthenticating(true);

    setTimeout(() => {
        // Check for hardcoded Admin Utama
        if (username === "Abdu Salam" && password === "Abdu2605") {
          setIsAuthenticating(false);
          setIsSuccess(true);
          setTimeout(() => onLogin("admin"), 800);
          return;
        }"""

content = content.replace(submit_target, submit_new)

submit_cont_target = """    // Check dynamic admins
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
  };"""

submit_cont_new = """    // Check dynamic admins
    const matchedAdmin = adminList.find(a => a.username === username && a.password === password);
    if (matchedAdmin) {
      setIsAuthenticating(false);
      setIsSuccess(true);
      setTimeout(() => onLogin("admin"), 800);
      return;
    }
    
    // Default guest check for user/pejuang login? (Normally pejuang shouldn't need a password for now as per instructions, or maybe they just login as 'user' without password?)
    if (username === "user" && password === "user") {
        setIsAuthenticating(false);
        setIsSuccess(true);
        setTimeout(() => onLogin("user"), 800);
        return;
    }

    setIsAuthenticating(false);
    setError("Username atau password salah.");
    }, 1200); // Fake network delay for animation effect
  };"""

content = content.replace(submit_cont_target, submit_cont_new)

render_target = """  return (
    <div className="py-12 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">"""

render_new = """  return (
    <div className="py-12 flex items-center justify-center px-4 overflow-hidden perspective-1000">
      <AnimatePresence>
        {!isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 1.5, 
              filter: "blur(10px)",
              transition: { duration: 0.8, ease: "easeInOut" } 
            }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md relative z-10"
          >"""

content = content.replace(render_target, render_new)

btn_target = """          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </button>"""

btn_new = """          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md relative overflow-hidden"
          >
            {isAuthenticating ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memverifikasi...</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </motion.div>
            )}
          </button>"""

content = content.replace(btn_target, btn_new)

closing_target = """        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Login sebagai Pejuang? (username: user, password: user)</p>
        </div>
      </div>
    </div>
  );
};"""

closing_new = """        <div className="mt-6 text-center text-xs text-slate-400">
          <p>Login sebagai Pejuang? (username: user, password: user)</p>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50"
            >
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};"""

content = content.replace(closing_target, closing_new)

with open('src/components/Login.tsx', 'w') as f:
    f.write(content)
