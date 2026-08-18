# Exceptions и try-with-resources

::: tip Приоритет
🟡 **Базовая тема.**
:::

## Checked vs unchecked

Checked exception должен быть обработан или объявлен через `throws`. Unchecked — наследник `RuntimeException`, compiler не требует explicit handling.

## Error vs Exception

`Error` обычно означает серьёзную проблему JVM/runtime (`OutOfMemoryError`, `StackOverflowError`), которую обычная business logic не должна пытаться «лечить» как ожидаемый сценарий.

## throw vs throws

`throw` бросает конкретный exception object. `throws` объявляет возможные exceptions в signature.

## Порядок catch

Сначала более конкретные exceptions, затем общие. Иначе более конкретный catch будет unreachable.

## finally всегда выполняется?

Не буквально всегда. Обычно выполняется при normal return и exception, но может не выполниться при `System.exit`, падении JVM, kill process и т.п.

## try-with-resources

Автоматически закрывает ресурсы, реализующие `AutoCloseable`, в обратном порядке объявления.

## Что такое suppressed exception?

Если exception возник в body try, а затем ещё один при `close()`, второй не должен затереть основной и сохраняется как suppressed.

## Можно ли return в finally?

Технически возможно, но крайне плохо: может скрыть exception/return из try и сделать поведение неочевидным.

## Когда делать custom exception?

Когда домену нужен отдельный семантический тип ошибки или calling code действительно должен различать сценарии. Не стоит создавать отдельный exception на каждую строку кода.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Exceptions и try-with-resources»](/materials/generics-streams-exceptions)
