import re
with open('src/components/AnimatedDeleteButton.tsx', 'r') as f:
    content = f.read()

target = """           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <motion.path 
               d="M3 6h18" 
               animate={isDeleting ? { y: -3, rotate: -15, originX: 0, originY: "100%" } : { y: 0, rotate: 0 }}
               transition={{ duration: 0.2, repeat: 1, repeatType: "reverse", delay: 0.2 }}
             />
             <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
             <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
           </svg>"""

new = """           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <motion.g
               animate={isDeleting ? { y: -4, rotate: -20, x: -2 } : { y: 0, rotate: 0, x: 0 }}
               transition={{ duration: 0.3, repeat: 1, repeatType: "reverse", delay: 0.1 }}
               style={{ transformOrigin: 'left center' }}
             >
               <path d="M3 6h18" />
               <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
             </motion.g>
             <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
           </svg>"""

content = content.replace(target, new)
with open('src/components/AnimatedDeleteButton.tsx', 'w') as f:
    f.write(content)
