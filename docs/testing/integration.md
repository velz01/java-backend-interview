# Spring integration tests и Testcontainers

::: tip Приоритет
🟡 **Полезно для современного backend.**
:::

## @SpringBootTest

Поднимает большой/full Spring context. Это integration/component test, а не unit.

## Slice tests

`@WebMvcTest`, `@DataJpaTest` и др. поднимают ограниченный slice context для конкретного layer.

## MockMvc

Тестирует Spring MVC request handling без полноценного external HTTP server в typical setup.

## Testcontainers

Запускает реальные PostgreSQL/Kafka/Redis containers для tests.

## Почему H2 не всегда заменяет PostgreSQL?

Отличаются SQL dialect, JSONB, locking, indexes, optimizer, functions. Test может проходить на H2 и падать на real PostgreSQL.

## Что тестировать у Repository?

Custom queries, mappings, constraints, locking/transaction behavior. Нет смысла доказывать, что Spring Data `save()` вообще умеет save без собственной логики.

## DynamicPropertySource

Удобен, чтобы передать Spring connection properties из динамического container.

## Reuse containers?

В локальной разработке может ускорять tests, но CI isolation и reproducibility важнее. Выбор зависит от setup.

## Kafka integration test

Publish record → дождаться observable side effect → проверить DB/state/idempotency/retry. Не использовать fixed sleep, лучше Awaitility/polling с timeout.

## Contract tests

Проверяют совместимость API/message contract между services без полного E2E всего мира.

## E2E test

Проверяет бизнес-flow через множество real components. Высокая confidence, но медленный и хрупкий; держать ограниченное число критичных scenarios.

## Test data isolation

Каждый test должен контролировать свои data и cleanup/transaction rollback, чтобы порядок запуска не влиял на result.

---

## Дополнительные материалы

[Статьи, видео и схемы по теме «Spring integration tests и Testcontainers»](/materials/testing-integration)
