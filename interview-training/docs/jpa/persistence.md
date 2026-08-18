# JPA, Hibernate и Persistence Context

::: tip Приоритет
🔴 **Must know.**
:::

## JPA vs Hibernate

JPA/Jakarta Persistence — specification. Hibernate — implementation + собственные extensions.

## Entity

Persistent domain object, связанный с row/identity и lifecycle persistence provider.

## Состояния Entity

- transient/new;
- managed/persistent;
- detached;
- removed.

## Persistence Context

Контекст managed entities. Даёт identity map: одна database identity внутри context обычно соответствует одному managed instance.

## EntityManager

API для работы с persistence context: persist, find, merge, remove, flush и query.

## persist()

Переводит new entity в managed state. INSERT может случиться не прямо на вызове, а при flush в зависимости от id generation/strategy.

## merge()

Не «присоединяет тот же object». Возвращает managed copy/state result. Исходный detached object остаётся detached.

## remove()

Managed entity помечается removed; DELETE выполняется при flush/commit.

## Dirty checking

Hibernate отслеживает изменения managed entity и при flush формирует UPDATE без обязательного repository.save после каждого setter.

## flush vs commit

Flush синхронизирует persistence context с DB, отправляя SQL. Commit завершает transaction. Flush может произойти до commit и transaction всё ещё может rollback.

## First-level cache

Обязательный cache persistence context. Повторный find по id в том же context обычно не идёт в DB.

## Second-level cache

Опциональный cross-session cache. Нужны стратегия consistency/invalidation и понимание, какие entities/queries реально стоит кэшировать.

## Persistence Context и transaction

Часто lifecycle context связан с transaction/request, но это не один и тот же концепт. Transaction — DB atomic/isolation boundary, persistence context — identity/managed-state context.

## Почему Entity не стоит отдавать напрямую наружу API?

Lazy proxies, bidirectional cycles, accidental data exposure, coupling API contract к persistence model. Часто DTO/projected model безопаснее.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «JPA, Hibernate и Persistence Context»](/materials/jpa-persistence)

## Углубление для собеседования

### Какие состояния Entity нужно знать?

- **Transient** — обычный объект, не связан с persistence context.
- **Managed** — отслеживается текущим persistence context.
- **Detached** — раньше был managed, но context закрыт/объект отсоединён.
- **Removed** — помечен на удаление.

### Что такое Persistence Context?

Unit-of-work/identity map вокруг managed entities. В пределах одного context загрузка одной Entity по тому же id обычно возвращает тот же Java object instance; изменения managed state отслеживаются dirty checking.

### first-level cache

Это сам persistence context и он обязателен. Он scoped к EntityManager/Session, не общий для всех requests. Second-level cache — отдельный shared optional mechanism между sessions.

### persist() vs merge()

`persist` переводит новый entity instance в managed state. `merge` копирует состояние переданного detached/transient объекта в managed instance и **возвращает managed instance**; сам аргумент merge не обязан стать managed.

### flush() vs commit()

Flush синхронизирует изменения persistence context с DB (отправляет SQL), но не делает transaction durable сам по себе. Commit завершает transaction; перед ним обычно происходит flush.

### EntityManager thread-safe?

Обычный persistence context/EntityManager не предназначен для совместного использования несколькими threads. В Spring proxy предоставляет контекст, связанный с текущей transaction/thread model.
