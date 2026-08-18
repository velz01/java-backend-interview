# Материалы: Kafka delivery semantics

## Статьи

- [Habr — Глубокое погружение в архитектуру Kafka](https://habr.com/ru/articles/972788/) — commit offsets, consumer group coordination и delivery mechanics.
- [Habr: поиск «Kafka exactly once idempotent consumer»](https://habr.com/ru/search/?q=Kafka%20exactly%20once%20idempotent&target_type=posts)

## Видео

- [YouTube: поиск «Kafka at least once exactly once idempotent consumer»](https://www.youtube.com/results?search_query=Kafka+at+least+once+exactly+once+idempotent+consumer+русский)

## Схемы

Нарисуй timeline: `read → DB side effect → crash → offset not committed → redelivery`. Это лучший способ объяснить, почему at-least-once требует idempotency.
