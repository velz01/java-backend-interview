# Материалы: Spring

## Статьи

- [Spring @Transactional: устройство и типичные ловушки (Habr)](https://habr.com/ru/articles/682362/)
- [Транзакции Spring: proxy, propagation и rollback (Habr)](https://habr.com/ru/companies/spring_aio/articles/911160/)

## Видео

- [Spring Framework — большой разбор базы, около 3 часов (YouTube, русский)](https://www.youtube.com/watch?v=hp5H-ZDMTJk)
- [Мок-собеседование Java Middle — Spring и Backend (YouTube, русский)](https://www.youtube.com/watch?v=2sEQ8Mt9LxM)

## Картинки и схемы

Для `@Transactional` полезно держать схему: `caller → Spring proxy → transaction interceptor → target method`. Она сразу объясняет проблему self-invocation.
