# JVM Memory и Garbage Collector

::: tip Приоритет
🔴 **Обязательно знать концептуально.**
:::

## JVM, JRE, JDK

JVM исполняет bytecode. JDK содержит compiler и dev/runtime tools. Термин JRE исторически обозначает runtime environment; в современных JDK отдельная поставка JRE менее центральна.

## Stack vs Heap

Heap — objects/arrays, общий между threads, управляется GC. Каждый thread имеет stack с method frames, local variables, operand stack и references.

## Где хранятся примитивы?

Не говори «все примитивы в stack». Primitive field — часть object в heap; local primitive — часть frame/оптимизированного runtime representation. JIT может держать данные в registers.

## Metaspace

Native memory area для class metadata (в HotSpot), пришедшая на смену PermGen.

## Young / Old generation

Generational collectors используют идею, что большинство objects умирают быстро. Новые objects обычно начинают в young, long-lived продвигаются в old.

## Eden / Survivor

Классическая организация young generation: allocation в Eden, surviving objects копируются/перемещаются через Survivor spaces. Конкретика зависит от выбранного GC.

## GC roots

Корневые references: active thread stacks, static refs, JNI handles и JVM internal roots. Object жив, если достижим из roots по strong references.

## Stop-the-world

Фазы, когда application threads приостановлены. Современные collectors стараются часть работы делать concurrently, но полностью STW не исчезает.

## Minor/Major/Full GC

Термины зависят от collector. На интервью безопаснее объяснить идею: сборка young обычно частая/дешёвая; старые регионы/полный heap — потенциально дороже.

## Strong / Soft / Weak / Phantom

- Strong — обычная ссылка, удерживает объект.
- Weak — object можно собрать, если strong refs нет.
- Soft — исторически memory-sensitive refs, но не лучший deterministic cache policy.
- Phantom — post-mortem cleanup/notification через ReferenceQueue.

## `System.gc()`

Запрос JVM на collection, а не гарантированный мгновенный Full GC.

## Memory leak в Java возможен?

Да. GC освобождает только unreachable objects. Если коллекция/кэш/ThreadLocal продолжает держать references на ненужные objects, память не освободится.

## ThreadLocal leak

В pool thread живёт долго. Если забывать `remove()`, value может удерживаться thread-ом существенно дольше request/task lifecycle.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «JVM Memory и Garbage Collector»](/materials/jvm-memory-gc)
## Углубление для собеседования

### Stack и Heap — что реально хранится?

В stack frame текущего thread находятся параметры, локальные переменные и служебные данные вызова. Объекты обычно размещаются в heap; локальная переменная может хранить ссылку на объект. Не нужно говорить «все примитивы всегда stack, все ссылки heap» — поля объекта, включая primitive fields, являются частью объекта в heap.

### Что такое Metaspace?

Область native memory, где HotSpot хранит metadata загруженных классов. В отличие от старого PermGen, metaspace не является обычной фиксированной частью heap, но его можно ограничивать настройками.

### Как GC определяет мусор?

Не через reference counting, а через reachability от GC Roots. Объекты, недостижимые по сильным ссылкам из roots, могут быть собраны.

### Какие GC Roots назвать?

Например, ссылки из stack frames живых threads, static references через загруженные классы, JNI handles и некоторые JVM internal structures.

### Young vs Old generation зачем?

Большинство объектов живёт недолго. Generational hypothesis позволяет часто и дёшево собирать young objects, а более долгоживущие продвигать в old generation.

### Stop-the-world — значит приложение всегда полностью стоит при GC?

Некоторые фазы действительно STW, но современные collectors стараются большую часть тяжёлой работы выполнять concurrently. Конкретные паузы и phases зависят от выбранного GC.

### G1, ZGC, Parallel GC — как сравнить на интервью?

Parallel ориентирован на throughput и использует значимые STW collections. G1 — balanced general-purpose collector с region-based heap и целевыми pause goals. ZGC ориентирован на очень низкие pauses и выполняет большую часть работы concurrently. Выбор зависит от latency/throughput/heap/версии JDK.
