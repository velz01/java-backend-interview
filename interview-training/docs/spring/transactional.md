# @Transactional, Proxy и AOP

::: tip Приоритет
🔴 **Must know для Java backend.** На интервью редко останавливаются на определении — обычно идут в self-invocation, propagation, rollback и связь с БД.
:::

## Как работает @Transactional?

### Короткий ответ
Spring обычно оборачивает bean в proxy. Когда внешний вызов проходит через proxy, `TransactionInterceptor` определяет transaction attributes, открывает или присоединяет транзакцию, вызывает target method, затем делает commit или rollback.

```text
Controller -> Transaction Proxy -> Service method -> Repository -> DB
                 |                                   |
               BEGIN                              SQL...
                 |                                   |
               COMMIT / ROLLBACK <-------------------
```

Аннотация сама по себе не «открывает транзакцию магией» — важен interception вызова.

## Что такое self-invocation и почему @Transactional может не сработать?

Если метод bean вызывает другой метод того же объекта через `this.inner()`, вызов не проходит через внешний proxy. Поэтому transaction advice на `inner()` не перехватывается.

```java
@Service
class OrderService {
    public void outer() {
        inner(); // обычный вызов this.inner()
    }

    @Transactional
    public void inner() { ... }
}
```

Лучшее исправление — вынести transaction boundary в отдельный bean/service, чтобы call действительно проходил через proxy.

## На каких исключениях Spring делает rollback по умолчанию?

Типичный default: rollback на `RuntimeException` и `Error`. Checked exception сама по себе не обязана вызвать rollback. Если бизнес-требование другое, настраивают `rollbackFor`/`noRollbackFor`.

## Почему catch внутри transactional method может помешать rollback?

Если `RuntimeException` поймана и не выходит за proxy boundary, interceptor видит нормальное завершение метода и может commit. Если transaction уже была помечена rollback-only на более глубоком уровне, попытка outer commit может закончиться `UnexpectedRollbackException`.

## Что такое propagation?

Propagation описывает, как метод ведёт себя относительно **уже существующей** транзакции.

### REQUIRED
Есть транзакция — присоединиться. Нет — создать. Это наиболее распространённый вариант.

### REQUIRES_NEW
Текущая транзакция приостанавливается, создаётся новая независимая. Inner commit не откатывается автоматически вместе с outer transaction.

### NESTED
В рамках поддерживаемого resource/manager использует savepoint внутри внешней транзакции. Это не эквивалент REQUIRES_NEW: commit всей работы всё ещё зависит от outer transaction.

### SUPPORTS
Если transaction есть — участвовать; если нет — работать без неё.

### NOT_SUPPORTED
Приостановить текущую transaction и выполнить код без транзакции.

### MANDATORY
Транзакция обязана уже существовать, иначе ошибка.

### NEVER
Метод обязан выполняться без transaction; наличие активной транзакции — ошибка.

## REQUIRED vs REQUIRES_NEW — типичный кейс

Например, основной бизнес-процесс обновляет заказ, а audit log должен сохраниться независимо от rollback заказа. `REQUIRES_NEW` иногда используют для audit, но нужно помнить о дополнительных DB connections/locks и осознанно проектировать semantics.

## Какие атрибуты @Transactional важно знать?

- `propagation` — поведение относительно текущей транзакции;
- `isolation` — уровень изоляции;
- `readOnly` — hint/настройка read-only;
- `timeout` — лимит времени;
- `rollbackFor` / `noRollbackFor` — правила rollback;
- transaction manager — если их несколько.

## Что делает isolation в @Transactional?

Просит transaction manager использовать заданный isolation level underlying resource. Реальные guarantees определяет СУБД. Например, `READ_UNCOMMITTED` в PostgreSQL фактически ведёт себя как `READ_COMMITTED`.

## readOnly=true запрещает INSERT/UPDATE?

Не стоит считать это универсальным security barrier. В зависимости от manager/ORM/driver это hint или дополнительная настройка. Его смысл — сообщить инфраструктуре, что метод предназначен для чтения, но проверять поведение нужно на конкретном стеке.

