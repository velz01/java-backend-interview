# Redis structures и практические сценарии

::: tip Приоритет
🟡 **Полезно уметь подобрать структуру под задачу.**
:::

## String

Counters, simple values, serialized objects, tokens. Atomic increment через INCR.

## Hash

Набор fields внутри одного key; удобно для компактной object-like структуры, если не нужен отдельный TTL на каждый field.

## List

Ordered sequence с push/pop. Может использоваться для простых queues, но для надёжных messaging scenarios часто лучше Redis Streams/специализированный broker.

## Set

Уникальные unordered members: membership, intersections/unions.

## Sorted Set

Members + score, ordered by score. Leaderboard, priority, time-based ranking.

## Redis Streams

Append-only stream records + consumer group-like processing. Не нужно путать по guarantees/scale с Kafka — разные инструменты.

## Pub/Sub

Realtime fan-out подписчикам, но messages не durable для offline subscriber. Не подходит как durable event log.

## INCR и counters

Atomic command на single Redis instance для counter/rate-limiting primitives.

## Lua scripts

Выполняют несколько Redis operations атомарно относительно других commands на server, полезно для conditional logic/rate limit.

## Pipeline

Client отправляет несколько commands без round-trip на каждый. Повышает throughput, но это не transaction.

## MULTI/EXEC

Команды queued и затем выполняются как transaction-like batch без interleaving, но rollback semantics не как в relational DB.

## WATCH

Optimistic locking primitive: EXEC abort, если watched key изменился.

## Redis persistence

RDB snapshots и AOF — разные trade-offs durability/performance/recovery. Если Redis только cache, persistence может быть менее критична; если source-like state — критична.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Redis structures и практические сценарии»](/materials/redis-structures)
