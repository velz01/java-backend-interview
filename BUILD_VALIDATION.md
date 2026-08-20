# Build validation

Final static validation after fixing the Vue/XML wildcard issue:

- `python scripts/validate_site.py` — PASS
- Markdown files — 29
- Audited questions — 1353
- HTML-source questions — 0
- Normalized duplicate questions — 0
- Missing local links/assets — 0 (checked by validator)
- Unclosed code fences — 0 (checked by validator)
- Vue/XML-like angle-bracket tokens outside fenced/inline code — 0
- `node --check docs/.vitepress/config.mjs` — PASS

`validate_site.py` now explicitly rejects `<?` outside code spans/blocks, in addition to generic HTML-like tags, so raw Java wildcard forms such as `<?>` cannot reach the Vue compiler unescaped.

A full local VitePress build could not be executed in this environment because `npm install` cannot reach the npm registry and times out. GitHub Actions should perform the actual VitePress build after validation.
