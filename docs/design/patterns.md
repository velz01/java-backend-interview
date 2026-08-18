# Паттерны: Strategy, Factory, Builder, Proxy и др.

::: tip Приоритет
🟡 **Знать 6–10 паттернов с примерами лучше, чем зубрить все GoF.**
:::

## Strategy

Инкапсулирует взаимозаменяемые algorithms за общим interface.

## Factory Method

Creation делегировано method/implementation, client не завязан на concrete constructor.

## Abstract Factory

Создаёт семейство связанных objects без привязки client к concrete classes.

## Builder

Пошаговое создание complex object, особенно при множестве optional parameters.

## Adapter

Преобразует interface external/legacy component к ожидаемому приложением.

## Decorator

Оборачивает object тем же contract и добавляет behavior без subclass explosion.

## Proxy

Контролирует доступ к target: transactions, security, lazy/remote access.

## Observer

Subscribers получают events/notifications publisher. Spring ApplicationEvent — близкий practical example.

## Chain of Responsibility

Request идёт по chain handlers. Servlet Filter/Spring Security filter chain — практический пример идеи.

## Template Method

Base algorithm задаёт skeleton, subclass меняет отдельные steps.

## Facade

Даёт простой high-level API над набором сложных subsystems.

## Command

Операция представлена object, что облегчает queueing/retry/audit/undo в подходящих domains.

## Singleton

Один accessible instance. В modern DI applications explicit GoF Singleton часто не нужен — lifecycle контролирует container.

## Proxy в Spring

Transaction/security/AOP advice часто реализованы proxy.

## Factory в Spring

BeanFactory/ApplicationContext отвечает за creation/configuration beans.

## Template в Spring

`JdbcTemplate` скрывает boilerplate resource/error handling, оставляя callback/operation specifics.

## Strategy в Spring

Много extension points — serializers, converters, resolvers, security strategies.

## Паттерн vs принцип

Паттерн — повторяемая форма решения конкретной design-проблемы. SOLID — общие design principles. Не смешивать.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Паттерны: Strategy, Factory, Builder, Proxy и др.»](/materials/design-patterns)
