from pathlib import Path

root = Path('docs')
manifest = Path('site_manifest.txt')
allowed = {line.strip() for line in manifest.read_text(encoding='utf-8').splitlines() if line.strip()}
removed = []
for path in sorted((p for p in root.rglob('*') if p.is_file()), reverse=True):
    rel = path.as_posix()
    if rel not in allowed:
        path.unlink()
        removed.append(rel)
for directory in sorted((p for p in root.rglob('*') if p.is_dir()), key=lambda p: len(p.parts), reverse=True):
    try:
        directory.rmdir()
    except OSError:
        pass
print(f'Removed legacy files: {len(removed)}')
for item in removed[:50]:
    print(f'- {item}')
