import re

filepath = 'frontend/src/components/layout/header.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Add import
import_stmt = "import { ThemeToggle } from '@/components/layout/theme-toggle';\n"
if "import { ThemeToggle }" not in content:
    content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\n" + import_stmt)

# Add the toggle button before the notifications bell
insertion_point_1 = "{isAuthenticated && user ? ("
replacement_1 = "<ThemeToggle />\n          {isAuthenticated && user ? ("
content = content.replace(insertion_point_1, replacement_1)

# Add the toggle button before the login button for unauthenticated users
insertion_point_2 = "<div className=\"hidden md:flex items-center gap-2\">"
replacement_2 = "<div className=\"hidden md:flex items-center gap-2\">\n              <ThemeToggle />"
# Only replace the first occurrence (which is the one we want) or be precise
content = re.sub(r'(<div className="hidden md:flex items-center gap-2">\s*<Link href="/auth/login">)', r'<div className="hidden md:flex items-center gap-2">\n              <ThemeToggle />\n              <Link href="/auth/login">', content)


# Also add theme toggle to mobile menu bottom
insertion_point_3 = "<div className=\"flex flex-col gap-2\">"
replacement_3 = "<div className=\"flex items-center justify-between px-3 py-2\">\n                  <span className=\"text-sm font-medium\">Theme</span>\n                  <ThemeToggle />\n                </div>\n                <div className=\"flex flex-col gap-2\">"
content = content.replace(insertion_point_3, replacement_3)


with open(filepath, 'w') as f:
    f.write(content)
