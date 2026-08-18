# Generics, wildcard и PECS

::: tip Приоритет
🟡 **Часто спрашивают.** Особенно `? extends`, `? super` и type erasure.
:::

## Зачем нужны generics?

### Короткий ответ
Они дают type-safety на этапе компиляции и позволяют писать переиспользуемый код без постоянных casts.

## Почему List<Integer> не является List<Number>?

Generics в Java invariant. Иначе через `List<Number>` можно было бы положить `Double` в реальный `List<Integer>`.

## Что такое wildcard?

`?` означает неизвестный generic type. Bound задаёт ограничения:
- `? extends T` — некоторый T или subtype;
- `? super T` — некоторый T или supertype.

## ? extends T

### Короткий ответ
Хорош для producer: безопасно читать как T, но нельзя добавлять произвольный T, потому что реальный тип может быть конкретным subtype.

## ? super T

### Короткий ответ
Хорош для consumer: можно добавлять T и его subtype, но при чтении гарантирован только Object.

## PECS

**Producer Extends, Consumer Super.**

```java
void copy(List<? extends Number> src,
          List<? super Number> dst) {
    for (Number n : src) {
        dst.add(n);
    }
}
```

## Что такое type erasure?

Большая часть generic type information стирается при компиляции. JVM видит erased types и synthetic casts/bridge methods. Поэтому нельзя:
- `new T()`;
- `T.class`;
- `obj instanceof List<String>`.

## Что такое raw type?

Использование generic-класса без type parameter: `List list`. Поддерживается ради legacy compatibility, но убирает compile-time type safety.

## Что такое bridge method?

Synthetic method, который compiler иногда создаёт после erasure для сохранения polymorphism при override generic methods.

## Можно ли создать generic array?

Напрямую `new T[10]` нельзя из-за erasure и reified nature arrays. Обычно используют collection или создают array через Class/Array API с controlled cast.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Generics, wildcard и PECS»](/materials/generics-streams-generics)
