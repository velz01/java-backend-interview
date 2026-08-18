# Диагностика и performance

## Сервис стал отвечать 5 секунд вместо 200 мс. С чего начать?

С измерений, а не с переписывания. Проверить latency percentiles, CPU, memory/GC, thread pools, DB pool, SQL timings/query count, external dependencies, Kafka lag. Затем локализовать bottleneck по metrics/traces/profiles.

## CPU 100% — что смотреть в Java?

Thread dump + profiler. Найти threads, которые реально потребляют CPU, посмотреть stack traces, горячие методы, busy loops, serialization, regex, crypto, excessive logging и т.п.

## Приложение зависло, CPU низкий

Thread dump часто важнее CPU profiler: возможно, threads ждут locks, DB connections, network I/O, thread-pool tasks. Ищи BLOCKED/WAITING, lock owners и exhaustion pools.

## Подозрение на memory leak

Смотреть heap growth после GC, GC logs/metrics, heap dump и dominator tree/retained size. Leak в managed language означает, что ненужные объекты всё ещё достижимы по ссылкам — например cache без eviction, listener registry, ThreadLocal.

## Какие инструменты назвать?

JDK tools (`jcmd`, `jstack`, `jmap`), Java Flight Recorder / Mission Control, VisualVM, async-profiler, APM/metrics/tracing stack. Важно объяснить, какую гипотезу проверяешь каждым инструментом.

## Почему p95/p99 важнее среднего?

Average может скрыть длинный хвост. Пользователи чувствуют медленные requests, а saturation часто сначала проявляется в p95/p99 до сильного ухудшения среднего.
