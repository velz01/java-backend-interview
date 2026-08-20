# Build validation

Final static validation performed before packaging:

- `python3 scripts/clean_legacy.py` — PASS
- `python3 scripts/validate_site.py` — PASS
- `node --check docs/.vitepress/config.mjs` — PASS
- 29 Markdown files
- 1353 audited questions
- 0 HTML-source questions in the learning site
- 0 normalized duplicate questions
- local pages/assets/sidebar references validated by `validate_site.py`
- Vue-dangerous HTML-like constructs and malformed code fences validated by `validate_site.py`

The GitHub Actions workflow uses Node.js 24, installs VitePress 1.6.4 without npm cache dependency, validates the site before building, and then runs `npm run docs:build`.

A full local VitePress build could not be executed in the artifact environment because access to registry.npmjs.org returned `EAI_AGAIN`. This is an environment network limitation, not a reported project validation failure.
