from pathlib import Path
import re, sys
root=Path('docs'); errors=[]
for path in root.rglob('*.md'):
    text=path.read_text(encoding='utf-8',errors='ignore'); lines=text.splitlines(); fence=None
    for no,line in enumerate(lines,1):
        m=re.match(r'^\s*(```+|~~~+)',line)
        if not m: continue
        marker=m.group(1)[0]; ln=len(m.group(1))
        if fence is None: fence=(marker,ln,no)
        elif fence[0]==marker and ln>=fence[1]: fence=None
    if fence: errors.append(f'{path}: unclosed code fence from line {fence[2]}')
    for m in re.finditer(r'!\[[^\]]*\]\(([^)]+)\)',text):
        target=m.group(1).strip().split()[0].strip('<>').split('#')[0].split('?')[0]
        if not target or target.startswith(('http://','https://','data:')): continue
        cand=(root/'public'/target.lstrip('/')) if target.startswith('/') else path.parent/target
        if not cand.exists(): errors.append(f'{path}: missing image {target}')
    for m in re.finditer(r'(?<!!)\[[^\]]+\]\(([^)]+)\)',text):
        target=m.group(1).strip().split()[0].strip('<>').split('#')[0].split('?')[0]
        if not target or target.startswith(('http://','https://','mailto:','#')): continue
        if target.startswith('/'):
            rel=target.lstrip('/'); cs=[root/rel,root/(rel+'.md'),root/rel/'index.md']
        else:
            rel=path.parent/target; cs=[rel,Path(str(rel)+'.md'),rel/'index.md']
        if not any(x.exists() for x in cs): errors.append(f'{path}: missing local link {target}')
config=root/'.vitepress'/'config.mts'; ct=config.read_text(encoding='utf-8')
for target in re.findall(r'link:\s*["\'](/[^"\']+)["\']',ct):
    rel=target.lstrip('/'); cs=[root/rel,root/(rel.rstrip('/')+'.md'),root/rel/'index.md']
    if not any(x.exists() for x in cs): errors.append(f'{config}: missing route {target}')
# VitePress treats localhost URLs as dead links unless ignored. Require the safeguard if examples exist.
local_examples=[]
for path in root.rglob('*.md'):
    for m in re.finditer(r'https?://(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(?:/[^\s<)]*)?',path.read_text(encoding='utf-8',errors='ignore')):
        local_examples.append((path,m.group(0)))
if local_examples and 'ignoreDeadLinks' not in ct: errors.append('localhost examples exist but ignoreDeadLinks is not configured')
if errors:
    print('Site validation failed:'); [print('- '+e) for e in errors]; sys.exit(1)
print('Site validation passed.')
print('Markdown files:',len(list(root.rglob('*.md'))))
print('Localhost example URLs ignored by config:',len(local_examples))
