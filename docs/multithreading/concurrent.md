# CAS, Atomic, Locks и ConcurrentHashMap

::: tip Приоритет
🔴 **Очень частые follow-up вопросы.**
:::

## Что такое CAS?

Compare-And-Set атомарно: «если текущее значение равно expected — заменить на new». Основа многих lock-free primitives.

## AtomicInteger vs volatile int

AtomicInteger даёт атомарные read-modify-write (`incrementAndGet`, `compareAndSet`). Volatile даёт visibility, но `++` не атомарен.

## Что такое ABA problem?

CAS видит A в начале и A в конце, но не замечает изменение A→B→A. Если история важна, используют version/stamp (`AtomicStampedReference`).

## ReentrantLock vs synchronized

Lock даёт `tryLock`, interruptible acquisition, Conditions и explicit unlock. Synchronized проще и освобождается автоматически при выходе из блока.

## Почему lock нужно release в finally?

Чтобы exception не оставил lock захваченным.

```java
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}
```

## ReadWriteLock

Позволяет нескольким readers работать одновременно, но writer требует exclusive lock. Полезность зависит от отношения reads/writes и стоимости contention.

## ConcurrentHashMap — high level

Thread-safe map без единой global lock на все операции. Reads в обычном случае non-blocking, updates используют CAS и локальную синхронизацию на нужных buckets/nodes.

## ConcurrentHashMap vs synchronizedMap

`synchronizedMap` обычно сериализует операции общим monitor. ConcurrentHashMap лучше масштабируется при параллельном доступе.

## Почему ConcurrentHashMap запрещает null?

`get()==null` должен однозначно означать «mapping отсутствует» в concurrent context.

## CopyOnWriteArrayList

Каждая mutation копирует внутренний array; reads дешёвые и stable snapshot iterator. Подходит для read-mostly маленьких collections, очень плох для частых writes/больших arrays.

## LongAdder vs AtomicLong

При сильной конкуренции LongAdder распределяет increments по cells и часто масштабируется лучше. Но `sum()` не является строгой атомарной snapshot-точкой для сложного invariant.

## Semaphore

Ограничивает количество одновременных holders permits: например максимум N concurrent calls к внешнему ресурсу.

## CountDownLatch

Одноразовый countdown: один/несколько threads ждут, пока counter дойдёт до нуля.

## CyclicBarrier

Группа threads ждёт друг друга в barrier point, затем barrier может использоваться снова.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «CAS, Atomic, Locks и ConcurrentHashMap»](/materials/multithreading-concurrent)
## Углубление для собеседования

### Что такое CAS?

Compare-And-Set атомарно сравнивает текущее значение с ожидаемым и, если оно совпало, записывает новое. Это основа многих lock-free/low-lock примитивов. При конфликте операция обычно повторяется в цикле.

### AtomicInteger всегда лучше synchronized?

Нет. Atomic удобен для простого состояния вроде счётчика или одной ссылки. Если нужно атомарно изменить несколько полей с инвариантом, lock часто понятнее и корректнее.

### ReentrantLock vs synchronized

Оба дают mutual exclusion и memory guarantees. `ReentrantLock` дополнительно предлагает `tryLock`, interruptible lock, несколько `Condition` и optional fairness. `synchronized` проще и автоматически освобождает monitor при выходе из блока.

### Как ConcurrentHashMap достигает concurrency?

Современные реализации не блокируют всю map одним глобальным lock для каждой операции. Чтения преимущественно неблокирующие, обновления используют CAS и локальную синхронизацию вокруг конкретных bucket/структур. Поэтому конкуренция существенно лучше, чем у грубо synchronized map.

### putIfAbsent зачем нужен, если есть containsKey + put?

`containsKey` и `put` — две отдельные операции: между ними другой поток может вставить значение. `putIfAbsent` выполняет compound action атомарно относительно Map.

### LongAdder vs AtomicLong

`AtomicLong` хранит одно значение и при высокой конкуренции многие потоки спорят за одну CAS-точку. `LongAdder` распределяет обновления по нескольким ячейкам и суммирует их при чтении, поэтому выгоден для hot counters, но чтение не является мгновенным «единственным атомарным состоянием» для сложных протоколов.
