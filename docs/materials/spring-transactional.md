# Материалы: @Transactional

## Статьи

- [Habr — Управление транзакциями в Spring: @Transactional в деталях](https://habr.com/ru/articles/682362/) — proxy, transaction manager, SQL/JPA связь.
- [Habr — Управление транзакциями в Spring: подробно о @Transactional](https://habr.com/ru/companies/spring_aio/articles/911160/) — более свежая версия большого разбора.
- [Habr — Анатомия Spring Proxy](https://habr.com/ru/articles/1051878/) — если хочется понять proxy глубже.

## Видео

- [YouTube: поиск «Spring @Transactional proxy self invocation»](https://www.youtube.com/results?search_query=Spring+Transactional+proxy+self+invocation+Java)
- [YouTube: поиск «Spring Transaction propagation REQUIRED REQUIRES_NEW»](https://www.youtube.com/results?search_query=Spring+transaction+propagation+REQUIRED+REQUIRES_NEW)

## Картинки и схемы

Полезная схема: `caller → proxy → TransactionInterceptor → target service → DB`, плюс отдельная схема self-invocation, где `this.method()` обходит proxy.
