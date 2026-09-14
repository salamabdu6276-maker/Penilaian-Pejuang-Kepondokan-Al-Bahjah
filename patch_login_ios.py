import re

with open('src/components/Login.tsx', 'r') as f:
    content = f.read()

# Make the exit animation much smoother "iOS 27 style"
target_exit = """            exit={{ 
              opacity: 0, 
              scale: [1, 0.9, 15], 
              filter: ["blur(0px)", "blur(0px)", "blur(20px)"],
              transition: { duration: 1.2, ease: "easeInOut", times: [0, 0.3, 1] } 
            }}"""
new_exit = """            exit={{ 
              opacity: [1, 1, 0], 
              scale: [1, 0.96, 1.2], 
              filter: ["blur(0px)", "blur(0px)", "blur(12px)"],
              transition: { duration: 0.85, ease: [0.32, 0.72, 0, 1], times: [0, 0.2, 1] } 
            }}"""

content = content.replace(target_exit, new_exit)

# Also adjust the timeouts in the login logic to match the new duration
content = content.replace('setTimeout(() => onLogin("admin"), 1200);', 'setTimeout(() => onLogin("admin"), 850);')
content = content.replace('setTimeout(() => onLogin("user"), 1200);', 'setTimeout(() => onLogin("user"), 850);')

# Also, the fake network delay can be slightly faster to feel more premium and responsive
content = content.replace('}, 1200); // Fake network delay for animation effect', '}, 800); // Fake network delay for animation effect')

with open('src/components/Login.tsx', 'w') as f:
    f.write(content)
