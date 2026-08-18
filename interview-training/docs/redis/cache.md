# Redis и Cache-Aside

::: tip Приоритет
🟡 **Часто спрашивают, если Redis указан в стеке.**
:::

## Что такое Redis?

In-memory data store с набором структур данных и persistence/replication capabilities. Часто используется как cache, distributed coordination store, rate limiter, counters, ephemeral state.

## Почему Redis быстрый?

Основной working set в memory, эффективные data structures и event-loop based processing многих commands. Но network, serialization, big keys и blocking commands всё равно могут стать bottleneck.

## Cache-Aside

1. Application читает cache.
2. Miss → читает DB.
3. Кладёт result в cache.
4. Возвращает client.

При write обычно сначала обновляют source of truth, затем invalidation/update cache согласно выбранной strategy.

## Cache hit / miss

Hit — value найдено в cache. Miss — нужно идти к source.

## TTL

Время жизни key. Помогает ограничить stale data и memory, но expiration policy должна соответствовать business freshness.

## Cache stampede

Популярный key истёк, множество requests одновременно пошли в DB и пытаются восстановить cache.

### Решения
Lock/single-flight, probabilistic early refresh, background refresh, jitter TTL.

## Cache penetration

Requests постоянно спрашивают несуществующие keys и обходят cache в DB.

### Решения
Cache negative result коротким TTL, validation, Bloom filter в некоторых use cases.

## Cache avalanche

Много keys истекают одновременно → burst load на DB. Помогает TTL jitter и staged refresh.

## Stale cache

DB уже обновлена, cache ещё старый. Cache-aside не даёт сильной consistency автоматически.

## Update cache vs invalidate cache

Invalidation проще: после DB write удалить key, следующий read загрузит новый. Update уменьшает miss, но сложнее согласовать порядок и concurrent writes.

## Почему «сначала удалить cache, потом DB update» опасно?

Между delete и DB commit другой request может прочитать старую DB и заново положить stale value.

## Data structures Redis

String, Hash, List, Set, Sorted Set, Streams, HyperLogLog, bitmaps и др. На interview важно знать, зачем выбирать структуру, а не перечислить команды.

## SET NX

Set if not exists. Может быть частью простого lock, но production distributed lock требует TTL/token-safe release и понимания failure semantics.

## Redis distributed lock — что важно?

Lock должен иметь уникальный owner token и expiration, release должен удалить lock только если token совпадает. Нужно понимать, что distributed locking сложнее одной команды и зависит от требуемых guarantees.

## Eviction

Когда memory limit достигнут, Redis может удалять keys по configured policy: LRU/LFU-like, TTL based, noeviction и др.

## Big key

Очень большой value/collection может создавать latency spikes при network transfer, deletion/serialization и блокировать event loop на тяжёлых operations.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Redis и Cache-Aside»](/materials/redis-cache)

## Углубление для собеседования

### Cache-aside

Приложение сначала читает cache. Miss → читает DB → кладёт результат в cache. При update обычно меняет DB и инвалидирует/обновляет cache. Это просто, но создаёт окно stale data и требует продуманного TTL/invalidation.

### Cache stampede

Популярный key истёк, множество requests одновременно пошли в DB. Решения: request coalescing/lock, stale-while-revalidate, jitter TTL, proactive refresh.

### Cache penetration

Запрашиваются несуществующие keys, каждый miss идёт в DB. Можно cache negative result на короткий TTL, validation/Bloom filter в подходящих системах.

### TTL зачем нужен?

Ограничивает stale lifetime и memory usage, но TTL не заменяет correctness strategy. Для критически согласованных данных иногда нужен explicit invalidation/event.

### Redis всегда cache?

Нет. Redis также используют как key-value store, counters, rate limiter, distributed coordination, streams/queues — но persistence/consistency требования нужно оценивать отдельно.
