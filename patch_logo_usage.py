import re

def patch_file(filepath, add_import, find_hook_anchor, add_hook, find_src, replace_src):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'useAppLogo' not in content:
        # Add import
        import_match = re.search(r"import .*?;", content)
        if import_match:
            content = content.replace(import_match.group(0), import_match.group(0) + '\n' + add_import)
            
        # Add hook
        content = content.replace(find_hook_anchor, find_hook_anchor + '\n' + add_hook)
        
        # Replace src
        content = content.replace(find_src, replace_src)
        
        with open(filepath, 'w') as f:
            f.write(content)

# Header
patch_file(
    'src/components/Header.tsx',
    "import { useAppLogo } from '../hooks/useAppLogo';",
    "export const Header: React.FC<HeaderProps> = ({ role, userName, onLogout, userAmanah, userSubDivisi, activeView, setActiveView, setRole }) => {",
    "  const appLogo = useAppLogo();",
    'src="/logo.png"',
    'src={appLogo}'
)

# CertificateModal
patch_file(
    'src/components/CertificateModal.tsx',
    "import { useAppLogo } from '../hooks/useAppLogo';",
    "export default function CertificateModal({ isOpen, onClose, pejuangName, divisi, bulan, tahun, performa }: CertificateModalProps) {",
    "  const appLogo = useAppLogo();",
    'src="/logo.png"',
    'src={appLogo}'
)

# ReportsView
patch_file(
    'src/components/ReportsView.tsx',
    "import { useAppLogo } from '../hooks/useAppLogo';",
    "export const ReportsView: React.FC<ReportsViewProps> = ({",
    "  const appLogo = useAppLogo();",
    'src="/logo.png"',
    'src={appLogo}'
)

