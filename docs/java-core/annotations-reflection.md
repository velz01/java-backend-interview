# Аннотации и Reflection

::: tip Приоритет
🟡 **Полезно для понимания Spring и framework magic.**
:::

## Что такое аннотация?

Metadata, которое можно применять к program elements. Само по себе annotation обычно ничего не «делает» — его читает compiler, processor, framework или runtime code.

## RetentionPolicy

- SOURCE — только source.
- CLASS — в bytecode, runtime reflection обычно не видит.
- RUNTIME — доступно reflection.

## @Target

Ограничивает, где annotation можно использовать: TYPE, METHOD, FIELD, PARAMETER и т.д.

## @Inherited

Влияет на inheritance class-level annotations через `Class.getAnnotation`; не распространяется автоматически на methods/interfaces во всех сценариях.

## Что такое Reflection?

Runtime API для изучения classes/methods/fields/annotations и динамического вызова/создания объектов.

## Где используется Reflection?

DI/ORM/serialization/testing frameworks, plugin systems, mapping libraries.

## Минусы Reflection

Слабее compile-time safety, сложнее refactoring/static analysis, возможен overhead и ограничения модульности/access.

## Reflection всегда медленный?

Вызов reflective path обычно дороже прямого вызова, но реальная важность зависит от hot path и framework caching/generated code. Нельзя делать вывод без измерений.

## Как Spring находит annotations?

Component scanning/metadata reading и затем bean post-processing/proxy infrastructure в зависимости от feature. Конкретный механизм отличается для разных annotations.

## Annotation Processor vs Reflection

Annotation processor работает compile-time и может генерировать code/проверки. Reflection — runtime introspection.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Аннотации и Reflection»](/materials/java-core-annotations-reflection)
