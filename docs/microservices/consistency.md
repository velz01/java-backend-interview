# Saga, Outbox и eventual consistency

::: tip Приоритет
🔴 **Очень полезная архитектурная тема.**
:::

## Почему одна @Transactional не охватывает несколько сервисов?

Обычный transaction manager работает с local resource. Независимые DB + Kafka + HTTP не становятся одной ACID transaction.

## Eventual consistency

Компоненты могут временно расходиться, но при отсутствии новых changes сходятся к согласованному state через events/retries/reconciliation.

## Dual-write problem

Сервис меняет DB и публикует event. DB commit может пройти, publish — упасть, или наоборот. Две независимые операции не атомарны.

## Transactional Outbox

Business update + outbox event записываются одной local DB transaction. Отдельный publisher/CDC надёжно отправляет outbox в broker.

## Что если publisher отправил event и упал до mark-as-sent?

Event может уйти повторно. Поэтому downstream consumer всё равно должен быть idempotent.

## Saga

Цепочка local transactions между services с compensating actions при failure.

## Choreography Saga

Services реагируют на events без центрального coordinator. Хорошо decoupled, но сложнее понять flow и failure state.

## Orchestration Saga

Coordinator явно отправляет commands/следит за state process. Flow виднее, но coordinator становится важной частью системы.

## Compensation

Не rollback уже committed DB transaction, а новая business operation: refund, cancel reservation и т.п.

## Почему compensation может упасть?

Это обычная distributed operation. Нужны retries, idempotency, monitoring и manual reconciliation path.

## Inbox

Consumer сохраняет processed event id/record, чтобы duplicates не применяли effect дважды.

## Reconciliation

Периодический process сравнивает states/ledger и исправляет расхождения, которые не удалось закрыть online path.

## Event sourcing vs Outbox

Outbox — надёжная публикация события рядом с обычной state model. Event sourcing — events являются source of truth state. Это разные patterns.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Saga, Outbox и eventual consistency»](/materials/microservices-consistency)
