# Монолит, микросервисы и границы сервисов

::: tip Приоритет
🟡 **Middle+/System Design.**
:::

## Монолит vs микросервисы

Монолит проще локально разрабатывать, тестировать и deploy. Микросервисы дают independent deployment/scale/ownership, но добавляют network, observability, distributed data и consistency complexity.

## Почему микросервисы не «всегда лучше»?

Для маленькой команды и продукта operational complexity может быть дороже преимуществ.

## Как выбирать границы?

По business capabilities/bounded contexts и ownership, а не «одна таблица — один сервис».

## Database per service

Сервис владеет своей data model и не даёт другим сервисам напрямую менять его DB.

## Shared Database — минусы

Tight coupling schemas/releases, невозможность independently evolve service model, скрытые joins/transactions между supposedly independent services.

## Distributed monolith

Много deploy units, но они тесно связаны, синхронно зависят друг от друга, выпускаются вместе и/или делят DB — сложность distributed system без autonomy.

## Sync communication

HTTP/gRPC удобно, когда нужен немедленный response. Но caller зависим от availability/latency callee.

## Async communication

Messaging снижает temporal coupling и поддерживает fan-out/replay, но добавляет eventual consistency, duplicates и observability challenge.

## API Gateway

Edge routing, auth, rate limit, protocol adaptation. Не должен становиться местом всей business logic.

## Service Discovery

Механизм найти network address instance. В Kubernetes часто роль выполняет service/DNS abstraction.

## Versioning APIs

Backward compatibility, additive changes, contract testing, deprecation policy. Просто `/v2` не решает все compatibility проблемы.

## Data aggregation

Cross-service read model можно строить API composition, dedicated query service, materialized view/read model — выбор зависит от latency/consistency.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Монолит, микросервисы и границы сервисов»](/materials/microservices-boundaries)
