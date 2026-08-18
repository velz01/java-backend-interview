# SOLID на Java-примерах

::: tip Приоритет
🟡 **Лучше привести пример, чем цитировать формулировку.**
:::

## SRP

У класса/модуля должна быть одна связная причина для изменения. Не означает «один метод на класс».

### Плохой пример
`OrderService` валидирует заказ, пишет PDF, шлёт email, формирует SQL, считает налог.

## OCP

Стабильный код расширяется новой реализацией, а не переписывается большим switch при каждом новом варианте.

### Пример
`DiscountStrategy` с отдельными implementations вместо `if (type == ...)`.

## LSP

Subtype должен заменять base type без нарушения contract.

### Плохой пример
Subclass неожиданно бросает `UnsupportedOperationException` для базовой операции, которая обещана contract.

## ISP

Клиенты не должны зависеть от методов, которые им не нужны. Несколько узких interfaces лучше одного огромного.

## DIP

Высокоуровневая policy зависит от abstraction, а detail реализует abstraction.

## DI == DIP?

Нет. DI — technique wiring dependencies. DIP — design principle direction of dependencies. Можно использовать DI container и всё равно иметь плохой coupling.

## SOLID всегда нужно применять?

Нет. Это heuristics для changeability/coupling. Overengineering из десятков interfaces без причины ухудшает код.

## SRP vs «слои»

Service может иметь несколько methods и всё равно отвечать за одну domain responsibility. SRP не про количество строк.

## OCP и plugin architecture

Extension points действительно полезны, когда вариативность ожидаема. Не нужно создавать abstraction на каждую hypothetical future change.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «SOLID на Java-примерах»](/materials/design-solid)
