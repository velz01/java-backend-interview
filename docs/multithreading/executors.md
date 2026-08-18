# ExecutorService и CompletableFuture

::: tip Приоритет
🟡 **Частый middle-блок.**
:::

## Зачем ExecutorService?

Отделяет tasks от threads. Pool повторно использует workers, контролирует concurrency и queue.

## Почему `newCachedThreadPool()` не всегда безопасный default?

Может создавать много threads при burst load. Без backpressure легко получить resource exhaustion.

## FixedThreadPool — где риск?

В factory implementation часто используется unbounded queue. Если producers быстрее consumers, queue может расти и съесть memory.

## Как выбирать pool size?

CPU-bound: примерно число cores. IO-bound: может быть больше, потому что threads ждут I/O. Реально ориентируются на wait/compute ratio, load tests, latency и downstream limits.

## Future

Представляет будущий result; `get()` blocking. Классический Future плохо композируется.

## CompletableFuture

Позволяет строить async chain и комбинировать stages.

## thenApply vs thenCompose

`thenApply`: T → R.  
`thenCompose`: `T → CompletionStage<R>`, затем flatten.

## thenCombine

Комбинирует результаты двух независимых futures.

## allOf

Ждёт completion множества futures, но сам возвращает `CompletableFuture<Void>` — results нужно собирать отдельно.

## exceptionally vs handle

`exceptionally` обычно превращает failure в fallback result. `handle` получает и result, и exception и может обработать оба сценария.

## Async suffix

`thenApplyAsync` может выполнить stage через executor, а non-async continuation часто выполняется thread-ом, завершившим previous stage. Для production лучше понимать, какой executor используется.

## Common ForkJoinPool

Если executor не задан, многие async methods используют common pool. Не стоит бездумно смешивать туда blocking I/O — можно ухудшить выполнение других tasks.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «ExecutorService и CompletableFuture»](/materials/multithreading-executors)
## Углубление для собеседования

### Зачем нужен thread pool?

Создание thread на каждую задачу дорого и плохо контролирует нагрузку. Pool переиспользует потоки и ограничивает количество одновременно выполняемых задач.

### Из чего состоит ThreadPoolExecutor?

Ключевые параметры: `corePoolSize`, `maximumPoolSize`, keep-alive, work queue, thread factory и rejected execution handler. Поведение зависит не только от числа потоков, но и от типа/размера очереди.

### Почему unbounded queue может быть опасна?

Если задачи приходят быстрее обработки, очередь растёт без ограничений и может привести к большому latency или OOM. Backpressure/ограниченная очередь заставляют систему явно решать, что делать при перегрузке.

### CompletableFuture — это отдельный поток?

Нет. Это abstraction над будущим результатом и цепочками async stages. Без явно переданного Executor async-методы обычно используют common ForkJoinPool; не-async continuation может выполняться в потоке, завершившем предыдущий stage.

### thenApply vs thenCompose

`thenApply` преобразует `T -> U`. Если функция возвращает `CompletableFuture<U>`, получится вложенный future. `thenCompose` «расплющивает» асинхронную зависимость: `T -> CompletableFuture<U>` превращается в один `CompletableFuture<U>`.

### Как обрабатывать исключения CompletableFuture?

`exceptionally` даёт fallback, `handle` получает и result, и exception, `whenComplete` удобен для side-effect наблюдения, но обычно не заменяет результат сам по себе.

### execute() vs submit()

`execute(Runnable)` не возвращает Future; необработанное исключение выходит через thread/UncaughtExceptionHandler. `submit()` возвращает `Future`, а exception задачи сохраняется в Future и проявится при `get()` как `ExecutionException`.

### Как выбирать размер pool?

Для CPU-bound ориентир близок к числу доступных cores (с учётом профиля задачи). Для I/O-bound pool может быть больше, потому что threads значительную часть времени ждут. Формулу нельзя применять вслепую — важны latency, external limits, connection pool и измерения.

### RejectedExecutionHandler

Когда executor не может принять новую задачу (pool/queue saturated или shutdown), применяется rejection policy: abort, caller-runs, discard и др. `CallerRunsPolicy` может естественно давать backpressure, замедляя producer задач.

### CountDownLatch vs CyclicBarrier

Latch — одноразовый счётчик: несколько threads ждут, пока count станет 0. Barrier — точка встречи группы threads; после прихода всех они продолжают и barrier может использоваться повторно.

### Semaphore

Ограничивает число одновременно получивших permits. Подходит, например, для ограничения concurrent requests к внешнему ресурсу независимо от количества threads.
