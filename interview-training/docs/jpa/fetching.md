# LAZY/EAGER, N+1, fetch join и EntityGraph

::: tip Приоритет
🔴 **Одна из самых важных Hibernate-тем.**
:::

## LAZY vs EAGER

LAZY откладывает загрузку association до обращения. EAGER требует загрузить association как часть результата fetch contract, но не гарантирует один SQL JOIN — provider может сделать дополнительные queries.

## Defaults у связей

По JPA defaults ToOne обычно EAGER, ToMany LAZY. Но полагаться на default без понимания query behavior опасно.

## Что такое N+1?

Один query получает N parents, затем обращение к association запускает по query на каждого parent: 1 + N.

## Почему N+1 опасен?

Не только CPU базы: основной ущерб — множество network round-trips, parsing/planning/execution overhead и рост load.

## Как обнаружить?

SQL logs, query counters в tests, APM/tracing, Hibernate statistics.

## Решения

- fetch join;
- EntityGraph;
- batch fetching;
- DTO/projection query;
- отдельный bulk query.

## Почему «поставить всё EAGER» — плохое решение?

Может грузить огромные graphs даже там, где они не нужны, создавать дополнительные queries и cartesian multiplication.

## Fetch join

JPQL/HQL join fetch загружает association в текущем query.

## Почему fetch join нескольких collections опасен?

Multiplication rows и возможные ограничения Hibernate (например multiple bags). Даже если ORM deduplicate parents, SQL result может взорваться.

## Pagination + collection fetch join

Rows размножаются на children, поэтому LIMIT/OFFSET плохо соответствует parent entities. Часто нужен двухшаговый query: IDs page → fetch graph.

## EntityGraph

Позволяет задавать fetch plan для конкретного use case без глобального изменения annotations.

## LazyInitializationException

Обращение к lazy association после закрытия session/context.

## OSIV — почему спорно?

Open Session in View позволяет lazy loading во view/controller, но скрывает DB calls вне service transaction, упрощает появление N+1 и усложняет контроль transaction boundaries.

## DTO projection

Получить только нужные columns прямо query-ем. Хорошо для read use cases и API responses, когда полный entity graph не нужен.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «LAZY/EAGER, N+1, fetch join и EntityGraph»](/materials/jpa-fetching)
## Углубление для собеседования

### Что такое проблема N+1?

Сначала выполняется 1 запрос за списком родительских сущностей, затем по мере доступа к relation выполняется ещё N запросов — по одному на каждый объект. Отдельные запросы могут быть быстрыми, но суммарное число round trips резко ухудшает latency.

### Как обнаружить N+1?

Включить SQL logging/metrics и смотреть **количество запросов**, а не только slow query log. Полезны integration tests с контролем query count и APM traces.

### Как решать N+1?

В зависимости от use case: `JOIN FETCH`, `EntityGraph`, batch fetching, projection/DTO query. Универсального «везде EAGER» нет — он часто создаёт новые проблемы.

### Почему EAGER не является лечением N+1?

EAGER определяет требование загрузить association, но конкретный SQL plan может всё равно породить дополнительные запросы. Кроме того, глобальный EAGER часто вытаскивает лишний граф данных даже там, где relation не нужен.

### Какие проблемы у JOIN FETCH?

Join нескольких to-many коллекций может раздувать result set декартовым произведением. Пагинация по parent вместе с collection fetch join тоже сложна: SQL лимит применяется к строкам результата, а не логическим parent entities.

### LAZY и LazyInitializationException

LAZY relation обычно представлена proxy/collection wrapper. Если обратиться к ней после закрытия Persistence Context, Hibernate не сможет догрузить данные и бросит `LazyInitializationException`.

### Open Session In View — решение?

Он может скрывать LazyInitializationException, оставляя session открытой до web layer, но размывает transaction/data-access boundary и может приводить к незаметным запросам при сериализации. Для API чаще лучше явно загружать нужный граф в service/repository layer.
