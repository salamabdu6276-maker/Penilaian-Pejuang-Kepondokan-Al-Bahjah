import re

with open('src/components/Login.tsx', 'r') as f:
    content = f.read()

# Replace the old exit animation with a drastic scale up
target_exit = """            exit={{ 
              opacity: 0, 
              scale: 1.5, 
              filter: "blur(10px)",
              transition: { duration: 0.8, ease: "easeInOut" } 
            }}"""
new_exit = """            exit={{ 
              opacity: 0, 
              scale: [1, 0.9, 15], 
              filter: ["blur(0px)", "blur(0px)", "blur(20px)"],
              transition: { duration: 1.2, ease: "easeInOut", times: [0, 0.3, 1] } 
            }}"""

content = content.replace(target_exit, new_exit)

# Also fix the success animation timing
# Before: setTimeout(() => onLogin("admin"), 800);
# Let's make it wait 1200ms to allow the exit animation to finish
content = content.replace('setTimeout(() => onLogin("admin"), 800);', 'setTimeout(() => onLogin("admin"), 1200);')
content = content.replace('setTimeout(() => onLogin("user"), 800);', 'setTimeout(() => onLogin("user"), 1200);')

# Also, when isSuccess is true, the green circle animation should be the thing that expands massively!
# Actually, the user said "seluruh kotak login akan mengecil sedikit lalu membesar secara drastis"
# So the green circle isn't needed, or maybe it should be part of the box.
# Let's just remove the green circle AnimatePresence and rely on the box's exit animation!
target_green = """      <AnimatePresence>
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
      </AnimatePresence>"""
content = content.replace(target_green, '')

with open('src/components/Login.tsx', 'w') as f:
    f.write(content)
