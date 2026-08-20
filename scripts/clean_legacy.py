from pathlib import Path
root=Path('docs')
allowed={x.strip() for x in Path('site_manifest.txt').read_text(encoding='utf-8').splitlines() if x.strip()}
removed=[]
for p in sorted((x for x in root.rglob('*') if x.is_file()), key=lambda x:len(x.parts), reverse=True):
    if p.as_posix() not in allowed:
        p.unlink(); removed.append(p.as_posix())
for d in sorted((x for x in root.rglob('*') if x.is_dir()), key=lambda x:len(x.parts), reverse=True):
    try:d.rmdir()
    except OSError:pass
print('Removed legacy files:',len(removed))
for x in removed[:50]: print('-',x)
