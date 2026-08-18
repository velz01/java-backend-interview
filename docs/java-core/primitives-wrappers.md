# Примитивы, Wrapper-классы и Integer Pool

::: tip Приоритет
🟡 **Частый короткий блок Java Core.**
:::

## Какие примитивы есть в Java?

`byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`.

## Primitive vs Wrapper

Примитив хранит значение напрямую. Wrapper — объект (`Integer`, `Long`, `Boolean` и т.д.), может быть `null`, участвует в generics/collections.

## Autoboxing / Unboxing

Compiler автоматически преобразует primitive ↔ wrapper в подходящих местах.

## Где может быть NullPointerException из-за unboxing?

```java
Integer value = null;
int x = value; // NPE
```

## Integer Pool

Для некоторых значений Integer JVM переиспользует cached objects. Поэтому `Integer a=100; Integer b=100; a==b` может быть true, а для больших значений — false.

### Что говорить на интервью
Никогда не сравнивай wrapper values через `==`, если нужен логический value. Используй `equals` или unboxing с пониманием null.

## Почему generics не работают с int?

Generics принимают reference types, поэтому `List<int>` нельзя; нужен `List<Integer>`.

## int vs Integer в DTO/Entity

`int` не может выражать отсутствие значения, default 0. `Integer` может быть null. Выбор должен отражать contract/data model.

## Что такое widening/narrowing conversion?

Widening primitive conversion обычно безопаснее и может быть implicit (`int -> long`). Narrowing (`long -> int`) требует explicit cast и может потерять данные.

## float/double для денег?

Обычно нет: binary floating point не представляет многие decimal values точно. Для денежных расчётов используют `BigDecimal` с явной precision/rounding policy.

## BigDecimal equals vs compareTo

`equals` учитывает scale: `1.0` и `1.00` могут быть не equal. `compareTo` сравнивает числовое значение и может вернуть 0.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Примитивы, Wrapper-классы и Integer Pool»](/materials/java-core-primitives-wrappers)
