# Build validation

Final validation for the cleaned site:

- `python3 scripts/validate_site.py` — PASS
- `node --check docs/.vitepress/config.mjs` — PASS
- Markdown files — 28
- Learning questions — 1238
- Deleted HTML/UML/XML/CSS sections — absent
- Visible source labels — 0
- `Кратко:` / `Кратко по сути:` — 0
- `К оглавлению` links — 0
- Normalized duplicate questions — 0 (validator)
- Missing local links/assets — 0 (validator)
- Unclosed or malformed code fences — 0
- Four-backtick leakage (` ```` `) — 0
- Raw Vue/XML-like `<Type>` / `<?>` tokens outside code — 0
- Raw HTML layout wrappers in learning pages — 0
- Sidebar links to missing pages — 0
- Added Habr materials were opened and verified during final review; the Java interview YouTube video and PostgreSQL optimization video were found via current web search.

The container cannot reach the npm registry reliably, so `npm install` times out here and a local VitePress binary cannot be installed. The GitHub Actions workflow performs the same static validation before `vitepress build`.
