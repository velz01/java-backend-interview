# Java Backend Interview Prep

VitePress-сайт с базой подготовки к Java Backend собеседованиям.

## Локальный запуск

```bash
npm install
npm run docs:dev
```

## Проверка production build

```bash
npm run docs:build
npm run docs:preview
```

## GitHub Pages

В репозитории уже есть `.github/workflows/deploy.yml`. После push в `main`:

1. GitHub → Settings → Pages.
2. Build and deployment → Source: **GitHub Actions**.
3. Открыть Actions и дождаться workflow `Deploy VitePress to GitHub Pages`.
4. Ссылка появится в Settings → Pages.

Workflow передаёт `BASE_PATH=/<repository-name>/`, поэтому project Pages работает по адресу `https://USERNAME.github.io/REPOSITORY/`.

Для custom domain добавьте домен в Settings → Pages → Custom domain и настройте DNS у регистратора.
