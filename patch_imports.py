import re

with open('src/components/AdminSettings.tsx', 'r') as f:
    content = f.read()

target = """  Download
} from "lucide-react";"""

replacement = """  Download,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";"""

content = content.replace(target, replacement)

with open('src/components/AdminSettings.tsx', 'w') as f:
    f.write(content)
