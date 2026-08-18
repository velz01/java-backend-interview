# Stream API, lambda и Optional

::: tip Приоритет
🟡 **Часто спрашивают на junior/middle.**
:::

## Stream — это коллекция?

Нет. Stream — pipeline вычислений над источником данных. Он сам не хранит элементы и обычно consumption одноразовый.

## Intermediate vs terminal operations

Intermediate operations (`map`, `filter`, `sorted`) ленивы и строят pipeline. Terminal (`collect`, `reduce`, `count`, `findFirst`) запускают его.

## map vs flatMap

`map`: один элемент → один результат.  
`flatMap`: один элемент → stream/контейнер результатов, затем вложенность flatten.

```java
List<List<String>> groups = ...;
List<String> all = groups.stream()
        .flatMap(List::stream)
        .toList();
```

## filter

Оставляет элементы, для которых Predicate вернул true.

## reduce

Сворачивает stream в одно значение: сумма, максимум, агрегат.

## collect

Mutable reduction: собрать в List/Map, groupingBy, partitioningBy и т.п.

## Почему Stream lazy?

Это позволяет short-circuit и fusion pipeline: `findFirst()` после `filter()` может не обходить весь источник.

## Можно ли повторно использовать Stream?

После terminal operation stream считается consumed. Нужно создать новый.

## parallelStream — всегда быстрее?

Нет. Есть overhead разделения, общий ForkJoinPool, contention и проблемы с shared mutable state. Нужен подходящий объём и CPU-bound независимые операции.

## Stateful operations

`sorted`, `distinct` могут требовать хранить больше промежуточного состояния, чем простой `map/filter`, поэтому имеют другой memory/performance profile.

## Functional interfaces

Частые:
- `Predicate<T>`: T → boolean;
- `Function<T,R>`: T → R;
- `Consumer<T>`: T → void;
- `Supplier<T>`: () → T.

## Optional зачем?

Явно моделирует возможное отсутствие результата. Хорош для return type, но обычно не нужен в каждой Entity field/DTO field.

## orElse vs orElseGet

`orElse(expensive())` вычислит fallback заранее. `orElseGet(this::expensive)` — только если Optional пуст.

## map vs flatMap в Optional

`map` оборачивает result в Optional, `flatMap` используется, когда function уже возвращает Optional и не нужна вложенность `Optional<Optional<T>>`.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Stream API, lambda и Optional»](/materials/generics-streams-streams)
