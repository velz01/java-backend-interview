"""Remove only known obsolete pages, without deleting newly added study pages.

Avoid an allowlist of page names here: Live Coding, Code Review, and future
sections must survive the GitHub Actions cleanup step before validation.
"""
from pathlib import Path
import shutil

removed = []
learn_dir = Path("docs/learn")

for slug in ("html", "uml", "xml", "css"):
    page = learn_dir / f"{slug}.md"
    if page.is_file():
        page.unlink()
        removed.append(str(page))

for slug in ("html", "uml", "xml", "css", "zhukov", "enhorse", "table", "concurrency"):
    directory = Path("docs") / slug
    if directory.is_dir():
        shutil.rmtree(directory)
        removed.append(str(directory))

print("Removed legacy files:", len(removed))
for name in removed:
    print("-", name)
