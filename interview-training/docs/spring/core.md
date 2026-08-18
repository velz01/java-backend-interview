# Spring Core: IoC, DI и Bean lifecycle

::: tip Приоритет
🔴 **Один из главных блоков Spring.**
:::

## IoC

Control создания и wiring объектов передан container.

## DI

Dependencies передаются извне, а не создаются внутри business class.

## Constructor injection

Предпочтительный default для обязательных dependencies: они видимы в signature, можно `final`, проще unit testing.

## Field injection — минусы

Dependencies скрыты, нельзя сделать final, object трудно создать без Spring/reflection, хуже тестируемость.

## ApplicationContext vs BeanFactory

BeanFactory — базовый container contract. ApplicationContext расширяет его events, i18n, resource loading и enterprise features; в приложениях обычно используют ApplicationContext.

## Bean

Object, lifecycle которого управляет Spring container.

## Singleton scope

Один bean instance на конкретный ApplicationContext/bean definition, не обязательно один object на всю JVM.

## Prototype

Container создаёт новый instance при request/get. После создания Spring не управляет полным destroy lifecycle prototype bean как singleton.

## Request / Session scope

Bean lifecycle привязан к HTTP request/session.

## Bean lifecycle high level

Instantiate → inject dependencies → aware callbacks → BeanPostProcessors before init → init callbacks → BPP after init/proxy wrapping → ready → destroy callbacks.

## BeanPostProcessor

Extension point, который может менять/wrap bean instance до/после initialization. Основа многих framework mechanisms.

## @Component / @Service / @Repository

Все stereotypes. Repository дополнительно связан с exception translation. Service/component в основном дают semantic role.

## @Bean vs @Component

Component — classpath scanning. Bean — explicit factory method, особенно удобно для third-party class/configurable construction.

## @Primary vs @Qualifier

Primary — default candidate. Qualifier — explicit selection.

## Circular dependency

Constructor cycle обычно невозможно/нежелательно создавать. Часто сигнал, что responsibilities нужно разделить.

## @Lazy

Может отложить creation или дать proxy, но не должен маскировать плохую архитектуру.

## Profiles

Позволяют conditional beans/config по environment profile. Лучше не превращать приложение в десятки ветвящихся production/test profiles без контроля.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Spring Core: IoC, DI и Bean lifecycle»](/materials/spring-core)
## Углубление для собеседования

### Что такое IoC на практическом языке?

Код больше не решает сам, когда и как создавать большинство инфраструктурных объектов. Контейнер строит object graph, управляет lifecycle и передаёт готовые dependencies приложению.

### DI — это только @Autowired?

Нет. DI — принцип передачи зависимостей извне. Spring может внедрять через constructor, setter, field; preferred default для обязательных dependency — constructor injection.

### Почему constructor injection лучше field injection?

Зависимости видны в API класса, их можно сделать `final`, объект легко создать в unit test без Spring, а невозможное состояние «объект создан, но dependency ещё null» уменьшается.

### Что происходит при старте ApplicationContext?

Упрощённо: читаются bean definitions → регистрируются post-processors → создаются non-lazy singleton beans → выполняется dependency injection → lifecycle callbacks → BeanPostProcessor может обернуть bean в proxy → context становится готов.

### BeanPostProcessor зачем нужен?

Это extension point над уже созданным bean. Через него Spring может проверять/менять/wrap instance до и после initialization. Автопроксирование для AOP/transactions строится вокруг подобных инфраструктурных механизмов.

### BeanFactoryPostProcessor и BeanPostProcessor — разница?

BeanFactoryPostProcessor работает с **definitions/config metadata до создания обычных beans**. BeanPostProcessor работает уже с **instances** в процессе их lifecycle.

### Singleton в Spring thread-safe?

Нет. Singleton scope означает один instance в ApplicationContext, но не делает его состояние потокобезопасным. Поэтому service beans обычно stateless или сами корректно синхронизируют mutable shared state.

### Как prototype попадает в singleton и почему это ловушка?

Обычная constructor injection выполняется один раз при создании singleton, значит он получит один prototype instance. Если нужен новый экземпляр при каждом обращении, используют `ObjectProvider`, scoped proxy или `@Lookup`.

### Что такое circular dependency и почему лучше рефакторить?

A зависит от B, B зависит от A. Даже если некоторые формы cycle можно технически разрешить, constructor cycle показывает, что boundaries responsibilities перепутаны. Лучше выделить третью ответственность или изменить направление зависимости.
