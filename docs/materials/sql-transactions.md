# Материалы: SQL transactions

## Статьи

- [Habr — Транзакции в базах данных на примере PostgreSQL](https://habr.com/ru/articles/860982/) — практический разбор.
- [Habr — Уровни изоляции транзакций с примерами PostgreSQL](https://habr.com/ru/articles/317884/) — классическая визуализация аномалий.
- [Habr — PostgreSQL 16. Изоляция транзакций](https://habr.com/ru/articles/815323/) — MVCC и специфика PostgreSQL.
- [Habr — Шпаргалка по SQL/PostgreSQL для собеседований](https://habr.com/ru/articles/745948/) — транзакции, locks, indexes, planner.

## Видео

- [YouTube: поиск «PostgreSQL MVCC isolation levels»](https://www.youtube.com/results?search_query=PostgreSQL+MVCC+isolation+levels+русский)

## Схемы

Полезно самостоятельно нарисовать две параллельные транзакции T1/T2 и показать dirty read, non-repeatable read и lost update.
