# Spring Boot, MVC, DispatcherServlet

::: tip Приоритет
🟡 **Частый практический блок.**
:::

## Spring vs Spring Boot

Boot упрощает конфигурацию Spring: starters, auto-configuration, embedded server, conventions и production tooling.

## Starter

Dependency bundle для типичного сценария (`spring-boot-starter-web`, data-jpa и т.д.).

## Auto-configuration

Conditional configurations активируются по classpath, properties и existing beans.

## Почему auto-config «back off»?

Если пользователь сам объявил нужный bean/config, условие `@ConditionalOnMissingBean` может не создать default.

## @SpringBootApplication

Комбинация ключевых annotations: configuration + component scan + enable auto-configuration.

## DispatcherServlet

Front Controller Spring MVC: получает request, находит handler, вызывает controller через adapter, обрабатывает result/exception.

## HandlerMapping

Находит handler/controller method для request.

## HandlerAdapter

Знает, как конкретный handler вызвать.

## @Controller vs @RestController

RestController по default пишет return value в response body через message converters.

## HttpMessageConverter

Сериализует/deserializes body, например JSON через Jackson.

## Filter vs Interceptor

Filter — servlet layer до/после DispatcherServlet. Interceptor — Spring MVC вокруг handler execution.

## @ControllerAdvice

Глобальный cross-controller advice, часто exception mapping.

## @ExceptionHandler

Преобразует конкретные exceptions в HTTP response contract.

## @ConfigurationProperties vs @Value

ConfigurationProperties удобнее для structured typed config и validation; Value — для единичных значений.

## Actuator

Production endpoints/metrics/health/info. Нужно контролировать exposure/security.

## Profiles vs properties

Profiles включают наборы config/beans; properties лучше для параметров. Не стоит использовать profiles как замену нормальной конфигурационной модели.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Spring Boot, MVC, DispatcherServlet»](/materials/spring-boot-web)

## Углубление для собеседования

### Spring vs Spring Boot

Spring Framework даёт IoC, AOP, MVC, transactions и другие foundational modules. Spring Boot поверх этого упрощает configuration: starters, auto-configuration, embedded server, externalized config, actuator и production conventions.

### Как работает auto-configuration?

Boot подключает configuration classes условно: по наличию классов в classpath, beans, properties и другим `@Conditional...`. Если пользователь объявляет собственный bean, многие auto-configurations «отступают» через `@ConditionalOnMissingBean`.

### Starter — это framework magic?

Starter — удобная dependency aggregation с согласованными dependency versions через Boot dependency management. Он сам по себе не содержит всю runtime magic; auto-configuration classes создают beans при выполнении условий.

### DispatcherServlet pipeline

HTTP request попадает в servlet/filter chain, затем `DispatcherServlet` выбирает handler через HandlerMapping, вызывает его через HandlerAdapter, обрабатывает return value/exception и формирует response. В REST `HttpMessageConverter` сериализует/десериализует body.

### @Controller vs @RestController

`@RestController` = `@Controller` + `@ResponseBody` semantics для методов по умолчанию: возвращаемое значение пишется в response body, а не трактуется как view name.

### @RequestParam vs @PathVariable

PathVariable — часть URL path, обычно идентификатор ресурса (`/users/{id}`). RequestParam — query parameter (`/users?page=1`). Это не жёсткое правило бизнес-смысла, но стандартная REST-практика.

### @ControllerAdvice

Централизует exception handlers/binders/model advice для controllers. Для API удобно переводить domain/validation exceptions в единый error response и HTTP status.
