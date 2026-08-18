# Delivery semantics, commit, retry и idempotency

::: tip Приоритет
🔴 **Ключевая Kafka-тема.**
:::

## At-most-once

Record может потеряться, но повторная processing минимизируется/исключается по выбранной схеме. Например progress фиксируется до business effect.

## At-least-once

Record не теряется при retry, но может быть processed повторно. Consumer должен быть idempotent/deduplicating.

## Exactly-once

Kafka имеет exactly-once facilities для определённых transactional Kafka workflows. Но «ровно один бизнес-эффект в PostgreSQL + внешнем API + Kafka» автоматически не появляется.

## Auto commit

Offsets коммитятся автоматически по policy. Нужно понимать, насколько момент commit согласован с actual business processing.

## Manual commit

Application/framework контролирует, когда offset считается обработанным.

## Crash после DB commit, до offset commit

Record придёт повторно. Это классический сценарий at-least-once.

## Idempotent consumer

Повтор event не должен повторно применять business effect.

### Популярная реализация
`event_id` + unique constraint/processed_events table в одной DB transaction с business update.

## Retry

Подходит для transient failures. Нужен backoff и limit.

## Poison message

Record, который систематически падает из-за данных/logic. Бесконечный retry может навсегда заблокировать partition progress.

## DLQ / Parking topic

После лимита retries проблемный record отправляют отдельно вместе с error metadata для анализа/reprocessing.

## Producer acks

Баланс durability/latency:
- `acks=0` — не ждать broker ack;
- `acks=1` — leader ack;
- `acks=all` — подтверждение в соответствии с ISR/min.insync.replicas requirements.

## min.insync.replicas

Минимум ISR для успешной записи при `acks=all` в соответствующих настройках. Помогает не принимать запись при слишком малом числе synced replicas.

## Idempotent producer

Sequence numbers/producer identity помогают broker отсекать duplicates при producer retry.

## Kafka Transactions

Позволяют атомарно публиковать records в несколько partitions/topics и связывать consume-transform-produce сценарии с offsets. Не решают автоматически внешнюю DB.

## Outbox и Kafka

Чтобы атомарно связать DB state change и event publish, часто пишут business row + outbox row одной DB transaction, затем publisher/CDC отправляет event в Kafka.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Delivery semantics, commit, retry и idempotency»](/materials/kafka-delivery)
## Углубление для собеседования

### At-most-once

Offset подтверждается до/вместо надёжной обработки; при сбое сообщение может потеряться для приложения, но повторов меньше. Подходит только когда loss допустим.

### At-least-once

Сообщение сначала обрабатывается, затем подтверждается. Если приложение упало после side effect, но до commit offset, запись будет прочитана снова. Поэтому consumer должен быть idempotent.

### Exactly-once — что это реально значит?

Нельзя произносить «Kafka гарантирует exactly once вообще для любых внешних систем». Kafka имеет transactional/idempotent механизмы внутри своей экосистемы, но если consumer пишет во внешнюю DB/HTTP API, нужна отдельная стратегия атомарности/идемпотентности.

### Как сделать idempotent consumer?

Например, хранить `eventId`/business key с UNIQUE constraint и в одной DB transaction проверять/фиксировать обработку вместе с business change. Повторная доставка тогда не создаёт второй эффект.

### Auto commit vs manual commit

Auto commit проще, но легче получить нежелательную семантику при долгой обработке. Manual/controlled commit позволяет подтверждать offset после успешного side effect, но требует аккуратной обработки retries, rebalance и batch scenarios.

### Что такое DLQ?

Отдельный topic для сообщений, которые не удалось обработать после допустимого количества retries. DLQ не отменяет monitoring: сообщения там нужно разбирать, иначе это просто «кладбище ошибок».

### Retry — почему нельзя бесконечно повторять сразу?

Poison message может заблокировать partition. Используют ограниченный retry, backoff, retry topics или DLQ — в зависимости от требований к порядку и latency.

### acks у producer

Producer acknowledgments определяют, сколько подтверждений требуется от Kafka перед успешным результатом send. Более строгий режим повышает durability, но влияет на latency; в современном production обычно проектируют его вместе с replication/min ISR и idempotent producer settings.
