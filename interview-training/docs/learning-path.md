# План подготовки к Java Backend собеседованию

План рассчитан примерно на **6–8 недель**, если с основными технологиями уже было знакомство. При изучении Spring/SQL/Hibernate/Kafka с нуля срок лучше не форсировать.

## Неделя 1 — Java Core + Collections

1. [ООП и базовые конструкции](/java-core/oop)
2. [equals() / hashCode()](/java-core/equals-hashcode)
3. [String и String Pool](/java-core/strings)
4. [Collections](/collections/overview)
5. [HashMap — полный разбор](/collections/hashmap)

**Проверка недели:** без подсказки объяснить HashMap, контракт equals/hashCode, ArrayList vs LinkedList, интерфейс vs abstract class.

## Неделя 2 — Generics + Exceptions + Streams + Multithreading

1. [Generics и PECS](/generics-streams/generics)
2. [Exceptions](/generics-streams/exceptions)
3. [Stream API](/generics-streams/streams)
4. [synchronized / volatile / JMM](/multithreading/basics)
5. [CAS / Atomic / ConcurrentHashMap](/multithreading/concurrent)
6. [ExecutorService / CompletableFuture](/multithreading/executors)

**Проверка недели:** объяснить почему `volatile int counter; counter++` не thread-safe и чем ConcurrentHashMap отличается от synchronizedMap.

## Неделя 3 — SQL + PostgreSQL

1. [JOIN, GROUP BY, CTE, оконные функции](/sql/basics)
2. [ACID, isolation, MVCC, locks](/sql/transactions)
3. [Индексы и EXPLAIN](/sql/indexes)
4. [Масштабирование БД](/database/scaling)

**Проверка недели:** уметь на примере показать dirty/non-repeatable/phantom read, выбрать индекс и прочитать простой EXPLAIN.

## Неделя 4 — Hibernate/JPA + Spring

1. [Persistence Context](/jpa/persistence)
2. [LAZY/EAGER, N+1, fetch join](/jpa/fetching)
3. [Mapping и locking](/jpa/mapping-locking)
4. [Spring Core](/spring/core)
5. [@Transactional / Proxy / AOP](/spring/transactional)
6. [Spring MVC / Boot](/spring/boot-web)

**Проверка недели:** объяснить lifecycle Entity и Bean, N+1, self-invocation у `@Transactional`, propagation REQUIRED/REQUIRES_NEW.

## Неделя 5 — WEB + Kafka + Redis

1. [HTTP / REST](/web/http-rest)
2. [Auth / JWT / CORS](/web/auth)
3. [Kafka fundamentals](/kafka/fundamentals)
4. [Kafka delivery](/kafka/delivery)
5. [Rebalancing / lag](/kafka/rebalancing)
6. [Redis / cache](/redis/cache)

## Неделя 6 — Microservices + Testing + Docker + Patterns

1. [Microservices](/microservices/boundaries)
2. [Consistency / Saga / Outbox](/microservices/consistency)
3. [Resilience](/microservices/resilience)
4. [Unit testing](/testing/unit)
5. [Integration testing](/testing/integration)
6. [Docker](/infrastructure/docker)
7. [CI/CD](/infrastructure/cicd)
8. [SOLID](/design/solid)
9. [Patterns](/design/patterns)

## Последние 1–2 недели — моки + рынок

Не добавляй огромные новые блоки. Повторяй вопросы, на которых ошибаешься. После каждого интервью фиксируй реальные вопросы и закрывай пробелы точечно.

[Чек-лист перед собеседованием →](/interview-checklist)
