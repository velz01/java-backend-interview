# Java Backend Interview

VitePress-сайт с большой базой вопросов и ответов для подготовки к Java Backend собеседованиям.

## Локальный запуск

```bash
npm install
npm run docs:dev
```

## Сборка

```bash
npm run docs:build
```

## GitHub Pages

Workflow `.github/workflows/deploy.yml` автоматически собирает VitePress и публикует сайт через GitHub Pages после push в `main`. В настройках репозитория нужно выбрать **Settings → Pages → Source → GitHub Actions**.

Контент находится в `docs/`. Для редактирования существующего раздела достаточно изменить соответствующий `.md` файл и сделать commit/push.
