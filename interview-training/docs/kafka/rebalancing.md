# Rebalancing, lag и consumer performance

::: tip Приоритет
🟡 **Хорошая middle-тема.**
:::

## Rebalance

Partitions перераспределяются между group members при join/leave/failure/partition count changes и некоторых timeout conditions.

## Почему rebalance неприятен?

Может временно остановить processing, сменить ownership partitions и привести к повторной обработке, если offsets/processing плохо согласованы.

## Consumer lag

Разница между end offset и committed/processed progress consumer group.

## Почему lag растёт?

- slow handler;
- downstream DB/API тормозит;
- мало consumers/partitions;
- batch слишком большой;
- frequent rebalances;
- CPU/GC/network bottleneck.

## max.poll.interval.ms

Максимальное время между poll calls до того, как consumer может считаться неактивным для group management. Долгая обработка batch должна учитывать параметр.

## max.poll.records

Ограничивает records за poll. Помогает подобрать batch под processing time.

## session.timeout / heartbeat

Используются для определения live group members (конкретные details зависят от protocol/client version).

## Как увеличить throughput?

- оптимизировать handler/downstream;
- batch operations;
- больше partitions и consumers до разумного предела;
- async processing с корректным order/offset management;
- tune fetch/poll sizes;
- уменьшить лишние serial bottlenecks.

## Почему нельзя просто «100 consumers»?

Если partitions 10, одновременно работают максимум 10 consumers группы по partition assignment.

## Hot partition

Один key/partition получает непропорционально много traffic. Общий cluster capacity есть, но эта partition становится bottleneck.

## Как избежать hot partition?

Хорошая key strategy, возможно sharding logical key, увеличение partitions — но с пониманием ordering requirements.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Rebalancing, lag и consumer performance»](/materials/kafka-rebalancing)
