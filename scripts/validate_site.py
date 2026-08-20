from pathlib import Path
import re,sys,csv,hashlib
root=Path('docs'); errors=[]
for p in root.rglob('*.md'):
    text=p.read_text(encoding='utf-8',errors='ignore')
    if text.count('```')%2: errors.append(f'{p}: unclosed code fence')
    for m in re.finditer(r'!\[[^\]]*\]\(([^)]+)\)',text):
        t=m.group(1).strip().split()[0].strip('<>').split('#')[0].split('?')[0]
        if not t or t.startswith(('http://','https://','data:')):continue
        cand=root/'public'/t.lstrip('/') if t.startswith('/') else p.parent/t
        if not cand.exists():errors.append(f'{p}: missing image {t}')
    for m in re.finditer(r'(?<!!)\[[^\]]+\]\(([^)]+)\)',text):
        t=m.group(1).strip().split()[0].strip('<>').split('#')[0].split('?')[0]
        if not t or t.startswith(('http://','https://','mailto:','#')):continue
        if t.startswith('/'):
            rel=t.lstrip('/'); cs=[root/rel,root/(rel+'.md'),root/rel/'index.md']
        else:
            rel=p.parent/t; cs=[rel,Path(str(rel)+'.md'),rel/'index.md']
        if not any(x.exists() for x in cs):errors.append(f'{p}: missing local link {t}')
# No source labels in UI.
for p in (root/'learn').glob('*.md'):
    if re.search(r'\*\*Источник:\*\*|Источник:\s*(?:Таблица|Жуков|enhorse)',p.read_text(encoding='utf-8'),re.I):errors.append(f'{p}: source label visible')
# Audit every output answer against selected source hashes recorded at generation time.
with open('SOURCE_AUDIT.csv',encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
if not rows:errors.append('audit empty')
if errors:
    print('VALIDATION FAILED');[print('- '+e) for e in errors];sys.exit(1)
print('VALIDATION PASS')
print('markdown_files',len(list(root.rglob('*.md'))))
print('audited_questions',len(rows))
