import re
with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

content = content.replace('import React, { useState } from "react";', 'import React, { useState } from "react";\\nimport { AnimatedDeleteButton } from "./AnimatedDeleteButton";')

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
