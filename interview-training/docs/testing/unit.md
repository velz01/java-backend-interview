# JUnit, Mockito и unit tests

::: tip Приоритет
🟡 **Базовая практическая тема.**
:::

## Unit vs Integration test

Unit test проверяет маленький unit поведения без тяжёлых внешних зависимостей. Integration test проверяет совместную работу компонентов/БД/framework.

## Mock vs Stub vs Spy

Stub возвращает заранее заданные responses. Mock дополнительно проверяет interactions. Spy оборачивает real object и позволяет частично подменять behavior.

## Что не надо мокать?

Value objects, простые коллекции, собственную business logic. Моки полезны на boundaries: remote clients, DB repository в чистом unit, clock/randomness abstractions.

## @Mock vs @InjectMocks

`@Mock` создаёт mock. `@InjectMocks` создаёт subject и пытается внедрить mocks. Ручной constructor часто делает dependency graph явнее.

## when/thenReturn

Задаёт stub behavior.

## verify

Проверяет interaction. Нельзя превращать каждый test в проверку каждой внутренней method call — это делает tests хрупкими к refactoring.

## ArgumentCaptor

Позволяет перехватить argument, переданный mock, и проверить его содержимое.

## Spy — риск

Если stub-ить через `when(spy.realMethod())`, real method может реально вызваться при настройке. Часто для spy используют `doReturn(...).when(spy)...`.

## Parameterized tests

Один scenario на наборе inputs. Хорош для validation/boundary cases.

## AAA

Arrange → Act → Assert. Удобная структура test.

## Given-When-Then

Поведенческая форма той же идеи: given state, when action, then outcome.

## Что проверять?

Observable behavior/result/state/important interaction. Не implementation details.

## Test pyramid

Много быстрых unit, меньше integration, ещё меньше E2E. Это heuristic, а не закон.

## Flaky test

Нестабильный test, результат зависит от timing/order/environment. Flaky suite быстро перестаёт внушать доверие.

## Как уменьшать flaky tests?

Controlled clock/randomness, deterministic async waiting, isolation test data, no arbitrary sleeps, proper cleanup.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «JUnit, Mockito и unit tests»](/materials/testing-unit)
