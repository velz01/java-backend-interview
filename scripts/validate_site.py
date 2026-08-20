from pathlib import Path
import re,sys,csv
root=Path('docs'); errors=[]
md=list(root.rglob('*.md'))
for p in md:
    text=p.read_text(encoding='utf-8',errors='strict')
    if text.count('```')%2: errors.append(f'{p}: unclosed ``` fence')
    if text.count('~~~')%2: errors.append(f'{p}: unclosed ~~~ fence')
    if '[к оглавлению]' in text.lower(): errors.append(f'{p}: obsolete toc backlink remains')
    if re.search(r'\*\*Источник:\*\*|Источник:\s*(?:Таблица|Жуков|enhorse)',text,re.I): errors.append(f'{p}: source label visible')
    for i,line in enumerate(text.splitlines(),1):
        if re.match(r'^ {4,}(?:```|~~~)',line): errors.append(f'{p}:{i}: code fence indented 4+ spaces')
    for m in re.finditer(r'!\[[^\]]*\]\(([^)]+)\)',text):
        t=m.group(1).strip().split()[0].strip('<>').split('#')[0].split('?')[0]
        if not t or t.startswith(('http://','https://','data:')): continue
        cand=root/'public'/t.lstrip('/') if t.startswith('/') else p.parent/t
        if not cand.exists(): errors.append(f'{p}: missing image {t}')
    for m in re.finditer(r'(?<!!)\[[^\]]+\]\(([^)]+)\)',text):
        t=m.group(1).strip().split()[0].strip('<>').split('#')[0].split('?')[0]
        if not t or t.startswith(('http://','https://','mailto:','#')): continue
        if t.startswith('/'):
            rel=t.lstrip('/'); cs=[root/rel,root/(rel+'.md'),root/rel/'index.md']
        else:
            rel=p.parent/t; cs=[rel,Path(str(rel)+'.md'),rel/'index.md']
        if not any(x.exists() for x in cs): errors.append(f'{p}: missing local link {t}')
    inside=False; fence=None
    for i,line in enumerate(text.splitlines(),1):
        fm=re.match(r'^\s{0,3}(```+|~~~+)',line)
        if fm:
            ch=fm.group(1)[0]
            if not inside: inside=True; fence=ch
            elif ch==fence: inside=False; fence=None
            continue
        if inside: continue
        clean=re.sub(r'`[^`]*`','',line)
        clean=re.sub(r'</?(?:span|div)(?:\s+[^>]*)?>','',clean)
        if re.search(r'<\/?[A-Za-z][^>\n]*>',clean): errors.append(f'{p}:{i}: HTML-like tag outside code block')
        if '<?' in clean: errors.append(f'{p}:{i}: XML processing-instruction-like token outside code block')
        for tag in re.findall(r'<(?:div|span)\b[^>]*>',line):
            attrs=re.findall(r'\s([:\w-]+)\s*=',tag)
            if len(attrs)!=len(set(attrs)): errors.append(f'{p}:{i}: duplicate HTML attribute')
with open('SOURCE_AUDIT.csv',encoding='utf-8-sig',newline='') as f: rows=list(csv.DictReader(f))
headings=sum(len(re.findall(r'^##\s+\d+\.\s+',p.read_text(encoding='utf-8'),re.M)) for p in (root/'learn').glob('*.md'))
if not rows: errors.append('audit empty')
if headings != len(rows): errors.append(f'audit mismatch: headings={headings}, audit={len(rows)}')
seen={}
for r in rows:
    q=re.sub(r'[`_*#]','',r['question']).strip().casefold().rstrip('?.:')
    if q in seen: errors.append(f'duplicate question: {r["question"]} ({seen[q]} and {r["page"]})')
    else: seen[q]=r['page']
    if r.get('source_ref')=='html.md': errors.append(f'HTML question remains: {r["question"]}')
    if r.get('chosen_source') not in {'zhukov','enhorse','table'}: errors.append(f'unknown source: {r.get("chosen_source")}')
for rel in ['docs/learn/java8.md','docs/learn/functional.md','docs/learn/stream-api.md','docs/.vitepress/config.mjs']:
    if not Path(rel).exists(): errors.append(f'missing required file {rel}')
manifest=set(x.strip() for x in Path('site_manifest.txt').read_text(encoding='utf-8').splitlines() if x.strip())
for p in root.rglob('*'):
    if p.is_file() and p.as_posix() not in manifest: errors.append(f'manifest missing {p.as_posix()}')
if errors:
    print('VALIDATION FAILED')
    for e in errors: print('-',e)
    sys.exit(1)
print('VALIDATION PASS')
print('markdown_files',len(md))
print('audited_questions',len(rows))
print('html_source_questions',0)
print('duplicate_questions',0)
