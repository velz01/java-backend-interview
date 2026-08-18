# Timeout, Retry, Circuit Breaker и Bulkhead

::: tip Приоритет
🟡 **Частый system design follow-up.**
:::

## Timeout

Любой remote call должен иметь bounded waiting time. Иначе зависший dependency удержит thread/connection и может вызвать cascading failure.

## Retry

Полезен для transient errors. Опасен при non-idempotent operation и overload.

## Exponential backoff

Пауза между retries растёт, чтобы не давить на failing dependency.

## Jitter

Случайная добавка к backoff, чтобы множество instances не повторяли requests синхронно.

## Retry storm

Если все upstream retries умножают load на failing service, outage усиливается.

## Circuit Breaker

После threshold failures перестаёт реально вызывать dependency (open), затем пробует ограниченные calls (half-open), возвращается closed при recovery.

## Bulkhead

Изолирует resources по downstream/use case: отдельные pools/semaphores, чтобы один dependency не съел всё.

## Rate Limiting

Ограничивает requests. Algorithms: token bucket, leaky bucket, fixed/sliding window.

## Fallback

Должен быть business-correct. Возврат fake/empty data ради HTTP 200 может быть хуже явной ошибки.

## Timeout budget

Timeout каждого downstream должен укладываться в end-to-end SLA caller; нельзя поставить по 30s на каждый из пяти последовательных calls при API SLA 2s.

## Hedged requests

В некоторых read scenarios второй parallel request запускается при long tail latency. Может уменьшить p99, но увеличивает load и требует осторожности.

## Load shedding

Под overload система намеренно rejects low-priority/new work, чтобы сохранить health и обслужить уже принятые requests.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Timeout, Retry, Circuit Breaker и Bulkhead»](/materials/microservices-resilience)
