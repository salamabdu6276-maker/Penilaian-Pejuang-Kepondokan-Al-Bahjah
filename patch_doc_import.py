import re
with open('src/components/DocumentUploadView.tsx', 'r') as f:
    content = f.read()

content = content.replace('import React, { useState, useEffect, useRef } from "react";', 'import React, { useState, useEffect, useRef } from "react";\\nimport { motion, AnimatePresence } from "motion/react";')

with open('src/components/DocumentUploadView.tsx', 'w') as f:
    f.write(content)
