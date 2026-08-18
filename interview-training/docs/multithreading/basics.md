# Threads, synchronized, volatile и JMM

::: tip Приоритет
🔴 **Must know для middle.**
:::

## Process vs Thread

Process имеет своё address space. Threads внутри процесса делят heap/resources, но имеют отдельные stacks и execution state.

## Runnable vs Callable

`Runnable` не возвращает value. `Callable<V>` возвращает value и может бросить checked exception; обычно submit в Executor возвращает Future.

## Что такое race condition?

Результат зависит от interleaving threads при доступе к shared mutable state без достаточной синхронизации.

## Что делает synchronized?

Даёт mutual exclusion на monitor и visibility guarantees через happens-before между unlock и последующим lock того же monitor.

## Что такое monitor?

Lock, связанный с объектом. `synchronized(this)` захватывает monitor this; static synchronized method — monitor Class object.

## Что делает volatile?

Гарантирует visibility и ordering для этой переменной, но не делает составные операции атомарными.

## Почему `volatile int counter; counter++` не thread-safe?

`++` — read → increment → write. Два threads могут прочитать одно значение и потерять update.

## volatile vs synchronized

Volatile хорош для простого independent state flag/reference. Synchronized защищает целый invariant/critical section из нескольких операций.

## Что такое happens-before?

Правило Java Memory Model, задающее гарантированную видимость и порядок между действиями. Примеры:
- unlock monitor → следующий lock;
- write volatile → следующий read того же volatile;
- действия до `Thread.start()` → действия нового thread;
- завершение thread → успешный join.

## Что такое deadlock?

Циклическое ожидание locks. T1 держит A и ждёт B; T2 держит B и ждёт A.

## Как снижать риск deadlock?

Единый порядок locks, короткие critical sections, минимум nested locks, `tryLock`/timeouts где уместно.

## Livelock

Threads не заблокированы, но постоянно реагируют друг на друга и не делают progress.

## Starvation

Thread долго не получает CPU/lock/resource из-за unfair contention.

## wait/notify vs sleep

`wait()` вызывается с monitor и освобождает его. `sleep()` просто приостанавливает thread и monitor автоматически не освобождает.

## notify vs notifyAll

`notify` будит один ожидающий thread, `notifyAll` — всех. Из-за conditions и lost progress часто безопаснее условие проверять в `while`, а выбор notify/notifyAll делать осознанно.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Threads, synchronized, volatile и JMM»](/materials/multithreading-basics)
## Углубление для собеседования

### Что именно гарантирует volatile?

`volatile` даёт **visibility**: запись одним потоком становится видимой последующим чтениям другими потоками, и создаёт необходимые happens-before связи. Он также ограничивает опасные reorderings вокруг volatile-access. Но `volatile` не делает произвольные составные операции атомарными.

### Почему volatile int counter; counter++ не thread-safe?

`counter++` — read → increment → write. Два потока могут прочитать одно старое значение и оба записать одинаковый результат. Для счётчика под конкуренцией используют `AtomicInteger.incrementAndGet()` или lock/synchronized.

### Что делает synchronized?

Обеспечивает взаимное исключение для одного монитора и memory visibility на границах lock/unlock. В synchronized-блок одновременно входит один поток для данного monitor object.

### Что такое monitor?

Механизм взаимного исключения, ассоциированный с объектом. `synchronized(obj)` пытается захватить монитор `obj`; instance synchronized method использует `this`, static synchronized — объект `Class`.

### Что такое happens-before?

Это правило Java Memory Model, описывающее гарантированную видимость и порядок между действиями. Примеры: unlock happens-before последующего lock того же монитора; запись volatile happens-before последующего чтения этой переменной; действия до `Thread.start()` видны стартовавшему потоку.

### Race condition и data race — одно и то же?

Не совсем. Race condition — более широкая логическая проблема, когда результат зависит от порядка выполнения. Data race — конкурентный доступ к одной памяти без нужной синхронизации, когда как минимум один доступ — запись.

### Что такое deadlock и как его предотвращать?

Deadlock — цикл ожидания ресурсов: поток A держит lock1 и ждёт lock2, поток B держит lock2 и ждёт lock1. Типичные меры: фиксированный порядок захвата lock, сокращение lock scope, `tryLock` с timeout, отказ от вложенных блокировок.

### wait(), notify(), notifyAll() — где вызываются?

Их вызывают, владея монитором соответствующего объекта. `wait()` освобождает monitor и переводит поток в ожидание; `notify` будит одного ожидающего, `notifyAll` — всех. Условие нужно проверять в `while`, потому что пробуждение не гарантирует, что условие всё ещё истинно.

### Thread.start() vs run()

`start()` просит JVM запустить новый thread и затем выполнить его `run()`. Прямой вызов `run()` — обычный вызов метода в текущем потоке, никакой параллельности он не создаёт.

### sleep() vs wait()

`sleep()` приостанавливает текущий thread на время и **не освобождает monitor**, который поток уже удерживает. `wait()` относится к monitor protocol: вызывается при владении монитором и освобождает его, пока поток ждёт notification/timeout/interruption.

### join()

`thread.join()` заставляет текущий поток ждать завершения `thread`. Завершение `run()` happens-before успешное возвращение из `join()`, поэтому результаты завершившегося потока видимы ожидающему.

### interrupt — как правильно остановить поток?

Cooperative cancellation: один поток вызывает `interrupt()`, другой либо получает `InterruptedException` в interruptible blocking call, либо проверяет interrupted flag. `Thread.stop()` опасен, потому что может оборвать код в произвольной точке и оставить invariants/resources в некорректном состоянии.

### ThreadLocal зачем нужен?

Хранит отдельное значение для каждого thread. Используется для request/context-like state в thread-per-request моделях, но в thread pools значения нужно очищать (`remove()`), иначе контекст может протечь в следующую задачу и удерживать объекты в памяти.

### Safe publication immutable объекта

Даже immutable object нужно корректно опубликовать другому thread. `final` fields имеют специальные JMM guarantees при правильном конструировании, а публикация через volatile, synchronized или concurrent container создаёт явные happens-before связи.
