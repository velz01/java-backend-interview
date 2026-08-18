# ClassLoader, bytecode и JIT

::: tip Приоритет
🟡 **Хороший follow-up к JVM.**
:::

## Что такое bytecode?

Промежуточные instructions `.class`, которые JVM интерпретирует/компилирует в machine code.

## ClassLoader

Загружает classes. Runtime identity класса включает имя + classloader, поэтому одинаковое class name у разных loaders может быть разными types.

## Parent delegation

Loader сначала делегирует parent, затем пытается загрузить class сам. Это защищает core classes и уменьшает duplicate definitions.

## Этапы работы с классом

Упрощённо: loading → linking (verification, preparation, resolution) → initialization.

## Когда выполняется static initialization?

При первом активном использовании class в соответствии с JVM rules: static method/field, new instance и т.д.

## JIT

Компилирует hot bytecode в native code, используя runtime profile.

## Почему нужен warm-up benchmark?

Сначала code может работать interpreted/less optimized, потом JIT recompiles hot methods. Без warm-up benchmark измеряет startup/JIT transition.

## Inlining

JIT может встроить body часто вызываемого метода в caller и затем применить дополнительные optimizations.

## Escape analysis

Если object не «убегает» из method/thread, JIT может eliminate allocation/lock или выполнить scalar replacement.

## Почему `new` не всегда означает реальный heap allocation?

Source-level allocation может быть оптимизирован JIT после escape analysis.

## Deoptimization

Если assumptions JIT перестали быть верными, JVM может вернуться к менее оптимизированному code и перекомпилировать.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «ClassLoader, bytecode и JIT»](/materials/jvm-classloader-jit)
