# Материалы: Hibernate fetching и N+1

## Статьи

- [Habr — Backend Java собеседование, часть 2](https://habr.com/ru/articles/529214/) — N+1, LazyInitializationException и способы решения.
- [Habr: поиск «Hibernate N+1»](https://habr.com/ru/search/?q=Hibernate%20N%2B1&target_type=posts) — дополнительные практические кейсы.
- [JavaRush: поиск по Hibernate N+1](https://javarush.com/search?query=Hibernate%20N%2B1) — русскоязычные разборы, если доступны без подписки.

## Видео

- [YouTube: поиск «Hibernate N+1 fetch join EntityGraph»](https://www.youtube.com/results?search_query=Hibernate+N%2B1+fetch+join+EntityGraph+русский)

## Схемы

Нарисуй: `1 query users + N queries orders` и рядом правильный вариант с контролируемой загрузкой нужного graph.