## Почему private/final методы проблемны для proxy-based AOP?

Proxy должен иметь точку перехвата вызова. Private method не является внешней proxy entry point. Class-based proxy не может override final method. Поэтому transactional boundary лучше держать на публичных service methods.

## JDK Dynamic Proxy vs class-based proxy

JDK proxy реализует interfaces target-а. Class-based proxy создаёт subclass. В обоих случаях идея одна: вызов идёт через interceptor chain до target method.

## Что такое AOP?

Aspect-Oriented Programming выносит cross-cutting concerns — transactions, logging, security, metrics — из бизнес-кода. В Spring AOP join point обычно method execution.

- **Pointcut** — какие методы перехватывать;
- **Advice** — что выполнять;
- **Aspect** — объединение pointcut + advice;
- **Proxy** — объект, через который проходит вызов.

## Что такое UnexpectedRollbackException?

Частый сценарий: inner code в общей REQUIRED transaction падает и помечает её rollback-only, исключение затем ловят, outer method продолжает работу и пытается commit. Spring видит rollback-only и сообщает, что commit невозможен.

## Что происходит с JPA Entity внутри @Transactional?

Entity, загруженная через текущий Persistence Context, обычно находится в managed state. Изменение её полей отслеживается dirty checking; на flush/commit Hibernate генерирует UPDATE даже без явного `save()` для уже managed entity.

## Когда реально выполняется SQL — сразу при save()?

Не обязательно. ORM может отложить INSERT/UPDATE до `flush`, commit или момента, когда запрос требует синхронизировать состояние. Поэтому важно отличать изменение Persistence Context от фактического SQL round trip.

## @Transactional и @Async

`@Async` переносит выполнение в другой thread. Transaction context обычно привязан к текущему потоку и автоматически в новый thread не «переезжает». Async method должна самостоятельно задавать нужную transaction boundary.

## @Transactional и Kafka

Обычная DB transaction **не делает атомарными** DB commit и Kafka publish. Это dual-write problem. Популярное решение — Transactional Outbox: событие сохраняется в той же DB transaction, а отдельный publisher позже доставляет его в Kafka.

## Стоит ли ставить @Transactional на Controller?

Технически возможно, но обычно transaction boundary держат в service layer. Controller занимается transport concerns и не должен без необходимости держать DB transaction во время HTTP-related работы/serialization.

## Что может произойти при долгой транзакции?

Дольше удерживаются locks/versions/resources, растёт contention, может исчерпаться connection pool, усложняется vacuum/cleanup в MVCC DB. Поэтому external HTTP calls внутри открытой DB transaction — потенциально опасный дизайн.

## Можно ли решить self-invocation через self-injection?

Технические обходы существуют (`self` proxy, `AopContext` и т.п.), но обычно это хуже архитектурно. Предпочтительнее сделать transaction boundary явной через отдельный service/component.

## Типичные ошибки на интервью

- «@Transactional работает потому что Spring видит аннотацию во время вызова» — важен proxy/interceptor.
- «любой exception откатывает transaction» — default правила различаются для checked/unchecked.
- «REQUIRES_NEW — то же, что NESTED» — нет.
- «self-invocation всегда перехватится» — нет в обычной proxy-based модели.
- «DB + Kafka становятся одной транзакцией» — не автоматически.

## Что могут спросить дальше

1. Какой proxy создаст Spring?
2. Почему self-invocation не работает?
3. REQUIRED vs REQUIRES_NEW vs NESTED?
4. Что будет, если inner REQUIRED упал, а exception поймали?
5. Когда Hibernate flush-ит изменения?
6. Как работает rollbackFor?
7. Что делает readOnly?
8. Что с transaction context при @Async?
9. Как решить DB + Kafka dual write?
10. Почему external call внутри transaction опасен?

---

## Дополнительные материалы

[Статьи, видео и схемы по @Transactional →](/materials/spring-transactional)
