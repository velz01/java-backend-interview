# Java Backend Interview

VitePress-сайт для подготовки к Java Backend собеседованиям.

## Запуск локально

```bash
npm install
npm run docs:dev
```

## Проверка и сборка

```bash
python3 scripts/clean_legacy.py
python3 scripts/validate_site.py
npm run docs:build
```

GitHub Actions автоматически выполняет эти шаги и публикует `docs/.vitepress/dist` в GitHub Pages.
