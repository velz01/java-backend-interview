from pathlib import Path
import re
import sys

root = Path('docs')
errors = []

# Check fenced code blocks.
for path in root.rglob('*.md'):
    lines = path.read_text(encoding='utf-8', errors='ignore').splitlines()
    fence = None
    for line_no, line in enumerate(lines, 1):
        match = re.match(r'^\s*(```+|~~~+)', line)
        if not match:
            continue
        marker = match.group(1)[0]
        length = len(match.group(1))
        if fence is None:
            fence = (marker, length, line_no)
        elif fence[0] == marker and length >= fence[1]:
            fence = None
    if fence:
        errors.append(f'{path}: unclosed code fence from line {fence[2]}')

image_pattern = re.compile(r'!\[[^\]]*\]\(([^)]+)\)')
link_pattern = re.compile(r'(?<!!)\[[^\]]+\]\(([^)]+)\)')

for path in root.rglob('*.md'):
    text = path.read_text(encoding='utf-8', errors='ignore')

    # Check local image assets.
    for match in image_pattern.finditer(text):
        target = match.group(1).strip().split()[0].strip('<>')
        target = target.split('#')[0].split('?')[0]
        if not target or target.startswith(('http://', 'https://', 'data:')):
            continue
        candidate = (root / 'public' / target.lstrip('/')) if target.startswith('/') else (path.parent / target)
        if not candidate.exists():
            errors.append(f'{path}: missing image {target}')

    # Check local Markdown/page/file links.
    for match in link_pattern.finditer(text):
        target = match.group(1).strip().split()[0].strip('<>')
        target = target.split('#')[0].split('?')[0]
        if not target or target.startswith(('http://', 'https://', 'mailto:', '#')):
            continue
        if target.startswith('/'):
            rel = target.lstrip('/')
            candidates = [root / rel, root / (rel + '.md'), root / rel / 'index.md']
        else:
            rel = path.parent / target
            candidates = [rel, Path(str(rel) + '.md'), rel / 'index.md']
        if not any(candidate.exists() for candidate in candidates):
            errors.append(f'{path}: missing local link {target}')

# Check sidebar/nav routes in VitePress config.
config_path = root / '.vitepress' / 'config.mts'
config = config_path.read_text(encoding='utf-8')
for target in re.findall(r'link:\s*["\'](/[^"\']+)["\']', config):
    rel = target.lstrip('/')
    candidates = [root / rel, root / (rel.rstrip('/') + '.md'), root / rel / 'index.md']
    if not any(candidate.exists() for candidate in candidates):
        errors.append(f'{config_path}: missing route {target}')

if errors:
    print('Site validation failed:')
    for error in errors:
        print(f'- {error}')
    sys.exit(1)

print('Site validation passed.')
print(f'Markdown files: {len(list(root.rglob("*.md")))}')
