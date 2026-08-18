# Comparable, Comparator и TreeMap

::: tip Приоритет
🟡 **Частый follow-up к коллекциям.**
:::

## Comparable vs Comparator

### Короткий ответ
`Comparable<T>` задаёт natural order внутри класса через `compareTo`. `Comparator<T>` задаёт внешнюю стратегию сравнения; для одного типа можно иметь много comparators.

## Какой контракт сравнения?

Результат должен быть согласованным, антисимметричным и транзитивным. Для sorted collections желательно, чтобы `compare(a,b)==0` соответствовало логическому равенству, иначе уникальность TreeSet/TreeMap может удивлять.

## Почему TreeSet может не добавить объект, хотя equals() false?

TreeSet считает элементы одинаковыми для структуры, если comparator/compareTo возвращает 0. Поэтому второй объект может не попасть в set.

## Как работает TreeMap?

Красно-чёрное дерево. `get/put/remove` — O(log n), keys идут в отсортированном порядке.

## Когда TreeMap лучше HashMap?

Когда нужны sorted keys, диапазоны (`subMap`) или ближайшие ключи (`floorKey`, `ceilingKey`). Если ordering не нужен — HashMap обычно проще и быстрее в среднем.

## Что такое stable sort?

Стабильная сортировка сохраняет исходный взаимный порядок элементов, которые comparator считает равными.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Comparable, Comparator и TreeMap»](/materials/collections-ordering)
