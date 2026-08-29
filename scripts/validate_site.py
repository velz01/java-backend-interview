from pathlib import Path
import re,sys
root=Path('docs'); errors=[]
md=list(root.rglob('*.md'))
for p in md:
    text=p.read_text(encoding='utf-8',errors='strict')
    if 'Кратко:' in text or 'Кратко по сути:' in text: errors.append(f'{p}: forbidden Кратко label remains')
    if '[к оглавлению]' in text.lower(): errors.append(f'{p}: obsolete toc backlink remains')
    if re.search(r'Источник:\s*(?:Таблица|Жуков|enhorse)',text,re.I): errors.append(f'{p}: source label visible')
    inside=False; marker=None; mlen=0
    for i,line in enumerate(text.splitlines(),1):
        fm=re.match(r'^(\s*)(`{3,}|~{3,})(.*)$',line)
        if fm:
            if len(fm.group(1))>=4: errors.append(f'{p}:{i}: code fence indented 4+ spaces')
            token=fm.group(2); ch=token[0]
            if not inside: inside=True; marker=ch; mlen=len(token)
            elif ch==marker and len(token)>=mlen: inside=False; marker=None; mlen=0
            continue
        if inside: continue
        clean=re.sub(r'`[^`]*`','',line)
        # Priority badge is the only intentional HTML tag in learning Markdown.
        clean=re.sub(r'<span class="priority-badge priority-(?:high|medium|low)">[^<]*</span>','',clean)
        if re.search(r'<\?[^>]*>',clean): errors.append(f'{p}:{i}: XML/Vue processing instruction outside code')
        # Flag generic-looking angle tags outside inline/fenced code.
        if re.search(r'<[A-Za-z][A-Za-z0-9_.]*(?:\s+[^>]*)?>',clean): errors.append(f'{p}:{i}: HTML/generic-like token outside code')
        for tag in re.findall(r'<span\b[^>]*>',line):
            attrs=re.findall(r'\s([:\w-]+)\s*=',tag)
            if len(attrs)!=len(set(attrs)): errors.append(f'{p}:{i}: duplicate HTML attribute')
    if inside: errors.append(f'{p}: unclosed code fence')
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
for rel in ['docs/learn/uml.md','docs/learn/html.md','docs/learn/xml.md','docs/learn/css.md']:
    if Path(rel).exists(): errors.append(f'deleted section still exists: {rel}')
config=Path('docs/.vitepress/config.mjs').read_text(encoding='utf-8')
for term in ['/learn/uml','/learn/html','/learn/xml','/learn/css']:
    if term in config: errors.append(f'sidebar contains deleted section: {term}')
for link in re.findall(r"link:\s*['\"](/learn/[^'\"]+)['\"]",config):
    slug=link.split('/learn/',1)[1].strip('/')
    if slug and not (Path('docs/learn')/(slug+'.md')).exists() and not (Path('docs/learn')/slug/'index.md').exists(): errors.append(f'sidebar target missing: {link}')
# question numbering / duplicate exact titles
seen={}; total=0
for p in (root/'learn').glob('*.md'):
    if p.name=='index.md': continue
    qs=re.findall(r'^##\s+(\d+)\.\s+(.+)$',p.read_text(encoding='utf8'),re.M)
    if qs:
        nums=[int(n) for n,_ in qs]
        if nums!=list(range(1,len(nums)+1)): errors.append(f'{p}: question numbering is not sequential')
    for _,q in qs:
        total+=1; nq=re.sub(r'[`_*#]','',q).strip().casefold().rstrip('?.:')
        if nq in seen: errors.append(f'duplicate exact question: {q} ({seen[nq]} and {p})')
        else: seen[nq]=p

# Final product requirements
home=(root/'index.md').read_text(encoding='utf-8')
for forbidden in ['Единая программа','Удобный код']:
    if forbidden in home: errors.append(f'docs/index.md: obsolete homepage card remains: {forbidden}')
for d in ['html','uml','xml','css']:
    if (root/'learn'/f'{d}.md').exists(): errors.append(f'forbidden section remains: {d}')
all_text='\n'.join(p.read_text(encoding='utf-8',errors='ignore') for p in md)
if re.search(r'\*\*Видео:\*\*[^\n]*собеседован',all_text,re.I): errors.append('generic interview video remains in study materials')
if 'https://habr.com/ru/company/itelma/blog/546372/' in all_text: errors.append('obsolete Habr URL remains')

if errors:
    print('VALIDATION FAILED')
    for e in errors: print('-',e)
    sys.exit(1)
print('VALIDATION PASS')
print('markdown_files',len(md))
print('questions',total)
