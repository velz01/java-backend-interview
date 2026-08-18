# Транзакции, ACID, isolation и MVCC

::: tip Приоритет
🔴 **Одна из главных тем SQL/PostgreSQL.**
:::

## Что такое транзакция?

Логическая единица работы: набор операций фиксируется commit или отменяется rollback в рамках гарантий СУБД.

## ACID

- Atomicity — all or nothing.
- Consistency — соблюдение invariants/constraints при переходе между допустимыми состояниями.
- Isolation — ограничение видимости конкурентных изменений.
- Durability — committed data переживают сбой в рамках гарантий БД/configuration.

## Dirty read

Чтение незакоммиченных изменений другой transaction.

## Non-repeatable read

Одна строка дважды прочитана в одной transaction и получены разные committed values.

## Phantom read

Повторный predicate query возвращает другой набор rows из-за concurrent insert/delete.

## Lost update

Две transactions читают одно value, обе вычисляют update, последняя запись затирает первую.

## Isolation levels

Read Uncommitted, Read Committed, Repeatable Read, Serializable.

### Важное уточнение
Нельзя механически переносить ANSI-таблицу на любую СУБД. PostgreSQL реализует свои guarantees через MVCC; Read Uncommitted фактически ведёт себя как Read Committed.

## Read Committed в PostgreSQL

Каждый statement обычно видит snapshot на начало statement, поэтому два SELECT внутри transaction могут увидеть разные committed versions.

## Repeatable Read в PostgreSQL

Transaction работает со стабильным snapshot и не видит изменения, committed после начала snapshot. При conflicts возможны serialization-like failures для некоторых scenarios.

## Serializable

Наиболее строгая isolation semantics: concurrent execution должно быть эквивалентно некоторому serial order. PostgreSQL может abort одну transaction с serialization failure — приложение должно быть готово retry.

## MVCC

Multi-Version Concurrency Control: хранятся версии rows, а snapshot определяет, какая версия видима transaction. Readers часто не блокируют обычных writers и наоборот.

## xmin/xmax на концептуальном уровне

Row version хранит transaction metadata о создании/удалении/замене. По snapshot PostgreSQL решает видимость tuple.

## VACUUM зачем?

MVCC оставляет dead tuples. VACUUM помогает освобождать/переиспользовать пространство и обслуживать visibility/freeze механизмы.

## Optimistic locking

Не блокируем заранее, а проверяем version при update. При конфликте получаем failure и решаем retry/show conflict.

## Pessimistic locking

Захватываем database lock до изменения, например SELECT FOR UPDATE.

## SELECT FOR UPDATE

Блокирует выбранные rows для конфликтующих modifications до конца transaction. Полезно для read-modify-write, но создаёт contention.

## Deadlock в БД

T1 держит row A и ждёт B, T2 держит B и ждёт A. PostgreSQL обнаружит цикл и отменит одну transaction.

## Как уменьшать deadlocks?

Единый порядок обновления ресурсов, короткие transactions, подходящие indexes, минимизация времени между lock и commit.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Транзакции, ACID, isolation и MVCC»](/materials/sql-transactions)
## Углубление для собеседования

### ACID — как объяснить без заучивания?

- **Atomicity** — либо зафиксированы все изменения транзакции, либо ни одно.
- **Consistency** — транзакция переводит данные из одного допустимого состояния в другое, сохраняя constraints/invariants.
- **Isolation** — параллельные транзакции не должны давать недопустимые эффекты относительно выбранного уровня.
- **Durability** — после commit изменения переживают сбой в пределах гарантий СУБД.

### Какие аномалии нужно знать?

**Dirty read** — читаем незакоммиченные изменения другой транзакции. **Non-repeatable read** — повторное чтение той же строки даёт другое committed значение. **Phantom read** — повторный predicate query видит другой набор строк. Дополнительно полезно знать **lost update** и **write skew**.

### Что важно про PostgreSQL и Read Uncommitted?

PostgreSQL фактически трактует `READ UNCOMMITTED` как `READ COMMITTED`: dirty read не даётся. Поэтому стандартные таблицы уровней SQL нельзя механически переносить на каждую конкретную СУБД.

### Как работает Read Committed в PostgreSQL?

Каждый statement получает снимок данных на начало statement. Поэтому два SELECT внутри одной транзакции могут увидеть разные committed версии, если между ними другая транзакция закоммитила изменения.

### Repeatable Read в PostgreSQL

Транзакция работает с устойчивым snapshot, поэтому повторные чтения не «прыгают» между committed версиями. Реализация PostgreSQL сильнее минимальных гарантий стандарта для некоторых phantom-сценариев, но всё равно возможны конфликты/serialization-like ошибки в конкурентных изменениях.

### Serializable — это просто глобальный lock?

Нет. Современная СУБД может реализовывать serializable через MVCC и отслеживание опасных зависимостей. Цена — вероятность serialization failure: приложение должно уметь повторить транзакцию.

### Что такое MVCC?

Multi-Version Concurrency Control хранит несколько версий строк и выбирает видимую версию по snapshot транзакции. Это позволяет читателям не блокировать обычные записи так часто, как при чисто lock-based модели.

### Optimistic vs pessimistic locking

Optimistic locking предполагает, что конфликты редки: обновление проверяет version и при конфликте отклоняется. Pessimistic locking заранее блокирует ресурс (`SELECT ... FOR UPDATE`) и заставляет конкурентов ждать/ошибаться.

### Когда использовать SELECT FOR UPDATE?

Когда собираешься прочитать строку, принять решение на основе текущего состояния и затем изменить её, не позволяя конкурентной транзакции выполнить несовместимое изменение между read и write. Но блокировки нужно держать как можно меньше времени.

### Что такое deadlock в БД?

Две транзакции захватили разные locks и каждая ждёт lock другой. СУБД обнаруживает цикл и откатывает одну транзакцию. Снижают риск одинаковым порядком обновления ресурсов и короткими транзакциями.
